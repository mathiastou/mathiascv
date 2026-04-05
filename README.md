# Mathias Tougaard — Personal CV Site

Personal portfolio/CV site for Mathias Tougaard, Digital Product & Business Developer based in Aarhus, Denmark.

**Live repo:** [github.com/mathiastou/mathiascv](https://github.com/mathiastou/mathiascv)

---

## Stack

- **Pure HTML + CSS + Vanilla JS** — no build tools, no frameworks, no npm
- Opens directly as `file://` in a browser, or can be served statically
- Google Fonts: Syne (headings) + Inter (body)

---

## File Structure

```
mathiascv/
├── index.html       — all markup, sections, modals
├── style.css        — all styles, CSS variables, animations, responsive
├── script.js        — all interactivity (draggables, game, music, etc.)
└── assets (images/audio, all in root):
    profileimage2022.jpg                         — hero + sticky profile photo
    frompartyimage.png                           — collage: "Off the clock"
    drivingatjyllandsringing.png                 — collage: "Jyllandsringen"
    padelhalffaceselfiespain.png                 — collage: "Padel, Spain"
    imageofworkshopinbelgiumformore.png          — journey: "Belgium"
    photoofmathiasinmoret-shirtinfrance.png      — journey: "France"
    moreworkshopingreece.png                     — journey: "Greece"
    liverpoollogo.png                            — draggable Liverpool sticker
    more..png                                    — MORE brand logo (Flappy Bird sprite too)
    Frame 32.png                                 — Flappy Bird flap frame
    better faster stronger black.png            — decorative background sticker
    padelballsatcourt.jfif                       — padel card image
    liketorun.png                                — running card image
    ilikebeerhavemademyown.png                   — beer card image
    iplayabitofdrums.png                         — drums card image
    The Emptiness Machine ... Linkin Park.mp3    — music player track
```

---

## Page Sections

| ID | Label | Notes |
|----|-------|-------|
| `#hero` | — | Name, subtitle, scroll cue, profile polaroid |
| `#journey` | The Story So Far | Timeline of experience + journey photos |
| `#work` | Some of the Work | Work cards for BESTSELLER, MORE, BALMOHK |
| `#human` | The Human Part | Cards: running, padel, beer, drums + collage photos |
| `#contact` | Get in Touch | Email form + contact links + coffee CTA |

---

## Interactive Features

### Draggable Elements
All draggable elements use the shared `makeDraggable(el)` function in `script.js`.
- All polaroid photos (hero, journey, collage)
- Guitar icon `🎸` (`#musicIconBtn`)
- Liverpool sticker (`#liverpoolSticker`)
- MORE game button (`#moreLogoBig`)

**How drag works:**
- Elements are moved to `document.body` with `position: absolute` so they scroll with the page
- Grab offset: `ox = clientX - r.left`, `oy = clientY - r.top` (precise grab point)
- After a drag, `el.dataset.skipClick = '1'` prevents the click handler firing on drop
- Mouse + touch events both supported

### Photo Layout (`initPhotoLayout`)
Called on `window.load`. Pulls all polaroids out of their HTML containers and places them as `position: absolute` on `document.body`, alternating left/right sides.

- **RIGHT side:** heroPhoto → Greece (jPhotos[2]) → Belgium (jPhotos[0]) → Liverpool sticker
- **LEFT side:** Off-the-clock (collage[0]) → Guitar → France (jPhotos[1]) → Jyllandsringen (collage[1])
- Cursor-based anti-overlap: reads `el.offsetHeight` after appending with `position:absolute` + width set, so portrait images don't cause overlap
- `EDGE = 18px` from viewport edge, `GAP = 80px` min vertical space between items per side
- Original containers (`.hero-photo`, `.human-collage`, `.journey-photos`) are hidden after placement

### Music Player
- HTML5 `<audio>` element (`#audioPlayer`) — MP3 file loaded lazily
- Guitar `🎸` (`#musicIconBtn`) is a draggable page element; clicking it toggles the mini player and play/pause
- Mini player (`#miniPlayer`) is `position: fixed` bottom-right, hidden until guitar is clicked
- Progress bar updates via `timeupdate` event
- Player auto-hides when track ends

### Flappy Bird Game
- Triggered by clicking the MORE button (`#moreLogoBig`)
- Canvas-based game in `initFlappyMore()` in `script.js`
- Bird sprite: `more..png`, pipe gap increases every 5 pipes
- `game.flap` is a **number** (`-7.5`) — do not overwrite it with a function
- Space / click / tap to flap

### Running Man Animation
- Click the running card (`#runningCard`) → a `🏃` div animates across the bottom of the screen
- CSS animation: `runner-cross` keyframes, auto-removed on `animationend`

### Padel Challenge Modal
- Click the padel card (`#padelCard`) → email form modal opens
- Form action: `https://formspree.io/f/REPLACE_WITH_FORMSPREE_ID` — **needs a real Formspree ID**
- Same placeholder exists in the main contact form

### Liverpool YNWA Animation
- Click the Liverpool sticker (`#liverpoolSticker`) → YNWA text animation plays
- Uses `skipClick` guard to avoid triggering on drag release

### Smoke Trail / Cursor
- Custom cursor dot follows mouse
- Canvas smoke trail renders particles on `mousemove`

### Scroll Animations
- Elements with `.reveal-up` animate in on scroll via `IntersectionObserver`
- `data-delay="0.1"` etc. sets stagger delay

### Section Color Tint
- Each section has `data-section-color="#hex"` — background orbs tint to match as user scrolls

---

## CSS Design Tokens (`style.css`)

```css
--font-head: 'Syne', sans-serif;
--font-body: 'Inter', sans-serif;

--bg:             #0a0a0a;
--surface:        #111111;
--surface-2:      #1a1a1a;
--border:         rgba(255,255,255,0.07);
--text-primary:   #f5f5f5;
--text-secondary: #a0a0a0;
--text-muted:     #555;
--accent:         #f59e0b;

--space-xs:  0.5rem;
--space-sm:  1rem;
--space-md:  1.5rem;
--space-lg:  3rem;
--space-xl:  5rem;
--space-2xl: 7rem;
```

Tablet (`max-width: 1100px`): `--space-2xl: 4rem; --space-xl: 3rem`

---

## Key Patterns & Gotchas

**skipClick pattern** — distinguishes a drag-release from a real click:
```js
// In makeDraggable drop():
if (moved) el.dataset.skipClick = '1';

// In click handler:
el.addEventListener('click', () => {
  if (el.dataset.skipClick) { delete el.dataset.skipClick; return; }
  // ... real click logic
});
```

**Photo height measurement** — always read `el.offsetHeight` AFTER appending to body with `position:absolute` and `width` set, otherwise portrait images return wrong heights and items overlap.

**game.flap is a number** — `game.flap = -7.5` is the flap velocity. Never assign a function to it.

**Hero name** — each name word is a `<span class="name-word">` with `white-space: nowrap` and `font-size: clamp(2.2rem, 8.5vw, 120px)`. JS splits each word into individual letter `<span>`s for the entrance animation — the `white-space: nowrap` prevents mid-word wrapping after that.

**Draggable z-index** — `_photoZ` counter starts at 50, increments on each lift so the last-touched element is always on top.

**Liverpool sticker CSS** — has `position: absolute` via `.sticker` class with `top: 6%; right: 80px` as defaults. These are overridden by inline styles set in `initPhotoLayout`. The sticker has `--rot: -6deg` as an inline CSS variable for its tilt.

---

## To Do / Known Placeholders

- Replace `REPLACE_WITH_FORMSPREE_ID` in both contact forms with a real [Formspree](https://formspree.io) form ID
- The homebrew beer card (`#beerCard`) has no click interaction currently
- The drums card (`#drumsCard`) has no click interaction currently
