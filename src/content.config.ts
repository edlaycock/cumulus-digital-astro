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
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      services: z.array(z.string()),
      summary: z.string(),
      url: z.string().url().optional(),
      order: z.number(),
      wide: z.boolean().default(false),
      // true → rendered as an explicit "your project here" slot, never as a real case study
      placeholder: z.boolean().default(false),
      // true → excluded from the site (e.g. projects that are still Lorem-Ipsum placeholders on the live site)
      draft: z.boolean().default(false),
      // brand/hero photo; darkened hero-background fallback
      image: image().optional(),
      // finished device-mockup image (laptop/phones) — used as work thumbnail AND case-study hero background
      mockup: image().optional(),
      // extra device-mockup images shown in the case-study body showcase
      gallery: z.array(image()).optional(),
      // raw site screenshots for the CSS DeviceMockup fallback (when no finished mockup)
      screenshotDesktop: image().optional(),
      screenshotMobile: image().optional(),
      // short sector label, e.g. "Construction · Groundworks & Surfacing"
      sector: z.string().optional(),
      // brand palette swatches as hex strings, e.g. ["#E6A91A", "#1A1A1A"]
      brandColors: z.array(z.string()).optional(),
      // structured case-study narrative (Damteq-style)
      challenge: z.string().optional(),
      approach: z.string().optional(),
      result: z.string().optional(),
      metrics: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
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
