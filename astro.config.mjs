import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://cumulusdigital.co.uk',
  integrations: [react()],
});
