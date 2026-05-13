// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://finanzkompass.de',
  output: 'server',
  adapter: cloudflare({
    prerenderEnvironment: 'node',
  }),
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      // Exclude pages that shouldn't be indexed
      filter: (page) =>
        !page.includes('/newsletter-bestaetigt') &&
        !page.includes('/404') &&
        !page.includes('/suche'),
      // Per-page customization
      serialize(item) {
        const url = item.url;
        // Higher priority for evergreen pillar content
        if (/\/ratgeber\/[^/]+\/?$/.test(url)) item.priority = 0.8;
        // Tests and comparisons get high priority
        if (/\/(finanzen|wellbeing|vergleiche)\/[^/]+\/?$/.test(url)) item.priority = 0.9;
        // Homepage gets max priority
        if (/^https?:\/\/[^/]+\/?$/.test(url)) {
          item.priority = 1.0;
          item.changefreq = 'daily';
        }
        // Listing pages
        if (/\/(finanzen|wellbeing|vergleiche|ratgeber)\/?$/.test(url)) {
          item.priority = 0.9;
          item.changefreq = 'daily';
        }
        // Legal pages low priority, change rarely
        if (/\/(impressum|datenschutz|transparenz|methodik|korrekturen)\/?$/.test(url)) {
          item.priority = 0.4;
          item.changefreq = 'monthly';
        }
        // Glossar pillar
        if (/\/glossar\/?$/.test(url)) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  image: {
    domains: [],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
