"""Non-secret news settings and model adapters. No paid calls on import."""
from __future__ import annotations
import json
import os
from pathlib import Path
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, build_opener, ProxyHandler, HTTPRedirectHandler

ROOT = Path(__file__).resolve().parents[1]
SETTINGS_PATH = ROOT / 'ki-news/settings.json'
SOURCES_PATH = ROOT / 'ki-news/sources.json'
PROVIDERS = ('deepseek', 'openai', 'claude', 'ollama')
KEYS = {'deepseek': 'DEEPSEEK_API_KEY', 'openai': 'OPENAI_API_KEY', 'claude': 'ANTHROPIC_API_KEY'}


def ollama_base(value):
    parts = urlsplit(value)
    if parts.scheme != 'http' or parts.hostname not in ('localhost', '127.0.0.1', '::1') or parts.username or parts.password or parts.path not in ('', '/') or parts.query or parts.fragment:
        raise ValueError('Ollama muss über eine lokale HTTP-Adresse erreichbar sein, z. B. http://127.0.0.1:11434.')
    if not parts.port:
        raise ValueError('Ollama-Port fehlt.')
    return value.rstrip('/')


def validate_settings(value, sources):
    expected = {'provider', 'models', 'ollama_url', 'max_candidates', 'chars_per_article', 'enabled_sources'}
    if not isinstance(value, dict) or set(value) != expected:
        raise ValueError('Ungültige Einstellungen. API-Schlüssel gehören nicht in die Konfiguration.')
    if value['provider'] not in PROVIDERS or not isinstance(value['models'], dict) or set(value['models']) != set(PROVIDERS):
        raise ValueError('Unbekannter Anbieter oder ungültige Modellliste.')
    for provider, model in value['models'].items():
        if not isinstance(model, str) or len(model) > 200 or any(c.isspace() for c in model):
            raise ValueError('Modellnamen dürfen keine Leerzeichen enthalten.')
        if provider == value['provider'] and not model:
            raise ValueError('Bitte ein Modell für den gewählten Anbieter auswählen.')
        if provider == 'ollama' and ('cloud' in model.lower() or '/' in model):
            raise ValueError('Für Ollama bitte einen lokal installierten Modellnamen ohne Cloud-Zusatz verwenden.')
    ollama_base(value['ollama_url'])
    for key, low, high in [('max_candidates', 1, 100), ('chars_per_article', 200, 10000)]:
        if type(value[key]) is not int or not low <= value[key] <= high:
            raise ValueError(f'{key}: erlaubt sind {low} bis {high}.')
    if value['provider'] == 'ollama' and value['max_candidates'] * value['chars_per_article'] > 30000:
        raise ValueError('Für Ollama den Eingabetext begrenzen: Kandidaten × Zeichen je Beitrag darf höchstens 30000 sein.')
    selected = value['enabled_sources']
    known = {s['name'] for s in sources}
    if not isinstance(selected, list) or not selected or not all(isinstance(s, str) and s in known for s in selected) or len(selected) != len(set(selected)):
        raise ValueError('Mindestens eine gültige Nachrichtenquelle auswählen; keine doppelten Quellen.')
    return value


def load_settings(path=SETTINGS_PATH):
    sources = json.loads(SOURCES_PATH.read_text(encoding='utf-8'))
    return validate_settings(json.loads(Path(path).read_text(encoding='utf-8')), sources)


def credentials(settings, env=None):
    env = os.environ if env is None else env
    provider = settings['provider']
    if provider == 'ollama':
        if env.get('GITHUB_ACTIONS') == 'true':
            raise RuntimeError('Lokales Ollama ist vom GitHub-Runner nicht erreichbar. Den Lauf auf dem Ollama-Rechner starten und die Ausgabe anschließend zu GitHub übertragen.')
        return None
    key = env.get(KEYS[provider], '').strip()
    if not key:
        raise RuntimeError(f'{KEYS[provider]} fehlt. Lokal als Umgebungsvariable oder für GitHub Actions als Repository-Secret hinterlegen.')
    return key


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        raise RuntimeError('Unerwartete Weiterleitung des Modell-Endpunkts.')


def request_json(url, payload=None, key=None, timeout=180, extra_headers=None):
    local = urlsplit(url).hostname in ('localhost', '127.0.0.1', '::1')
    opener = build_opener(ProxyHandler({}), NoRedirect()) if local else build_opener(NoRedirect())
    headers = {'Content-Type': 'application/json'}
    headers.update(extra_headers or {})
    if key:
        headers['Authorization'] = 'Bearer ' + key
    for attempt in range(3):
        try:
            request = Request(url, data=json.dumps(payload).encode() if payload is not None else None, headers=headers)
            with opener.open(request, timeout=timeout) as response:
                raw = response.read(4_000_001)
                if len(raw) > 4_000_000:
                    raise RuntimeError('Modellantwort zu groß.')
                return json.loads(raw)
        except HTTPError as error:
            if error.code not in (429, 500, 502, 503, 504) or attempt == 2:
                raise RuntimeError(f'Modell-Endpunkt meldet HTTP {error.code}. API-Schlüssel und Modell prüfen.') from None
            time.sleep(3 * (attempt + 1))
        except (URLError, TimeoutError):
            raise RuntimeError('Modell-Endpunkt nicht erreichbar. Dienst, Adresse und Verbindung prüfen.') from None


def list_models(settings):
    provider = settings['provider']
    key = credentials(settings)
    if provider == 'ollama':
        data = request_json(ollama_base(settings['ollama_url']) + '/api/tags', timeout=8)
        models = [m['name'] for m in data.get('models', []) if 'cloud' not in m['name'].lower() and not m.get('remote_host') and not m.get('remote_model')]
    elif provider == 'claude':
        data = request_json('https://api.anthropic.com/v1/models?limit=100', extra_headers={'x-api-key': key, 'anthropic-version': '2023-06-01'}, timeout=12)
        models = [m['id'] for m in data.get('data', [])]
    else:
        base = 'https://api.deepseek.com' if provider == 'deepseek' else 'https://api.openai.com/v1'
        data = request_json(base + '/models', key=key, timeout=12)
        models = [m['id'] for m in data.get('data', [])]
    return sorted(set(models))


def generate(candidates, settings, editor, schema):
    provider = settings['provider']
    model = settings['models'][provider]
    key = credentials(settings)
    prompt = editor + '\nAntworte nur als JSON nach diesem Schema: ' + json.dumps(schema, ensure_ascii=False)
    content = json.dumps(candidates, ensure_ascii=False)
    messages = [{'role': 'system', 'content': prompt}, {'role': 'user', 'content': content}]
    if provider == 'deepseek':
        result = request_json('https://api.deepseek.com/chat/completions', {
            'model': model, 'messages': messages, 'response_format': {'type': 'json_object'},
            'thinking': {'type': 'disabled'}, 'max_tokens': 8000, 'stream': False}, key=key)
        choices = result.get('choices', [])
        if not choices or choices[0].get('finish_reason') != 'stop':
            raise RuntimeError('DeepSeek-Antwort unvollständig; nichts veröffentlicht.')
        text = choices[0].get('message', {}).get('content', '')
    elif provider == 'claude':
        result = request_json('https://api.anthropic.com/v1/messages', {
            'model': model, 'max_tokens': 8000, 'system': editor, 'messages': [{'role': 'user', 'content': content}],
            'output_config': {'format': {'type': 'json_schema', 'schema': schema}}},
            extra_headers={'x-api-key': key, 'anthropic-version': '2023-06-01'})
        if result.get('stop_reason') != 'end_turn':
            raise RuntimeError('Claude-Antwort unvollständig; nichts veröffentlicht.')
        text = ''.join(c.get('text', '') for c in result.get('content', []) if c.get('type') == 'text')
    elif provider == 'ollama':
        # Only installed local models: no automatic pull or cloud fallback.
        if model not in list_models(settings):
            raise RuntimeError('Ollama-Modell nicht lokal installiert. In den Einstellungen ein installiertes Modell auswählen.')
        result = request_json(ollama_base(settings['ollama_url']) + '/api/chat', {
            'model': model, 'messages': messages, 'format': schema, 'stream': False,
            'options': {'temperature': 0, 'num_ctx': 32768, 'num_predict': 8000}}, timeout=600)
        if not result.get('done') or result.get('done_reason') != 'stop':
            raise RuntimeError('Ollama-Antwort unvollständig; nichts veröffentlicht.')
        text = result.get('message', {}).get('content', '')
    else:
        result = request_json('https://api.openai.com/v1/responses', {
            'model': model, 'store': False, 'instructions': editor, 'input': content, 'max_output_tokens': 8000,
            'text': {'format': {'type': 'json_schema', 'name': 'daily_briefing', 'strict': True, 'schema': schema}}}, key=key)
        if result.get('status') != 'completed':
            raise RuntimeError('OpenAI-Antwort unvollständig; nichts veröffentlicht.')
        text = ''.join(c.get('text', '') for o in result.get('output', []) for c in o.get('content', []) if c.get('type') == 'output_text')
    if not isinstance(text, str) or not text.strip():
        raise RuntimeError('Leere Modellantwort; nichts veröffentlicht.')
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        raise RuntimeError('Modellantwort ist kein gültiges JSON; nichts veröffentlicht.') from None
