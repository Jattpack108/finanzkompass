# Finanzkompass

Editorial affiliate review site for the DACH market. Astro 6.x on Cloudflare Pages with D1.

## Quick start

```bash
npm install
npm run dev
```

Visit http://localhost:4321.

## Stack

- Astro 6.x (`output: 'server'`)
- Tailwind CSS 4 via `@tailwindcss/vite`
- Cloudflare Pages + D1 (SQLite)
- Resend for transactional email
- TypeScript strict

## Local development

```bash
npm run dev                     # Astro dev server with Cloudflare workerd
npm run build                   # Production build (writes to dist/)
npx astro check                 # Type-check
npx wrangler types              # Regenerate Cloudflare bindings types
```

## D1 schema

Migrations live under `migrations/`. Apply to local D1:

```bash
npx wrangler d1 migrations apply finanzkompass-db --local
```

Apply to production (after `wrangler login`):

```bash
npx wrangler d1 migrations apply finanzkompass-db --remote
```

Tables: `abonnenten`, `cashback_antraege`, `affiliate_klicks`, `affiliate_programme`.

## Deploy to Cloudflare Pages

Connect this repo at https://dash.cloudflare.com -> Workers & Pages -> Create application -> Pages -> Connect to Git.

Build settings:
- Build command: `npm run build`
- Build output: `dist`
- Environment variables: see `.env.example` (set in Pages -> Settings -> Environment Variables)
- D1 binding: bind D1 database `finanzkompass-db` as `DB` in Pages -> Settings -> Functions -> D1 database bindings

## Environment variables

| Name | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | yes | Resend API key (https://resend.com -> API Keys) |
| `PUBLIC_SITE_URL` | yes | Canonical site URL, no trailing slash |
| `NEWSLETTER_FROM_EMAIL` | yes | Verified Resend sender |
| `NEWSLETTER_FROM_NAME` | yes | Display name |
| `CASHBACK_RECIPIENT_EMAIL` | yes | Inbox for cashback notifications |

## Project layout

```
src/
|-- content.config.ts         Astro 5+ content collections schema
|-- content/                  Markdown source articles
|-- layouts/                  Page shells (Base, Test, Vergleich, Ratgeber)
|-- components/               UI components (16)
|-- lib/                      D1 client, SEO helpers, affiliate logic, email
|-- pages/                    Routes + API endpoints
`-- styles/global.css         Design system (from claude.design HTML)
```

## What still needs to be done manually before launch

See `../plans/2026-05-13-launch-runbook.md` for the full step-by-step. Short version:

1. Register `finanzkompass.de` at Cloudflare Registrar (or choose alternative).
2. Create Cloudflare account; copy Account ID into `wrangler.toml`.
3. `npx wrangler login`, then `npx wrangler d1 create finanzkompass-db --remote` and copy real `database_id` into `wrangler.toml`.
4. Apply migrations to remote: `npx wrangler d1 migrations apply finanzkompass-db --remote`.
5. Create Resend account, verify domain, create API key, set as `RESEND_API_KEY` env var in Pages.
6. Fill all `[Vorname Nachname]` / `[Strasse]` / `[+49 ...]` placeholders in `src/pages/impressum.astro` and `src/pages/datenschutz.astro`.
7. Apply for affiliate programs: financeAds, Tarifcheck, CHECK24, BetterHelp (via Impact), Trade Republic direct, Scalable direct, WISO Steuer direct.
8. Replace `https://refnonexistent.example/*` URLs in `src/content/**` and `src/lib/affiliate.ts` with real affiliate URLs.
9. Once deployed, enable Cloudflare Web Analytics and paste the token into the commented line in `BaseLayout.astro`.
10. Verify the property in Google Search Console + Bing Webmaster Tools.

## Editorial standards

- Every YMYL article must include `Risikohinweis` (auto by `TestLayout`/`VergleichLayout`/`RatgeberLayout` based on `saeule`)
- Author box and source list at the bottom of each article (auto by layouts)
- `aktualisiert` date in frontmatter is rendered prominently — must be kept current
- All affiliate links must use `<AffiliateLink>` — never raw anchors

## License

Proprietary. (c) 2026 Finanzkompass.
