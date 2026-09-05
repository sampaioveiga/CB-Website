# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static one-page prototype website for a fictional dental clinic ("ALMA — Clínica Dentária"), built per `README.md`'s brief: consistent color palette, familiar/professional feel, easy-to-scan services list, intuitive navigation, and a strong visual "wow factor" ("fator uau"). Benchmarked against four reference sites listed in `README.md`.

## Commands

There is no build tool, package manager, linter, or test suite in this repo. It is plain HTML/CSS/JS with no compile step.

- **Run it**: open `index.html` directly in a browser, or serve the folder with any static server (e.g. `npx serve .`) — either works identically since there's no bundling.
- **Edit loop**: change `index.html` / `css/style.css` / `js/main.js` and reload the browser. No watch/build process exists.

## Architecture

Three files, no framework:

- `index.html` — the entire page. All sections live here in source order: header, hero, trust marquee, about, services, differentiators, before/after, testimonials, CTA band, contact, footer. Section `id`s (`#inicio`, `#sobre`, `#servicos`, `#antes-depois`, `#testemunhos`, `#contacto`) are the anchor targets for the nav links — keep them in sync if sections are renamed or reordered.
- `css/style.css` — single stylesheet. Design tokens (palette, radii, shadows) are CSS custom properties in `:root` at the top — change colors there, not by hardcoding hex values in component rules. The chosen palette is "Clínico elevado": off-white base, deep petrol blue (`--primary`) as the institutional color, coral (`--accent`) for CTAs, plus gold (`--gold`) and mint (`--mint`) as secondary accents.
- `js/main.js` — one `DOMContentLoaded` handler containing several independent feature blocks (not split into modules): header scroll/progress-bar state, mobile nav toggle, `IntersectionObserver`-driven scroll-reveal, animated stat counters, the draggable before/after image slider, the testimonial carousel, the (front-end-only, no backend) contact form, and pointer-driven bling effects (magnetic buttons, tilt cards, cursor spotlight) — the latter are gated behind `(pointer: fine)` and `(prefers-reduced-motion: reduce)` media queries.

### Conventions that span files

- **Scroll-reveal**: add `class="reveal" data-reveal` to any element in `index.html` to fade/slide it in on scroll; the JS auto-assigns a stagger index via the `--d` CSS variable, no per-element wiring needed.
- **Animated counters**: give a `<span class="stat-number">` a `data-count="N"` (and `data-decimal="N"` for decimals); the JS finds it via `IntersectionObserver` and animates automatically.
- **Services "bento" grid**: `.services-grid` is a uniform stack on mobile, but at `min-width: 1080px` it becomes an asymmetric CSS Grid where card size/position is driven by `nth-child` position, not by classes. The **first** `.service-card` in the HTML is always the large featured tile — it additionally needs the `.service-card--featured` class and a `.service-card__bg` `<img>` for its background photo. Reordering `<article class="service-card">` elements in the HTML reshapes the whole bento layout, not just that one card.
- **External assets are all CDN-hotlinked**, no local vendoring: Google Fonts (Bodoni Moda for headings, Inter for body) and Font Awesome 6.5.1 via `cdnjs`. Photos are placeholder Unsplash hotlinks (`images.unsplash.com`) tagged in conversation as illustrative only — replace with real clinic photography before this goes to production.
