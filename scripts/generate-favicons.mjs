/**
 * One-time generator for the favicon PNG set.
 *
 * Reads:   public/favicon.svg
 * Writes:  public/apple-touch-icon.png  (180×180, iOS home screen)
 *          public/icon-192.png          (192×192, Android home screen / PWA)
 *          public/icon-512.png          (512×512, PWA splash)
 *          public/favicon-32.png        (32×32, classic favicon fallback)
 *
 * Re-run after changing favicon.svg.
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '..', 'public');
const svg = readFileSync(resolve(publicDir, 'favicon.svg'));

const targets = [
  { size: 180, file: 'apple-touch-icon.png' },
  { size: 192, file: 'icon-192.png' },
  { size: 512, file: 'icon-512.png' },
  { size: 32,  file: 'favicon-32.png' },
];

for (const { size, file } of targets) {
  await sharp(svg)
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(resolve(publicDir, file));
  console.log(`✓ ${file} (${size}×${size})`);
}
console.log('\nDone. Reference these in BaseLayout.astro:');
console.log('  <link rel="apple-touch-icon" href="/apple-touch-icon.png">');
console.log('  <link rel="manifest" href="/site.webmanifest">');
