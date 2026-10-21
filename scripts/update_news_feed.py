"""Build the RSS 2.0 feed (ki-news/feed.xml) from the published daily editions."""
from datetime import datetime, timezone
from email.utils import format_datetime
import json
from pathlib import Path
import re
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://sommerfeld.consulting/ki-news/'
MAX_EDITIONS = 30


def rfc822(value):
    parsed = datetime.fromisoformat(value.replace('Z', '+00:00'))
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return format_datetime(parsed.astimezone(timezone.utc))


def body(edition):
    parts = []
    for story in edition['stories']:
        links = ', '.join(
            '<a href="%s">%s</a>' % (escape(s['url'], {'"': '&quot;'}), escape(s['name']))
            for s in story.get('sources', [])
        )
        parts.append('<p><strong>%s</strong><br>%s<br><small>%s · Quelle: %s</small></p>' % (
            escape(story['title']), escape(story['summary']), escape(story.get('category', '')), links))
    return ''.join(parts)


def build(data=ROOT / 'ki-news/data'):
    archive = json.loads((data / 'archive.json').read_text(encoding='utf-8'))
    dates = sorted((a['date'] for a in archive), reverse=True)[:MAX_EDITIONS]
    items, newest = [], None
    for date in dates:
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', date):
            raise ValueError('Invalid edition date')
        edition = json.loads((data / (date + '.json')).read_text(encoding='utf-8'))
        link = BASE + '?ausgabe=' + date
        newest = newest or edition['generated_at']
        items.append(
            '<item><title>%s</title><link>%s</link><guid isPermaLink="true">%s</guid>'
            '<pubDate>%s</pubDate><description>%s</description></item>' % (
                escape(edition['title']), link, link, rfc822(edition['generated_at']),
                escape(body(edition))))
    channel = (
        '<title>KI News und Trends | Dirk Sommerfeld</title><link>%s</link>'
        '<description>Tägliches KI-Briefing auf Deutsch: kurze Zusammenfassungen und Links zu den Originalquellen.</description>'
        '<language>de-DE</language><atom:link href="%sfeed.xml" rel="self" type="application/rss+xml"/>' % (BASE, BASE))
    if newest:
        channel += '<lastBuildDate>%s</lastBuildDate>' % rfc822(newest)
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>%s%s</channel></rss>\n'
            % (channel, ''.join(items)))


def update(feed=ROOT / 'ki-news/feed.xml', data=ROOT / 'ki-news/data'):
    import xml.etree.ElementTree as ET
    content = build(data)
    ET.fromstring(content)
    if feed.exists() and feed.read_text(encoding='utf-8') == content:
        return False
    feed.write_text(content, encoding='utf-8', newline='\n')
    return True


if __name__ == '__main__':
    print('News-Feed aktualisiert.' if update() else 'News-Feed unverändert.')
