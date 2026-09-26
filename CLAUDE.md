# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static one-page prototype website for a fictional dental clinic ("ALMA — Clínica Dentária"), built per `README.md`'s brief: consistent color palette, familiar/professional feel, easy-to-scan services list, intuitive navigation, and a strong visual "wow factor" ("fator uau"). Benchmarked against four reference sites listed in `README.md`.

All page copy is Portuguese (pt-PT). Keep it that way — including `alt` text, `aria-label`s and validation messages.

## Commands

There is no build tool, package manager, linter, or test suite in this repo. It is plain HTML/CSS/JS with no compile step.

- **Run it**: open `index.html` directly in a browser, or serve the folder with any static server (e.g. `npx serve .`) — either works identically since there's no bundling.
- **Edit loop**: change `index.html` / `css/style.css` / `js/main.js` and reload the browser. No watch/build process exists.

## Architecture

Three files, no framework:

- `index.html` — the entire page, plus the inline SVG icon sprite. All sections live here in source order: header, hero, trust marquee, about, dentist, services, differentiators, before/after, testimonials, CTA band, contact, footer. Section `id`s (`#inicio`, `#sobre`, `#dentista`, `#servicos`, `#antes-depois`, `#testemunhos`, `#contacto`) are the anchor targets for the nav links **and** the scrollspy — keep them in sync if sections are renamed or reordered.
- `css/style.css` — single stylesheet. Design tokens (palette, radii, shadows) are CSS custom properties in `:root` at the top — change colors there, not by hardcoding hex values in component rules. The chosen palette is "Clínico elevado": off-white base, deep petrol blue (`--primary`) as the institutional color, coral (`--accent`) for CTAs, plus gold (`--gold`) and mint (`--mint`) as secondary accents.
- `js/main.js` — one IIFE (loaded with `defer`, so no `DOMContentLoaded` wrapper) containing several independent feature blocks, not split into modules: header scroll/progress-bar state, mobile nav toggle, scrollspy, `IntersectionObserver`-driven scroll-reveal, animated stat counters, marquee pause, the before/after comparator, the testimonial carousel, service-card → form prefill, the (front-end-only, no backend) contact form with validation, and pointer-driven bling effects (tilt cards, cursor spotlight, custom cursor) — the latter gated behind `(pointer: fine)` and `prefers-reduced-motion`.

### Conventions that span files

- **Icons**: no icon font. `index.html` opens with an inline `<svg class="icon-sprite">` holding one `<symbol>` per icon; markup is `<i class="ico" aria-hidden="true"><svg><use href="#i-tooth"/></svg></i>`. IDs are `i-*` for Font Awesome *solid* icons and `b-*` for *brands*. `.ico` is a 1em square box and the SVG's `preserveAspectRatio` centers the glyph — never set `width: auto` on the inner `<svg>`, a viewBox-only SVG has no intrinsic width and falls back to 300×150. To add an icon, fetch it from `@fortawesome/fontawesome-free@6.5.1/svgs/<solid|brands>/<name>.svg`, strip the outer `<svg>` wrapper and license comment, and add a `<symbol id="…" viewBox="…">` to the sprite.
- **Scroll-reveal**: add `class="reveal" data-reveal` to any element in `index.html` to fade/slide it in on scroll; the JS auto-assigns a stagger index via the `--d` CSS variable, no per-element wiring needed.
- **Animated counters**: give a `<span class="stat-number">` a `data-count="N"` (and `data-decimal="N"` for decimals); the JS finds it via `IntersectionObserver` and animates automatically. The element's static text content should already be the final formatted value, so it reads correctly with JS disabled or reduced motion on. Numbers are formatted with `toLocaleString('pt-PT')` — decimals use a comma.
- **Services "bento" grid**: `.services-grid` is a uniform stack on mobile, but at `min-width: 1080px` it becomes an asymmetric CSS Grid where card size/position is driven by `nth-child` position, not by classes. The **first** `.service-card` in the HTML is always the large featured tile — it additionally needs the `.service-card--featured` class and a `.service-card__bg` `<img>` for its background photo. Reordering `<article class="service-card">` elements in the HTML reshapes the whole bento layout, not just that one card. Rows are `minmax(190px, auto)` so cards grow with their content; don't pin them to a fixed height or the text and the "Pedir informação" link get clipped by the card's `overflow: hidden`. `.service-card` is a column flex container, so fixed-size children need `flex: none` and the absolutely positioned `.service-tag` must **not** be switched to `position: relative` (it would become a flex item and stretch full-width).
- **Service cards prefill the form**: each card's link carries `data-service="…"` whose value must match an `<option value>` in `#service`; clicking it selects that option and focuses the form.
- **Before/after comparator**: the *after* image is the base layer and the *before* image (`#baBefore`) is stacked on top and revealed from the left via `clip-path: inset(0 X% 0 0)`. The slider value is "how much of *Antes* is visible". A transparent `<input type="range">` covers the slider so it works with the keyboard; pointer dragging uses pointer capture. Swapping which layer is clipped silently inverts the labels.
- **Nav breakpoint is 1080px** — `@media (max-width: 1080px)` switches to the hamburger and hides the header phone. Several layout breakpoints share that value; keep them aligned.
- **Motion**: every animation must be reachable by the `@media (prefers-reduced-motion: reduce)` block at the end of the stylesheet. Anything auto-moving for more than five seconds (marquee, carousel) needs a visible pause control (WCAG 2.2.2). Don't add effects that move a click target under the cursor.
- **Form**: validation lives in a `rules` map in `main.js` keyed by field `id`; each validated field needs a matching `<span class="field-error" id="<field-id>-error">` and `aria-describedby`. The RGPD consent checkbox is required. `#website` is a honeypot — keep it off-screen, never `display: none`.
- **External assets**: Google Fonts only (Bodoni Moda for headings, Inter for body). Icons are local (sprite). Photos are placeholder Unsplash hotlinks (`images.unsplash.com`); every photo on the page is distinct — don't reuse one image in two places, and keep `alt` text describing what the photo *actually* shows. Replace with real clinic photography before production.

### Content caveats

The site is a prototype and its content is illustrative: stats, testimonials, certifications, address and phone are invented, and the before/after images are stock photos of two different people, labelled as such on the page. `aggregateRating` is deliberately absent from the JSON-LD — do not add it without real, verifiable reviews. Points requiring a real-world value before launch are marked `TODO (pré-produção)` in `index.html`; `README.md` carries the full pre-production checklist.
