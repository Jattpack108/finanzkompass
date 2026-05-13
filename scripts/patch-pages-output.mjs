/**
 * Post-build script: converts @astrojs/cloudflare adapter output into the
 * Cloudflare Pages "Advanced Mode" (_worker.js) format that `wrangler pages deploy`
 * accepts via CLI.
 *
 * Why this is needed
 * ------------------
 * @astrojs/cloudflare v13 emits:
 *   dist/client/   — static assets
 *   dist/server/   — unbundled Worker (entry.mjs + chunks + wrangler.json)
 *
 * The generated dist/server/wrangler.json contains:
 *   • assets.binding = "ASSETS"  → reserved name in Pages  (error)
 *   • main + pages_build_output_dir  → mutually exclusive   (error)
 *   • account_id / rules / images / previews  → unsupported in Pages CLI (error)
 *
 * This output is designed for the Cloudflare Pages *GitHub integration*, which has
 * first-class Astro adapter support and handles these fields internally.
 * For CLI deploys we need the _worker.js format instead.
 *
 * What this script does
 * ---------------------
 * 1. Bundle  dist/server/entry.mjs  → dist/_worker.js  (esbuild, ESM)
 * 2. Hoist   dist/client/*          → dist/            (static assets at root)
 * 3. Delete  dist/server/           (no longer needed, and would be served publicly)
 * 4. Delete  dist/client/           (already hoisted)
 *
 * Pages then:
 *   • uploads everything in dist/ (except _worker.js) as static assets
 *   • deploys _worker.js as the Worker
 *   • provides env.ASSETS bound to those static files  ← Worker uses this
 */

import { cpSync, rmSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { build } from 'esbuild';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir    = resolve(__dirname, '..', 'dist');
const entryPoint = resolve(distDir, 'server', 'entry.mjs');
const outFile    = resolve(distDir, '_worker.js');

// ── 1. Bundle Worker ────────────────────────────────────────────────────────
await build({
  entryPoints: [entryPoint],
  bundle: true,
  outfile: outFile,
  format: 'esm',
  target: 'es2022',
  platform: 'neutral',       // not 'node' or 'browser' — Cloudflare runtime
  conditions: ['workerd', 'worker', 'browser'],
  // Cloudflare runtime modules are provided by the platform; do NOT bundle them
  external: [
    'cloudflare:*',
    'node:*',
  ],
  minify: false,             // keep readable for debugging; Pages minifies at edge
  logLevel: 'warning',
});
console.log(`✓ Worker bundled  → dist/_worker.js`);

// ── 2. Hoist static assets ──────────────────────────────────────────────────
// Pages treats every file in dist/ (except _worker.js) as a static asset and
// binds it to env.ASSETS.  Without hoisting, dist/client/index.html would be
// served at /client/index.html instead of /.
cpSync(resolve(distDir, 'client'), distDir, { recursive: true });
console.log(`✓ Static assets   → dist/ (hoisted from dist/client/)`);

// ── 3. Clean up ─────────────────────────────────────────────────────────────
rmSync(resolve(distDir, 'server'), { recursive: true, force: true });
rmSync(resolve(distDir, 'client'), { recursive: true, force: true });
console.log(`✓ dist/server/ and dist/client/ removed`);

console.log(`
Deploy with:
  wrangler pages deploy dist --project-name finanzkompass --branch main
`);
