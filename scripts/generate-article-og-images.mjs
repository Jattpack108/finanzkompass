/**
 * Per-Artikel OG-Image-Generator.
 *
 * Scannt alle src/content/{tests,vergleiche,ratgeber}/*.md
 * und erzeugt für jeden Artikel ein 1200×630 OG-Bild unter
 * public/og/<collection>/<slug>.png.
 *
 * Wird vor `astro build` ausgeführt, damit Astro die Bilder in dist kopiert.
 *
 *   npm run og   # one-shot
 *   automatisch im build script eingehängt (optional)
 *
 * Re-Generierung ist sicher: existierende Bilder werden überschrieben.
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const contentDir = resolve(rootDir, 'src', 'content');
const publicOgDir = resolve(rootDir, 'public', 'og');

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Naïve YAML-Frontmatter parser — only handles flat key:value lines we use */
function parseFrontmatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z_]+):\s*(.+?)\s*$/);
    if (!kv) continue;
    let v = kv[2];
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    if (v === 'true') v = true;
    else if (v === 'false') v = false;
    fm[kv[1]] = v;
  }
  return fm;
}

/** Wrap text into multi-line layout for SVG (rough monospace estimate) */
function wrapText(text, maxCharsPerLine, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxCharsPerLine) {
      if (cur) lines.push(cur.trim());
      cur = w;
      if (lines.length >= maxLines) break;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur && lines.length < maxLines) lines.push(cur.trim());
  if (lines.length === maxLines && words.indexOf(lines.at(-1).split(/\s+/).at(-1)) < words.length - 1) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/.{3}$/, '') + '…';
  }
  return lines;
}

/** Build an SVG for the article — design matches default og-image */
function buildSvg({ kind, titel, beschreibung, kategorie }) {
  const eyebrowMap = {
    tests: 'TEST · FINANZKOMPASS',
    vergleiche: 'VERGLEICH · FINANZKOMPASS',
    ratgeber: 'RATGEBER · FINANZKOMPASS',
  };
  const eyebrow = eyebrowMap[kind] ?? 'FINANZKOMPASS';
  const accentDot = kind === 'tests' ? '#1E40AF' : kind === 'vergleiche' ? '#B45309' : '#2D6A4F';

  const titleLines = wrapText(titel, 32, 3);
  const descLines = wrapText(beschreibung, 60, 2);

  let titleY = 220;
  const titleTspans = titleLines
    .map((l, i) => `<tspan x="80" dy="${i === 0 ? 0 : 78}">${escapeXml(l)}</tspan>`)
    .join('');

  let descY = titleY + 78 * titleLines.length + 40;
  const descTspans = descLines
    .map((l, i) => `<tspan x="80" dy="${i === 0 ? 0 : 40}">${escapeXml(l)}</tspan>`)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="stripes" patternUnits="userSpaceOnUse" width="32" height="32" patternTransform="rotate(135)">
      <line x1="0" y1="0" x2="0" y2="32" stroke="#E7E5E4" stroke-width="14"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#FAFAF9"/>
  <rect width="1200" height="630" fill="url(#stripes)" opacity="0.35"/>
  <line x1="0" y1="0" x2="1200" y2="0" stroke="#1C1917" stroke-width="6"/>
  <text x="80" y="98" font-family="JetBrains Mono, ui-monospace, Menlo, monospace" font-size="16" font-weight="500" letter-spacing="2" fill="#A8A29E">${escapeXml(eyebrow)}</text>
  ${kategorie ? `<text x="80" y="130" font-family="JetBrains Mono, ui-monospace, Menlo, monospace" font-size="13" font-weight="500" letter-spacing="1" fill="#57534E">${escapeXml(kategorie.toUpperCase())}</text>` : ''}

  <text y="${titleY}" font-family="Fraunces, Iowan Old Style, Georgia, serif" font-size="68" font-weight="500" letter-spacing="-2" fill="#1C1917">${titleTspans}</text>

  <text y="${descY}" font-family="Inter, sans-serif" font-size="26" font-weight="400" fill="#57534E">${descTspans}</text>

  <text x="80" y="568" font-family="JetBrains Mono, ui-monospace, Menlo, monospace" font-size="20" font-weight="500" letter-spacing="1" fill="#1C1917">finanzkompass.de</text>
  <circle cx="1086" cy="562" r="5" fill="${accentDot}"/>
  <text x="1100" y="568" font-family="JetBrains Mono, ui-monospace, Menlo, monospace" font-size="16" font-weight="500" letter-spacing="2" fill="#57534E">UNABHÄNGIG</text>
  <line x1="0" y1="630" x2="1200" y2="630" stroke="#1C1917" stroke-width="3"/>
</svg>`;
}

async function processCollection(name) {
  const dir = resolve(contentDir, name);
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  const outDir = resolve(publicOgDir, name);
  mkdirSync(outDir, { recursive: true });

  const generated = [];
  for (const file of files) {
    const md = readFileSync(resolve(dir, file), 'utf8');
    const fm = parseFrontmatter(md);
    if (!fm || fm.draft === true) continue;

    const slug = file.replace(/\.md$/, '');
    const svg = buildSvg({
      kind: name,
      titel: fm.titel ?? slug,
      beschreibung: fm.beschreibung ?? '',
      kategorie: fm.kategorie,
    });

    const outPath = resolve(outDir, `${slug}.png`);
    await sharp(Buffer.from(svg))
      .png({ compressionLevel: 9 })
      .toFile(outPath);
    generated.push(`og/${name}/${slug}.png`);
  }
  return generated;
}

mkdirSync(publicOgDir, { recursive: true });
const all = [
  ...(await processCollection('tests')),
  ...(await processCollection('vergleiche')),
  ...(await processCollection('ratgeber')),
];

console.log(`✓ ${all.length} per-article OG images generated under public/og/`);
all.forEach((p) => console.log(`  /${p}`));
