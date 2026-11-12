// Shared by build.mjs and build-styleguide.mjs so the two outputs cannot drift apart.

// Same stylesheets as src/layouts/BaseLayout.astro.
export const FONT_STYLESHEETS = [
  'https://api.fontshare.com/v2/css?f%5B%5D=satoshi@400,500,700,900&display=swap',
  'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&display=swap',
];

export const FONT_LINKS = `<link rel="preconnect" href="https://api.fontshare.com">
<link rel="preconnect" href="https://cdn.fontshare.com" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${FONT_STYLESHEETS.map((href) => `<link rel="stylesheet" href="${href}">`).join('\n')}`;

// Static copy of the enquiry card in src/components/ui/contact-with-globe.tsx.
// `p` prefixes the ids so the card can appear more than once per page.
export const contactCard = (p) => `<div class="cwg-card" style="max-width: 640px">
    <h3 class="cwg-card-title">Send a message</h3>
    <hr class="cwg-sep">
    <form class="contact-form cwg-form" onsubmit="return false">
      <div class="form-row">
        <div class="form-field"><label for="${p}-name">Full name <span class="cwg-req" aria-hidden="true">*</span></label><input id="${p}-name" name="name" type="text"></div>
        <div class="form-field"><label for="${p}-company">Company <span class="form-optional">(optional)</span></label><input id="${p}-company" name="company" type="text"></div>
      </div>
      <div class="form-field form-field--invalid"><label for="${p}-email">Email <span class="cwg-req" aria-hidden="true">*</span></label><input id="${p}-email" name="email" type="email" value="jane@" aria-invalid="true" aria-describedby="${p}-email-error"><p class="field-error" id="${p}-email-error">That email doesn't look quite right. Please check it.</p></div>
      <div class="form-row">
        <div class="form-field"><label for="${p}-phone">Phone <span class="form-optional">(optional)</span></label><input id="${p}-phone" name="phone" type="tel"></div>
        <div class="form-field"><label for="${p}-service">What do you need?</label>
          <select id="${p}-service" name="service"><option>Not sure yet</option><option>Web Design</option><option>Branding</option></select>
        </div>
      </div>
      <div class="form-field"><label for="${p}-msg">Tell us about your project <span class="cwg-req" aria-hidden="true">*</span></label><textarea id="${p}-msg" name="message" rows="5"></textarea></div>
      <div class="cwg-turnstile" style="display:flex;align-items:center;justify-content:center;border:1px dashed var(--lt-border);border-radius:8px;font-size:13px;color:var(--lt-muted)">Cloudflare Turnstile widget</div>
      <div class="form-actions">
        <button class="btn btn--primary btn--lg cwg-submit" type="button">
          <span class="form-btn-label">Send message</span>
          <svg class="cwg-arrow" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
        <p class="form-alt"><span class="cwg-req" aria-hidden="true">*</span> Required</p>
      </div>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
  </div>`;
