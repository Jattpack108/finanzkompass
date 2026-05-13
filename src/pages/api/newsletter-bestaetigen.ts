import type { APIRoute } from 'astro';
import { getDb } from '../../lib/db';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const url = new URL(context.request.url);
  const token = url.searchParams.get('token');
  const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://finanzkompass.de';

  if (!token) {
    return Response.redirect(`${siteUrl}/newsletter-bestaetigt?status=err`, 302);
  }

  const db = getDb();
  try {
    const result = await db
      .prepare(
        `UPDATE abonnenten
         SET status = 'aktiv', bestaetigt_am = CURRENT_TIMESTAMP, token = NULL
         WHERE token = ? AND status = 'ausstehend'`
      )
      .bind(token)
      .run();
    const changes = (result.meta?.changes ?? 0) as number;
    if (changes === 0) {
      return Response.redirect(`${siteUrl}/newsletter-bestaetigt?status=err`, 302);
    }
    return Response.redirect(`${siteUrl}/newsletter-bestaetigt?status=ok`, 302);
  } catch (err) {
    console.error('newsletter confirm failed', err);
    return Response.redirect(`${siteUrl}/newsletter-bestaetigt?status=err`, 302);
  }
};
