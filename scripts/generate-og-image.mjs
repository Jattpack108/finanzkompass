/**
 * One-time generator for the default Open Graph image.
 *
 * Run once via:  node scripts/generate-og-image.mjs
 * Output:        public/og-default.png  (1200×630, brand-consistent)
 *
 * Re-run only when the brand identity changes.
 */

import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outFile = resolve(__dirname, '..', 'public', 'og-default.png');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="#FAFAF9"/>

  <!-- Subtle diagonal stripe accent (top-right corner) -->
  <defs>
    <pattern id="stripes" patternUnits="userSpaceOnUse" width="32" height="32" patternTransform="rotate(135)">
      <line x1="0" y1="0" x2="0" y2="32" stroke="#E7E5E4" stroke-width="14"/>
    </pattern>
    <linearGradient id="bottomFade" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#FAFAF9" stop-opacity="1"/>
      <stop offset="100%" stop-color="#FAFAF9" stop-opacity="0.4"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#stripes)" opacity="0.5"/>
  <rect width="1200" height="630" fill="url(#bottomFade)"/>

  <!-- Top border line -->
  <line x1="0" y1="0" x2="1200" y2="0" stroke="#1C1917" stroke-width="6"/>

  <!-- Eyebrow / mono label -->
  <text x="80" y="98" font-family="JetBrains Mono, ui-monospace, Menlo, monospace" font-size="16" font-weight="500" letter-spacing="2" fill="#A8A29E" text-transform="uppercase">FINANZEN · WELLBEING · GEPRÜFT</text>

  <!-- Big brand wordmark -->
  <text x="80" y="280" font-family="Fraunces, Iowan Old Style, Georgia, serif" font-size="120" font-weight="500" letter-spacing="-4" fill="#1C1917">Finanzkompass<tspan fill="#B45309">.</tspan></text>

  <!-- Tagline (serif italic) -->
  <text x="80" y="380" font-family="Fraunces, Georgia, serif" font-size="48" font-style="italic" font-weight="400" fill="#57534E">Tests mit echtem Geld.</text>
  <text x="80" y="438" font-family="Fraunces, Georgia, serif" font-size="48" font-style="italic" font-weight="400" fill="#57534E">Provision wird geteilt.</text>

  <!-- Bottom-left: domain mono -->
  <text x="80" y="568" font-family="JetBrains Mono, ui-monospace, Menlo, monospace" font-size="20" font-weight="500" letter-spacing="1" fill="#1C1917">finanzkompass.de</text>

  <!-- Bottom-right: small accent dot + label -->
  <circle cx="1086" cy="562" r="5" fill="#B45309"/>
  <text x="1100" y="568" font-family="JetBrains Mono, ui-monospace, Menlo, monospace" font-size="16" font-weight="500" letter-spacing="2" fill="#57534E">UNABHÄNGIG</text>

  <!-- Bottom border accent -->
  <line x1="0" y1="630" x2="1200" y2="630" stroke="#1C1917" stroke-width="3"/>
</svg>
`;

const buffer = await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toBuffer();

await sharp(buffer).toFile(outFile);
console.log(`✓ Generated ${outFile}`);
console.log(`  Size:    1200×630`);
console.log(`  Bytes:   ${buffer.length}`);
console.log(`  Use in:  <meta property="og:image" content="${outFile.split(/[\\\\/]/).slice(-2).join('/')}">`);
