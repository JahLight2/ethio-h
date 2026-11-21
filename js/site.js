/* ============================================================
   ETHIO H — site.js
   Motion system: smooth scroll, cursor, glass-wipe hero,
   reveals, chapter rail, service previews, form.
   ============================================================ */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TOUCH = matchMedia('(hover: none)').matches;

  /* ---------------------------------------------------------
     01 · Loader
  --------------------------------------------------------- */
  function initLoader() {
    const loader = $('.loader');
    document.documentElement.classList.add('is-loaded');
    const done = () => {
      if (loader) loader.classList.add('is-done');
      document.body.classList.remove('is-locked');
      setTimeout(() => document.body.classList.add('page-in'), 100);
      window.dispatchEvent(new Event('ethioh:loaded'));
    };
    if (!loader) { done(); return; }
    document.body.classList.add('is-locked');
    const minTime = REDUCED ? 100 : 900;
    const t0 = performance.now();
    const go = () => setTimeout(done, Math.max(0, minTime - (performance.now() - t0)));
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    setTimeout(go, 2600); // safety
  }

  /* ---------------------------------------------------------
     02 · Smooth scroll (Lenis-style, native wheel)
  --------------------------------------------------------- */
  const Scroll = {
    target: window.scrollY,
    current: window.scrollY,
    active: !REDUCED && !TOUCH,
    running: false,
    init() {
      if (!this.active) return;
      window.addEventListener('wheel', (e) => {
        if (document.body.classList.contains('is-locked')) return;
        e.preventDefault();
        this.target = clamp(this.target + e.deltaY * 1.0, 0, this.max());
        this.start();
      }, { passive: false });
      window.addEventListener('keydown', (e) => {
        if (['ArrowDown', 'PageDown', ' '].includes(e.key) && !document.body.classList.contains('is-locked')) {
          e.preventDefault(); this.target = clamp(this.target + innerHeight * .82, 0, this.max()); this.start();
        }
        if (['ArrowUp', 'PageUp'].includes(e.key)) {
          e.preventDefault(); this.target = clamp(this.target - innerHeight * .82, 0, this.max()); this.start();
        }
      });
      $$('a[href^="#"]').forEach(a => a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const el = $(id); if (!el) return;
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--h-header')) || 70);
        this.target = clamp(y, 0, this.max()); this.start();
        if (document.body.classList.contains('menu-open')) toggleMenu(false);
      }));
      window.addEventListener('resize', () => { this.target = window.scrollY; });
    },
    max() { return document.documentElement.scrollHeight - innerHeight; },
    start() { if (!this.running) { this.running = true; requestAnimationFrame(this.tick); } },
    tick: () => {
      Scroll.current = lerp(Scroll.current, Scroll.target, 0.088);
      if (Math.abs(Scroll.target - Scroll.current) < 0.4) { Scroll.current = Scroll.target; Scroll.running = false; }
      window.scrollTo(0, Scroll.current);
      if (Scroll.running) requestAnimationFrame(Scroll.tick);
    }
  };

  /* ---------------------------------------------------------
     03 · Custom cursor
  --------------------------------------------------------- */
  function initCursor() {
    if (TOUCH || REDUCED) return;
    const el = document.createElement('div');
    el.className = 'cursor';
    el.innerHTML = '<div class="cursor__ring"><span class="cursor__label"></span></div><div class="cursor__dot"></div>';
    // seed the transform so the first paint is centred
    el.querySelectorAll('.cursor__dot,.cursor__ring').forEach(n => {
      n.style.transform = 'translate3d(-100px,-100px,0) translate(-50%,-50%)';
    });
    document.body.appendChild(el);
    document.body.classList.add('has-cursor');
    const ring = $('.cursor__ring', el), dot = $('.cursor__dot', el), label = $('.cursor__label', el);
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, first = true;

    addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (first) { rx = mx; ry = my; first = false; }
    }, { passive: true });

    (function loop() {
      rx = lerp(rx, mx, 0.2); ry = lerp(ry, my, 0.2);
      // position + self-centring in a single transform so the dot never drifts
      dot.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();

    const HOVER = 'a,button,.svc-row,.ba,.acc__btn,[data-cursor]';
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest(HOVER);
      document.body.classList.toggle('cur-link', !!t && !t.dataset.cursor);
      if (t && t.dataset.cursor) {
        document.body.classList.add('cur-label');
        if (t.dataset.cursor === 'drag') document.body.classList.add('cur-drag');
        if (t.dataset.cursor === 'wipe') document.body.classList.add('cur-wipe');
        label.textContent = t.dataset.cursor === 'wipe' ? '' : t.dataset.cursor;
      }
    });
    document.addEventListener('pointerout', (e) => {
      const t = e.target.closest(HOVER);
      if (!t) return;
      document.body.classList.remove('cur-link', 'cur-label', 'cur-drag');
    });

    // theme inversion over dark sections
    const darkSections = $$('[data-theme="dark"]');
    addEventListener('scroll', () => {
      const y = my;
      const over = darkSections.some(s => {
        const r = s.getBoundingClientRect();
        return y >= r.top && y <= r.bottom;
      });
      document.body.classList.toggle('cur-theme-dark', over);
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     04 · Header + mobile menu
  --------------------------------------------------------- */
  function initHeader() {
    const header = $('.header');
    const darkSections = $$('[data-theme="dark"]');
    let lastY = window.scrollY;
    const onScroll = () => {
      if (!header) return;
      const y = window.scrollY;
      const line = header.offsetHeight * 0.55;
      let dark = false;
      darkSections.forEach(s => {
        const r = s.getBoundingClientRect();
        if (r.top <= line && r.bottom >= line) dark = true;
      });
      header.classList.toggle('is-dark', dark);
      header.classList.toggle('is-scrolled', y > 40);
      // retreat while reading downward, return on the way up
      const goingDown = y > lastY + 2;
      const goingUp = y < lastY - 2;
      if (goingDown && y > innerHeight * 0.9) header.classList.add('is-hidden');
      if (goingUp) header.classList.remove('is-hidden');
      if (y < 80) header.classList.remove('is-hidden');
      lastY = y;
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* the menu is gone — the header carries a Book button instead */
  }
  function toggleMenu(force) {
    const open = typeof force === 'boolean' ? force : !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open);
    document.body.classList.toggle('is-locked', open);
    const burger = $('.burger');
    if (burger) burger.setAttribute('aria-expanded', open);
  }

  /* ---------------------------------------------------------
     04b · Split text into words (minimal, per-word rise)
  --------------------------------------------------------- */
  function initSplit() {
    if (REDUCED) return;
    $$('[data-split]').forEach(host => {
      let i = 0;
      const walk = (node) => {
        Array.from(node.childNodes).forEach(child => {
          if (child.nodeType === 3) {
            const parts = child.textContent.split(/(\s+)/);
            const frag = document.createDocumentFragment();
            parts.forEach(t => {
              if (!t.trim()) { frag.appendChild(document.createTextNode(t)); return; }
              const w = document.createElement('span');
              w.className = 'w';
              const inner = document.createElement('span');
              inner.textContent = t;
              inner.style.setProperty('--i', i++);
              w.appendChild(inner);
              frag.appendChild(w);
            });
            child.replaceWith(frag);
          } else if (child.nodeType === 1 && !child.classList.contains('w')) {
            walk(child);
          }
        });
      };
      walk(host);
    });
  }

  /* ---------------------------------------------------------
     05 · Reveals
  --------------------------------------------------------- */
  function initReveals() {
    const items = $$('.rv, [data-lines], [data-split], .kicker, [data-reveal]');
    if (!('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          if (en.target.dataset.reveal === 'once') io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    items.forEach((el) => io.observe(el));
    // any parent still holding .ln lines that is not itself observed
    $$('.ln').forEach(l => {
      const host = l.closest('[data-lines]');
      if (host) return;
      const p = l.parentElement;
      if (p && !p.classList.contains('in') && !items.includes(p)) io.observe(p);
    });
  }

  /* ---------------------------------------------------------
     06 · Magnetic buttons + tilt
  --------------------------------------------------------- */
  function initMagnetic() {
    if (TOUCH || REDUCED) return;
    $$('.btn, .magnetic').forEach(el => {
      const strength = parseFloat(el.dataset.magnet || 8);
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        const y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        el.style.transform = `translate(${x * strength}px,${y * strength}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------------
     07 · Chapter rail
  --------------------------------------------------------- */
  function initRail() {
    const rail = $('.rail');
    if (!rail) return;
    rail.innerHTML = '<div class="rail__list"></div>' +
      '<a class="rail__book" href="booking-page/index.html" aria-label="Book residence care">' +
      '<span>Book</span>' +
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 8h11M9 3l5 5-5 5"/></svg>' +
      '</a>';
    const list = $('.rail__list', rail);

    const secs = $$('[data-rail]');
    if (secs.length) {
      secs.forEach((sec) => {
        if (!sec.id) sec.id = 'chapter-' + Math.random().toString(36).slice(2, 7);
        const a = document.createElement('a');
        a.className = 'ch';
        a.href = '#' + sec.id;
        a.innerHTML = `<b>${sec.dataset.rail}</b><i></i>`;
        a.setAttribute('aria-label', sec.dataset.rail);
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const y = sec.getBoundingClientRect().top + window.scrollY - 30;
          if (Scroll.active) { Scroll.target = y; Scroll.start(); }
          else window.scrollTo({ top: y, behavior: 'smooth' });
        });
        list.appendChild(a);
      });
      const links = $$('a.ch', list);
      const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + en.target.id));
          }
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      secs.forEach(s => io.observe(s));
    } else {
      $('.rail__list', rail).style.display = 'none';
    }

    const showRail = () => rail.classList.toggle('show', window.scrollY > innerHeight * .55);
    addEventListener('scroll', showRail, { passive: true });
    showRail();
  }

  /* ---------------------------------------------------------
     08 · Service previews (cursor-following image, no leftovers)
  --------------------------------------------------------- */
  function initServicePreview() {
    if (TOUCH) return;
    const prev = $('.svc-preview');
    if (!prev) return;
    const rows = $$('[data-preview]');
    const imgs = $$('img', prev);
    if (!rows.length) return;

    let x = 0, y = 0, cx = 0, cy = 0, raf = null, shown = false;

    const hide = () => {
      if (!shown) return;
      shown = false;
      prev.classList.remove('show');
      prev.style.visibility = 'hidden';
      document.body.classList.remove('cur-link');
    };
    const show = (key) => {
      imgs.forEach(im => im.classList.toggle('on', im.dataset.k === key));
      prev.style.visibility = 'visible';
      prev.classList.add('show');
      shown = true;
    };

    rows.forEach(row => {
      row.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'touch') return;
        show(row.dataset.preview);
        if (!raf) { cx = x; cy = y; loop(); }
      });
    });
    // a single authority for hiding — runs on every pointer move
    document.addEventListener('pointermove', (e) => {
      x = e.clientX; y = e.clientY;
      const over = e.target.closest('[data-preview]');
      if (!over) hide();
      else if (!shown) show(over.dataset.preview);
    }, { passive: true });
    document.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    addEventListener('scroll', hide, { passive: true });
    addEventListener('resize', hide);

    function loop() {
      cx = lerp(cx, x, .16); cy = lerp(cy, y, .16);
      prev.style.left = (cx + 42) + 'px';
      prev.style.top = (cy - 70) + 'px';
      raf = shown ? requestAnimationFrame(loop) : null;
    }
  }

  /* ---------------------------------------------------------
     09 · Hero — room first, then water, then wipe
     Timeline (scroll progress 0 → 1):
       0.00 – 0.04  the clean room, still water, nothing else
       0.04 – 0.30  water floods in from the bottom edge over the room
       0.14 – 0.34  the mark is written onto the wet glass
       0.34 – 0.86  the wave-edge squeegee clears the water downward
       0.50 – 0.72  the headline rises out of the cleared glass
       0.72 – 0.95  headline settles out; the room breathes
  --------------------------------------------------------- */
  function initHero() {
    const hero = $('.hero');
    if (!hero) return;
    const copy = $('.hero__copy', hero);
    const center = $('.hero__center', hero);
    const brand = $('.hero__brandmark', hero);
    const room = $('.hero__room', hero);
    const veil = $('.hero__veil', hero);
    if (!room) return;

    /* Landing: the mark rests on the room. On scroll the mark dissolves
       and the room cross-dissolves toward paper — no water, no wipe.
       Everything is a plain opacity handoff, so it also holds still
       perfectly when the reader prefers reduced motion. */
    const clamp01 = (v) => v < 0 ? 0 : v > 1 ? 1 : v;
    const range = (p, a, b) => clamp01((p - a) / (b - a));

    function paint(p) {
      const markOut = range(p, 0.02, 0.30);           // the mark leaves first
      const veilIn  = range(p, 0.46, 0.96);           // the room dissolves to paper
      const copyOut = range(p, 0.88, 1);              // the headline hands over last

      if (center) {
        center.style.opacity = String(1 - markOut);
        center.style.transform = `translateY(${(-18 * markOut).toFixed(2)}px)`;
      }
      if (copy) {
        /* readable from the very first frame — it only steps aside at the end */
        copy.style.opacity = String(1 - copyOut);
        copy.style.transform = `translateY(${-copyOut * 24}px)`;
      }
      if (brand) {
        brand.style.opacity = String(range(p, 0.22, 0.44));
        brand.style.transform = `translateY(${(1 - range(p, 0.22, 0.44)) * 18}px)`;
      }
      if (veil) veil.style.opacity = String(veilIn);
      hero.classList.toggle('is-head', p > 0.05);
      hero.style.setProperty('--dissolve', String(1 - veilIn).slice(0, 5));
    }

    let target = 0, shown = 0, visible = true, raf = 0;

    function read() {
      const total = hero.offsetHeight - innerHeight;
      target = clamp01(-hero.getBoundingClientRect().top / Math.max(1, total));
    }
    function loop() {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      shown += (target - shown) * 0.12;
      if (Math.abs(target - shown) < 0.0005) shown = target;
      paint(shown);
    }

    addEventListener('scroll', read, { passive: true });
    addEventListener('resize', read);
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 })
      .observe(hero);

    if (REDUCED) { paint(0); return; }   // still, legible, no choreography
    read(); paint(0); loop();
  }

  /* ---------------------------------------------------------
     10 · Before / after drag
  --------------------------------------------------------- */
  function initBA() {
    $$('.ba').forEach(ba => {
      const set = (clientX) => {
        const r = ba.getBoundingClientRect();
        const p = clamp((clientX - r.left) / r.width, 0.02, 0.98) * 100;
        ba.style.setProperty('--p', p + '%');
      };
      let down = false;
      ba.addEventListener('pointerdown', (e) => { down = true; ba.setPointerCapture(e.pointerId); set(e.clientX); });
      ba.addEventListener('pointermove', (e) => { if (down) set(e.clientX); });
      ba.addEventListener('pointerup', () => { down = false; });
      ba.addEventListener('pointercancel', () => { down = false; });
      ba.addEventListener('click', (e) => set(e.clientX));
      ba.dataset.cursor = 'drag';
    });
  }

  /* ---------------------------------------------------------
     11 · Parallax on [data-parallax]
  --------------------------------------------------------- */
  function initParallax() {
    if (REDUCED) return;
    const els = $$('[data-parallax]');
    if (!els.length) return;
    let raf = null;
    const update = () => {
      raf = null;
      els.forEach(el => {
        const sp = parseFloat(el.dataset.parallax) || 0.12;
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) return;
        const mid = r.top + r.height / 2 - innerHeight / 2;
        el.style.transform = `translate3d(0,${(-mid * sp).toFixed(2)}px,0)`;
      });
    };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    update();
  }

  /* ---------------------------------------------------------
     12 · Accordion
  --------------------------------------------------------- */
  function initAcc() {
    $$('.acc__item').forEach(item => {
      const btn = $('.acc__btn', item);
      if (!btn) return;
      btn.addEventListener('click', () => {
        const open = item.classList.contains('open');
        $$('.acc__item').forEach(i => { i.classList.remove('open'); const b = $('.acc__btn', i); if (b) b.setAttribute('aria-expanded', 'false'); });
        if (!open) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
      });
    });
  }

  /* ---------------------------------------------------------
     13 · Booking wizard + availability calendar
  --------------------------------------------------------- */
  function initForm() {
    const booker = $('#booker');
    const form = $('#booking');
    if (!form || !booker) return;

    const success = $('#booking-success');
    const steps = $$('.step', form);
    const fill = $('#booker-fill');
    const stepLabel = $('#booker-step-label');
    const count = $('#booker-count');
    const btnNext = $('#booker-next');
    const btnBack = $('#booker-back');
    const btnSubmit = $('#booker-submit');
    const TOTAL = steps.length;
    let current = 1;

    const stamp = () => {
      const d = new Date();
      return 'EH-' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    };

    /* ---------- step navigation ---------- */
    function show(n) {
      current = Math.min(TOTAL, Math.max(1, n));
      steps.forEach(st => st.classList.toggle('is-active', +st.dataset.step === current));
      const meta = steps[current - 1];
      stepLabel.innerHTML = meta.dataset.label;
      count.textContent = current + ' / ' + TOTAL;
      fill.style.transform = 'scaleX(' + (current / TOTAL) + ')';
      btnBack.hidden = current === 1;
      btnNext.hidden = current === TOTAL;
      btnSubmit.hidden = current !== TOTAL;
      const top = booker.getBoundingClientRect().top + window.scrollY - 120;
      if (current > 1) window.scrollTo({ top, behavior: 'smooth' });
    }

    /* ---------- validation ---------- */
    const emailOK = v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

    function validate(stepEl) {
      let ok = true;
      $$('[required]', stepEl).forEach(input => {
        if (input.type === 'hidden') {
          const valid = input.value.trim() !== '';
          const field = input.closest('.step');
          if (field) field.classList.toggle('err', !valid);
          if (!valid) ok = false;
          return;
        }
        const field = input.closest('.field');
        let valid = input.value.trim() !== '';
        if (valid && input.type === 'email') valid = emailOK(input.value);
        if (input.type === 'hidden') valid = true;
        if (field) field.classList.toggle('err', !valid);
        if (!valid) ok = false;
      });
      return ok;
    }

    function validateStep3() {
      const d = $('#date').value, t = $('#time').value;
      const ok = !!(d && t);
      const df = $('#date-msg');
      if (df) df.classList.toggle('is-on', !ok);
      if (!ok) {
        const cal = $('#cal');
        cal.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-7px)' }, { transform: 'translateX(7px)' }, { transform: 'translateX(0)' }],
          { duration: 320, easing: 'ease-in-out' }
        );
      }
      return ok;
    }

    $$('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const target = $('#' + chip.dataset.for);
        if (!target) return;
        const group = chip.parentElement;
        $$('.chip', group).forEach(c => c.classList.toggle('is-on', c === chip));
        target.value = chip.dataset.value;
        target.closest('.step').classList.remove('err');
        window.setTimeout(() => { if (current < TOTAL) btnNext.click(); }, 190);
      });
    });

    btnNext.addEventListener('click', () => {
      const stepEl = steps[current - 1];
      if (current === 7) { if (!validateStep3()) return; }
      else if (!validate(stepEl)) {
        const first = $('.err input,.err select,.err textarea', stepEl);
        if (first) first.focus();
        return;
      }
      show(current + 1);
    });
    btnBack.addEventListener('click', () => show(current - 1));
    form.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && current < TOTAL) {
        e.preventDefault(); btnNext.click();
      }
    });
    [['#name','#phone'],['#phone','#email']].forEach(([a,b]) => {
      const el = $(a); if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $(b).focus(); } });
    });
    show(1);

    /* =========================================================
       CALENDAR
       Availability model — two sources:
       1) `EH_AVAILABILITY` below: recurring weekly pattern for the studio.
          Each key = weekday (0 Sun … 6 Sat) → array of window keys that are
          permanently reserved (e.g. staff day off).
       2) `EH_BOOKED`: real reservations. Seeded for the demo, and merged with
          any bookings already saved on this device. Replace `EH_AVAILABILITY`
          and the seed with a fetch to your API when you go live.
       ========================================================= */
    const WINDOWS = [
      { k: 'am',  label: 'Morning',  time: '07:00 – 11:00' },
      { k: 'mid', label: 'Midday',   time: '11:00 – 15:00' },
      { k: 'pm',  label: 'Afternoon', time: '15:00 – 18:00' }
    ];

    const EH_AVAILABILITY = {
      0: ['am', 'mid', 'pm'],   // Sunday — by arrangement only
      1: [], 2: [], 3: [], 4: [], 5: [],
      6: ['pm']                 // Saturday afternoon kept clear
    };

    const EH_BOOKED = (function seed() {
      // deterministic studio calendar for this month and the next
      const now = new Date();
      const out = {};
      const pattern = [
        [2, 'am'], [2, 'mid'], [3, 'am'], [5, 'mid'], [5, 'pm'],
        [8, 'am'], [9, 'am'], [9, 'pm'], [10, 'mid'], [12, 'am'], [12, 'mid'],
        [15, 'am'], [16, 'mid'], [16, 'pm'], [17, 'am'], [19, 'am'],
        [22, 'am'], [23, 'mid'], [23, 'pm'], [24, 'am'], [26, 'mid'], [27, 'am']
      ];
      const base = new Date(now.getFullYear(), now.getMonth(), 1);
      pattern.forEach(([day, w]) => {
        const d = new Date(base.getFullYear(), base.getMonth(), day);
        if (d.getMonth() !== base.getMonth()) return;
        const key = d.toISOString().slice(0, 10);
        (out[key] = out[key] || []).push(w);
      });
      // merge device-local requests
      try {
        const q = JSON.parse(localStorage.getItem('ethioh-bookings') || '[]');
        q.forEach(b => {
          if (!b.preferred_date || !b.preferred_time) return;
          const w = WINDOWS.find(x => b.preferred_time.indexOf(x.label) === 0);
          if (!w) return;
          (out[b.preferred_date] = out[b.preferred_date] || []).push(w.k);
        });
      } catch (_) {}
      return out;
    })();

    const iso = d => {
      const p = n => String(n).padStart(2, '0');
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    };

    function windowsFor(date) {
      const dow = date.getDay();
      const key = iso(date);
      const taken = new Set([].concat(EH_AVAILABILITY[dow] || [], EH_BOOKED[key] || []));
      return WINDOWS.map(w => ({ ...w, taken: taken.has(w.k) }));
    }

    function dayState(date) {
      const today = new Date(); today.setHours(0,0,0,0);
      if (date < today) return 'past';
      const ws = windowsFor(date);
      const free = ws.filter(w => !w.taken).length;
      if (free === 0) return 'full';
      if (free < ws.length) return 'part';
      return 'free';
    }

    let viewYear, viewMonth, selectedDate = null, selectedWindow = null;
    const today = new Date();
    viewYear = today.getFullYear(); viewMonth = today.getMonth();
    const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const CAL_WORDS = { free: 'open', part: 'partly booked', full: 'booked', past: 'past' };

    function buildCalendar() {
      const grid = $('#cal-grid');
      const focus = selectedDate ? new Date(selectedDate + 'T00:00:00') : null;
      $('#cal-month').textContent = MONTHS[viewMonth].toUpperCase();
      $('#cal-year').textContent = viewYear;
      /* the big numeral: the chosen day, or today when nothing is chosen */
      const figure = focus && focus.getMonth() === viewMonth && focus.getFullYear() === viewYear
        ? focus : new Date();
      const figIsView = figure.getMonth() === viewMonth && figure.getFullYear() === viewYear;
      $('#cal-num').textContent = figIsView ? figure.getDate() : '';
      $('#cal-dow').textContent = figIsView ? WEEKDAYS[figure.getDay()] : '';

      const first = new Date(viewYear, viewMonth, 1);
      const startDow = (first.getDay() + 6) % 7;           // Monday-first
      const daysIn = new Date(viewYear, viewMonth + 1, 0).getDate();
      const cells = [];
      for (let i = 0; i < startDow; i++) cells.push('<span class="cal2__cell is-void" aria-hidden="true"></span>');
      const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);
      for (let d = 1; d <= daysIn; d++) {
        const date = new Date(viewYear, viewMonth, d);
        const key = iso(date);
        let state = dayState(date);
        if (date > maxDate) state = 'past';
        const isSel = selectedDate === key;
        const isToday = key === iso(new Date());
        const disabled = state === 'past';
        cells.push(
          `<button type="button" class="cal2__cell${isSel ? ' is-selected' : ''}${isToday ? ' is-today' : ''}" ` +
          `data-date="${key}" data-state="${state}" ${disabled ? 'disabled' : ''} ` +
          `aria-label="${d} ${MONTHS[viewMonth]} — ${CAL_WORDS[state]}">` +
          `<i class="cal2__dot"></i></button>`
        );
      }
      grid.innerHTML = cells.join('');
      $('#cal-prev').disabled = (viewYear === today.getFullYear() && viewMonth === today.getMonth());
    }

    function buildSlots(dateKey) {
      const slots = $('#slots');
      const date = new Date(dateKey + 'T00:00:00');
      const pretty = date.getDate() + ' ' + MONTHS[date.getMonth()] + ' ' + date.getFullYear();
      const ws = windowsFor(date);
      const openCount = ws.filter(w => !w.taken).length;
      let html = `<div class="slots__head"><span>${pretty}</span><b>${openCount} of ${ws.length} open</b></div>`;
      html += '<div class="slots__grid">';
      ws.forEach(w => {
        const sel = selectedWindow === w.k;
        html += `<button type="button" class="slot${sel ? ' is-selected' : ''}" data-window="${w.k}" ` +
                `data-state="${w.taken ? 'taken' : 'open'}" ${w.taken ? 'disabled' : ''}>` +
                `<span>${w.label}</span><small>${w.taken ? 'Reserved' : w.time}</small></button>`;
      });
      html += '</div>';
      slots.innerHTML = html;
      $$('.slot', slots).forEach(b => b.addEventListener('click', () => {
        selectedWindow = b.dataset.window;
        const w = WINDOWS.find(x => x.k === selectedWindow);
        $('#time').value = w.label + ' · ' + w.time;
        $('#date').value = dateKey;
        const dm = $('#date-msg'); if (dm) dm.classList.remove('is-on');
        buildSlots(dateKey);
      }));
    }

    const calGrid = $('#cal-grid');
    calGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.cal2__cell');
      if (!btn || btn.disabled) return;
      const state = btn.dataset.state;
      if (state === 'past') return;
      selectedDate = btn.dataset.date;
      selectedWindow = null;
      $('#date').value = selectedDate;
      $('#time').value = '';
      buildCalendar();
      buildSlots(selectedDate);
    });
    $('#cal-prev').addEventListener('click', () => {
      viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      buildCalendar();
    });
    $('#cal-next').addEventListener('click', () => {
      viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      buildCalendar();
    });
    buildCalendar();

    /* ---------- review ---------- */
    function buildReview() {
      const val = id => ($(id) && $(id).value.trim()) || '';
      const rows = [
        { k: 'Name', v: val('#name'), step: 1 },
        { k: 'Phone', v: val('#phone'), step: 1 },
        { k: 'Email', v: val('#email'), step: 1 },
        { k: 'Neighbourhood', v: val('#neighbourhood'), step: 2 },
        { k: 'Residence', v: val('#residence'), step: 2 },
        { k: 'Service', v: val('#service'), step: 2 },
        { k: 'Date', v: val('#date'), step: 3 },
        { k: 'Window', v: val('#time'), step: 3 },
        { k: 'Notes', v: val('#notes'), step: 3 }
      ];
      const html = rows.map(r => {
        const empty = !r.v;
        return `<div class="review__row"><dt>${r.k}</dt><dd>${empty ? '<em>Not given</em>' : r.v}
          <button type="button" class="review__edit" data-goto="${r.step}" style="margin-left:10px">Edit</button></dd></div>`;
      }).join('');
      const review = $('#review');
      review.innerHTML = html;
      $$('.review__edit', review).forEach(b => b.addEventListener('click', () => show(+b.dataset.goto)));
    }

    /* ---------- submit ---------- */
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateStep3()) { show(7); return; }
      for (let i = 1; i <= 6; i++) {
        if (!validate(steps[i - 1])) { show(i); return; }
      }
      const btn = btnSubmit;
      const old = btn.innerHTML;
      btn.disabled = true; btn.textContent = 'Sending…';

      const data = Object.fromEntries(new FormData(form).entries());
      data.reference = stamp();
      data.submitted_at = new Date().toISOString();
      data.source = location.pathname.split('/').pop() || 'contact.html';

      let saved = 'remote';
      try {
        const res = await fetch('/api/booking', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
      } catch (err) {
        saved = 'local';
        try {
          const q = JSON.parse(localStorage.getItem('ethioh-bookings') || '[]');
          q.push(data); localStorage.setItem('ethioh-bookings', JSON.stringify(q));
        } catch (_) {}
      }

      booker.style.display = 'none';
      if (success) {
        success.classList.add('show');
        $('[data-ref]', success).textContent = data.reference;
        const note = $('[data-mode]', success);
        if (note) note.textContent = saved === 'remote'
          ? 'The request is in our schedule. We reply within one business day.'
          : 'Saved on this device. Connect the booking endpoint and it will be delivered automatically.';
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      btn.disabled = false; btn.innerHTML = old;
    });
  }

  /* ---------------------------------------------------------
     14 · Counters
  --------------------------------------------------------- */
  function initCounters() {
    const counters = $$('[data-count]');
    if (!counters.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target, end = parseFloat(el.dataset.count), dur = 1400;
        const t0 = performance.now();
        const step = (t) => {
          const p = clamp((t - t0) / dur, 0, 1);
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(end * e).toString();
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: .6 });
    counters.forEach(c => io.observe(c));
  }

  /* ---------------------------------------------------------
     15 · Year
  --------------------------------------------------------- */
  function initYear() { $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear()); }

  /* ---------------------------------------------------------
     Boot
  --------------------------------------------------------- */
  const boot = () => {
    initLoader();
    Scroll.init();
    initCursor();
    initHeader();
    initSplit();
    initReveals();
    initMagnetic();
    initRail();
    initServicePreview();
    initHero();
    initBA();
    initParallax();
    initAcc();
    initForm();
    initCounters();
    initYear();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
