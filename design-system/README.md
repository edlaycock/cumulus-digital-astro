# Design system bundle

The Cumulus Digital design system, extracted from the live site so it can be
opened in **Claude Design** (claude.ai/design) and iterated on visually.

Everything here is generated — never hand-edit the HTML. Change
`src/styles/global.css` (or the markup in the build scripts) and re-run.

## What's here

| File | Purpose |
|---|---|
| `index.html` | Overview card — the 13 components across 7 groups |
| `foundations/` | Colour palette, typography |
| `components/` | Buttons, cards, sections, case-study parts, form, footer |
| `styleguide.html` | Everything on one page, fonts embedded — for sharing/offline review |

Each preview page opens with a `<!-- @dsCard group="..." -->` marker. Claude
Design reads that first line to file the component under the right group in its
Design System pane, so no manual registration is needed.

## Rebuilding

```bash
node design-system/build.mjs             # the multi-file bundle
node design-system/build-styleguide.mjs  # single page, fonts inlined (needs network)
```

`build.mjs` inlines the whole of `src/styles/global.css` into each preview, so a
specimen can never drift from the real site — if it renders here, it renders
there.

## Notes

- **Fonts.** The bundle pages link Google Fonts (Montserrat / Hanken Grotesk /
  JetBrains Mono), which resolves in any normal browser. `styleguide.html`
  instead embeds the latin subsets as data URIs, so it needs no network at all.
- **Images.** Work covers and device frames use their built-in placeholder
  states rather than real screenshots, which keeps every file under the 256 KB
  per-file limit Claude Design applies.
- **Animation.** The site reveals sections on scroll via JS; the previews force
  `[data-reveal]` visible so specimens render statically.

## Getting this into Claude Design

Pushing directly needs a one-time `/design-login`, which only works in an
interactive terminal — not in a Claude Code web session. Two routes that do work:

1. **From Claude Design** — create a project there and use *Send to Claude Code
   Web*, which seeds the project into a workspace with authorization already
   handled.
2. **From a local terminal** — run `/design-login` once in desktop Claude Code,
   then the bundle can be pushed with the `DesignSync` tool.

Changes made in Claude Design come back the same way: translate them into
`src/styles/global.css` and the Astro components, which stay the source of truth.
