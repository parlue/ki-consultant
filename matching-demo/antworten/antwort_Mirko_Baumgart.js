/* Vorbereitete Antwort fuer die Oberflaeche.
   Erzeugt aus dem geprueften Rechenkern (Werkzeuge/engine.py) am 15.10.2026 16:36.
   Struktur identisch zur Antwort, die ein KI-Modell liefert.
   Datei wird von index.html per <script src> geladen - kein Server noetig.

   Wichtig: var, nicht const. Ein const mit Selbstbezug
   (const ANTWORTEN = (typeof ANTWORTEN ...) ? ...) laeuft in die temporal dead zone
   und wirft beim Laden einen ReferenceError. var ist hochgezogen und damit undefined,
   die Zeile legt das Objekt an und weitere Antwortdateien ergaenzen es nur. */
var ANTWORTEN = ANTWORTEN || {};
ANTWORTEN["Mirko_Baumgart"] = {
 "status": "ok",
 "lauf_id": "LAUF-20261015-163635",
 "person": {
  "stem": "Mirko_Baumgart",
  "name": "Mirko Baumgart",
  "akte_datei": "04_Mirko_Baumgart.md",
  "stammdaten": {
   "Personalnummer": "PN-10099",
   "Name": "Mirko Baumgart",
   "Geburtsdatum / Alter": "15.01.1999 · 27 Jahre",
   "Geschlecht": "männlich",
   "Familienstand / Kinder": "getrennt lebend seit 05/2024, Scheidung rechtskräftig 02/2026 · eine Tochter (6 Jahre), Wechselmodell seit 02/2026",
   "Wohnort": "Hannover-Ricklingen (seit 06/2024; vorher Hannover-Döhren)",
   "Staatsangehörigkeit / Sprachen": "deutsch · Deutsch (Muttersprache), Englisch (Schulkenntnisse)",
   "Schulabschluss": "Fachhochschulreife 06/2018 (Ø 2,8)",
   "Berufsabschluss": "**keiner** (BWL-Studium 2018–2020, 3 Semester, ohne Abschluss exmatrikuliert)",
   "Eintrittsdatum": "01.10.2022 (Einstellung mit 23 Jahren)",
   "Vertragsart": "unbefristet; Probezeit 6 Monate (bestanden 31.03.2023)",
   "Beschäftigungsumfang": "39 h/Woche (Vollzeit); Gleitzeit mit festen Fenstern Di/Do (Wechselmodell)",
   "Abteilung / Funktion": "Backoffice · Sachbearbeiter Reklamation (schriftliche Fälle, telefonische Rückrufe, Gutschriften)",
   "Arbeitszeitmodell": "Gleitzeit 08:00–18:00, keine Schichtarbeit; nach Absprache mobile Arbeit 1 Tag/Woche",
   "Direkte Führungskraft": "Ayla Yıldız, Teamleitung Backoffice/Reklamation",
   "Gegenzeichnung": "Frank Dobrin, Bereichsleitung Kundenservice",
   "Aktenführung": "Heike Rademacher, Personalabteilung"
  }
 },
 "modell": {
  "id": "lokal-ollama-14b",
  "name": "Lokales Modell 14B (Ollama)",
  "typ": "lokal"
 },
 "br": {
  "fassung": "BR-2026-10-15",
  "verwendete_felder": [
   {
    "id": "SD-05",
    "bezeichnung": "Familienstand / Kinder",
    "wirkung": "nur_kontext",
    "regel": "BR-004",
    "begruendung": "Nur fuer Fuersorge und Arbeitszeitgestaltung, nicht fuer die Eignung.",
    "hinweis": "nur als Kontext, nicht bewertet"
   },
   {
    "id": "BE-09",
    "bezeichnung": "Fehlzeitenverhalten",
    "wirkung": "nur_kontext",
    "regel": "BR-005",
    "begruendung": "Fehlzeiten duerfen nicht als Eignungskriterium bewertet werden.",
    "hinweis": "nur als Kontext, nicht bewertet"
   },
   {
    "id": "KZ-06",
    "bezeichnung": "Krankheitstage je Zeitraum",
    "wirkung": "nur_kontext",
    "regel": "BR-006",
    "begruendung": "Nur fuer Fuersorge und Gesundheitsschutz, nicht fuer die Bewertung.",
    "hinweis": "nur als Kontext, nicht bewertet"
   },
   {
    "id": "SO-05",
    "bezeichnung": "Gesundheit / BEM / angepasster Arbeitsplatz",
    "wirkung": "nur_kontext",
    "regel": "BR-007",
    "begruendung": "Nur zur Sicherstellung geeigneter Rahmenbedingungen.",
    "hinweis": "nur als Kontext, nicht bewertet"
   },
   {
    "id": "SD-06",
    "bezeichnung": "Wohnort",
    "wirkung": "schwelle",
    "regel": "BR-008",
    "begruendung": "Nur als Grenzwert fuer Zumutbarkeit des Arbeitswegs.",
    "hinweis": "nur als Grenzwert"
   },
   {
    "id": "VAK-01",
    "bezeichnung": "Soll-Skills der Zielvakanzen",
    "wirkung": "verwendet",
    "regel": "-",
    "begruendung": "Grundlage der Bewertung"
   },
   {
    "id": "IPM-01/02",
    "bezeichnung": "Motivationstyp und Grundbeduerfnisse",
    "wirkung": "verwendet",
    "regel": "-",
    "begruendung": "nur fuer die Einordnung der Arbeitsweise"
   }
  ],
  "ausgeschlossene_felder": [
   {
    "id": "SD-03",
    "bezeichnung": "Geburtsdatum / Alter",
    "wirkung": "ausschluss",
    "regel": "BR-001",
    "begruendung": "Keine Bewertung aus dem Alter (Diskriminierungsverbot)."
   },
   {
    "id": "SD-04",
    "bezeichnung": "Geschlecht",
    "wirkung": "ausschluss",
    "regel": "BR-002",
    "begruendung": "Keine Bewertung aus dem Geschlecht."
   },
   {
    "id": "SD-07",
    "bezeichnung": "Staatsangehörigkeit / Sprachen",
    "wirkung": "ausschluss",
    "regel": "BR-003",
    "begruendung": "Keine Bewertung aus Herkunft oder Nationalitaet."
   }
  ],
  "regeln": [
   {
    "regel": "BR-G01",
    "titel": "Keine automatisierte Einzelentscheidung",
    "status": "informativ",
    "text": "Die Anwendung liefert Vorschlaege. Die Entscheidung trifft immer ein Mensch (Freigabe durch Management oder HR).",
    "detail": "gilt fuer alle Analysen"
   },
   {
    "regel": "BR-G02",
    "titel": "Zweckbindung",
    "status": "informativ",
    "text": "Daten aus den Personalakten werden ausschliesslich fuer diesen Entwicklungsabgleich verwendet, nicht fuer Leistungs- oder Verhaltenskontrolle.",
    "detail": "gilt fuer alle Analysen"
   },
   {
    "regel": "BR-G03",
    "titel": "Transparenz",
    "status": "informativ",
    "text": "Verwendete und ausgeschlossene Felder, ausgeloeste Regeln und die Parameterfassung sind im Ergebnis einsehbar.",
    "detail": "gilt fuer alle Analysen"
   },
   {
    "regel": "BR-G04",
    "titel": "Freiwilligkeit",
    "status": "informativ",
    "text": "Ergebnisse werden dem Mitarbeiter nur als Angebot mitgeteilt; es entsteht keine Verpflichtung.",
    "detail": "gilt fuer alle Analysen"
   },
   {
    "regel": "BR-001",
    "titel": "Feld SD-03 (Geburtsdatum / Alter) gesperrt",
    "status": "eingehalten",
    "text": "Keine Bewertung aus dem Alter (Diskriminierungsverbot).",
    "detail": "Feld wurde nicht verwendet"
   },
   {
    "regel": "BR-002",
    "titel": "Feld SD-04 (Geschlecht) gesperrt",
    "status": "eingehalten",
    "text": "Keine Bewertung aus dem Geschlecht.",
    "detail": "Feld wurde nicht verwendet"
   },
   {
    "regel": "BR-003",
    "titel": "Feld SD-07 (Staatsangehoerigkeit / Herkunft) gesperrt",
    "status": "eingehalten",
    "text": "Keine Bewertung aus Herkunft oder Nationalitaet.",
    "detail": "Feld wurde nicht verwendet"
   },
   {
    "regel": "BR-004",
    "titel": "Feld SD-05 (Familienstand / Kinder) nur Kontext",
    "status": "beachtet",
    "text": "Nur fuer Fuersorge und Arbeitszeitgestaltung, nicht fuer die Eignung.",
    "detail": "nicht erwaehnt"
   },
   {
    "regel": "BR-005",
    "titel": "Feld BE-09 (Fehlzeitenverhalten (Note)) nur Kontext",
    "status": "beachtet",
    "text": "Fehlzeiten duerfen nicht als Eignungskriterium bewertet werden.",
    "detail": "nicht erwaehnt"
   },
   {
    "regel": "BR-006",
    "titel": "Feld KZ-06 (Krankheitstage je Zeitraum) nur Kontext",
    "status": "beachtet",
    "text": "Nur fuer Fuersorge und Gesundheitsschutz, nicht fuer die Bewertung.",
    "detail": "nicht erwaehnt"
   },
   {
    "regel": "BR-007",
    "titel": "Feld SO-05 (Gesundheit / BEM / angepasster Arbeitsplatz) nur Kontext",
    "status": "beachtet",
    "text": "Nur zur Sicherstellung geeigneter Rahmenbedingungen.",
    "detail": "im Profil erwaehnt, aber nicht in die Bewertung eingerechnet"
   },
   {
    "regel": "BR-008",
    "titel": "Grenzwert SD-06 (Wohnort / Arbeitsweg)",
    "status": "beachtet",
    "text": "Nur als Grenzwert fuer Zumutbarkeit des Arbeitswegs. (Grenzwert: Arbeitsweg bis 45 Minuten je Strecke, kein Umzugserfordernis)",
    "detail": "Grenzwert festgehalten, kein Ausschlusskriterium. Ein Standortwechsel wird je Option mit -15 Punkten gerechnet und in der Option benannt."
   }
  ],
  "verletzungen": [],
  "abstimmungen": []
 },
 "ist_profil": {
  "abrechnung": 1,
  "analytik": 2,
  "anleiten": 4,
  "beratung": 3,
  "buchhaltung": 1,
  "buchhaltungssoftware": 1,
  "bueroorganisation": 2,
  "deutsch": 4,
  "digitale_werkzeuge": 3,
  "dokumentation": 3,
  "englisch": 1,
  "erklaeren": 1,
  "excel": 1,
  "excel_reporting": 2,
  "fachhandel": 3,
  "fristen": 3,
  "genauigkeit": 2,
  "interne_kommunikation": 2,
  "kostentraeger": 1,
  "lernbereitschaft": 3,
  "lieferanten": 2,
  "offene_posten": 1,
  "office": 2,
  "produktanpassung": 2,
  "prozessdenken": 3,
  "rechnungspruefung": 1,
  "reklamation": 4,
  "schriftlich": 3,
  "selbstorganisation": 2,
  "stammdaten_system": 3,
  "telefonie": 4,
  "terminorganisation": 1,
  "verkauf_kasse": 2,
  "vorbereitende_buchhaltung": 1,
  "warenwirtschaft": 2,
  "zahlen": 2
 },
 "begruendungen": {
  "abrechnung": "nicht belegt - vorsichtig auf Grundlagenniveau angesetzt",
  "analytik": "IPM-Beduerfnis ERK 130",
  "anleiten": "Anleitung und Ausbildung",
  "beratung": "Beratung in der Akte",
  "buchhaltung": "nicht belegt - vorsichtig auf Grundlagenniveau angesetzt",
  "buchhaltungssoftware": "nicht belegt - vorsichtig auf Grundlagenniveau angesetzt",
  "bueroorganisation": "organisatorische Aufgaben",
  "deutsch": "Deutsch als Arbeitssprache",
  "digitale_werkzeuge": "digitale Werkzeuge",
  "dokumentation": "IPM-Beduerfnis SIC 140",
  "englisch": "Sprachen in den Stammdaten: deutsch · Deutsch (Muttersprache), Englisch (Schulkenntnisse)",
  "erklaeren": "nicht belegt - vorsichtig auf Grundlagenniveau angesetzt",
  "excel": "nicht belegt - vorsichtig auf Grundlagenniveau angesetzt",
  "excel_reporting": "Auswertungen und Reporting",
  "fachhandel": "Fachhandelserfahrung",
  "fristen": "Fristen und Wiedervorlagen",
  "genauigkeit": "IPM-Beduerfnis SIC 140",
  "interne_kommunikation": "Zusammenarbeit im Team",
  "kostentraeger": "nicht belegt - vorsichtig auf Grundlagenniveau angesetzt",
  "lernbereitschaft": "Lernbereitschaft",
  "lieferanten": "Lieferantenkontakt",
  "offene_posten": "nicht belegt - vorsichtig auf Grundlagenniveau angesetzt",
  "office": "Office-Nutzung",
  "produktanpassung": "Anpassungsnaehe",
  "prozessdenken": "Prozessbezug",
  "rechnungspruefung": "nicht belegt - vorsichtig auf Grundlagenniveau angesetzt",
  "reklamation": "IPM-Beduerfnis DUR 130",
  "schriftlich": "Schriftverkehr in der Akte",
  "selbstorganisation": "IPM-Beduerfnis IND 130",
  "stammdaten_system": "Stammdatenpflege",
  "telefonie": "Funktion und Kennzahlen",
  "terminorganisation": "nicht belegt - vorsichtig auf Grundlagenniveau angesetzt",
  "verkauf_kasse": "IPM-Beduerfnis DUR 130",
  "vorbereitende_buchhaltung": "nicht belegt - vorsichtig auf Grundlagenniveau angesetzt",
  "warenwirtschaft": "Warenwirtschaft/ERP",
  "zahlen": "IPM-Beduerfnis ERK 130"
 },
 "offene_pruefungen": [
  "abrechnung",
  "buchhaltung",
  "buchhaltungssoftware",
  "erklaeren",
  "excel",
  "kostentraeger",
  "offene_posten",
  "rechnungspruefung",
  "terminorganisation",
  "vorbereitende_buchhaltung"
 ],
 "motivation": {
  "typ": "Umsetzer",
  "staerken": [
   "Durchsetzungsfaehigkeit in schwierigen Kundenkontakten",
   "Sachliche Klaerung statt Vermeidung",
   "Belastbarkeit in Konflikten",
   "Verlaesslichkeit und Verantwortungsuebernahme"
  ],
  "spannungsfelder": [
   "Leichte Ueberforderung bei Durchsetzung (Rolle 130 gegen Tiefe 120): Dauerhaftes Durchsetzen kostet Kraft, wenn Rueckzugszeiten fehlen.",
   "Unterforderung bei Integration (Tiefe 110 gegen Rolle 100): Das Backoffice bietet weniger Kontakt, als innerlich gebraucht wird.",
   "Belastungssignale zeigen sich zuerst im Ton und in der Ungeduld (Sozialkompetenz 3), nicht in der Fachqualitaet - Fruehwarnzeichen fuer die Fuehrung."
  ],
  "empfehlungen": [
   "Fachberater-Rolle fuer Reklamationsgrundsaetze mit Weiterbildung 2027 formalisieren; stabile Zeitfenster und ruhigen Arbeitsplatz dauerhaft garantieren.",
   "Fruehwarnprinzip einfuehren: monatliches Kurzgespraech zur Belastung, damit erneute Verdichtung nicht wieder vier Monate unbemerkt bleibt.",
   "Teamkontakt gezielt ermoeglichen (Fachaustausch, Themenpatenschaft), weil Integration innerlich staerker wirkt als die Rolle verlangt.",
   "Weiterbildung zur Gespraechsfuehrung in Eskalationen anbieten, um Durchsetzungsstaerke und Wirkung beim Kunden zusammenzubringen."
  ],
  "werte": {
   "DUR": [
    130,
    120
   ],
   "INT": [
    100,
    110
   ],
   "SIC": [
    130,
    140
   ],
   "IND": [
    120,
    130
   ],
   "ERK": [
    130,
    120
   ],
   "EMP": [
    100,
    110
   ]
  }
 },
 "ergebnisse": [
  {
   "vakanz_id": "V4",
   "titel": "Sachbearbeitung Auftragsabwicklung und Abrechnung",
   "datei": "vakanz_04_sachbearbeitung_auftragsabwicklung.md",
   "vorher": {
    "vakanz_id": "V4",
    "titel": "Sachbearbeitung Auftragsabwicklung und Abrechnung",
    "datei": "vakanz_04_sachbearbeitung_auftragsabwicklung.md",
    "skills": [
     {
      "skill": "Auftragserfassung und Auftragsverfolgung",
      "bereich": "fachlich",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "auftragsbearbeitung",
      "ist": null,
      "erfuellung": 0.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Abrechnung und Rechnungspruefung",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "abrechnung",
      "ist": 1,
      "erfuellung": 50.0,
      "kern": false,
      "ungeprueft": true
     },
     {
      "skill": "Umgang mit Kostentraegern und Nachweisen",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "kostentraeger",
      "ist": 1,
      "erfuellung": 50.0,
      "kern": false,
      "ungeprueft": true
     },
     {
      "skill": "Telefonische Kundenkommunikation",
      "bereich": "sozial und kommunikativ",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "telefonie",
      "ist": 4,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Schriftliche Korrespondenz",
      "bereich": "sozial und kommunikativ",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "schriftlich",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Warenwirtschafts- und Abrechnungssystem",
      "bereich": "digital",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "warenwirtschaft",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Gaengige Office-Programme",
      "bereich": "digital",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "office",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Zahlenaffinitaet und Genauigkeit",
      "bereich": "methodisch",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "zahlen",
      "ist": 2,
      "erfuellung": 50.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Deutsch",
      "bereich": "Sprache",
      "soll": 4,
      "gewicht": 3,
      "schluessel": "deutsch",
      "ist": 4,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     }
    ],
    "skill_match": 73.3,
    "kern_match": 72.7,
    "kern_offen": [
     "Auftragserfassung und Auftragsverfolgung",
     "Zahlenaffinitaet und Genauigkeit"
    ],
    "zuschlaege": [
     {
      "id": "F+",
      "punkte": 10,
      "detail": "Pflicht ueber gleichwertige Klausel erfuellt (vergleichbaren taetigkeiten): keiner (BWL-Studium 2018–2020, 3 Semester, ohne Abschluss exmatrikuliert)"
     },
     {
      "id": "Z+",
      "punkte": 5,
      "detail": "Arbeitszeitmodell passt (39 h/Woche (Vollzeit); Gleitzeit mit festen Fenstern Di/Do ()"
     },
     {
      "id": "S0",
      "punkte": 0,
      "detail": "keine Sprach- oder Systemanforderung in dieser Vakanz"
     },
     {
      "id": "B+",
      "punkte": 5,
      "detail": "Branchenvorkenntnis vorhanden: Gesundheits- und Hilfsmittelversorgung"
     },
     {
      "id": "O-",
      "punkte": -15,
      "detail": "Standortwechsel erforderlich (Wohnort Hannover-Ricklingen)"
     }
    ],
    "zuschlagssumme": 5,
    "match": 78.3,
    "zone": {
     "id": "gruen_gelb",
     "von": 65,
     "bis": 79.99,
     "label": "Wirtschaftlichkeit pruefen",
     "farbe": "#3d8b40",
     "empfehlung": "Kosten-Nutzen-Rechnung, Amortisation und Vergleich zur externen Neubesetzung vorlegen.",
     "sicht_mitarbeiter": true
    },
    "rahmen": {
     "Position": "Sachbearbeitung Auftragsabwicklung und Abrechnung (Vertriebsinnendienst)",
     "Bereich": "Innendienst / Auftragsabwicklung und Abrechnung",
     "Berichtet an": "Leitung Innendienst",
     "Standort": "Verwaltungssitz in Nordwestdeutschland (fiktiv), Praesenz vor Ort",
     "Vertragsart": "Festanstellung, unbefristet",
     "Beschaeftigungsumfang": "Vollzeit",
     "Arbeitszeit": "Montag bis Freitag, flexible Arbeitszeitmodelle",
     "Einstieg": "zum naechstmoeglichen Zeitpunkt",
     "Funktionsebene": "Fachkraft ohne Fuehrungsverantwortung",
     "Unternehmen": "mittelstaendischer Anbieter von Gesundheits- und Hilfsmittelprodukten mit mehreren Standorten"
    },
    "formale_anforderungen": [
     "Abgeschlossene kaufmaennische Ausbildung oder Berufserfahrung in vergleichbaren Taetigkeiten",
     "Idealerweise Erfahrung im Umgang mit Kostentraegern oder im Gesundheitswesen",
     "Sicherer Umgang mit dem Computer und branchenueblichen Fachanwendungen",
     "Sehr gute Deutschkenntnisse in Wort und Schrift"
    ],
    "mit_weiterbildung": false
   },
   "nachher": {
    "vakanz_id": "V4",
    "titel": "Sachbearbeitung Auftragsabwicklung und Abrechnung",
    "datei": "vakanz_04_sachbearbeitung_auftragsabwicklung.md",
    "skills": [
     {
      "skill": "Auftragserfassung und Auftragsverfolgung",
      "bereich": "fachlich",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "auftragsbearbeitung",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Abrechnung und Rechnungspruefung",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "abrechnung",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": true
     },
     {
      "skill": "Umgang mit Kostentraegern und Nachweisen",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "kostentraeger",
      "ist": 1,
      "erfuellung": 50.0,
      "kern": false,
      "ungeprueft": true
     },
     {
      "skill": "Telefonische Kundenkommunikation",
      "bereich": "sozial und kommunikativ",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "telefonie",
      "ist": 4,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Schriftliche Korrespondenz",
      "bereich": "sozial und kommunikativ",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "schriftlich",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Warenwirtschafts- und Abrechnungssystem",
      "bereich": "digital",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "warenwirtschaft",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Gaengige Office-Programme",
      "bereich": "digital",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "office",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Zahlenaffinitaet und Genauigkeit",
      "bereich": "methodisch",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "zahlen",
      "ist": 2,
      "erfuellung": 50.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Deutsch",
      "bereich": "Sprache",
      "soll": 4,
      "gewicht": 3,
      "schluessel": "deutsch",
      "ist": 4,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     }
    ],
    "skill_match": 90.0,
    "kern_match": 90.9,
    "kern_offen": [
     "Zahlenaffinitaet und Genauigkeit"
    ],
    "zuschlaege": [
     {
      "id": "F+",
      "punkte": 10,
      "detail": "Pflicht ueber gleichwertige Klausel erfuellt (vergleichbaren taetigkeiten): keiner (BWL-Studium 2018–2020, 3 Semester, ohne Abschluss exmatrikuliert)"
     },
     {
      "id": "Z+",
      "punkte": 5,
      "detail": "Arbeitszeitmodell passt (39 h/Woche (Vollzeit); Gleitzeit mit festen Fenstern Di/Do ()"
     },
     {
      "id": "S0",
      "punkte": 0,
      "detail": "keine Sprach- oder Systemanforderung in dieser Vakanz"
     },
     {
      "id": "B+",
      "punkte": 5,
      "detail": "Branchenvorkenntnis vorhanden: Gesundheits- und Hilfsmittelversorgung"
     },
     {
      "id": "O-",
      "punkte": -15,
      "detail": "Standortwechsel erforderlich (Wohnort Hannover-Ricklingen)"
     }
    ],
    "zuschlagssumme": 5,
    "match": 95.0,
    "zone": {
     "id": "gruen",
     "von": 80,
     "bis": 100,
     "label": "Ziel erreicht - Mitarbeiter ist schon da",
     "farbe": "#1e7a34",
     "empfehlung": "Kurzer Umsetzungspfad, keine Grundsatzdebatte. Weiterbildung nur fuer Restluecken.",
     "sicht_mitarbeiter": true
    },
    "rahmen": {
     "Position": "Sachbearbeitung Auftragsabwicklung und Abrechnung (Vertriebsinnendienst)",
     "Bereich": "Innendienst / Auftragsabwicklung und Abrechnung",
     "Berichtet an": "Leitung Innendienst",
     "Standort": "Verwaltungssitz in Nordwestdeutschland (fiktiv), Praesenz vor Ort",
     "Vertragsart": "Festanstellung, unbefristet",
     "Beschaeftigungsumfang": "Vollzeit",
     "Arbeitszeit": "Montag bis Freitag, flexible Arbeitszeitmodelle",
     "Einstieg": "zum naechstmoeglichen Zeitpunkt",
     "Funktionsebene": "Fachkraft ohne Fuehrungsverantwortung",
     "Unternehmen": "mittelstaendischer Anbieter von Gesundheits- und Hilfsmittelprodukten mit mehreren Standorten"
    },
    "formale_anforderungen": [
     "Abgeschlossene kaufmaennische Ausbildung oder Berufserfahrung in vergleichbaren Taetigkeiten",
     "Idealerweise Erfahrung im Umgang mit Kostentraegern oder im Gesundheitswesen",
     "Sicherer Umgang mit dem Computer und branchenueblichen Fachanwendungen",
     "Sehr gute Deutschkenntnisse in Wort und Schrift"
    ],
    "mit_weiterbildung": true
   },
   "zuwachs": 16.7,
   "zone": {
    "id": "gruen",
    "von": 80,
    "bis": 100,
    "label": "Ziel erreicht - Mitarbeiter ist schon da",
    "farbe": "#1e7a34",
    "empfehlung": "Kurzer Umsetzungspfad, keine Grundsatzdebatte. Weiterbildung nur fuer Restluecken.",
    "sicht_mitarbeiter": true
   },
   "sicht_mitarbeiter": true,
   "weiterbildung": {
    "kurse": [
     {
      "id": "WBS-001",
      "anbieter": "WBS TRAINING",
      "name": "Sachbearbeiter:in Auftragsmanagement mit SAP und Arbeiten 5.0 mit KI",
      "zielniveau": "Niveau 3: typische Auftragsaufgaben selbstständig (redaktionelle Einschätzung)",
      "lernformat": "Präsenz am Standort oder Online-Lernumgebung",
      "kontaktstunden": "nicht ausgelesen (Kursseite)",
      "kalenderdauer": "nicht ausgelesen (Kursseite)",
      "wochenaufwand": "Vollzeit (i. d. R. 5 Tage/Woche)",
      "preisstatus": "Angebot erforderlich",
      "netto": null,
      "brutto": null,
      "bezug": "Person / Lehrgang",
      "eignung_cs": "hoch - Auftrags-, Kunden- und Systemarbeit aus dem Service ist direkt anschlussfähig",
      "ausschluss": "Ohne kaufmännische Vorbildung ist die Zulassung zu klären; Vollzeitumfang kann Weiterbildung neben dem Job ausschliessen",
      "wirkung": {
       "auftragsbearbeitung": 3,
       "warenwirtschaft": 2,
       "dokumentation": 3,
       "interne_kommunikation": 3
      }
     },
     {
      "id": "HAU-003",
      "anbieter": "Haufe Akademie",
      "name": "Basiswissen Buchführung und Bilanzierung",
      "zielniveau": "Niveau 2-3: vorbereitende Buchhaltung mit Anleitung bis selbstständig (redaktionelle Einschätzung)",
      "lernformat": "Präsenz oder Live-Online (je Termin)",
      "kontaktstunden": "ca. 24 Unterrichtsstunden (3 Tage, 09:00/09:30-17:00)",
      "kalenderdauer": "3 Tage",
      "wochenaufwand": "Vollzeit (ganztags)",
      "preisstatus": "veröffentlicht (Preis je Termin)",
      "netto": 1990,
      "brutto": 2368.1,
      "bezug": "Person / Kurs",
      "eignung_cs": "bedingt bis hoch - Beleg- und Rechnungsarbeit aus dem Service ist anschlussfähig, die Fachlogik ist neu",
      "ausschluss": "Ohne Softwarepraxis (DATEV) nur begrenzt einsetzbar",
      "wirkung": {
       "buchhaltung": 2,
       "rechnungspruefung": 2,
       "vorbereitende_buchhaltung": 2,
       "abrechnung": 2
      }
     }
    ],
    "kosten_belastbar_brutto": 2368.1,
    "offene_kosten": [
     "WBS-001: Preis nicht belastbar (Angebot erforderlich)"
    ],
    "betriebliche_einarbeitung": "Abrechnungs- und Nachweisprozesse sowie Kostentraegerkontakt im Betrieb einarbeiten.",
    "arbeitsprobe": "Auftrag erfassen, Kostenvoranschlag erstellen und eine Abrechnung vorbereiten.",
    "restluecken": "Umgang mit Kostentraegern bleibt bei 0 (Soll 2) - nur betrieblich zu schliessen; Telefonie bleibt bei 2 (Soll 3)."
   },
   "rahmen": {
    "Position": "Sachbearbeitung Auftragsabwicklung und Abrechnung (Vertriebsinnendienst)",
    "Bereich": "Innendienst / Auftragsabwicklung und Abrechnung",
    "Berichtet an": "Leitung Innendienst",
    "Standort": "Verwaltungssitz in Nordwestdeutschland (fiktiv), Praesenz vor Ort",
    "Vertragsart": "Festanstellung, unbefristet",
    "Beschaeftigungsumfang": "Vollzeit",
    "Arbeitszeit": "Montag bis Freitag, flexible Arbeitszeitmodelle",
    "Einstieg": "zum naechstmoeglichen Zeitpunkt",
    "Funktionsebene": "Fachkraft ohne Fuehrungsverantwortung",
    "Unternehmen": "mittelstaendischer Anbieter von Gesundheits- und Hilfsmittelprodukten mit mehreren Standorten"
   },
   "kern_offen": [
    "Zahlenaffinitaet und Genauigkeit"
   ],
   "ungeprueft": [
    "abrechnung",
    "kostentraeger"
   ]
  },
  {
   "vakanz_id": "V6",
   "titel": "Kundenberatung und Versorgung im Fachhandel (Quereinstieg moeglich)",
   "datei": "vakanz_06_kundenberatung_fachhandel.md",
   "vorher": {
    "vakanz_id": "V6",
    "titel": "Kundenberatung und Versorgung im Fachhandel (Quereinstieg moeglich)",
    "datei": "vakanz_06_kundenberatung_fachhandel.md",
    "skills": [
     {
      "skill": "Beratung von Kundinnen und Kunden",
      "bereich": "sozial und kommunikativ",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "beratung",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Produktanpassung und Massnahme",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "produktanpassung",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Verkaufsabwicklung und Kassenfuehrung",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "verkauf_kasse",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Warenwirtschaft und Wareneingang",
      "bereich": "digital",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "warenwirtschaft",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Reklamations- und Nachbetreuungsprozesse",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "reklamation",
      "ist": 4,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Erklaeren komplexer Zusammenhaenge in einfacher Sprache",
      "bereich": "sozial und kommunikativ",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "erklaeren",
      "ist": 1,
      "erfuellung": 0.0,
      "kern": true,
      "ungeprueft": true
     },
     {
      "skill": "Lernbereitschaft und Weiterbildungsbereitschaft",
      "bereich": "methodisch",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "lernbereitschaft",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Deutsch",
      "bereich": "Sprache",
      "soll": 4,
      "gewicht": 3,
      "schluessel": "deutsch",
      "ist": 4,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     }
    ],
    "skill_match": 84.6,
    "kern_match": 77.8,
    "kern_offen": [
     "Erklaeren komplexer Zusammenhaenge in einfacher Sprache"
    ],
    "zuschlaege": [
     {
      "id": "F+",
      "punkte": 10,
      "detail": "Pflicht ueber gleichwertige Klausel erfuellt (vergleichbare qualifikation): keiner (BWL-Studium 2018–2020, 3 Semester, ohne Abschluss exmatrikuliert)"
     },
     {
      "id": "Z+",
      "punkte": 5,
      "detail": "Arbeitszeitmodell passt (39 h/Woche (Vollzeit); Gleitzeit mit festen Fenstern Di/Do ()"
     },
     {
      "id": "S0",
      "punkte": 0,
      "detail": "keine Sprach- oder Systemanforderung in dieser Vakanz"
     },
     {
      "id": "B+",
      "punkte": 5,
      "detail": "Branchenvorkenntnis vorhanden: Gesundheits- und Hilfsmittelversorgung"
     },
     {
      "id": "O-",
      "punkte": -15,
      "detail": "Standortwechsel erforderlich (Wohnort Hannover-Ricklingen)"
     }
    ],
    "zuschlagssumme": 5,
    "match": 89.6,
    "zone": {
     "id": "gruen",
     "von": 80,
     "bis": 100,
     "label": "Ziel erreicht - Mitarbeiter ist schon da",
     "farbe": "#1e7a34",
     "empfehlung": "Kurzer Umsetzungspfad, keine Grundsatzdebatte. Weiterbildung nur fuer Restluecken.",
     "sicht_mitarbeiter": true
    },
    "rahmen": {
     "Position": "Kundenberatung und Versorgung im Fachhandel",
     "Bereich": "Fachhandel / Kundenberatung",
     "Berichtet an": "Filialleitung",
     "Standort": "Nordostdeutschland (fiktiv), Einsatz in einer Filiale und im Umfeld",
     "Vertragsart": "Festanstellung, unbefristet",
     "Beschaeftigungsumfang": "Vollzeit oder Teilzeit",
     "Arbeitszeit": "Montag bis Freitag sowie Samstag nach Plan, familienfreundliche Arbeitszeiten",
     "Einstieg": "ab sofort oder nach Vereinbarung",
     "Funktionsebene": "Fachkraft ohne Fuehrungsverantwortung, Quereinstieg ausdruecklich willkommen",
     "Unternehmen": "mittelstaendischer Fachhandelsbetrieb der Gesundheits- und Hilfsmittelversorgung"
    },
    "formale_anforderungen": [
     "Abgeschlossene Berufsausbildung im Einzelhandel oder eine vergleichbare Qualifikation",
     "Quereinsteigende mit Erfahrung im Kundenkontakt sind ausdruecklich willkommen",
     "Gute Computerkenntnisse fuer Kasse, Warenwirtschaft und Wareneingang",
     "Sehr gute Deutschkenntnisse in Wort und Schrift",
     "Bereitschaft, sich fachlich einzuarbeiten und Weiterbildungen zu besuchen"
    ],
    "mit_weiterbildung": false
   },
   "nachher": {
    "vakanz_id": "V6",
    "titel": "Kundenberatung und Versorgung im Fachhandel (Quereinstieg moeglich)",
    "datei": "vakanz_06_kundenberatung_fachhandel.md",
    "skills": [
     {
      "skill": "Beratung von Kundinnen und Kunden",
      "bereich": "sozial und kommunikativ",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "beratung",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Produktanpassung und Massnahme",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "produktanpassung",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Verkaufsabwicklung und Kassenfuehrung",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "verkauf_kasse",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Warenwirtschaft und Wareneingang",
      "bereich": "digital",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "warenwirtschaft",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Reklamations- und Nachbetreuungsprozesse",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "reklamation",
      "ist": 4,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Erklaeren komplexer Zusammenhaenge in einfacher Sprache",
      "bereich": "sozial und kommunikativ",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "erklaeren",
      "ist": 1,
      "erfuellung": 0.0,
      "kern": true,
      "ungeprueft": true
     },
     {
      "skill": "Lernbereitschaft und Weiterbildungsbereitschaft",
      "bereich": "methodisch",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "lernbereitschaft",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Deutsch",
      "bereich": "Sprache",
      "soll": 4,
      "gewicht": 3,
      "schluessel": "deutsch",
      "ist": 4,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     }
    ],
    "skill_match": 84.6,
    "kern_match": 77.8,
    "kern_offen": [
     "Erklaeren komplexer Zusammenhaenge in einfacher Sprache"
    ],
    "zuschlaege": [
     {
      "id": "F+",
      "punkte": 10,
      "detail": "Pflicht ueber gleichwertige Klausel erfuellt (vergleichbare qualifikation): keiner (BWL-Studium 2018–2020, 3 Semester, ohne Abschluss exmatrikuliert)"
     },
     {
      "id": "Z+",
      "punkte": 5,
      "detail": "Arbeitszeitmodell passt (39 h/Woche (Vollzeit); Gleitzeit mit festen Fenstern Di/Do ()"
     },
     {
      "id": "S0",
      "punkte": 0,
      "detail": "keine Sprach- oder Systemanforderung in dieser Vakanz"
     },
     {
      "id": "B+",
      "punkte": 5,
      "detail": "Branchenvorkenntnis vorhanden: Gesundheits- und Hilfsmittelversorgung"
     },
     {
      "id": "O-",
      "punkte": -15,
      "detail": "Standortwechsel erforderlich (Wohnort Hannover-Ricklingen)"
     }
    ],
    "zuschlagssumme": 5,
    "match": 89.6,
    "zone": {
     "id": "gruen",
     "von": 80,
     "bis": 100,
     "label": "Ziel erreicht - Mitarbeiter ist schon da",
     "farbe": "#1e7a34",
     "empfehlung": "Kurzer Umsetzungspfad, keine Grundsatzdebatte. Weiterbildung nur fuer Restluecken.",
     "sicht_mitarbeiter": true
    },
    "rahmen": {
     "Position": "Kundenberatung und Versorgung im Fachhandel",
     "Bereich": "Fachhandel / Kundenberatung",
     "Berichtet an": "Filialleitung",
     "Standort": "Nordostdeutschland (fiktiv), Einsatz in einer Filiale und im Umfeld",
     "Vertragsart": "Festanstellung, unbefristet",
     "Beschaeftigungsumfang": "Vollzeit oder Teilzeit",
     "Arbeitszeit": "Montag bis Freitag sowie Samstag nach Plan, familienfreundliche Arbeitszeiten",
     "Einstieg": "ab sofort oder nach Vereinbarung",
     "Funktionsebene": "Fachkraft ohne Fuehrungsverantwortung, Quereinstieg ausdruecklich willkommen",
     "Unternehmen": "mittelstaendischer Fachhandelsbetrieb der Gesundheits- und Hilfsmittelversorgung"
    },
    "formale_anforderungen": [
     "Abgeschlossene Berufsausbildung im Einzelhandel oder eine vergleichbare Qualifikation",
     "Quereinsteigende mit Erfahrung im Kundenkontakt sind ausdruecklich willkommen",
     "Gute Computerkenntnisse fuer Kasse, Warenwirtschaft und Wareneingang",
     "Sehr gute Deutschkenntnisse in Wort und Schrift",
     "Bereitschaft, sich fachlich einzuarbeiten und Weiterbildungen zu besuchen"
    ],
    "mit_weiterbildung": true
   },
   "zuwachs": 0.0,
   "zone": {
    "id": "gruen",
    "von": 80,
    "bis": 100,
    "label": "Ziel erreicht - Mitarbeiter ist schon da",
    "farbe": "#1e7a34",
    "empfehlung": "Kurzer Umsetzungspfad, keine Grundsatzdebatte. Weiterbildung nur fuer Restluecken.",
    "sicht_mitarbeiter": true
   },
   "sicht_mitarbeiter": true,
   "weiterbildung": {
    "kurse": [],
    "kosten_belastbar_brutto": null,
    "offene_kosten": [],
    "betriebliche_einarbeitung": "Fachliche Produktqualifizierung (Anpassung, Masse, Kasse) durch Hersteller- oder Fachexpertenschulung noetig.",
    "arbeitsprobe": "Eine Beratung mit Anpassung begleitet durchfuehren und einen Kassiervorgang abschliessen.",
    "restluecken": "Kein Angebot in der Kursbasis - Produktanpassung, Kassenfuehrung und Warenwirtschaft bleiben betriebliche Aufgabe."
   },
   "rahmen": {
    "Position": "Kundenberatung und Versorgung im Fachhandel",
    "Bereich": "Fachhandel / Kundenberatung",
    "Berichtet an": "Filialleitung",
    "Standort": "Nordostdeutschland (fiktiv), Einsatz in einer Filiale und im Umfeld",
    "Vertragsart": "Festanstellung, unbefristet",
    "Beschaeftigungsumfang": "Vollzeit oder Teilzeit",
    "Arbeitszeit": "Montag bis Freitag sowie Samstag nach Plan, familienfreundliche Arbeitszeiten",
    "Einstieg": "ab sofort oder nach Vereinbarung",
    "Funktionsebene": "Fachkraft ohne Fuehrungsverantwortung, Quereinstieg ausdruecklich willkommen",
    "Unternehmen": "mittelstaendischer Fachhandelsbetrieb der Gesundheits- und Hilfsmittelversorgung"
   },
   "kern_offen": [
    "Erklaeren komplexer Zusammenhaenge in einfacher Sprache"
   ],
   "ungeprueft": [
    "erklaeren"
   ]
  },
  {
   "vakanz_id": "V3",
   "titel": "Office-Management mit anteiliger Unterstuetzung in Buchhaltung",
   "datei": "vakanz_03_office_management.md",
   "vorher": {
    "vakanz_id": "V3",
    "titel": "Office-Management mit anteiliger Unterstuetzung in Buchhaltung",
    "datei": "vakanz_03_office_management.md",
    "skills": [
     {
      "skill": "Bueroorganisation und Bestellwesen",
      "bereich": "fachlich",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "bueroorganisation",
      "ist": 2,
      "erfuellung": 50.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Termin- und Vorgangsorganisation",
      "bereich": "methodisch",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "terminorganisation",
      "ist": 1,
      "erfuellung": 0.0,
      "kern": true,
      "ungeprueft": true
     },
     {
      "skill": "Steuerung externer Dienstleister",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "dienstleister",
      "ist": null,
      "erfuellung": 0.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Vorbereitende Buchhaltung",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "vorbereitende_buchhaltung",
      "ist": 1,
      "erfuellung": 50.0,
      "kern": false,
      "ungeprueft": true
     },
     {
      "skill": "Gaengige Office-Programme",
      "bereich": "digital",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "office",
      "ist": 2,
      "erfuellung": 50.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Digitale Werkzeuge und Prozesse",
      "bereich": "digital",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "digitale_werkzeuge",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Kommunikation mit internen Ansprechpersonen",
      "bereich": "sozial und kommunikativ",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "interne_kommunikation",
      "ist": 2,
      "erfuellung": 50.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Selbstorganisation und Priorisierung",
      "bereich": "methodisch",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "selbstorganisation",
      "ist": 2,
      "erfuellung": 50.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Deutsch",
      "bereich": "Sprache",
      "soll": 4,
      "gewicht": 3,
      "schluessel": "deutsch",
      "ist": 4,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Englisch",
      "bereich": "Sprache",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "englisch",
      "ist": 1,
      "erfuellung": 50.0,
      "kern": false,
      "ungeprueft": false
     }
    ],
    "skill_match": 52.9,
    "kern_match": 53.8,
    "kern_offen": [
     "Bueroorganisation und Bestellwesen",
     "Termin- und Vorgangsorganisation",
     "Gaengige Office-Programme",
     "Kommunikation mit internen Ansprechpersonen",
     "Selbstorganisation und Priorisierung"
    ],
    "zuschlaege": [
     {
      "id": "F+",
      "punkte": 10,
      "detail": "Pflicht ueber gleichwertige Klausel erfuellt (vergleichbare qualifikation): keiner (BWL-Studium 2018–2020, 3 Semester, ohne Abschluss exmatrikuliert)"
     },
     {
      "id": "Z+",
      "punkte": 5,
      "detail": "Arbeitszeitmodell passt (39 h/Woche (Vollzeit); Gleitzeit mit festen Fenstern Di/Do ()"
     },
     {
      "id": "S-",
      "punkte": -10,
      "detail": "Englisch gefordert (Soll 2), Ist 1"
     },
     {
      "id": "B0",
      "punkte": 0,
      "detail": "keine Branchenvorgabe"
     },
     {
      "id": "O-",
      "punkte": -15,
      "detail": "Standortwechsel erforderlich (Wohnort Hannover-Ricklingen)"
     }
    ],
    "zuschlagssumme": -10,
    "match": 42.9,
    "zone": {
     "id": "rot",
     "von": 0,
     "bis": 49.99,
     "label": "Kein sinnvoller Weg",
     "farbe": "#c0392b",
     "empfehlung": "Option wird nicht weiterverfolgt. Begruendung ausweisen, keine Kostenrechnung.",
     "sicht_mitarbeiter": false
    },
    "rahmen": {
     "Position": "Office-Management mit anteiliger Unterstuetzung in der Buchhaltung",
     "Bereich": "Verwaltung, Organisation und Backoffice",
     "Berichtet an": "Kaufmaennische Leitung",
     "Standort": "Unternehmenssitz in Nordostdeutschland (fiktiv), Praesenz vor Ort",
     "Vertragsart": "Festanstellung, unbefristet",
     "Beschaeftigungsumfang": "Vollzeit oder Teilzeit",
     "Arbeitszeit": "Montag bis Freitag; das Office-Management umfasst bis zu 20 Stunden pro Woche, der Rest der vereinbarten Wochenarbeitszeit entfaellt auf die Unterstuetzung in der Buchhaltung",
     "Einstieg": "zum naechstmoeglichen Zeitpunkt",
     "Funktionsebene": "Fachkraft ohne Fuehrungsverantwortung",
     "Unternehmen": "mittelstaendisches Handelsunternehmen mit eigenem Standort"
    },
    "formale_anforderungen": [
     "Abgeschlossene kaufmaennische Ausbildung oder vergleichbare Qualifikation",
     "Relevante Berufserfahrung im kaufmaennischen Bereich von Vorteil",
     "Sicherer Umgang mit gaengigen Office-Programmen",
     "Affinitaet fuer digitale Werkzeuge und Prozesse",
     "Sehr gute Deutschkenntnisse, gute Englischkenntnisse in Wort und Schrift"
    ],
    "mit_weiterbildung": false
   },
   "nachher": {
    "vakanz_id": "V3",
    "titel": "Office-Management mit anteiliger Unterstuetzung in Buchhaltung",
    "datei": "vakanz_03_office_management.md",
    "skills": [
     {
      "skill": "Bueroorganisation und Bestellwesen",
      "bereich": "fachlich",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "bueroorganisation",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Termin- und Vorgangsorganisation",
      "bereich": "methodisch",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "terminorganisation",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": true
     },
     {
      "skill": "Steuerung externer Dienstleister",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "dienstleister",
      "ist": null,
      "erfuellung": 0.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Vorbereitende Buchhaltung",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "vorbereitende_buchhaltung",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": true
     },
     {
      "skill": "Gaengige Office-Programme",
      "bereich": "digital",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "office",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Digitale Werkzeuge und Prozesse",
      "bereich": "digital",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "digitale_werkzeuge",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Kommunikation mit internen Ansprechpersonen",
      "bereich": "sozial und kommunikativ",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "interne_kommunikation",
      "ist": 2,
      "erfuellung": 50.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Selbstorganisation und Priorisierung",
      "bereich": "methodisch",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "selbstorganisation",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Deutsch",
      "bereich": "Sprache",
      "soll": 4,
      "gewicht": 3,
      "schluessel": "deutsch",
      "ist": 4,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Englisch",
      "bereich": "Sprache",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "englisch",
      "ist": 1,
      "erfuellung": 50.0,
      "kern": false,
      "ungeprueft": false
     }
    ],
    "skill_match": 85.3,
    "kern_match": 92.3,
    "kern_offen": [
     "Kommunikation mit internen Ansprechpersonen"
    ],
    "zuschlaege": [
     {
      "id": "F+",
      "punkte": 10,
      "detail": "Pflicht ueber gleichwertige Klausel erfuellt (vergleichbare qualifikation): keiner (BWL-Studium 2018–2020, 3 Semester, ohne Abschluss exmatrikuliert)"
     },
     {
      "id": "Z+",
      "punkte": 5,
      "detail": "Arbeitszeitmodell passt (39 h/Woche (Vollzeit); Gleitzeit mit festen Fenstern Di/Do ()"
     },
     {
      "id": "S-",
      "punkte": -10,
      "detail": "Englisch gefordert (Soll 2), Ist 1"
     },
     {
      "id": "B0",
      "punkte": 0,
      "detail": "keine Branchenvorgabe"
     },
     {
      "id": "O-",
      "punkte": -15,
      "detail": "Standortwechsel erforderlich (Wohnort Hannover-Ricklingen)"
     }
    ],
    "zuschlagssumme": -10,
    "match": 75.3,
    "zone": {
     "id": "gruen_gelb",
     "von": 65,
     "bis": 79.99,
     "label": "Wirtschaftlichkeit pruefen",
     "farbe": "#3d8b40",
     "empfehlung": "Kosten-Nutzen-Rechnung, Amortisation und Vergleich zur externen Neubesetzung vorlegen.",
     "sicht_mitarbeiter": true
    },
    "rahmen": {
     "Position": "Office-Management mit anteiliger Unterstuetzung in der Buchhaltung",
     "Bereich": "Verwaltung, Organisation und Backoffice",
     "Berichtet an": "Kaufmaennische Leitung",
     "Standort": "Unternehmenssitz in Nordostdeutschland (fiktiv), Praesenz vor Ort",
     "Vertragsart": "Festanstellung, unbefristet",
     "Beschaeftigungsumfang": "Vollzeit oder Teilzeit",
     "Arbeitszeit": "Montag bis Freitag; das Office-Management umfasst bis zu 20 Stunden pro Woche, der Rest der vereinbarten Wochenarbeitszeit entfaellt auf die Unterstuetzung in der Buchhaltung",
     "Einstieg": "zum naechstmoeglichen Zeitpunkt",
     "Funktionsebene": "Fachkraft ohne Fuehrungsverantwortung",
     "Unternehmen": "mittelstaendisches Handelsunternehmen mit eigenem Standort"
    },
    "formale_anforderungen": [
     "Abgeschlossene kaufmaennische Ausbildung oder vergleichbare Qualifikation",
     "Relevante Berufserfahrung im kaufmaennischen Bereich von Vorteil",
     "Sicherer Umgang mit gaengigen Office-Programmen",
     "Affinitaet fuer digitale Werkzeuge und Prozesse",
     "Sehr gute Deutschkenntnisse, gute Englischkenntnisse in Wort und Schrift"
    ],
    "mit_weiterbildung": true
   },
   "zuwachs": 32.4,
   "zone": {
    "id": "gruen_gelb",
    "von": 65,
    "bis": 79.99,
    "label": "Wirtschaftlichkeit pruefen",
    "farbe": "#3d8b40",
    "empfehlung": "Kosten-Nutzen-Rechnung, Amortisation und Vergleich zur externen Neubesetzung vorlegen.",
    "sicht_mitarbeiter": true
   },
   "sicht_mitarbeiter": true,
   "weiterbildung": {
    "kurse": [
     {
      "id": "HAU-001",
      "anbieter": "Haufe Akademie",
      "name": "Der:Die Office-Manager:in",
      "zielniveau": "Niveau 2-3: typische Office-Aufgaben selbstständig (redaktionelle Einschätzung)",
      "lernformat": "Präsenz oder Live-Online (je Termin)",
      "kontaktstunden": "16 Unterrichtsstunden (2 Tage, 09:00-17:00)",
      "kalenderdauer": "2 Tage",
      "wochenaufwand": "Vollzeit (ganztags)",
      "preisstatus": "veröffentlicht (Preis je Termin)",
      "netto": 1540,
      "brutto": 1832.6,
      "bezug": "Person / Kurs",
      "eignung_cs": "hoch - Büro-, Termin- und Kommunikationsarbeit aus dem Kundenservice ist anschlussfähig",
      "ausschluss": "Präsenzreise muss möglich sein; keine Positionszusage",
      "wirkung": {
       "bueroorganisation": 3,
       "terminorganisation": 3,
       "office": 2,
       "selbstorganisation": 3,
       "dokumentation": 2,
       "interne_kommunikation": 2
      }
     },
     {
      "id": "EIG-001",
      "anbieter": "Eigene Kombination (kein Anbieterprodukt)",
      "name": "Kombination: Kaufmännische Sachbearbeitung und Office-Basis",
      "zielniveau": "Niveau 2-3 (redaktionelle Einschätzung)",
      "lernformat": "Präsenz oder Live-Online (je Termin)",
      "kontaktstunden": null,
      "kalenderdauer": null,
      "wochenaufwand": "Vollzeit (ganztags)",
      "preisstatus": "Summe der Einzelangebote (kein Gesamtpreis des Anbieters)",
      "netto": null,
      "brutto": null,
      "bezug": "Person / Kurs",
      "eignung_cs": "hoch - niedrigschwelliger Aufbau, Selbstlernen mit Präsenzanteil",
      "ausschluss": "Zeitliche Abstimmung der drei Angebote erforderlich; Lizenzkosten klären",
      "wirkung": {
       "excel": 2,
       "office": 2,
       "bueroorganisation": 3,
       "terminorganisation": 3
      }
     },
     {
      "id": "CFR-002",
      "anbieter": "Coursera for Business",
      "name": "Einführung in die Datenanalyse mit Excel",
      "zielniveau": "Niveau 3 (redaktionelle Einschätzung)",
      "lernformat": "Selbstlernen (On-Demand), teils Untertitel",
      "kontaktstunden": "Kursdauer laut Kursseite",
      "kalenderdauer": "Selbstlernen, flexibel",
      "wochenaufwand": "berufsbegleitend, flexibel",
      "preisstatus": "im Firmentarif enthalten (nicht öffentlich verifiziert)",
      "netto": null,
      "brutto": null,
      "bezug": "Lizenz / Nutzer / Jahr",
      "eignung_cs": "hoch - Auswertungskompetenz ist in Sachbearbeitung/Prozessunterstützung gefragt",
      "ausschluss": "Setzt Excel-Grundlagen voraus",
      "wirkung": {
       "excel": 3,
       "excel_reporting": 3,
       "office": 3,
       "dokumentation": 2
      }
     },
     {
      "id": "HAU-003",
      "anbieter": "Haufe Akademie",
      "name": "Basiswissen Buchführung und Bilanzierung",
      "zielniveau": "Niveau 2-3: vorbereitende Buchhaltung mit Anleitung bis selbstständig (redaktionelle Einschätzung)",
      "lernformat": "Präsenz oder Live-Online (je Termin)",
      "kontaktstunden": "ca. 24 Unterrichtsstunden (3 Tage, 09:00/09:30-17:00)",
      "kalenderdauer": "3 Tage",
      "wochenaufwand": "Vollzeit (ganztags)",
      "preisstatus": "veröffentlicht (Preis je Termin)",
      "netto": 1990,
      "brutto": 2368.1,
      "bezug": "Person / Kurs",
      "eignung_cs": "bedingt bis hoch - Beleg- und Rechnungsarbeit aus dem Service ist anschlussfähig, die Fachlogik ist neu",
      "ausschluss": "Ohne Softwarepraxis (DATEV) nur begrenzt einsetzbar",
      "wirkung": {
       "buchhaltung": 2,
       "rechnungspruefung": 2,
       "vorbereitende_buchhaltung": 2,
       "abrechnung": 2
      }
     }
    ],
    "kosten_belastbar_brutto": 4200.7,
    "offene_kosten": [
     "EIG-001: Preis nicht belastbar (Summe der Einzelangebote (kein Gesamtpreis des Anbieters))",
     "CFR-002: Preis nicht belastbar (im Firmentarif enthalten (nicht öffentlich verifiziert))"
    ],
    "betriebliche_einarbeitung": "Bestellwesen und Standortthemen uebernehmen; vorbereitende Buchhaltung im Betrieb einarbeiten.",
    "arbeitsprobe": "Bestellwesen organisieren, Auswertung erstellen und eine Standortaufgabe eigenstaendig abschliessen.",
    "restluecken": "Englisch bleibt offen (Soll 2), Steuerung externer Dienstleister nur Grundlagen."
   },
   "rahmen": {
    "Position": "Office-Management mit anteiliger Unterstuetzung in der Buchhaltung",
    "Bereich": "Verwaltung, Organisation und Backoffice",
    "Berichtet an": "Kaufmaennische Leitung",
    "Standort": "Unternehmenssitz in Nordostdeutschland (fiktiv), Praesenz vor Ort",
    "Vertragsart": "Festanstellung, unbefristet",
    "Beschaeftigungsumfang": "Vollzeit oder Teilzeit",
    "Arbeitszeit": "Montag bis Freitag; das Office-Management umfasst bis zu 20 Stunden pro Woche, der Rest der vereinbarten Wochenarbeitszeit entfaellt auf die Unterstuetzung in der Buchhaltung",
    "Einstieg": "zum naechstmoeglichen Zeitpunkt",
    "Funktionsebene": "Fachkraft ohne Fuehrungsverantwortung",
    "Unternehmen": "mittelstaendisches Handelsunternehmen mit eigenem Standort"
   },
   "kern_offen": [
    "Kommunikation mit internen Ansprechpersonen"
   ],
   "ungeprueft": [
    "terminorganisation",
    "vorbereitende_buchhaltung"
   ]
  },
  {
   "vakanz_id": "V1",
   "titel": "Assistenz Einkauf (Assistant Buyer)",
   "datei": "vakanz_01_assistenz_einkauf.md",
   "vorher": {
    "vakanz_id": "V1",
    "titel": "Assistenz Einkauf (Assistant Buyer)",
    "datei": "vakanz_01_assistenz_einkauf.md",
    "skills": [
     {
      "skill": "Auftrags- und Terminverfolgung",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "auftragsbearbeitung",
      "ist": null,
      "erfuellung": 0.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Stammdatenpflege",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "stammdaten_system",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Lieferantenkommunikation",
      "bereich": "sozial und kommunikativ",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "lieferanten",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Auswertungen und Tabellenkalkulation",
      "bereich": "digital",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "excel",
      "ist": 1,
      "erfuellung": 0.0,
      "kern": true,
      "ungeprueft": true
     },
     {
      "skill": "Warenwirtschafts- und ERP-System",
      "bereich": "digital",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "warenwirtschaft",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Analytisches Arbeiten",
      "bereich": "methodisch",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "analytik",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Genauigkeit und Sorgfalt",
      "bereich": "methodisch",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "genauigkeit",
      "ist": 2,
      "erfuellung": 50.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Abteilungsuebergreifende Abstimmung",
      "bereich": "methodisch",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "interne_kommunikation",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Deutsch",
      "bereich": "Sprache",
      "soll": 4,
      "gewicht": 3,
      "schluessel": "deutsch",
      "ist": 4,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Englisch",
      "bereich": "Sprache",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "englisch",
      "ist": 1,
      "erfuellung": 0.0,
      "kern": true,
      "ungeprueft": false
     }
    ],
    "skill_match": 60.0,
    "kern_match": 44.4,
    "kern_offen": [
     "Auswertungen und Tabellenkalkulation",
     "Genauigkeit und Sorgfalt",
     "Englisch"
    ],
    "zuschlaege": [
     {
      "id": "F+",
      "punkte": 10,
      "detail": "Pflicht ueber gleichwertige Klausel erfuellt (vergleichbare qualifikation): keiner (BWL-Studium 2018–2020, 3 Semester, ohne Abschluss exmatrikuliert)"
     },
     {
      "id": "Z+",
      "punkte": 5,
      "detail": "Arbeitszeitmodell passt (39 h/Woche (Vollzeit); Gleitzeit mit festen Fenstern Di/Do ()"
     },
     {
      "id": "S-",
      "punkte": -10,
      "detail": "Englisch gefordert (Soll 3), Ist 1"
     },
     {
      "id": "B+",
      "punkte": 5,
      "detail": "Branchenvorkenntnis vorhanden: Einkauf und Handel"
     },
     {
      "id": "O-",
      "punkte": -15,
      "detail": "Standortwechsel erforderlich (Wohnort Hannover-Ricklingen)"
     }
    ],
    "zuschlagssumme": -5,
    "match": 55.0,
    "zone": {
     "id": "gelb",
     "von": 50,
     "bis": 64.99,
     "label": "Nur mit Ausnahmeentscheidung",
     "farbe": "#e08a00",
     "empfehlung": "Kosten, Zeit und Risiko vollstaendig ausweisen; Entscheidung ausdruecklich als Ausnahme dokumentieren.",
     "sicht_mitarbeiter": false
    },
    "rahmen": {
     "Position": "Assistenz Einkauf (Assistant Buyer)",
     "Bereich": "Einkauf und Sortimentsmanagement",
     "Berichtet an": "Einkaufsleitung",
     "Standort": "Unternehmenssitz in Nordostdeutschland (fiktiv), Praesenz vor Ort",
     "Vertragsart": "Festanstellung, unbefristet",
     "Beschaeftigungsumfang": "Vollzeit",
     "Arbeitszeit": "Montag bis Freitag im Tagesgeschaeft",
     "Einstieg": "zum naechstmoeglichen Zeitpunkt",
     "Funktionsebene": "Fachkraft ohne Fuehrungsverantwortung",
     "Unternehmen": "mittelstaendisches Handelsunternehmen im Online- und Kataloggeschaeft"
    },
    "formale_anforderungen": [
     "Abgeschlossene kaufmaennische Ausbildung oder vergleichbare Qualifikation",
     "Erste Erfahrung im Einkauf oder in einer vergleichbaren kaufmaennischen Rolle von Vorteil",
     "Sehr gute analytische Faehigkeiten",
     "Sicherer Umgang mit gaengigen Office-Programmen, insbesondere Tabellenkalkulation",
     "Fliessende Deutschkenntnisse, gute Englischkenntnisse"
    ],
    "mit_weiterbildung": false
   },
   "nachher": {
    "vakanz_id": "V1",
    "titel": "Assistenz Einkauf (Assistant Buyer)",
    "datei": "vakanz_01_assistenz_einkauf.md",
    "skills": [
     {
      "skill": "Auftrags- und Terminverfolgung",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "auftragsbearbeitung",
      "ist": null,
      "erfuellung": 0.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Stammdatenpflege",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "stammdaten_system",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Lieferantenkommunikation",
      "bereich": "sozial und kommunikativ",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "lieferanten",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Auswertungen und Tabellenkalkulation",
      "bereich": "digital",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "excel",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": true
     },
     {
      "skill": "Warenwirtschafts- und ERP-System",
      "bereich": "digital",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "warenwirtschaft",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Analytisches Arbeiten",
      "bereich": "methodisch",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "analytik",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Genauigkeit und Sorgfalt",
      "bereich": "methodisch",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "genauigkeit",
      "ist": 2,
      "erfuellung": 50.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Abteilungsuebergreifende Abstimmung",
      "bereich": "methodisch",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "interne_kommunikation",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Deutsch",
      "bereich": "Sprache",
      "soll": 4,
      "gewicht": 3,
      "schluessel": "deutsch",
      "ist": 4,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Englisch",
      "bereich": "Sprache",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "englisch",
      "ist": 1,
      "erfuellung": 0.0,
      "kern": true,
      "ungeprueft": false
     }
    ],
    "skill_match": 73.3,
    "kern_match": 66.7,
    "kern_offen": [
     "Genauigkeit und Sorgfalt",
     "Englisch"
    ],
    "zuschlaege": [
     {
      "id": "F+",
      "punkte": 10,
      "detail": "Pflicht ueber gleichwertige Klausel erfuellt (vergleichbare qualifikation): keiner (BWL-Studium 2018–2020, 3 Semester, ohne Abschluss exmatrikuliert)"
     },
     {
      "id": "Z+",
      "punkte": 5,
      "detail": "Arbeitszeitmodell passt (39 h/Woche (Vollzeit); Gleitzeit mit festen Fenstern Di/Do ()"
     },
     {
      "id": "S-",
      "punkte": -10,
      "detail": "Englisch gefordert (Soll 3), Ist 1"
     },
     {
      "id": "B+",
      "punkte": 5,
      "detail": "Branchenvorkenntnis vorhanden: Einkauf und Handel"
     },
     {
      "id": "O-",
      "punkte": -15,
      "detail": "Standortwechsel erforderlich (Wohnort Hannover-Ricklingen)"
     }
    ],
    "zuschlagssumme": -5,
    "match": 68.3,
    "zone": {
     "id": "gruen_gelb",
     "von": 65,
     "bis": 79.99,
     "label": "Wirtschaftlichkeit pruefen",
     "farbe": "#3d8b40",
     "empfehlung": "Kosten-Nutzen-Rechnung, Amortisation und Vergleich zur externen Neubesetzung vorlegen.",
     "sicht_mitarbeiter": true
    },
    "rahmen": {
     "Position": "Assistenz Einkauf (Assistant Buyer)",
     "Bereich": "Einkauf und Sortimentsmanagement",
     "Berichtet an": "Einkaufsleitung",
     "Standort": "Unternehmenssitz in Nordostdeutschland (fiktiv), Praesenz vor Ort",
     "Vertragsart": "Festanstellung, unbefristet",
     "Beschaeftigungsumfang": "Vollzeit",
     "Arbeitszeit": "Montag bis Freitag im Tagesgeschaeft",
     "Einstieg": "zum naechstmoeglichen Zeitpunkt",
     "Funktionsebene": "Fachkraft ohne Fuehrungsverantwortung",
     "Unternehmen": "mittelstaendisches Handelsunternehmen im Online- und Kataloggeschaeft"
    },
    "formale_anforderungen": [
     "Abgeschlossene kaufmaennische Ausbildung oder vergleichbare Qualifikation",
     "Erste Erfahrung im Einkauf oder in einer vergleichbaren kaufmaennischen Rolle von Vorteil",
     "Sehr gute analytische Faehigkeiten",
     "Sicherer Umgang mit gaengigen Office-Programmen, insbesondere Tabellenkalkulation",
     "Fliessende Deutschkenntnisse, gute Englischkenntnisse"
    ],
    "mit_weiterbildung": true
   },
   "zuwachs": 13.3,
   "zone": {
    "id": "gruen_gelb",
    "von": 65,
    "bis": 79.99,
    "label": "Wirtschaftlichkeit pruefen",
    "farbe": "#3d8b40",
    "empfehlung": "Kosten-Nutzen-Rechnung, Amortisation und Vergleich zur externen Neubesetzung vorlegen.",
    "sicht_mitarbeiter": true
   },
   "sicht_mitarbeiter": true,
   "weiterbildung": {
    "kurse": [
     {
      "id": "EIG-001",
      "anbieter": "Eigene Kombination (kein Anbieterprodukt)",
      "name": "Kombination: Kaufmännische Sachbearbeitung und Office-Basis",
      "zielniveau": "Niveau 2-3 (redaktionelle Einschätzung)",
      "lernformat": "Präsenz oder Live-Online (je Termin)",
      "kontaktstunden": null,
      "kalenderdauer": null,
      "wochenaufwand": "Vollzeit (ganztags)",
      "preisstatus": "Summe der Einzelangebote (kein Gesamtpreis des Anbieters)",
      "netto": null,
      "brutto": null,
      "bezug": "Person / Kurs",
      "eignung_cs": "hoch - niedrigschwelliger Aufbau, Selbstlernen mit Präsenzanteil",
      "ausschluss": "Zeitliche Abstimmung der drei Angebote erforderlich; Lizenzkosten klären",
      "wirkung": {
       "excel": 2,
       "office": 2,
       "bueroorganisation": 3,
       "terminorganisation": 3
      }
     },
     {
      "id": "HAU-007",
      "anbieter": "Haufe Akademie",
      "name": "Professionelle Assistenz für Quer- und Wiedereinsteiger:innen",
      "zielniveau": "Niveau 1-2 (redaktionelle Einschätzung)",
      "lernformat": "Präsenz oder Live-Online (je Termin)",
      "kontaktstunden": "nicht ausgelesen (Kursseite)",
      "kalenderdauer": "nicht ausgelesen (Kursseite)",
      "wochenaufwand": "Vollzeit (ganztags)",
      "preisstatus": "nicht verifiziert - Preisangabe in dieser Recherche nicht ausgelesen",
      "netto": null,
      "brutto": null,
      "bezug": "Person / Kurs",
      "eignung_cs": "hoch - ausdrücklich für Quereinsteigende konzipiert",
      "ausschluss": "Kein Ersatz für Fachqualifizierung (Buchhaltung/Personal)",
      "wirkung": {
       "lieferanten": 2,
       "beratung": 2,
       "telefonie": 2,
       "bueroorganisation": 2
      }
     },
     {
      "id": "CFR-002",
      "anbieter": "Coursera for Business",
      "name": "Einführung in die Datenanalyse mit Excel",
      "zielniveau": "Niveau 3 (redaktionelle Einschätzung)",
      "lernformat": "Selbstlernen (On-Demand), teils Untertitel",
      "kontaktstunden": "Kursdauer laut Kursseite",
      "kalenderdauer": "Selbstlernen, flexibel",
      "wochenaufwand": "berufsbegleitend, flexibel",
      "preisstatus": "im Firmentarif enthalten (nicht öffentlich verifiziert)",
      "netto": null,
      "brutto": null,
      "bezug": "Lizenz / Nutzer / Jahr",
      "eignung_cs": "hoch - Auswertungskompetenz ist in Sachbearbeitung/Prozessunterstützung gefragt",
      "ausschluss": "Setzt Excel-Grundlagen voraus",
      "wirkung": {
       "excel": 3,
       "excel_reporting": 3,
       "office": 3,
       "dokumentation": 2
      }
     }
    ],
    "kosten_belastbar_brutto": null,
    "offene_kosten": [
     "EIG-001: Preis nicht belastbar (Summe der Einzelangebote (kein Gesamtpreis des Anbieters))",
     "HAU-007: Preis nicht belastbar (nicht verifiziert - Preisangabe in dieser Recherche nicht ausgelesen)",
     "CFR-002: Preis nicht belastbar (im Firmentarif enthalten (nicht öffentlich verifiziert))"
    ],
    "betriebliche_einarbeitung": "Einkaufsprozesse, Lieferantenstammdaten und Ordertermine begleitet einarbeiten (4 bis 6 Wochen).",
    "arbeitsprobe": "Eine Lieferantenanfrage vorbereiten, Auftragsbest-igungen pruefen und eine Auswertung in der Tabellenkalkulation erstellen.",
    "restluecken": "Englisch bleibt offen (kein Angebot in der Kursbasis), Warenwirtschaft nur Grundlagen."
   },
   "rahmen": {
    "Position": "Assistenz Einkauf (Assistant Buyer)",
    "Bereich": "Einkauf und Sortimentsmanagement",
    "Berichtet an": "Einkaufsleitung",
    "Standort": "Unternehmenssitz in Nordostdeutschland (fiktiv), Praesenz vor Ort",
    "Vertragsart": "Festanstellung, unbefristet",
    "Beschaeftigungsumfang": "Vollzeit",
    "Arbeitszeit": "Montag bis Freitag im Tagesgeschaeft",
    "Einstieg": "zum naechstmoeglichen Zeitpunkt",
    "Funktionsebene": "Fachkraft ohne Fuehrungsverantwortung",
    "Unternehmen": "mittelstaendisches Handelsunternehmen im Online- und Kataloggeschaeft"
   },
   "kern_offen": [
    "Genauigkeit und Sorgfalt",
    "Englisch"
   ],
   "ungeprueft": [
    "excel"
   ]
  },
  {
   "vakanz_id": "V5",
   "titel": "Sachbearbeitung Abrechnung und Auftragsbearbeitung",
   "datei": "vakanz_05_abrechnung_auftragsbearbeitung.md",
   "vorher": {
    "vakanz_id": "V5",
    "titel": "Sachbearbeitung Abrechnung und Auftragsbearbeitung",
    "datei": "vakanz_05_abrechnung_auftragsbearbeitung.md",
    "skills": [
     {
      "skill": "Abrechnung und Rechnungserstellung",
      "bereich": "fachlich",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "abrechnung",
      "ist": 1,
      "erfuellung": 0.0,
      "kern": true,
      "ungeprueft": true
     },
     {
      "skill": "Auftragsbearbeitung und Auftragsverfolgung",
      "bereich": "fachlich",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "auftragsbearbeitung",
      "ist": null,
      "erfuellung": 0.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Korrespondenz mit Kostentraegern",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "kostentraeger",
      "ist": 1,
      "erfuellung": 50.0,
      "kern": false,
      "ungeprueft": true
     },
     {
      "skill": "Zahlenaffinitaet und Pruefgenauigkeit",
      "bereich": "methodisch",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "zahlen",
      "ist": 2,
      "erfuellung": 50.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Abrechnungs- und Warenwirtschaftssystem",
      "bereich": "digital",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "warenwirtschaft",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Gaengige Office-Programme",
      "bereich": "digital",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "office",
      "ist": 2,
      "erfuellung": 50.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Fristen- und Wiedervorlagemanagement",
      "bereich": "methodisch",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "fristen",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Schriftliche Kommunikation",
      "bereich": "sozial und kommunikativ",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "schriftlich",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Deutsch",
      "bereich": "Sprache",
      "soll": 4,
      "gewicht": 3,
      "schluessel": "deutsch",
      "ist": 4,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     }
    ],
    "skill_match": 56.7,
    "kern_match": 45.5,
    "kern_offen": [
     "Abrechnung und Rechnungserstellung",
     "Auftragsbearbeitung und Auftragsverfolgung",
     "Zahlenaffinitaet und Pruefgenauigkeit",
     "Gaengige Office-Programme"
    ],
    "zuschlaege": [
     {
      "id": "F-",
      "punkte": -20,
      "detail": "Pflichtkriterium verlangt: kaufmaennische berufsausbildung"
     },
     {
      "id": "Z+",
      "punkte": 5,
      "detail": "Arbeitszeitmodell passt (39 h/Woche (Vollzeit); Gleitzeit mit festen Fenstern Di/Do ()"
     },
     {
      "id": "S0",
      "punkte": 0,
      "detail": "keine Sprach- oder Systemanforderung in dieser Vakanz"
     },
     {
      "id": "B+",
      "punkte": 5,
      "detail": "Branchenvorkenntnis vorhanden: Gesundheits- und Hilfsmittelversorgung"
     },
     {
      "id": "O-",
      "punkte": -15,
      "detail": "Standortwechsel erforderlich (Wohnort Hannover-Ricklingen)"
     }
    ],
    "zuschlagssumme": -25,
    "match": 31.7,
    "zone": {
     "id": "rot",
     "von": 0,
     "bis": 49.99,
     "label": "Kein sinnvoller Weg",
     "farbe": "#c0392b",
     "empfehlung": "Option wird nicht weiterverfolgt. Begruendung ausweisen, keine Kostenrechnung.",
     "sicht_mitarbeiter": false
    },
    "rahmen": {
     "Position": "Sachbearbeitung Abrechnung und Auftragsbearbeitung",
     "Bereich": "Abrechnung / Auftragsbearbeitung",
     "Berichtet an": "Bereichsleitung Abrechnung",
     "Standort": "Standort in Sueddeutschland (fiktiv), Praesenz vor Ort",
     "Vertragsart": "Festanstellung, unbefristet",
     "Beschaeftigungsumfang": "Vollzeit",
     "Arbeitszeit": "Montag bis Freitag, geregelte Arbeitszeiten",
     "Einstieg": "zum naechstmoeglichen Zeitpunkt",
     "Funktionsebene": "Fachkraft ohne Fuehrungsverantwortung",
     "Unternehmen": "mittelstaendisches Unternehmen der Gesundheits- und Hilfsmittelversorgung mit Filialnetz"
    },
    "formale_anforderungen": [
     "Erfolgreich abgeschlossene kaufmaennische Berufsausbildung, zum Beispiel im Buromanagement",
     "Idealerweise erste Berufserfahrung im Gesundheitswesen",
     "Gute Kenntnisse in gaengigen Office-Programmen",
     "Ausgepraegte Zahlenaffinitaet und selbstaendige Arbeitsweise",
     "Sehr gute Deutschkenntnisse in Wort und Schrift"
    ],
    "mit_weiterbildung": false
   },
   "nachher": {
    "vakanz_id": "V5",
    "titel": "Sachbearbeitung Abrechnung und Auftragsbearbeitung",
    "datei": "vakanz_05_abrechnung_auftragsbearbeitung.md",
    "skills": [
     {
      "skill": "Abrechnung und Rechnungserstellung",
      "bereich": "fachlich",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "abrechnung",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": true
     },
     {
      "skill": "Auftragsbearbeitung und Auftragsverfolgung",
      "bereich": "fachlich",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "auftragsbearbeitung",
      "ist": null,
      "erfuellung": 0.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Korrespondenz mit Kostentraegern",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "kostentraeger",
      "ist": 1,
      "erfuellung": 50.0,
      "kern": false,
      "ungeprueft": true
     },
     {
      "skill": "Zahlenaffinitaet und Pruefgenauigkeit",
      "bereich": "methodisch",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "zahlen",
      "ist": 2,
      "erfuellung": 50.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Abrechnungs- und Warenwirtschaftssystem",
      "bereich": "digital",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "warenwirtschaft",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Gaengige Office-Programme",
      "bereich": "digital",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "office",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Fristen- und Wiedervorlagemanagement",
      "bereich": "methodisch",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "fristen",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Schriftliche Kommunikation",
      "bereich": "sozial und kommunikativ",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "schriftlich",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Deutsch",
      "bereich": "Sprache",
      "soll": 4,
      "gewicht": 3,
      "schluessel": "deutsch",
      "ist": 4,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     }
    ],
    "skill_match": 76.7,
    "kern_match": 72.7,
    "kern_offen": [
     "Auftragsbearbeitung und Auftragsverfolgung",
     "Zahlenaffinitaet und Pruefgenauigkeit"
    ],
    "zuschlaege": [
     {
      "id": "F-",
      "punkte": -20,
      "detail": "Pflichtkriterium verlangt: kaufmaennische berufsausbildung"
     },
     {
      "id": "Z+",
      "punkte": 5,
      "detail": "Arbeitszeitmodell passt (39 h/Woche (Vollzeit); Gleitzeit mit festen Fenstern Di/Do ()"
     },
     {
      "id": "S0",
      "punkte": 0,
      "detail": "keine Sprach- oder Systemanforderung in dieser Vakanz"
     },
     {
      "id": "B+",
      "punkte": 5,
      "detail": "Branchenvorkenntnis vorhanden: Gesundheits- und Hilfsmittelversorgung"
     },
     {
      "id": "O-",
      "punkte": -15,
      "detail": "Standortwechsel erforderlich (Wohnort Hannover-Ricklingen)"
     }
    ],
    "zuschlagssumme": -25,
    "match": 51.7,
    "zone": {
     "id": "gelb",
     "von": 50,
     "bis": 64.99,
     "label": "Nur mit Ausnahmeentscheidung",
     "farbe": "#e08a00",
     "empfehlung": "Kosten, Zeit und Risiko vollstaendig ausweisen; Entscheidung ausdruecklich als Ausnahme dokumentieren.",
     "sicht_mitarbeiter": false
    },
    "rahmen": {
     "Position": "Sachbearbeitung Abrechnung und Auftragsbearbeitung",
     "Bereich": "Abrechnung / Auftragsbearbeitung",
     "Berichtet an": "Bereichsleitung Abrechnung",
     "Standort": "Standort in Sueddeutschland (fiktiv), Praesenz vor Ort",
     "Vertragsart": "Festanstellung, unbefristet",
     "Beschaeftigungsumfang": "Vollzeit",
     "Arbeitszeit": "Montag bis Freitag, geregelte Arbeitszeiten",
     "Einstieg": "zum naechstmoeglichen Zeitpunkt",
     "Funktionsebene": "Fachkraft ohne Fuehrungsverantwortung",
     "Unternehmen": "mittelstaendisches Unternehmen der Gesundheits- und Hilfsmittelversorgung mit Filialnetz"
    },
    "formale_anforderungen": [
     "Erfolgreich abgeschlossene kaufmaennische Berufsausbildung, zum Beispiel im Buromanagement",
     "Idealerweise erste Berufserfahrung im Gesundheitswesen",
     "Gute Kenntnisse in gaengigen Office-Programmen",
     "Ausgepraegte Zahlenaffinitaet und selbstaendige Arbeitsweise",
     "Sehr gute Deutschkenntnisse in Wort und Schrift"
    ],
    "mit_weiterbildung": true
   },
   "zuwachs": 20.0,
   "zone": {
    "id": "gelb",
    "von": 50,
    "bis": 64.99,
    "label": "Nur mit Ausnahmeentscheidung",
    "farbe": "#e08a00",
    "empfehlung": "Kosten, Zeit und Risiko vollstaendig ausweisen; Entscheidung ausdruecklich als Ausnahme dokumentieren.",
    "sicht_mitarbeiter": false
   },
   "sicht_mitarbeiter": false,
   "weiterbildung": {
    "kurse": [
     {
      "id": "HAU-003",
      "anbieter": "Haufe Akademie",
      "name": "Basiswissen Buchführung und Bilanzierung",
      "zielniveau": "Niveau 2-3: vorbereitende Buchhaltung mit Anleitung bis selbstständig (redaktionelle Einschätzung)",
      "lernformat": "Präsenz oder Live-Online (je Termin)",
      "kontaktstunden": "ca. 24 Unterrichtsstunden (3 Tage, 09:00/09:30-17:00)",
      "kalenderdauer": "3 Tage",
      "wochenaufwand": "Vollzeit (ganztags)",
      "preisstatus": "veröffentlicht (Preis je Termin)",
      "netto": 1990,
      "brutto": 2368.1,
      "bezug": "Person / Kurs",
      "eignung_cs": "bedingt bis hoch - Beleg- und Rechnungsarbeit aus dem Service ist anschlussfähig, die Fachlogik ist neu",
      "ausschluss": "Ohne Softwarepraxis (DATEV) nur begrenzt einsetzbar",
      "wirkung": {
       "buchhaltung": 2,
       "rechnungspruefung": 2,
       "vorbereitende_buchhaltung": 2,
       "abrechnung": 2
      }
     },
     {
      "id": "EIG-002",
      "anbieter": "Eigene Kombination (kein Anbieterprodukt)",
      "name": "Kombination: Vorbereitende Buchhaltung mit Softwarepraxis",
      "zielniveau": "Niveau 3 (redaktionelle Einschätzung)",
      "lernformat": "Präsenz oder Live-Online (je Termin)",
      "kontaktstunden": null,
      "kalenderdauer": null,
      "wochenaufwand": "Vollzeit (ganztags)",
      "preisstatus": "Summe der Einzelangebote (kein Gesamtpreis des Anbieters)",
      "netto": null,
      "brutto": null,
      "bezug": "Person / Kurs",
      "eignung_cs": "bedingt bis hoch - Zahlenarbeit ist übertragbar, Fachlogik ist neu",
      "ausschluss": "Kosten des Lehrgangs unklar; Zeitumfang des Lehrgangs klären",
      "wirkung": {
       "buchhaltung": 3,
       "rechnungspruefung": 3,
       "offene_posten": 3,
       "buchhaltungssoftware": 3,
       "vorbereitende_buchhaltung": 3,
       "abrechnung": 3,
       "warenwirtschaft": 2
      }
     },
     {
      "id": "CFR-002",
      "anbieter": "Coursera for Business",
      "name": "Einführung in die Datenanalyse mit Excel",
      "zielniveau": "Niveau 3 (redaktionelle Einschätzung)",
      "lernformat": "Selbstlernen (On-Demand), teils Untertitel",
      "kontaktstunden": "Kursdauer laut Kursseite",
      "kalenderdauer": "Selbstlernen, flexibel",
      "wochenaufwand": "berufsbegleitend, flexibel",
      "preisstatus": "im Firmentarif enthalten (nicht öffentlich verifiziert)",
      "netto": null,
      "brutto": null,
      "bezug": "Lizenz / Nutzer / Jahr",
      "eignung_cs": "hoch - Auswertungskompetenz ist in Sachbearbeitung/Prozessunterstützung gefragt",
      "ausschluss": "Setzt Excel-Grundlagen voraus",
      "wirkung": {
       "excel": 3,
       "excel_reporting": 3,
       "office": 3,
       "dokumentation": 2
      }
     }
    ],
    "kosten_belastbar_brutto": 2368.1,
    "offene_kosten": [
     "EIG-002: Preis nicht belastbar (Summe der Einzelangebote (kein Gesamtpreis des Anbieters))",
     "CFR-002: Preis nicht belastbar (im Firmentarif enthalten (nicht öffentlich verifiziert))"
    ],
    "betriebliche_einarbeitung": "Abrechnungsregeln und Korrespondenz mit Kostentraegern zwei bis drei Monate begleiten.",
    "arbeitsprobe": "Monatsabrechnung eines kleinen Bestands vorbereiten und drei Rueckfragen von Kostentraegern bearbeiten.",
    "restluecken": "Korrespondenz mit Kostentraegern bleibt bei 0 (Soll 2); Auftragsbearbeitung bleibt bei 2 (Soll 3). Formale Voraussetzung nicht erfuellt."
   },
   "rahmen": {
    "Position": "Sachbearbeitung Abrechnung und Auftragsbearbeitung",
    "Bereich": "Abrechnung / Auftragsbearbeitung",
    "Berichtet an": "Bereichsleitung Abrechnung",
    "Standort": "Standort in Sueddeutschland (fiktiv), Praesenz vor Ort",
    "Vertragsart": "Festanstellung, unbefristet",
    "Beschaeftigungsumfang": "Vollzeit",
    "Arbeitszeit": "Montag bis Freitag, geregelte Arbeitszeiten",
    "Einstieg": "zum naechstmoeglichen Zeitpunkt",
    "Funktionsebene": "Fachkraft ohne Fuehrungsverantwortung",
    "Unternehmen": "mittelstaendisches Unternehmen der Gesundheits- und Hilfsmittelversorgung mit Filialnetz"
   },
   "kern_offen": [
    "Auftragsbearbeitung und Auftragsverfolgung",
    "Zahlenaffinitaet und Pruefgenauigkeit"
   ],
   "ungeprueft": [
    "abrechnung",
    "kostentraeger"
   ]
  },
  {
   "vakanz_id": "V2",
   "titel": "Sachbearbeitung Kreditoren- und Debitorenbuchhaltung",
   "datei": "vakanz_02_kreditoren_debitorenbuchhaltung.md",
   "vorher": {
    "vakanz_id": "V2",
    "titel": "Sachbearbeitung Kreditoren- und Debitorenbuchhaltung",
    "datei": "vakanz_02_kreditoren_debitorenbuchhaltung.md",
    "skills": [
     {
      "skill": "Kreditoren- und Debitorenbuchhaltung",
      "bereich": "fachlich",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "buchhaltung",
      "ist": 1,
      "erfuellung": 0.0,
      "kern": true,
      "ungeprueft": true
     },
     {
      "skill": "Rechnungspruefung und Kontierung",
      "bereich": "fachlich",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "rechnungspruefung",
      "ist": 1,
      "erfuellung": 0.0,
      "kern": true,
      "ungeprueft": true
     },
     {
      "skill": "Offene-Posten-Klaerung",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "offene_posten",
      "ist": 1,
      "erfuellung": 50.0,
      "kern": false,
      "ungeprueft": true
     },
     {
      "skill": "Anlagenbuchfuehrung",
      "bereich": "fachlich",
      "soll": 1,
      "gewicht": 1,
      "schluessel": "anlagen",
      "ist": null,
      "erfuellung": 0.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "ERP-System und Buchhaltungssoftware",
      "bereich": "digital",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "buchhaltungssoftware",
      "ist": 1,
      "erfuellung": 50.0,
      "kern": false,
      "ungeprueft": true
     },
     {
      "skill": "Tabellenkalkulation und Reporting",
      "bereich": "digital",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "excel_reporting",
      "ist": 2,
      "erfuellung": 50.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Zahlenaffinitaet und Genauigkeit",
      "bereich": "methodisch",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "zahlen",
      "ist": 2,
      "erfuellung": 50.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Abstimmung mit internen Schnittstellen",
      "bereich": "methodisch",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "interne_kommunikation",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Deutsch",
      "bereich": "Sprache",
      "soll": 4,
      "gewicht": 3,
      "schluessel": "deutsch",
      "ist": 4,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Englisch",
      "bereich": "Sprache",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "englisch",
      "ist": 1,
      "erfuellung": 50.0,
      "kern": false,
      "ungeprueft": false
     }
    ],
    "skill_match": 46.9,
    "kern_match": 45.5,
    "kern_offen": [
     "Kreditoren- und Debitorenbuchhaltung",
     "Rechnungspruefung und Kontierung",
     "Tabellenkalkulation und Reporting",
     "Zahlenaffinitaet und Genauigkeit"
    ],
    "zuschlaege": [
     {
      "id": "F-",
      "punkte": -20,
      "detail": "Pflichtkriterium verlangt: kaufmaennische ausbildung"
     },
     {
      "id": "Z+",
      "punkte": 5,
      "detail": "Arbeitszeitmodell passt (39 h/Woche (Vollzeit); Gleitzeit mit festen Fenstern Di/Do ()"
     },
     {
      "id": "S-",
      "punkte": -10,
      "detail": "Englisch gefordert (Soll 2), Ist 1"
     },
     {
      "id": "B-",
      "punkte": -5,
      "detail": "Branchenvorkenntnis fehlt: Handel und Buchhaltung"
     },
     {
      "id": "O-",
      "punkte": -15,
      "detail": "Standortwechsel erforderlich (Wohnort Hannover-Ricklingen)"
     }
    ],
    "zuschlagssumme": -45,
    "match": 1.9,
    "zone": {
     "id": "rot",
     "von": 0,
     "bis": 49.99,
     "label": "Kein sinnvoller Weg",
     "farbe": "#c0392b",
     "empfehlung": "Option wird nicht weiterverfolgt. Begruendung ausweisen, keine Kostenrechnung.",
     "sicht_mitarbeiter": false
    },
    "rahmen": {
     "Position": "Sachbearbeitung Kreditoren- und Debitorenbuchhaltung",
     "Bereich": "Finance und Rechnungswesen",
     "Berichtet an": "Leitung Finance",
     "Standort": "Unternehmenssitz in Nordostdeutschland (fiktiv), Praesenz vor Ort",
     "Vertragsart": "Festanstellung, unbefristet",
     "Beschaeftigungsumfang": "Vollzeit oder Teilzeit",
     "Arbeitszeit": "Montag bis Freitag, flexible Arbeitszeitmodelle",
     "Einstieg": "zum naechstmoeglichen Zeitpunkt",
     "Funktionsebene": "Fachkraft ohne Fuehrungsverantwortung",
     "Unternehmen": "mittelstaendisches Handelsunternehmen im Online- und Kataloggeschaeft"
    },
    "formale_anforderungen": [
     "Abgeschlossene kaufmaennische Ausbildung oder wirtschaftswissenschaftliches Studium",
     "Berufserfahrung in der Buchhaltung von Vorteil",
     "Gute Anwendungskenntnisse in Tabellenkalkulation und in ERP-Systemen von Vorteil",
     "Schnelle Auffassungsgabe, Sorgfalt und Verlaesslichkeit",
     "Sehr gute Deutschkenntnisse, gute Englischkenntnisse"
    ],
    "mit_weiterbildung": false
   },
   "nachher": {
    "vakanz_id": "V2",
    "titel": "Sachbearbeitung Kreditoren- und Debitorenbuchhaltung",
    "datei": "vakanz_02_kreditoren_debitorenbuchhaltung.md",
    "skills": [
     {
      "skill": "Kreditoren- und Debitorenbuchhaltung",
      "bereich": "fachlich",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "buchhaltung",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": true
     },
     {
      "skill": "Rechnungspruefung und Kontierung",
      "bereich": "fachlich",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "rechnungspruefung",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": true
     },
     {
      "skill": "Offene-Posten-Klaerung",
      "bereich": "fachlich",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "offene_posten",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": true
     },
     {
      "skill": "Anlagenbuchfuehrung",
      "bereich": "fachlich",
      "soll": 1,
      "gewicht": 1,
      "schluessel": "anlagen",
      "ist": null,
      "erfuellung": 0.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "ERP-System und Buchhaltungssoftware",
      "bereich": "digital",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "buchhaltungssoftware",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": true
     },
     {
      "skill": "Tabellenkalkulation und Reporting",
      "bereich": "digital",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "excel_reporting",
      "ist": 3,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Zahlenaffinitaet und Genauigkeit",
      "bereich": "methodisch",
      "soll": 3,
      "gewicht": 2,
      "schluessel": "zahlen",
      "ist": 2,
      "erfuellung": 50.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Abstimmung mit internen Schnittstellen",
      "bereich": "methodisch",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "interne_kommunikation",
      "ist": 2,
      "erfuellung": 100.0,
      "kern": false,
      "ungeprueft": false
     },
     {
      "skill": "Deutsch",
      "bereich": "Sprache",
      "soll": 4,
      "gewicht": 3,
      "schluessel": "deutsch",
      "ist": 4,
      "erfuellung": 100.0,
      "kern": true,
      "ungeprueft": false
     },
     {
      "skill": "Englisch",
      "bereich": "Sprache",
      "soll": 2,
      "gewicht": 1,
      "schluessel": "englisch",
      "ist": 1,
      "erfuellung": 50.0,
      "kern": false,
      "ungeprueft": false
     }
    ],
    "skill_match": 84.4,
    "kern_match": 90.9,
    "kern_offen": [
     "Zahlenaffinitaet und Genauigkeit"
    ],
    "zuschlaege": [
     {
      "id": "F-",
      "punkte": -20,
      "detail": "Pflichtkriterium verlangt: kaufmaennische ausbildung"
     },
     {
      "id": "Z+",
      "punkte": 5,
      "detail": "Arbeitszeitmodell passt (39 h/Woche (Vollzeit); Gleitzeit mit festen Fenstern Di/Do ()"
     },
     {
      "id": "S-",
      "punkte": -10,
      "detail": "Englisch gefordert (Soll 2), Ist 1"
     },
     {
      "id": "B-",
      "punkte": -5,
      "detail": "Branchenvorkenntnis fehlt: Handel und Buchhaltung"
     },
     {
      "id": "O-",
      "punkte": -15,
      "detail": "Standortwechsel erforderlich (Wohnort Hannover-Ricklingen)"
     }
    ],
    "zuschlagssumme": -45,
    "match": 39.4,
    "zone": {
     "id": "rot",
     "von": 0,
     "bis": 49.99,
     "label": "Kein sinnvoller Weg",
     "farbe": "#c0392b",
     "empfehlung": "Option wird nicht weiterverfolgt. Begruendung ausweisen, keine Kostenrechnung.",
     "sicht_mitarbeiter": false
    },
    "rahmen": {
     "Position": "Sachbearbeitung Kreditoren- und Debitorenbuchhaltung",
     "Bereich": "Finance und Rechnungswesen",
     "Berichtet an": "Leitung Finance",
     "Standort": "Unternehmenssitz in Nordostdeutschland (fiktiv), Praesenz vor Ort",
     "Vertragsart": "Festanstellung, unbefristet",
     "Beschaeftigungsumfang": "Vollzeit oder Teilzeit",
     "Arbeitszeit": "Montag bis Freitag, flexible Arbeitszeitmodelle",
     "Einstieg": "zum naechstmoeglichen Zeitpunkt",
     "Funktionsebene": "Fachkraft ohne Fuehrungsverantwortung",
     "Unternehmen": "mittelstaendisches Handelsunternehmen im Online- und Kataloggeschaeft"
    },
    "formale_anforderungen": [
     "Abgeschlossene kaufmaennische Ausbildung oder wirtschaftswissenschaftliches Studium",
     "Berufserfahrung in der Buchhaltung von Vorteil",
     "Gute Anwendungskenntnisse in Tabellenkalkulation und in ERP-Systemen von Vorteil",
     "Schnelle Auffassungsgabe, Sorgfalt und Verlaesslichkeit",
     "Sehr gute Deutschkenntnisse, gute Englischkenntnisse"
    ],
    "mit_weiterbildung": true
   },
   "zuwachs": 37.5,
   "zone": {
    "id": "rot",
    "von": 0,
    "bis": 49.99,
    "label": "Kein sinnvoller Weg",
    "farbe": "#c0392b",
    "empfehlung": "Option wird nicht weiterverfolgt. Begruendung ausweisen, keine Kostenrechnung.",
    "sicht_mitarbeiter": false
   },
   "sicht_mitarbeiter": false,
   "weiterbildung": {
    "kurse": [
     {
      "id": "HAU-003",
      "anbieter": "Haufe Akademie",
      "name": "Basiswissen Buchführung und Bilanzierung",
      "zielniveau": "Niveau 2-3: vorbereitende Buchhaltung mit Anleitung bis selbstständig (redaktionelle Einschätzung)",
      "lernformat": "Präsenz oder Live-Online (je Termin)",
      "kontaktstunden": "ca. 24 Unterrichtsstunden (3 Tage, 09:00/09:30-17:00)",
      "kalenderdauer": "3 Tage",
      "wochenaufwand": "Vollzeit (ganztags)",
      "preisstatus": "veröffentlicht (Preis je Termin)",
      "netto": 1990,
      "brutto": 2368.1,
      "bezug": "Person / Kurs",
      "eignung_cs": "bedingt bis hoch - Beleg- und Rechnungsarbeit aus dem Service ist anschlussfähig, die Fachlogik ist neu",
      "ausschluss": "Ohne Softwarepraxis (DATEV) nur begrenzt einsetzbar",
      "wirkung": {
       "buchhaltung": 2,
       "rechnungspruefung": 2,
       "vorbereitende_buchhaltung": 2,
       "abrechnung": 2
      }
     },
     {
      "id": "EIG-002",
      "anbieter": "Eigene Kombination (kein Anbieterprodukt)",
      "name": "Kombination: Vorbereitende Buchhaltung mit Softwarepraxis",
      "zielniveau": "Niveau 3 (redaktionelle Einschätzung)",
      "lernformat": "Präsenz oder Live-Online (je Termin)",
      "kontaktstunden": null,
      "kalenderdauer": null,
      "wochenaufwand": "Vollzeit (ganztags)",
      "preisstatus": "Summe der Einzelangebote (kein Gesamtpreis des Anbieters)",
      "netto": null,
      "brutto": null,
      "bezug": "Person / Kurs",
      "eignung_cs": "bedingt bis hoch - Zahlenarbeit ist übertragbar, Fachlogik ist neu",
      "ausschluss": "Kosten des Lehrgangs unklar; Zeitumfang des Lehrgangs klären",
      "wirkung": {
       "buchhaltung": 3,
       "rechnungspruefung": 3,
       "offene_posten": 3,
       "buchhaltungssoftware": 3,
       "vorbereitende_buchhaltung": 3,
       "abrechnung": 3,
       "warenwirtschaft": 2
      }
     },
     {
      "id": "CFR-002",
      "anbieter": "Coursera for Business",
      "name": "Einführung in die Datenanalyse mit Excel",
      "zielniveau": "Niveau 3 (redaktionelle Einschätzung)",
      "lernformat": "Selbstlernen (On-Demand), teils Untertitel",
      "kontaktstunden": "Kursdauer laut Kursseite",
      "kalenderdauer": "Selbstlernen, flexibel",
      "wochenaufwand": "berufsbegleitend, flexibel",
      "preisstatus": "im Firmentarif enthalten (nicht öffentlich verifiziert)",
      "netto": null,
      "brutto": null,
      "bezug": "Lizenz / Nutzer / Jahr",
      "eignung_cs": "hoch - Auswertungskompetenz ist in Sachbearbeitung/Prozessunterstützung gefragt",
      "ausschluss": "Setzt Excel-Grundlagen voraus",
      "wirkung": {
       "excel": 3,
       "excel_reporting": 3,
       "office": 3,
       "dokumentation": 2
      }
     }
    ],
    "kosten_belastbar_brutto": 2368.1,
    "offene_kosten": [
     "EIG-002: Preis nicht belastbar (Summe der Einzelangebote (kein Gesamtpreis des Anbieters))",
     "CFR-002: Preis nicht belastbar (im Firmentarif enthalten (nicht öffentlich verifiziert))"
    ],
    "betriebliche_einarbeitung": "Buchungskreis und Kontenrahmen begleitet uebernehmen, vier Wochen mit Vier-Augen-Prinzip.",
    "arbeitsprobe": "Zehn Eingangsrechnungen pruefen, kontieren und buchen sowie drei offene Posten klaeren.",
    "restluecken": "Anlagenbuchfuehrung bleibt offen (Soll 1), Englisch bleibt offen. Formale Voraussetzung (kaufmaennische Ausbildung/Studium) nicht erfuellt."
   },
   "rahmen": {
    "Position": "Sachbearbeitung Kreditoren- und Debitorenbuchhaltung",
    "Bereich": "Finance und Rechnungswesen",
    "Berichtet an": "Leitung Finance",
    "Standort": "Unternehmenssitz in Nordostdeutschland (fiktiv), Praesenz vor Ort",
    "Vertragsart": "Festanstellung, unbefristet",
    "Beschaeftigungsumfang": "Vollzeit oder Teilzeit",
    "Arbeitszeit": "Montag bis Freitag, flexible Arbeitszeitmodelle",
    "Einstieg": "zum naechstmoeglichen Zeitpunkt",
    "Funktionsebene": "Fachkraft ohne Fuehrungsverantwortung",
    "Unternehmen": "mittelstaendisches Handelsunternehmen im Online- und Kataloggeschaeft"
   },
   "kern_offen": [
    "Zahlenaffinitaet und Genauigkeit"
   ],
   "ungeprueft": [
    "buchhaltung",
    "buchhaltungssoftware",
    "offene_posten",
    "rechnungspruefung"
   ]
  }
 ],
 "schritte": [
  {
   "nr": 1,
   "titel": "Person laden",
   "text": "Mirko Baumgart (04_Mirko_Baumgart.md)",
   "status": "ok"
  },
  {
   "nr": 2,
   "titel": "Parameter laden",
   "text": "Prompt, Betriebsrat BR-2026-10-15, Schwellen, Formel, Weiterbildung",
   "status": "ok"
  },
  {
   "nr": 3,
   "titel": "Modell setzen",
   "text": "Lokales Modell 14B (Ollama) (lokal, aktiv)",
   "status": "ok"
  },
  {
   "nr": 4,
   "titel": "Ist-Profil pruefen",
   "text": "36 Skills hinterlegt",
   "status": "ok"
  },
  {
   "nr": 5,
   "titel": "No-Liste des Betriebsrats anwenden",
   "text": "3 Felder gesperrt, 12 Regeln geprueft",
   "status": "ok"
  },
  {
   "nr": 6,
   "titel": "Zielvakanzen lesen",
   "text": "6 Vakanzen mit 56 Soll-Skills",
   "status": "ok"
  },
  {
   "nr": 7,
   "titel": "Vakanz V1 bewerten",
   "text": "Assistenz Einkauf (Assistant Buyer): 55.0 % vorher, 68.3 % nachher (Wirtschaftlichkeit pruefen)",
   "status": "ok"
  },
  {
   "nr": 8,
   "titel": "Vakanz V2 bewerten",
   "text": "Sachbearbeitung Kreditoren- und Debitorenbuchhaltung: 1.9 % vorher, 39.4 % nachher (Kein sinnvoller Weg)",
   "status": "ok"
  },
  {
   "nr": 9,
   "titel": "Vakanz V3 bewerten",
   "text": "Office-Management mit anteiliger Unterstuetzung in Buchhaltung: 42.9 % vorher, 75.3 % nachher (Wirtschaftlichkeit pruefen)",
   "status": "ok"
  },
  {
   "nr": 10,
   "titel": "Vakanz V4 bewerten",
   "text": "Sachbearbeitung Auftragsabwicklung und Abrechnung: 78.3 % vorher, 95.0 % nachher (Ziel erreicht - Mitarbeiter ist schon da)",
   "status": "ok"
  },
  {
   "nr": 11,
   "titel": "Vakanz V5 bewerten",
   "text": "Sachbearbeitung Abrechnung und Auftragsbearbeitung: 31.7 % vorher, 51.7 % nachher (Nur mit Ausnahmeentscheidung)",
   "status": "ok"
  },
  {
   "nr": 12,
   "titel": "Vakanz V6 bewerten",
   "text": "Kundenberatung und Versorgung im Fachhandel (Quereinstieg moeglich): 89.6 % vorher, 89.6 % nachher (Ziel erreicht - Mitarbeiter ist schon da)",
   "status": "ok"
  },
  {
   "nr": 13,
   "titel": "Rangliste bilden",
   "text": "Bestes Ergebnis: Sachbearbeitung Auftragsabwicklung und Abrechnung mit 95.0 %",
   "status": "ok"
  },
  {
   "nr": 14,
   "titel": "Sichten erzeugen",
   "text": "Management, HR, Betriebsrat, Mitarbeiter",
   "status": "ok"
  }
 ],
 "manifest": {
  "lauf_id": "LAUF-20261015-163635",
  "zeitpunkt": "15.10.2026 16:36:35",
  "modell": "lokal-ollama-14b",
  "datenstand": "15.10.2026",
  "parameter": {
   "prompt": "00_prompt.md",
   "betriebsrat": "BR-2026-10-15",
   "schwellen": "MGMT-2026-10-15",
   "formel": "FRM-2026-10-15",
   "ausgabe": "OUT-2026-10-15",
   "modelle": "MOD-2026-10-15",
   "ist": "IST-2026-10-15",
   "weiterbildung": "WB-2026-10-15"
  },
  "freigabe": {
   "status": "Entwurf",
   "freigegeben_von": null,
   "freigegeben_am": null
  }
 }
};
