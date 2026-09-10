import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cumulusdigital.co.uk',
  // /home-2/ is an unlinked design concept — keep it out of the sitemap
  integrations: [react(), sitemap({ filter: (page) => !page.includes('/home-2') })],
  trailingSlash: 'ignore',
  // Legacy WordPress URLs are 301-redirected in vercel.json — real server
  // redirects carry SEO equity, where Astro's static stubs only meta-refresh.
  // The full map was taken from the live site's own sitemaps before launch.
});
