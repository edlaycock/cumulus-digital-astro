import { defineConfig } from 'astro/config';

// Static, zero-runtime-JS-by-default site. The shader hero ships a single
// small client script (bundled by Astro). No framework integration needed.
export default defineConfig({
  site: 'https://cumulusdigital.co.uk',
});
