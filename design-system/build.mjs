// Generates the Claude Design bundle: one self-contained preview page per component group.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const css = readFileSync(join(ROOT, 'src/styles/global.css'), 'utf8');

const FONTS =
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900' +
  '&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

// Preview harness only — never ships to the site.
const HARNESS = `
  body { margin: 0; }
  .ds-stage { padding: 56px 48px; }
  .ds-stage--dark { background: var(--navy-deep); color: var(--paper); }
  .ds-stage--light { background: var(--grey-50); color: var(--lt-text); }
  .ds-stage + .ds-stage { border-top: 1px solid rgba(128,128,150,.18); }
  .ds-label {
    font-family: var(--font-m); font-size: 11px; letter-spacing: .14em;
    text-transform: uppercase; color: var(--lt-muted); margin: 0 0 16px;
  }
  .ds-stage--dark .ds-label { color: var(--muted); }
  .ds-row { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
  .ds-grid { display: grid; gap: 20px; }
  .ds-note { font-size: 13px; color: var(--lt-muted); margin-top: 14px; }
  .ds-swatch {
    border-radius: 12px; overflow: hidden; width: 168px;
    display: flex; flex-direction: column;
    border: 1px solid var(--lt-border); background: var(--white);
  }
  .ds-swatch-chip { display: block; height: 84px; width: 100%; }
  .ds-swatch-meta { display: block; padding: 10px 12px; background: var(--white); }
  .ds-swatch-name { display: block; font-size: 13px; font-weight: 600; color: var(--lt-text); line-height: 1.3; }
  .ds-swatch-hex { display: block; font-family: var(--font-m); font-size: 11px; color: var(--lt-muted); }
  /* scroll-reveal is JS-driven on the site; force visible for static previews */
  [data-reveal], .reveal { opacity: 1 !important; transform: none !important; }
`;

const page = (title, group, body) =>
  `<!-- @dsCard group="${group}" -->
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — Cumulus Digital design system</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>
${css}
/* ---- preview harness ---- */
${HARNESS}
</style>
</head>
<body>
${body}
</body>
</html>
`;

const swatch = (name, hex) =>
  `<div class="ds-swatch"><div class="ds-swatch-chip" style="background:${hex}"></div>
   <div class="ds-swatch-meta"><span class="ds-swatch-name">${name}</span><span class="ds-swatch-hex">${hex}</span></div></div>`;

const COMPONENTS = [
  {
    path: 'foundations/colours.html',
    title: 'Colour palette',
    group: 'Foundations',
    body: `
<section class="ds-stage ds-stage--light">
  <p class="ds-label">Dark palette — hero, footer, case-study heroes</p>
  <div class="ds-row">
    ${swatch('Ink', '#070a14')}${swatch('Navy deep', '#0b1026')}${swatch('Navy', '#141b38')}
    ${swatch('Navy soft', '#1b2547')}${swatch('Slate', '#434960')}
  </div>
</section>
<section class="ds-stage ds-stage--light">
  <p class="ds-label">Accent — one saturated accent, never two</p>
  <div class="ds-row">
    ${swatch('Cyan', '#4fc5d5')}${swatch('Cyan light', '#8fe3ee')}
    ${swatch('Muted', '#97a4c4')}${swatch('Paper', '#eaf2f6')}
  </div>
</section>
<section class="ds-stage ds-stage--light">
  <p class="ds-label">Light palette — main sections</p>
  <div class="ds-row">
    ${swatch('White', '#ffffff')}${swatch('Grey 50', '#f7f8fb')}${swatch('Grey 100', '#eef0f5')}
    ${swatch('Grey 200', '#dde1ec')}${swatch('Border', '#e2e6f0')}
  </div>
</section>
<section class="ds-stage ds-stage--light">
  <p class="ds-label">Text</p>
  <div class="ds-row">
    ${swatch('Text primary', '#141b38')}${swatch('Body', '#434960')}${swatch('Muted', '#6b7594')}
  </div>
  <p class="ds-note">Never pure black or pure white — the darkest ground is #070a14 and the lightest is #f7f8fb.</p>
</section>`,
  },
  {
    path: 'foundations/typography.html',
    title: 'Typography',
    group: 'Foundations',
    body: `
<section class="ds-stage ds-stage--dark">
  <p class="ds-label">Display headline — Montserrat 900, hero only</p>
  <h1 class="headline">It's about making<br>ideas <em class="glow">happen</em>.</h1>
</section>
<section class="ds-stage ds-stage--light">
  <p class="ds-label">Section header — label, title, sub</p>
  <div class="section-header">
    <p class="section-label">What we do</p>
    <h2 class="section-title">Everything you need<br>to grow online.</h2>
    <p class="section-sub">From first impression to lasting impact — strategy, design, code, and marketing that works together seamlessly.</p>
  </div>
</section>
<section class="ds-stage ds-stage--dark">
  <p class="ds-label">Eyebrow &amp; lede</p>
  <p class="eyebrow"><span class="eyebrow-dot"></span> Digital marketing &amp; web · Surrey, UK</p>
  <p class="lede">Bespoke branding, fast hand-built websites and search marketing for ambitious UK businesses — backed by 25&nbsp;years in the travel sector.</p>
</section>
<section class="ds-stage ds-stage--light">
  <p class="ds-label">Body copy — Hanken Grotesk</p>
  <div class="prose" style="max-width:60ch">
    <p>Custom code, not plugin stacks. Every site we build is hand-crafted for speed, security and longevity — so you never outgrow it.</p>
    <p>Most clients see measurable impact within weeks, not quarters.</p>
  </div>
  <p class="ds-note">Headings: Montserrat. Body: Hanken Grotesk. Labels &amp; metadata: JetBrains Mono.</p>
</section>`,
  },
  {
    path: 'components/buttons.html',
    title: 'Buttons',
    group: 'Actions',
    body: `
<section class="ds-stage ds-stage--dark">
  <p class="ds-label">On dark — primary is the only filled button on screen</p>
  <div class="ds-row">
    <a class="btn btn--primary btn--lg" href="#">Start a project →</a>
    <a class="btn btn--ghost btn--lg" href="#">See our work</a>
  </div>
  <div class="ds-row" style="margin-top:20px">
    <a class="btn btn--primary" href="#">Start a project →</a>
    <a class="btn btn--ghost" href="#">See our work</a>
  </div>
</section>
<section class="ds-stage ds-stage--light">
  <p class="ds-label">On light</p>
  <div class="ds-row">
    <a class="btn btn--primary btn--lg" href="#">Discuss your project →</a>
    <a class="btn btn--outline btn--lg" href="#">Visit the live site →</a>
  </div>
  <p class="ds-note">One primary call to action per view. Ghost sits on dark, outline on light.</p>
</section>`,
  },
  {
    path: 'components/work-card.html',
    title: 'Work cards',
    group: 'Cards',
    body: `
<section class="ds-stage ds-stage--light">
  <p class="ds-label">Portfolio grid card — mockup art, client, title, summary</p>
  <ul class="work-grid" role="list">
    <li class="work-card">
      <a class="work-card-inner" href="#">
        <div class="work-cover">
          <div class="work-cover-ph"><span class="work-cover-monogram">CA</span></div>
          <span class="work-cover-scrim"></span>
          <span class="work-cover-chip">castellum.co.uk</span>
        </div>
        <div class="work-card-content">
          <span class="work-tag">Web Design + Web Development</span>
          <span class="work-client">Castellum</span>
          <h3>Portfolio-led website for an award-winning builder</h3>
          <p>An award-winning prime construction company offering a turnkey Design &amp; Build service across London, Surrey and the Home Counties.</p>
          <span class="work-card-cta">View case study →</span>
        </div>
      </a>
    </li>
    <li class="work-card">
      <a class="work-card-inner" href="#">
        <div class="work-cover">
          <div class="work-cover-ph"><span class="work-cover-monogram">RAK</span></div>
          <span class="work-cover-scrim"></span>
          <span class="work-cover-chip">rasalkhaimahholidays.co.uk</span>
        </div>
        <div class="work-card-content">
          <span class="work-tag">Web Design + Web Development</span>
          <span class="work-client">Ras Al Khaimah Holidays</span>
          <h3>Booking website for a luxury Arabian holiday specialist</h3>
          <p>A dedicated holiday-booking site for the UAE's adventure emirate — luxury resorts, live offers and packages.</p>
          <span class="work-card-cta">View case study →</span>
        </div>
      </a>
    </li>
  </ul>
  <p class="ds-note">Covers show device-mockup artwork on the real site; the monogram placeholder is shown here so this preview stays self-contained.</p>
</section>`,
  },
  {
    path: 'components/service-card.html',
    title: 'Service cards',
    group: 'Cards',
    body: `
<section class="ds-stage ds-stage--light">
  <p class="ds-label">Service card — icon tile, title, summary, link</p>
  <ul class="services-grid" role="list">
    <li class="service-card">
      <div class="service-card-tile"><svg viewBox="0 0 48 48" fill="none"><path d="M10 32Q18 10 24 28Q30 46 40 20M20 14L24 8L28 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg></div>
      <div class="service-card-body">
        <h3>Web Design</h3>
        <p>Bespoke, hand-built websites designed around your brand and built for speed, search and conversion.</p>
        <span class="service-link">Learn more →</span>
      </div>
    </li>
    <li class="service-card">
      <div class="service-card-tile"><svg viewBox="0 0 48 48" fill="none"><path d="M16 18L8 24l8 6M32 18l8 6-8 6M28 12l-8 24" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg></div>
      <div class="service-card-body">
        <h3>Web Development</h3>
        <p>Custom code, not plugin stacks — fast, secure and built to last, with a CMS your team can actually run.</p>
        <span class="service-link">Learn more →</span>
      </div>
    </li>
    <li class="service-card">
      <div class="service-card-tile"><svg viewBox="0 0 48 48" fill="none"><circle cx="21" cy="21" r="11" stroke="currentColor" stroke-width="1.6"/><path d="M29 29l10 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></div>
      <div class="service-card-body">
        <h3>Digital Marketing</h3>
        <p>Search, content and campaigns that put your business in front of the people already looking for it.</p>
        <span class="service-link">Learn more →</span>
      </div>
    </li>
  </ul>
</section>`,
  },
  {
    path: 'components/value-card.html',
    title: 'Value cards',
    group: 'Cards',
    body: `
<section class="ds-stage ds-stage--light">
  <p class="ds-label">Numbered principle card</p>
  <div class="values-grid">
    <div class="value-card" data-reveal>
      <span class="value-num">01</span>
      <h3>We build, not bolt together</h3>
      <p>Custom code, not plugin stacks. Every site we build is hand-crafted for speed, security and longevity — so you never outgrow it.</p>
    </div>
    <div class="value-card" data-reveal>
      <span class="value-num">02</span>
      <h3>We know your industry</h3>
      <p>25+ years inside the travel sector means we ask smarter questions and skip the expensive learning curve most agencies charge you for.</p>
    </div>
  </div>
</section>`,
  },
  {
    path: 'components/testimonial.html',
    title: 'Testimonial',
    group: 'Cards',
    body: `
<section class="ds-stage ds-stage--light">
  <p class="ds-label">Testimonial carousel card</p>
  <div class="testi-carousel">
    <div class="testi-carousel-stage">
      <div class="testi-carousel-card">
        <div class="testi-mark">&ldquo;</div>
        <blockquote class="testi-carousel-quote">Working with Ed Laycock and the team at Cumulus Digital to build our new website has been incredibly easy — a service second to none. I have been incredibly impressed by their knowledge, expertise and the speed at which they turned this around.</blockquote>
        <div class="testi-carousel-author"><div class="testi-meta"><strong>Castellum — award-winning construction</strong></div></div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    path: 'components/section-header.html',
    title: 'Section header',
    group: 'Sections',
    body: `
<section class="ds-stage ds-stage--light">
  <p class="ds-label">Standard section header</p>
  <div class="section-header">
    <p class="section-label">Our work</p>
    <h2 class="section-title">Ideas made real.</h2>
    <p class="section-sub">A selection of projects for Surrey businesses and travel brands.</p>
  </div>
</section>
<section class="ds-stage ds-stage--dark">
  <p class="ds-label">Page hero</p>
  <h1 class="page-hero-title">Ideas made <em class="glow">real</em>.</h1>
</section>`,
  },
  {
    path: 'components/numbers-band.html',
    title: 'Numbers band',
    group: 'Sections',
    body: `
<section class="ds-stage ds-stage--dark">
  <p class="ds-label">Stat band — sits over a muted video on the site</p>
  <ul class="numbers-row" role="list">
    <li><strong class="number-val"><span>25</span><span>+</span></strong><span class="number-label">Years travel experience</span></li>
    <li><strong class="number-val"><span>2015</span></strong><span class="number-label">Serving Surrey since</span></li>
    <li><strong class="number-val">Weeks</strong><span class="number-label">Typical time to impact</span></li>
    <li><strong class="number-val">Surrey</strong><span class="number-label">Based in Hersham</span></li>
  </ul>
</section>`,
  },
  {
    path: 'components/case-study-blocks.html',
    title: 'Case study blocks',
    group: 'Case study',
    body: `
<section class="ds-stage ds-stage--light">
  <p class="ds-label">Lede + narrative block</p>
  <div class="cs-body">
    <p class="cs-lede">An award-winning prime construction company offering a turnkey Design &amp; Build service across London, Surrey and the Home Counties.</p>
    <div class="cs-block" data-reveal>
      <h2>The challenge</h2>
      <p>Their reputation rests on the quality of the projects they complete, so they needed a website that led with that finished work rather than generic corporate messaging.</p>
    </div>
    <div class="cs-block cs-swatches-block" data-reveal>
      <h2>Brand palette</h2>
      <ul class="cs-swatches" role="list">
        <li><span class="cs-swatch" style="background:#986a4d"></span><code>#986a4d</code></li>
        <li><span class="cs-swatch" style="background:#373935"></span><code>#373935</code></li>
        <li><span class="cs-swatch" style="background:#cccccc"></span><code>#cccccc</code></li>
      </ul>
    </div>
    <ul class="cs-metrics" role="list">
      <li><strong>2 weeks</strong><span>Turnaround</span></li>
      <li><strong>100%</strong><span>Portfolio-led</span></li>
    </ul>
  </div>
</section>
<section class="ds-stage ds-stage--light">
  <p class="ds-label">Sidebar fact card</p>
  <aside class="cs-aside">
    <div class="cs-card">
      <dl>
        <dt>Client</dt><dd>Castellum</dd>
        <dt>Sector</dt><dd>Construction · Design &amp; Build</dd>
        <dt>What we did</dt><dd>Web Design, Web Development</dd>
        <dt>Live site</dt><dd><a href="#">castellum.co.uk</a></dd>
      </dl>
    </div>
  </aside>
</section>`,
  },
  {
    path: 'components/device-mockup.html',
    title: 'Device mockup',
    group: 'Case study',
    body: `
<section class="ds-stage ds-stage--light">
  <p class="ds-label">Laptop + phone frame (placeholder state)</p>
  <div class="cs-devices">
    <div class="device-mockup device-mockup--pair">
      <div class="device-laptop">
        <div class="device-laptop-screen">
          <div class="device-ph">
            <span class="device-ph-dot"></span>
            <span class="device-ph-url">castellum.co.uk</span>
            <span class="device-ph-note">site preview</span>
          </div>
        </div>
        <div class="device-laptop-base"><span></span></div>
      </div>
    </div>
  </div>
  <p class="ds-note">On the site these frames hold real desktop and iPhone screenshots of each client's website.</p>
</section>`,
  },
  {
    path: 'components/contact-form.html',
    title: 'Contact form',
    group: 'Forms',
    body: `
<section class="ds-stage ds-stage--light">
  <p class="ds-label">Contact form — inputs, select, textarea, submit</p>
  <form class="contact-form">
    <div class="form-row">
      <div class="form-field"><label for="p-name">Name</label><input id="p-name" type="text"></div>
      <div class="form-field"><label for="p-email">Email</label><input id="p-email" type="email"></div>
    </div>
    <div class="form-row">
      <div class="form-field"><label for="p-phone">Phone <span class="form-optional">(optional)</span></label><input id="p-phone" type="tel"></div>
      <div class="form-field"><label for="p-service">What do you need?</label>
        <select id="p-service"><option>Not sure yet</option><option>Web Design</option><option>Branding</option></select>
      </div>
    </div>
    <div class="form-field"><label for="p-msg">Tell us about your project</label><textarea id="p-msg" rows="5"></textarea></div>
    <div class="form-actions">
      <button class="btn btn--primary btn--lg" type="button">Send message →</button>
      <p class="form-alt">Prefer email? <a href="#">info@cumulusdigital.co.uk</a></p>
    </div>
  </form>
</section>`,
  },
  {
    path: 'components/footer.html',
    title: 'Footer',
    group: 'Navigation',
    body: `
<footer class="site-footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <p class="footer-tagline">It's about making ideas happen.</p>
      <p class="footer-address">Burwood Road<br>Hersham, Walton-on-Thames<br>Surrey KT12 4AG</p>
    </div>
    <div class="footer-col">
      <h4>Services</h4>
      <ul class="footer-nav"><li><a href="#">Branding</a></li><li><a href="#">Web Design</a></li><li><a href="#">Web Development</a></li><li><a href="#">Digital Marketing</a></li></ul>
    </div>
    <div class="footer-col">
      <h4>Company</h4>
      <ul class="footer-nav"><li><a href="#">About Us</a></li><li><a href="#">Our Work</a></li><li><a href="#">Contact</a></li></ul>
    </div>
    <div class="footer-col">
      <h4>Contact</h4>
      <ul class="footer-nav"><li><a href="#">020 8050 4754</a></li><li><a href="#">info@cumulusdigital.co.uk</a></li></ul>
    </div>
  </div>
  <div class="footer-base"><div class="container footer-base-inner">
    <p>© 2026 Cumulus Digital Limited. Registered in England &amp; Wales, company no. 09893216.</p>
    <p class="footer-legal"><a href="#">Privacy Policy</a> <a href="#">Terms of Use</a></p>
  </div></div>
</footer>`,
  },
];

for (const c of COMPONENTS) {
  const out = join(ROOT, 'design-system', c.path);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page(c.title, c.group, c.body));
}

// index — overview of the whole system
const groups = [...new Set(COMPONENTS.map((c) => c.group))];
const index = page(
  'Cumulus Digital design system',
  'Overview',
  `<section class="ds-stage ds-stage--dark">
  <p class="eyebrow"><span class="eyebrow-dot"></span> Design system</p>
  <h1 class="page-hero-title">Cumulus Digital.</h1>
  <p class="lede">The colour, type and component set behind cumulusdigital.co.uk — extracted from the live stylesheet so previews match the real site exactly.</p>
</section>
<section class="ds-stage ds-stage--light">
  <div class="section-header"><p class="section-label">Contents</p><h2 class="section-title">${COMPONENTS.length} components, ${groups.length} groups.</h2></div>
  <div class="values-grid">
    ${groups
      .map(
        (g, i) => `<div class="value-card"><span class="value-num">${String(i + 1).padStart(2, '0')}</span>
      <h3>${g}</h3><p>${COMPONENTS.filter((c) => c.group === g).map((c) => c.title).join(' · ')}</p></div>`
      )
      .join('\n    ')}
  </div>
</section>`
);
writeFileSync(join(ROOT, 'design-system/index.html'), index);

console.log(`built ${COMPONENTS.length + 1} files`);
