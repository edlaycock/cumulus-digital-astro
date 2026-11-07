import type { CollectionEntry } from 'astro:content';

type Work = CollectionEntry<'work'>;

// Case studies are assigned to a sector from their `sector` label, so a new
// case study appears on its sector page without touching this file.
export const SECTORS = {
  travel: {
    name: 'Travel Industry',
    href: '/services/travel-industry/',
    match: /travel/i,
  },
  trades: {
    name: 'Trades & Construction',
    href: '/services/trades/',
    match: /construction|trades|groundworks|surfacing|fencing|landscap|demolition|home improvement/i,
  },
} as const;

export type SectorKey = keyof typeof SECTORS;

export function inSector(work: Work[], key: SectorKey): Work[] {
  return work
    .filter((w) => !w.data.draft && !w.data.placeholder && SECTORS[key].match.test(w.data.sector ?? ''))
    .sort((a, b) => a.data.order - b.data.order);
}

// Industry chips for the /work/ filter. First match wins, so the order
// matters; anything unmatched lands in "Other" and never disappears.
export const INDUSTRIES = [
  { key: 'travel', label: 'Travel', match: SECTORS.travel.match },
  { key: 'trades', label: 'Trades & Construction', match: SECTORS.trades.match },
  { key: 'property', label: 'Property', match: /property/i },
  { key: 'retail', label: 'Retail & E-commerce', match: /retail|e-commerce/i },
  { key: 'professional', label: 'Professional Services', match: /professional|financial/i },
  { key: 'beauty', label: 'Health & Beauty', match: /beauty|health/i },
  { key: 'community', label: 'Community & Education', match: /community|charity|edtech|road safety/i },
  { key: 'leisure', label: 'Hospitality & Arts', match: /hospitality|arts|gallery/i },
] as const;

export function industryOf(sector = ''): string {
  return INDUSTRIES.find((i) => i.match.test(sector))?.key ?? 'other';
}
