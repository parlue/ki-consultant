import copy
import json
from pathlib import Path
import sys
import tempfile
import threading
import unittest
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, build_opener, ProxyHandler
from http.server import ThreadingHTTPServer

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import news_models as models
import news_settings as admin


class ModelTests(unittest.TestCase):
    def config(self, provider='deepseek'):
        value = models.load_settings()
        value['provider'] = provider
        if provider == 'ollama':
            value['models']['ollama'] = 'installed-model:8b'
            value['max_candidates'], value['chars_per_article'] = 12, 1800
        return value

    def test_configuration_rejects_secrets_and_no_sources(self):
        sources = json.loads(models.SOURCES_PATH.read_text(encoding='utf-8'))
        value = self.config()
        value['api_key'] = 'do-not-store'
        with self.assertRaises(ValueError):
            models.validate_settings(value, sources)
        value = self.config(); value['enabled_sources'] = []
        with self.assertRaises(ValueError):
            models.validate_settings(value, sources)

    def test_selected_source_names_validated(self):
        sources = json.loads(models.SOURCES_PATH.read_text(encoding='utf-8'))
        value = self.config(); value['enabled_sources'] = ['DeepSeek']
        self.assertEqual(models.validate_settings(value, sources)['enabled_sources'], ['DeepSeek'])
        value['enabled_sources'] = ['Unknown']
        with self.assertRaises(ValueError):
            models.validate_settings(value, sources)

    def test_credentials_only_selected_provider(self):
        self.assertEqual(models.credentials(self.config('claude'), {'ANTHROPIC_API_KEY': 'example'}), 'example')
        self.assertIsNone(models.credentials(self.config('ollama'), {}))
        with self.assertRaises(RuntimeError):
            models.credentials(self.config('deepseek'), {'OPENAI_API_KEY': 'example'})
        with self.assertRaises(RuntimeError):
            models.credentials(self.config('ollama'), {'GITHUB_ACTIONS': 'true'})

    def test_ollama_restricts_host_cloud_and_prompt_size(self):
        for url in ['http://remote.example:11434', 'http://user:secret@localhost:11434', 'http://localhost:11434/redirect', 'http://localhost:11434?x=1']:
            with self.assertRaises(ValueError):
                models.ollama_base(url)
        sources = json.loads(models.SOURCES_PATH.read_text(encoding='utf-8'))
        value = self.config('ollama'); value['models']['ollama'] = 'cloud-model'
        with self.assertRaises(ValueError):
            models.validate_settings(value, sources)
        value = self.config('ollama'); value['max_candidates'] = 100
        with self.assertRaises(ValueError):
            models.validate_settings(value, sources)

    @patch.dict('os.environ', {'DEEPSEEK_API_KEY': 'example'}, clear=True)
    def test_deepseek_json_and_disabled_thinking(self):
        answer = {'choices': [{'finish_reason': 'stop', 'message': {'content': '{"title":"News","stories":[]}'}}]}
        with patch.object(models, 'request_json', return_value=answer) as request:
            self.assertEqual(models.generate([], self.config(), 'editor', {})['stories'], [])
        url, body = request.call_args.args
        self.assertEqual(url, 'https://api.deepseek.com/chat/completions')
        self.assertEqual(body['thinking'], {'type': 'disabled'})
        self.assertEqual(body['response_format'], {'type': 'json_object'})

    @patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'example'}, clear=True)
    def test_claude_auth_and_structured_output(self):
        answer = {'stop_reason': 'end_turn', 'content': [{'type': 'text', 'text': '{"title":"News","stories":[]}'}]}
        with patch.object(models, 'request_json', return_value=answer) as request:
            models.generate([], self.config('claude'), 'editor', {'type': 'object'})
        url, body = request.call_args.args
        self.assertEqual(url, 'https://api.anthropic.com/v1/messages')
        self.assertEqual(body['output_config']['format']['type'], 'json_schema')
        self.assertEqual(request.call_args.kwargs['extra_headers']['x-api-key'], 'example')
        self.assertNotIn('key', request.call_args.kwargs)

    @patch.dict('os.environ', {'OPENAI_API_KEY': 'example'}, clear=True)
    def test_openai_response_format(self):
        answer = {'status': 'completed', 'output': [{'content': [{'type': 'output_text', 'text': '{"title":"News","stories":[]}'}]}]}
        with patch.object(models, 'request_json', return_value=answer) as request:
            models.generate([], self.config('openai'), 'editor', {})
        self.assertEqual(request.call_args.args[1]['text']['format']['type'], 'json_schema')

    @patch.dict('os.environ', {}, clear=True)
    def test_ollama_only_installed_model_no_auth(self):
        config = self.config('ollama')
        answer = {'done': True, 'done_reason': 'stop', 'message': {'content': '{"title":"News","stories":[]}'}}
        with patch.object(models, 'list_models', return_value=['installed-model:8b']), patch.object(models, 'request_json', return_value=answer) as request:
            models.generate([], config, 'editor', {'type': 'object'})
        self.assertEqual(request.call_args.args[0], 'http://127.0.0.1:11434/api/chat')
        self.assertEqual(request.call_args.args[1]['format'], {'type': 'object'})
        self.assertNotIn('key', request.call_args.kwargs)
        with patch.object(models, 'list_models', return_value=[]), patch.object(models, 'request_json') as request:
            with self.assertRaises(RuntimeError):
                models.generate([], config, 'editor', {})
            request.assert_not_called()

    @patch.dict('os.environ', {'DEEPSEEK_API_KEY': 'example'}, clear=True)
    def test_truncated_and_invalid_json_rejected(self):
        for answer in [{'choices': [{'finish_reason': 'length'}]}, {'choices': [{'finish_reason': 'stop', 'message': {'content': 'not json'}}]}]:
            with patch.object(models, 'request_json', return_value=answer):
                with self.assertRaises(RuntimeError):
                    models.generate([], self.config(), 'editor', {})

    @patch.dict('os.environ', {}, clear=True)
    def test_ollama_model_list_excludes_cloud(self):
        data = {'models': [{'name': 'local:8b'}, {'name': 'remote:cloud'}, {'name': 'remote', 'remote_host': 'https://example.com'}]}
        with patch.object(models, 'request_json', return_value=data):
            self.assertEqual(models.list_models(self.config('ollama')), ['local:8b'])

    def test_local_editor_saves_and_blocks_untrusted_posts(self):
        original = self.config()
        with tempfile.TemporaryDirectory(dir=models.ROOT) as tmp:
            path = Path(tmp) / 'settings.json'
            path.write_text(json.dumps(original), encoding='utf-8')
            with patch.object(models, 'SETTINGS_PATH', path):
                server = ThreadingHTTPServer(('127.0.0.1', 0), admin.Handler)
                thread = threading.Thread(target=server.serve_forever, daemon=True); thread.start()
                base = f'http://127.0.0.1:{server.server_port}'
                opener = build_opener(ProxyHandler({}))
                try:
                    changed = copy.deepcopy(original); changed['provider'] = 'claude'; changed['enabled_sources'] = ['DeepSeek']
                    request = Request(base + '/api/save', data=json.dumps(changed).encode(), headers={'Content-Type': 'application/json'})
                    with self.assertRaises(HTTPError) as error:
                        opener.open(request)
                    self.assertEqual(error.exception.code, 403)
                    request.add_header('X-News-Token', admin.TOKEN)
                    with opener.open(request) as response:
                        self.assertEqual(response.status, 200)
                    self.assertEqual(json.loads(path.read_text())['provider'], 'claude')
                    self.assertEqual(json.loads(path.read_text())['enabled_sources'], ['DeepSeek'])
                    with opener.open(base + '/') as response:
                        page = response.read().decode()
                    self.assertIn('Claude / Anthropic', page)
                    self.assertNotIn('__TOKEN__', page)
                finally:
                    server.shutdown(); server.server_close(); thread.join(timeout=3)


if __name__ == '__main__':
    unittest.main()
