import importlib.util
from datetime import date
import json
from pathlib import Path
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
spec = importlib.util.spec_from_file_location('weekly_news', ROOT / 'scripts/weekly_news.py')
weekly = importlib.util.module_from_spec(spec)
spec.loader.exec_module(weekly)


def story(n, sources=1, category='Modelle', title=None):
    return {'id': f'news-{n}', 'title': title or f'Meldung {n}', 'summary': f'Text {n}', 'category': category, 'providers': ['X'],
            'sources': [{'url': f'https://example.com/{n}/{i}', 'name': f'Q{i}', 'type': 'Hersteller', 'published_at': '2026-10-21T00:00:00Z', 'precision': 'date'} for i in range(sources)]}


def write_edition(directory, day, stories):
    (directory / f'{day}.json').write_text(json.dumps({'date': day, 'title': 't', 'stories': stories}), encoding='utf-8')


class WeeklyTests(unittest.TestCase):
    def test_week_id_and_span(self):
        self.assertEqual(weekly.week_id(date(2026, 10, 23)), ('2026-W43', 2026, 43))
        self.assertEqual(weekly.german_span(date(2026, 10, 16), date(2026, 10, 22)), '16.–22. Oktober 2026')
        self.assertEqual(weekly.german_span(date(2026, 10, 30), date(2026, 11, 5)), '30. Oktober – 5. November 2026')

    def test_fallback_prefers_more_sources(self):
        stories = [dict(story(1, 1), day='2026-10-20'), dict(story(2, 3), day='2026-10-21'), dict(story(3, 2), day='2026-10-21')]
        self.assertEqual([s['id'] for s in weekly.select(stories, generate=lambda p: (_ for _ in ()).throw(RuntimeError('x')))], ['news-2', 'news-3', 'news-1'])

    def test_model_ids_validated_and_filled(self):
        stories = [dict(story(n, 1), day='2026-10-21') for n in range(1, 8)]
        picks = weekly.select(stories, generate=lambda p: {'ids': ['news-6', 'unbekannt', 'news-6', 'news-2']})
        ids = [s['id'] for s in picks]
        self.assertEqual(ids[:2], ['news-6', 'news-2'])
        self.assertEqual(len(ids), 5)
        self.assertEqual(len(set(ids)), 5)

    def test_only_friday_unless_forced_and_no_rerun(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            data, out = Path(tmp) / 'data', Path(tmp) / 'woche'
            data.mkdir()
            for n, day in enumerate(['2026-10-19', '2026-10-20', '2026-10-21']):
                write_edition(data, day, [story(n * 3 + 1), story(n * 3 + 2)])
            noop = lambda p: {'ids': []}
            self.assertIsNone(weekly.build(date(2026, 10, 22), data, out, generate=noop))  # Thursday
            self.assertIsNotNone(weekly.build(date(2026, 10, 23), data, out, generate=noop))  # Friday
            self.assertTrue((out / '2026-kw43' / 'index.html').exists())
            self.assertIn('Meldung', (out / '2026-kw43' / 'linkedin.txt').read_text(encoding='utf-8'))
            self.assertIsNone(weekly.build(date(2026, 10, 23), data, out, generate=noop))  # already exists

    def test_too_few_stories_publishes_nothing(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            data, out = Path(tmp) / 'data', Path(tmp) / 'woche'
            data.mkdir()
            write_edition(data, '2026-10-21', [story(1), story(2)])
            self.assertIsNone(weekly.build(date(2026, 10, 23), data, out, generate=lambda p: {'ids': []}))
            self.assertFalse(out.exists())

    def test_page_escapes_and_only_http_links(self):
        s = dict(story(1, title='<script>alert(1)</script>'), day='2026-10-21')
        s['sources'][0]['url'] = 'javascript:alert(1)'
        page = weekly.page_html(2026, 43, [s], date(2026, 10, 21), date(2026, 10, 21), False)
        self.assertNotIn('<script>alert', page)
        self.assertIn('&lt;script&gt;', page)
        self.assertNotIn('javascript:', page)

    def test_sitemap_entries_idempotent(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            path = Path(tmp) / 'sitemap.xml'
            path.write_text('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>\n', encoding='utf-8')
            for _ in range(2):
                weekly.add_sitemap(path, ['https://sommerfeld.consulting/ki-news/woche/'], '2026-10-23')
            self.assertEqual(path.read_text(encoding='utf-8').count('<loc>'), 1)


if __name__ == '__main__':
    unittest.main()
