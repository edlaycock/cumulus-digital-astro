// Builds a single-page style guide with fonts embedded as data URIs (for publishing/offline review).
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const FACES = [
  ['Montserrat', 'wght@900', 900],
  ['Montserrat', 'wght@700', 700],
  ['Montserrat', 'wght@600', 600],
  ['Hanken+Grotesk', 'wght@400', 400, 'Hanken Grotesk'],
  ['Hanken+Grotesk', 'wght@600', 600, 'Hanken Grotesk'],
  ['JetBrains+Mono', 'wght@400', 400, 'JetBrains Mono'],
];

const get = async (url, asBuffer = false) => {
  const r = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return asBuffer ? Buffer.from(await r.arrayBuffer()) : r.text();
};

let fontCss = '';
for (const [family, axis, weight, displayName] of FACES) {
  const css = await get(`https://fonts.googleapis.com/css2?family=${family}:${axis}&display=swap`);
  // keep the plain `latin` subset block only — enough for English copy, keeps the page small
  const blocks = css.split('@font-face').slice(1);
  const latin = blocks.find((b) => /\/\* latin \*\//.test(css.slice(0, css.indexOf(b))) || b.includes('U+0000-00FF'));
  const target = latin || blocks[blocks.length - 1];
  const url = target.match(/url\((https:\/\/[^)]+\.woff2)\)/)?.[1];
  if (!url) throw new Error(`no woff2 for ${family} ${axis}`);
  const buf = await get(url, true);
  const name = displayName || family;
  fontCss += `@font-face{font-family:'${name}';font-style:normal;font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${buf.toString('base64')}) format('woff2');}\n`;
  console.log(`embedded ${name} ${weight} — ${(buf.length / 1024).toFixed(0)}KB`);
}

const siteCss = readFileSync(join(ROOT, 'src/styles/global.css'), 'utf8');

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
${siteCss}

/* ---------- style-guide chrome (sg- prefix; never collides with site classes) ---------- */
:root { --sg-ground: #f7f8fb; --sg-panel: #ffffff; --sg-rule: #e2e6f0; }
html, body { background: var(--sg-ground); }
body { color: var(--lt-text); font-family: var(--font-b); margin: 0; }
.sg-wrap { max-width: 1120px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 48px); }
.sg-mast {
  background: var(--ink); color: var(--paper);
  padding: clamp(56px, 10vw, 104px) 0 clamp(48px, 8vw, 80px);
}
.sg-mast h1 {
  font-family: var(--font-h); font-weight: 900; color: var(--paper);
  font-size: clamp(2.6rem, 7vw, 4.6rem); line-height: .98; letter-spacing: -.02em;
  margin: .3em 0 .4em; text-wrap: balance;
}
.sg-mast h1 span { color: var(--cyan); }
.sg-kicker {
  font-family: var(--font-m); font-size: .72rem; letter-spacing: .18em;
  text-transform: uppercase; color: var(--cyan); margin: 0;
}
.sg-mast p { color: var(--muted); font-size: clamp(1rem, 2vw, 1.15rem); max-width: 58ch; line-height: 1.6; margin: 0; }
.sg-meta { display: flex; flex-wrap: wrap; gap: 10px 28px; margin-top: 36px; }
.sg-meta div { display: flex; flex-direction: column; gap: 3px; }
.sg-meta dt, .sg-meta .k {
  font-family: var(--font-m); font-size: .66rem; letter-spacing: .16em;
  text-transform: uppercase; color: var(--slate);
}
.sg-meta .v { font-weight: 600; color: var(--paper); font-size: .95rem; }

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
.sg-stage--dark { background: var(--navy-deep); }
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
    <h1>Cumulus <span>Digital</span>.</h1>
    <p>The colour, type and component set behind cumulusdigital.co.uk. Every specimen below is rendered from the site's own stylesheet — what you see here is what ships.</p>
    <div class="sg-meta">
      <div><span class="k">Source</span><span class="v">src/styles/global.css</span></div>
      <div><span class="k">Components</span><span class="v">13 across 7 groups</span></div>
      <div><span class="k">Case studies live</span><span class="v">28</span></div>
    </div>
  </div>
</header>

<main class="sg-wrap">

  <section class="sg-sec">
    <p class="sg-eyebrow">Foundations</p>
    <h2 class="sg-h">Colour</h2>
    <p class="sg-sub">Two grounds, one accent. Dark carries the hero, footer and case-study heroes; light carries everything between. Cyan is the only accent — it never competes with a second.</p>

    <p class="sg-eyebrow">Dark ground</p>
    <div class="sg-swatches">
      ${swatch('Ink', '#070a14', 'deepest ground')}${swatch('Navy deep', '#0b1026')}${swatch('Navy', '#141b38')}${swatch('Navy soft', '#1b2547')}${swatch('Slate', '#434960')}
    </div>

    <p class="sg-eyebrow">Accent &amp; light text</p>
    <div class="sg-swatches">
      ${swatch('Cyan', '#4fc5d5', 'the accent')}${swatch('Cyan light', '#8fe3ee', 'hover')}${swatch('Muted', '#97a4c4')}${swatch('Paper', '#eaf2f6')}
    </div>

    <p class="sg-eyebrow">Light ground &amp; text</p>
    <div class="sg-swatches">
      ${swatch('White', '#ffffff')}${swatch('Grey 50', '#f7f8fb', 'section ground')}${swatch('Grey 100', '#eef0f5')}${swatch('Border', '#e2e6f0')}${swatch('Text', '#141b38')}${swatch('Body', '#434960')}${swatch('Muted', '#6b7594')}
    </div>
    <p class="sg-sub" style="margin:0">Never pure black or pure white — the darkest ground is #070a14, the lightest #f7f8fb.</p>
  </section>

  <section class="sg-sec">
    <p class="sg-eyebrow">Foundations</p>
    <h2 class="sg-h">Type</h2>
    <p class="sg-sub">Montserrat sets headlines, Hanken Grotesk carries reading copy, and JetBrains Mono handles the small uppercase labels, breadcrumbs and hex codes.</p>

    <div class="sg-type-row">
      <span class="sg-type-spec">Montserrat 900 · display · hero only · clamp 2.6–4.6rem</span>
      <div style="font-family:var(--font-h);font-weight:900;font-size:clamp(2rem,5vw,3.4rem);line-height:1;letter-spacing:-.02em">Ideas made real.</div>
    </div>
    <div class="sg-type-row">
      <span class="sg-type-spec">Montserrat 700 · section title</span>
      <div style="font-family:var(--font-h);font-weight:700;font-size:clamp(1.5rem,3.4vw,2.3rem);line-height:1.1">Everything you need to grow online.</div>
    </div>
    <div class="sg-type-row">
      <span class="sg-type-spec">Hanken Grotesk 400 · body · 1.55–1.65 line-height · ~65ch</span>
      <div style="max-width:65ch;line-height:1.62;color:var(--lt-body)">Custom code, not plugin stacks. Every site we build is hand-crafted for speed, security and longevity — so you never outgrow it. Most clients see measurable impact within weeks, not quarters.</div>
    </div>
    <div class="sg-type-row">
      <span class="sg-type-spec">JetBrains Mono 400 · labels, breadcrumbs, metadata · .18em tracking</span>
      <div style="font-family:var(--font-m);letter-spacing:.18em;text-transform:uppercase;font-size:.78rem;color:var(--lt-muted)">What we do · Our work · Case studies</div>
    </div>
  </section>

  <section class="sg-sec">
    <p class="sg-eyebrow">Actions</p>
    <h2 class="sg-h">Buttons</h2>
    <p class="sg-sub">One primary action per view. Ghost pairs with primary on dark; outline is its counterpart on light.</p>

    <div class="sg-frame">
      <div class="sg-frame-bar"><span>Primary + ghost</span><span class="sg-ground-tag">on ink</span></div>
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
    <p class="sg-sub">Every section opens with the same three-part header: a mono label, a Montserrat title, and a supporting line.</p>

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
      <div class="sg-frame-bar"><span>Numbers band</span><span class="sg-ground-tag">over muted video on the site</span></div>
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
    <p class="sg-sub">Each of the 28 case studies is assembled from these parts: a lede, narrative blocks, the client's brand palette, optional metrics, and a device frame holding real screenshots.</p>

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
          <ul class="cs-metrics" role="list"><li><strong>2 weeks</strong><span>Turnaround</span></li><li><strong>28</strong><span>Case studies live</span></li></ul>
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
    <p class="sg-sub">Paired fields on desktop, stacked on mobile, with a single primary submit and an email fallback beneath it.</p>
    <div class="sg-frame">
      <div class="sg-frame-bar"><span>Contact form</span><span class="sg-ground-tag">on grey 50</span></div>
      <div class="sg-stage sg-stage--light">
        <form class="contact-form" onsubmit="return false">
          <div class="form-row">
            <div class="form-field"><label for="g-name">Name</label><input id="g-name" type="text"></div>
            <div class="form-field"><label for="g-email">Email</label><input id="g-email" type="email"></div>
          </div>
          <div class="form-row">
            <div class="form-field"><label for="g-phone">Phone <span class="form-optional">(optional)</span></label><input id="g-phone" type="tel"></div>
            <div class="form-field"><label for="g-service">What do you need?</label><select id="g-service"><option>Not sure yet</option><option>Web Design</option><option>Branding</option></select></div>
          </div>
          <div class="form-field"><label for="g-msg">Tell us about your project</label><textarea id="g-msg" rows="4"></textarea></div>
          <div class="form-actions"><button class="btn btn--primary btn--lg" type="button">Send message →</button>
            <p class="form-alt">Prefer email? <a href="#">info@cumulusdigital.co.uk</a></p></div>
        </form>
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
