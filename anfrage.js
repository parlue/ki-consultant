/* Anfrageformular -> n8n-Webhook. WEBHOOK_URL nach dem Einrichten von n8n eintragen. */
const WEBHOOK_URL = 'https://dsommerfeld.app.n8n.cloud/webhook/anfrage';
const MAP = {sparring:'KI-Sparringstag',zirkel:'KI-Zirkel',mentoring:'KI-Mentoring',workshop:'KI-Team-Workshop',pilot:'KI-Pilot'};
const $ = s => document.querySelector(s);
const form = $('#reqform'), err = $('#err'), send = $('#send');
const params = new URLSearchParams(location.search);
const pre = MAP[params.get('paket')];
if (pre) $('#paket').value = pre;
const loaded = Date.now();

function showError(msg){ err.textContent = msg; err.hidden = false; }
function showProcess(){
  $('#formview').hidden = true; $('#processview').hidden = false;
  window.scrollTo({top:0,behavior:'smooth'});
  const steps = [...document.querySelectorAll('.step')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  steps.forEach((s,i)=>setTimeout(()=>s.classList.add('on'), reduce ? 0 : 500 + i*900));
}

form.addEventListener('submit', async e => {
  e.preventDefault(); err.hidden = true;
  const d = Object.fromEntries(new FormData(form).entries());
  if (d.website) return;                                   // Honeypot
  if (!d.name.trim() || !d.firma.trim() || !d.anliegen.trim()) return showError('Bitte füllen Sie Name, Unternehmen und Anliegen aus.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) return showError('Bitte geben Sie eine gültige E-Mail-Adresse an.');
  if (!$('#consent').checked) return showError('Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.');
  const test = params.has('test');
  if (!WEBHOOK_URL && !test) return showError('Das Formular ist gerade nicht erreichbar. Bitte schreiben Sie mir an dirk@sommerfeld.consulting.');
  send.disabled = true; send.textContent = 'Wird gesendet …';
  try {
    if (!test) {
      const r = await fetch(WEBHOOK_URL, {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({paket:d.paket, name:d.name.trim(), firma:d.firma.trim(), email:d.email.trim(),
          telefon:(d.telefon||'').trim(), anliegen:d.anliegen.trim(), termin:(d.termin||'').trim(),
          consent:true, dauer_ms:Date.now()-loaded, seite:location.pathname})});
      if (!r.ok) throw new Error('HTTP '+r.status);
    }
    showProcess();
  } catch(x) {
    showError('Das Senden hat nicht geklappt. Bitte versuchen Sie es erneut oder schreiben Sie mir an dirk@sommerfeld.consulting.');
    send.disabled = false; send.textContent = 'Anfrage senden ↗';
  }
});
