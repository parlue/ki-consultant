import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('update_news_sitemap', ROOT / 'scripts/update_news_sitemap.py')
sitemap = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sitemap)


class SitemapTests(unittest.TestCase):
    def test_updates_only_news_and_is_idempotent(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            directory = Path(tmp)
            path = directory / 'sitemap.xml'
            original = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://sommerfeld.consulting/</loc><lastmod>2026-09-01</lastmod></url><url><loc>https://sommerfeld.consulting/ki-news/</loc><lastmod>2026-10-21</lastmod></url></urlset>'
            path.write_text(original, encoding='utf-8')
            (directory / 'archive.json').write_text('[{"date":"2026-10-22"}]')
            (directory / '2026-10-22.json').write_text(json.dumps({'generated_at': '2026-10-22T04:20:00Z'}))
            self.assertTrue(sitemap.update(path, directory))
            self.assertEqual(path.read_text(encoding='utf-8'), original.replace('<lastmod>2026-10-21</lastmod>', '<lastmod>2026-10-22T04:20:00Z</lastmod>'))
            self.assertFalse(sitemap.update(path, directory))
            before = path.read_bytes()
            (directory / '2026-10-22.json').write_text(json.dumps({'generated_at': '2026-10-20T04:20:00Z'}))
            self.assertFalse(sitemap.update(path, directory))
            self.assertEqual(path.read_bytes(), before)

    def test_no_edition_does_not_touch_sitemap(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            directory = Path(tmp)
            (directory / 'archive.json').write_text('[]')
            self.assertFalse(sitemap.update(directory / 'missing.xml', directory))


if __name__ == '__main__':
    unittest.main()
