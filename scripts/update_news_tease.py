"""Write the three newest headlines into the teaser block on the home page."""
import json
from pathlib import Path
import re
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
START, END = '<!-- NEWS-TEASE:START -->', '<!-- NEWS-TEASE:END -->'
LIMIT = 3


def block(data):
    archive = json.loads((data / 'archive.json').read_text(encoding='utf-8'))
    if not archive:
        return ''
    latest = max(archive, key=lambda item: item['date'])
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', latest['date']):
        raise ValueError('Invalid edition date')
    edition = json.loads((data / (latest['date'] + '.json')).read_text(encoding='utf-8'))
    titles = [s['title'] for s in edition['stories'][:LIMIT]]
    if not titles:
        return ''
    year, month, day = latest['date'].split('-')
    heads = ''.join('<li>%s</li>' % escape(t) for t in titles)
    return (
        '<a class="news-tease" href="ki-news/" aria-label="Zum täglichen KI-Briefing">'
        '<span class="news-tease-head"><span class="news-tease-label">KI-Briefing · %s.%s.%s</span>'
        '<strong>Hier geht es zum täglichen KI-Briefing <span aria-hidden="true">→</span></strong></span>'
        '<ul>%s</ul></a>' % (day, month, year, heads))


def update(page=ROOT / 'index.html', data=ROOT / 'ki-news/data'):
    original = page.read_text(encoding='utf-8')
    if original.count(START) != 1 or original.count(END) != 1:
        raise ValueError('Teaser markers missing or duplicated')
    content = block(data)
    pattern = re.compile(re.escape(START) + r'.*?' + re.escape(END), re.DOTALL)
    updated = pattern.sub(lambda m: START + content + END, original)
    if updated == original:
        return False
    page.write_text(updated, encoding='utf-8', newline='')
    return True


if __name__ == '__main__':
    print('News-Teaser aktualisiert.' if update() else 'News-Teaser unverändert.')
