/* =========================================================
   MATHIAS TOUGAARD — script.js
   ========================================================= */

/* -------------------------------------------------------
   FOCUS TRAP — reusable modal accessibility utility
   ------------------------------------------------------- */
function trapFocus(modal) {
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function handler(e) {
    if (e.key !== 'Tab') return;
    const els = Array.from(modal.querySelectorAll(FOCUSABLE)).filter(el => !el.closest('[hidden]') && el.offsetParent !== null);
    if (!els.length) { e.preventDefault(); return; }
    const first = els[0], last = els[els.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  modal.addEventListener('keydown', handler);
  return handler;
}

/* -------------------------------------------------------
   MUSIC — HTML5 Audio (MP3)
   ------------------------------------------------------- */
let isPlaying = false;

function getAudio() { return document.getElementById('audioPlayer'); }

function playMusic() {
  const a = getAudio(); if (!a) return;
  a.play().catch(() => {});
}

function toggleMusic() {
  const a = getAudio(); if (!a) return;
  if (a.paused) a.play().catch(() => {}); else a.pause();
}

function setMusicState(playing) {
  isPlaying = playing;
  const icon = document.getElementById('musicPlayIcon');
  if (icon) icon.textContent = playing ? '⏸' : '▶';
  // Hide player when track ends naturally
  if (!playing) {
    const a = getAudio();
    if (a && a.ended) {
      const player = document.getElementById('miniPlayer');
      if (player) player.hidden = true;
    }
  }
}


/* =========================================================
   MAIN INIT
   ========================================================= */
const TRANS_SPRING = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------
     A: Cursor + Smoke Trail
     ------------------------------------------------------- */
  const dot    = document.querySelector('.cursor-dot');
  const isTouchDevice = 'ontouchstart' in window;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = (isTouchDevice || prefersReducedMotion) ? null : document.getElementById('smokeCanvas');
  const ctx    = canvas ? canvas.getContext('2d') : null;
  let mouseX   = window.innerWidth  / 2;
  let mouseY   = window.innerHeight / 2;
  let particles = [];
  const MAX_PARTICLES = 40;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Spawn only if under the cap — keeps it smooth on slower machines
      if (ctx && particles.length < MAX_PARTICLES) {
        spawnParticle(mouseX, mouseY);
        spawnParticle(mouseX, mouseY);
      }
    });
  }

  function spawnParticle(x, y) {
    particles.push({
      x:       x + (Math.random() - 0.5) * 6,
      y:       y + (Math.random() - 0.5) * 6,
      vx:      (Math.random() - 0.5) * 0.7,
      vy:      -(Math.random() * 1.1 + 0.3),
      size:    Math.random() * 8 + 6,
      opacity: Math.random() * 0.15 + 0.06,
      life:    1,
      decay:   Math.random() * 0.022 + 0.015,
    });
  }

  function renderLoop() {
    if (dot) { dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px'; }

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.life > 0);

      for (const p of particles) {
        p.x    += p.vx;
        p.y    += p.vy;
        p.vy   -= 0.004;
        p.vx   *= 0.98;
        p.size *= 1.01;
        p.life -= p.decay;

        const a = p.opacity * p.life;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        g.addColorStop(0,   `rgba(255,200,80,${a})`);
        g.addColorStop(0.5, `rgba(245,158,11,${a * 0.4})`);
        g.addColorStop(1,   `rgba(245,158,11,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
    }

    requestAnimationFrame(renderLoop);
  }
  renderLoop();

  // Hover state on interactive elements
  document.querySelectorAll('a, button, .magnetic, .polaroid, .work-card, .do-card, .human-card')
    .forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });


  /* -------------------------------------------------------
     B: Scroll Reveals
     ------------------------------------------------------- */
  document.querySelectorAll('.reveal-up, .reveal-left').forEach(el => {
    const delay = parseFloat(el.dataset.delay || 0);
    el.style.transitionDelay = delay + 's';
    el.style.opacity         = '0';
    el.style.transform       = el.classList.contains('reveal-left') ? 'translateX(-40px)' : 'translateY(28px)';
  });

  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'none';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' })
    .observe && document.querySelectorAll('.reveal-up, .reveal-left').forEach(el => {
      new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.style.opacity   = '1';
            e.target.style.transform = 'none';
          }
        });
      }, { threshold: 0.1 }).observe(el);
    });


  /* -------------------------------------------------------
     C: Background Orbs Parallax
     ------------------------------------------------------- */
  const orbs   = [
    { el: document.querySelector('.orb-1'), d: 28 },
    { el: document.querySelector('.orb-2'), d: 18 },
    { el: document.querySelector('.orb-3'), d: 14 },
  ];
  let nx = 0, ny = 0, sy = 0, orbFrame = false;

  if (!prefersReducedMotion) {
    document.addEventListener('mousemove', (e) => {
      nx = (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2);
      ny = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      orbs.forEach(o => {
        if (o.el) o.el.style.transform = `translate(${nx * o.d}px,${ny * o.d + sy * 0.06}px)`;
      });
    });

    window.addEventListener('scroll', () => {
      sy = window.scrollY;
      if (!orbFrame) {
        requestAnimationFrame(() => {
          orbs.forEach(o => {
            if (o.el) o.el.style.transform = `translate(${nx * o.d}px,${ny * o.d + sy * 0.06}px)`;
          });
          orbFrame = false;
        });
        orbFrame = true;
      }
    });
  }


  /* -------------------------------------------------------
     D: Magnetic Buttons
     ------------------------------------------------------- */
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r  = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.28;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.28;
      el.style.transform  = `translate(${dx}px,${dy}px)`;
      el.style.transition = 'transform 0.1s ease';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform  = '';
      el.style.transition = TRANS_SPRING;
    });
  });


  /* -------------------------------------------------------
     E: Hero Name Letter Animation
     ------------------------------------------------------- */
  const nameEl = document.querySelector('.hero-name');
  if (nameEl) {
    nameEl.querySelectorAll('.name-word').forEach((word, wi) => {
      const text = word.textContent;
      word.textContent = '';
      [...text].forEach((ch, ci) => {
        const s = document.createElement('span');
        s.textContent      = ch === ' ' ? '\u00A0' : ch;
        s.style.cssText    = 'display:inline-block;opacity:0;transform:translateY(24px);' +
          `transition:opacity 0.55s cubic-bezier(0.16,1,0.3,1),transform 0.55s cubic-bezier(0.16,1,0.3,1);` +
          `transition-delay:${(wi * 8 + ci) * 0.038}s`;
        word.appendChild(s);
      });
    });
    setTimeout(() => {
      nameEl.querySelectorAll('span').forEach(s => {
        s.style.opacity   = '1';
        s.style.transform = 'none';
      });
    }, 120);
  }


  /* -------------------------------------------------------
     F: Section Cursor Color Shift
     ------------------------------------------------------- */
  document.querySelectorAll('.section[data-section-color]').forEach(sec => {
    new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && dot) {
          const c = e.target.dataset.sectionColor;
          dot.style.background = c;
          dot.style.boxShadow  = `0 0 10px ${c},0 0 20px ${c}40`;
        }
      });
    }, { threshold: 0.3 }).observe(sec);
  });


  /* -------------------------------------------------------
     G: Sticky Profile (scroll in/out)
     ------------------------------------------------------- */
  const stickyProfile = document.getElementById('stickyProfile');
  const heroSection   = document.querySelector('.hero-section');

  window.addEventListener('scroll', () => {
    if (!stickyProfile || !heroSection) return;
    const threshold = heroSection.offsetHeight * 0.55;
    stickyProfile.classList.toggle('visible', window.scrollY > threshold);
  }, { passive: true });

  // Click sticky profile → wiggle + sparkles
  if (stickyProfile) {
    stickyProfile.addEventListener('click', () => {
      stickyProfile.classList.remove('wiggling');
      void stickyProfile.offsetWidth; // reflow to restart animation
      stickyProfile.classList.add('wiggling');
      stickyProfile.addEventListener('animationend', () => {
        stickyProfile.classList.remove('wiggling');
      }, { once: true });

      const r  = stickyProfile.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      flyEmojis(cx, cy, ['✨','⭐','💫','🌟','👋'], 12);
    });
  }


  /* -------------------------------------------------------
     H: Draggable Polaroids + Resize
     ------------------------------------------------------- */
  document.querySelectorAll('.polaroid.draggable').forEach(el => {
    makeDraggable(el);
    addResizeHandle(el);
  });


  /* -------------------------------------------------------
     I: Photo Pop Animation (click only, not after drag)
     ------------------------------------------------------- */
  document.querySelectorAll('.polaroid').forEach(el => {
    el.addEventListener('click', () => {
      if (el.dataset.skipClick) { delete el.dataset.skipClick; return; }
      el.classList.remove('popping');
      void el.offsetWidth;
      el.classList.add('popping');
      el.addEventListener('animationend', () => el.classList.remove('popping'), { once: true });
    });
  });


  /* -------------------------------------------------------
     J: Guitar — draggable page element, click = play + show
     ------------------------------------------------------- */
  const guitarBtn  = document.getElementById('musicIconBtn');
  const miniPlayer = document.getElementById('miniPlayer');
  const audioEl    = getAudio();

  // Make guitar draggable like polaroids (no resize handle)
  if (guitarBtn) makeDraggable(guitarBtn);

  // Guitar click: show player + play; if already showing → hide + pause
  guitarBtn?.addEventListener('click', () => {
    if (guitarBtn.dataset.skipClick) { delete guitarBtn.dataset.skipClick; return; }
    if (miniPlayer.hidden) {
      miniPlayer.hidden = false;
      audioEl?.play().catch(() => {});
    } else {
      miniPlayer.hidden = true;
      audioEl?.pause();
    }
  });

  // Play/pause button inside mini player
  document.getElementById('musicPlayIcon')?.addEventListener('click', toggleMusic);

  // Close button inside mini player
  document.getElementById('mpClose')?.addEventListener('click', () => {
    miniPlayer.hidden = true;
    audioEl?.pause();
  });

  // Progress bar + state sync
  audioEl?.addEventListener('timeupdate', () => {
    if (!audioEl.duration) return;
    const bar = document.getElementById('mpBar');
    if (bar) bar.style.width = (audioEl.currentTime / audioEl.duration * 100) + '%';
  });
  audioEl?.addEventListener('play',  () => setMusicState(true));
  audioEl?.addEventListener('pause', () => setMusicState(false));
  audioEl?.addEventListener('ended', () => setMusicState(false));


  /* -------------------------------------------------------
     K: BEER click — emojis fly + text change
     ------------------------------------------------------- */
  const beerCard = document.getElementById('beerCard');
  const beerText = document.getElementById('beerText');
  let beerDone   = false;

  beerCard?.addEventListener('click', () => {
    const r  = beerCard.getBoundingClientRect();
    flyEmojis(r.left + r.width / 2, r.top + r.height / 2, ['🍺','🍻','🍺'], 12);

    if (!beerDone) {
      beerDone = true;
      beerText.style.transition = 'opacity 0.3s';
      beerText.style.opacity    = '0';
      setTimeout(() => {
        beerText.textContent   = 'I like beer. 🍺';
        beerText.style.opacity = '1';
      }, 300);
    }
  });


  /* -------------------------------------------------------
     K1: PADEL card click — challenge form modal
     ------------------------------------------------------- */
  const padelCard     = document.getElementById('padelCard');
  const padelModal    = document.getElementById('padelModal');
  const padelBackdrop = document.getElementById('padelBackdrop');
  const padelClose    = document.getElementById('padelClose');
  const padelForm     = document.getElementById('padelForm');
  const padelStatus   = document.getElementById('padelStatus');

  let _padelPrevFocus = null;
  let _padelTrapHandler = null;

  function openPadelModal() {
    _padelPrevFocus = document.activeElement;
    padelModal.hidden = false;
    document.body.style.overflow = 'hidden';
    _padelTrapHandler = trapFocus(padelModal);
    (padelClose || padelModal.querySelector('button, [tabindex]'))?.focus();
  }
  function closePadelModal() {
    padelModal.hidden = true;
    document.body.style.overflow = '';
    padelStatus.textContent = '';
    padelStatus.className = 'padel-status';
    if (_padelTrapHandler) { padelModal.removeEventListener('keydown', _padelTrapHandler); _padelTrapHandler = null; }
    _padelPrevFocus?.focus();
  }

  padelCard?.addEventListener('click', openPadelModal);
  padelClose?.addEventListener('click', closePadelModal);
  padelBackdrop?.addEventListener('click', closePadelModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !padelModal.hidden) closePadelModal(); });

  padelForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = padelForm.querySelector('.padel-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    padelStatus.className = 'padel-status';
    padelStatus.textContent = '';
    try {
      const res = await fetch(padelForm.action, {
        method: 'POST',
        body: new FormData(padelForm),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        padelStatus.textContent = '🎾 Challenge sent! I\'ll hit you back.';
        padelStatus.className = 'padel-status success';
        padelForm.reset();
      } else {
        throw new Error();
      }
    } catch {
      padelStatus.textContent = 'Something went wrong — try emailing directly.';
      padelStatus.className = 'padel-status error';
    } finally {
      btn.textContent = 'Send the challenge 🎾';
      btn.disabled = false;
    }
  });


  /* -------------------------------------------------------
     K2: RUNNING card click — guy runs across screen
     ------------------------------------------------------- */
  const runningCard = document.getElementById('runningCard');

  runningCard?.addEventListener('click', () => {
    const runner = document.createElement('div');
    runner.className = 'running-man';
    runner.textContent = '🏃';
    document.body.appendChild(runner);
    runner.addEventListener('animationend', () => runner.remove());
  });


  /* -------------------------------------------------------
     L: DRUMS click — bouncing notes + play music
     ------------------------------------------------------- */
  const drumsCard = document.getElementById('drumsCard');
  const drumsText = document.getElementById('drumsText');
  let drumsDone   = false;

  drumsCard?.addEventListener('click', () => {
    const r  = drumsCard.getBoundingClientRect();
    launchBouncingNotes(r.left + r.width / 2, r.top + r.height / 2, 8);
    const miniPlayer = document.getElementById('miniPlayer');
    if (miniPlayer) miniPlayer.hidden = false;
    playMusic();

    if (!drumsDone) {
      drumsDone = true;
      drumsText.style.transition = 'opacity 0.3s';
      drumsText.style.opacity    = '0';
      setTimeout(() => {
        drumsText.textContent   = 'Started the music too. Check the player below. 🎵';
        drumsText.style.opacity = '1';
      }, 300);
    }
  });


  /* -------------------------------------------------------
     M: Liverpool — draggable + YNWA animation
     ------------------------------------------------------- */
  const liverpoolSticker = document.getElementById('liverpoolSticker');
  if (liverpoolSticker) makeDraggable(liverpoolSticker);

  liverpoolSticker?.addEventListener('click', () => {
    if (liverpoolSticker.dataset.skipClick) { delete liverpoolSticker.dataset.skipClick; return; }
    showYNWA();
  });


  /* -------------------------------------------------------
     N: Timeline dot glow
     ------------------------------------------------------- */
  document.querySelectorAll('.timeline-dot').forEach(d => {
    new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const r = Math.min(e.intersectionRatio * 3, 1);
          d.style.boxShadow =
            `0 0 0 ${3 + r * 4}px rgba(245,158,11,${0.15 + r * 0.2}),` +
            `0 0 ${10 + r * 16}px rgba(245,158,11,${0.2 + r * 0.4})`;
        } else {
          d.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.2)';
        }
      });
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] }).observe(d);
  });


  /* -------------------------------------------------------
     O: Contact Form
     ------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const stat = document.getElementById('formStatus');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      stat.textContent = 'Fill in all fields.';
      stat.className   = 'form-status error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      stat.textContent = 'Need a valid email.';
      stat.className   = 'form-status error';
      return;
    }

    const btn  = form.querySelector('.form-submit');
    const span = btn.querySelector('.submit-text');
    btn.disabled     = true;
    span.textContent = 'Sending...';
    stat.textContent = '';
    stat.className   = 'form-status';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        stat.textContent = '✓ Sent. Talk soon.';
        stat.className   = 'form-status success';
        form.reset();
      } else {
        stat.textContent = 'Something went wrong. Try again.';
        stat.className   = 'form-status error';
      }
    } catch {
      stat.textContent = 'Network error. Try again.';
      stat.className   = 'form-status error';
    } finally {
      btn.disabled     = false;
      span.textContent = 'Send it';
    }
  });


  /* -------------------------------------------------------
     P: Flappy MORE Game
     ------------------------------------------------------- */
  initFlappyMore();

}); // end DOMContentLoaded


/* =========================================================
   UTILITY: Fly Emojis (burst, gravity, fade)
   ========================================================= */
function flyEmojis(cx, cy, emojis, count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.cssText =
        `position:fixed;left:${cx}px;top:${cy}px;` +
        `font-size:${1.2 + Math.random() * 0.8}rem;` +
        'pointer-events:none;z-index:9997;user-select:none;line-height:1;';
      document.body.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 7;
      let vx = Math.cos(angle) * speed, vy = Math.sin(angle) * speed - 3;
      let px = cx, py = cy, frame = 0;
      const max = 60 + Math.random() * 30;

      (function tick() {
        vy += 0.28; px += vx; py += vy; vx *= 0.98; frame++;
        el.style.left      = px + 'px';
        el.style.top       = py + 'px';
        el.style.opacity   = Math.max(0, 1 - frame / max);
        el.style.transform = `rotate(${frame * 10}deg)`;
        if (frame < max) requestAnimationFrame(tick); else el.remove();
      })();
    }, i * 40);
  }
}


/* =========================================================
   UTILITY: Bouncing Music Notes
   ========================================================= */
function launchBouncingNotes(sx, sy, count) {
  const pool = ['🎵','🎶','🎸','🥁','🎤'];

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.textContent = pool[Math.floor(Math.random() * pool.length)];
      const sz = 1.4 + Math.random() * 0.7;
      el.style.cssText =
        `position:fixed;left:${sx}px;top:${sy}px;` +
        `font-size:${sz}rem;pointer-events:none;z-index:9997;user-select:none;`;
      document.body.appendChild(el);

      let px = sx + (Math.random()-0.5)*60;
      let py = sy + (Math.random()-0.5)*60;
      let vx = (Math.random()-0.5)*8, vy = (Math.random()-0.5)*8-2;
      let life = 0, max = 160 + Math.random()*60;
      const pad = sz * 14;

      (function bounce() {
        px += vx; py += vy; life++;
        if (px < 0)                              { px = 0;                         vx = Math.abs(vx); }
        if (px > window.innerWidth  - pad)       { px = window.innerWidth - pad;   vx = -Math.abs(vx); }
        if (py < 0)                              { py = 0;                         vy = Math.abs(vy); }
        if (py > window.innerHeight - pad)       { py = window.innerHeight - pad;  vy = -Math.abs(vy) * 0.85; }
        vx *= 0.995; vy *= 0.995;

        el.style.left      = px + 'px';
        el.style.top       = py + 'px';
        el.style.opacity   = Math.max(0, 1 - life / max);
        el.style.transform = `rotate(${life * 4}deg)`;
        if (life < max) requestAnimationFrame(bounce); else el.remove();
      })();
    }, i * 70);
  }
}


/* =========================================================
   UTILITY: YNWA Animation (Liverpool red burst)
   ========================================================= */
function showYNWA() {
  const sticker = document.getElementById('liverpoolSticker');
  const r = sticker ? sticker.getBoundingClientRect() : { left: window.innerWidth/2, top: window.innerHeight/2, width: 0, height: 0 };
  const cx = r.left + r.width  / 2;
  const cy = r.top  + r.height / 2;
  const count = 7;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.textContent = 'YNWA';
    const sz = 1.8 + Math.random() * 2.2;
    el.style.cssText =
      `position:fixed;left:${cx}px;top:${cy}px;` +
      `font-family:'Syne',sans-serif;font-weight:800;` +
      `font-size:${sz}rem;color:#C8102E;` +
      'pointer-events:none;z-index:9997;user-select:none;' +
      'text-shadow:0 2px 12px rgba(200,16,46,0.5);white-space:nowrap;';
    document.body.appendChild(el);

    const angle = (Math.PI * 2 / count) * i;
    const spd   = 3 + Math.random() * 5;
    let vx = Math.cos(angle) * spd;
    let vy = Math.sin(angle) * spd - 2;
    let px = cx, py = cy, frame = 0, max = 90 + Math.random() * 30;

    (function tick() {
      vy += 0.08; px += vx; py += vy; vx *= 0.97; frame++;
      el.style.left      = px + 'px';
      el.style.top       = py + 'px';
      el.style.opacity   = Math.max(0, 1 - frame / max);
      el.style.transform = `rotate(${(Math.random()-0.5)*8}deg) scale(${1 + Math.sin(frame*0.25)*0.08})`;
      if (frame < max) requestAnimationFrame(tick); else el.remove();
    })();

    // Stagger launch
    el.style.opacity = '0';
    setTimeout(() => { el.style.opacity = ''; }, i * 80);
  }
}


/* =========================================================
   UTILITY: Make Draggable
   _photoZ is scoped inside the IIFE to prevent accidental
   global overwrites from unrelated code.
   ========================================================= */
const makeDraggable = (() => {
  let _photoZ = 50;
  return function makeDraggable(el) {
  let dragging = false, moved = false;
  let ox = 0, oy = 0, startCX = 0, startCY = 0;

  function lift(clientX, clientY) {
    dragging = true; moved = false;
    startCX = clientX; startCY = clientY;
    const r = el.getBoundingClientRect();
    ox = clientX - r.left;
    oy = clientY - r.top;

    // Move to document.body as page-absolute so photo scrolls with the page
    if (el.parentElement !== document.body) {
      const pw = r.width;
      const px = r.left + window.scrollX;
      const py = r.top  + window.scrollY;
      document.body.appendChild(el);
      el.style.position = 'absolute';
      el.style.margin   = '0';
      el.style.width    = pw + 'px';
      el.style.left     = px + 'px';
      el.style.top      = py + 'px';
    } else {
      // Already body-absolute (pre-positioned) — convert right: to explicit left:
      el.style.left  = (r.left + window.scrollX) + 'px';
      el.style.right = 'auto';
      el.style.top   = (r.top  + window.scrollY) + 'px';
    }

    el.style.zIndex     = String(_photoZ++);
    el.style.transition = 'none';
    el.style.transform  = 'rotate(0deg) scale(1.07)';
    el.classList.add('is-dragging');
    document.body.style.userSelect = 'none';
  }

  function drag(clientX, clientY) {
    if (!dragging) return;
    if (Math.hypot(clientX - startCX, clientY - startCY) > 4) moved = true;
    el.style.left = (clientX + window.scrollX - ox) + 'px';
    el.style.top  = (clientY + window.scrollY - oy) + 'px';
  }

  function drop() {
    if (!dragging) return;
    dragging = false;
    if (moved) el.dataset.skipClick = '1';
    el.classList.remove('is-dragging');
    el.style.transition = TRANS_SPRING;
    el.style.transform  = 'rotate(var(--rot,0deg)) scale(1)';
    document.body.style.userSelect = '';
  }

  el.addEventListener('mousedown', e => { e.preventDefault(); lift(e.clientX, e.clientY); });
  document.addEventListener('mousemove', e => drag(e.clientX, e.clientY));
  document.addEventListener('mouseup', drop);

  el.addEventListener('touchstart', e => lift(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  document.addEventListener('touchmove', e => {
    if (dragging) { e.preventDefault(); drag(e.touches[0].clientX, e.touches[0].clientY); }
  }, { passive: false });
  document.addEventListener('touchend', drop);
  };
})();

function addResizeHandle(el) {
  const h = document.createElement('div');
  h.className = 'resize-handle';
  el.style.position = el.style.position || 'relative';
  el.appendChild(h);

  let rsz = false, rsx = 0, rsw = 0;
  h.addEventListener('mousedown', e => {
    e.stopPropagation(); e.preventDefault();
    rsz = true; rsx = e.clientX; rsw = el.offsetWidth;
    el.style.transition = 'none';
    document.body.style.userSelect = 'none';
  });
  document.addEventListener('mousemove', e => {
    if (!rsz) return;
    el.style.width = Math.max(100, rsw + (e.clientX - rsx)) + 'px';
  });
  document.addEventListener('mouseup', () => {
    if (rsz) { rsz = false; document.body.style.userSelect = ''; }
  });
}


/* =========================================================
   PHOTO LAYOUT — scatter photos left/right, no overlaps
   ========================================================= */
// Original parent references captured before the first layout run; used to
// restore elements when the viewport shrinks back below the 900px threshold.
let _photoParents = null;

function initPhotoLayout() {
  if (window.innerWidth < 900) return;  // leave photos in their HTML containers on mobile

  const EDGE = 18;  // px from viewport edge
  const GAP  = 80;  // safety gap if an image is taller than expected

  const cursor = { left: 0, right: 0 };

  function place(el, wantedTop, isRight) {
    if (!el) return;
    const w    = el.offsetWidth || 220;
    const side = isRight ? 'right' : 'left';

    // Append first so the browser can compute the real rendered height
    document.body.appendChild(el);
    el.style.position = 'absolute';
    el.style.display  = '';          // clear any hidden state set by resetPhotoLayout
    el.style.margin   = '0';
    el.style.width    = w + 'px';
    el.style.top      = '0';
    el.style.zIndex   = '10';
    if (isRight) { el.style.right = EDGE + 'px'; el.style.left  = 'auto'; }
    else         { el.style.left  = EDGE + 'px'; el.style.right = 'auto'; }

    // Read actual height AFTER appending with correct width
    const h   = el.offsetHeight || 300;
    const top = Math.max(wantedTop, cursor[side] + GAP);
    cursor[side] = top + h;
    el.style.top = top + 'px';
  }

  const collage   = [...document.querySelectorAll('.human-collage .collage-item')];
  const jPhotos   = [...document.querySelectorAll('.journey-photos .polaroid')];
  const heroEl    = document.getElementById('heroPhoto');
  const liverpool = document.getElementById('liverpoolSticker');
  const moreBtn   = document.getElementById('moreLogoBig');
  const guitar    = document.getElementById('musicIconBtn');

  // Capture original parents on the very first run so we can restore later
  if (!_photoParents) {
    const els = [heroEl, jPhotos[2], jPhotos[0], liverpool, collage[0], guitar, moreBtn, jPhotos[1], collage[1]].filter(Boolean);
    _photoParents = new Map(els.map(el => [el, { parent: el.parentElement, next: el.nextElementSibling }]));
  }

  // Pre-clear the transform on MORE so place() measures its natural height
  if (moreBtn) moreBtn.style.transform = 'none';

  // RIGHT side — hero, Greece, Belgium, Liverpool (all via place() for accurate heights)
  // ~80px   — top of #hero section; sits beside the hero name/subtitle
  place(heroEl,      80,    true);
  // ~870px  — mid #work section ("Some of the Work" cards); Greece workshop photo
  place(jPhotos[2],  870,   true);
  // ~1750px — top of #human section ("Outside the Office"); Belgium workshop photo
  place(jPhotos[0],  1750,  true);
  // ~2650px — bottom of #human / top of #journey; Liverpool sticker as a fun accent
  place(liverpool,   2650,  true);

  // LEFT side — all items through place() so cursor stays accurate
  // ~440px  — bottom of #hero / top of #what section; "Off the clock" collage shot
  place(collage[0],  440,   false);
  // ~1200px — bottom of #what / top of #work section; guitar (click to play music)
  place(guitar,      1200,  false);
  // ~1900px — mid #human section; MORE logo button (click to open Flappy Bird)
  place(moreBtn,     1900,  false);
  // ~2700px — top of #journey section ("The Story So Far"); France photo
  place(jPhotos[1],  2700,  false);
  // ~3500px — mid #journey / top of #contact; Jyllandsringen driving photo
  place(collage[1],  3500,  false);

  // Hide now-empty containers
  ['.hero-photo', '.human-collage', '.journey-photos']
    .forEach(sel => { const c = document.querySelector(sel); if (c) c.style.display = 'none'; });
}

window.addEventListener('load', initPhotoLayout);

// Debounced resize: re-run layout only when viewport crosses the 900px mobile threshold.
// Crossing desktop → mobile restores elements to their original HTML containers.
// Crossing mobile → desktop re-runs initPhotoLayout() from scratch.
(function () {
  let prevIsMobile = window.innerWidth < 900;
  let timer;

  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const isMobile = window.innerWidth < 900;
      if (isMobile === prevIsMobile) return;
      prevIsMobile = isMobile;

      if (isMobile) {
        // Desktop → mobile: put each element back into its original container
        if (_photoParents) {
          _photoParents.forEach(({ parent, next }, el) => {
            if (!el || !parent) return;
            el.style.position  = '';
            el.style.display   = '';
            el.style.margin    = '';
            el.style.width     = '';
            el.style.top       = '';
            el.style.left      = '';
            el.style.right     = '';
            el.style.zIndex    = '';
            el.style.transform = '';
            if (next && next.parentElement === parent) parent.insertBefore(el, next);
            else parent.appendChild(el);
          });
        }
        // Re-show containers (were hidden by initPhotoLayout)
        ['.hero-photo', '.human-collage', '.journey-photos']
          .forEach(sel => { const c = document.querySelector(sel); if (c) c.style.display = ''; });
      } else {
        // Mobile → desktop: elements are back in their containers, re-run layout
        initPhotoLayout();
      }
    }, 250);
  });
}());


/* =========================================================
   FLAPPY MORE GAME
   ========================================================= */
function initFlappyMore() {
  const modal    = document.getElementById('gameModal');
  const backdrop = document.getElementById('gameBackdrop');
  const closeBtn = document.getElementById('gameClose');
  const canvas   = document.getElementById('flappyCanvas');
  if (!modal || !canvas) return;

  const ctx  = canvas.getContext('2d');
  const W    = canvas.width;
  const H    = canvas.height;
  let game   = null;
  let animId = null;

  // Make MORE logo draggable
  const moreBtn = document.getElementById('moreLogoBig');
  if (moreBtn) makeDraggable(moreBtn);

  let _gamePrevFocus = null;
  let _gameTrapHandler = null;

  // Open game on click (not after drag)
  moreBtn?.addEventListener('click', () => {
    if (moreBtn.dataset.skipClick) { delete moreBtn.dataset.skipClick; return; }
    _gamePrevFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    _gameTrapHandler = trapFocus(modal);
    closeBtn?.focus();
    startGame();
  });

  function closeGame() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    if (_gameTrapHandler) { modal.removeEventListener('keydown', _gameTrapHandler); _gameTrapHandler = null; }
    _gamePrevFocus?.focus();
  }

  closeBtn?.addEventListener('click', closeGame);
  backdrop?.addEventListener('click', closeGame);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeGame();
    if ((e.key === ' ' || e.key === 'ArrowUp') && !modal.hidden) {
      e.preventDefault();
      if (game) {
        if (game.state === 'idle')    { game.state = 'playing'; game.bird.vy = game.flap; }
        else if (game.state === 'playing') { game.bird.vy = game.flap; }
      }
    }
  });

  function startGame() {
    if (animId) cancelAnimationFrame(animId);

    // Load bird image (MORE logo)
    const birdImg = new Image();
    birdImg.src   = 'more..png';

    game = {
      bird:       { x: 90, y: H / 2 - 20, vy: 0, w: 55, h: 32 },
      pipes:      [],
      score:      0,
      best:       parseInt(sessionStorage.getItem('flappy_best') || '0'),
      frame:      0,
      state:      'idle', // idle | playing | dead
      gravity:    0.38,
      flap:       -7.5,
      pipeSpeed:  2.4,
      pipeGap:    145,
      pipeW:      58,
      imgReady:   false,
    };

    birdImg.onload = () => { game.imgReady = true; };

    function spawnPipe() {
      const minH = 55, maxH = H - game.pipeGap - minH;
      const topH = Math.random() * (maxH - minH) + minH;
      game.pipes.push({ x: W + 10, topH, scored: false });
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);

      // Background
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0,   '#0d0d0d');
      grad.addColorStop(1,   '#141414');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Subtle grid
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      ctx.lineWidth   = 1;
      for (let x = 0; x < W; x += 50) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += 50) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      if (game.state === 'playing') {
        game.frame++;
        game.bird.vy = Math.min(game.bird.vy + game.gravity, 12);
        game.bird.y  += game.bird.vy;

        // Spawn pipes every ~88 frames
        if (game.frame % 88 === 0) spawnPipe();

        // Move + score + cull pipes
        game.pipes = game.pipes.filter(p => p.x > -game.pipeW);
        for (const p of game.pipes) {
          p.x -= game.pipeSpeed;
          if (!p.scored && p.x + game.pipeW < game.bird.x) {
            p.scored = true;
            game.score++;
          }

          // Collision (slightly forgiving hitbox)
          const bx = game.bird.x + 6, by = game.bird.y + 4;
          const bw = game.bird.w  - 12, bh = game.bird.h - 8;
          if (bx + bw > p.x && bx < p.x + game.pipeW) {
            if (by < p.topH || by + bh > p.topH + game.pipeGap) {
              game.state = 'dead';
              if (game.score > game.best) {
                game.best = game.score;
                sessionStorage.setItem('flappy_best', game.best);
              }
            }
          }
        }

        // Floor / ceiling
        if (game.bird.y + game.bird.h > H || game.bird.y < 0) {
          game.state = 'dead';
          if (game.score > game.best) {
            game.best = game.score;
            sessionStorage.setItem('flappy_best', game.best);
          }
        }
      }

      // Draw pipes
      for (const p of game.pipes) {
        // Amber glass pipes
        ctx.fillStyle   = 'rgba(245,158,11,0.18)';
        ctx.strokeStyle = 'rgba(245,158,11,0.5)';
        ctx.lineWidth   = 2;

        // Top
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(p.x, 0, game.pipeW, p.topH, [0,0,6,6])
                      : ctx.rect(p.x, 0, game.pipeW, p.topH);
        ctx.fill(); ctx.stroke();

        // Cap on top pipe
        ctx.fillStyle = 'rgba(245,158,11,0.3)';
        const capH = 18;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(p.x - 5, p.topH - capH, game.pipeW + 10, capH, [0,0,6,6])
                      : ctx.rect(p.x - 5, p.topH - capH, game.pipeW + 10, capH);
        ctx.fill(); ctx.stroke();

        // Bottom
        const botY = p.topH + game.pipeGap;
        ctx.fillStyle   = 'rgba(245,158,11,0.18)';
        ctx.strokeStyle = 'rgba(245,158,11,0.5)';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(p.x, botY, game.pipeW, H - botY, [6,6,0,0])
                      : ctx.rect(p.x, botY, game.pipeW, H - botY);
        ctx.fill(); ctx.stroke();

        // Cap on bottom pipe
        ctx.fillStyle = 'rgba(245,158,11,0.3)';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(p.x - 5, botY, game.pipeW + 10, capH, [6,6,0,0])
                      : ctx.rect(p.x - 5, botY, game.pipeW + 10, capH);
        ctx.fill(); ctx.stroke();
      }

      // Draw bird
      ctx.save();
      const bcx      = game.bird.x + game.bird.w / 2;
      const bcy      = game.bird.y + game.bird.h / 2;
      const rotation = Math.min(Math.max(game.bird.vy * 0.07, -0.5), 0.9);
      ctx.translate(bcx, bcy);
      ctx.rotate(rotation);
      if (game.imgReady) {
        ctx.drawImage(birdImg, -game.bird.w/2, -game.bird.h/2, game.bird.w, game.bird.h);
      } else {
        // Fallback: amber rectangle
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(-game.bird.w/2, -game.bird.h/2, game.bird.w, game.bird.h);
      }
      ctx.restore();

      // Score (always visible during play)
      if (game.state !== 'idle') {
        ctx.fillStyle    = '#f0f0f0';
        ctx.font         = 'bold 36px Syne,sans-serif';
        ctx.textAlign    = 'center';
        ctx.shadowColor  = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur   = 8;
        ctx.fillText(game.score, W / 2, 52);
        ctx.shadowBlur   = 0;
      }

      // Idle screen
      if (game.state === 'idle') {
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = '#f59e0b';
        ctx.font      = 'bold 30px Syne,sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('FLAPPY MORE', W/2, H/2 - 28);

        ctx.fillStyle = '#aaaaaa';
        ctx.font      = '15px Inter,sans-serif';
        ctx.fillText('Tap or click to flap', W/2, H/2 + 10);
        ctx.fillText('Space / ↑ also works', W/2, H/2 + 32);
      }

      // Dead screen
      if (game.state === 'dead') {
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = '#f87171';
        ctx.font      = 'bold 38px Syne,sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', W/2, H/2 - 56);

        ctx.fillStyle = '#f59e0b';
        ctx.font      = 'bold 52px Syne,sans-serif';
        ctx.fillText(game.score, W/2, H/2 + 8);

        if (game.best > 0) {
          ctx.fillStyle = '#888';
          ctx.font      = '15px Inter,sans-serif';
          ctx.fillText(`Best: ${game.best}`, W/2, H/2 + 38);
        }

        ctx.fillStyle = '#f0f0f0';
        ctx.font      = '15px Inter,sans-serif';
        ctx.fillText('Click to try again', W/2, H/2 + 72);
      }

      animId = requestAnimationFrame(loop);
    }

    // Click canvas: flap or restart
    canvas.onclick = () => {
      if (!game) return;
      if (game.state === 'idle')    { game.state = 'playing'; game.bird.vy = game.flap; }
      else if (game.state === 'playing') { game.bird.vy = game.flap; }
      else if (game.state === 'dead') {
        // Restart
        game.bird    = { x: 90, y: H/2 - 20, vy: 0, w: 55, h: 32 };
        game.pipes   = [];
        game.score   = 0;
        game.frame   = 0;
        game.state   = 'playing';
        game.bird.vy = game.flap;
      }
    };

    loop();
  }
}
