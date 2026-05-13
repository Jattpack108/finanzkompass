import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET(context) {
  const tests = await getCollection('tests', ({ data }) => !data.draft && data.saeule === 'finance');
  const vergleiche = await getCollection('vergleiche', ({ data }) => !data.draft && (data.saeule === 'finance' || data.saeule === 'mixed'));
  const ratgeber = await getCollection('ratgeber', ({ data }) => !data.draft && (data.saeule === 'finance' || data.saeule === 'mixed'));

  const items = [
    ...tests.map((e) => ({
      title: e.data.titel,
      pubDate: e.data.aktualisiert,
      description: e.data.beschreibung,
      link: `/finanzen/${e.id.replace(/\.md$/, '')}/`,
      categories: ['Finanzen', e.data.kategorie],
    })),
    ...vergleiche.map((e) => ({
      title: e.data.titel,
      pubDate: e.data.aktualisiert,
      description: e.data.beschreibung,
      link: `/vergleiche/${e.id.replace(/\.md$/, '')}/`,
      categories: ['Vergleich'],
    })),
    ...ratgeber.map((e) => ({
      title: e.data.titel,
      pubDate: e.data.aktualisiert,
      description: e.data.beschreibung,
      link: `/ratgeber/${e.id.replace(/\.md$/, '')}/`,
      categories: ['Ratgeber', e.data.kategorie],
    })),
  ].sort((a, b) => +new Date(b.pubDate) - +new Date(a.pubDate));

  return rss({
    title: 'Finanzkompass — Finanzen',
    description: 'Tests, Vergleiche und Ratgeber zu Neobrokern, ETFs, Banking und Steuersoftware.',
    site: context.site,
    items,
    customData: '<language>de-DE</language>',
  });
}
