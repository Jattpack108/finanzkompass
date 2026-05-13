import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET(context) {
  const ratgeber = await getCollection('ratgeber', ({ data }) => !data.draft);

  const items = ratgeber
    .map((e) => ({
      title: e.data.titel,
      pubDate: e.data.aktualisiert,
      description: e.data.beschreibung,
      link: `/ratgeber/${e.id.replace(/\.md$/, '')}/`,
      categories: ['Ratgeber', e.data.kategorie],
    }))
    .sort((a, b) => +new Date(b.pubDate) - +new Date(a.pubDate));

  return rss({
    title: 'Finanzkompass — Ratgeber',
    description: 'Pillar-Artikel und Grundlagen-Erklärungen zu Finanzen und Wellbeing.',
    site: context.site,
    items,
    customData: '<language>de-DE</language>',
  });
}
