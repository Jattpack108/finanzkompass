// Builds the cloaked affiliate redirect URL. Always use this — never raw affiliate URLs in markup.

export function affiliateHref(opts: {
  zielUrl: string;
  produktName: string;
  quelleSeite: string;
}): string {
  const params = new URLSearchParams({
    ziel: opts.zielUrl,
    produkt: opts.produktName,
    von: opts.quelleSeite,
  });
  return `/api/affiliate-redirect?${params.toString()}`;
}

// Affiliate programs catalogue (mirrors D1 affiliate_programme table contents at static build time)
export const AFFILIATE_PROGRAMS = {
  'trade-republic': {
    name: 'Trade Republic',
    netzwerk: 'direct',
    saeule: 'finance' as const,
    provisionTyp: 'pro_abschluss',
    provisionWert: 40,
    cashbackAktiv: true,
    cashbackBetrag: 12,
    cookieTage: 30,
    ppcErlaubt: true,
    ziel: 'https://refnonexistent.example/tr',
  },
  'scalable': {
    name: 'Scalable Capital',
    netzwerk: 'direct',
    saeule: 'finance' as const,
    provisionTyp: 'pro_abschluss',
    provisionWert: 45,
    cashbackAktiv: true,
    cashbackBetrag: 15,
    cookieTage: 30,
    ppcErlaubt: true,
    ziel: 'https://refnonexistent.example/scalable',
  },
  'betterhelp': {
    name: 'BetterHelp',
    netzwerk: 'impact',
    saeule: 'wellbeing' as const,
    provisionTyp: 'pro_abschluss',
    provisionWert: 150,
    cashbackAktiv: true,
    cashbackBetrag: 15,
    cookieTage: 30,
    ppcErlaubt: false,
    ziel: 'https://refnonexistent.example/bh',
  },
  'wiso-steuer': {
    name: 'WISO Steuer',
    netzwerk: 'direct',
    saeule: 'finance' as const,
    provisionTyp: 'pro_abschluss',
    provisionWert: 12,
    cashbackAktiv: true,
    cashbackBetrag: 5,
    cookieTage: 30,
    ppcErlaubt: true,
    ziel: 'https://refnonexistent.example/wiso',
  },
  'calm': {
    name: 'Calm',
    netzwerk: 'impact',
    saeule: 'wellbeing' as const,
    provisionTyp: 'prozent',
    provisionWert: 50,
    cashbackAktiv: false,
    cookieTage: 30,
    ppcErlaubt: true,
    ziel: 'https://refnonexistent.example/calm',
  },
} as const;

export type ProgramKey = keyof typeof AFFILIATE_PROGRAMS;
