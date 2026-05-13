// Schema.org helpers and SEO meta utilities.

export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  '@id': string;
  name: string;
  url: string;
  logo: string;
  description: string;
  foundingDate: string;
  sameAs?: string[];
}

export function organizationSchema(siteUrl: string): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'Finanzkompass',
    url: siteUrl,
    logo: `${siteUrl}/icon-512.png`,
    description: 'Unabhängige Tests für Finanz- und Wellbeing-Produkte. Wir testen auf eigene Kosten und teilen unsere Provision als Cashback.',
    foundingDate: '2026',
    // sameAs: ['https://twitter.com/finanzkompass', 'https://www.linkedin.com/company/finanzkompass'],
    // ↑ aktivieren, sobald Social-Accounts existieren
  };
}

// WebSite schema with SearchAction — enables Google sitelinks search box
export function websiteSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: 'Finanzkompass',
    description: 'Unabhängige Tests für Finanz- und Wellbeing-Produkte im DACH-Markt.',
    publisher: { '@id': `${siteUrl}/#organization` },
    inLanguage: 'de-DE',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/suche?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Article schema for Ratgeber posts
export interface ArticleSchemaInput {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  siteUrl: string;
  kategorie?: string;
}

export function articleSchema(input: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    inLanguage: 'de-DE',
    isAccessibleForFree: true,
    publisher: { '@id': `${input.siteUrl}/#organization` },
    author: {
      '@type': 'Organization',
      name: 'Finanzkompass-Redaktion',
      url: `${input.siteUrl}/ueber-uns`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': input.url,
    },
    ...(input.kategorie ? { articleSection: input.kategorie } : {}),
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
