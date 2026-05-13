import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET(context) {
  const tests = await getCollection('tests', ({ data }) => !data.draft && data.saeule === 'wellbeing');
  const ratgeber = await getCollection('ratgeber', ({ data }) => !data.draft && (data.saeule === 'wellbeing' || data.saeule === 'mixed'));

  const items = [
    ...tests.map((e) => ({
      title: e.data.titel,
      pubDate: e.data.aktualisiert,
      description: e.data.beschreibung,
      link: `/wellbeing/${e.id.replace(/\.md$/, '')}/`,
      categories: ['Wellbeing', e.data.kategorie],
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
    title: 'Finanzkompass — Wellbeing',
    description: 'Tests, Vergleiche und Ratgeber zu Online-Therapie, Mindfulness und mentaler Gesundheit.',
    site: context.site,
    items,
    customData: '<language>de-DE</language>',
  });
}
