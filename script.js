/* =====================================================
   11 • 11 • 2026 — interactions
   Sections:
     1. Helpers & elements
     2. Background (floating hearts + particles)
     3. Opening sequence
     4. Typewriter message
     5. Popup + final heart animation
     6. Music (synthesized — no audio file needed)
   ===================================================== */
(function () {
  'use strict';

  /* ---------- 1. Helpers & elements ---------- */
  const $ = (id) => document.getElementById(id);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rand = (a, b) => a + Math.random() * (b - a);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const landing  = $('landing');
  const envelope = $('envelope');
  const openBtn  = $('openBtn');
  const main     = $('main');
  const messageEl = $('message');
  const skipBtn  = $('skipBtn');
  const moreBtn  = $('moreBtn');
  const modal    = $('modal');
  const closeBtn = $('closeBtn');
  const burst    = $('burst');
  const musicBtn = $('musicBtn');

  document.body.classList.add('locked');

  /* ---------- 2. Background ---------- */

  // Floating tiny hearts (CSS-animated, cheap)
  (function makeHearts() {
    const wrap = $('hearts');
    const count = window.innerWidth < 600 ? 9 : 16;
    for (let i = 0; i < count; i++) {
      const h = document.createElement('span');
      h.textContent = '♥';
      h.style.left = rand(2, 98) + '%';
      h.style.fontSize = rand(10, 24) + 'px';
      h.style.setProperty('--o', rand(0.12, 0.35).toFixed(2));
      h.style.setProperty('--sway', rand(-60, 60) + 'px');
      h.style.animationDuration = rand(15, 28) + 's';
      h.style.animationDelay = -rand(0, 25) + 's';
      wrap.appendChild(h);
    }
  })();

  // Glowing particles (single lightweight canvas)
  (function particles() {
    const canvas = $('particles');
    const ctx = canvas.getContext('2d');
    let w, h, dpr, parts = [], running = true;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      const n = innerWidth < 600 ? 28 : 55;
      parts = Array.from({ length: n }, () => spawn(true));
    }
    function spawn(anywhere) {
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 10,
        r: rand(.8, 2.6) * dpr,
        vy: rand(.12, .45) * dpr,
        vx: rand(-.12, .12) * dpr,
        a: rand(.25, .8),
        t: Math.random() * 6.28,
        gold: Math.random() > .35
      };
    }
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.vy; p.x += p.vx + Math.sin(p.t += .01) * .15 * dpr;
        if (p.y < -10) Object.assign(p, spawn(false));
        const tw = .55 + Math.sin(p.t * 3) * .45;
        ctx.globalAlpha = p.a * tw;
        ctx.fillStyle = p.gold ? '#f0d49a' : '#f4b6c0';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
        ctx.globalAlpha = p.a * tw * .25;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    resize();
    addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) requestAnimationFrame(frame);
    });
    if (!reduceMotion) requestAnimationFrame(frame);
  })();

  /* ---------- 3. Opening sequence ---------- */
  function sparkles(x, y, n) {
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'spark';
      s.textContent = Math.random() > .5 ? '✦' : '♥';
      s.style.left = x + 'px'; s.style.top = y + 'px';
      const ang = Math.random() * 6.283, d = rand(60, 200);
      s.style.setProperty('--dx', Math.cos(ang) * d + 'px');
      s.style.setProperty('--dy', Math.sin(ang) * d + 'px');
      s.style.color = Math.random() > .5 ? '#e0c08a' : '#ff9fb2';
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1400);
    }
  }

  openBtn.addEventListener('click', async () => {
    openBtn.disabled = true;
    const rect = envelope.getBoundingClientRect();
    envelope.classList.add('open');                   // flap opens, letter rises
    sparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 26);

    await sleep(2100);
    landing.classList.add('leaving');                 // zoom + fade away
    await sleep(900);

    landing.classList.add('gone');
    document.body.classList.remove('locked');
    main.classList.add('show');                       // photos appear one by one (CSS delays)
    main.setAttribute('aria-hidden', 'false');
    window.scrollTo(0, 0);

    await sleep(1400);
    typeMessage();
  });

  /* ---------- 4. Typewriter message ----------
     **text** marks a highlighted phrase.
     Wording is exactly the message you provided. */
  const MESSAGE = [
    'مش عارف إذا كان يوم **11/11** مميز عند كل الناس ولا لأ، بس أنا بالنسبالي اليوم ده بقى ليه معنى تاني خالص، لأنه **مرتبط بيكي** وبأجمل حاجة حصلت في حياتي.',
    'وجودك في حياتي **نعمة** بحمد ربنا عليها كل يوم، وإنتِ مش بس الإنسانة اللي بحبها، إنتِ الإنسانة اللي نفسي **أكمل معاها** كل اللي جاي.',
    'نفسي كل **11/11** يعدي علينا وإحنا مع بعض، وكل سنة نكون أقرب لبعض، ونفتكر اليوم ده ونحكي قد إيه ربنا كان كريم معانا لما جمعنا.',
    'أنا مش بوعدك إن كل الأيام هتكون سهلة، لكن بوعدك إني **هفضل أختارك**، وأتمسك بيكي، وأسعى بكل اللي أقدر عليه علشان نبني حياة نكون مبسوطين وفخورين بيها.',
    'كل **11/11** وإنتِ **حبيبتي** و**نصيبي** و**أجمل اختياراتي**.',
    '§**بحبك ❤️**'   // § = final line (bigger, rose color)
  ];

  let skipping = false, typingDone = false, started = false;
  skipBtn.addEventListener('click', () => { skipping = true; });
  $('card').addEventListener('click', () => { if (started && !typingDone) skipping = true; });

  async function typeMessage() {
    if (started) return;
    started = true;
    const caret = document.createElement('span');
    caret.className = 'caret';

    for (const raw of MESSAGE) {
      const isFinal = raw.startsWith('§');
      const text = isFinal ? raw.slice(1) : raw;
      const p = document.createElement('p');
      messageEl.appendChild(p);
      p.appendChild(caret);

      const parts = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);
      for (const part of parts) {
        const hl = part.startsWith('**');
        const str = hl ? part.slice(2, -2) : part;
        const span = document.createElement('span');
        if (hl) span.className = isFinal ? 'hl-rose final' : 'hl';
        p.insertBefore(span, caret);

        for (const ch of str) {
          span.textContent += ch;
          if (skipping || reduceMotion) continue;
          let d = 34;
          if ('،.'.includes(ch)) d = 260;
          await sleep(d);
        }
      }
      if (!skipping && !reduceMotion) await sleep(380);
    }

    caret.remove();
    typingDone = true;
    skipBtn.classList.add('hide');
    await sleep(500);
    moreBtn.classList.add('visible');
  }

  /* ---------- 5. Popup + final heart animation ---------- */
  function countUp() {
    modal.querySelectorAll('[data-to]').forEach((el) => {
      const to = +el.dataset.to, t0 = performance.now(), dur = 1600;
      (function tick(now) {
        const k = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(to * e);
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }

  function heartBurst(n) {
    const colors = ['#e0526f', '#ff9fb2', '#e0c08a', '#f4d6d6'];
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.textContent = '♥';
      const ang = Math.random() * 6.283, d = rand(120, Math.min(innerWidth, 520) * .8);
      s.style.setProperty('--dx', Math.cos(ang) * d + 'px');
      s.style.setProperty('--dy', Math.sin(ang) * d - 40 + 'px');
      s.style.setProperty('--r', rand(-60, 60) + 'deg');
      s.style.setProperty('--s', rand(14, 34) + 'px');
      s.style.setProperty('--c', colors[i % colors.length]);
      s.style.animationDelay = rand(0, .5) + 's';
      burst.appendChild(s);
      setTimeout(() => s.remove(), 3200);
    }
  }

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    countUp();
    heartBurst(36);
    setTimeout(() => modal.classList.contains('open') && heartBurst(26), 1900); // second wave as heart fills
    closeBtn.focus({ preventScroll: true });
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    // reset counter so it animates again next time
    modal.querySelectorAll('[data-to]').forEach((el) => (el.textContent = '0'));
  }

  moreBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ---------- 6. Music ----------
     A soft piano-like arpeggio generated with the Web Audio API,
     so the project needs no audio file and works offline.
     Starts ONLY after the visitor clicks the music button. */
  let actx, master, playing = false, nextTime = 0, barTimer;
  const CHORDS = [              // Am – F – C – G
    [220.00, 261.63, 329.63],
    [174.61, 220.00, 261.63],
    [130.81, 164.81, 196.00],
    [196.00, 246.94, 293.66]
  ];
  const STEP = 0.46;            // seconds per note
  let barIndex = 0;

  function initAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    actx = new AC();
    master = actx.createGain();
    master.gain.value = 0;
    // gentle echo for atmosphere
    const delay = actx.createDelay(); delay.delayTime.value = 0.38;
    const fb = actx.createGain(); fb.gain.value = 0.35;
    const wet = actx.createGain(); wet.gain.value = 0.35;
    master.connect(actx.destination);
    master.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(actx.destination);
    return true;
  }

  function note(freq, t, dur, vol) {
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = 'triangle'; o.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function scheduleBar() {
    if (!playing) return;
    const c = CHORDS[barIndex++ % CHORDS.length];
    nextTime = Math.max(nextTime, actx.currentTime + 0.05);
    const pattern = [0, 1, 2, 1, 2, 1, 2, 1];
    note(c[0] / 2, nextTime, STEP * 8, 0.22);                 // warm bass
    pattern.forEach((idx, i) => {
      const f = c[idx] * (idx === 2 ? 2 : 1);
      note(f, nextTime + i * STEP, 1.8, 0.16);
    });
    nextTime += STEP * 8;
    barTimer = setTimeout(scheduleBar, (nextTime - actx.currentTime - 0.6) * 1000);
  }

  /* Your own song (music/song.mp3) is used if the file exists.
     If it is missing or can't be played, the synthesized melody above is the fallback. */
  const bgm = $('bgm');
  let fileOk = null;            // null = not tried yet, true = song works, false = use fallback
  let fadeTimer;

  function fadeSong(to, done) {
    clearInterval(fadeTimer);
    fadeTimer = setInterval(() => {
      const v = bgm.volume, step = 0.04;
      const next = Math.abs(v - to) <= step ? to : v + (to > v ? step : -step);
      bgm.volume = next;
      // iPhones ignore volume changes: skip the fade instead of looping forever
      const ignored = Math.abs(bgm.volume - next) > 0.01;
      if (ignored || next === to) { clearInterval(fadeTimer); if (done) done(); }
    }, 60);
  }

  function startSynth() {
    if (!actx && !initAudio()) { musicBtn.style.display = 'none'; return; }
    actx.resume();
    master.gain.cancelScheduledValues(actx.currentTime);
    master.gain.linearRampToValueAtTime(0.5, actx.currentTime + 1.2);
    scheduleBar();
  }

  function stopSynth() {
    clearTimeout(barTimer);
    if (actx) {
      master.gain.cancelScheduledValues(actx.currentTime);
      master.gain.linearRampToValueAtTime(0, actx.currentTime + 0.5);
      nextTime = 0;
      setTimeout(() => { if (!playing) actx.suspend(); }, 700);
    }
  }

  function setMusic(on) {
    playing = on;
    musicBtn.classList.toggle('on', on);
    musicBtn.classList.toggle('muted', !on);
    musicBtn.setAttribute('aria-pressed', String(on));
    musicBtn.setAttribute('aria-label', on ? 'Mute music' : 'Play music');

    document.body.classList.add('music-used');          // hides the "Tap for music" hint

    if (on) {
      if (fileOk === false) { startSynth(); return; }
      // iPhone/Safari: unlock Web Audio inside the tap itself, in case the fallback melody is needed
      if (fileOk === null && (actx || initAudio())) actx.resume();
      bgm.volume = 0;
      bgm.play().then(() => {
        fileOk = true;
        if (actx) actx.suspend();                       // song works → fallback not needed
        if (!playing) { bgm.pause(); return; }
        fadeSong(0.8);
      }).catch(() => {
        fileOk = false;                    // no song file found → fallback melody
        if (playing) startSynth();
      });
    } else {
      if (fileOk) fadeSong(0, () => bgm.pause());
      else stopSynth();
    }
  }

  musicBtn.addEventListener('click', () => setMusic(!playing));
})();
