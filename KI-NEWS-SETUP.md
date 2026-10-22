# KI-News: Quellen und Modelle einstellen

## Lokale Einstellungsseite

Vom Repository-Verzeichnis aus `python scripts/news_settings.py` starten, dann **http://127.0.0.1:8766/** im Browser öffnen. Im lokalen Ordner „KI News“ liegt dafür auch `Einstellungen starten.cmd`. Das Programm bindet nur an diesen Rechner, nicht an das Netzwerk. Beenden mit Strg+C.

Die Seite bietet:

- Anbieterwahl: DeepSeek, Claude/Anthropic, OpenAI oder lokales Ollama.
- Einen getrennt gespeicherten Modellnamen je Anbieter. Modelle lassen sich eintippen oder über „Verbindung prüfen & Modelle laden“ abrufen. Der Abruf liest nur Modelllisten, ohne Texte zu erzeugen.
- An-/Abwahl der 16 Nachrichtenquellen. Quellen liefern die Nachrichten; das ausgewählte Modell erstellt daraus deutsche Kurztexte.
- Begrenzung der eingelesenen Beiträge und ihrer Textlänge.
- Speichern in `ki-news/settings.json` und Export derselben Konfiguration als JSON.

**Speichern wirkt zunächst lokal.** Für den täglichen GitHub-Lauf die geänderte Datei `ki-news/settings.json` in `main` übernehmen. Die öffentliche GitHub-Pages-Seite ist keine Administrationsoberfläche und schreibt keine Einstellungen. Die lokale Verwaltung startet weder automatisch einen Lauf noch kostenpflichtige Modellaufrufe.

API-Schlüssel stehen nicht in dieser Datei oder im Browser. Lokal werden sie als Umgebungsvariablen des gestarteten Prozesses bereitgestellt; für GitHub Actions als Repository-Secrets:

| Anbieter | Schlüssel | Standardmodell in der Konfiguration |
| --- | --- | --- |
| DeepSeek | `DEEPSEEK_API_KEY` | `deepseek-flash` |
| Claude / Anthropic | `ANTHROPIC_API_KEY` | `claude-haiku-5-5` |
| OpenAI | `OPENAI_API_KEY` | `gpt-4.1-mini` (bisherige Einstellung; Modellverfügbarkeit vor Nutzung prüfen) |
| Ollama lokal | keiner | selbst aus installierten Modellen auswählen |

Nur der ausgewählte Anbieter benötigt einen Schlüssel. Nach Änderungen an lokalen Umgebungsvariablen die Einstellungsanwendung neu starten. Keine Schlüssel in Dateien, URLs, Issues oder Chatnachrichten eintragen. Der initial gewählte Anbieter ist DeepSeek; ohne Schlüssel ist kein Cloud-Lauf möglich. Es wurden keine Zugangsdaten eingerichtet.

## Ollama

Ollama muss auf demselben Rechner laufen. Standardadresse: `http://127.0.0.1:11434`. Die Auswahl lädt nur Modellnamen; sie installiert keine Modelle. Cloudmodelle und Modelle mit Remote-Zuordnung werden ausgeschlossen. Der Modelladapter unterstützt lokale strukturierte JSON-Ausgaben; die Qualität hängt vom installierten Modell ab.

Für Ollama sind höchstens 30.000 Eingabezeichen (Kandidaten × Textlänge) erlaubt. Die Oberfläche setzt beim Wechsel zunächst 12 Beiträge mit je 1.800 Zeichen. Der Lauf fordert einen Kontext von 32.768 Tokens an; genügend RAM/VRAM und ein geeignetes Modell sind erforderlich. Ein realer lokaler Modelllauf wurde hier nicht ausgeführt, weil kein Ollama-Dienst erreichbar war.

**GitHub-hosted Actions erreicht kein Ollama auf deinem PC.** Der Lauf wird deshalb bei dieser Kombination ausdrücklich abgebrochen. Für Ollama den vorhandenen Generator lokal starten, beispielsweise später über die Windows-Aufgabenplanung. Für einen vollautomatischen lokalen Betrieb wäre zusätzlich die Übertragung der fertigen Dateien zu GitHub einzurichten. Diese lokale Zeitplanung und Übertragung sind noch nicht eingerichtet. Kein Ollama-Dienst muss dafür öffentlich freigegeben werden.

## Täglicher Betrieb mit Cloudmodell

1. Änderungen in `main` übernehmen, einschließlich `ki-news/settings.json`.
2. Nur für den gewählten Anbieter das passende Repository-Secret unter **Settings → Secrets and variables → Actions** setzen.
3. Unter **Settings → Pages → Source** die Option **GitHub Actions** wählen. `CNAME` und die vorhandenen Webseiten bleiben Teil der Bereitstellung.
4. Nach dem Übernehmen in `main` startet der erste Recherche- und Veröffentlichungsversuch automatisch. Für einen erneuten Versuch **Actions → KI-Briefing veröffentlichen → Run workflow** verwenden. Erst nach Prüfung einer erfolgreichen Ausgabe den täglichen Betrieb als eingerichtet betrachten.

Die Verbindung dieses Chats kann Repository-Secrets und Pages-Einstellungen nicht verwalten. Bisher gibt es keinen verifizierten echten Cloud-Modelllauf; die Anbieteradapter wurden mit simulierten Antworten getestet.

Zeitplan: 03:30 und 04:30 UTC, mit Prüfung auf frühestens 05:30 Uhr Europe/Berlin. Normaler erster Start ist 05:30 Uhr Berlin in Sommer-/Winterzeit; GitHub kann den Lauf verzögern. Vorhandene Tagesausgaben werden nicht überschrieben oder erneut vom Modell erstellt. Die zweite Ausführung kann den ersten ausgefallenen Lauf auffangen.

## Betriebsgrenzen

- Zeitraum: die letzten 24 Stunden vor dem tatsächlichen Lauf. Tagesgenaue Quellen werden über die überschneidenden Kalendertage aufgenommen und gekennzeichnet. Bei Ausfällen werden fehlende Tage nicht automatisch nachgeholt.
- Nur ausgewählte Quellen werden abgefragt. Mindestens die Hälfte der gewählten Quellen, aufgerundet, muss vollständig lesbar sein. Andernfalls bleibt die bisherige Ausgabe erhalten. Ausfälle werden in einer erfolgreichen Ausgabe sichtbar.
- Pro Quelle begrenzte Auswahl, insgesamt höchstens 100 Kandidaten; danach greifen die konfigurierten Grenzen. Das Modell erstellt höchstens acht Nachrichten. Ruhige Tage bleiben kurz.
- Quellen ohne auswertbares Datum werden übersprungen. Bei DeepSeek-API-Meldungen kann das Datum im URL-Schema verwendet werden. Texte stammen je nach Quelle aus Artikeln oder Feed-Auszügen; keine vollständige Weltabdeckung.
- Bereits publizierte Quellenlinks werden 14 Ausgaben lang ausgeschlossen. Gleiche URLs werden technisch entfernt, gleiche Ereignisse durch das Modell zusammengeführt; die semantische Erkennung ist nicht garantiert.
- Nachrichten bestehen aus Überschrift, kurzer Zusammenfassung, Datum und direkten Originalquellen. Keine zusätzliche Bewertung oder Einordnung. Quellen-URLs und Zeitstempel stammen aus den eingelesenen Beiträgen. Keine menschliche Vorabprüfung oder unabhängige automatische Faktenprüfung.
- Anbieterantworten mit ungültigen oder unbekannten Quellenreferenzen sowie unvollständige Antworten werden abgelehnt. Bei bestimmten temporären HTTP-Fehlern maximal drei Versuche. Es gibt keinen automatischen Wechsel auf einen anderen Anbieter.
- GitHub-Bot braucht Schreibrecht auf `main`; Branch Protection wird nicht umgangen. Bei Commit-/Push-Fehler keine Bereitstellung. Workflowausfälle im Actions-Tab kontrollieren.
- GitHub kann Zeitpläne in öffentlichen Repositories nach 60 Tagen ohne Aktivität deaktivieren. Erfolgreiche Tagesausgaben erzeugen Commits.

## Kostenbeispiel für Claude

50.000 Eingabe- und 2.000 insgesamt berechnete Ausgabetokens pro Tag, ohne Rabatte, Steuern und Wiederholungen; Preise abgerufen am 21.10.2026. Ein anderer Tokenizer oder zusätzliche Denktokens verändern den Verbrauch.

| Modell | Pro Tag | 30 Tage |
| --- | ---: | ---: |
| Claude Haiku 5.5 (Prompt bis 100.000 Tokens) | 0,006 USD | 0,18 USD |
| Claude Sonnet 5.5 | 0,12 USD | 3,60 USD |
| Claude Opus 5.5 | 0,24 USD | 7,20 USD |

Dies sind Rechenbeispiele, keine Verbrauchsmessungen oder Kostenobergrenzen. [Aktuelle Anthropic-Preise](https://platform.claude.com/docs/en/about-claude/pricing).

## Manuelle Vorschau und Tests

`ki-news/vorschau.html` direkt öffnen. Fünf manuell recherchierte Nachrichten mit verschiedenen Veröffentlichungsdaten, getrennt vom automatischen Archiv. Änderungen an `ki-news/preview/2026-10-21.json` mit `python scripts/build_news_preview.py` in die Vorschau übernehmen.

```sh
python -m unittest discover -s tests -v
node tests/frontend.cjs
python scripts/ai_news.py --check-sources
python scripts/news_settings.py
```

Python 3.11+, sonst Standardbibliothek; unter Windows ggf. `pip install tzdata` für Zeitzonendaten. `--check-sources` erzeugt keine Modellkosten. Ein tatsächlicher lokaler Generierungslauf lautet `python scripts/ai_news.py`, mit API-Schlüssel in der Umgebung oder laufendem lokalem Ollama. Abweichende Konfigurationsdatei: `--settings pfad/settings.json`.

Newsletter-Anmeldung und E-Mail-Versand wurden nur besprochen und sind nicht implementiert; es werden keine Interessentenadressen gesammelt.

## API-Referenzen

- https://api-docs.deepseek.com/guides/json_mode/
- https://platform.claude.com/docs/en/build-with-claude/structured-outputs
- https://developers.openai.com/api/docs/guides/structured-outputs
- https://docs.ollama.com/capabilities/structured-outputs
