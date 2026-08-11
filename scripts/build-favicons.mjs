// Generates the full favicon set from public/favicon.svg.
// Run manually after changing the logo: node scripts/build-favicons.mjs
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const PUB = join(ROOT, 'public');
const svg = readFileSync(join(PUB, 'favicon.svg'), 'utf8');

const SIZES = [16, 32, 180, 192, 512];

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage();
const out = {};

for (const size of SIZES) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<body style="margin:0;width:${size}px;height:${size}px">${svg.replace('<svg', `<svg width="${size}" height="${size}"`)}</body>`
  );
  await page.waitForTimeout(120);
  const buf = await page.screenshot({ omitBackground: true });
  out[size] = buf;
  const name = size === 180 ? 'apple-touch-icon.png' : `favicon-${size}x${size}.png`;
  writeFileSync(join(PUB, name), buf);
  console.log(`${name} — ${(buf.length / 1024).toFixed(1)}KB`);
}
await browser.close();

// favicon.ico wrapping the 32px PNG (the ICO format allows embedded PNG data)
const png = out[32];
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image
const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0); // width
entry.writeUInt8(32, 1); // height
entry.writeUInt8(0, 2); // palette
entry.writeUInt8(0, 3); // reserved
entry.writeUInt16LE(1, 4); // colour planes
entry.writeUInt16LE(32, 6); // bits per pixel
entry.writeUInt32LE(png.length, 8);
entry.writeUInt32LE(22, 12); // offset
writeFileSync(join(PUB, 'favicon.ico'), Buffer.concat([header, entry, png]));
console.log(`favicon.ico — ${((22 + png.length) / 1024).toFixed(1)}KB`);

writeFileSync(
  join(PUB, 'site.webmanifest'),
  JSON.stringify(
    {
      name: 'Cumulus Digital',
      short_name: 'Cumulus',
      description: 'Digital marketing and web design in Hersham, Surrey.',
      start_url: '/',
      display: 'standalone',
      background_color: '#141b38',
      theme_color: '#141b38',
      icons: [
        { src: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: '/favicon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2
  ) + '\n'
);
console.log('site.webmanifest');
