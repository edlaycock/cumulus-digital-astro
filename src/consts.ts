// Single source of truth for business details used across the site.

export const SITE_NAME = 'Cumulus Digital';
export const SITE_TAGLINE = "It's about making ideas happen.";
export const SITE_URL = 'https://cumulusdigital.co.uk';

// TODO(owner): confirm — live site uses info@, earlier drafts used hello@
export const EMAIL = 'info@cumulusdigital.co.uk';
export const PHONE_DISPLAY = '020 8050 4754';
export const PHONE_TEL = '+442080504754';

export const ADDRESS = {
  street: 'Burwood Road',
  locality: 'Hersham, Walton-on-Thames',
  region: 'Surrey',
  postcode: 'KT12 4AG',
};

export const COMPANY_LEGAL_NAME = 'Cumulus Digital Limited';
export const COMPANY_NUMBER = '09893216';

// Formspree endpoint, e.g. https://formspree.io/f/abcdwxyz
// TODO(owner): create a free Formspree account and set PUBLIC_FORM_ENDPOINT in .env
export const FORM_ENDPOINT = import.meta.env.PUBLIC_FORM_ENDPOINT ?? '';

export const NAV_LINKS = [
  { href: '/services/', label: 'Services' },
  { href: '/work/', label: 'Our Work' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];
