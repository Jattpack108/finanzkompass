/// <reference path="../.astro/types.d.ts" />
/// <reference path="../worker-configuration.d.ts" />

// Extend the wrangler-generated Cloudflare.Env with secrets that are not in
// wrangler.toml [vars] (they're set via `wrangler secret put` or in the
// Cloudflare Pages dashboard for production).
declare namespace Cloudflare {
  interface Env {
    RESEND_API_KEY: string;
    NEWSLETTER_FROM_EMAIL: string;
    NEWSLETTER_FROM_NAME: string;
    CASHBACK_RECIPIENT_EMAIL: string;
  }
}

// Astro v6 + @astrojs/cloudflare v13: `Astro.locals.runtime.env` was removed.
// Use `import { env } from "cloudflare:workers"` in API routes / lib instead.
// `cfContext` (ExecutionContext) is still exposed via locals if needed.
declare namespace App {
  interface Locals {
    cfContext: ExecutionContext;
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
