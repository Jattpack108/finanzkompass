# Finanzkompass — Nächste Schritte (für dich)

Stand: 2026-05-13 · Live: https://finanzkompass.pages.dev

Dieses Dokument listet alles, was du **persönlich** machen musst, um aus der jetzigen Draft-Version eine echte, öffentlich beworbene Site zu machen. Nach Wichtigkeit sortiert.

---

## 🔴 Block 1 · Rechtsgültigkeit (vor öffentlicher Bewerbung zwingend)

Solange diese Punkte offen sind, hat `/impressum`, `/datenschutz` und `/ueber-uns` ein gelbes Warn-Banner und ein `noindex` Meta-Tag.

### 1.1 Impressum-Daten ausfüllen

**Datei:** `src/pages/impressum.astro` (Zeilen ~6-15)

Ersetze diese Platzhalter:

```js
const impressum = {
  vorname: 'Vorname',                    // ← deine echten Daten
  nachname: 'Nachname',
  strasse: 'Straße + Hausnummer',
  plz: 'PLZ',
  ort: 'Ort',
  land: 'Deutschland',
  telefon: '+49 …',                       // ← optional, kann leer bleiben → dann nur E-Mail
  email: 'kontakt@finanzkompass.de',
  ustIdHinweis: 'Kleinunternehmer-Regelung nach §19 UStG. Es wird keine Umsatzsteuer erhoben und ausgewiesen.',
};
```

**Pflicht-Felder nach §5 TMG:**
- ✓ Name (Vor- + Nachname)
- ✓ Anschrift (Straße + Hausnummer, PLZ + Ort) — **muss ladungsfähig sein**, keine Postfach-Adresse, kein virtuelles Büro ohne Hinweis
- ✓ E-Mail (haben wir bereits)
- ⚠ Telefon **optional**, aber empfohlen — wenn weggelassen, schreibt die Rechtsprechung „zweiter Kontaktweg" vor (z. B. Kontaktformular reicht)

**Privatperson §19 UStG**: keine USt-ID nötig. Keine Handelsregister-Nr.

### 1.2 Datenschutz-Verantwortliche:n synchronisieren

**Datei:** `src/pages/datenschutz.astro` (Zeilen ~6-12)

Trage exakt die gleichen Daten ein wie im Impressum — die Felder sind dort schon vorbereitet:

```js
const verantwortlicher = {
  vorname: 'Vorname',         // identisch zu Impressum
  nachname: 'Nachname',
  strasse: 'Straße + Hausnummer',
  plz: 'PLZ',
  ort: 'Ort',
  email: 'datenschutz@finanzkompass.de',
};
```

### 1.3 Autoren-Profile in `Über uns`

**Datei:** `src/pages/ueber-uns.astro` (Zeilen ~5-25)

Für **YMYL-Content (Finanzen + Gesundheit)** ist E-E-A-T zwingend. Google ranket anonyme Finanz-Reviews nicht. Du musst mindestens **eine echte Person** mit Bio nennen — am besten zwei, da deine Marken-Erzählung das verspricht.

```js
const autoren = [
  {
    id: 'autor-1',
    name: 'Vorname Nachname',
    rolle: 'Mitgründer · Redaktionsleitung',
    schwerpunkt: 'Finanzen — Neobroker, ETFs, Steuern',
    bio: '2-3 Sätze fachlicher Hintergrund. Was qualifiziert dich, über Finanzen zu schreiben?',
    qualifikation: 'Studium / Berufserfahrung / Zertifikate',
  },
  // Zweite Person: Solange Platzhalter, wird sie als "Name folgt" markiert.
];
```

**Tipp**: Wenn du keinen festen Co-Autor hast, ist es ehrlicher, die zweite Karte vorerst zu entfernen und die Über-uns-Erzählung auf „Solo mit redaktionellem Anspruch" umzuschreiben (oder „Redaktion mit externen Gast-Autor:innen"). Sag mir Bescheid, ich passe es an.

### 1.4 finanzkompass.de Domain registrieren

Aktuell läuft alles auf `finanzkompass.pages.dev`. Für Branding + SEO musst du die echte Domain holen:

1. **Domain registrieren**, Empfehlungen (von günstig nach teuer):
   - **INWX** — ~10€/Jahr für .de, gute Doku
   - **IONOS** — sehr verbreitet in DE, ~10€/Jahr für .de im ersten Jahr
   - **Cloudflare Registrar** — to-cost-Preise (~7€/Jahr für .de), aber nimmt deine Domain im selben Cloudflare-Account

2. **DNS zu Cloudflare** (wenn nicht schon dort):
   - Bei deinem Registrar Nameserver auf `*.ns.cloudflare.com` umstellen
   - Cloudflare-Account: Domain hinzufügen → DNS verwaltet jetzt Cloudflare

3. **Custom Domain mit Pages verbinden**:
   - dash.cloudflare.com → Workers & Pages → finanzkompass → Settings → Custom Domains
   - „Set up a custom domain" → `finanzkompass.de` → automatisches CNAME-Setup
   - Auch `www.finanzkompass.de` hinzufügen mit Redirect auf Apex

4. **HTTPS** ist automatisch via Cloudflare SSL.

---

## 🟠 Block 2 · Revenue-Pipeline (vor erstem echten Traffic)

### 2.1 Resend.com Account + Domain-Verification

**Damit Newsletter + Cashback-Mails funktionieren.**

1. **resend.com** Account anlegen (kostenlos bis 3.000 Mails/Monat)
2. **Domain verifizieren**: `finanzkompass.de` hinzufügen
3. **DNS-Records** anlegen (zeigt Resend, copy-paste in Cloudflare DNS):
   - 1× MX
   - 3× TXT (SPF, DKIM, DMARC)
4. **API-Key** generieren (Resend → API Keys → „Production Send" mit Domain-Restriction)
5. **In Cloudflare Pages eintragen**:
   - dash.cloudflare.com → Workers & Pages → finanzkompass → Settings → Environment Variables
   - 4 Variablen für **Production**:
     ```
     RESEND_API_KEY = re_AbCdEf...
     NEWSLETTER_FROM_EMAIL = newsletter@finanzkompass.de
     NEWSLETTER_FROM_NAME = Finanzkompass
     CASHBACK_RECIPIENT_EMAIL = deine.echte@email.de
     ```
6. **Test**: Self-subscribe auf der Live-Site → solltest Bestätigungs-E-Mail bekommen

### 2.2 Cloudflare Web Analytics

**Cookie-freie Reichweiten-Messung, DSGVO-OK, kostenlos.**

1. dash.cloudflare.com → Analytics & Logs → Web Analytics → „Add a site"
2. Hostname: `finanzkompass.pages.dev` (und später `finanzkompass.de`)
3. Token kopieren (sieht aus wie `7a8b9c…`)
4. In `src/layouts/BaseLayout.astro` Zeile ~99 die Kommentar-Zeile aktivieren und Token einsetzen:
   ```html
   <script defer src="https://static.cloudflareinsights.com/beacon.min.js"
           data-cf-beacon='{"token": "DEIN_TOKEN"}'></script>
   ```
5. Commit + Deploy

### 2.3 Affiliate-Programme (eines nach dem anderen)

Reihenfolge nach **DACH-Relevanz** für deine 2 existierenden Tests:

#### A. financeAds.net (Dachnetzwerk)
- **Was**: Größtes Affiliate-Netzwerk für DACH Finance (Trade Republic, Scalable, comdirect, ING, DKB, Tarifcheck, CHECK24-Teile)
- **Anmeldung**: financeads.net → „Publisher werden"
- **Bedingungen**: meistens kostenfreie Anmeldung, manuelle Prüfung (~1-3 Werktage)
- **Was du danach hast**: Tracking-Links für alle DACH-Bank-Produkte
- **Was zu tun**: Affiliate-Links in `src/lib/affiliate.ts` (Zeilen 17-77) ersetzen, jeweils:
  ```ts
  'trade-republic': {
    // …
    ziel: 'https://financeads.net/tc.php?t=DEINE_TRACKING_ID', // <-- echter Link
  }
  ```
- Auch in `src/content/tests/trade-republic-test-2026.md` und `src/content/vergleiche/trade-republic-vs-scalable-2026.md` die `affiliateUrl` aktualisieren

#### B. Awin (Backup + diverse)
- **Was**: zweitgrößtes Netzwerk in DE, oft komplementäre Programme
- **Anmeldung**: awin.com → kostet einmalig 5$ Verifikations-Deposit (wird zurückerstattet)
- **Wofür**: Tarifcheck, manche Banking-Produkte, Versicherungen

#### C. Impact.com (für BetterHelp + internationale Wellbeing)
- **Was**: BetterHelp und viele US-Wellbeing-Anbieter
- **Anmeldung**: impact.com → „Publishers / Partners" → Brand-spezifisch
- **Speziell für BetterHelp**: zusätzlich auf der BetterHelp-Affiliate-Seite separat anmelden
- **Was zu tun**: `affiliate.ts` und `betterhelp-test-2026.md` aktualisieren

#### D. CHECK24-Partnerprogramm (für Versicherungen)
- **Was**: Strom/Gas/Versicherung — wenn du da später Tests machen willst
- **Anmeldung**: kreditprogramme.de/check24

### 2.4 Cashback-Werte neu kalkulieren

Aktuell:
```
Trade Republic: 12€ Cashback (geschätzt auf Basis ~30€ Provision)
Scalable:       15€ Cashback (geschätzt auf Basis ~40€ Provision)
BetterHelp:     15€ Cashback
WISO Steuer:     5€ Cashback
```

Sobald du die echten Provisions-Sätze kennst (Schritt 2.3), kalibriere die Cashback-Werte. Faustformel:
- **40-60 % als Cashback**, der Rest deckt Hosting/Test-Kosten/Redaktion
- Wert sollte den Lesern fair erscheinen
- Im Test-Markdown und in `lib/affiliate.ts` anpassen, beide synchron halten

---

## 🟡 Block 3 · Quality of Life

### 3.1 GitHub Actions Auto-Deploy

Damit jeder `git push` zu Cloudflare deployt. Datei liegt bereit unter `.github/workflows/deploy.yml`.

```powershell
# Einmal:
gh auth refresh -s workflow      # Browser → authorize
git add .github/
git push origin main
```

Dann in GitHub Settings → Secrets → Actions:
- `CF_API_TOKEN` = ein Cloudflare API Token mit *Edit Cloudflare Pages*-Template (erstellbar in dash.cloudflare.com → My Profile → API Tokens)

**Alternative (einfacher)**: dash.cloudflare.com → finanzkompass → Settings → Builds & Deployments → „Connect to Git" → Repo verbinden → Pages baut bei jedem Push selbst. Funktioniert nahtlos.

### 3.2 Echte Produkt-Tests irgendwann

Du hast gesagt „aktuell nichts testen". Wenn du später echte Tests machen willst, eine sinnvolle Pipeline:
1. **Scalable Capital** — Vergleich ist da, einzelner Test fehlt
2. **WISO Steuer** — eine echte Steuererklärung
3. **Tomorrow Banking** — nachhaltige Banking-App, USP für Wellbeing-Brand
4. **HelloBetter** — deutsche DiGA als Kontrast zu BetterHelp

Bei mir Bescheid sagen, dann strukturiere ich die Test-Vorlage + Frontmatter.

### 3.3 og-default.png ggf. neu generieren

Falls du das Branding änderst (Farben, Schriftart, Wordmark), neu generieren:
```bash
node scripts/generate-og-image.mjs
node scripts/generate-favicons.mjs
```
(Beide brauchen nur `npm install`, keine speziellen Tools.)

---

## 🟢 Block 4 · Was bereits live ist (zur Erinnerung)

- Infrastructure: Cloudflare Pages + D1 + KV
- 4 Listing-Pages funktional (`/finanzen`, `/wellbeing`, `/vergleiche`, `/ratgeber`)
- 2 Produkt-Tests + 1 Vergleich
- **6 Ratgeber-Pillars** (~25.000 Wörter substantielles Content)
- Echte 404-Seite (HTTP 404 statt 200)
- OG-Image, Favicon-Set, PWA-Webmanifest
- AI-Crawler-Block in robots.txt
- DSGVO-konforme Datenschutzerklärung (Resend-AVV erwähnt)
- Newsletter Double-Opt-In funktional (nach 2.1)
- Cashback-Antragsformular funktional (nach 2.1)
- Affiliate-Cloaking via Internal Redirect (anonyme Tracking)
- Komplettes Design System Hell/Dunkel-Mode
- Cross-Linking zwischen Tests und Ratgebern
- Schema.org JSON-LD (Organization, Review, Breadcrumb, FAQ)
- Sitemap + RSS

---

## ⚡ Recommended Order

**Diese Woche**:
1. Impressum + Datenschutz + Über-uns Daten ausfüllen (15 Min)
2. Domain registrieren (15 Min)
3. Resend Account + Domain verifizieren (30 Min)
4. Cloudflare Web Analytics aktivieren (5 Min)

**Nächste 2 Wochen**:
5. financeAds anmelden + Trade Republic & Scalable Affiliate-Links austauschen
6. Custom Domain finanzkompass.de mit Pages verbinden
7. End-to-end Test: jemand abonniert Newsletter, bestätigt, bekommt erste E-Mail

**Optional, wenn du Auto-Deploy willst**:
8. GitHub Actions Workflow pushen (`gh auth refresh -s workflow` + push)

---

Bei Fragen oder Stolpern: einfach hier weiterreden, dann fixe ich es konkret.
