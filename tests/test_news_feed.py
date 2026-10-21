import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('update_news_feed', ROOT / 'scripts/update_news_feed.py')
feed = importlib.util.module_from_spec(spec)
spec.loader.exec_module(feed)


class FeedTests(unittest.TestCase):
    def test_feed_is_valid_escaped_and_idempotent(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            directory = Path(tmp)
            (directory / 'archive.json').write_text(json.dumps([{'date': '2026-10-22'}, {'date': '2026-10-21'}]))
            for date, title in (('2026-10-21', 'Alt & neu'), ('2026-10-22', 'Neu <b>')):
                (directory / (date + '.json')).write_text(json.dumps({
                    'title': title, 'date': date, 'generated_at': date + 'T04:20:00Z',
                    'stories': [{'title': 'A & B', 'summary': '<x>', 'category': 'Modelle',
                                 'sources': [{'url': 'https://example.com/?a=1&b=2', 'name': 'Quelle'}]}]}))
            path = directory / 'feed.xml'
            self.assertTrue(feed.update(path, directory))
            root = ET.fromstring(path.read_text(encoding='utf-8'))
            items = root.findall('./channel/item')
            self.assertEqual([i.findtext('title') for i in items], ['Neu <b>', 'Alt & neu'])
            self.assertEqual(items[0].findtext('link'), 'https://sommerfeld.consulting/ki-news/?ausgabe=2026-10-22')
            self.assertIn('A &amp; B', items[0].findtext('description'))
            self.assertFalse(feed.update(path, directory))


if __name__ == '__main__':
    unittest.main()
