// Schema.org helpers and SEO meta utilities.

export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  description: string;
  foundingDate: string;
  sameAs?: string[];
}

export function organizationSchema(siteUrl: string): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Finanzkompass',
    url: siteUrl,
    description: 'Unabhängige Tests für Finanz- und Wellbeing-Produkte. Wir testen auf eigene Kosten und teilen unsere Provision als Cashback.',
    foundingDate: '2026',
  };
}

export interface ReviewSchemaInput {
  produktName: string;
  produktAnbieter: string;
  bewertung: number;
  bestRating?: number;
  datePublished: string;
  dateModified: string;
  saeule: 'finance' | 'wellbeing';
  url: string;
  beschreibung: string;
}

export function reviewSchema(input: ReviewSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': input.saeule === 'finance' ? 'FinancialProduct' : 'Product',
      name: input.produktName,
      brand: { '@type': 'Brand', name: input.produktAnbieter },
    },
    author: {
      '@type': 'Organization',
      name: 'Finanzkompass-Redaktion',
      url: input.url.split('/').slice(0, 3).join('/'),
    },
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: input.bewertung.toString(),
      bestRating: (input.bestRating ?? 10).toString(),
    },
    description: input.beschreibung,
    url: input.url,
  };
}

export function breadcrumbSchema(trail: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(faqs: Array<{ frage: string; antwort: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ frage, antwort }) => ({
      '@type': 'Question',
      name: frage,
      acceptedAnswer: { '@type': 'Answer', text: antwort },
    })),
  };
}

export function formatGermanDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
