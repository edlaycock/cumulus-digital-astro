import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import auhMac from '../assets/frames/abu-dhabi-holidays-mac.jpg';

// The scrolling strip of client sites, shared by the homepage and the
// services hub so the two cannot drift apart.

// Never in the strip, whatever the collection says.
const EXCLUDE = new Set(['mew-developments']);

// Abu Dhabi Holidays has no work/*-desktop.jpg — its capture lives with the
// device frames — and its case study is still draft, so it is added by hand.
const EXTRA = [
  { slug: 'abu-dhabi-holidays', img: auhMac, client: 'Abu Dhabi Holidays', order: 22 },
];

const shots = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/work/*-desktop.jpg',
  { eager: true }
);
const bySlug = new Map(
  Object.entries(shots).map(([path, mod]) => [
    path.split('/').pop()!.replace('-desktop.jpg', ''),
    mod.default,
  ])
);

/** @param skip extra slugs to leave out, e.g. the client already in the hero */
export async function clientMarquee(skip: string[] = []) {
  const omit = new Set([...EXCLUDE, ...skip]);

  const entries = (await getCollection('work'))
    .filter((w) => !w.data.draft && bySlug.has(w.id) && !omit.has(w.id))
    .map((w) => ({ img: bySlug.get(w.id)!, client: w.data.client, order: w.data.order }))
    .concat(EXTRA.filter((e) => !omit.has(e.slug)))
    .sort((a, b) => a.order - b.order);

  return Promise.all(
    entries.map(async (e) => ({
      src: (await getImage({ src: e.img, width: 680, format: 'webp' })).src,
      alt: `${e.client} website designed by Cumulus Digital`,
    }))
  );
}
