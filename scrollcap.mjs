import { chromium } from 'playwright';
import sharp from 'sharp';
const OUT = process.argv[2];
const DUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const MUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const proxy = (ua) => async (route) => {
  const req = route.request();
  if (/\.(mp4|webm|mov)(\?|$)/i.test(req.url())) return route.abort();
  try {
    const r = await fetch(req.url(), { method: req.method(), headers: { 'user-agent': ua, accept: '*/*' }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
    const body = Buffer.from(await r.arrayBuffer());
    const headers = {};
    r.headers.forEach((v, k) => { if (!/^(content-encoding|content-length|transfer-encoding|connection)$/i.test(k)) headers[k] = v; });
    await route.fulfill({ status: r.status, headers, body });
  } catch { await route.abort(); }
};
// site: [slug, url, outDir]  cap heights per device set below
const SITES = [
  ['surrey-contracting', 'https://surreycontracting.co.uk', 'src/assets/work'],
  ['hersham-village', 'https://hershamvillage.co.uk', 'src/assets/work'],
  ['abu-dhabi-holidays', 'https://auh.cumulusdigital.co.uk', 'src/assets/frames'],
];
// desktop: 1440 wide, cap 2280 (≈2.5 screens of a 16:10 frame)
// mobile: 430 wide, cap 2100
const DEV = [
  ['desktop', DUA, { width: 1440, height: 900 }, 1.5, 2280],
  ['mobile', MUA, { width: 430, height: 932 }, 2, 2100],
];
for (const [slug, url, dir] of SITES) {
  for (const [tag, ua, vp, dsf, cap] of DEV) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: dsf, userAgent: ua, isMobile: tag === 'mobile', hasTouch: tag === 'mobile' });
    await ctx.route('**/*', proxy(ua));
    const page = await ctx.newPage();
    try { await page.goto(url, { waitUntil: 'load', timeout: 60000 }); } catch {}
    await page.waitForTimeout(5000);
    for (const sel of ['button:has-text("Accept All")','button:has-text("Accept")','.cky-btn-accept','#cookie_action_close_header','[aria-label="Accept cookies"]']) { try { await page.locator(sel).first().click({timeout:1200}); break; } catch {} }
    await page.waitForTimeout(1000);
    await page.evaluate(() => document.querySelectorAll('.cky-consent-container,.cky-overlay,[class*=cookie],[id*=cookie]').forEach(e=>e.remove()));
    // strip full-viewport fixed overlays and sticky headers so the scroll reads clean
    await page.evaluate(() => { document.querySelectorAll('body *').forEach(el => { const s = getComputedStyle(el); if ((s.position==='fixed'||s.position==='sticky') && parseInt(s.zIndex)>=100) { const r = el.getBoundingClientRect(); if (r.width>innerWidth*0.5) el.style.position='absolute'; } }); });
    // trigger lazy content
    await page.evaluate(async () => { const H=document.body.scrollHeight; for (let y=0;y<Math.min(H,4000);y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,180));} scrollTo(0,0); });
    await page.waitForTimeout(2000);
    const full = await page.screenshot({ type: 'png', fullPage: true });
    const meta = await sharp(full).metadata();
    const h = Math.min(meta.height, cap);
    await sharp(full).extract({ left: 0, top: 0, width: meta.width, height: h })
      .jpeg({ quality: 82 }).toFile(`${dir}/${slug}-scroll-${tag}.jpg`);
    console.log(slug, tag, await page.title(), `${meta.width}x${meta.height} -> ${meta.width}x${h}`);
    await ctx.close();
  }
}
await browser.close();
