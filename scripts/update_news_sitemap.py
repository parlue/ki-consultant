"""Update only the news URL's lastmod from the latest published edition."""
from datetime import datetime, timezone
import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
NS = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
NEWS_URL = 'https://sommerfeld.consulting/ki-news/'


def timestamp(value):
    parsed = datetime.fromisoformat(value.replace('Z', '+00:00'))
    return parsed.replace(tzinfo=timezone.utc) if parsed.tzinfo is None else parsed


def update(sitemap=ROOT / 'sitemap.xml', data=ROOT / 'ki-news/data'):
    archive = json.loads((data / 'archive.json').read_text(encoding='utf-8'))
    if not archive:
        return False
    latest = max(archive, key=lambda item: item['date'])
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', latest['date']):
        raise ValueError('Invalid edition date')
    edition = json.loads((data / (latest['date'] + '.json')).read_text(encoding='utf-8'))
    modified = edition['generated_at']
    actual = timestamp(modified)
    original = sitemap.read_text(encoding='utf-8')
    root = ET.fromstring(original)
    nodes = [url for url in root.findall('s:url', NS) if url.findtext('s:loc', namespaces=NS) == NEWS_URL]
    if len(nodes) != 1:
        raise ValueError('Expected exactly one news sitemap entry')
    previous = nodes[0].findtext('s:lastmod', namespaces=NS)
    # Preserve a later manual content edit; a build alone never advances lastmod.
    if previous and timestamp(previous) >= actual:
        return False
    pattern = r'(<url\b[^>]*>)(?:(?!</url>).)*<loc>\s*' + re.escape(NEWS_URL) + r'\s*</loc>(?:(?!</url>).)*</url>'
    matches = list(re.finditer(pattern, original, re.DOTALL))
    if len(matches) != 1:
        raise ValueError('News sitemap entry could not be updated safely')
    match = matches[0]
    entry = match.group()
    lastmod = '<lastmod>' + modified + '</lastmod>'
    if re.search(r'<lastmod>.*?</lastmod>', entry, re.DOTALL):
        entry = re.sub(r'<lastmod>.*?</lastmod>', lastmod, entry, count=1, flags=re.DOTALL)
    else:
        entry = entry.replace('</url>', lastmod + '</url>')
    updated = original[:match.start()] + entry + original[match.end():]
    ET.fromstring(updated)
    if updated == original:
        return False
    sitemap.write_text(updated, encoding='utf-8')
    return True


if __name__ == '__main__':
    print('News-lastmod aktualisiert.' if update() else 'News-lastmod unverändert; keine neuere Inhaltsänderung.')
