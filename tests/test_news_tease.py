import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('update_news_tease', ROOT / 'scripts/update_news_tease.py')
tease = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tease)


class TeaseTests(unittest.TestCase):
    def test_three_escaped_headlines_idempotent_and_rest_untouched(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            directory = Path(tmp)
            (directory / 'archive.json').write_text(json.dumps([{'date': '2026-10-22'}, {'date': '2026-10-21'}]))
            (directory / '2026-10-21.json').write_text(json.dumps({'stories': [{'title': 'Alt'}]}))
            (directory / '2026-10-22.json').write_text(json.dumps({'stories': [
                {'title': 'A & B'}, {'title': '<x>'}, {'title': 'C'}, {'title': 'D'}]}))
            page = directory / 'index.html'
            page.write_text('<p>vor</p><!-- NEWS-TEASE:START -->alt<!-- NEWS-TEASE:END --><p>nach</p>', encoding='utf-8')
            self.assertTrue(tease.update(page, directory))
            text = page.read_text(encoding='utf-8')
            self.assertTrue(text.startswith('<p>vor</p>') and text.endswith('<p>nach</p>'))
            self.assertIn('22.10.2026', text)
            self.assertIn('<li>A &amp; B</li><li>&lt;x&gt;</li><li>C</li>', text)
            self.assertNotIn('<li>D</li>', text)
            self.assertFalse(tease.update(page, directory))

    def test_missing_markers_fail(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            directory = Path(tmp)
            (directory / 'archive.json').write_text('[]')
            page = directory / 'index.html'
            page.write_text('<p>x</p>', encoding='utf-8')
            with self.assertRaises(ValueError):
                tease.update(page, directory)


if __name__ == '__main__':
    unittest.main()
