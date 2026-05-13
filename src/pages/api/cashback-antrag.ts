import type { APIRoute } from 'astro';
import { getDb, getEnv } from '../../lib/db';
import { sendEmail } from '../../lib/email';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ALLOWED_PRODUKTE = new Set([
  'Trade Republic', 'Scalable Capital', 'BetterHelp', 'WISO Steuer',
]);

export const POST: APIRoute = async (context) => {
  const env = getEnv();
  const db = getDb();
  const form = await context.request.formData();

  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const produkt = String(form.get('produkt_name') ?? '').trim();
  const bestaetigung = String(form.get('bestaetigungs_id') ?? '').trim();
  const paypal = String(form.get('paypal_email') ?? '').trim().toLowerCase();
  const datenschutz = form.get('datenschutz_ok') === 'on';

  if (!datenschutz) return json({ ok: false, error: 'Datenschutzhinweis muss bestätigt werden.' }, 400);
  if (!email || !EMAIL_RE.test(email)) return json({ ok: false, error: 'Ungültige E-Mail.' }, 400);
  if (!produkt || !ALLOWED_PRODUKTE.has(produkt)) return json({ ok: false, error: 'Bitte ein Produkt auswählen.' }, 400);
  if (!bestaetigung || bestaetigung.length < 4) return json({ ok: false, error: 'Bestätigungs-ID fehlt.' }, 400);
  if (paypal && !EMAIL_RE.test(paypal)) return json({ ok: false, error: 'PayPal-Adresse ungültig.' }, 400);

  try {
    await db.prepare(
      `INSERT INTO cashback_antraege (email, produkt_name, affiliate_programm, bestaetigungs_id, paypal_email, status)
       VALUES (?, ?, ?, ?, ?, 'pruefung')`
    ).bind(email, produkt, produkt, bestaetigung, paypal || null).run();
  } catch (err) {
    console.error('cashback insert failed', err);
    return json({ ok: false, error: 'Speichern fehlgeschlagen.' }, 500);
  }

  // Notify redaktion (best-effort)
  const adminHtml = `<p>Neuer Cashback-Antrag:</p>
<ul>
<li>E-Mail: ${escapeHtml(email)}</li>
<li>Produkt: ${escapeHtml(produkt)}</li>
<li>Bestätigung: ${escapeHtml(bestaetigung)}</li>
<li>PayPal: ${escapeHtml(paypal || '–')}</li>
</ul>`;
  const adminText = `Neuer Cashback-Antrag\n\nE-Mail: ${email}\nProdukt: ${produkt}\nBestätigung: ${bestaetigung}\nPayPal: ${paypal || '–'}`;

  await sendEmail({
    to: env.CASHBACK_RECIPIENT_EMAIL,
    subject: `Cashback-Antrag · ${produkt}`,
    html: adminHtml,
    text: adminText,
    from: `${env.NEWSLETTER_FROM_NAME} <${env.NEWSLETTER_FROM_EMAIL}>`,
    apiKey: env.RESEND_API_KEY,
  });

  // Confirmation to user
  const userHtml = `<p>Hallo,</p>
<p>wir haben deinen Cashback-Antrag für <strong>${escapeHtml(produkt)}</strong> erhalten und prüfen ihn.</p>
<p>Sobald der Anbieter uns die Provision freigibt (typischerweise nach 30 Tagen Stornofrist), zahlen wir innerhalb von 5 Werktagen aus.</p>
<p>Die Finanzkompass-Redaktion</p>`;
  const userText = `Hallo,\n\nwir haben deinen Cashback-Antrag für ${produkt} erhalten und prüfen ihn.\n\nSobald der Anbieter die Provision freigibt (typischerweise nach 30 Tagen), zahlen wir innerhalb von 5 Werktagen aus.\n\nDie Finanzkompass-Redaktion`;

  await sendEmail({
    to: email,
    subject: 'Cashback-Antrag bestätigt',
    html: userHtml,
    text: userText,
    from: `${env.NEWSLETTER_FROM_NAME} <${env.NEWSLETTER_FROM_EMAIL}>`,
    apiKey: env.RESEND_API_KEY,
  });

  return json({ ok: true });
};

function json(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
