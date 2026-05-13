// Resend wrapper for transactional emails.

interface SendOpts {
  to: string;
  subject: string;
  html: string;
  text: string;
  from: string;
  apiKey: string;
}

export async function sendEmail(opts: SendOpts): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${opts.apiKey}`,
      },
      body: JSON.stringify({
        from: opts.from,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `Resend ${res.status}: ${body}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export function doiConfirmationEmail(opts: {
  bestaetigungsUrl: string;
  siteName: string;
}): { html: string; text: string } {
  const { bestaetigungsUrl, siteName } = opts;
  const text = `Hallo,

vielen Dank für dein Interesse am ${siteName}-Newsletter.

Bitte bestätige deine E-Mail-Adresse mit einem Klick auf folgenden Link:
${bestaetigungsUrl}

Wenn du den Newsletter nicht abonniert hast, ignoriere diese E-Mail einfach.

Die ${siteName}-Redaktion`;

  const html = `<!doctype html>
<html lang="de"><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#1C1917;max-width:560px;margin:32px auto;padding:0 16px;line-height:1.6">
<h2 style="font-family:Georgia,serif;font-weight:500;font-size:24px;margin:0 0 16px">Bestätige deine E-Mail-Adresse</h2>
<p>vielen Dank für dein Interesse am ${siteName}-Newsletter.</p>
<p>Bitte bestätige deine E-Mail-Adresse:</p>
<p><a href="${bestaetigungsUrl}" style="display:inline-block;background:#1C1917;color:#FAFAF9;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:500">Anmeldung bestätigen</a></p>
<p style="font-size:13px;color:#57534E">Oder kopiere diesen Link in deinen Browser:<br><a href="${bestaetigungsUrl}" style="color:#1E40AF">${bestaetigungsUrl}</a></p>
<hr style="border:0;border-top:1px solid #E7E5E4;margin:24px 0">
<p style="font-size:12px;color:#A8A29E">Wenn du den Newsletter nicht abonniert hast, ignoriere diese E-Mail einfach.<br>Die ${siteName}-Redaktion</p>
</body></html>`;

  return { html, text };
}
