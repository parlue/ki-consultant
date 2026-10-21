"""Build a compact, self-contained news preview. No API calls or server."""
import argparse
from html import escape as e
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def build():
    data = json.loads((ROOT / 'ki-news/preview/2026-10-21.json').read_text(encoding='utf-8'))
    css = (ROOT / 'ki-news/news.css').read_text(encoding='utf-8')
    rows = []
    for story in data['stories']:
        source = story['sources'][0]
        day = '.'.join(reversed(source['published_at'][:10].split('-')))
        providers = ' / '.join(story['providers'])
        teaser = story.get('teaser') or story['summary'].split('. ')[0] + '.'
        search = ' '.join([story['title'], story['summary'], story['relevance'], story['caveat'], providers]).lower()
        refs = ''.join(f'<li><a href="{e(s["url"], quote=True)}" target="_blank" rel="noopener noreferrer">{e(s["name"])} ↗</a><small>{e(s["type"])}</small></li>' for s in story['sources'])
        rows.append(f'''<article class="story" id="{e(story['id'])}" data-topic="{e(story['category'], quote=True)}" data-search="{e(search, quote=True)}">
<div class="tags"><span class="tag topic">{e(story['category'])}</span><time datetime="{source['published_at'][:10]}">{day}</time><span>{e(providers)}</span></div>
<h3>{e(story['title'])}</h3><p>{e(teaser)}</p>
<details><summary>Weiterlesen &amp; Quellen</summary><p>{e(story['summary'])}</p><dl><dt>Warum das zählt</dt><dd>{e(story['relevance'])}</dd><dt>Einordnung &amp; Grenzen</dt><dd>{e(story['caveat'])}</dd></dl><ul class="story-sources">{refs}</ul></details></article>''')
    categories = ''.join(f'<option>{e(c)}</option>' for c in ['Modelle', 'Agenten & Anwendungen', 'Forschung', 'Chips & Rechenleistung', 'Wirtschaft & Gesellschaft'])
    return f'''<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>KI News – manuelle Vorschau</title><style>{css}</style></head><body>
<a class="skip" href="#briefing">Zu den Nachrichten</a>
<header class="masthead"><div class="wrap"><a class="news-brand" href="#briefing">KI<span>News</span></a><a class="consulting" href="https://sommerfeld.consulting/">Dirk Sommerfeld · Consulting ↗</a></div></header>
<main class="wrap" id="briefing"><div class="edition-line"><h1>Nachrichten</h1><span>21. Oktober 2026</span></div>
<p class="preview-note">Manuelle Vorschau · Meldungen mit unterschiedlichen Veröffentlichungsdaten</p>
<form id="filters" class="filters" role="search"><label class="sr-only" for="query">Nachrichten durchsuchen</label><input id="query" type="search" placeholder="Nachrichten durchsuchen"><label class="sr-only" for="topic">Thema</label><select id="topic"><option value="">Alle Themen</option>{categories}</select><span id="result-count" aria-live="polite">5 Meldungen</span></form>
<div id="stories">{''.join(rows)}</div><p id="no-results" class="notice" hidden>Keine passenden Meldungen. Suche oder Themenfilter ändern.</p>
<div class="page-bottom"><details><summary>Über diese Probeausgabe</summary><p>{e(data['note'])}</p><p>Die verlinkten Originalquellen wurden manuell gelesen. Die Vorschau braucht weder einen API-Schlüssel noch einen Webserver.</p></details></div>
<noscript><p>Alle Meldungen sind lesbar. Die Suche benötigt JavaScript.</p></noscript></main>
<footer class="wrap"><span>© Dirk Sommerfeld</span><div><a href="https://sommerfeld.consulting/impressum.html">Impressum</a><a href="https://sommerfeld.consulting/datenschutz.html">Datenschutz</a></div></footer>
<script>
const query = document.getElementById('query'), topic = document.getElementById('topic');
const stories = [...document.querySelectorAll('.story')];
function filterStories() {{
 const term = query.value.trim().toLocaleLowerCase('de'); let count = 0;
 for (const story of stories) {{ story.hidden = !!((term && !story.dataset.search.includes(term)) || (topic.value && story.dataset.topic !== topic.value)); if (!story.hidden) count++; }}
 document.getElementById('result-count').textContent = `${{count}} von ${{stories.length}} Meldungen`;
 document.getElementById('no-results').hidden = count > 0;
}}
query.addEventListener('input', filterStories); topic.addEventListener('change', filterStories);
document.getElementById('filters').addEventListener('submit', e => e.preventDefault());
</script></body></html>'''


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, default=ROOT / 'ki-news/vorschau.html')
    args = parser.parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(build(), encoding='utf-8')
    print(args.output)
