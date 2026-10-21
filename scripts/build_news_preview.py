"""Build a self-contained, double-clickable editorial preview. No API calls."""
import argparse
from html import escape
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def build():
    data = json.loads((ROOT / 'ki-news/preview/2026-10-21.json').read_text(encoding='utf-8'))
    template = (ROOT / 'ki-news/index.html').read_text(encoding='utf-8')
    css = (ROOT / 'style.css').read_text(encoding='utf-8') + '\n' + (ROOT / 'ki-news/news.css').read_text(encoding='utf-8')
    template = template.replace('<link rel="stylesheet" href="../style.css"><link rel="stylesheet" href="news.css">', '<style>' + css + '\n.preview-label{border-left:3px solid var(--mint);margin-bottom:30px}.review-tools{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}</style>')
    template = template.replace('<script src="news.js" defer></script>', '')
    template = template.replace('<p><a class="more" href="vorschau.html">Manuell recherchierte Probeausgabe ansehen →</a></p>', '')
    template = template.replace('<title>KI-Briefing – Nachrichten mit Einordnung | Dirk Sommerfeld</title>', '<title>KI News – manuelle Vorschau | Dirk Sommerfeld</title>')
    template = template.replace('<link rel="canonical" href="https://sommerfeld.consulting/ki-news/">', '<meta name="robots" content="noindex,nofollow">')
    template = template.replace('href="../favicon.svg"', 'href="https://sommerfeld.consulting/favicon.svg"')
    template = template.replace('href="../"', 'href="https://sommerfeld.consulting/"').replace('href="../#wissen"', 'href="https://sommerfeld.consulting/#wissen"')
    template = template.replace('href="../impressum.html"', 'href="https://sommerfeld.consulting/impressum.html"').replace('href="../datenschutz.html"', 'href="https://sommerfeld.consulting/datenschutz.html"')
    template = template.replace('DAS TÄGLICHE KI-BRIEFING', 'KI NEWS / MANUELLE VORSCHAU')
    template = template.replace('In wenigen Minuten informiert', '5 Meldungen · etwa 4 Minuten')
    template = template.replace('<div class="news-layout">', '<div class="notice preview-label"><strong>Probeausgabe zur Abstimmung</strong><p style="margin:8px 0 0">' + escape(data['note']) + '</p></div><div class="news-layout">')
    template = template.replace('id="edition-date">TAGESAUSGABE', 'id="edition-date">PROBEAUSGABE / 21. OKTOBER 2026')
    template = template.replace('id="edition-heading">Das aktuelle Briefing', 'id="edition-heading">' + escape(data['title']))
    template = template.replace('<p id="status" class="notice" role="status">Ausgaben werden geladen …</p>', '<p id="status" class="notice" role="status" hidden></p>')
    template = template.replace('<div id="edition-meta" class="muted"></div>', '<div id="edition-meta" class="muted">Manuell recherchiert · Originalquellen gelesen · Veröffentlichungsdaten direkt an jeder Meldung</div>')
    template = template.replace('aria-label="Der schnelle Überblick" hidden', 'aria-label="Der schnelle Überblick"')
    headlines = ''.join('<li><a href="#' + escape(s['id']) + '">' + escape(s['title']) + '</a></li>' for s in data['stories'][:3])
    template = template.replace('<ol id="headlines"></ol>', '<ol id="headlines">' + headlines + '</ol>')
    template = template.replace('class="filters" role="search" hidden', 'class="filters" role="search"')
    stories = []
    for story in data['stories']:
        tags = '<span class="tag topic">' + escape(story['category']) + '</span>' + ''.join('<span class="tag">' + escape(p) + '</span>' for p in story['providers'])
        refs = []
        for source in story['sources']:
            day = '.'.join(reversed(source['published_at'][:10].split('-')))
            refs.append('<li><a target="_blank" rel="noopener noreferrer" href="' + escape(source['url'], quote=True) + '">' + escape(source['name']) + ' ↗</a><small>' + escape(source['type']) + ' · veröffentlicht ' + day + '</small></li>')
        search = escape(' '.join([story['title'], story['summary'], story['relevance'], story['caveat'], *story['providers']]).lower(), quote=True)
        stories.append('<article class="story" id="' + story['id'] + '" data-topic="' + escape(story['category'], quote=True) + '" data-search="' + search + '"><div class="tags">' + tags + '</div><h3>' + escape(story['title']) + '</h3><p>' + escape(story['summary']) + '</p><dl><dt>Warum das zählt</dt><dd>' + escape(story['relevance']) + '</dd><dt>Einordnung &amp; Grenzen</dt><dd>' + escape(story['caveat']) + '</dd></dl><ul class="story-sources">' + ''.join(refs) + '</ul></article>')
    template = template.replace('<div id="stories"></div>', '<div id="stories">' + '\n'.join(stories) + '</div><p id="no-results" class="notice" hidden>Keine passenden Meldungen. Suche oder Themenfilter ändern.</p>')
    template = template.replace('<p id="result-count" class="muted" aria-live="polite"></p>', '<p id="result-count" class="muted" aria-live="polite">5 von 5 Meldungen</p>')
    start, end = template.index('<noscript>'), template.index('</noscript>') + len('</noscript>')
    template = template[:start] + '<noscript><p>Alle Meldungen sind lesbar. Für die Suche bitte JavaScript aktivieren.</p></noscript>' + template[end:]
    template = template.replace('<h2>Tagesarchiv</h2>', '<h2>Probeausgabe</h2>').replace('Eine Ausgabe auswählen. Die Suche gilt für die ausgewählte Ausgabe.', 'Hier prüfst du eine einzelne, manuell zusammengestellte Ausgabe. Das Tagesarchiv folgt im laufenden Betrieb.')
    template = template.replace('<ol id="archive" class="archive"></ol>', '<ol id="archive" class="archive"><li><a href="#briefing" aria-current="page">21. Oktober 2026<small>5 Meldungen · manuelle Vorschau</small></a></li></ol>')
    template = template.replace('Automatisch recherchiert und mit KI auf Deutsch zusammengefasst. Keine laufende menschliche Vorabprüfung.', 'Diese Probeausgabe wurde manuell recherchiert und zusammengestellt. Im späteren Betrieb übernimmt der Agent die tägliche Recherche und Zusammenfassung.')
    links = ''.join('<a target="_blank" rel="noopener noreferrer" href="' + escape(s['sources'][0]['url'], quote=True) + '">' + escape(s['providers'][0]) + ' · ' + str(i+1) + '</a>' for i, s in enumerate(data['stories']))
    template = template.replace('<div id="source-list" class="source-list"></div>', '<div id="source-list" class="source-list">' + links + '</div>')
    template = template.replace('Das Zeitfenster und die erreichbaren Quellen stehen an jeder Ausgabe. Veröffentlichungen ohne genaue Uhrzeit werden als tagesgenau gekennzeichnet. Technische Ausfälle können die Aktualisierung verzögern.', 'Für diese Vorschau wurden die fünf verlinkten Originalbeiträge manuell gelesen. Die Quellen enthalten nur Tagesdaten; genaue Veröffentlichungszeiten werden nicht behauptet. Die Meldungen sind thematisch ausgewählt, nicht auf ein gemeinsames 24-Stunden-Fenster begrenzt.')
    script = '''<script>
const query = document.getElementById('query'), topic = document.getElementById('topic');
const stories = [...document.querySelectorAll('.story')];
function filterStories() {
  const term = query.value.trim().toLocaleLowerCase('de'); let count = 0;
  for (const story of stories) { story.hidden = !!((term && !story.dataset.search.includes(term)) || (topic.value && story.dataset.topic !== topic.value)); if (!story.hidden) count++; }
  document.getElementById('result-count').textContent = `${count} von ${stories.length} Meldungen`;
  document.getElementById('no-results').hidden = count > 0;
}
query.addEventListener('input', filterStories); topic.addEventListener('change', filterStories);
document.getElementById('filters').addEventListener('submit', e => e.preventDefault());
for (const link of document.querySelectorAll('#headlines a')) link.addEventListener('click', () => { query.value = ''; topic.value = ''; filterStories(); });
</script>'''
    return template.replace('</body>', script + '</body>')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, default=ROOT / 'ki-news/vorschau.html')
    args = parser.parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(build(), encoding='utf-8')
    print(args.output)
