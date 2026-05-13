import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const testSchema = z.object({
  titel: z.string(),
  beschreibung: z.string().max(180),
  kategorie: z.enum([
    'neobroker', 'direktbank', 'banking-app', 'kreditkarte',
    'tagesgeld', 'etf-sparplan', 'steuersoftware', 'altersvorsorge',
    'versicherung', 'online-therapie', 'mindfulness-app',
    'crypto-hardware', 'investment-tool',
  ]),
  saeule: z.enum(['finance', 'wellbeing']),
  produktName: z.string(),
  produktAnbieter: z.string(),
  preisInfo: z.string(),
  affiliateUrl: z.string().url(),
  affiliateProgramm: z.string(),
  cashbackVerfuegbar: z.boolean().default(false),
  cashbackBetrag: z.number().optional(),
  bewertung: z.number().min(0).max(10),
  bestFuer: z.string(),
  nichtFuer: z.string(),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  fazit: z.string(),
  veroeffentlicht: z.coerce.date(),
  aktualisiert: z.coerce.date(),
  testdauerTage: z.number().optional(),
  autor: z.string().default('Die Finanzkompass-Redaktion'),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  coverImage: z.string().optional(),
  ymylHinweis: z.boolean().default(true),
  schemaTyp: z.enum(['Review', 'FinancialProduct', 'Product']).default('Review'),
  quellen: z
    .array(z.object({ titel: z.string(), url: z.string().url().optional(), herausgeber: z.string().optional() }))
    .default([]),
});

const vergleichSchema = z.object({
  titel: z.string(),
  beschreibung: z.string().max(180),
  saeule: z.enum(['finance', 'wellbeing', 'mixed']),
  produkte: z.array(
    z.object({
      name: z.string(),
      anbieter: z.string(),
      affiliateUrl: z.string().url(),
      preisInfo: z.string(),
      bewertung: z.number(),
      bestFuer: z.string(),
      cashbackBetrag: z.number().optional(),
    })
  ),
  gewinner: z.string(),
  veroeffentlicht: z.coerce.date(),
  aktualisiert: z.coerce.date(),
  draft: z.boolean().default(false),
  ymylHinweis: z.boolean().default(true),
  quellen: z
    .array(z.object({ titel: z.string(), url: z.string().url().optional(), herausgeber: z.string().optional() }))
    .default([]),
});

const ratgeberSchema = z.object({
  titel: z.string(),
  beschreibung: z.string().max(180),
  kategorie: z.string(),
  saeule: z.enum(['finance', 'wellbeing', 'mixed']),
  isPillarPage: z.boolean().default(false),
  veroeffentlicht: z.coerce.date(),
  aktualisiert: z.coerce.date(),
  draft: z.boolean().default(false),
  verlinkteTests: z.array(z.string()).optional(),
  ymylHinweis: z.boolean().default(true),
  quellen: z
    .array(z.object({ titel: z.string(), url: z.string().url().optional(), herausgeber: z.string().optional() }))
    .default([]),
});

export const collections = {
  tests: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/tests' }),
    schema: testSchema,
  }),
  vergleiche: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/vergleiche' }),
    schema: vergleichSchema,
  }),
  ratgeber: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/ratgeber' }),
    schema: ratgeberSchema,
  }),
};
