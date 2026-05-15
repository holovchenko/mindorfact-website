import { defineCollection, z } from 'astro:content';

const legalCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    lastUpdated: z.string(),
    description: z.string().optional(),
    locale: z.enum(['uk', 'en', 'de', 'fr']),
  }),
});

export const collections = { legal: legalCollection };
