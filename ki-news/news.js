"use strict";
const $ = (id) => document.getElementById(id);
const dateLabel = (value, time = false) => new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", ...(time ? { timeStyle: "short", timeZone: "Europe/Berlin" } : { timeZone: "UTC" }) }).format(new Date(value));
function el(tag, text, className) { const n = document.createElement(tag); if (text !== undefined) n.textContent = text; if (className) n.className = className; return n; }
function safeLink(url) { try { const u = new URL(url); return u.protocol === "https:" ? u.href : null; } catch { return null; } }
async function getJSON(path) { const response = await fetch(path, { cache: "no-cache" }); if (!response.ok) throw new Error("HTTP " + response.status); return response.json(); }
let edition = null;
let archive = [];
let loadSequence = 0;
function renderStories() {
  if (!edition) return;
  const query = $("query").value.trim().toLocaleLowerCase("de");
  const topic = $("topic").value;
  const stories = edition.stories.filter(s => (!topic || s.category === topic) && JSON.stringify(s).toLocaleLowerCase("de").includes(query));
  $("stories").replaceChildren();
  $("result-count").textContent = `${stories.length} von ${edition.stories.length} Meldungen`;
  for (const story of stories) {
    const article = el("article", undefined, "story"); article.id = story.id;
    const tags = el("div", undefined, "tags"); tags.append(el("span", story.category, "tag topic"));
    if (story.sources.length) tags.append(el("span", dateLabel(story.sources[0].published_at)), el("span", story.providers.join(" / ")));
    const teaser = story.teaser || story.summary.split(/(?<=\.)\s/)[0];
    article.append(tags, el("h3", story.title), el("p", teaser));
    const sources = el("ul", undefined, "story-sources");
    for (const source of story.sources) {
      const url = safeLink(source.url); if (!url) continue;
      const li = el("li"); const a = el("a", source.name + " ↗"); a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
      li.append(a, el("small", `${source.type} · veröffentlicht ${dateLabel(source.published_at, source.precision === "time")}${source.precision === "date" ? " (ohne genaue Uhrzeit)" : " Uhr (Berlin)"}`)); sources.append(li);
    }
    article.append(sources); $("stories").append(article);
  }
  if (!stories.length && edition.stories.length) $("stories").append(el("p", "Keine passenden Meldungen. Suche oder Themenfilter ändern.", "notice"));
}
async function loadEdition() {
  const sequence = ++loadSequence;
  const requested = new URL(location.href).searchParams.get("ausgabe");
  const selected = requested ? archive.find(a => a.date === requested) : archive[0];
  edition = null; $("stories").replaceChildren(); $("filters").hidden = true;
  $("coverage").hidden = true; $("edition-meta").textContent = ""; $("result-count").textContent = ""; $("permalink").hidden = true;
  $("status").hidden = false;
  if (!selected) { $("status").textContent = requested ? "Diese Ausgabe wurde nicht gefunden. Bitte wähle eine Ausgabe aus dem Archiv." : "Das KI-Briefing wird vorbereitet. Sobald der tägliche Recherchelauf aktiviert ist, erscheinen hier die ersten Ausgaben mit Quellenlinks."; return; }
  $("status").textContent = "Ausgabe wird geladen …";
  try {
    const data = await getJSON(`data/${selected.date}.json`);
    if (sequence !== loadSequence) return;
    edition = data;
    $("edition-date").textContent = dateLabel(data.date);
    $("edition-meta").textContent = `Recherche: ${dateLabel(data.window_start, true)} bis ${dateLabel(data.window_end, true)} Uhr (Berlin). Erstellt ${dateLabel(data.generated_at, true)} Uhr.`;
    const old = Date.now() - new Date(data.window_end).getTime() > 36 * 3600000;
    $("status").hidden = data.stories.length > 0 && (requested || !old);
    $("status").textContent = !data.stories.length ? "Im Recherchezeitraum wurden keine ausreichend relevanten, neuen Meldungen ausgewählt." : "Die letzte Ausgabe ist älter als 36 Stunden. Eine neuere Ausgabe liegt derzeit nicht vor.";
    const failed = data.coverage.filter(s => s.status !== "ok");
    $("coverage").hidden = !failed.length;
    $("coverage").textContent = `Eingeschränkte Quellenabdeckung: ${failed.map(s => s.name).join(", ")}. Diese Quellen konnten nicht zuverlässig ausgewertet werden.`;
    $("permalink").href = `?ausgabe=${data.date}`; $("permalink").hidden = false;
    $("filters").hidden = !data.stories.length;
    for (const link of $("archive").querySelectorAll("a")) { if (link.dataset.date === data.date) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current"); }
    renderStories();
  } catch { if (sequence !== loadSequence) return; $("status").hidden = false; $("status").textContent = "Die Ausgabe konnte nicht geladen werden. Bitte versuche es erneut oder wähle einen anderen Tag im Archiv."; }
}
$("filters").addEventListener("submit", e => e.preventDefault());
$("query").addEventListener("input", renderStories); $("topic").addEventListener("change", renderStories);
window.addEventListener("popstate", loadEdition);
async function init() {
  try {
    archive = await getJSON("data/archive.json");
    for (const item of archive) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) continue;
      const li = el("li"); const a = el("a", dateLabel(item.date)); a.href = `?ausgabe=${item.date}`; a.dataset.date = item.date; a.append(el("small", `${item.count} Meldungen`));
      a.addEventListener("click", e => { if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; e.preventDefault(); history.pushState(null, "", a.href); $("query").value = ""; $("topic").value = ""; loadEdition(); }); li.append(a); $("archive").append(li);
    }
    if (!archive.length) $("archive").append(el("li", "Noch keine Ausgaben veröffentlicht.", "muted"));
    await loadEdition();
  } catch { $("status").textContent = "Das Archiv konnte nicht geladen werden. Bitte lade die Seite erneut."; }
}
init();
getJSON("sources.json").then(sources => { for (const source of sources) { const url = safeLink(source.url); if (!url) continue; const a = el("a", source.name); a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; $("source-list").append(a); } }).catch(() => { $("source-list").textContent = "Die Quellenliste konnte nicht geladen werden."; });
