import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const tests = await getCollection('tests', ({ data }) => !data.draft);
  const vergleiche = await getCollection('vergleiche', ({ data }) => !data.draft);
  const ratgeber = await getCollection('ratgeber', ({ data }) => !data.draft);

  const items = [
    ...tests.map((e) => ({
      title: e.data.titel,
      pubDate: e.data.aktualisiert,
      description: e.data.beschreibung,
      link: `/${e.data.saeule === 'wellbeing' ? 'wellbeing' : 'finanzen'}/${e.id.replace(/\.md$/, '')}`,
    })),
    ...vergleiche.map((e) => ({
      title: e.data.titel,
      pubDate: e.data.aktualisiert,
      description: e.data.beschreibung,
      link: `/vergleiche/${e.id.replace(/\.md$/, '')}`,
    })),
    ...ratgeber.map((e) => ({
      title: e.data.titel,
      pubDate: e.data.aktualisiert,
      description: e.data.beschreibung,
      link: `/ratgeber/${e.id.replace(/\.md$/, '')}`,
    })),
  ].sort((a, b) => +new Date(b.pubDate) - +new Date(a.pubDate));

  return rss({
    title: 'Finanzkompass — Tests, Vergleiche, Ratgeber',
    description: 'Wir testen Neobroker, ETF-Plattformen und Wellbeing-Apps auf eigene Kosten und geben einen Teil unserer Provision als Cashback zurück.',
    site: context.site,
    items,
    customData: '<language>de-DE</language>',
  });
}
