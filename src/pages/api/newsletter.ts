import type { APIRoute } from 'astro';
import { getDb, getEnv, generateToken } from '../../lib/db';
import { sendEmail, doiConfirmationEmail } from '../../lib/email';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const POST: APIRoute = async (context) => {
  const env = getEnv();
  const db = getDb();
  const form = await context.request.formData();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const quelle = String(form.get('quelle') ?? '').slice(0, 255);

  if (!email || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'Bitte eine gültige E-Mail-Adresse angeben.' }, 400);
  }

  // Insert or update with new token
  const token = generateToken(32);
  try {
    await db.prepare(
      `INSERT INTO abonnenten (email, status, token, quelle)
       VALUES (?, 'ausstehend', ?, ?)
       ON CONFLICT(email) DO UPDATE SET token = excluded.token, status = 'ausstehend', quelle = excluded.quelle`
    ).bind(email, token, quelle).run();
  } catch (err) {
    console.error('newsletter insert failed', err);
    return json({ ok: false, error: 'Anmeldung fehlgeschlagen.' }, 500);
  }

  const siteUrl = env.PUBLIC_SITE_URL || 'https://finanzkompass.de';
  const bestaetigungsUrl = `${siteUrl}/api/newsletter-bestaetigen?token=${encodeURIComponent(token)}`;

  const { html, text } = doiConfirmationEmail({
    bestaetigungsUrl,
    siteName: 'Finanzkompass',
  });

  const sent = await sendEmail({
    to: email,
    subject: 'Bitte bestätige deine Newsletter-Anmeldung',
    html,
    text,
    from: `${env.NEWSLETTER_FROM_NAME} <${env.NEWSLETTER_FROM_EMAIL}>`,
    apiKey: env.RESEND_API_KEY,
  });

  if (!sent.ok) {
    console.error('newsletter email failed', sent.error);
    return json({ ok: false, error: 'Bestätigungs-E-Mail konnte nicht gesendet werden.' }, 500);
  }

  return json({ ok: true });
};

function json(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
