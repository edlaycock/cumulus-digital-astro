# Contact form: spam protection + ContactWithGlobe

Plan written 2026-11-10. Ed approved the recommended option for D1-D7 the same day. Phase 1 and Phase 2 were built together on branch `claude/exciting-mayer-ynz47f` (see Review at the bottom). Phase 0 and the production steps are Ed's.

## What we found (short version)

- The form **already has a honeypot** (`_gotcha`, `src/components/ContactForm.astro:48`, hidden by `.form-honeypot` in `src/styles/global.css:1662`). The phishing message got past it, so a honeypot alone is not enough. There is no captcha of any kind.
- The site is **static Astro 5 on Vercel** (no adapter, no `api/` folder, `vercel.json` holds redirects only). There is no server of ours in the path: the browser posts straight to Formspree (`https://formspree.io/f/mwlkajrw`, `src/consts.ts:29`).
- **Formspree verifies Turnstile itself.** Its docs say "Formspree supports Turnstile out of the box": paste the Turnstile secret key into the form's CAPTCHA settings and Formspree checks the `cf-turnstile-response` field on every submission. So no API route, Vercel function or Worker is needed. (Source: help.formspree.io, "Protecting your Forms with Cloudflare Turnstile". Not yet confirmed: whether Ed's Formspree plan includes this setting.)
- **The project has no Tailwind** (`src/lib/utils.ts:2` says so on purpose). All 13 components in `src/components/ui/` use plain CSS classes from `global.css`, relative imports (no `@/` alias) and `framer-motion`. The 21st.dev component is written in Tailwind + shadcn, so it has to be ported, not pasted.
- The site is a **light theme**: white canvas, brand navy `#005b90` (`--cyan`) as the single accent, teal `#5dc2d5` (`--cyan-lt`) for artwork only, Satoshi + Instrument Serif italic.
- No CSP or security headers anywhere, so Turnstile (`challenges.cloudflare.com`) is not blocked today.
- Baseline `npm run build` passes: 64 pages.

## Decisions Ed needs to make

- [x] **D1. Turnstile route.** Recommended: Formspree's built-in Turnstile check (no server code). Fallback only if Ed's Formspree plan lacks it: add `@astrojs/vercel`, one server route `src/pages/api/contact.ts` that calls Cloudflare `siteverify` then forwards to Formspree, with `TURNSTILE_SECRET_KEY` in Vercel env vars.
- [x] **D2. Styling route for the new component.** Recommended: port it to plain CSS in `global.css` like every other `ui/` component. Alternative: install Tailwind v4 + shadcn. That adds a second styling system and Tailwind's reset can disturb the existing 4,000-line stylesheet, for one section.
- [x] **D3. Globe on a white site.** The original is designed for a dark zinc background. Recommended: navy wireframe on the white canvas (teal graticule, navy land outline). Alternative: put the whole section on a dark navy panel.
- [x] **D4. Fields.** Recommended: Full Name, Company (new, optional), Email, Phone (optional), "What do you need?" dropdown, Message. The original component has no phone or service field; dropping them would lose data Ed gets today.
- [x] **D5. Third contact link.** The component has three links (Mail, Phone, Headphones/"support"). There is no support line. Recommended: Mail, Phone, and location/hours ("Surrey, Mon-Fri 9am-5:30pm") instead of a made-up support channel.
- [ ] **D6. Confirm the email address.** `src/consts.ts:7` still has `TODO(owner): confirm — live site uses info@, earlier drafts used hello@`. Not answered; the build keeps `info@` and the TODO is untouched.
- [x] **D7. Does the new section replace the PageHero** ("Let's make your idea happen.") or sit under it? The component brings its own pill + title + description. Recommended: keep the PageHero, drop the component's duplicate title, so there is still one `h1`.

## Phase 0: stop the spam today (Ed, in dashboards, no code)

- [ ] Cloudflare dashboard > Turnstile > Add widget. Hostnames: `cumulusdigital.co.uk`, `www.cumulusdigital.co.uk`, `localhost`, plus the Vercel preview domain if previews should work. Mode: Managed. Copy the **site key** (public) and **secret key** (private).
- [ ] Formspree dashboard > form `mwlkajrw` > Settings > CAPTCHA > Adjust settings > Cloudflare Turnstile > paste the **secret key**. Do NOT switch this on until Phase 1 is live, or every real enquiry will be rejected for a missing token.
- [ ] While there: check what spam filtering (Formshield) level and domain restriction the plan offers, and turn on what is available.
- [ ] Put the **site key** in Vercel as `PUBLIC_TURNSTILE_SITE_KEY` (Production). The code already reads it (`TURNSTILE_SITE_KEY` in `src/consts.ts`, empty by default so no widget shows until it is set). The secret key never goes in the repo or in Vercel (Formspree holds it).

Acceptance: both keys exist; secret is saved in Formspree; captcha enforcement still off.

## Phase 1: Turnstile on the existing form (small, ship first)

- [x] Add `TURNSTILE_SITE_KEY` to `src/consts.ts` and document `PUBLIC_TURNSTILE_SITE_KEY` in `.env.example`.
- [x] Turnstile lives in the new React section instead of `ContactForm.astro` (`src/components/ui/use-turnstile.ts`): the script `api.js?render=explicit` is loaded async/defer on `/contact/` only, and only when the key is set; the widget renders above the submit button and the token is sent as `cf-turnstile-response`.
- [x] Block submit with a clear message if the token is missing; call `turnstile.reset()` after a failed send; surface Formspree's error text when it rejects the captcha.
- [x] Keep the `_gotcha` honeypot and the existing mailto fallback.
- [ ] Deploy, then Ed enables CAPTCHA enforcement in Formspree.
- [ ] Privacy page (left for when the key goes live, so the page never claims a check that is not running): add one line that the form uses Cloudflare Turnstile. Check whether the cookie banner needs to mention it (Turnstile is a security check, not analytics).

Acceptance:
- `npm run build` passes.
- A real submission on production reaches Formspree and lands on `/thank-you/` (GA4 `generate_lead` still fires there).
- A direct `curl -X POST https://formspree.io/f/mwlkajrw` with no token is rejected by Formspree.
- Filling `_gotcha` sends nothing.

## Phase 2: ContactWithGlobe section

Setup
- [x] Install only what is needed: `d3-geo`, `topojson-client`, `world-atlas` (`lucide-react` skipped: three inline SVG icons, matching how the repo already draws icons), plus types `@types/d3-geo`, `@types/topojson-client`, `topojson-specification`. Use `d3-geo` rather than all of `d3` (the globe only needs the projection and path maths).
- [x] Do NOT add `motion`: the project already has `framer-motion` 12, which is the same library under its older name. Import from `framer-motion` like the other components.
- [x] Under D2-recommended, skip `class-variance-authority`, `@radix-ui/react-slot`, `@radix-ui/react-separator` and the shadcn Button: use the site's existing `.btn .btn--primary .btn--lg` and a plain `<hr>`. (If Ed picks Tailwind/shadcn instead: add Tailwind v4 via `@tailwindcss/vite`, a `@/*` alias in `tsconfig.json`, `components.json`, `clsx` + `tailwind-merge` in `cn`, and `src/components/ui/button.tsx`.)
- [x] Why the `ui` folder matters: 21st.dev/shadcn components import each other from `components/ui/...`. This repo already has `src/components/ui/` with 13 files, so the new file goes there and nothing needs moving.

Build
- [x] `src/components/ui/contact-with-globe.tsx`: header pill, description, left column (contact links + globe), right column form card. Split the globe into `src/components/ui/wireframe-globe.tsx` to keep each file small.
- [x] Props from Astro: `email`, `phoneDisplay`, `phoneTel`, `endpoint`, `turnstileSiteKey`, `services` (titles from the `services` collection + "Travel industry project", as today). Real details come from `src/consts.ts`: `info@cumulusdigital.co.uk`, `020 8050 4754` / `+442080504754`.
- [x] Colours: every rose value becomes `var(--cyan)` `#005b90` (hover `--cyan-deep` `#00486f`); zinc neutrals become the `--lt-*` tokens; teal `--cyan-lt` `#5dc2d5` and `--wash` `#e8f6f9` only for globe lines and tints, never for text on white. Fonts stay Satoshi; card radius and hairline borders follow the existing tokens (no drop shadows, per the stylesheet header).
- [x] Styles in a new `CONTACT WITH GLOBE` block in `global.css`, reusing `.form-field`, `.form-row`, `.field-error`, `.form-status` so inputs match the rest of the site.
- [x] Form: field names stay `name`, `email`, `phone`, `service`, `message`, plus new `company`, so Formspree emails keep the same columns. Every input has a `<label htmlFor>`; errors use `aria-invalid` + `aria-describedby`; status line is `role="status" aria-live="polite"`. Port the validation rules and messages from `ContactForm.astro:66-108`.
- [x] Submission: same flow as today (fetch to Formspree with `Accept: application/json`, button disabled + "Sending…", redirect to `/thank-you/`, error message with the email address, mailto fallback when no endpoint). Include `_gotcha` and the Turnstile token.
- [x] Turnstile in React: load the script with `?render=explicit`, `turnstile.render()` in an effect, `turnstile.remove()` on unmount, reset after failure.
- [x] Globe: import `world-atlas/land-110m.json` from the npm package (about 55 KB, bundled and cached with the site) with a dynamic `import()` so it loads after the form is usable. No runtime fetch to cdn.jsdelivr.net: one less third party, no failure if the CDN is slow, nothing to allow if a CSP is added later.
- [x] Globe is decorative: `aria-hidden="true"`, fixed aspect-ratio box so nothing shifts when it loads, rotation paused when off-screen or the tab is hidden.
- [x] Reduced motion: `useReducedMotion()` from framer-motion; when set, no fade-ins and the globe is drawn once and does not rotate. Fade-ins otherwise follow CLAUDE.md: opacity + max 24px translate, 0.6-0.8s, `viewport={{ once: true }}`.
- [x] `src/pages/contact.astro`: replace the `<section class="section">` block (form + aside) with `<ContactWithGlobe client:visible ... />`. Keep `ContactForm.astro` in the repo until the new section has been live and receiving enquiries for a week, then delete it and its unused CSS.
- [x] `client:visible` means the form is not interactive until the React code loads. Give the server-rendered `<form>` a real `action` + `method="POST"` so a very early submit still reaches Formspree.
- [ ] `design-system/components/contact-form.html` is now **stale**: it is generated from markup hard-coded in `design-system/build.mjs:375`, which still describes the old form. Not a trivial change, so left for a separate pass.

Acceptance:
- `npm run build` passes, still 64 pages, no new warnings.
- `/contact/` has exactly one `h1`; all six fields have linked labels; tab order is top to bottom; honeypot is skipped by Tab.
- No requests to `cdn.jsdelivr.net`; the only new third-party host is `challenges.cloudflare.com`.
- No rose/pink or zinc hex values left in the component (`grep -i "rose\|zinc"` returns nothing).
- JS added to `/contact/` is reported (before/after sizes from the build output); other pages unchanged.
- With "reduce motion" on, nothing animates.

## Phase 3: verification

- [x] `npm run build` and `npm run preview`.
- [x] Dev submit with Cloudflare's test keys (site key `1x00000000000000000000AA` always passes, `2x00000000000000000000AB` always fails) to check both paths without burning real challenges.
- [ ] One real end-to-end submission on a Vercel preview, confirmed in the Formspree inbox with all six fields present, then `/thank-you/` shown.
- [x] Honeypot: set `_gotcha` in devtools, submit, confirm no network request.
- [x] Validation: empty submit focuses the first bad field; bad email shows the email message.
- [x] Playwright (already a devDependency; Chromium is at `/opt/pw-browsers/chromium` in this environment): screenshots at 1440x900 and 430x932, assert zero console errors and zero failed requests, check the Turnstile iframe is present.
- [ ] Keyboard-only pass and a contrast check on the navy-on-white text.
- [ ] After a week live: compare spam count in Formspree against the week before.

## Risks / open questions

- Formspree plan: the Turnstile setting may be plan-gated. If it is not there, D1 fallback applies (adds a server function and a secret in Vercel).
- Turnstile needs each hostname registered. Vercel preview URLs change per deploy, so previews may need the test keys.
- A determined human spammer passes Turnstile. It stops scripts, not people; Formspree's spam filter is the second layer.
- Globe cost: `d3-geo` + `topojson-client` + the 55 KB map, on the contact page only. If the page gets noticeably heavier, fall back to a pre-drawn static SVG globe.
- CLAUDE.md lists Tailwind and `motion` as defaults for new projects. This existing repo deliberately uses neither, so the plan follows the repo.


## Review (2026-11-10)

### What was built
- `src/components/ui/contact-with-globe.tsx`: the ported section. Pill, "Get in *touch*" as an `h2` (PageHero keeps the only `h1`), lede, three contact rows (email, phone, "Based in Surrey / Monday–Friday, 9am–5:30pm"), and the "Send a message" card with a dotted rule, Full name + Company row, Email, Phone + "What do you need?" row, Message, Turnstile slot, and the navy `.btn--primary` with an arrow that nudges on hover. Fade-ups (opacity + 24px, 0.7s, once) run after hydration only, via `use-fade-in.ts` and framer-motion's `animate`, and only on blocks still below the fold. The server HTML is always fully visible.
- `src/components/ui/wireframe-globe.tsx`: d3-geo orthographic globe, starts centred on Surrey with a navy pin, turns about once every 90s, drag to rotate, paused off-screen (IntersectionObserver) and in hidden tabs, no auto-rotate with reduced motion. Sphere and graticule are server-rendered; land (`world-atlas/land-110m.json`) and `topojson-client` load as lazy chunks after hydration. Bottom fade is a CSS mask.
- `src/components/ui/use-turnstile.ts`: explicit-render Turnstile hook (load once with a 15s timeout, render `flexible`, or `compact` when the slot is under 300px, reset, remove on unmount; a missing widget id counts as failed).
- `src/components/ui/use-fade-in.ts`: the post-hydration fade-up.
- `src/pages/contact.astro`: PageHero kept; the old form + "Prefer to talk?" aside replaced by `<ContactWithGlobe client:visible ...>`. The aside was removed because the new left column carries all four of its items. Services still come from the `services` collection (plus "Travel industry project").
- `src/consts.ts`: `TURNSTILE_SITE_KEY` from `PUBLIC_TURNSTILE_SITE_KEY`, empty by default. `.env.example` documents it and the test key `1x00000000000000000000AA`.
- `src/styles/global.css`: new `CONTACT WITH GLOBE` block, existing tokens only; reuses `.form-field`, `.form-row`, `.field-error`, `.form-status`, `.form-spinner`, `.eyebrow`, `.section-title`.
- Kept, unused for now: `src/components/ContactForm.astro` and the `.contact-grid` / `.contact-aside` CSS. Delete after a week live.

### Behaviour kept
Same field names plus `company`; same validation rules and messages (blur, live clear, focus first bad field, "Please check the highlighted fields."); honeypot drop before anything else; "Sending…" with disabled button and spinner; `Accept: application/json` POST; `/thank-you/` redirect (GA4 `generate_lead` unchanged); error line with the email address; mailto fallback when no endpoint. Without JS the server-rendered form keeps `action` + `method="POST"` and native `required` checks, and a `<noscript>` line says JavaScript is needed to send the form and gives the email address (native posts will fail once Turnstile is enforced); JS switches to `noValidate` and the custom messages after hydration. Copy changed only to drop em dashes in the new messages.

Turnstile handling: no key, no widget and no request to Cloudflare. With a key: submit is blocked with "Please wait for the security check to finish, then send again." until a token exists (no reset, so a challenge in progress is not thrown away), or "The security check didn't load. Please refresh the page, or email us at …" if the script errors, hangs past 15s, or the widget fails (only then is it reset). After any failed send the widget is reset; a Formspree error mentioning captcha shows "The security check expired…".

### Verification (all observed)
- `npm run build`: passes, 64 pages, no warnings, with and without `PUBLIC_TURNSTILE_SITE_KEY`. Isolated `tsc --strict` on the new files: clean.
- Playwright against `astro preview`, 1440x900 and 390x844, run once per build (no key, and test key `1x00000000000000000000AA`): every check passed. Zero console errors; globe SVG has 4 paths with data (sphere, graticule, land about 48 KB of path data, pin); one `h1`; six fields with linked labels; no horizontal overflow; no requests to cdn.jsdelivr.net; empty submit shows the three messages with `aria-invalid` + `aria-describedby` and focuses Full name; bad email shows the email message; honeypot-filled submit sends nothing; mocked 500 shows the error and re-enables the button; mocked 200 posts `name, company, email, phone, service, message, _gotcha` (+ `cf-turnstile-response` with the test key, real Cloudflare widget showed "Success!") with `Accept: application/json` and lands on `/thank-you/`. Formspree was intercepted with `page.route`; nothing was sent to it.
- Turnstile script blocked: submit shows "The security check didn't load…" and posts nothing.
- No key build: no `.cwg-turnstile` element and no request to challenges.cloudflare.com.
- Reduced motion emulated: land path identical after 1.5s, `data-rotating="false"`, card fully visible. Normal motion: path changes, `data-rotating="true"`. Drag rotates in both.
- JS disabled: form has `action="https://formspree.io/f/mwlkajrw"` `method="POST"`, card opacity 1, sphere/graticule/pin rendered.
- Empty endpoint build: submit opens `mailto:info@cumulusdigital.co.uk?subject=Project enquiry: general` with Company in the body.

### JS cost on /contact/ (gzip -9, after the review fixes)
- Island `contact-with-globe.*.js` (component + d3-geo): 35.9 KB raw / 13.7 KB gzip. With its static imports (React runtime shared with the hero island, plus a 20.5 KB gzip framer-motion core chunk for `animate`): 41.1 KB gzip in total.
- Lazy after hydration: `topojson-client` 6.9 / 2.6 KB, `land-110m` 55.3 / 20.9 KB.
- The section no longer pulls in the full framer-motion `proxy` chunk (40 KB gzip in the first version). Rollup re-split framer-motion into `proxy` + `single-value`, so those hashes changed, but no page loads new code beyond this island.

### Ed's remaining steps
1. Cloudflare > Turnstile > Add widget for `cumulusdigital.co.uk` and `www.cumulusdigital.co.uk` (add `localhost` if testing locally), Managed mode.
2. Formspree > form `mwlkajrw` > Settings > CAPTCHA > Cloudflare Turnstile > paste the **secret** key. Confirm the plan offers this setting; leave enforcement off for now.
3. Vercel > Project > Settings > Environment Variables: `PUBLIC_TURNSTILE_SITE_KEY` = the **site** key, Production.
4. Redeploy (the key is read at build time).
5. Test on production: the widget shows, a real enquiry reaches Formspree with all fields, `/thank-you/` loads.
6. Then turn on Formspree CAPTCHA enforcement and check a `curl -X POST` with no token is rejected.
7. Add the one-line Turnstile mention to the privacy page at the same time.
8. Answer D6 (info@ or hello@).

### Remaining risks
- Vercel preview URLs are not registered hostnames, so the widget errors there unless the test key is set for Preview.
- Once enforcement is on, a visitor without JS (or with Cloudflare blocked) cannot submit; the email link is the fallback.
- Turnstile stops scripts, not people; Formspree's own spam filter is the second layer.
- `design-system/components/contact-form.html` is stale (see Phase 2).

### Review fixes (second pass, 2026-11-10)
An independent review found these; all fixed and re-verified:
1. The four fade wrappers were server-rendered at `opacity:0; translateY(24px)`, so a slow or failed JS bundle left the form invisible. Now nothing is hidden in the HTML (0 `opacity` styles inside the island markup); the fade is applied after hydration only to blocks below the fold. The `<noscript>` style override in `contact.astro` was removed as redundant, as was the reduced-motion `!important` rule.
2. `<noscript>` line under the submit button: "JavaScript is needed to send this form. Please email us at info@cumulusdigital.co.uk instead."
3. 24px horizontal scroll at 320px: the mobile grid is now `minmax(0, 1fr)`, the form rows use `minmax(0, 1fr)` and inputs have `min-width: 0; width: 100%`.
4. Turnstile overflowed narrow cards (slot 274px at 360px, widget 300px): `flexible` when the slot is at least 300px, `compact` below that, with a 145px reserved height under 420px.
5. Missing token no longer resets the widget unless it has failed.
6. Script load times out after 15s; `render()` returning no id marks it failed.
7. Globe drag ignores non-primary pointers and non-left buttons; honeypot early return clears any stale status text.

Re-verified (observed): `npm run build` passes (64 pages, no warnings) with and without the test key; the full Playwright script passes in both builds, plus new checks:
- All `/_astro/*.js` requests aborted at 390x844: pill, details, links, card and globe all have computed opacity 1, and the form still has the Formspree `action` and `POST`.
- Fade still works: the below-fold globe goes 0 -> 1 when scrolled to.
- `scrollWidth` equals the viewport at 320, 360 and 390, with zero console errors.
- Test key: Turnstile fits its slot at 320 (230px slot, compact), 360 (270px, compact) and 390 (300px, flexible).
- Turnstile script aborted, and separately left hanging for 16.5s: both show "The security check didn't load…" and post nothing.
