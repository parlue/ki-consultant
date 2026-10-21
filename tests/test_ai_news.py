import copy
from datetime import datetime, timedelta, timezone
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('ai_news', Path(__file__).resolve().parents[1] / 'scripts/ai_news.py')
news = importlib.util.module_from_spec(spec)
spec.loader.exec_module(news)
UTC = timezone.utc
END = datetime(2026, 10, 21, 4, 17, tzinfo=UTC)
START = END - timedelta(hours=24)
SOURCE = {'name': 'Example', 'type': 'Hersteller', 'kind': 'feed', 'url': 'https://example.com/feed'}


class NewsTests(unittest.TestCase):
    def candidate(self):
        return news.make_item(SOURCE, 'https://example.com/new?utm_source=test', 'New model', END - timedelta(hours=1), 'Some facts', 'time')

    def result(self, item):
        return {'title': 'Heute im KI-Briefing', 'stories': [{'title': 'Neues Modell', 'summary': 'Ein Modell wurde vorgestellt.', 'relevance': 'Für Anwender relevant.', 'caveat': 'Angaben des Herstellers.', 'category': 'Modelle', 'providers': ['Example'], 'source_ids': [item['id']]}]}

    def test_rss_filters_old_future_and_undated(self):
        raw = '''<rss><channel>
        <item><title>New</title><link>https://example.com/new</link><pubDate>Wed, 21 Oct 2026 03:17:00 GMT</pubDate><description><![CDATA[<p>Facts</p>]]></description></item>
        <item><title>Old</title><link>https://example.com/old</link><pubDate>Mon, 19 Oct 2026 03:00:00 GMT</pubDate></item>
        <item><title>Future</title><link>https://example.com/future</link><pubDate>Thu, 22 Oct 2026 03:00:00 GMT</pubDate></item>
        <item><title>Unknown</title><link>https://example.com/unknown</link></item>
        </channel></rss>'''
        entries = news.parse_feed(raw, SOURCE, START, END)
        self.assertEqual(len(entries), 1)
        self.assertEqual(entries[0]['text'], 'Facts')

    def test_atom_and_timezone(self):
        raw = '''<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>New</title><link href="https://example.com/new"/><published>2026-10-21T05:17:00+02:00</published><summary>Facts</summary></entry></feed>'''
        self.assertEqual(news.parse_feed(raw, SOURCE, START, END)[0]['published_at'], '2026-10-21T03:17:00Z')

    def test_date_only_intersects_window_but_not_future(self):
        self.assertTrue(news.in_window(*news.parse_date('2026-10-20'), START, END))
        self.assertFalse(news.in_window(*news.parse_date('2026-10-19'), START, END))
        self.assertFalse(news.in_window(*news.parse_date('2026-10-22'), START, END))
        self.assertEqual(news.parse_date('2026-10-21T03:00:00')[1], 'date')
        self.assertIsNone(news.parse_date('yesterday'))

    def test_page_publication_date_not_modified_date(self):
        raw = '<meta property="article:modified_time" content="2026-10-21"><script type="application/ld+json">{"datePublished":"2026-10-19"}</script>'
        date, precision = news.page_date(news.Page(raw), raw)
        self.assertEqual(date.day, 19)
        self.assertEqual(precision, 'date')

    def test_canonical_and_seen_urls(self):
        item = self.candidate()
        self.assertEqual(item['url'], 'https://example.com/new')
        self.assertEqual(news.prepare_candidates([item, item], set()), [item])
        self.assertEqual(news.prepare_candidates([item], {item['url']}), [])
        with self.assertRaises(ValueError):
            news.canonical('javascript:alert(1)')

    def test_no_invented_citations(self):
        item = self.candidate()
        result = self.result(item)
        checked = news.validate(result, [item])
        self.assertEqual(checked['stories'][0]['sources'][0]['url'], item['url'])
        result['stories'][0]['source_ids'] = ['invented']
        with self.assertRaises(ValueError):
            news.validate(result, [item])

    def test_reject_duplicate_and_empty_references(self):
        item = self.candidate()
        result = self.result(item)
        result['stories'].append(copy.deepcopy(result['stories'][0]))
        with self.assertRaises(ValueError):
            news.validate(result, [item])
        result['stories'] = [result['stories'][0]]
        result['stories'][0]['source_ids'] = []
        with self.assertRaises(ValueError):
            news.validate(result, [item])

    def test_source_failure_is_explicit(self):
        with patch.object(news, 'download', side_effect=TimeoutError):
            entries, coverage = news.collect([SOURCE], START, END)
        self.assertEqual(entries, [])
        self.assertEqual(coverage[0]['status'], 'unavailable')

    def test_publish_persists_archive_and_prevents_overwrite(self):
        item = self.candidate()
        with tempfile.TemporaryDirectory(dir=Path(__file__).resolve().parents[1]) as tmp:
            directory = Path(tmp)
            edition = news.publish(news.validate(self.result(item), [item]), [], START, END, directory)
            self.assertEqual(edition['date'], '2026-10-21')
            archive = json.loads((directory / 'archive.json').read_text(encoding='utf-8'))
            self.assertEqual(archive[0]['count'], 1)
            before = (directory / '2026-10-21.json').read_bytes()
            with self.assertRaises(RuntimeError):
                news.publish({'title': 'Replace', 'stories': []}, [], START, END, directory)
            self.assertEqual(before, (directory / '2026-10-21.json').read_bytes())

    def test_html_not_a_feed(self):
        with self.assertRaises(ValueError):
            news.parse_feed('<html><body>blocked</body></html>', SOURCE, START, END)


if __name__ == '__main__':
    unittest.main()
