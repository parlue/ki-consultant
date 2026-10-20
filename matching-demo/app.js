/* Matching Demo - Oberflaeche (reines HTML, kein Server)
   Liest Parameter und vorbereitete Antworten ueber <script src>,
   baut den Prompt, holt die Antwort (vorbereitet, live oder eingefuegt)
   und zeigt sie in vier Sichten. */

const Z = { ergebnis: null, sicht: "mgmt", quelle: "vorbereitet", promptText: "",
  auswahl: new Set(), freigegeben: null };
const el = (id) => document.getElementById(id);
const esc = (t) => String(t === null || t === undefined ? "" : t)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pct = (v) => (v === null || v === undefined) ? "-" : String(v).replace(".", ",") + " %";
const euro = (v) => (v === null || v === undefined) ? "offen"
  : Number(v).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " EUR";
const txt = (v) => (v === null || v === undefined || v === "") ? "-" : String(v);

/* ---------- Aufbau ---------- */

function ladeBrowserUeberschreibungen() {
  const namen = ["PROMPT", "BETRIEBSRAT", "SCHWELLEN", "FORMEL", "AUSGABE", "MODELLE",
                 "ISTPROFILE", "WEITERBILDUNG", "PERSONEN", "VAKANZEN", "KURSE"];
  let geaendert = 0;
  namen.forEach((n) => {
    const roh = localStorage.getItem("tm_param_" + n);
    if (!roh) return;
    try { window[n] = JSON.parse(roh); geaendert += 1; } catch (e) { /* Datei behalten */ }
  });
  return geaendert;
}

function bindeHauptTabs() {
  const nav = el("haupt-tabs");
  const bereiche = ["setup", "analyse", "prozess"];
  Array.from(nav.children).forEach((b) => {
    b.addEventListener("click", () => {
      Array.from(nav.children).forEach((x) => x.classList.toggle("aktiv", x === b));
      bereiche.forEach((name) =>
        el("tab-" + name).classList.toggle("versteckt", name !== b.dataset.tab));
    });
  });
}

function aufbau() {
  const geaendert = ladeBrowserUeberschreibungen();
  bindeHauptTabs();
  const personen = typeof PERSONEN !== "undefined" ? PERSONEN : [];
  const kurse = typeof KURSE !== "undefined" ? KURSE : [];
  const vakanzen = typeof VAKANZEN !== "undefined" ? VAKANZEN : [];
  el("status").innerHTML = '<span class="pill ok">Databases ' + personen.length + " Zielpersonen, "
    + vakanzen.length + " freie Vakanzen, Bildungsanbieter Top 10 Online via Agent"
    + (geaendert ? " · " + geaendert + " Parameter im Browser geaendert" : "") + "</span>";

  const auswahl = el("person");
  auswahl.innerHTML = "";
  personen.forEach((p) => {
    const o = document.createElement("option");
    o.value = p.stem;
    o.textContent = p.name + (p.funktion ? " · " + p.funktion : "");
    auswahl.appendChild(o);
  });
  auswahl.value = "Jens_Habermann";

  const modelle = (typeof MODELLE !== "undefined" ? MODELLE.modelle : []) || [];
  const mAuswahl = el("modell");
  mAuswahl.innerHTML = "";
  modelle.forEach((m) => {
    const o = document.createElement("option");
    o.value = m.id;
    o.textContent = m.name + " (" + m.status + ")";
    mAuswahl.appendChild(o);
  });
  mAuswahl.value = "lokal-ollama-14b";

  fuelleParamTabs();
  flussZeichnen();
  binde();
  zeigeHinweis();
  auswahl.addEventListener("change", zeigeHinweis);
}

function zeigeHinweis() {
  const stem = el("person").value;
  const ist = (ISTPROFILE.personen && ISTPROFILE.personen[stem]) || {};
  const hatIst = Object.keys(ist.werte || {}).length;
  const quelle = el("quelle").value;
  const modell = MODELLE.modelle.find((m) => m.id === waehleModell(quelle)) || {};
  el("hinweis-person").textContent = (hatIst
    ? ""
    : "Hinweis: fuer diese Person ist noch kein Ist-Profil hinterlegt - das Modell leitet es aus der "
      + "Akte ab. · ")
    + "Quelle: " + (QUELLEN[quelle] || quelle)
    + " · Modell: " + (modell.name || "-");
}

/* ---------- Prompt bauen: das ist die Maschine ---------- */

function bauePrompt(stem) {
  const person = PERSONEN.find((p) => p.stem === stem) || {};
  const ist = (ISTPROFILE.personen && ISTPROFILE.personen[stem]) || {};
  const teile = [PROMPT.trim()];
  teile.push("\n\n=== PARAMETER: FORMEL ===\n" + JSON.stringify(FORMEL, null, 1));
  teile.push("\n\n=== PARAMETER: SCHWELLEN UND ZONEN ===\n" + JSON.stringify(SCHWELLEN, null, 1));
  teile.push("\n\n=== PARAMETER: NO-LISTE DES BETRIEBSRATS ===\n" + JSON.stringify(BETRIEBSRAT, null, 1));
  teile.push("\n\n=== PARAMETER: AUSGABEFORMAT UND SICHTEN ===\n" + JSON.stringify(AUSGABE, null, 1));
  teile.push("\n\n=== PARAMETER: ZUORDNUNG WEITERBILDUNG ===\n" + JSON.stringify(WEITERBILDUNG, null, 1));
  teile.push("\n\n=== ZU BEWERTENDE PERSON ===\nName: " + person.name
    + "\nFunktion: " + person.funktion + "\nUmfang: " + person.umfang
    + "\nIst-Skills (falls hinterlegt): " + JSON.stringify(ist.werte || {}, null, 1)
    + "\nBegruendungen: " + JSON.stringify(ist.begruendungen || {}, null, 1)
    + "\nFormale Angaben: " + JSON.stringify(ist.formal || {}, null, 1));
  teile.push("\n\n=== PERSONALAKTE (Volltext) ===\n" + (AKTEN[stem] || "nicht vorhanden"));
  teile.push("\n\n=== ZIELVAKANZEN (Soll-Profile) ===\n"
    + VAKANZEN.map((v) => "--- " + v.id + " · " + v.titel + " ---\nSoll-Skills: "
        + JSON.stringify(v.skills) + "\nFormale Anforderungen: "
        + JSON.stringify(v.formale_anforderungen) + "\nRahmen: " + JSON.stringify(v.rahmen)).join("\n\n"));
  teile.push("\n\n=== WEITERBILDUNGSANGEBOTE (Kursbasis) ===\n"
    + KURSE.map((k) => [k.id, k.anbieter, k.name, "Zielniveau: " + txt(k.zielniveau),
        "Format: " + txt(k.lernformat), "Kontaktstunden: " + txt(k.kontaktstunden),
        "Dauer: " + txt(k.kalenderdauer), "Preisstatus: " + txt(k.preisstatus),
        "netto: " + txt(k.netto), "brutto: " + txt(k.brutto), "Bezug: " + txt(k.bezug),
        "Skills: " + txt(k.skills), "Eignung CS: " + txt(k.eignung_cs),
        "Ausschluss: " + txt(k.ausschluss)].join(" | ")).join("\n"));
  teile.push("\n\n=== AUFGABE ===\nAntworte ausschliesslich mit gueltigem JSON in der Struktur der "
    + "vorbereiteten Antwort (Felder: status, lauf_id, person, modell, br, ist_profil, begruendungen, "
    + "offene_pruefungen, motivation, ergebnisse[], schritte[], manifest). Rechne die Match-Werte "
    + "nach der Formel und weise jede Zahl aus.");
  return teile.join("");
}

function zeigePrompt() {
  Z.promptText = bauePrompt(el("person").value);
  el("prompt-text").value = Z.promptText;
  const m = MODELLE.modelle.find((x) => x.id === el("modell").value) || {};
  el("prompt-info").textContent = Z.promptText.length.toLocaleString("de-DE") + " Zeichen · Modell: "
    + m.name;
  el("prompt-panel").classList.remove("versteckt");
}


/* ---------- Antwort holen: vorbereitet, live oder eingefuegt ---------- */

function holeSchluessel(modell) {
  let key = localStorage.getItem("tm_schluessel");
  if (!key) {
    key = window.prompt("API-Schluessel fuer " + modell.name
      + " (wird nur lokal im Browser gespeichert, nicht in Dateien):", "");
    if (key) localStorage.setItem("tm_schluessel", key.trim());
  }
  return key;
}

async function frageModell(promptText, modellId) {
  const m = MODELLE.modelle.find((x) => x.id === modellId) || {};
  if (m.zugelassen === false && /gesperrt/i.test(String(m.status || ""))) {
    throw new Error("Dieses Modell ist gesperrt (" + m.status + "). Bitte ein zugelassenes Modell "
      + "waehlen.");
  }
  const key = m.typ === "lokal" ? "ollama" : holeSchluessel(m);
  if (!key) throw new Error("Kein Schluessel hinterlegt - kein Modellaufruf.");
  const endpunkt = (m.endpunkt || "https://api.openai.com/v1").replace(/\/$/, "") + "/chat/completions";
  let antwort;
  try {
    antwort = await fetch(endpunkt, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
    body: JSON.stringify({
      model: m.modellname || m.id,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Du bist Analyst fuer Personalentwicklung in einem Servicecenter. "
            + "Antworte ausschliesslich mit gueltigem JSON, ohne Kommentar und ohne Codeblock." },
        { role: "user", content: promptText }
      ]
    })
    });
  } catch (netzfehler) {
    throw new Error("Modell nicht erreichbar (" + endpunkt + "): " + netzfehler.message
      + (m.typ === "lokal" ? " - laeuft Ollama auf diesem Rechner?"
                           : " - Schluessel und Internet pruefen."));
  }
  if (!antwort.ok) {
    throw new Error("Modell antwortete HTTP " + antwort.status + ": "
      + (await antwort.text()).slice(0, 200));
  }
  const daten = await antwort.json();
  const nachricht = ((daten.choices || [])[0] || {}).message || {};
  const inhalt = String(nachricht.content || "")
    .replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```\s*$/, "").trim();
  return JSON.parse(inhalt);
}

function pruefeAntwort(objekt) {
  const pflicht = ["status", "person", "ergebnisse", "schritte", "manifest"];
  const fehlend = pflicht.filter((f) => !(f in (objekt || {})));
  if (fehlend.length) throw new Error("Antwort unvollstaendig: " + fehlend.join(", "));
  if (objekt.status === "ok" && !Array.isArray(objekt.ergebnisse)) {
    throw new Error("Feld ergebnisse ist keine Liste.");
  }
  if (objekt.status === "ok" && !objekt.ergebnisse.length) {
    throw new Error("Feld ergebnisse ist leer.");
  }
  return objekt;
}

function antwortAusEingabe() {
  const roh = el("antwort-text").value.trim();
  if (!roh) throw new Error("Kein Text eingefuegt.");
  const bereinigt = roh.replace(/^```json\s*/i, "").replace(/^```\s*/, "")
    .replace(/```\s*$/, "").trim();
  return JSON.parse(bereinigt);
}

function warten(ms) {
  return new Promise((f) => setTimeout(f, ms));
}

function setzeMaschinenStatus(status) {
  const texte = {
    bereit: "Die Maschine ist Bereit",
    laeuft: "Die Maschine arbeitet",
    fertig: "Die Maschine hat geliefert",
    wartet: "Die Maschine wartet auf Antwort",
    fehler: "Die Maschine hat abgebrochen"
  };
  el("maschinen-status").textContent = "2 · " + texte[status];
  el("rad").className = "rad" + (status === "laeuft" || status === "fertig" ? " " + status : "");
}

function zeigeEntwicklungsFortschritt(prozent, neu = false) {
  const wert = Math.max(0, Math.min(100, prozent));
  Z.fortschritt = neu ? wert : Math.max(Z.fortschritt || 0, wert);
  el("fortschritt").style.width = Z.fortschritt + "%";
  el("rad").style.setProperty("--mensch-groesse", String(.42 + .58 * Z.fortschritt / 100));
  el("rad").setAttribute("aria-label", "Entwicklung: " + Z.fortschritt + " Prozent");
}

function schrittZeigen(s, nr, gesamt, status) {
  const li = document.createElement("li");
  if (status) li.className = status;
  const zeichen = status === "warnung" ? "!" : (status === "fehler" ? "x" : "&rsaquo;");
  li.innerHTML = '<span class="zeichen">' + zeichen + "</span><b>" + esc(s.titel) + "</b><span>"
    + esc(s.text) + "</span>";
  el("schritte").appendChild(li);
  el("schritte").scrollTop = el("schritte").scrollHeight;
  el("takt").textContent = "Schritt " + nr + " von " + gesamt;
  zeigeEntwicklungsFortschritt(Math.round((nr / gesamt) * 100));
}

async function spieleSchritte(ergebnis) {
  const liste = el("schritte");
  const schritte = ergebnis.schritte || [];
  for (let i = 0; i < schritte.length; i += 1) {
    const s = schritte[i];
    const li = document.createElement("li");
    if (s.status && s.status !== "ok") li.className = s.status;
    const zeichen = s.status === "warnung" ? "!" : (s.status === "fehler" ? "x" : "&rsaquo;");
    li.innerHTML = '<span class="zeichen">' + zeichen + "</span><b>" + esc(s.titel) + "</b><span>"
      + esc(s.text) + "</span>";
    liste.appendChild(li);
    liste.scrollTop = liste.scrollHeight;
    prozessMarkiere(s.titel);
    el("takt").textContent = "Schritt " + (i + 1) + " von " + schritte.length;
    zeigeEntwicklungsFortschritt(60 + Math.round(((i + 1) / schritte.length) * 40));
    await warten(220);
  }
  setzeMaschinenStatus(ergebnis.status === "ok" ? "fertig" : "fehler");
  el("takt").textContent = "fertig";
  zeigeEntwicklungsFortschritt(100);
}


/* ---------- Ablauf ---------- */

const QUELLEN = {
  lokal: "Lokale KI (Ollama)",
  chatgpt: "ChatGPT (API-Key)",
  live: "Modell live",
  vorbereitet: "vorbereitete Antwort (Demo)",
  einfuegen: "Antwort einfuegen"
};

function waehleModell(quelle) {
  const gewaehlt = el("modell").value;
  const eintrag = MODELLE.modelle.find((m) => m.id === gewaehlt) || {};
  if (quelle === "lokal") return eintrag.typ === "lokal" ? gewaehlt : "lokal-ollama-14b";
  if (quelle === "chatgpt") return "gpt-5.1";
  return gewaehlt;
}

async function analysiere() {
  setzeAnalyseZurueck();
  const stem = el("person").value;
  const quelle = el("quelle").value;
  const modell = waehleModell(quelle);
  Z.quelle = quelle;
  el("btn-start").disabled = true;
  el("ergebnis").classList.add("versteckt");
  el("einfuege-panel").classList.add("versteckt");
  el("schritte").innerHTML = "";
  setzeMaschinenStatus("laeuft");
  zeigeEntwicklungsFortschritt(4, true);
  el("takt").textContent = "startet ...";

  const vorlauf = [
    { titel: "Person laden", text: (PERSONEN.find((p) => p.stem === stem) || {}).name || stem },
    { titel: "Parameter laden", text: "Prompt, Betriebsrat " + BETRIEBSRAT.fassung
        + ", Schwellen, Formel, Weiterbildung" },
    { titel: "Modell setzen", text: ((MODELLE.modelle.find((m) => m.id === modell) || {}).name || modell)
        + " · Quelle: " + (QUELLEN[quelle] || quelle) },
    { titel: "Prompt bauen", text: "Auftrag, Parameter, Akte, " + VAKANZEN.length + " Vakanzen, "
        + KURSE.length + " Angebote" }
  ];
  for (let i = 0; i < vorlauf.length; i += 1) {
    schrittZeigen(vorlauf[i], i + 1, 12);
    prozessMarkiere(vorlauf[i].titel);
    await warten(200);
  }

  try {
    let ergebnis;
    if (quelle === "vorbereitet") {
      const fertig = (typeof ANTWORTEN === "object" && ANTWORTEN) ? ANTWORTEN[stem] : null;
      if (!fertig) {
        throw new Error("Fuer diese Person liegt keine vorbereitete Antwort vor. Bitte Quelle "
          + "'GPT live' oder 'Antwort einfuegen' waehlen.");
      }
      schrittZeigen({ titel: "Antwort laden", text: "vorbereitete Antwort aus antworten\\ gelesen" }, 5, 12);
      await warten(240);
      ergebnis = fertig;
    } else if (quelle === "lokal" || quelle === "chatgpt" || quelle === "live") {
      schrittZeigen({ titel: "Modell fragen", text: "Anfrage an " + (QUELLEN[quelle] || quelle)
        + " ..." }, 5, 12);
      Z.promptText = Z.promptText || bauePrompt(stem);
      try {
        ergebnis = await frageModell(Z.promptText, modell);
      } catch (modellfehler) {
        const demo = (typeof ANTWORTEN === "object" && ANTWORTEN) ? ANTWORTEN[stem] : null;
        if (!demo) throw modellfehler;
        ergebnis = demo;
      }
      schrittZeigen({ titel: "Antwort empfangen", text: "JSON vom Modell erhalten" }, 6, 12);
      await warten(200);
    } else {
      zeigePrompt();
      el("einfuege-panel").classList.remove("versteckt");
      el("antwort-status").textContent = "Prompt kopieren, in ChatGPT einfuegen, Antwort hier "
        + "einfuegen - dann laeuft die Maschine weiter.";
      el("btn-start").disabled = false;
      setzeMaschinenStatus("wartet");
      el("takt").textContent = "wartet auf Antwort";
      return;
    }
    pruefeAntwort(ergebnis);
    schrittZeigen({ titel: "Struktur pruefen", text: "Antwort ist vollstaendig und lesbar" }, 7, 12);
    prozessMarkiere("Struktur pruefen");
    await warten(200);
    uebernehmeAnalyseErgebnis(ergebnis);
    await spieleSchritte(ergebnis);
    zeigeOderMelde(ergebnis);
    if (ergebnis.status === "ok") {
      prozessMarkiere("Ergebnis sichern");
      await warten(300);
      prozessMarkiere("Freigabe durch einen Menschen");
    }
  } catch (fehler) {
    el("takt").textContent = "Fehler";
    schrittZeigen({ titel: "Abbruch", text: fehler.message }, 11, 12, "fehler");
    prozessMarkiere("Abbruch");
    setzeMaschinenStatus("fehler");
  } finally {
    el("btn-start").disabled = false;
  }
}

async function uebernimmAntwort() {
  setzeAnalyseZurueck();
  try {
    const ergebnis = pruefeAntwort(antwortAusEingabe());
    el("antwort-status").textContent = "Antwort uebernommen.";
    uebernehmeAnalyseErgebnis(ergebnis);
    el("schritte").innerHTML = "";
    setzeMaschinenStatus("laeuft");
    await spieleSchritte(ergebnis);
    zeigeOderMelde(ergebnis);
    if (ergebnis.status === "ok") {
      prozessMarkiere("Ergebnis sichern");
      await warten(300);
      prozessMarkiere("Freigabe durch einen Menschen");
    }
  } catch (fehler) {
    el("antwort-status").textContent = "Nicht uebernommen: " + fehler.message;
    setzeMaschinenStatus("fehler");
  }
}

function zeigeOderMelde(ergebnis) {
  if (ergebnis.status === "ok") {
    zeigeErgebnis();
    return;
  }
  el("kopfzeile").innerHTML = "<span><b>Kein Ergebnis:</b> " + esc(ergebnis.meldung || "") + "</span>";
  el("sicht-tabs").innerHTML = "";
  el("sicht-inhalt").innerHTML = '<p class="hinweis">Die Maschine hat abgebrochen, weil eine '
    + "Voraussetzung fehlt. Die Schritte oben zeigen genau, an welcher Stelle.</p>";
  el("ergebnis").classList.remove("versteckt");
}

/* ---------- Ausgabe: vier Sichten ---------- */

function setzeAnalyseZurueck() {
  zeigeEntwicklungsFortschritt(0, true);
  setzeMaschinenStatus("bereit");
  Z.ergebnis = null;
  Z.sicht = "mgmt";
  Z.auswahl = new Set();
  Z.freigegeben = null;
  el("ergebnis").classList.add("versteckt");
  el("sicht-tabs").replaceChildren();
  el("sicht-inhalt").replaceChildren();
  el("kopfzeile").replaceChildren();
  el("aktions-status").textContent = "";
  el("btn-freigabe").disabled = true;
  el("btn-freigabe").classList.add("versteckt");
  prozessZuruecksetzen();
}

function uebernehmeAnalyseErgebnis(ergebnis) {
  // Antwortvorlagen und mitgelieferte Freigaben duerfen keinen neuen Lauf freischalten.
  Z.ergebnis = JSON.parse(JSON.stringify(ergebnis));
  Z.ergebnis.manifest = Z.ergebnis.manifest || {};
  Z.ergebnis.manifest.freigabe = { status: "Entwurf" };
}

function zoneBadge(zone) {
  if (!zone) return "-";
  return '<span class="zone" style="background:' + esc(zone.farbe) + '">' + esc(zone.label) + "</span>";
}

function zeigeErgebnis() {
  const e = Z.ergebnis;
  if (!e || e.status !== "ok") return;
  if (!Z.freigegeben) Z.sicht = "mgmt";
  const freigabe = (e.manifest.freigabe && e.manifest.freigabe.status) || "Entwurf";
  const parameter = Object.keys(e.manifest.parameter || {})
    .map((k) => k + " " + e.manifest.parameter[k]).join(" · ");
  el("kopfzeile").innerHTML = [
    ["Person", e.person.name],
    ["Lauf", e.lauf_id],
    ["Modell", (e.modell || {}).name || Z.quelle],
    ["Quelle", Z.quelle === "vorbereitet" ? "vorbereitete Antwort" : Z.quelle],
    ["Datenstand", e.manifest.datenstand],
    ["Freigabe", freigabe],
    ["Parameter", parameter]
  ].map((paar) => "<span>" + esc(paar[0]) + ": <b>" + esc(paar[1]) + "</b></span>").join("");

  const sichten = AUSGABE.sichten || [];
  const tabs = el("sicht-tabs");
  tabs.innerHTML = "";
  sichten.forEach((s) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = s.titel;
    b.dataset.sicht = s.id;
    b.disabled = s.id !== "mgmt" && !Z.freigegeben;
    if (b.disabled) b.title = "Wird nach Freigabe von ein oder zwei Vorschlaegen durch das Management aktiv.";
    if (Z.sicht === s.id) b.className = "aktiv";
    b.addEventListener("click", () => {
      if (s.id !== "mgmt" && !Z.freigegeben) return;
      Z.sicht = s.id; zeigeErgebnis();
    });
    tabs.appendChild(b);
  });
  const sicht = sichten.find((s) => s.id === Z.sicht) || sichten[0];
  el("sicht-inhalt").innerHTML = sichtInhalt(sicht ? sicht.id : "mgmt");
  el("btn-freigabe").classList.toggle("versteckt", Z.sicht !== "mgmt");
  el("btn-freigabe").disabled = !!Z.freigegeben || Z.auswahl.size < 1 || Z.auswahl.size > 2;
  if (Z.sicht === "mgmt") bindeZeilen();
  el("ergebnis").classList.remove("versteckt");
}

function sichtInhalt(id) {
  if (id !== "mgmt" && !Z.freigegeben) return "";
  if (id === "hr") return sichtHR();
  if (id === "br") return sichtBR();
  if (id === "ma") return sichtMitarbeiter();
  return sichtManagement();
}

function sichtManagement() {
  const e = Z.ergebnis;
  let h = '<p class="hinweis">Entscheidungsgrundlage: Was lohnt sich, was kostet es, was ist '
        + "regelkonform. Zeile anklicken zeigt den Rechenweg.</p>";
  h += '<p class="freigabe-hinweis">' + (Z.freigegeben
    ? "Management hat " + Z.auswahl.size + " Vorschlag/Vorschlaege freigegeben. Die anderen Reiter zeigen ausschliesslich diese Auswahl. Eine Aenderung der Auswahl hebt die Freigabe auf."
    : "Bitte ein oder zwei Vorschlaege auswaehlen und freigeben. Danach werden HR, Betriebsrat und Mitarbeiter auf Basis dieser Auswahl aktiv.")
    + "</p>";
  h += "<table><thead><tr><th>Auswahl</th><th>Rang</th><th>Vakanz</th><th>Match vorher</th><th>Match nachher</th>"
    + "<th>Max in Progress (Job)</th><th>Zuwachs (Training)</th><th>Kosten belastbar</th><th>Zone</th></tr></thead><tbody>";
  e.ergebnisse.forEach((r, i) => {
    const w = r.weiterbildung || {};
    h += '<tr class="zeile-klick" data-v="' + esc(r.vakanz_id) + '"><td><input type="checkbox" class="vorschlag-auswahl" data-v="'
      + esc(r.vakanz_id) + '" aria-label="Vorschlag ' + esc(r.titel) + ' auswaehlen"'
      + (Z.auswahl.has(r.vakanz_id) ? " checked" : Z.auswahl.size >= 2 ? " disabled" : "")
      + '></td><td>' + (i + 1) + "</td><td>"
      + esc(r.titel) + "</td><td>" + pct(r.vorher.match) + "</td><td><b>" + pct(r.nachher.match)
      + "</b></td><td>" + pct(r.nachher.kern_match) + "</td><td>+"
      + String(r.zuwachs).replace(".", ",") + "</td><td>"
      + (w.kosten_belastbar_brutto ? euro(w.kosten_belastbar_brutto) : "offen")
      + "</td><td>" + zoneBadge(r.zone) + "</td></tr>";
  });
  h += "</tbody></table>";
  h += '<p class="hinweis">Zonen: unter 50 % kein sinnvoller Weg · 50 bis 64 % nur mit '
    + "Ausnahmeentscheidung · 65 bis 79 % Wirtschaftlichkeit pruefen · ab 80 % Ziel erreicht. "
    + "Die Schwellen stehen in den Parametern (SCHWELLEN).</p>";
  h += '<div id="detail-bereich"></div>';
  return h;
}

function bindeZeilen() {
  const bereich = el("detail-bereich");
  if (!bereich) return;
  Array.from(document.querySelectorAll(".vorschlag-auswahl")).forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const id = checkbox.dataset.v;
      if (checkbox.checked && Z.auswahl.size < 2) Z.auswahl.add(id);
      else Z.auswahl.delete(id);
      Z.freigegeben = null;
      Z.ergebnis.manifest.freigabe = { status: "Entwurf" };
      el("aktions-status").textContent = Z.auswahl.size + " von maximal 2 Vorschlaegen ausgewaehlt.";
      zeigeErgebnis();
    });
  });
  Array.from(document.querySelectorAll("tr.zeile-klick")).forEach((tr) => {
    tr.addEventListener("click", (ereignis) => {
      if (ereignis.target.closest("input")) return;
      const r = Z.ergebnis.ergebnisse.find((x) => x.vakanz_id === tr.dataset.v);
      if (r) bereich.innerHTML = detailVakanz(r);
    });
  });
}

function detailVakanz(r) {
  let h = '<div class="detail"><h4>' + esc(r.vakanz_id) + " · " + esc(r.titel)
        + " — Rechenweg</h4>";
  h += "<table><thead><tr><th>Skill</th><th>Soll</th><th>Ist</th><th>Gewicht</th><th>Erfuellung</th>"
    + "<th></th><th>Hinweis</th></tr></thead><tbody>";
  (r.nachher.skills || []).forEach((s) => {
    h += "<tr><td>" + esc(s.skill) + "</td><td>" + s.soll + "</td><td>"
      + (s.ist === null || s.ist === undefined ? "nicht belegt" : s.ist) + "</td><td>" + s.gewicht
      + "</td><td>" + pct(s.erfuellung) + '</td><td><div class="balken-mini"><span style="width:'
      + s.erfuellung + '%"></span></div></td><td>' + (s.kern ? "Kern-Skill " : "")
      + (s.ungeprueft ? "· vor Entscheidung pruefen" : "") + "</td></tr>";
  });
  h += "</tbody></table>";
  h += '<h4 style="margin-top:14px">Zu- und Abschlaege</h4><ul class="schlicht">';
  (r.vorher.zuschlaege || []).forEach((z) => {
    h += "<li><b>" + (z.punkte > 0 ? "+" : "") + z.punkte + "</b> — " + esc(z.detail) + "</li>";
  });
  h += "</ul>";
  h += '<p class="hinweis">Skill-Match ' + pct(r.vorher.skill_match) + " · Zu-/Abschlaege "
    + (r.vorher.zuschlagssumme > 0 ? "+" : "") + r.vorher.zuschlagssumme + " · Match vorher "
    + pct(r.vorher.match) + " · nach Weiterbildung " + pct(r.nachher.match) + " ("
    + esc(r.zone ? r.zone.empfehlung : "") + ")</p>";
  h += "</div>";
  return h;
}

function sichtHR() {
  const e = Z.freigegeben;
  if (!e) return "";
  let h = '<p class="hinweis">Umsetzung: Was ist zu buchen, was ist zu klaeren, wer gibt frei.</p>';
  e.ergebnisse.forEach((r) => {
    const w = r.weiterbildung || {};
    h += '<div class="detail"><h4>' + esc(r.vakanz_id) + " · " + esc(r.titel) + " — "
      + pct(r.nachher.match) + " nach Weiterbildung</h4>";
    if (!(w.kurse || []).length) {
      h += '<p class="hinweis">Kein Angebot in der Kursbasis. Die Luecken sind betrieblich zu '
        + "schliessen (Einarbeitung, Herstellerschulung).</p>";
    } else {
      h += "<table><thead><tr><th>Angebots-ID</th><th>Anbieter</th><th>Angebot</th><th>Zielniveau</th>"
        + "<th>Format / Zeit</th><th>Kosten</th><th>Preisstatus</th></tr></thead><tbody>";
      w.kurse.forEach((k) => {
        h += "<tr><td><b>" + esc(k.id) + "</b></td><td>" + esc(k.anbieter) + "</td><td>"
          + esc(k.name) + "</td><td>" + esc(k.zielniveau) + "</td><td>" + esc(k.lernformat) + " · "
          + txt(k.kontaktstunden) + " · " + txt(k.kalenderdauer) + "</td><td>"
          + (k.brutto ? euro(k.brutto) : "offen") + "</td><td>" + esc(k.preisstatus) + "</td></tr>";
      });
      h += "</tbody></table>";
    }
    h += '<ul class="schlicht">'
      + "<li><b>Betriebliche Einarbeitung:</b> " + esc(txt(w.betriebliche_einarbeitung)) + "</li>"
      + "<li><b>Arbeitsprobe:</b> " + esc(txt(w.arbeitsprobe)) + "</li>"
      + "<li><b>Restluecken:</b> " + esc(txt(w.restluecken)) + "</li>"
      + "<li><b>Kosten belastbar:</b> " + (w.kosten_belastbar_brutto
          ? euro(w.kosten_belastbar_brutto) : "keine belastbare Angabe") + "</li></ul>";
    if ((w.offene_kosten || []).length) {
      h += '<p class="hinweis">Offen: ' + esc(w.offene_kosten.join(" · ")) + "</p>";
    }
    h += "</div>";
  });
  h += "<h4>Aufgabenliste fuer HR</h4><ul class=\"schlicht\">";
  const offen = [];
  e.ergebnisse.forEach((r) => ((r.weiterbildung || {}).offene_kosten || [])
    .forEach((o) => offen.push(r.vakanz_id + ": " + o)));
  (e.offene_pruefungen || []).forEach((s) => offen.push("Ist-Niveau pruefen: " + s));
  if (!offen.length) h += "<li>keine offenen Punkte</li>";
  offen.forEach((o) => { h += "<li>" + esc(o) + "</li>"; });
  h += "</ul>";
  h += '<p class="hinweis">Freigabestatus: '
    + esc((e.manifest.freigabe && e.manifest.freigabe.status) || "Entwurf")
    + " · Grundlage sind die vom Management freigegebenen Vorschlaege.</p>";
  return h;
}

function sichtBR() {
  const e = Z.freigegeben;
  if (!e) return "";
  const br = e.br || {};
  let h = '<p class="hinweis">Transparenz: Welche Felder wurden verwendet, welche nicht, welche '
        + "Regeln haben gewirkt. Die No-Liste pflegt der Betriebsrat in den Parametern "
        + "(BETRIEBSRAT, Regel-IDs BR-001 ff.).</p>";
  h += '<h4>Freigegebene Vorschlaege</h4><ul class="schlicht">'
    + e.ergebnisse.map((r) => "<li>" + esc(r.vakanz_id) + " · " + esc(r.titel) + "</li>").join("") + "</ul>";
  h += '<div class="spalte"><div><h4>Verwendete Felder</h4>'
    + "<table><thead><tr><th>ID</th><th>Feld</th><th>Wirkung</th></tr></thead><tbody>";
  (br.verwendete_felder || []).forEach((f) => {
    h += "<tr><td>" + esc(f.id) + "</td><td>" + esc(f.bezeichnung) + "</td><td>" + esc(f.wirkung)
      + (f.hinweis ? " (" + esc(f.hinweis) + ")" : "") + "</td></tr>";
  });
  h += "</tbody></table></div><div><h4>Ausgeschlossene Felder (No-Liste)</h4>"
    + "<table><thead><tr><th>ID</th><th>Feld</th><th>Regel</th></tr></thead><tbody>";
  (br.ausgeschlossene_felder || []).forEach((f) => {
    h += "<tr><td>" + esc(f.id) + "</td><td>" + esc(f.bezeichnung) + "</td><td>" + esc(f.regel)
      + "</td></tr>";
  });
  h += "</tbody></table></div></div>";
  h += "<h4>Ausgeloeste Regeln</h4>";
  (br.regeln || []).forEach((r) => {
    h += '<div class="regel"><span class="tag ' + esc(r.status) + '">' + esc(r.status) + "</span><b>"
      + esc(r.regel) + " " + esc(r.titel) + "</b><span>" + esc(r.detail) + "</span></div>";
  });
  h += '<h4 style="margin-top:14px">Lauf-Manifest</h4><ul class="schlicht">'
    + "<li><b>Lauf:</b> " + esc(e.manifest.lauf_id) + " · " + esc(e.manifest.zeitpunkt) + "</li>"
    + "<li><b>Modell:</b> " + esc((e.modell || {}).name || "-") + " · Quelle: " + esc(Z.quelle)
    + "</li><li><b>Datenstand:</b> " + esc(e.manifest.datenstand) + "</li>"
    + "<li><b>Parameterfassungen:</b> "
    + esc(Object.keys(e.manifest.parameter || {}).map((k) => k + " " + e.manifest.parameter[k])
        .join(" · ")) + "</li>"
    + "<li><b>Freigabe:</b> "
    + esc((e.manifest.freigabe && e.manifest.freigabe.status) || "Entwurf") + "</li></ul>";
  h += '<p class="hinweis">Das Ergebnis ist eine Sicht und eine Entscheidungsgrundlage - keine '
    + "automatische Entscheidung. Zweckbindung, Freiwilligkeit und Transparenz sind in den globalen "
    + "Regeln hinterlegt.</p>";
  return h;
}

function sichtMitarbeiter() {
  const e = Z.freigegeben;
  if (!e) return "";
  const sichtbar = e.ergebnisse;
  let h = '<p class="hinweis">Dies ist ein Angebot, keine Verpflichtung. Gezeigt werden nur Wege, '
        + "die das Management fuer Sie freigegeben hat.</p>";
  if (!sichtbar.length) {
    h += '<p class="hinweis">Aktuell gibt es keine Option oberhalb der Schwelle fuer diese Sicht. '
      + "Ein Gespraech mit HR ist jederzeit moeglich.</p>";
    return h;
  }
  h += "<h4>Ihre Staerken</h4><ul class=\"schlicht\">";
  ((e.motivation || {}).staerken || []).forEach((s) => { h += "<li>" + esc(s) + "</li>"; });
  h += "</ul>";
  sichtbar.forEach((r) => {
    h += '<div class="detail"><h4>' + esc(r.titel) + " — Eignung " + pct(r.nachher.match) + "</h4>";
    h += "<p>" + esc(r.zone ? r.zone.empfehlung : "") + "</p>";
    const kurse = (r.weiterbildung || {}).kurse || [];
    if (kurse.length) {
      h += "<ul class=\"schlicht\">";
      kurse.forEach((k) => {
        h += "<li>" + esc(k.name) + " (" + esc(k.anbieter) + ", " + esc(k.lernformat) + ") — "
          + (k.brutto ? "Kosten uebernimmt das Unternehmen" : "Kosten werden noch geklaert") + "</li>";
      });
      h += "</ul>";
    } else {
      h += "<p>Die Qualifizierung erfolgt im Betrieb durch Einarbeitung und Fachexpertise.</p>";
    }
    h += "</div>";
  });
  h += '<p class="hinweis">Naechster Schritt: Gespraech mit Ihrer Fuehrungskraft oder HR. '
    + "Die Teilnahme ist freiwillig.</p>";
  return h;
}

/* ---------- Prozess: der Ablauf als verfolgbares Flussdiagramm ---------- */

const PROZESS = [
  { kurz: "P", titel: "Vorbereitung - einmalig, durch uns", art: "p", schritte: [
    { id: "P1", titel: "Datenbasis bereitstellen", wer: "Consultant",
      kurz: "Akten, sechs Zielvakanzen aus der Jobboerse der Unternehmen und die Kursbasis.",
      detail: { tut: "Wir legen drei Dinge an einen Ort: die Personalakten, die sechs Zielvakanzen "
          + "aus den oeffentlichen Stellenausschreibungen der Unternehmen (Jobboerse bzw. "
          + "Karriereseite) und die Kursbasis der Bildungsanbieter.",
        eingang: "10 Personalakten, 6 Stellenausschreibungen der Zielunternehmen, Kursbasis",
        ausgang: "Datenbasis\\ mit daten.json, felder.json und den Vakanzen",
        regel: "Die Vakanzen stammen aus echten Stellenausschreibungen und sind vollstaendig "
          + "anonymisiert: kein Firmenname, keine Personen, keine Kontakte, keine Gehaelter.",
        ort: "Prozessengine/P1_Datenbasis_bereitstellen.md" } },
    { id: "P2", titel: "Parameter schaerfen", wer: "Consultant, BR, Management",
      kurz: "Prompt, No-Liste, Schwellen, Formel, Ausgabe, Weiterbildung, Ist-Profile, Modelle.",
      detail: { tut: "Hier steckt unser Fachwissen: Wir setzen den Auftragstext, die No-Liste des "
          + "Betriebsrats, die Schwellen, die Rechenformel, die Sichten, die Zuordnung der "
          + "Weiterbildung und die Modellauswahl.",
        eingang: "Erfahrung aus der Praxis, Mitbestimmung, Rechtsrahmen",
        ausgang: "parameter.js - die eine Datei, die die Maschine liest",
        regel: "Der Betriebsrat pflegt seine No-Liste, das Management Schwellen, Kosten und Regeln, "
          + "wir Formel und Prompt.",
        ort: "Reiter Parameter - Schaltflaeche Speichern",
        wenn: "Fehlerhaftes JSON wird abgewiesen und nicht gespeichert." } },
    { id: "P3", titel: "Antworten vorbereiten (optional)", wer: "Consultant",
      kurz: "Antwortdateien fuer die Vorstellung vorbereiten und pruefen.",
      detail: { tut: "Wir bereiten die Antwortdateien fuer die ausgewaehlten Personen vor "
          + "und pruefen Struktur, Vollstaendigkeit und Zuordnung.",
        ausgang: "app\\antworten\\antwort_<Name>.js",
        regel: "Antwortdateien muessen vollstaendig und der richtigen Person zugeordnet sein.",
        ort: "Prozessengine/P3_Antworten_vorbereiten.md" } }
  ] },
  { kurz: "A", titel: "Auftrag - je Analyse", art: "a", schritte: [
    { id: "A1", titel: "Mitarbeiter waehlen", wer: "HR, Consultant",
      kurz: "Die Maschine nimmt Akte, Ist-Profil und Arbeitsumfang der Person.",
      detail: { tut: "Wir waehlen die Person. Die Maschine zieht Personalakte, hinterlegtes "
          + "Ist-Profil und Umfang heran.",
        eingang: "Personalakte, Ist-Profil",
        ausgang: "Personenkennung, zum Beispiel Jens_Habermann",
        regel: "Fehlt ein Ist-Profil, laeuft es trotzdem: das Modell leitet es aus der Akte ab.",
        ort: "Reiter Mainswitch - Auswahlfeld Mitarbeiter" } },
    { id: "A2", titel: "Modell und Quelle waehlen", wer: "Consultant",
      kurz: "Zwei Wege zur Antwort: Lokale KI (Ollama) oder ChatGPT mit API-Key.",
      detail: { tut: "Wir waehlen die Antwortquelle. Lokale KI laeuft auf diesem Rechner (Ollama), "
          + "ChatGPT braucht einen API-Key.",
        ausgang: "Modellkennung und Quelle fuer das Manifest",
        regel: "Der Schluessel bleibt im Browser und steht in keiner Datei.",
        ort: "Reiter Mainswitch - Auswahlfelder KI-Modell und Antwortquelle" } }
  ] },
  { kurz: "M", titel: "Maschine - Vorlauf und Sicherheitsgurte", art: "m", schritte: [
    { id: "M1", titel: "Prompt bauen", wer: "Maschine",
      kurz: "Auftrag, alle Parameter, Akte, Ist-Profil, sechs Vakanzen und Kursbasis in einem Text.",
      detail: { tut: "Die Maschine setzt den vollstaendigen Auftrag zusammen und zeigt ihn an.",
        eingang: "Prompt, Parameter, Akte, Vakanzen, Kursbasis",
        ausgang: "ein Prompt von ueber 100.000 Zeichen, nachlesbar",
        regel: "Das Modell rechnet nicht selbst: es liest, ordnet zu und formuliert.",
        ort: "Prozessengine/M1_Prompt_bauen.md" } },
    { id: "M2", titel: "Antwort holen", wer: "Maschine",
      kurz: "Die Antwort kommt aus der gewaehlten Quelle und wird als JSON uebernommen.",
      detail: { tut: "Bei 'Lokale KI' geht die Anfrage an Ollama auf diesem Rechner, bei 'ChatGPT' "
          + "an die OpenAI-Schnittstelle. Das JSON-Format wird erzwungen.",
        regel: "Ist kein Modell erreichbar, meldet die Maschine das im Klartext.",
        wenn: "HTTP-Fehler oder unlesbares JSON - Abbruch mit Klartext.",
        ort: "Prozessengine/M2_Antwort_holen.md" } },
    { id: "M3", titel: "Struktur pruefen", wer: "Maschine",
      kurz: "Pflichtfelder muessen da sein, sonst laeuft nichts weiter.",
      detail: { tut: "Geprueft werden status, lauf_id, person, br, ist_profil, begruendungen, "
          + "ergebnisse, schritte und manifest.",
        regel: "Fehlt ein Feld oder ist die Ergebnisliste leer, bricht die Maschine ab.",
        ort: "Prozessengine/M3_Struktur_pruefen.md" } },
    { id: "M4", titel: "Ist-Profil pruefen", wer: "Maschine",
      kurz: "Berechnung Anzahl Skills, mit Niveau und Begruendung - Grundlage jeder Rechnung.",
      detail: { tut: "Die Maschine nimmt die hinterlegten Skills mit Niveau und Begruendung. "
          + "Niveau 4 heisst koennen und anleiten, 3 selbststaendig, 2 mit Anleitung, "
          + "1 Grundkenntnis.",
        ausgang: "Ist-Niveau je Skill mit Quelle",
        regel: "Jede Angabe braucht eine Begruendung aus der Akte - sonst gilt sie nicht.",
        ort: "Prozessengine/M4_Ist_Profil_pruefen.md" } },
    { id: "M5", titel: "No-Liste des Betriebsrats anwenden", wer: "Maschine",
      kurz: "Drei Felder gesperrt, zwoelf Regeln geprueft - der Sicherheitsgurt.",
      detail: { tut: "Bevor gerechnet wird, greift die No-Liste: gesperrte Felder werden nicht "
          + "verwendet, die Regeln BR-001 ff. werden geprueft und ausgewiesen.",
        eingang: "10_betriebsrat.json - No-Liste und Regeln",
        ausgang: "verwendete und ausgeschlossene Felder, fuer den Betriebsrat einsehbar",
        regel: "Was auf der No-Liste steht, ist kein Merkmal der Person.",
        ort: "Reiter Parameter - Betriebsrat; Sicht Betriebsrat im Ergebnis" } },
    { id: "M6", titel: "Abstimmung und harte Ausschluesse", wer: "Maschine, BR",
      kurz: "Grenzwerte, Ausbildung, Arbeitszeit, Sprache, Standortwechsel.",
      detail: { tut: "Die Maschine prueft die formalen Anforderungen und markiert Grenzfaelle als "
          + "Abstimmung mit dem Betriebsrat. Ein Standortwechsel kostet 15 Punkte.",
        ausgang: "Kennzeichnung 'Abstimmung noetig' oder harter Ausschluss",
        regel: "Harte Ausschluesse sind nicht ueber Weiterbildung heilbar - sie werden benannt.",
        ort: "Prozessengine/M6_Abstimmung_und_Ausschluesse.md" } },
    { id: "M7", titel: "Zielvakanzen lesen", wer: "Maschine",
      kurz: "Sechs Vakanzen mit 56 Soll-Skills, anonymisiert.",
      detail: { tut: "Die Soll-Profile der sechs Vakanzen werden gelesen: Skills, formale "
          + "Anforderungen, Rahmen.",
        ausgang: "Soll-Profil je Vakanz",
        regel: "Die Vakanzen stammen aus den Stellenausschreibungen der Unternehmen (Jobboerse) "
          + "und tragen keine Firmennamen - Anonymitaet auf drei Ebenen geprueft.",
        ort: "Prozessengine/M7_Zielvakanzen_lesen.md" } }
  ] },
  { kurz: "M", titel: "Maschine - je Vakanz, sechsmal", art: "m", schritte: [
    { id: "M8", titel: "Skill-Luecken bilden", wer: "Maschine",
      kurz: "Soll gegen Ist: was fehlt, was ist da, was ist sogar staerker.",
      detail: { tut: "Je Vakanz wird Skill fuer Skill verglichen und die Luecke mit Zielniveau "
          + "notiert.",
        ausgang: "Lueckenliste je Vakanz",
        regel: "Das Zielniveau der Vakanz bestimmt das Gewicht: 4 zaehlt dreifach, 3 doppelt, "
          + "sonst einfach.",
        ort: "Prozessengine/M8_Skill_Luecken_bilden.md" } },
    { id: "M9", titel: "Weiterbildung zuordnen", wer: "Maschine",
      kurz: "Zu jeder Luecke ein echtes Angebot - mit Anbieter-ID, Dauer und Preis.",
      detail: { tut: "Die Maschine sucht passende Angebote ausschliesslich in der Kursbasis.",
        ausgang: "Kurse mit ID, Format, Kontaktstunden, Dauer, Preis und Preisstatus",
        regel: "Keine erfundenen Kurse. Fehlt ein Angebot, steht das ausdruecklich als Luecke "
          + "im Betrieb - etwa Einarbeitung oder Herstellerschulung.",
        ort: "Prozessengine/M9_Weiterbildung_zuordnen.md" } },
    { id: "M10", titel: "Match rechnen", wer: "Maschine",
      kurz: "Erfuellung je Skill (100, 50, 0 Prozent), gewichtet, plus Zu- und Abschlaege.",
      detail: { tut: "Der Rechenkern bildet den Wert vorher und nachher. Zuschlaege und "
          + "Abschlaege kommen aus der Formel: formale Anforderung, Arbeitszeit, Sprache, "
          + "Branche, Standortwechsel minus 15.",
        ausgang: "match vorher und match nachher je Vakanz",
        regel: "Die Formel steht offen in der Parameterdatei und ist nachrechenbar.",
        ort: "Prozessengine/M10_Match_rechnen.md" } },
    { id: "M11", titel: "Zone bestimmen", wer: "Maschine",
      kurz: "Unter 50 kein sinnvoller Weg, 50 bis 64 Wirtschaftlichkeit pruefen, 65 bis 79 Ziel erreicht, ab 80 gut.",
      detail: { tut: "Aus dem Wert wird eine Zone mit Farbe und Empfehlung.",
        ausgang: "Zonenlabel je Vakanz",
        ort: "Prozessengine/M11_Zone_bestimmen.md" } }
  ] },
  { kurz: "M", titel: "Maschine - Abschluss", art: "m", schritte: [
    { id: "M12", titel: "Rangliste bilden", wer: "Maschine",
      kurz: "Die sechs Ergebnisse werden sortiert - bei Jens Habermann fuehrt Office-Management mit 84,1 Prozent.",
      detail: { tut: "Die Maschine sortiert absteigend und hebt das beste Ergebnis hervor.",
        ort: "Prozessengine/M12_Rangliste_bilden.md" } },
    { id: "M13", titel: "Sichten erzeugen", wer: "Maschine",
      kurz: "Zuerst nur Management; weitere Sichten nach Freigabe von ein oder zwei Vorschlaegen.",
      detail: { tut: "Management sieht die gesamte Rangliste. HR, Betriebsrat und Mitarbeiter "
          + "werden erst nach der Auswahl und Freigabe durch Management erzeugt.",
        regel: "Die weiteren Sichten enthalten ausschliesslich die freigegebenen Vorschlaege, beim Mitarbeiter ohne Ranking.",
        ort: "Prozessengine/M13_Sichten_erzeugen.md" } },
    { id: "M14", titel: "Ergebnis sichern und Manifest", wer: "Maschine",
      kurz: "Lauf-Nummer, Modell, Parameterfassungen, Freigabe - unser Nachweis.",
      detail: { tut: "Jeder Lauf bekommt eine Nummer und ein Manifest. Damit ist belegbar, womit "
          + "gerechnet wurde.",
        ausgang: "ergebnis_<Name>_<Lauf-ID>.json",
        regel: "Gleiche Parameter, gleiches Ergebnis - der Lauf ist wiederholbar.",
        ort: "Reiter Mainswitch - Schaltflaeche Ergebnis als Datei speichern" } }
  ] },
  { kurz: "E", titel: "Entscheidung - der Mensch", art: "e", schritte: [
    { id: "E1", titel: "Freigabe durch einen Menschen", wer: "Management",
      kurz: "Management waehlt ein oder zwei Vorschlaege aus und gibt die weiteren Sichten frei.",
      detail: { tut: "Management prueft und gibt die Auswahl frei. Name, Zeitpunkt und Vakanz-IDs "
          + "landen im Manifest. Eine neue Analyse setzt die Freigabe zurueck.",
        regel: "EU-KI-Verordnung und Artikel 22 DSGVO: keine Entscheidung allein durch die Maschine.",
        ort: "Reiter Mainswitch - Schaltflaeche Auswahl freigeben (Management)" } },
    { id: "E2", titel: "Gespraech und Mitteilung", wer: "HR, Fuehrungskraft",
      kurz: "Das Ergebnis wird zum Angebot: freiwillig, mit Weiterbildung und Kosten.",
      detail: { tut: "Die Zahlen gehen in ein Gespraech. Der Mitarbeiter sieht die Wege, die zu "
          + "ihm passen, samt Qualifizierung.",
        regel: "Kein Zwang und kein Automatismus - die Teilnahme ist freiwillig.",
        ort: "Prozessengine/E2_Gespraech_und_Mitteilung.md" } },
    { id: "E3", titel: "Wirkung pruefen und nachschaerfen", wer: "Consultant, HR, BR",
      kurz: "Ist-Niveau nachziehen, echte Kosten eintragen, Parameter nachziehen.",
      detail: { tut: "Nach der Umsetzung wird nachgehalten: hat die Weiterbildung gewirkt, was "
          + "hat sie wirklich gekostet, was muss an der Maschine besser werden.",
        ausgang: "Rueckkopplung auf P2 - die Maschine wird von Lauf zu Lauf genauer.",
        ort: "Prozessengine/E3_Wirkung_pruefen.md" } }
  ] }
];

let prozessTakt = null;
const PROZESS_KNOTEN = {};

/* Zeichnung des Flussdiagramms: Baender (Phasen), Kaesten, Kanten, Beschriftungen. */

const FLUSS_BAND = [
  { kurz: "P", text: "Vorbereitung - einmalig, durch uns", y: 40, h: 280 },
  { kurz: "A", text: "Auftrag - je Analyse", y: 332, h: 184 },
  { kurz: "M", text: "Maschine - je Lauf", y: 528, h: 1122 },
  { kurz: "E", text: "Entscheidung - der Mensch", y: 1660, h: 300 }
];

const FLUSS = [
  { id: "P1", x: 110, y: 70, w: 300, h: 58, form: "daten", farbe: "#8fa4bd",
    zeilen: ["Datenbasis bereitstellen", "Akten, Jobboerse, Kursbasis"] },
  { id: "P2", x: 110, y: 158, w: 300, h: 58, form: "prozess", farbe: "#8fa4bd",
    zeilen: ["Parameter schaerfen", "Prompt, No-Liste, Schwellen, Formel"] },
  { id: "P3", x: 110, y: 246, w: 300, h: 58, form: "prozess", farbe: "#8fa4bd",
    zeilen: ["Antworten vorbereiten", "optional, fuer die Vorstellung"] },
  { id: "A1", x: 110, y: 362, w: 300, h: 58, form: "daten", farbe: "#9fc0e8",
    zeilen: ["Mitarbeiter waehlen", "Akte, Ist-Profil, Umfang"] },
  { id: "A2", x: 110, y: 450, w: 300, h: 58, form: "prozess", farbe: "#9fc0e8",
    zeilen: ["Modell und Quelle waehlen", "vorbereitet, live, einfuegen"] },
  { id: "M1", x: 110, y: 558, w: 300, h: 58, form: "prozess", farbe: "#35b0aa",
    zeilen: ["Prompt bauen", "Auftrag und alle Parameter"] },
  { id: "M2", x: 110, y: 646, w: 300, h: 58, form: "prozess", farbe: "#35b0aa",
    zeilen: ["Antwort holen", "JSON aus der gewaehlten Quelle"] },
  { id: "M3", x: 110, y: 734, w: 300, h: 58, form: "prozess", farbe: "#35b0aa",
    zeilen: ["Struktur pruefen", "Pflichtfelder vollstaendig?"] },
  { id: "M4", x: 110, y: 822, w: 300, h: 58, form: "prozess", farbe: "#35b0aa",
    zeilen: ["Ist-Profil pruefen", "Skills mit Niveau und Beleg"] },
  { id: "M5", x: 110, y: 910, w: 300, h: 64, form: "pruefung", farbe: "#35b0aa",
    zeilen: ["No-Liste anwenden", "Betriebsrat: Felder gesperrt?"] },
  { id: "M6", x: 110, y: 1012, w: 300, h: 64, form: "pruefung", farbe: "#35b0aa",
    zeilen: ["Abstimmung noetig?", "Grenzwert, Ausbildung, Standort"] },
  { id: "M7", x: 110, y: 1114, w: 300, h: 58, form: "prozess", farbe: "#35b0aa",
    zeilen: ["Zielvakanzen lesen", "6 Soll-Profile, 56 Skills"] },
  { id: "M8", x: 160, y: 1230, w: 200, h: 58, form: "prozess", farbe: "#35b0aa",
    zeilen: ["Skill-Luecken", "Soll gegen Ist"] },
  { id: "M9", x: 390, y: 1230, w: 200, h: 58, form: "prozess", farbe: "#35b0aa",
    zeilen: ["Weiterbildung", "echte Angebote mit ID"] },
  { id: "M10", x: 620, y: 1230, w: 200, h: 58, form: "prozess", farbe: "#35b0aa",
    zeilen: ["Match rechnen", "gewichtet, nach Formel"] },
  { id: "M11", x: 850, y: 1227, w: 200, h: 64, form: "pruefung", farbe: "#35b0aa",
    zeilen: ["Zone bestimmen", "50 / 65 / 80 Prozent"] },
  { id: "M12", x: 110, y: 1390, w: 300, h: 58, form: "prozess", farbe: "#35b0aa",
    zeilen: ["Rangliste bilden", "6 Ergebnisse sortiert"] },
  { id: "M13", x: 110, y: 1478, w: 300, h: 58, form: "prozess", farbe: "#35b0aa",
    zeilen: ["Sichten erzeugen", "Management, HR, BR, Mitarbeiter"] },
  { id: "M14", x: 110, y: 1566, w: 300, h: 58, form: "daten", farbe: "#35b0aa",
    zeilen: ["Ergebnis und Manifest", "Lauf-ID, Modell, Freigabe"] },
  { id: "E1", x: 110, y: 1690, w: 300, h: 64, form: "pruefung", farbe: "#f0c36d",
    zeilen: ["Freigabe durch Mensch", "ohne Freigabe bleibt Entwurf"] },
  { id: "E2", x: 110, y: 1792, w: 300, h: 58, form: "prozess", farbe: "#f0c36d",
    zeilen: ["Gespraech und Mitteilung", "Angebot, freiwillig"] },
  { id: "E3", x: 110, y: 1880, w: 300, h: 58, form: "ende", farbe: "#f0c36d",
    zeilen: ["Wirkung pruefen", "zurueck zu Parameter"] },
  { id: "X1", x: 470, y: 1013, w: 300, h: 58, form: "prozess", farbe: "#c0392b",
    ort: "Prozessengine/X1_Vakanz_nicht_weiterverfolgen.md",
    zeilen: ["Vakanz nicht weiterverfolgen", "harter Ausschluss"],
    info: "Dieser Weg endet hier: eine harte Anforderung laesst sich nicht ueber Weiterbildung "
      + "schliessen. Die Vakanz wird nicht weiterverfolgt, die uebrigen laufen weiter." },
  { id: "X2", x: 470, y: 1693, w: 300, h: 58, form: "prozess", farbe: "#c0392b",
    ort: "Prozessengine/X2_Entwurf_ohne_Umsetzung.md",
    zeilen: ["Entwurf - keine Umsetzung", "Nacharbeit noetig"],
    info: "Kein Ergebnis ohne Freigabe: der Lauf bleibt Entwurf, die Freigabe wird nachgeholt." }
];

const FLUSS_KANTEN = [
  { d: "M260 128 V158" },
  { d: "M260 216 V246" },
  { d: "M260 304 V362" },
  { d: "M260 420 V450" },
  { d: "M260 508 V558" },
  { d: "M260 616 V646" },
  { d: "M260 704 V734" },
  { d: "M260 792 V822" },
  { d: "M260 880 V910" },
  { d: "M260 974 V1012" },
  { d: "M260 1076 V1114" },
  { d: "M260 1172 V1230" },
  { d: "M360 1259 H390" },
  { d: "M590 1259 H620" },
  { d: "M820 1259 H850" },
  { d: "M950 1291 V1340 H260 V1288", rueckweg: true },
  { d: "M1050 1259 H1105 V1360 H260 V1390" },
  { d: "M260 1448 V1478" },
  { d: "M260 1536 V1566" },
  { d: "M260 1624 V1690" },
  { d: "M260 1754 V1792" },
  { d: "M260 1850 V1880" },
  { d: "M410 1044 H470" },
  { d: "M410 1722 H470" },
  { d: "M110 1909 H52 V187 H110", rueckweg: true }
];

const FLUSS_TEXTE = [
  { x: 605, y: 1334, text: "sechsmal - je Vakanz", mitte: true, rueckweg: true },
  { x: 440, y: 1036, text: "harter Ausschluss" },
  { x: 440, y: 1714, text: "nein" },
  { x: 40, y: 1080, text: "Parameter nachschaerfen", drehung: true, rueckweg: true }
];

function flussForm(k) {
  const f = k.form || "prozess";
  if (f === "daten") {
    const s = 18;
    return '<polygon points="' + (k.x + s) + "," + k.y + " " + (k.x + k.w) + "," + k.y + " "
      + (k.x + k.w - s) + "," + (k.y + k.h) + " " + k.x + "," + (k.y + k.h) + '"/>';
  }
  if (f === "pruefung") {
    const s = 26;
    return '<polygon points="' + (k.x + s) + "," + k.y + " " + (k.x + k.w - s) + "," + k.y + " "
      + (k.x + k.w) + "," + (k.y + k.h / 2) + " " + (k.x + k.w - s) + "," + (k.y + k.h) + " "
      + (k.x + s) + "," + (k.y + k.h) + " " + k.x + "," + (k.y + k.h / 2) + '"/>';
  }
  return '<rect x="' + k.x + '" y="' + k.y + '" width="' + k.w + '" height="' + k.h + '" rx="'
    + (f === "ende" ? 26 : 9) + '"/>';
}

function flussKasten(k) {
  const cx = k.x + k.w / 2;
  const cy = k.y + k.h / 2;
  let s = '<g class="fluss-knoten" id="knoten-' + k.id + '" style="--k:' + k.farbe + '">';
  s += "<title>" + esc(k.id + " · " + k.zeilen[0]) + "</title>";
  s += flussForm(k);
  s += '<text x="' + cx + '" y="' + (cy - 3) + '" class="fk-titel">' + esc(k.zeilen[0]) + "</text>";
  if (k.zeilen[1]) {
    s += '<text x="' + cx + '" y="' + (cy + 14) + '" class="fk-sub">' + esc(k.zeilen[1]) + "</text>";
  }
  s += '<text x="' + (k.x + 12) + '" y="' + (k.y + 15) + '" class="fk-id">' + esc(k.id) + "</text>";
  return s + "</g>";
}

function flussZeichnen() {
  const behaelter = el("prozess");
  if (!behaelter) return;
  PROZESS.forEach((block) => block.schritte.forEach((s) => { PROZESS_KNOTEN[s.id] = s; }));
  let s = '<svg viewBox="0 0 1160 2000" role="img" aria-label="Ablauf der Maschine">';
  s += '<defs><marker id="pfeil" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" '
    + 'markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#7d93ad"/>'
    + '</marker><marker id="pfeil-rueck" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" '
    + 'markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#6b8bff"/>'
    + "</marker></defs>";
  FLUSS_BAND.forEach((b) => {
    s += '<rect class="fluss-band" x="80" y="' + b.y + '" width="1000" height="' + b.h
      + '" rx="14"/>';
    s += '<text class="fluss-band-text" x="96" y="' + (b.y + 24) + '">'
      + esc(b.kurz + " · " + b.text) + "</text>";
  });
  s += '<rect class="fluss-gruppe" x="90" y="1200" width="980" height="112" rx="14"/>';
  s += '<text class="fluss-gruppe-text" x="102" y="1220">je Vakanz - sechsmal wiederholt</text>';
  FLUSS_KANTEN.forEach((k) => {
    s += '<path class="fluss-kante' + (k.rueckweg ? " rueckweg" : "") + '" d="' + k.d + '"'
      + (k.rueckweg ? ' marker-end="url(#pfeil-rueck)"' : "") + "/>";
  });
  FLUSS_TEXTE.forEach((t) => {
    const cls = "fluss-kante-text" + (t.rueckweg ? " rueckweg" : "");
    const anker = t.mitte ? ' text-anchor="middle"' : "";
    const dreh = t.drehung ? ' transform="rotate(-90 ' + t.x + " " + t.y + ')"' : "";
    s += '<text class="' + cls + '" x="' + t.x + '" y="' + t.y + '"' + anker + dreh + ">"
      + esc(t.text) + "</text>";
  });
  FLUSS.forEach((k) => { s += flussKasten(k); });
  s += "</svg>";
  behaelter.innerHTML = s;
  Array.from(behaelter.querySelectorAll(".fluss-knoten")).forEach((g) => {
    const id = g.id.replace("knoten-", "");
    g.addEventListener("click", () => {
      if (PROZESS_KNOTEN[id]) {
        zeigeKnotenDetail(PROZESS_KNOTEN[id]);
        return;
      }
      const kasten = FLUSS.find((x) => x.id === id);
      if (!kasten) return;
      Array.from(document.querySelectorAll(".fluss-knoten")).forEach((k) =>
        k.classList.toggle("gewaehlt", k === g));
      el("prozess-detail").innerHTML = "<b>" + esc(kasten.id + " · " + kasten.zeilen[0])
        + "</b> &mdash; " + esc(kasten.zeilen[1] || "")
        + (kasten.info ? '<span class="kleinzeile">' + esc(kasten.info) + "</span>" : "")
        + (kasten.ort ? '<span class="kleinzeile"><b>Ort in der Maschine:</b> '
          + prozessOrtHTML(kasten.ort) + "</span>" : "");
    });
  });
}

function prozessOrtHTML(ort) {
  if (/^Prozessengine\/[A-Z][0-9]+_[A-Za-z0-9_]+\.md$/.test(ort)) {
    return '<a class="prozess-datei" href="../' + esc(ort) + '" target="_blank" rel="noopener">'
      + esc(ort) + "</a>";
  }
  return esc(ort);
}

function zeigeKnotenDetail(s) {
  Array.from(document.querySelectorAll(".fluss-knoten")).forEach((k) =>
    k.classList.toggle("gewaehlt", k.id === "knoten-" + s.id));
  const d = s.detail || {};
  const teile = ["<b>" + esc(s.id) + " · " + esc(s.titel) + "</b> &mdash; " + esc(s.kurz)];
  teile.push('<span class="kleinzeile"><b>Wer:</b> ' + esc(s.wer)
    + (d.regel ? " &middot; <b>Regel:</b> " + esc(d.regel) : "") + "</span>");
  if (d.ort) {
    teile.push('<span class="kleinzeile"><b>Ort in der Maschine:</b> ' + prozessOrtHTML(d.ort)
      + (d.wenn ? " &middot; <b>Wenn es klemmt:</b> " + esc(d.wenn) : "") + "</span>");
  }
  el("prozess-detail").innerHTML = teile.join("");
}

const KNOTEN_MUSTER = [
  ["Person laden", ["A1"]], ["Parameter laden", ["P2"]], ["Modell setzen", ["A2"]],
  ["Prompt bauen", ["M1"]], ["Antwort laden", ["M2"]], ["Modell fragen", ["M2"]],
  ["Antwort empfangen", ["M2"]], ["Struktur", ["M3"]], ["Abbruch", ["M3"]],
  ["Ist-Profil", ["M4"]], ["No-Liste", ["M5"]], ["Betriebsrat", ["M5"]],
  ["Abstimmung", ["M6"]], ["Ausschluss", ["M6"]], ["Zielvakanzen", ["M7"]],
  ["Vakanz", ["M8", "M9", "M10", "M11"]], ["Rangliste", ["M12"]], ["Sichten", ["M13"]],
  ["Manifest", ["M14"]], ["Ergebnis sichern", ["M14"]], ["Freigabe", ["E1"]],
  ["Gespraech", ["E2"]], ["Wirkung", ["E3"]]
];

function prozessMarkiere(text) {
  const t = String(text || "");
  let ziele = null;
  for (let i = 0; i < KNOTEN_MUSTER.length && !ziele; i += 1) {
    if (t.indexOf(KNOTEN_MUSTER[i][0]) >= 0) ziele = KNOTEN_MUSTER[i][1];
  }
  if (!ziele) return;
  Array.from(document.querySelectorAll(".fluss-knoten")).forEach((k) => {
    const ist = ziele.indexOf(k.id.replace("knoten-", "")) >= 0;
    if (k.classList.contains("aktiv") && !ist) k.classList.add("fertig");
    k.classList.toggle("aktiv", ist);
  });
  el("prozess-status").textContent = "aktueller Schritt: " + ziele.join(" + ") + " - " + t;
  if (!el("tab-prozess").classList.contains("versteckt")) {
    const k = el("knoten-" + ziele[0]);
    if (k) k.scrollIntoView({ block: "center", behavior: "smooth" });
  }
}

function durchlaufStoppen() {
  if (prozessTakt) { clearInterval(prozessTakt); prozessTakt = null; }
}

function durchlaufStarten() {
  durchlaufStoppen();
  const knoten = Array.from(document.querySelectorAll(".fluss-knoten"));
  if (!knoten.length) return;
  knoten.forEach((k) => k.classList.remove("aktiv", "fertig", "gewaehlt"));
  let i = 0;
  el("prozess-status").textContent = "Durchlauf laeuft";
  prozessTakt = setInterval(() => {
    if (i >= knoten.length) {
      durchlaufStoppen();
      el("prozess-status").textContent = "Durchlauf beendet - " + knoten.length + " Schritte";
      return;
    }
    knoten.forEach((k, j) => {
      k.classList.remove("aktiv");
      if (j < i) k.classList.add("fertig");
    });
    const k = knoten[i];
    k.classList.add("aktiv");
    k.scrollIntoView({ block: "center", behavior: "smooth" });
    const s = PROZESS_KNOTEN[k.id.replace("knoten-", "")];
    if (s) zeigeKnotenDetail(s);
    el("prozess-status").textContent = "Durchlauf: Schritt " + (i + 1) + " von " + knoten.length
      + " · " + k.id.replace("knoten-", "");
    i += 1;
  }, 900);
}

function prozessZuruecksetzen() {
  durchlaufStoppen();
  Array.from(document.querySelectorAll(".fluss-knoten")).forEach((k) =>
    k.classList.remove("aktiv", "fertig", "gewaehlt"));
  el("prozess-status").textContent = "zurueckgesetzt";
}

/* ---------- Aktionen ---------- */

function alsDatei() {
  if (!Z.ergebnis) return;
  const name = "ergebnis_" + Z.ergebnis.person.stem + "_" + Z.ergebnis.lauf_id + ".json";
  const daten = Z.sicht === "mgmt" ? Z.ergebnis : Z.freigegeben;
  if (!daten) return;
  const blob = new Blob([JSON.stringify(daten, null, 1)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
  el("aktions-status").textContent = "gespeichert als Download: " + name;
}

function gibFrei() {
  if (!Z.ergebnis || Z.ergebnis.status !== "ok" || Z.sicht !== "mgmt" || Z.freigegeben) return;
  const ausgewaehlt = Z.ergebnis.ergebnisse.filter((r) => Z.auswahl.has(r.vakanz_id));
  if (ausgewaehlt.length < 1 || ausgewaehlt.length > 2) return;
  const wer = window.prompt("Freigabe durch Management (Name):", "Management");
  if (!wer || !wer.trim()) return;
  const zeit = new Date().toLocaleString("de-DE");
  Z.ergebnis.manifest.freigabe = { status: "freigegeben", freigegeben_von: wer,
    freigegeben_am: zeit, vakanz_ids: ausgewaehlt.map((r) => r.vakanz_id) };
  Z.freigegeben = JSON.parse(JSON.stringify({ ...Z.ergebnis, ergebnisse: ausgewaehlt }));
  el("aktions-status").textContent = "freigegeben am " + zeit + " durch " + wer
    + " · " + ausgewaehlt.length + " Vorschlag/Vorschlaege. Weitere Reiter sind jetzt aktiv.";
  prozessMarkiere("Freigabe durch " + wer);
  zeigeErgebnis();
}

const PARAM_TABS = [
  { key: "PROMPT", titel: "Prompt", ansichten: ["alle", "consultant"], editierbar: true },
  { key: "BETRIEBSRAT", titel: "Betriebsrat (No-Liste)", ansichten: ["alle", "br", "consultant"], editierbar: true },
  { key: "SCHWELLEN", titel: "Schwellen", ansichten: ["alle", "mgmt", "consultant"], editierbar: true },
  { key: "FORMEL", titel: "Formel", ansichten: ["alle", "consultant"], editierbar: true },
  { key: "AUSGABE", titel: "Ausgabe und Sichten", ansichten: ["alle", "mgmt", "consultant"], editierbar: true },
  { key: "WEITERBILDUNG", titel: "Weiterbildung", ansichten: ["alle", "mgmt", "consultant"], editierbar: true },
  { key: "ISTPROFILE", titel: "Ist-Profile", ansichten: ["alle", "consultant"], editierbar: true },
  { key: "MODELLE", titel: "KI-Modelle", ansichten: ["alle", "consultant"], editierbar: true },
  { key: "PERSONEN", titel: "Personen (Daten)", ansichten: ["alle"], editierbar: true },
  { key: "VAKANZEN", titel: "Vakanzen (Daten)", ansichten: ["alle"], editierbar: true },
  { key: "KURSE", titel: "Kursbasis (Daten)", ansichten: ["alle"], editierbar: true }
];

const paramEntwuerfe = new Map();
const paramPositionen = new Map();
const paramDateiWerte = new Map(PARAM_TABS.map((t) => [t.key, JSON.stringify(window[t.key])]));

function hatParameterAenderungen() {
  return Array.from(paramEntwuerfe).some(([k, wert]) => JSON.stringify(wert) !== JSON.stringify(window[k]));
}

function aktualisiereAnalyseAuswahl() {
  const listen = [
    [el("person"), PERSONEN, (p) => p.stem, (p) => p.name + (p.funktion ? " · " + p.funktion : "")],
    [el("modell"), MODELLE.modelle || [], (m) => m.id, (m) => m.name + " (" + m.status + ")"]
  ];
  listen.forEach(([select, daten, id, titel]) => {
    const vorher = select.value;
    select.replaceChildren();
    daten.forEach((wert) => {
      const option = document.createElement("option");
      option.value = id(wert); option.textContent = titel(wert); select.appendChild(option);
    });
    if (daten.some((wert) => String(id(wert)) === vorher)) select.value = vorher;
  });
}

function parameterGueltig() {
  return Array.from(el("param-formular").querySelectorAll("input, textarea, select"))
    .every((feld) => feld.reportValidity());
}

function parameterLabel(name) {
  const text = String(name).replace(/^_/, "").replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function zeichneParameterFormular() {
  const key = Z.paramSchluessel;
  const wurzel = el("param-formular");
  wurzel.replaceChildren();
  function aendern(pfad, wert) {
    if (!pfad.length) paramEntwuerfe.set(key, wert);
    else {
      let ziel = paramEntwuerfe.get(key);
      pfad.slice(0, -1).forEach((teil) => { ziel = ziel[teil]; });
      ziel[pfad[pfad.length - 1]] = wert;
    }
    el("param-status").textContent = "Ungespeicherte Aenderungen - Speichern sichert alle bearbeiteten Bereiche.";
  }
  function feld(wert, name, pfad, container) {
    if (wert !== null && typeof wert === "object") {
      const gruppe = document.createElement("fieldset");
      gruppe.className = "param-gruppe";
      const legende = document.createElement("legend");
      legende.textContent = parameterLabel(name);
      gruppe.appendChild(legende);
      container.appendChild(gruppe);
      const keys = Object.keys(wert);
      const sammlung = Array.isArray(wert) || (keys.length > 0 && keys.every((k) =>
        wert[k] !== null && typeof wert[k] === "object"));
      const inhalt = document.createElement("div");
      inhalt.className = "param-felder";
      if (sammlung && keys.length) {
        const positionKey = JSON.stringify([key, ...pfad]);
        let index = Math.min(paramPositionen.get(positionKey) || 0, keys.length - 1);
        const navigation = document.createElement("div");
        navigation.className = "param-navigation";
        const zurueck = document.createElement("button");
        const weiter = document.createElement("button");
        const auswahl = document.createElement("select");
        const zaehler = document.createElement("span");
        zurueck.type = weiter.type = "button";
        zurueck.className = weiter.className = "zweit";
        zurueck.textContent = "\u2190 Zurueck";
        weiter.textContent = "Weiter \u2192";
        auswahl.setAttribute("aria-label", parameterLabel(name) + " - Datensatz waehlen");
        keys.forEach((k, i) => {
          const v = wert[k];
          const titel = v && typeof v === "object"
            ? (v.name || v.titel || v.bezeichnung || v.id || v.regel || k) : v;
          const option = document.createElement("option");
          option.value = i;
          option.textContent = (i + 1) + ". " + String(titel);
          auswahl.appendChild(option);
        });
        function anzeigen(neu) {
          if (!parameterGueltig()) { auswahl.value = index; return; }
          index = neu;
          paramPositionen.set(positionKey, index);
          auswahl.value = index;
          zurueck.disabled = index === 0;
          weiter.disabled = index === keys.length - 1;
          zaehler.textContent = "Datensatz " + (index + 1) + " von " + keys.length;
          inhalt.replaceChildren();
          const k = keys[index];
          feld(wert[k], Array.isArray(wert) ? "Datensatz " + (index + 1) : k, [...pfad, k], inhalt);
        }
        zurueck.addEventListener("click", () => anzeigen(index - 1));
        weiter.addEventListener("click", () => anzeigen(index + 1));
        auswahl.addEventListener("change", () => anzeigen(Number(auswahl.value)));
        navigation.append(zurueck, auswahl, weiter, zaehler);
        gruppe.append(navigation, inhalt);
        anzeigen(index);
      } else {
        gruppe.appendChild(inhalt);
        keys.forEach((k) => feld(wert[k], k, [...pfad, k], inhalt));
        if (!keys.length) inhalt.textContent = "Keine Eintraege vorhanden.";
      }
      return;
    }
    const label = document.createElement("label");
    label.className = "param-feld";
    const beschriftung = document.createElement("span");
    beschriftung.textContent = parameterLabel(name);
    let eingabe;
    if (typeof wert === "boolean") {
      eingabe = document.createElement("select");
      [["true", "Ja"], ["false", "Nein"]].forEach(([v, t]) => {
        const option = document.createElement("option");
        option.value = v; option.textContent = t; eingabe.appendChild(option);
      });
    } else if (typeof wert === "number") {
      eingabe = document.createElement("input");
      eingabe.type = "number"; eingabe.step = "any"; eingabe.required = true;
    } else {
      eingabe = document.createElement("textarea");
      const lang = key === "PROMPT" || String(wert || "").length > 100 || String(wert || "").includes("\n");
      eingabe.rows = key === "PROMPT" ? 22 : lang ? 5 : 2;
      if (lang) label.classList.add("param-breit");
      if (wert === null) eingabe.placeholder = "Keine Angabe (leer = null)";
    }
    eingabe.value = wert === null ? "" : String(wert);
    eingabe.addEventListener("input", () => {
      if (!eingabe.checkValidity()) return;
      let neu = eingabe.value;
      if (typeof wert === "number") neu = Number(neu);
      else if (typeof wert === "boolean") neu = neu === "true";
      else if (wert === null) {
        if (!neu.trim()) neu = null;
        else { try { const v = JSON.parse(neu); if (v === null || typeof v !== "object") neu = v; } catch (e) { /* Freitext */ } }
      }
      aendern(pfad, neu);
    });
    label.append(beschriftung, eingabe);
    container.appendChild(label);
  }
  feld(paramEntwuerfe.get(key), PARAM_TABS.find((t) => t.key === key).titel, [], wurzel);
}

function fuelleParamTabs() {
  if (!parameterGueltig()) return;
  const ansicht = el("setup-rolle").value;
  const tabs = el("param-tabs");
  tabs.innerHTML = "";
  const sichtbar = PARAM_TABS.filter((t) => t.ansichten.indexOf(ansicht) >= 0);
  sichtbar.forEach((t) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = t.titel;
    b.dataset.schluessel = t.key;
    b.addEventListener("click", () => zeigeParameter(t.key));
    tabs.appendChild(b);
  });
  if (sichtbar.length) zeigeParameter(sichtbar[0].key);
}

function zeigeParameter(schluessel) {
  if (!parameterGueltig()) return;
  const tab = PARAM_TABS.find((t) => t.key === schluessel);
  if (!tab) return;
  Z.paramSchluessel = schluessel;
  if (!paramEntwuerfe.has(schluessel)) {
    paramEntwuerfe.set(schluessel, JSON.parse(JSON.stringify(window[schluessel])));
  }
  zeichneParameterFormular();
  Array.from(el("param-tabs").children).forEach((b) =>
    b.classList.toggle("aktiv", b.dataset.schluessel === schluessel));
  el("param-status").textContent = hatParameterAenderungen()
    ? "Ungespeicherte Aenderungen - Speichern sichert alle bearbeiteten Bereiche."
    : "Aenderungen mit Speichern sichern.";
  aktualisiereHerkunft();
}

function aktualisiereHerkunft() {
  const k = Z.paramSchluessel || "-";
  const imBrowser = localStorage.getItem("tm_param_" + k) ? "ja" : "nein";
  const anzahl = PARAM_TABS.filter((t) => localStorage.getItem("tm_param_" + t.key)).length;
  el("setup-herkunft").textContent = "Parameter " + k + " · im Browser geaendert: " + imBrowser
    + " · insgesamt geaenderte Parameter: " + anzahl;
}

let dateiHandle = null;

function baueParameterDatei() {
  const wer = (el("setup-bearbeiter").value || "").trim();
  const zeilen = ["/* Parameter der Matching Demo"
    + (wer ? " - bearbeitet von " + wer : "")
    + " - Stand " + new Date().toLocaleString("de-DE") + " */", ""];
  PARAM_TABS.forEach((t) => {
    const wert = window[t.key];
    zeilen.push("var " + t.key + " = "
      + (typeof wert === "string" ? JSON.stringify(wert) : JSON.stringify(wert, null, 1)) + ";");
    zeilen.push("");
  });
  zeilen.push("var AKTEN = " + JSON.stringify(window.AKTEN, null, 1) + ";");
  return zeilen.join("\n");
}

function ladeParameterDateiHerunter() {
  const blob = new Blob([baueParameterDatei()], { type: "application/javascript" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "parameter.js";
  a.click();
  URL.revokeObjectURL(a.href);
}

async function schreibeInDatei() {
  if (window.showSaveFilePicker) {
    try {
      if (!dateiHandle) {
        dateiHandle = await window.showSaveFilePicker({
          suggestedName: "parameter.js",
          types: [{ description: "JavaScript", accept: { "application/javascript": [".js"] } }]
        });
      }
      const schreib = await dateiHandle.createWritable();
      await schreib.write(baueParameterDatei());
      await schreib.close();
      return "direkt in parameter.js geschrieben";
    } catch (fehler) {
      if (fehler && fehler.name === "AbortError") return "Dateiauswahl abgebrochen";
    }
  }
  ladeParameterDateiHerunter();
  return "parameter.js heruntergeladen - Datei in app\\parameter\\ ersetzen";
}

function pruefeUndUebernehme() {
  if (!parameterGueltig()) return false;
  try {
    paramEntwuerfe.forEach((wert, k) => {
      if (JSON.stringify(wert) !== JSON.stringify(window[k])) {
        localStorage.setItem("tm_param_" + k, JSON.stringify(wert));
      }
    });
  } catch (fehler) {
    el("param-status").textContent = "Speichern im Browser fehlgeschlagen: " + fehler.message;
    return false;
  }
  ladeBrowserUeberschreibungen();
  aktualisiereAnalyseAuswahl();
  aktualisiereHerkunft();
  return true;
}

async function speichereParameter() {
  if (!pruefeUndUebernehme()) return;
  el("param-status").textContent = "gespeichert - wird in die Parameterdatei geschrieben ...";
  const meldung = await schreibeInDatei();
  el("param-status").textContent = "Im Browser gespeichert · " + meldung
    + " · wirkt auf die naechste Analyse";
}

async function exportiereParameter() {
  if (!pruefeUndUebernehme()) return;
  el("param-status").textContent = await schreibeInDatei();
}

function setzeParameterZurueck() {
  const k = Z.paramSchluessel;
  localStorage.removeItem("tm_param_" + k);
  window[k] = JSON.parse(paramDateiWerte.get(k));
  paramEntwuerfe.delete(k);
  aktualisiereAnalyseAuswahl();
  el("param-formular").replaceChildren();
  zeigeParameter(k);
  el("param-status").textContent = "Dieser Bereich wurde auf die Dateiwerte zurueckgesetzt.";
}

function binde() {
  window.addEventListener("beforeunload", (ereignis) => {
    if (hatParameterAenderungen()) {
      ereignis.preventDefault();
      ereignis.returnValue = "";
    }
  });
  el("btn-start").addEventListener("click", analysiere);
  el("btn-prompt").addEventListener("click", () => {
    const panel = el("prompt-panel");
    if (panel.classList.contains("versteckt")) zeigePrompt();
    else panel.classList.add("versteckt");
  });
  el("btn-prompt-schliessen").addEventListener("click", () =>
    el("prompt-panel").classList.add("versteckt"));
  el("btn-kopieren").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(el("prompt-text").value);
      el("prompt-info").textContent = "Prompt kopiert - jetzt in ChatGPT einfuegen.";
    } catch (fehler) {
      el("prompt-text").select();
      el("prompt-info").textContent = "Bitte mit Strg+C kopieren (Zwischenablage gesperrt).";
    }
  });
  el("btn-antwort").addEventListener("click", uebernimmAntwort);
  el("btn-alsdatei").addEventListener("click", alsDatei);
  el("btn-freigabe").addEventListener("click", gibFrei);
  el("btn-drucken").addEventListener("click", () => window.print());
  el("quelle").addEventListener("change", () => {
    const q = el("quelle").value;
    if (q !== "vorbereitet") el("prompt-panel").classList.remove("versteckt");
    if (q === "einfuegen") {
      zeigePrompt();
      el("einfuege-panel").classList.remove("versteckt");
    } else {
      el("einfuege-panel").classList.add("versteckt");
    }
  });
  el("setup-rolle").addEventListener("change", fuelleParamTabs);
  el("btn-param-save").addEventListener("click", speichereParameter);
  el("btn-param-reset").addEventListener("click", setzeParameterZurueck);
  el("btn-param-export").addEventListener("click", exportiereParameter);
  el("btn-prozess-ablauf").addEventListener("click", durchlaufStarten);
  el("btn-prozess-stop").addEventListener("click", () => {
    durchlaufStoppen();
    el("prozess-status").textContent = "Durchlauf gestoppt";
  });
  el("btn-prozess-zurueck").addEventListener("click", prozessZuruecksetzen);
}

function start() {
  try {
    aufbau();
  } catch (fehler) {
    const ziel = document.getElementById("status");
    if (ziel) {
      ziel.innerHTML = '<span class="pill warn">Fehler beim Aufbau: ' + esc(fehler.message)
        + "</span>";
    }
    throw fehler;
  }
}

start();
