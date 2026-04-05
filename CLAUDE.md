# Mathias Tougaard — CV/Portfolio Site

Personal CV/portfolio at `C:\Users\mathias.daugaard\mathiascv\`.
Pure HTML + CSS + Vanilla JS. No build tools, no framework. Open `index.html` directly in browser.

---

## Files

```
index.html   — all markup and content
style.css    — design system, layout, animations
script.js    — all interactivity
CLAUDE.md    — this file
```

All images sit in the same folder as these files.

---

## Design System

| Token | Value |
|---|---|
| Background | `#080808` |
| Accent (amber) | `#f59e0b` |
| Secondary accent (indigo) | `#6366f1` |
| Display font | Syne 800 (Google Fonts) |
| Body font | Inter 300–500 (Google Fonts) |
| Glass card | `rgba(255,255,255,0.04)` bg + `backdrop-filter: blur(16px)` |
| Spacing variables | `--space-sm/md/lg/xl/2xl` in `:root` |

CSS custom property `--accent` is `#f59e0b`. Sections set `data-section-color` which JS reads to shift the cursor dot colour as you scroll.

---

## Page Sections (top → bottom)

| ID | Label | Notes |
|---|---|---|
| `#hero` | — | Name, subtitle, scroll cue, profile photo polaroid |
| `#what` | What I Do | 3 glass cards: Systems Thinking, Product Execution, Killing Boring Work |
| `#work` | Some of the Work | 2×2 grid: Media Bank AI, MORE B2B, HYPEDROP, Replenishment |
| `#human` | Outside the Office | 4 clickable cards + polaroid collage + Liverpool sticker |
| `#journey` | The Story So Far | Vertical timeline: BESTSELLER, Lasertryk, BAA education |
| `#contact` | Get in Touch | Links + Formspree contact form + coffee link + footer |

---

## Interactive Features

### Cursor & smoke trail
Custom amber dot cursor + canvas particle smoke trail. Built in `script.js` renderLoop (rAF). Disabled on touch devices via media query.

### Scroll reveals
`.reveal-up` / `.reveal-left` classes. JS sets them hidden on load then fires via `IntersectionObserver`. `data-delay="0.1"` etc. sets stagger delay.

### Parallax orbs
3 fixed blurred orbs (`.orb-1`, `.orb-2`, `.orb-3`) react to mouse position via rAF. Defined in `#bg-orbs` div.

### Sticky profile
`#stickyProfile` — small circular photo that appears top-left after scrolling past the hero. JS adds `.visible` class at scroll threshold.

### Magnetic hover
`.magnetic` elements drift toward the cursor on hover and spring back. Applied to buttons and contact links.

### Hero name animation
JS splits `.name-word` spans into individual `<span>` chars and staggers `opacity + translateY` entrance on load.

### Floating photos (draggable polaroids)
All polaroid photos are moved out of their HTML containers by `initPhotoLayout()` (called on `window.load`) and placed as `position: absolute` on `document.body`. They are then draggable anywhere on the page.

**Critical:** `place()` appends the element to body first, sets `position:absolute` and `width`, then reads `el.offsetHeight` — this gives the actual rendered height. The cursor (per-side tracker) then advances by that height + GAP before placing the next item.

Current layout order (left = 18px from left edge, right = 18px from right edge):

| Right side | Left side |
|---|---|
| Hero photo @ ~80px | Guitar 🎸 @ ~440px |
| Greece @ ~870px | Off the clock @ ~1200px |
| Belgium @ ~1750px | MORE button @ ~1900px |
| Liverpool @ ~2650px | France @ ~2700px |
| — | Jyllandsringen @ ~3500px |

To adjust positions, edit the `place(el, wantedTop, isRight)` calls inside `initPhotoLayout()` in `script.js`. `wantedTop` is the minimum Y — the cursor safety check will push it lower if the item above is taller than expected. Always keep calls in **strict top-to-bottom order per side** so cursor tracking works.

Resize handles: `.resize-handle` div added to each polaroid by `addResizeHandle()`. Visible on hover.

### Guitar 🎸
Placed on left side by `initPhotoLayout`. Made draggable via `makeDraggable`. Click (not drag) toggles the mini music player and plays/pauses the MP3.

`el.dataset.skipClick = '1'` pattern is used on all draggable elements to distinguish a drag-release from a real click.

### Music player
HTML5 `<audio id="audioPlayer">` — source is the Linkin Park MP3 in the folder.
Mini player card (`#miniPlayer`) is hidden by default. Shown when guitar clicked OR drums card clicked.
- `playMusic()` — plays without showing player
- `toggleMusic()` — play/pause
- `setMusicState(bool)` — updates play/pause icon; hides player when track ends

### Drums card (`#drumsCard`)
Click → bouncing musical notes animation + shows mini player + plays music. Text changes on first click.

### Beer card (`#beerCard`)
Click → bouncing musical notes. Text changes on first click.

### Running card (`#runningCard`)
Click → 🏃 emoji animates across screen left-to-right (CSS `runner-cross` keyframe, `scaleX(-1)` flips the emoji to face right).

### Padel card (`#padelCard`)
Click → opens `#padelModal` with a challenge email form (Formspree). Replace `REPLACE_WITH_FORMSPREE_ID` in the form action.

### Liverpool sticker (`#liverpoolSticker`)
Placed on right side by `initPhotoLayout`. Draggable. Click (not drag) triggers YNWA text animation that floats up from the sticker.

### MORE / Flappy Bird button (`#moreLogoBig`)
Placed on left side by `initPhotoLayout`. Draggable. Click opens `#gameModal` with a Flappy Bird game where the bird is the MORE logo (`more..png`). Space/click to flap.

### Coffee link
Bottom of contact section, right-aligned. Links to LinkedIn. Subtle italic text + ☕ icon.

### Contact form
Formspree async POST. Replace `REPLACE_WITH_FORMSPREE_ID` in `index.html` (two places: contact form + padel modal form). Shows loading/success/error states.

---

## Image Files

| File | Used for |
|---|---|
| `profileimage2022.jpg` | Hero polaroid + sticky profile |
| `imageofworkshopinbelgiumformore.png` | Journey — Belgium polaroid |
| `moreworkshopingreece.png` | Journey — Greece polaroid |
| `photoofmathiasinmoret-shirtinfrance.png` | Journey — France polaroid |
| `frompartyimage.png` | Human collage — Off the clock |
| `drivingatjyllandsringing.png` | Human collage — Jyllandsringen |
| `padelballsatcourt.jfif` | Human card — Padel |
| `liketorun.png` | Human card — Running |
| `iplayabitofdrums.png` | Human card — Drums |
| `ilikebeerhavemademyown.png` | Human card — Beer |
| `liverpoollogo.png` | Liverpool sticker |
| `more..png` | Work card logo + Flappy Bird player + MORE button |
| `better faster stronger black.png` | Hero background sticker (decorative) |
| `The Emptiness Machine ... Linkin Park.mp3` | Background music |

---

## Contact Details

- Email: `mathiastougaard99@gmail.com`
- LinkedIn: `https://www.linkedin.com/in/mathias-tougaard-5768aa126/`
- Instagram: `https://www.instagram.com/mathiastougaard/`

---

## Pending Setup

- **Formspree**: Replace `REPLACE_WITH_FORMSPREE_ID` in two form `action` attributes (contact form + padel modal). Get the ID at formspree.io.

---

## Key Gotchas

1. **`place()` order matters** — always add `place()` calls in top-to-bottom page order within each side (left/right) or the cursor-based anti-overlap breaks.
2. **Heights read after append** — `place()` appends to body, sets width, then reads `offsetHeight`. Do not revert this order.
3. **`skipClick` pattern** — every draggable element that also has a click action sets `el.dataset.skipClick = '1'` on drag and checks/clears it at click time. This is on: guitar, Liverpool, MORE button, all polaroids.
4. **`more..png`** has two dots in the filename — be careful with filename references.
5. **MP3 filename** has spaces — encoded as `%20` in the `<source src>` attribute.
6. **`Frame 32.png`** has a space — referenced as `Frame%2032.png` if used anywhere.
7. Touch devices: cursor dot + smoke canvas hidden, `cursor: pointer` restored on interactive elements.
8. `prefers-reduced-motion`: all animations disabled via media query at bottom of `style.css`.
