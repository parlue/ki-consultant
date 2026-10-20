# Matching Demo - Oberflaeche (reines HTML, kein Server, kein Python)

**Start: `index.html` doppelklicken.** Es braucht nichts weiter - kein Server, keine Installation,
keine Internetverbindung (ausser im Modus "GPT live").

## Was hier liegt

| Datei | Inhalt |
|---|---|
| `index.html` | die Oberflaeche |
| `app.js` | Ablauf: Prompt bauen, Antwort holen, Schritte zeigen, vier Sichten rendern |
| `assets\style.css` | das Aussehen |
| `parameter\parameter.js` | **alle Parameter** als eine Datei (Prompt, Betriebsrats-No-Liste, Schwellen, Formel, Ausgabe, Modelle, Ist-Profile, Weiterbildung, Personen, Akten, Vakanzen, Kurse) |
| `antworten\antwort_<Person>.js` | vorbereitete Antworten fuer die Demo |

Warum `.js` und nicht `.json`: Eine Seite, die per Doppelklick geoeffnet wird, darf keine
Dateien per `fetch` lesen. `<script src>` ist erlaubt - deshalb liegen die Daten als
JavaScript-Dateien vor.

Zwei Regeln gelten dabei (beide prueft `Werkzeuge\oberflaeche_check.py`):

- **`var`, nicht `const`.** Nur `var` auf oberster Ebene legt eine Eigenschaft auf `window` an.
  Das Setup schreibt Aenderungen nach `window[NAME]` - mit `const` wuerde eine Aenderung im
  Browser nicht greifen.
- **Nie sich selbst in der eigenen Initialisierung lesen.** Die Zeile
  `const ANTWORTEN = (typeof ANTWORTEN === "object" && ANTWORTEN) ? ANTWORTEN : {};` sieht
  vorsichtig aus, laeuft aber in die temporal dead zone und wirft beim Laden einen
  `ReferenceError` - die Seite bleibt dann still stehen. Richtig ist
  `var ANTWORTEN = ANTWORTEN || {};`: `var` ist hochgezogen und damit `undefined`, die Zeile legt
  das Objekt an, weitere Antwortdateien ergaenzen es nur. Genau dieser Fehler ist am 15.10.2026
  aufgefallen - gefunden hat ihn nicht die Quelltextpruefung, sondern der headless-Browserlauf
  (`Werkzeuge\oberflaeche_lauf.ps1`).

## Drei Antwortquellen (Schalter "Antwortquelle")

1. **vorbereitete Antwort (Demo)** - laeuft sofort, zeigt echte Zahlen. Die Antworten wurden aus
   dem geprueften Rechenkern erzeugt (`Werkzeuge\antwort_export.py`).
2. **GPT live** - die Seite baut den Prompt, ruft das Modell auf (OpenAI-kompatibler Endpunkt aus
   `MODELLE`) und rendert die Antwort. Beim ersten Aufruf fragt die Seite nach dem API-Schluessel;
   er wird nur lokal im Browser gespeichert, nie in einer Datei.
3. **Antwort einfuegen** - Prompt kopieren, in ChatGPT einfuegen, Antwort zurueckkopieren. Kein
   Schluessel noetig.

In allen drei Faellen laeuft **derselbe Ablauf**: Prompt bauen, Struktur pruefen, Schritte zeigen,
vier Sichten rendern.

## Aufbau: drei Karteireiter

**1 · Setup — Parameter bearbeiten.** Hier schaerfen wir die Maschine:

- **Ansicht** (nur ein Filter, keine Rechte): Alle Parameter · Betriebsrat · Management ·
  Consultant.
- **Bearbeitet von**: Name oder Kuerzel - landet im Kopf der Parameterdatei, damit nachvollziehbar
  ist, wer geschaerft hat.
- **Editierbar als Formular:** Prompt · Betriebsrats-No-Liste · Schwellen · Formel · Ausgabe und
  Sichten · Weiterbildung · Ist-Profile · KI-Modelle · Personen · Vakanzen · Kursbasis.
- Beschriftete, grosszuegige Textfelder statt JSON-Eingabe. Listen und Sammlungen von Datensaetzen
  lassen sich mit **Zurueck / Weiter** oder der Datensatzauswahl durchblaettern; der Zaehler zeigt
  die aktuelle Position. Zahlen und Ja/Nein-Werte behalten ihren Datentyp.
- Aenderungen bleiben beim Blaettern und beim Wechsel des Parameterbereichs erhalten.
  **Speichern** sichert alle bearbeiteten Bereiche. Beim Verlassen der Seite warnt der Browser
  vor noch ungespeicherten Aenderungen.
- **Speichern** - ein Klick: Wert wird geprueft, gilt sofort fuer die naechste Analyse und wird in
  `parameter\parameter.js` geschrieben. In Chrome/Edge fragt die Seite beim ersten Mal nach der
  Datei und schreibt danach direkt hinein; in anderen Browsern kommt die Datei als Download, die
  man in `app\parameter\` ersetzt.
- **Nur in Datei schreiben** - uebernimmt ebenfalls die Formularaenderungen und exportiert die
  vollstaendige Parameterdatei inklusive Akten-Zuordnungen.
- **Zuruecksetzen auf Datei** - stellt den aktuellen Bereich auf die beim Laden gelesenen
  Dateiwerte zurueck. Andere Bereiche bleiben erhalten.

Warum der zweistufige Weg: eine per Doppelklick geoeffnete Seite darf nicht ohne Zustimmung in
Dateien schreiben. Deshalb Browser-Ablage (sofort wirksam) plus Schreiben in die Datei (dauerhaft
fuer alle Kollegen).

**2 · Analyse — Auftrag, Maschine, Ausgabe.** Mitarbeiter und Modell waehlen, Antwortquelle
festlegen, starten, Schritte verfolgen, Ergebnis in den Sichten lesen.

- Zuerst ist nur **Management** aktiv; HR, Betriebsrat und Mitarbeiter sind angegraut und gesperrt.
- Management sieht alle Vakanzen mit Rechenweg und waehlt per Checkbox **ein oder zwei Vorschlaege**.
- **Auswahl freigeben (Management)** fragt nach dem Namen. Erst danach werden die anderen Sichten
  aus den ausgewaehlten Vorschlaegen erzeugt und freigeschaltet. Die Mitarbeitersicht zeigt die
  ausdruecklich freigegebenen Vorschlaege ohne Ranking, auch wenn die urspruengliche Antwort
  sie nicht fuer die Mitarbeitersicht markiert hatte.
- Eine Aenderung der Auswahl hebt die Freigabe auf und sperrt die anderen Sichten erneut.
- Name, Zeitpunkt und Vakanz-IDs stehen im Manifest. Freigaben gelten nur fuer den aktuellen Lauf;
  eine neue Analyse, eine neue eingefuegte Antwort oder ein Neuladen beginnt ohne Auswahl und Freigabe.
- Der Dateiexport aus einer nachgelagerten Sicht enthaelt nur die freigegebenen Vorschlaege;
  Management kann weiterhin das vollstaendige Analyseergebnis exportieren.

Pruefung des Ablaufs im isolierten Edge-Profil:
`python MatchingDemo/Werkzeuge/analyse_freigabe_test.py` (vom Projektverzeichnis aus).

**3 · Prozess — der Ablauf als grafisches Flussdiagramm.** Ein gezeichnetes Schaubild, kein
Kartenstapel:

- **Formen wie im Flussdiagramm:** Rechteck = Schritt, schraeger Kasten = Ein- oder Ausgabe,
  Raute = Pruefung (Betriebsrats-No-Liste, Abstimmung, Zone, Freigabe), abgerundeter Kasten = Ende.
- **Vier Phasenbaender** hinter dem Ablauf: P Vorbereitung (einmalig, durch uns) · A Auftrag ·
  M Maschine (je Lauf) · E Entscheidung durch den Menschen. 22 Schritte von P1 bis E3.
- **Farbe je Phase:** P grau, A hellblau, M tuerkis, E gelb. Rote Kaesten sind Abbruchwege
  (X1 Vakanz nicht weiterverfolgen, X2 Entwurf ohne Umsetzung).
- **Kanten:** durchgezogene Pfeile sind der Weg nach unten, gestrichelte blaue Linien sind
  Rueckwege - die Schleife **sechsmal je Vakanz** (M8 bis M11) und der Ruecklauf von E3 auf P2
  (Parameter nachschaerfen).
- **Klick auf einen Kasten** zeigt darunter in einer Zeile: was der Schritt tut, wer ihn ausloest,
  die geltende Regel und wo er in der Maschine sitzt (Datei oder Funktion).
- **Durchlauf zeigen** geht die Kaesten automatisch durch - fuer die Vorfuehrung am Beamer.
  **Stop** haelt an, **Alles zuruecksetzen** leert die Markierungen.
- **Mitlauf:** Waehrend einer Analyse leuchtet im Diagramm der Schritt, an dem die Maschine gerade
  arbeitet. Die sechs Vakanz-Bewertungen leuchten als Block M8 bis M11 - so sieht man, dass
  sechsmal dieselbe Schleife laeuft. Am Ende steht E1 Freigabe: die Maschine wartet auf den Menschen.
- **Aufbau der Zeichnung:** Die Kaesten stehen als Daten in `app.js` (`FLUSS` mit x/y/Form/Farbe,
  `FLUSS_KANTEN` mit den Pfeilwegen, `FLUSS_BAND` mit den Phasen). Das Diagramm ist reines
  Inline-SVG - keine Bibliothek, kein Internet. Die Zuordnung Schritt zu Kasten steht in
  `KNOTEN_MUSTER`; `Werkzeuge\oberflaeche_check.py` prueft, dass jede Kennung existiert und jeder
  Schritt gezeichnet ist.

## Die Sichten sind Parameter

`AUSGABE.sichten` legt fest, welche Sichten es gibt, welche Datei sie bekommen und was sie zeigen.
Heute sind es vier: Management, HR, Betriebsrat, Mitarbeiter. Streichst du im Setup den HR-Eintrag,
arbeitet die Oberflaeche automatisch mit drei Sichten - ohne Codeaenderung.

## Parameter aus der Datei erzeugen

`parameter\parameter.js` entsteht aus dem Ordner `..\Parameter\`:

```
python Werkzeuge\parameter_export.py
```

Die Werte werden bewusst als `var` ausgegeben (nicht `const`), damit der Setup-Reiter sie im
Browser ueberschreiben kann.

## Vorbereitete Antworten erzeugen

```
python Werkzeuge\antwort_export.py                    # alle Personen mit Ist-Profil
python Werkzeuge\antwort_export.py --person Jens_Habermann
```

## Pruefen

```
python Werkzeuge\oberflaeche_check.py
```

Prueft: alle Element-IDs vorhanden, alle Globals definiert, Klammerbilanz, Skriptreihenfolge,
Antwortdatei als gueltiges JSON mit Pflichtfeldern.

Fiktiver Uebungsdatensatz: alle Personen, Unternehmen, Kennzahlen und Kurse sind erfunden.
