"""Local settings editor. Binds only to loopback; does not run the news job."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import argparse
import json
import os
from pathlib import Path
import secrets
import threading
from urllib.parse import urlsplit
import news_models as models

TOKEN = secrets.token_urlsafe(32)
LOCK = threading.Lock()
PAGE = models.ROOT / 'scripts/settings.html'


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def send(self, value, status=200, html=False):
        raw = value.encode('utf-8') if html else json.dumps(value, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'text/html; charset=utf-8' if html else 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-" + TOKEN + "'; connect-src 'self'; frame-ancestors 'none'")
        self.send_header('Content-Length', str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def allowed(self):
        return self.headers.get('Host') == f'127.0.0.1:{self.server.server_port}'

    def do_GET(self):
        if not self.allowed():
            return self.send({'error': 'Ungültiger Host.'}, 403)
        if self.path == '/':
            return self.send(PAGE.read_text(encoding='utf-8').replace('__TOKEN__', TOKEN), html=True)
        if self.path == '/api/settings':
            config = models.load_settings()
            return self.send({'settings': config, 'sources': json.loads(models.SOURCES_PATH.read_text(encoding='utf-8')), 'keys_present': {p: bool(os.environ.get(k)) for p, k in models.KEYS.items()}, 'path': 'ki-news/settings.json'})
        self.send({'error': 'Nicht gefunden.'}, 404)

    def do_POST(self):
        try:
            length = int(self.headers.get('Content-Length', '0'))
        except ValueError:
            return self.send({'error': 'Ungültige Anfragegröße.'}, 400)
        if not 0 < length <= 32000:
            return self.send({'error': 'Ungültige Anfragegröße.'}, 400)
        # Consume bounded bodies before rejecting a request, avoiding TCP resets
        # on Windows when the peer is still transmitting its JSON payload.
        raw = self.rfile.read(length)
        if not self.allowed() or self.headers.get('X-News-Token') != TOKEN:
            return self.send({'error': 'Bitte die Einstellungsseite neu öffnen.'}, 403)
        if self.headers.get('Origin') not in (None, f'http://127.0.0.1:{self.server.server_port}'):
            return self.send({'error': 'Ungültiger Ursprung.'}, 403)
        try:
            if self.headers.get('Content-Type', '').split(';')[0] != 'application/json':
                raise ValueError('JSON erforderlich.')
            value = json.loads(raw)
            sources = json.loads(models.SOURCES_PATH.read_text(encoding='utf-8'))
            if self.path == '/api/save':
                config = models.validate_settings(value, sources)
                with LOCK:
                    path = models.SETTINGS_PATH
                    temp = path.with_suffix('.tmp')
                    temp.write_text(json.dumps(config, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
                    temp.replace(path)
                return self.send({'message': 'Lokal gespeichert. Der nächste lokale Lauf verwendet diese Auswahl. Für GitHub Actions die Datei ki-news/settings.json ins Repository übernehmen.'})
            if self.path == '/api/models':
                # Model discovery must work before a local model has been selected.
                config = dict(value)
                config['models'] = dict(value.get('models', {}))
                if config.get('provider') in models.PROVIDERS and not config['models'].get(config['provider']):
                    config['models'][config['provider']] = 'model-list-only'
                config = models.validate_settings(config, sources)
                return self.send({'models': models.list_models(config)})
            return self.send({'error': 'Nicht gefunden.'}, 404)
        except (ValueError, KeyError, TypeError) as error:
            return self.send({'error': str(error)}, 400)
        except RuntimeError as error:
            return self.send({'error': str(error)}, 400)
        except Exception:
            return self.send({'error': 'Einstellungen konnten nicht verarbeitet werden.'}, 500)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8766)
    args = parser.parse_args()
    server = ThreadingHTTPServer(('127.0.0.1', args.port), Handler)
    print(f'KI-News-Einstellungen: http://127.0.0.1:{server.server_port}/', flush=True)
    print('Nur auf diesem Rechner erreichbar. Beenden mit Strg+C.', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
