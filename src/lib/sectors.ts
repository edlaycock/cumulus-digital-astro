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
