# Contact form: spam protection + ContactWithGlobe

Plan written 2026-11-10. Nothing below has been built yet. No source files were changed.

## What we found (short version)

- The form **already has a honeypot** (`_gotcha`, `src/components/ContactForm.astro:48`, hidden by `.form-honeypot` in `src/styles/global.css:1662`). The phishing message got past it, so a honeypot alone is not enough. There is no captcha of any kind.
- The site is **static Astro 5 on Vercel** (no adapter, no `api/` folder, `vercel.json` holds redirects only). There is no server of ours in the path: the browser posts straight to Formspree (`https://formspree.io/f/mwlkajrw`, `src/consts.ts:29`).
- **Formspree verifies Turnstile itself.** Its docs say "Formspree supports Turnstile out of the box": paste the Turnstile secret key into the form's CAPTCHA settings and Formspree checks the `cf-turnstile-response` field on every submission. So no API route, Vercel function or Worker is needed. (Source: help.formspree.io, "Protecting your Forms with Cloudflare Turnstile". Not yet confirmed: whether Ed's Formspree plan includes this setting.)
- **The project has no Tailwind** (`src/lib/utils.ts:2` says so on purpose). All 13 components in `src/components/ui/` use plain CSS classes from `global.css`, relative imports (no `@/` alias) and `framer-motion`. The 21st.dev component is written in Tailwind + shadcn, so it has to be ported, not pasted.
- The site is a **light theme**: white canvas, brand navy `#005b90` (`--cyan`) as the single accent, teal `#5dc2d5` (`--cyan-lt`) for artwork only, Satoshi + Instrument Serif italic.
- No CSP or security headers anywhere, so Turnstile (`challenges.cloudflare.com`) is not blocked today.
- Baseline `npm run build` passes: 64 pages.

## Decisions Ed needs to make

- [ ] **D1. Turnstile route.** Recommended: Formspree's built-in Turnstile check (no server code). Fallback only if Ed's Formspree plan lacks it: add `@astrojs/vercel`, one server route `src/pages/api/contact.ts` that calls Cloudflare `siteverify` then forwards to Formspree, with `TURNSTILE_SECRET_KEY` in Vercel env vars.
- [ ] **D2. Styling route for the new component.** Recommended: port it to plain CSS in `global.css` like every other `ui/` component. Alternative: install Tailwind v4 + shadcn. That adds a second styling system and Tailwind's reset can disturb the existing 4,000-line stylesheet, for one section.
- [ ] **D3. Globe on a white site.** The original is designed for a dark zinc background. Recommended: navy wireframe on the white canvas (teal graticule, navy land outline). Alternative: put the whole section on a dark navy panel.
- [ ] **D4. Fields.** Recommended: Full Name, Company (new, optional), Email, Phone (optional), "What do you need?" dropdown, Message. The original component has no phone or service field; dropping them would lose data Ed gets today.
- [ ] **D5. Third contact link.** The component has three links (Mail, Phone, Headphones/"support"). There is no support line. Recommended: Mail, Phone, and location/hours ("Surrey, Mon-Fri 9am-5:30pm") instead of a made-up support channel.
- [ ] **D6. Confirm the email address.** `src/consts.ts:7` still has `TODO(owner): confirm — live site uses info@, earlier drafts used hello@`.
- [ ] **D7. Does the new section replace the PageHero** ("Let's make your idea happen.") or sit under it? The component brings its own pill + title + description. Recommended: keep the PageHero, drop the component's duplicate title, so there is still one `h1`.

## Phase 0: stop the spam today (Ed, in dashboards, no code)

- [ ] Cloudflare dashboard > Turnstile > Add widget. Hostnames: `cumulusdigital.co.uk`, `www.cumulusdigital.co.uk`, `localhost`, plus the Vercel preview domain if previews should work. Mode: Managed. Copy the **site key** (public) and **secret key** (private).
- [ ] Formspree dashboard > form `mwlkajrw` > Settings > CAPTCHA > Adjust settings > Cloudflare Turnstile > paste the **secret key**. Do NOT switch this on until Phase 1 is live, or every real enquiry will be rejected for a missing token.
- [ ] While there: check what spam filtering (Formshield) level and domain restriction the plan offers, and turn on what is available.
- [ ] Send the **site key** to whoever builds Phase 1. It is public, so it goes in `src/consts.ts` as `TURNSTILE_SITE_KEY` with a `PUBLIC_TURNSTILE_SITE_KEY` override, same pattern as `FORM_ENDPOINT`. The secret key never goes in the repo or in Vercel (Formspree holds it).

Acceptance: both keys exist; secret is saved in Formspree; captcha enforcement still off.

## Phase 1: Turnstile on the existing form (small, ship first)

- [ ] Add `TURNSTILE_SITE_KEY` to `src/consts.ts` and document `PUBLIC_TURNSTILE_SITE_KEY` in `.env.example`.
- [ ] In `ContactForm.astro`: load `https://challenges.cloudflare.com/turnstile/v0/api.js` on the contact page only, add `<div class="cf-turnstile" data-sitekey=...>` above the submit button. The existing `new FormData(form)` already picks up the hidden `cf-turnstile-response` input.
- [ ] Block submit with a clear message if the token is missing; call `turnstile.reset()` after a failed send; surface Formspree's error text when it rejects the captcha.
- [ ] Keep the `_gotcha` honeypot and the existing mailto fallback.
- [ ] Deploy, then Ed enables CAPTCHA enforcement in Formspree.
- [ ] Privacy page: add one line that the form uses Cloudflare Turnstile. Check whether the cookie banner needs to mention it (Turnstile is a security check, not analytics).

Acceptance:
- `npm run build` passes.
- A real submission on production reaches Formspree and lands on `/thank-you/` (GA4 `generate_lead` still fires there).
- A direct `curl -X POST https://formspree.io/f/mwlkajrw` with no token is rejected by Formspree.
- Filling `_gotcha` sends nothing.

## Phase 2: ContactWithGlobe section

Setup
- [ ] Install only what is needed: `d3-geo`, `topojson-client`, `world-atlas`, `lucide-react`, plus types `@types/d3-geo`, `@types/topojson-client`, `topojson-specification`. Use `d3-geo` rather than all of `d3` (the globe only needs the projection and path maths).
- [ ] Do NOT add `motion`: the project already has `framer-motion` 12, which is the same library under its older name. Import from `framer-motion` like the other components.
- [ ] Under D2-recommended, skip `class-variance-authority`, `@radix-ui/react-slot`, `@radix-ui/react-separator` and the shadcn Button: use the site's existing `.btn .btn--primary .btn--lg` and a plain `<hr>`. (If Ed picks Tailwind/shadcn instead: add Tailwind v4 via `@tailwindcss/vite`, a `@/*` alias in `tsconfig.json`, `components.json`, `clsx` + `tailwind-merge` in `cn`, and `src/components/ui/button.tsx`.)
- [ ] Why the `ui` folder matters: 21st.dev/shadcn components import each other from `components/ui/...`. This repo already has `src/components/ui/` with 13 files, so the new file goes there and nothing needs moving.

Build
- [ ] `src/components/ui/contact-with-globe.tsx`: header pill, description, left column (contact links + globe), right column form card. Split the globe into `src/components/ui/wireframe-globe.tsx` to keep each file small.
- [ ] Props from Astro: `email`, `phoneDisplay`, `phoneTel`, `endpoint`, `turnstileSiteKey`, `services` (titles from the `services` collection + "Travel industry project", as today). Real details come from `src/consts.ts`: `info@cumulusdigital.co.uk`, `020 8050 4754` / `+442080504754`.
- [ ] Colours: every rose value becomes `var(--cyan)` `#005b90` (hover `--cyan-deep` `#00486f`); zinc neutrals become the `--lt-*` tokens; teal `--cyan-lt` `#5dc2d5` and `--wash` `#e8f6f9` only for globe lines and tints, never for text on white. Fonts stay Satoshi; card radius and hairline borders follow the existing tokens (no drop shadows, per the stylesheet header).
- [ ] Styles in a new `CONTACT WITH GLOBE` block in `global.css`, reusing `.form-field`, `.form-row`, `.field-error`, `.form-status` so inputs match the rest of the site.
- [ ] Form: field names stay `name`, `email`, `phone`, `service`, `message`, plus new `company`, so Formspree emails keep the same columns. Every input has a `<label htmlFor>`; errors use `aria-invalid` + `aria-describedby`; status line is `role="status" aria-live="polite"`. Port the validation rules and messages from `ContactForm.astro:66-108`.
- [ ] Submission: same flow as today (fetch to Formspree with `Accept: application/json`, button disabled + "Sending…", redirect to `/thank-you/`, error message with the email address, mailto fallback when no endpoint). Include `_gotcha` and the Turnstile token.
- [ ] Turnstile in React: load the script with `?render=explicit`, `turnstile.render()` in an effect, `turnstile.remove()` on unmount, reset after failure.
- [ ] Globe: import `world-atlas/land-110m.json` from the npm package (about 55 KB, bundled and cached with the site) with a dynamic `import()` so it loads after the form is usable. No runtime fetch to cdn.jsdelivr.net: one less third party, no failure if the CDN is slow, nothing to allow if a CSP is added later.
- [ ] Globe is decorative: `aria-hidden="true"`, fixed aspect-ratio box so nothing shifts when it loads, rotation paused when off-screen or the tab is hidden.
- [ ] Reduced motion: `useReducedMotion()` from framer-motion; when set, no fade-ins and the globe is drawn once and does not rotate. Fade-ins otherwise follow CLAUDE.md: opacity + max 24px translate, 0.6-0.8s, `viewport={{ once: true }}`.
- [ ] `src/pages/contact.astro`: replace the `<section class="section">` block (form + aside) with `<ContactWithGlobe client:visible ... />`. Keep `ContactForm.astro` in the repo until the new section has been live and receiving enquiries for a week, then delete it and its unused CSS.
- [ ] `client:visible` means the form is not interactive until the React code loads. Give the server-rendered `<form>` a real `action` + `method="POST"` so a very early submit still reaches Formspree.
- [ ] `design-system/components/contact-form.html` is a snapshot of the old form: rebuild or update the design-system pages if they are still maintained.

Acceptance:
- `npm run build` passes, still 64 pages, no new warnings.
- `/contact/` has exactly one `h1`; all six fields have linked labels; tab order is top to bottom; honeypot is skipped by Tab.
- No requests to `cdn.jsdelivr.net`; the only new third-party host is `challenges.cloudflare.com`.
- No rose/pink or zinc hex values left in the component (`grep -i "rose\|zinc"` returns nothing).
- JS added to `/contact/` is reported (before/after sizes from the build output); other pages unchanged.
- With "reduce motion" on, nothing animates.

## Phase 3: verification

- [ ] `npm run build` and `npm run preview`.
- [ ] Dev submit with Cloudflare's test keys (site key `1x00000000000000000000AA` always passes, `2x00000000000000000000AB` always fails) to check both paths without burning real challenges.
- [ ] One real end-to-end submission on a Vercel preview, confirmed in the Formspree inbox with all six fields present, then `/thank-you/` shown.
- [ ] Honeypot: set `_gotcha` in devtools, submit, confirm no network request.
- [ ] Validation: empty submit focuses the first bad field; bad email shows the email message.
- [ ] Playwright (already a devDependency; Chromium is at `/opt/pw-browsers/chromium` in this environment): screenshots at 1440x900 and 430x932, assert zero console errors and zero failed requests, check the Turnstile iframe is present.
- [ ] Keyboard-only pass and a contrast check on the navy-on-white text.
- [ ] After a week live: compare spam count in Formspree against the week before.

## Risks / open questions

- Formspree plan: the Turnstile setting may be plan-gated. If it is not there, D1 fallback applies (adds a server function and a secret in Vercel).
- Turnstile needs each hostname registered. Vercel preview URLs change per deploy, so previews may need the test keys.
- A determined human spammer passes Turnstile. It stops scripts, not people; Formspree's spam filter is the second layer.
- Globe cost: `d3-geo` + `topojson-client` + the 55 KB map, on the contact page only. If the page gets noticeably heavier, fall back to a pre-drawn static SVG globe.
- CLAUDE.md lists Tailwind and `motion` as defaults for new projects. This existing repo deliberately uses neither, so the plan follows the repo.
