// Dependency-free behavior checks for the static client (no browser required).
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('ki-news/news.js', 'utf8');
class Element {
  constructor(tag = 'div') { this.tag = tag; this.children = []; this.hidden = false; this.value = ''; this.textContent = ''; this.dataset = {}; this.attrs = {}; this.events = {}; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  addEventListener(type, handler) { this.events[type] = handler; }
  setAttribute(k, v) { this.attrs[k] = v; }
  removeAttribute(k) { delete this.attrs[k]; }
  querySelectorAll(tag) { return this.children.flatMap(c => [ ...(c.tag === tag ? [c] : []), ...c.querySelectorAll(tag) ]); }
}
const tick = () => new Promise(resolve => setImmediate(resolve));
async function boot(archive, edition, requested = '', failEdition = false) {
  const nodes = new Map();
  const location = { href: 'https://example.com/ki-news/' + requested };
  const context = vm.createContext({
    document: { getElementById(id) { if (!nodes.has(id)) nodes.set(id, new Element()); return nodes.get(id); }, createElement(tag) { return new Element(tag); } },
    Intl, Date, URL, console, location,
    history: { pushState(a, b, url) { location.href = new URL(url, location.href).href; } },
    window: { addEventListener() {} },
    fetch: async path => ({ ok: !(failEdition && /data\/\d/.test(path)), status: 500, json: async () => path === 'sources.json' ? [] : path === 'data/archive.json' ? archive : edition })
  });
  vm.runInContext(source, context); await tick(); await tick();
  return { nodes, context };
}
(async () => {
  let { nodes } = await boot([], null);
  assert.match(nodes.get('status').textContent, /vorbereitet/);
  assert.equal(nodes.get('filters').hidden, true);
  const story = { id: 'news-test', title: '<img src=x onerror=alert(1)>', summary: 'Claude als Agent', relevance: 'Hilft bei Aufgaben', caveat: 'Herstellerangabe', category: 'Modelle', providers: ['Anthropic'], sources: [{ url: 'https://example.com/source', name: 'Example', type: 'Hersteller', precision: 'date', published_at: '2026-10-21T00:00:00Z' }, { url: 'javascript:alert(1)', name: 'Unsafe' }] };
  const edition = { date: '2026-10-21', title: 'Das Briefing', window_start: '2026-10-20T04:00:00Z', window_end: '2026-10-21T04:00:00Z', generated_at: '2026-10-21T04:01:00Z', coverage: [{ name: 'Ausfall', status: 'unavailable' }], stories: [story] };
  let state = await boot([{ date: edition.date, count: 1 }], edition, '?ausgabe=2026-10-21'); nodes = state.nodes;
  assert.equal(nodes.get('stories').children.length, 1);
  assert.equal(nodes.get('coverage').hidden, false);
  const article = nodes.get('stories').children[0];
  assert.equal(article.children[1].textContent, story.title); // Text, never interpreted HTML.
  assert.equal(article.querySelectorAll('a').length, 1); // Unsafe protocol removed.
  nodes.get('query').value = 'nichtvorhanden'; nodes.get('query').events.input();
  assert.equal(nodes.get('result-count').textContent, '0 von 1 Meldungen');
  nodes.get('query').value = 'claude'; nodes.get('query').events.input();
  assert.equal(nodes.get('result-count').textContent, '1 von 1 Meldungen');
  nodes.get('topic').value = 'Forschung'; nodes.get('topic').events.change();
  assert.equal(nodes.get('result-count').textContent, '0 von 1 Meldungen');
  ({ nodes } = await boot([{ date: edition.date, count: 1 }], edition, '?ausgabe=1999-01-01'));
  assert.match(nodes.get('status').textContent, /nicht gefunden/);
  ({ nodes } = await boot([{ date: edition.date, count: 1 }], edition, '', true));
  assert.match(nodes.get('status').textContent, /nicht geladen/);
  console.log('Frontend: initial state, edition rendering, source links, text safety, search, filter, unknown date and fetch failure OK');
})().catch(error => { console.error(error); process.exitCode = 1; });
