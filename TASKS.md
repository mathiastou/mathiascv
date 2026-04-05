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

- [x] **Formspree IDs** — replace both `REPLACE_WITH_FORMSPREE_ID` placeholders in `index.html`:
  - Main contact form (`#contactForm`)
  - Padel challenge form (`#padelForm`)
  - Create a free account at formspree.io and use the generated form endpoint.
- [x] **Beer card click** — click flies beer emojis + text changes on first click.
- [x] **Drums card click** — click triggers bouncing notes + mini player + plays music.
- [x] **OG / social meta tags** — added og:title, og:description, og:image, Twitter card tags.
- [x] **Favicon** — ☕ emoji SVG favicon added via `<link rel="icon">`.

---

## Bugs / Polish

- [x] **Photo layout on window resize** — photos are placed once on `window.load`. If the user resizes the window, positions become wrong. Add a debounced `window.addEventListener('resize', ...)` that re-runs `initPhotoLayout()` only if viewport width crosses the 900px mobile threshold.
- [x] **Scroll restoration** — acceptable as-is; noted.
- [x] **MORE button `transform: none`** — fixed: added `.is-body-placed` CSS class applied after `place()`. Class sets `transform: scale(1)` / `scale(1.05)` on hover without the broken `translateY(-50%)`.
- [x] **Liverpool sticker tilt** — verified: `--rot: -6deg` survives `place()` (which never touches transform). CSS and makeDraggable both read it correctly.


## IMPORTANT other tasks: 
- [x] reomve the story so far prat- to CV like- they can look that shit up in linkedin. 

- [x] make the some of the work part into things on the page - that are interactive and like easter egg hidden- so when clicked story is told or something - based on interactions of game or whatever you think makes sense. — implemented: click any work card to flip it and reveal a "behind the scenes" story; click "tap to flip back" to return.

- [x] what gets me going is fine - make it more cool just a bit (use only a litlle time on this)

- [x] make the email triggers work — implemented via FormSubmit.co (no account needed; one-time activation email sent to mathiastougaard99@gmail.com on first submission). Both contact form and padel form now deliver real emails.

- [x] and when you can book a padel match it actually also sends a email... — done, same FormSubmit.co endpoint. 


## other imporant other tasks:
- [x] the linkedin id should not be displayed on the page - just linking to linkedin. 

- [x] I like linkedin park - maybe implement that joke somehow when linkin park song is playing — done: mini player shows "…you mean LinkedIn Park? 🤝" in indigo text for 4 seconds whenever the song starts playing.

- [x] the image resizing is not really clear unless you know it is opssible - maybe change the color of the resize button or make it clearer in some other way. — done: resize handle is now an amber dot (brand color) with 25% base opacity, scales up on hover, making it discoverable without being intrusive.

- [x] maybe mix the images around so it just not all images if me in the beginning together with my name - like i know it is my cv page - but it is a lot of me hehe (use only a little time on this) — done: swapped guitar (top-left ~440px) with off-the-clock collage (moved to ~1200px) so the guitar appears first, breaking up the cluster of profile photos at the top.

- [x] a lot of the time the same animation vibe is used for clicking something - like it explodes out it with tthe same image or some icon - maybe adjust try out different cool animations for show off. (use only a little time on this) — done: beer card now uses rising bubbles (slow float up with gentle sway); padel card shows a 🎾 arc before opening modal; sticky profile click now orbits emojis in a spiral ring instead of a burst.

##
- [x] do mobile check again - like does it work on other screen sizes (quick check) — done: fixed game/padel close button unreachable on <480px screens (repositioned inside modal), canvas now uses aspect-ratio for proper scaling, coffee link margin fixed on mobile, archive drawer padding tightened, padel modal padding reduced on small screens, sticky profile shrinks further at 480px.

## 
Based on the important tasks - anything else you need to revisit?

##
- [x] Hide some of the work - so it hidden somewhere to be expandend - remove the follow cursor animation on it — done: last 2 work cards (HYPEDROP + Replenishment) hidden behind a "there's more ↓" toggle; reveals with fade-in. Removed magnetic cursor-follow from all work cards.

- [x] I dont like the animation on the icons in what gets me going - that does work - do someelse - make just something happens when you click the icons or in the area something happens with the icons - differrently in each of the 3 areas. — done: removed hover animation on icons; each card now has a unique click interaction: Card 01 (Connecting the dots) animates an SVG dot-network with dashed amber lines; Card 02 (Getting things shipped) slams a "SHIPPED ✓" rubber-stamp effect; Card 03 (Killing Boring Work) pops up boring-task emojis (📋📊✉️📄) then eliminates them with a "🤖 Automated" badge.

- [x] HIDE HIDKE some of the work dont show some of the 4 things - hide it more and put it somewhere else — done: HYPEDROP and Replenishment removed from the work section entirely (toggle gone too). They now live in a secret slide-up drawer triggered by an almost-invisible `···` button in the footer between the name and location. Cards still flip to reveal behind-the-scenes stories. Drawer closes on backdrop click, × button, or Escape.

- [x] add sounds to more flappy bird game — done: Web Audio API generates flap (descending sine), score (two-tone chime), and die (sawtooth drop) sounds; no external audio files needed.

on mobile view have the guitar placed to the right top side

some of thw work toggle does not work fix it - allign it so it looks properly. Content below the 2 topics should be undisplayed pr default 

have a look at spacing betwwen main non moveable content? is it ok? idk?

on mobile more flappy bird is just placed randomly at the bottom - change it so it centered like content of its own or something- just needs to be a bit clean. 

the logo in the start saying better faster stronger more in black is reaally hard to see. adapt in a way so its not dimmed an visible.