import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cumulusdigital.co.uk',
  // /home-2/ is an unlinked design concept — keep it out of the sitemap
  integrations: [react(), sitemap({ filter: (page) => !page.includes('/home-2') })],
  trailingSlash: 'ignore',
  // Best-effort mapping from the old WordPress URLs.
  // TODO(owner): confirm exact live-site slugs before launch.
  redirects: {
    '/our-services': '/services',
    '/our-services/website-design': '/services',
    '/services/website-design': '/services',
    '/our-services/website-design/our-pricing': '/services',
    '/our-services/travel-industry-specialists': '/about',
    '/our-past-work': '/work',
    '/about-us': '/about',
    '/contact-us': '/contact',
  },
});
