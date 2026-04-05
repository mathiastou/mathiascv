# Optimization Task List — mathiascv

Tasks for an agent to work through. Read README.md first for full project context.
All files are in the same flat directory. No build tools — edit HTML/CSS/JS directly.

---

## Tone — Less Corporate, More Human

The page currently reads too much like a LinkedIn profile. Strip the consulting-speak and make it sound like a real person wrote it. All edits are in `index.html`.

- [x] **Hero subtitle** — change `Digital Product · Business Developer` to something casual like `Makes things work · Aarhus`
- [x] **Hero one-liner** — replace `"I turn messy business problems into clean systems, working at the intersection of product, people, and execution."` with something direct like `"I build things that should exist and fix things that shouldn't. Currently doing that at BESTSELLER."`
- [x] **"What I Do" section label** — change `What I Do` to `What gets me going`
- [x] **Card 01 title + copy** — change `Systems Thinking` to `Connecting the dots`. Rewrite copy: `"Platform migrations, replenishment chains, media pipelines — I like finding the bit where everything gets stuck and doing something about it."`
- [x] **Card 02 title + copy** — change `Product Execution` to `Getting things shipped`. Rewrite copy: `"Ideas are cheap. I'm the person that sits between 'we should do this' and 'it's live' — making sure it actually gets there."`
- [x] **Card 03 copy** — keep `Killing Boring Work` title, loosen the copy: `"If a human is doing something a machine should handle — that's my problem now. Most of the time people didn't even know it could go away."`
- [x] **Contact section label** — change `Get in Touch` to `Say hi`
- [x] **Contact heading** — change `Let's build something.` to `Got something on your mind?`
- [x] **Availability line** — change `Open for conversations · Usually reply within 24h` to `Usually around — reply fast unless I'm on the padel court`
- [x] **Contact form placeholder** — change textarea placeholder from `What's on your mind?` to `What's up?`

---

## Performance

- [x] **Lazy-load all images** — audit `index.html`, ensure every `<img>` except the hero profile has `loading="lazy"`. Hero (`profileimage2022.jpg`) should stay `loading="eager"`.
- [x] **Compress images** — several PNGs are 400–1000KB. Run through a lossless compressor (e.g. pngquant or squoosh). Target: all images under 200KB. Do not alter filenames.
- [x] **Preload hero image** — add `<link rel="preload" as="image" href="profileimage2022.jpg">` in `<head>` to eliminate LCP delay.
- [x] **Defer script** — add `defer` attribute to `<script src="script.js">` so it doesn't block HTML parsing.
- [x] **Font display swap** — add `&display=swap` to the Google Fonts URL if not already present (it is, confirm it stays).

---

## Mobile / Responsive

- [x] **Photo layout on mobile** — `initPhotoLayout()` in `script.js` places photos at absolute pixel positions (80px, 870px, 1750px…). On mobile these collide with section content. Add a guard: if `window.innerWidth < 900` skip `initPhotoLayout()` entirely and leave photos in their HTML containers.
- [x] **Hero name size on small screens** — test on 375px viewport. Current clamp is `clamp(2.2rem, 8.5vw, 120px)`. If TOUGAARD still overflows, reduce the middle value to `7.5vw`.
- [x] **Mini player position on mobile** — `position: fixed; bottom: 24px; right: 24px` may overlap content on narrow screens. Add a media query to reduce padding/min-width below 480px.
- [x] **Flappy Bird canvas size** — canvas is fixed size. Verify it doesn't overflow the modal on screens under 400px wide. Add `max-width: 100%` to the canvas element via CSS if needed.
- [x] **Smoke canvas performance on mobile** — the canvas smoke trail runs on every `mousemove`. Add a check: if `'ontouchstart' in window` skip initialising the smoke canvas entirely.

---

## Accessibility

- [x] **Focus styles** — most interactive elements have no visible focus ring (removed by CSS reset). Add `:focus-visible` outlines to `.contact-link`, `.human-card--clickable`, `#moreLogoBig`, `#musicIconBtn`.
- [x] **Alt text audit** — check every `<img>` has a meaningful `alt`. Decorative images (grain, orbs) should have `alt=""`.
- [x] **Modal focus trap** — when the Flappy Bird modal or padel modal opens, focus should be trapped inside and restored on close. Currently focus is not managed.
- [x] **Reduced motion** — wrap the `runner-cross` animation, smoke canvas, and orb animations in `@media (prefers-reduced-motion: reduce)` and disable/simplify them.

---

## Code Quality

- [x] **Remove unused CSS** — `style.css` is 34KB. Audit for rules that no longer match any HTML (e.g. old `.now-playing`, `.yt-*` YouTube remnants if any remain). Remove them.
- [x] **Consolidate duplicate transitions** — several elements define `transition: transform 0.3s, opacity 0.3s` inline. Move to CSS classes.
- [x] **`initPhotoLayout` wantedTop values** — the hardcoded pixel offsets (80, 870, 1750, etc.) are tied to the current content height. Add a comment block above each group explaining what section they roughly align with, so future edits are easier.
- [x] **`_photoZ` counter** — currently a global. Scope it inside `makeDraggable` closure or a module pattern to avoid accidental overwrite.

---

## Features / Content

- [ ] **Formspree IDs** — replace both `REPLACE_WITH_FORMSPREE_ID` placeholders in `index.html`:
  - Main contact form (`#contactForm`)
  - Padel challenge form (`#padelForm`)
  - Create a free account at formspree.io and use the generated form endpoint.
- [x] **Beer card click** — `#beerCard` has no click interaction. Consider: click opens a short fun fact or a toast notification ("It was a pale ale. 7.2%. Would recommend.").
- [x] **Drums card click** — `#drumsCard` similarly has no interaction. Could trigger a short drum-roll sound or a tooltip.
- [x] **OG / social meta tags** — add `<meta property="og:title">`, `og:description`, `og:image` (use `profileimage2022.jpg`) in `<head>` for better link previews when shared.
- [x] **Favicon** — no favicon is set. Add a simple one (could be the ☕ emoji rendered as SVG) via `<link rel="icon">` in `<head>`.

---

## Bugs / Polish

- [ ] **Photo layout on window resize** — photos are placed once on `window.load`. If the user resizes the window, positions become wrong. Add a debounced `window.addEventListener('resize', ...)` that re-runs `initPhotoLayout()` only if viewport width crosses the 900px mobile threshold.
- [ ] **Scroll restoration** — if the page is refreshed mid-scroll, photos re-initialize at their default positions which may look odd. Acceptable as-is, but worth noting.
- [ ] **MORE button `transform: none`** — `initPhotoLayout` sets `transform: none` on `#moreLogoBig` to cancel any CSS default. Confirm this doesn't break the hover scale effect defined in CSS (`.more-logo-decor:hover`). If hover is broken, use `transform: scale(1)` as the base instead.
- [ ] **Liverpool sticker tilt** — uses `--rot: -6deg` CSS variable. After `initPhotoLayout` appends it to body, verify the variable is still respected (it should be since it's an inline style, but confirm visually).
