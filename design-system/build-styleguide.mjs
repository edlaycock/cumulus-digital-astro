// Builds a single-page style guide with fonts embedded as data URIs (for publishing/offline review).
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { FONT_STYLESHEETS, contactCard } from './shared.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const get = async (url, asBuffer = false) => {
  const r = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return asBuffer ? Buffer.from(await r.arrayBuffer()) : r.text();
};

const siteCss = readFileSync(join(ROOT, 'src/styles/global.css'), 'utf8');
// Comments and indentation are a fifth of global.css; dropping them keeps this page under Claude Design's 256 KB limit.
const siteCssMin = siteCss.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ \t]+/gm, '').replace(/\n{2,}/g, '\n');
// Only weights the stylesheet asks for: BaseLayout also loads Satoshi 900, but nothing uses it.
const usedWeights = new Set(['400', ...[...siteCss.matchAll(/font-weight:\s*(\d+)/g)].map((m) => m[1])]);

// Embed the faces BaseLayout.astro links (Satoshi, and the plain `latin`
// subset of Instrument Serif italic, enough for English copy).
let fontCss = '';
for (const sheet of FONT_STYLESHEETS) {
  const css = await get(sheet);
  const blocks = [...css.matchAll(/(?:\/\*\s*([\w-]+)\s*\*\/\s*)?@font-face\s*\{([^}]*)\}/g)];
  for (const [, subset, body] of blocks) {
    // Google splits faces into per-script subsets; Fontshare serves one face per weight
    if (sheet.includes('fonts.googleapis.com') && subset !== 'latin') continue;
    const family = body.match(/font-family:\s*'([^']+)'/)?.[1];
    const weight = body.match(/font-weight:\s*(\d+)/)?.[1] ?? '400';
    const style = body.match(/font-style:\s*(\w+)/)?.[1] ?? 'normal';
    if (!usedWeights.has(weight)) continue;
    const range = body.match(/unicode-range:\s*([^;]+);/)?.[1];
    const src = body.match(/url\(['"]?((?:https:)?\/\/[^)'"]+\.woff2)['"]?\)/)?.[1];
    if (!family || !src) throw new Error(`no woff2 in ${sheet}`);
    const buf = await get(src.startsWith('//') ? `https:${src}` : src, true);
    fontCss += `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};font-display:swap;` +
      `src:url(data:font/woff2;base64,${buf.toString('base64')}) format('woff2');${range ? `unicode-range:${range};` : ''}}\n`;
    console.log(`embedded ${family} ${weight} ${style} (${(buf.length / 1024).toFixed(0)}KB)`);
  }
}
if (!fontCss.includes("'Satoshi'") || !fontCss.includes("'Instrument Serif'")) throw new Error('font embedding incomplete');

const caseStudies = readdirSync(join(ROOT, 'src/content/work')).filter((f) => /\.mdx?$/.test(f)).length;

const swatch = (name, hex, note = '') =>
  `<figure class="sg-sw"><span class="sg-sw-chip" style="background:${hex}"></span>
   <figcaption><span class="sg-sw-name">${name}</span><code>${hex}</code>${note ? `<span class="sg-sw-note">${note}</span>` : ''}</figcaption></figure>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cumulus Digital — design system</title>
<style>
${fontCss}
${siteCssMin}

/* ---------- style-guide chrome (sg- prefix; never collides with site classes) ---------- */
:root { --sg-ground: #fafafa; --sg-panel: #ffffff; --sg-rule: #e4e4e8; }
html, body { background: var(--sg-ground); }
body { color: var(--lt-text); font-family: var(--font-b); margin: 0; }
.sg-wrap { max-width: 1120px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 48px); }
.sg-mast {
  background: var(--white); color: var(--lt-text); border-bottom: 1px solid var(--sg-rule);
  padding: clamp(56px, 10vw, 104px) 0 clamp(48px, 8vw, 80px);
}
.sg-mast h1 {
  font-family: var(--font-h); font-weight: 700; color: var(--ink-black);
  font-size: clamp(2.6rem, 7vw, 4.6rem); line-height: .98; letter-spacing: -.055em;
  margin: .3em 0 .4em; text-wrap: balance;
}
.sg-mast h1 em {
  font-family: var(--font-accent); font-style: italic; font-weight: 400;
  font-size: 1.22em; letter-spacing: -.01em; line-height: .9; color: var(--cyan);
}
.sg-kicker {
  font-family: var(--font-m); font-size: .72rem; letter-spacing: .18em;
  text-transform: uppercase; color: var(--cyan); margin: 0;
}
.sg-mast p { color: var(--lt-muted); font-size: clamp(1rem, 2vw, 1.15rem); max-width: 58ch; line-height: 1.6; margin: 0; }
.sg-meta { display: flex; flex-wrap: wrap; gap: 10px 28px; margin-top: 36px; }
.sg-meta div { display: flex; flex-direction: column; gap: 3px; }
.sg-meta dt, .sg-meta .k {
  font-family: var(--font-m); font-size: .66rem; letter-spacing: .16em;
  text-transform: uppercase; color: var(--slate);
}
.sg-meta .v { font-weight: 500; color: var(--lt-text); font-size: .95rem; }

.sg-sec { padding: clamp(48px, 7vw, 80px) 0; border-top: 1px solid var(--sg-rule); }
.sg-sec:first-of-type { border-top: 0; }
.sg-h { font-family: var(--font-h); font-weight: 700; font-size: clamp(1.5rem, 3.2vw, 2rem);
        color: var(--lt-text); margin: 0 0 6px; letter-spacing: -.01em; }
.sg-sub { color: var(--lt-muted); margin: 0 0 32px; max-width: 62ch; line-height: 1.6; }
.sg-eyebrow {
  font-family: var(--font-m); font-size: .68rem; letter-spacing: .18em; text-transform: uppercase;
  color: var(--lt-muted); margin: 0 0 10px;
}

.sg-swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(148px, 1fr)); gap: 14px; margin: 0 0 30px; }
.sg-sw { margin: 0; border: 1px solid var(--sg-rule); border-radius: 12px; overflow: hidden; background: var(--sg-panel); }
.sg-sw-chip { display: block; height: 76px; }
.sg-sw figcaption { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; }
.sg-sw-name { font-size: .85rem; font-weight: 600; color: var(--lt-text); }
.sg-sw code { font-family: var(--font-m); font-size: .72rem; color: var(--lt-muted); }
.sg-sw-note { font-size: .72rem; color: var(--lt-muted); }

/* specimen frames — each component sits on the ground it uses on the real site */
.sg-frame { border: 1px solid var(--sg-rule); border-radius: 16px; overflow: hidden; margin-bottom: 22px; }
.sg-frame-bar {
  display: flex; justify-content: space-between; align-items: center; gap: 16px;
  padding: 9px 14px; background: var(--sg-panel); border-bottom: 1px solid var(--sg-rule);
  font-family: var(--font-m); font-size: .68rem; letter-spacing: .12em;
  text-transform: uppercase; color: var(--lt-muted);
}
.sg-frame-bar .sg-ground-tag { color: var(--lt-muted); opacity: .75; }
.sg-stage { padding: clamp(24px, 4vw, 44px); overflow-x: auto; }
.sg-stage--dark { background: var(--white); }
.sg-stage--light { background: var(--grey-50); }
.sg-stage > * { max-width: 100%; }
.sg-row { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; }

.sg-type-row { display: grid; gap: 6px; padding: 20px 0; border-bottom: 1px dashed var(--sg-rule); }
.sg-type-row:last-child { border-bottom: 0; }
.sg-type-spec { font-family: var(--font-m); font-size: .68rem; color: var(--lt-muted); letter-spacing: .08em; }

.sg-foot { padding: 44px 0 64px; border-top: 1px solid var(--sg-rule); color: var(--lt-muted); font-size: .88rem; }
.sg-foot code { font-family: var(--font-m); font-size: .82rem; color: var(--lt-text); }

/* the site's scroll-reveal is JS-driven; specimens must render statically */
[data-reveal], .reveal { opacity: 1 !important; transform: none !important; }
a { cursor: default; }
:focus-visible { outline: 2px solid var(--cyan); outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
</style>
</head>
<body>

<header class="sg-mast">
  <div class="sg-wrap">
    <p class="sg-kicker">Design system</p>
    <h1>Cumulus <em>Digital</em>.</h1>
    <p>The colour, type and component set behind cumulusdigital.co.uk. Every specimen below is rendered from the site's own stylesheet — what you see here is what ships.</p>
    <div class="sg-meta">
      <div><span class="k">Source</span><span class="v">src/styles/global.css</span></div>
      <div><span class="k">Fonts</span><span class="v">Satoshi · Instrument Serif</span></div>
      <div><span class="k">Case studies live</span><span class="v">${caseStudies}</span></div>
    </div>
  </div>
</header>

<main class="sg-wrap">

  <section class="sg-sec">
    <p class="sg-eyebrow">Foundations</p>
    <h2 class="sg-h">Colour</h2>
    <p class="sg-sub">A white canvas throughout, black display type, and one signal colour. Brand navy is the working accent: it clears contrast on white, so it carries CTAs, links and accent words. Brand teal is artwork, tints and dark grounds only.</p>

    <p class="sg-eyebrow">Signal</p>
    <div class="sg-swatches">
      ${swatch('Brand navy', '#005b90', 'the accent')}${swatch('Navy deep', '#00486f', 'hover')}${swatch('Brand teal', '#5dc2d5', 'artwork only')}${swatch('Wash', '#e8f6f9', 'highlight surface')}
    </div>

    <p class="sg-eyebrow">Surfaces</p>
    <div class="sg-swatches">
      ${swatch('White', '#ffffff', 'canvas + cards')}${swatch('Grey 50', '#fafafa', 'section alternation')}${swatch('Grey 100', '#f5f5f7', 'device wells')}${swatch('Grey 200', '#ebebef')}${swatch('Border', '#e4e4e8', 'hairlines')}
    </div>

    <p class="sg-eyebrow">Ink</p>
    <div class="sg-swatches">
      ${swatch('Ink black', '#000000', 'display only')}${swatch('Text', '#171717')}${swatch('Body', '#3f3f42')}${swatch('Muted', '#5e5e5e')}${swatch('Faint', '#6e6e73')}
    </div>
    <p class="sg-sub" style="margin:0">Depth comes from hairline borders and large radii, never from drop shadows.</p>
  </section>

  <section class="sg-sec">
    <p class="sg-eyebrow">Foundations</p>
    <h2 class="sg-h">Type</h2>
    <p class="sg-sub">Satoshi sets everything: headlines, reading copy and labels. Instrument Serif italic appears only on the highlighted words in a heading, never for body copy or a whole heading.</p>

    <div class="sg-type-row">
      <span class="sg-type-spec">Satoshi 700 · display · -.055em tracking · clamp 2.9–6.5rem on the site</span>
      <h1 class="headline" style="font-size:clamp(2.4rem,6vw,4.2rem);margin:0">Ideas made <em>real</em>.</h1>
    </div>
    <div class="sg-type-row">
      <span class="sg-type-spec">Satoshi 700 · section title · -.045em tracking</span>
      <h2 class="section-title" style="margin:0">Everything you need to <em>grow</em> online.</h2>
    </div>
    <div class="sg-type-row">
      <span class="sg-type-spec">Satoshi 400 · body · 1.55–1.65 line-height · ~65ch</span>
      <div style="max-width:65ch;line-height:1.62;color:var(--lt-body)">Custom code, not plugin stacks. Every site we build is hand-crafted for speed, security and longevity, so you never outgrow it. Most clients see measurable impact within weeks, not quarters.</div>
    </div>
    <div class="sg-type-row">
      <span class="sg-type-spec">Satoshi 500 · section label · navy · sentence case</span>
      <p class="section-label" style="margin:0">What we do</p>
    </div>
  </section>

  <section class="sg-sec">
    <p class="sg-eyebrow">Actions</p>
    <h2 class="sg-h">Buttons</h2>
    <p class="sg-sub">One primary action per view. Ghost and outline share one style: white fill, 1px ink border.</p>

    <div class="sg-frame">
      <div class="sg-frame-bar"><span>Primary + ghost</span><span class="sg-ground-tag">on white</span></div>
      <div class="sg-stage sg-stage--dark">
        <div class="sg-row">
          <a class="btn btn--primary btn--lg" href="#">Start a project →</a>
          <a class="btn btn--ghost btn--lg" href="#">See our work</a>
        </div>
      </div>
    </div>

    <div class="sg-frame">
      <div class="sg-frame-bar"><span>Primary + outline</span><span class="sg-ground-tag">on grey 50</span></div>
      <div class="sg-stage sg-stage--light">
        <div class="sg-row">
          <a class="btn btn--primary btn--lg" href="#">Discuss your project →</a>
          <a class="btn btn--outline btn--lg" href="#">Visit the live site →</a>
        </div>
      </div>
    </div>
  </section>

  <section class="sg-sec">
    <p class="sg-eyebrow">Cards</p>
    <h2 class="sg-h">Work &amp; service cards</h2>
    <p class="sg-sub">The portfolio card is the workhorse of the site — it carries device-mockup artwork, the client name, the project title and a one-line summary. Covers here show the monogram fallback so the specimen stays self-contained.</p>

    <div class="sg-frame">
      <div class="sg-frame-bar"><span>Work card</span><span class="sg-ground-tag">portfolio grid</span></div>
      <div class="sg-stage sg-stage--light">
        <ul class="work-grid" role="list">
          <li class="work-card"><a class="work-card-inner" href="#">
            <div class="work-cover">
              <div class="work-cover-ph"><span class="work-cover-monogram">CA</span></div>
              <span class="work-cover-scrim"></span><span class="work-cover-chip">castellum.co.uk</span>
            </div>
            <div class="work-card-content">
              <span class="work-tag">Web Design + Web Development</span>
              <span class="work-client">Castellum</span>
              <h3>Portfolio-led website for an award-winning builder</h3>
              <p>An award-winning prime construction company offering a turnkey Design &amp; Build service across London, Surrey and the Home Counties.</p>
              <span class="work-card-cta">View case study →</span>
            </div>
          </a></li>
          <li class="work-card"><a class="work-card-inner" href="#">
            <div class="work-cover">
              <div class="work-cover-ph"><span class="work-cover-monogram">RAK</span></div>
              <span class="work-cover-scrim"></span><span class="work-cover-chip">rasalkhaimahholidays.co.uk</span>
            </div>
            <div class="work-card-content">
              <span class="work-tag">Web Design + Web Development</span>
              <span class="work-client">Ras Al Khaimah Holidays</span>
              <h3>Booking website for a luxury Arabian holiday specialist</h3>
              <p>A dedicated holiday-booking site for the UAE's adventure emirate — luxury resorts, live offers and packages.</p>
              <span class="work-card-cta">View case study →</span>
            </div>
          </a></li>
        </ul>
      </div>
    </div>

    <div class="sg-frame">
      <div class="sg-frame-bar"><span>Service card</span><span class="sg-ground-tag">home &amp; services</span></div>
      <div class="sg-stage sg-stage--light">
        <ul class="services-grid" role="list">
          <li class="service-card">
            <div class="service-card-tile"><svg viewBox="0 0 48 48" fill="none"><path d="M10 32Q18 10 24 28Q30 46 40 20M20 14L24 8L28 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <div class="service-card-body"><h3>Web Design</h3><p>Bespoke, hand-built websites designed around your brand and built for speed, search and conversion.</p><span class="service-link">Learn more →</span></div>
          </li>
          <li class="service-card">
            <div class="service-card-tile"><svg viewBox="0 0 48 48" fill="none"><path d="M16 18L8 24l8 6M32 18l8 6-8 6M28 12l-8 24" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <div class="service-card-body"><h3>Web Development</h3><p>Custom code, not plugin stacks — fast, secure and built to last, with a CMS your team can actually run.</p><span class="service-link">Learn more →</span></div>
          </li>
          <li class="service-card">
            <div class="service-card-tile"><svg viewBox="0 0 48 48" fill="none"><circle cx="21" cy="21" r="11" stroke="currentColor" stroke-width="1.6"/><path d="M29 29l10 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></div>
            <div class="service-card-body"><h3>Digital Marketing</h3><p>Search, content and campaigns that put your business in front of the people already looking for it.</p><span class="service-link">Learn more →</span></div>
          </li>
        </ul>
      </div>
    </div>

    <div class="sg-frame">
      <div class="sg-frame-bar"><span>Principle card &amp; testimonial</span><span class="sg-ground-tag">numbered — a real four-step set</span></div>
      <div class="sg-stage sg-stage--light">
        <div class="values-grid">
          <div class="value-card"><span class="value-num">01</span><h3>We build, not bolt together</h3><p>Custom code, not plugin stacks. Every site we build is hand-crafted for speed, security and longevity.</p></div>
          <div class="value-card"><span class="value-num">02</span><h3>We know your industry</h3><p>25+ years inside the travel sector means we ask smarter questions and skip the expensive learning curve.</p></div>
        </div>
        <div class="testi-carousel" style="margin-top:28px"><div class="testi-carousel-stage"><div class="testi-carousel-card">
          <div class="testi-mark">&ldquo;</div>
          <blockquote class="testi-carousel-quote">Working with Ed Laycock and the team at Cumulus Digital to build our new website has been incredibly easy — a service second to none.</blockquote>
          <div class="testi-carousel-author"><div class="testi-meta"><strong>Castellum — award-winning construction</strong></div></div>
        </div></div></div>
      </div>
    </div>
  </section>

  <section class="sg-sec">
    <p class="sg-eyebrow">Sections</p>
    <h2 class="sg-h">Headers &amp; stat band</h2>
    <p class="sg-sub">Every section opens with the same three-part header: a navy label, a Satoshi title with one serif accent word, and a supporting line.</p>

    <div class="sg-frame">
      <div class="sg-frame-bar"><span>Section header</span><span class="sg-ground-tag">on grey 50</span></div>
      <div class="sg-stage sg-stage--light">
        <div class="section-header">
          <p class="section-label">Our work</p>
          <h2 class="section-title">Ideas made real.</h2>
          <p class="section-sub">A selection of projects for Surrey businesses and travel brands.</p>
        </div>
      </div>
    </div>

    <div class="sg-frame">
      <div class="sg-frame-bar"><span>Numbers band</span><span class="sg-ground-tag">styles kept; no page uses this markup today</span></div>
      <div class="sg-stage sg-stage--dark">
        <ul class="numbers-row" role="list">
          <li><strong class="number-val"><span>25</span><span>+</span></strong><span class="number-label">Years travel experience</span></li>
          <li><strong class="number-val"><span>2015</span></strong><span class="number-label">Serving Surrey since</span></li>
          <li><strong class="number-val">Weeks</strong><span class="number-label">Typical time to impact</span></li>
          <li><strong class="number-val">Surrey</strong><span class="number-label">Based in Hersham</span></li>
        </ul>
      </div>
    </div>
  </section>

  <section class="sg-sec">
    <p class="sg-eyebrow">Case study</p>
    <h2 class="sg-h">Case-study blocks</h2>
    <p class="sg-sub">Each of the ${caseStudies} case studies is assembled from these parts: a lede, narrative blocks, the client's brand palette, optional metrics, and a device frame holding real screenshots.</p>

    <div class="sg-frame">
      <div class="sg-frame-bar"><span>Narrative, palette &amp; metrics</span><span class="sg-ground-tag">case-study body</span></div>
      <div class="sg-stage sg-stage--light">
        <div class="cs-body">
          <p class="cs-lede">An award-winning prime construction company offering a turnkey Design &amp; Build service across London, Surrey and the Home Counties.</p>
          <div class="cs-block"><h2>The challenge</h2><p>Their reputation rests on the quality of the projects they complete, so they needed a website that led with that finished work rather than generic corporate messaging.</p></div>
          <div class="cs-block cs-swatches-block"><h2>Brand palette</h2>
            <ul class="cs-swatches" role="list">
              <li><span class="cs-swatch" style="background:#986a4d"></span><code>#986a4d</code></li>
              <li><span class="cs-swatch" style="background:#373935"></span><code>#373935</code></li>
              <li><span class="cs-swatch" style="background:#cccccc"></span><code>#cccccc</code></li>
            </ul>
          </div>
          <ul class="cs-metrics" role="list"><li><strong>2 weeks</strong><span>Turnaround</span></li><li><strong>${caseStudies}</strong><span>Case studies live</span></li></ul>
        </div>
      </div>
    </div>

    <div class="sg-frame">
      <div class="sg-frame-bar"><span>Device frame</span><span class="sg-ground-tag">holds real screenshots on the site</span></div>
      <div class="sg-stage sg-stage--light">
        <div class="cs-devices"><div class="device-mockup">
          <div class="device-laptop">
            <div class="device-laptop-screen"><div class="device-ph">
              <span class="device-ph-dot"></span><span class="device-ph-url">castellum.co.uk</span><span class="device-ph-note">site preview</span>
            </div></div>
            <div class="device-laptop-base"><span></span></div>
          </div>
        </div></div>
      </div>
    </div>
  </section>

  <section class="sg-sec">
    <p class="sg-eyebrow">Forms</p>
    <h2 class="sg-h">Contact form</h2>
    <p class="sg-sub">The enquiry card on /contact/ (src/components/ui/contact-with-globe.tsx): paired fields on desktop, stacked on mobile, required markers, an inline error state, the Turnstile slot and a single primary submit.</p>
    <div class="sg-frame">
      <div class="sg-frame-bar"><span>Contact card</span><span class="sg-ground-tag">on grey 50</span></div>
      <div class="sg-stage sg-stage--light">
        ${contactCard('g')}
      </div>
    </div>
  </section>

  <footer class="sg-foot">
    <p>Generated from <code>src/styles/global.css</code> by <code>design-system/build-styleguide.mjs</code>. The matching multi-file bundle for Claude Design lives in <code>design-system/</code> — one preview page per component group, each tagged with its <code>@dsCard</code> group.</p>
  </footer>
</main>
</body>
</html>
`;

const out = join(ROOT, 'design-system/styleguide.html');
writeFileSync(out, html);
console.log(`\nwrote styleguide.html — ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB`);
