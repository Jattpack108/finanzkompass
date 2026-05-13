# Changelog — Finanzkompass

Wir dokumentieren hier öffentlich, was sich an der Site geändert hat — inhaltlich, strukturell oder technisch. Das gehört zu unserem [Transparenzversprechen](./src/pages/transparenz.astro).

Format orientiert sich an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/).
Versionierung folgt [SemVer](https://semver.org/lang/de/) — aber locker: Major bedeutet eine spürbare strukturelle Änderung.

---

## [Unreleased]

### Geplant
- Sechs Ratgeber-Pillar-Seiten (ETF, Neobroker, Online-Therapie, Cashback-Steuer, BaFin, Psychotherapie)
- Echte Affiliate-Programm-Anbindungen (financeAds.net, Awin, Impact)
- Custom Domain `finanzkompass.de`
- Cloudflare Web Analytics aktiv (cookie-frei)

---

## [0.2.0] — 2026-05-13

### Hinzugefügt
- **Ressort-Index-Seiten** für `/finanzen`, `/wellbeing`, `/vergleiche`, `/ratgeber`
  (vorher zeigten diese URLs fälschlich die Startseite — Soft-404)
- **Echte 404-Seite** mit hilfreichen Link-Vorschlägen statt SPA-Fallback
- **Open-Graph-Bild** (`/og-default.png`, 1200×630)
- **Favicon-Set** für moderne Browser:
  - SVG-Master mit Dark-Mode-Unterstützung
  - `apple-touch-icon.png` (180×180) für iOS-Homescreen
  - `icon-192.png` / `icon-512.png` für Android & PWA-Splash
- **PWA-Manifest** (`/site.webmanifest`) — installierbar als App-Icon
- **`theme-color` Meta-Tags** für Browser-UI-Anpassung in Hell-/Dunkelmodus

### Verbessert
- BaseLayout lädt jetzt das vollständige Favicon-Set + Webmanifest
- Listing-Seiten gruppieren Tests automatisch nach Kategorie und verlinken Vergleiche + Ratgeber im selben Ressort

### Technisch
- `scripts/generate-og-image.mjs` — One-Time-Generator für das OG-Bild via sharp
- `scripts/generate-favicons.mjs` — Generiert alle Favicon-PNG-Varianten aus der Master-SVG

---

## [0.1.0] — 2026-05-13

### Hinzugefügt
- **Initialer Live-Stand:** finanzkompass.pages.dev
- **2 Produkt-Tests:** Trade Republic, BetterHelp
- **1 Direktvergleich:** Trade Republic vs. Scalable Capital
- Vollständiges Newsletter-System mit Double-Opt-In (DSGVO §7 UWG)
- Cashback-Antragsformular mit Admin-Notification
- Internes Affiliate-Cloaking via `/api/affiliate-redirect` (kein IP-Logging)
- Schema.org JSON-LD: Organization, Review, FinancialProduct, Breadcrumb, FAQ
- 1034 Zeilen Design-System CSS, Hell-/Dunkelmodus, Mobile Menu
- D1 (SQLite) Datenbank mit 4 Tabellen (Abonnenten, Cashback-Anträge, Affiliate-Klicks, -Programme)
- KV-Namespace `SESSION` für künftige Session-Logik
- RSS-Feed, Sitemap, kookie-freies Cloudflare Web Analytics vorbereitet

### Technisch
- Astro 6.3 SSR auf Cloudflare Pages
- `@astrojs/cloudflare` v13 + Tailwind CSS 4 via `@tailwindcss/vite`
- Custom Build Pipeline (`patch-pages-output.mjs`) wandelt @astrojs/cloudflare-Output ins Pages-`_worker.js`-Format
- `wrangler.toml` mit D1- und KV-Bindings

---

## Korrekturpolitik

Wir markieren Korrekturen am Artikelende und behalten den ursprünglichen Stand. Größere strukturelle Änderungen landen hier in der Changelog.
