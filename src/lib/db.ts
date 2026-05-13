// D1 client helper for Astro v6 + @astrojs/cloudflare v13.
// `Astro.locals.runtime.env` was removed; use the `cloudflare:workers` env import.

import { env } from 'cloudflare:workers';

export function getDb(): D1Database {
  if (!env.DB) {
    throw new Error('D1 binding DB not available. Check wrangler.toml [[d1_databases]] and Pages dashboard binding.');
  }
  return env.DB;
}

export function getEnv(): Cloudflare.Env {
  return env;
}

// Generate a short random token for DOI confirmation
export function generateToken(length = 32): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  for (const n of arr) out += chars[n % chars.length];
  return out;
}
