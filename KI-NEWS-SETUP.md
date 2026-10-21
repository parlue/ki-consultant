# Öffentliches KI-Briefing

Die Webseite bleibt eine statische GitHub-Pages-Seite. Der tägliche Agent läuft in GitHub Actions, liest Quellen, wählt Meldungen aus und archiviert jede Ausgabe als JSON im Repository. Besucher benötigen weder Login noch API-Schlüssel.

## Einmalige Einrichtung

1. Änderungen in `main` übernehmen.
2. Unter **Settings → Secrets and variables → Actions → New repository secret** ein Secret namens **OPENAI_API_KEY** hinterlegen. Den Schlüssel niemals in Dateien, Issues oder Chatnachrichten eintragen. Der API-Zugang wird separat vom ChatGPT-Abonnement abgerechnet.
3. Optional unter **Variables** die Variable **OPENAI_MODEL** setzen. Vorgabe: `gpt-4.1-mini`. Das gewählte Modell muss die Responses API und Structured Outputs unterstützen. Verfügbarkeit und Kosten im eigenen OpenAI-Projekt prüfen; dort ein passendes Ausgabenlimit konfigurieren.
4. Unter **Settings → Pages → Build and deployment → Source** die Option **GitHub Actions** wählen. Die bestehende Domain `sommerfeld.consulting` bleibt in `CNAME` erhalten. Die Bereitstellung enthält auch alle bisherigen Seiten und Demos.
5. Unter **Actions → KI-Briefing veröffentlichen → Run workflow** die erste echte Recherche starten. Im Laufprotokoll und anschließend unter `/ki-news/` Quellenabdeckung und Ausgabe prüfen.

Die GitHub-Verbindung dieses Chats kann Repository-Secrets und Pages-Einstellungen nicht verwalten. Diese beiden Einstellungen sind deshalb im GitHub-Webinterface vorzunehmen. Ohne Secret schlägt die Recherche ausdrücklich fehl; die bestehende Ausgabe bleibt bestehen. Die initiale Oberfläche zeigt ohne veröffentlichte Ausgabe einen ehrlichen Hinweis und enthält keine erfundenen Nachrichten.

## Zeitplan und Betrieb

- Zwei Cron-Termine um 04:17 und 05:17 UTC berücksichtigen Sommer-/Winterzeit. Vor 06 Uhr Europe/Berlin wird übersprungen. Eine vorhandene Tagesausgabe wird nicht überschrieben oder erneut vom Modell erstellt. Normaler erster Start: 06:17 Uhr Berlin; GitHub kann geplante Läufe verzögern. Eine zweite Ausführung kann den ersten ausgefallenen Lauf auffangen.
- In öffentlichen Repositories kann GitHub geplante Workflows nach 60 Tagen ohne Repository-Aktivität deaktivieren. Erfolgreiche tägliche Ausgaben erzeugen Commits; bei anhaltenden Ausfällen den Workflowstatus kontrollieren.
- Zeitfenster: die 24 Stunden vor dem tatsächlichen Lauf. Tagesgenaue Veröffentlichungen ohne Uhrzeit werden über die sich überschneidenden Kalendertage aufgenommen und sichtbar gekennzeichnet. Bereits publizierte Quellenlinks werden 14 Ausgaben lang herausgefiltert. Bei mehrtägigen Ausfällen werden verpasste Zeiträume nicht automatisch nachgeholt.
- 16 konfigurierbare Quellen in `ki-news/sources.json`: Anbieter, Forschung, arXiv, offene Modelle, Fachmedien. Die Quellenliste ist ein Ausgangspunkt und keine vollständige Weltabdeckung. RSS/Atom sowie datierte HTML-Meldungen werden unterstützt. Fehlende Datumsangaben führen zum Überspringen; bei HTML wird eine eingeschränkte Abdeckung gemeldet. Bei DeepSeek-API-News wird nötigenfalls das im URL-Schema enthaltene Veröffentlichungsdatum verwendet. Nicht alle Quellen bieten einen vollständigen Artikeltext; Feed-Auszüge werden ebenfalls verwendet.
- Pro Quelle begrenzte Kandidatenzahl, insgesamt höchstens 100 Kandidaten und 8 Meldungen. Ein Modellaufruf pro neuer Tagesausgabe, maximal drei Versuche bei bestimmten vorübergehenden API-Fehlern. Keine bezahlten Suchdienste. Tatsächliche Modellkosten hängen von Umfang, Modell und Wiederholungen ab.
- Quelle nicht erreichbar: Ausgabe kennzeichnet die Lücke. Weniger als die Hälfte (abgerundet, mindestens drei) vollständig lesbarer Quellen: Lauf bricht vor der Zusammenfassung ab. Eine technisch erreichbare Quelle kann ohne passende neue Meldungen sein.
- Doppelte URLs werden technisch entfernt, ähnliche Ereignisse redaktionell durch das Modell zusammengeführt. Links und Veröffentlichungsdaten werden aus eingelesenen Quellen übernommen, nicht vom Modell erzeugt. Die sachliche Richtigkeit der Zusammenfassung und das semantische Zusammenführen sind nicht technisch garantiert; es gibt keine automatische unabhängige Faktenprüfung und keine menschliche Vorabfreigabe.
- Jede Meldung besteht aus einer Schlagzeile, einer kurzen sachlichen Zusammenfassung, Datum und direkten Quellenlinks. Keine zusätzliche Bewertung oder Einordnung. Korrekturen an historischen Ausgaben erfolgen bewusst per Repository-Änderung.
- Fehler in GitHub Actions sind im Actions-Tab sichtbar. Persönliche GitHub-Benachrichtigungen können für fehlgeschlagene eigene Workflows konfiguriert werden. API-Schlüssel werden ausschließlich beim Generierungsschritt bereitgestellt; im Browser gibt es keine Schlüssel.
- Der Bot braucht Schreibrechte auf `main`. Bei Branch Protection einen passenden, überprüften Veröffentlichungsweg konfigurieren; der Workflow umgeht keine Schutzregeln. Bei einem Commit-/Push-Fehler wird nicht bereitgestellt.

## Lokal prüfen

Python 3.11+ mit Zeitzonendaten (auf Windows ggf. `pip install tzdata`). Sonst ausschließlich Standardbibliothek.

```sh
python -m unittest discover -s tests -v
node tests/frontend.cjs
python scripts/ai_news.py --check-sources
python -m http.server 8080
```

`--check-sources` erzeugt weder Modellkosten noch Ausgaben. Für einen tatsächlichen Lauf `OPENAI_API_KEY` in der Prozessumgebung setzen und `python scripts/ai_news.py` ausführen. Keine Schlüssel in die Shell-History schreiben. Vorschau: `http://localhost:8080/ki-news/`.

## API und Hosting

- https://developers.openai.com/api/docs/guides/structured-outputs
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule
