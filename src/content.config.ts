import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    // SVG path data drawn in a 48x48 viewBox, stroked
    iconPath: z.string(),
    summary: z.string(),
    outcomes: z.array(z.string()),
    showOnHome: z.boolean().default(true),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    services: z.array(z.string()),
    summary: z.string(),
    url: z.string().url().optional(),
    order: z.number(),
    wide: z.boolean().default(false),
    // true → rendered as an explicit "your project here" slot, never as a real case study
    placeholder: z.boolean().default(false),
  }),
});

const testimonials = defineCollection({
  loader: file('./src/content/testimonials/testimonials.json'),
  schema: z.object({
    id: z.string(),
    quote: z.string(),
    attribution: z.string(),
  }),
});

export const collections = { services, work, testimonials };
