window.SERVICE_DATA = {
  "cases": [
    {"id":"login","label":"01 · Standardfall","message":"Guten Tag, ich kann mich seit heute nicht mehr im Kundenportal anmelden. Nach mehreren falschen Passwörtern erscheint die Meldung Konto gesperrt. Was kann ich tun?","reference":"K-1042"},
    {"id":"invoice","label":"02 · Rückfrage nötig","message":"Auf meiner Rechnung steht ein anderer Betrag als erwartet. Können Sie das bitte klären?","reference":""},
    {"id":"unknown","label":"03 · Wissenslücke","message":"Unsere Warenwirtschaft meldet beim Datenexport den Fehler E-784. Wie behebe ich das?","reference":"K-2081"},
    {"id":"complaint","label":"04 · Kritischer Fall","message":"Ich möchte mich beschweren: Ihre Anlage hat einen Schaden verursacht. Ich fordere Schadenersatz und eine sofortige Entscheidung.","reference":"K-3050"}
  ],
  "team": [
    {"id":"lea","name":"Lea Berger","initials":"LB","skill":"Portal","role":"Portal & Zugang","status":"available","capacity":2},
    {"id":"samir","name":"Samir Weber","initials":"SW","skill":"Abrechnung","role":"Rechnung & Auftrag","status":"available","capacity":1},
    {"id":"mira","name":"Mira König","initials":"MK","skill":"Technik","role":"Technischer Support","status":"busy","capacity":0},
    {"id":"jan","name":"Jan Neumann","initials":"JN","skill":"Serviceleitung","role":"Beschwerden & Eskalation","status":"available","capacity":1}
  ],
  "knowledge": [
    {"id":"FAQ-001","title":"Gesperrter Portalzugang","version":"1.2","approved":"2026-10-01","validUntil":"2027-03-31","category":"Portal","content":"Nach fünf fehlgeschlagenen Anmeldeversuchen bleibt der Portalzugang für 15 Minuten gesperrt. Danach kann über die Funktion Passwort vergessen ein neues Passwort angefordert werden. Bleibt die Sperre bestehen, übernimmt der Portal-Support. Passwörter dürfen niemals per E-Mail angefordert werden.","draft":"Guten Tag, laut unserer Hilfe zum Portalzugang wird der Zugang nach fünf fehlgeschlagenen Anmeldeversuchen für 15 Minuten gesperrt. Bitte warten Sie diese Zeit ab und nutzen Sie anschließend die Funktion „Passwort vergessen“. Sollte der Zugang danach weiterhin gesperrt sein, unterstützen wir Sie bei der weiteren Prüfung. Bitte senden Sie uns kein Passwort."},
    {"id":"FAQ-002","title":"Abweichender Rechnungsbetrag","version":"2.0","approved":"2026-09-15","validUntil":"2027-03-31","category":"Abrechnung","content":"Für die Prüfung einer Rechnungsabweichung sind Kundennummer und Rechnungsnummer erforderlich. Das Abrechnungsteam gleicht Rechnung und Auftrag ab. Eine Erstattung oder Korrektur darf erst nach fachlicher Prüfung zugesagt werden.","draft":"Guten Tag, gerne prüfen wir die Abweichung. Bitte nennen Sie uns Ihre Kundennummer und die betreffende Rechnungsnummer. Unser Abrechnungsteam gleicht die Rechnung mit dem Auftrag ab und meldet sich mit dem Ergebnis. Eine Korrektur können wir vor der Prüfung noch nicht zusagen."},
    {"id":"REG-003","title":"Schadensfall und Beschwerde","version":"1.1","approved":"2026-10-10","validUntil":"2027-03-31","category":"Serviceleitung","content":"Beschwerden mit behauptetem Schaden werden unverzüglich an die Serviceleitung übergeben. Servicemitarbeiter geben keine Zusage zu Haftung oder Schadenersatz. Die Serviceleitung legt die weitere Kommunikation und Bearbeitung fest."}
  ],
  "flow": [
    {"title":"Eingang erfassen","owner":"SYSTEM","text":"Anfrage und Kanal erfassen. Daten minimieren, Ticket-ID vergeben.","next":"→ 02"},
    {"title":"Anliegen qualifizieren","owner":"KI + REGELN","text":"Thema, Dringlichkeit und fehlende Angaben vorschlagen. Kritische Themen markieren.","next":"→ 03"},
    {"title":"Einordnung bestätigen","owner":"MENSCH · GATE 1","kind":"human","text":"Einordnung prüfen oder ändern. Bei fehlenden Angaben Rückfrage prüfen; kritische Fälle direkt routen.","next":"Vollständig → 04 · unklar → Rückfrage / 01"},
    {"title":"Wissen recherchieren","owner":"SYSTEM / RAG","text":"Passende, gültige und freigegebene FAQ- und Dokumentabschnitte suchen.","next":"Beleg vorhanden → 05 · keiner / Konflikt → 06"},
    {"title":"Entwurf & Freigabe","owner":"KI → MENSCH · GATE 2","kind":"human","text":"KI erstellt belegten Entwurf. Mensch prüft Inhalt und Quelle, ändert und gibt Antwort oder Rückfrage frei.","next":"Freigegeben → 07 · Problem bleibt → 06"},
    {"title":"Fachteam oder Warteschlange","owner":"MENSCH + ROUTING","kind":"stop","text":"Passende verfügbare Fachkraft vorschlagen. Mensch bestätigt. Niemand verfügbar? Queue, Frist und Serviceleitung.","next":"Fachkraft klärt → 05 · neue Infos → 04"},
    {"title":"Antwort & Abschluss","owner":"MENSCH / SYSTEM","kind":"human","text":"Freigegebene Antwort dokumentieren und versenden. Lösung bestätigen; bei erneutem Problem wieder öffnen.","next":"Gelöst → 08 · ungelöst → 06"},
    {"title":"Bewerten & verbessern","owner":"KUNDE → SERVICELEITUNG","text":"Kundenfeedback erheben. Schwächen prüfen; Wissen und Prozess versioniert testen und freigeben.","next":"↺ geprüfte Verbesserung → 02 / 04"}
  ]
};
