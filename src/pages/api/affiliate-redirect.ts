import type { APIRoute } from 'astro';
import { getDb } from '../../lib/db';

export const prerender = false;

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

export const GET: APIRoute = async (context) => {
  const url = new URL(context.request.url);
  const ziel = url.searchParams.get('ziel');
  const produkt = url.searchParams.get('produkt') ?? '';
  const von = url.searchParams.get('von') ?? '';

  if (!ziel) {
    return new Response('Missing ziel parameter', { status: 400 });
  }

  // Validate target URL
  let target: URL;
  try {
    target = new URL(ziel);
  } catch {
    return new Response('Invalid ziel URL', { status: 400 });
  }
  if (!ALLOWED_PROTOCOLS.has(target.protocol)) {
    return new Response('Forbidden protocol', { status: 400 });
  }

  // Fire-and-forget D1 logging (do not block redirect)
  try {
    const db = getDb();
    const land = (context.request.headers.get('CF-IPCountry') ?? '').slice(0, 2).toUpperCase() || null;
    const ua = (context.request.headers.get('User-Agent') ?? '').slice(0, 255);
    const insert = db.prepare(
      `INSERT INTO affiliate_klicks (link_slug, ziel_url, produkt_name, quelle_seite, land, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(produkt || 'unknown', target.toString(), produkt || null, von || null, land, ua).run();
    context.locals.cfContext?.waitUntil(insert);
  } catch (err) {
    // swallow — never block redirect on logging failure
    console.warn('affiliate_klicks logging failed', err);
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: target.toString(),
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
};
