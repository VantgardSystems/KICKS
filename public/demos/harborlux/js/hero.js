/* =====================================================================
   HERO — intro cinemática de 7.4 s con un solo reloj maestro,
   lluvia en bucle y barra de navegación flotante.
   ===================================================================== */
(function (HL) {
  'use strict';

  const SITE = window.SITE;
  const CFG = SITE.hero;

  HL.hero = { init };

  function init() {
    setupNav();
    setupHero();
  }

  /* =================================================================
     NAVEGACIÓN
     ================================================================= */
  function setupNav() {
    const nav = HL.$('#nav');
    const links = HL.$('#nav-links');
    const menu = HL.$('.nav-menu', nav);
    const brand = HL.$('[data-brand]', nav);
    const cta = HL.$('[data-nav-cta]', nav);

    brand.textContent = SITE.marca.logoTexto;
    brand.setAttribute('aria-label', SITE.marca.nombre + ', inicio');
    cta.href = SITE.nav.cta.href;
    HL.$('.long', cta).textContent = SITE.nav.cta.texto;
    HL.$('.short', cta).textContent = SITE.nav.cta.corto || SITE.nav.cta.texto;
    links.innerHTML = SITE.nav.links.map((l) => '<a href="' + HL.esc(l.href) + '">' + HL.esc(l.texto) + '</a>').join('');

    // Cápsula de vidrio al hacer scroll
    const onScroll = () => {
      const solid = window.scrollY > 24;
      nav.classList.toggle('is-solid', solid);
      if (!solid) setMenu(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Menú móvil (solo visible con la cápsula en pantallas chicas)
    function setMenu(open) {
      nav.classList.toggle('is-open', open);
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    }
    menu.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
    links.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menu.focus(); } });

    // Scrollspy: resalta la sección visible
    const anchors = HL.$$('a', links);
    const navIds = anchors.map((a) => a.getAttribute('href'));
    // Cada sección se asocia al enlace del menú más cercano hacia arriba (p. ej. Calculadora → Servicios)
    const sections = HL.$$('main > section');
    const owner = new Map();
    let last = navIds[0];
    sections.forEach((sec) => {
      if (sec.id && navIds.indexOf('#' + sec.id) >= 0) last = '#' + sec.id;
      owner.set(sec, last);
    });
    if ('IntersectionObserver' in window && sections.length) {
      const spy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const href = owner.get(entry.target);
          anchors.forEach((a) => {
            if (a.getAttribute('href') === href) a.setAttribute('aria-current', 'true');
            else a.removeAttribute('aria-current');
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach((t) => spy.observe(t));
    }
    if (anchors[0]) anchors[0].setAttribute('aria-current', 'true');

    // Selector de moneda (ícono de globo)
    const curBtn = HL.$('[data-currency-toggle]', nav);
    const curLabel = HL.$('[data-currency-label]', nav);
    const paint = () => {
      const cur = HL.store.state.currency;
      const other = cur === 'USD' ? SITE.moneda.local : 'USD';
      curLabel.textContent = cur;
      curBtn.setAttribute('aria-label', 'Moneda: ' + cur + '. Cambiar a ' + other);
    };
    curBtn.addEventListener('click', () => {
      const cur = HL.store.state.currency;
      HL.store.setCurrency(cur === 'USD' ? SITE.moneda.local : 'USD');
      HL.toast('Precios en ' + HL.store.state.currency);
    });
    HL.store.on('currency', paint);
    paint();
  }

  /* Fondo de la barra en estado "hero" (sin scroll): base del cálculo del titular */
  function heroNavBottom() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    if (H <= 500 && W > H) return 12 + 34;
    if (W < 820) return 16 + 36 + 12 + 40;
    const u = Math.max(Math.min(W / 1440, H / 900), 0.7);
    return 100 * u;
  }

  /* =================================================================
     HERO
     ================================================================= */
  function setupHero() {
    const $ = (sel, root) => HL.$(sel, root);
    const body = document.body;
    const hero = $('#inicio');
    const nav = $('#nav');
    const stage = $('.stage', hero);
    const back = $('.layer-back', stage);
    const mid = $('.layer-mid', stage);
    const front = $('.layer-front', stage);
    const shade = $('.shade', back);
    const rainA = $('.rain-a', back);
    const rainB = $('.rain-b', back);
    const headline = $('.headline', stage);
    const kicker = $('.kicker', headline);
    const word = $('.word', headline);
    const search = $('.search', hero);
    const opening = $('.opening', hero);
    const aerial = $('.aerial', opening);
    const tilt = $('.tilt', opening);
    const doors = $('.doors', hero);
    const doorL = $('.door-l', doors);
    const doorR = $('.door-r', doors);
    const media = CFG.media;
    const url = (tpl, w) => String(tpl || '').replace('{w}', w);

    /* ---------- Texto del titular ---------- */
    kicker.textContent = CFG.kicker;
    word.setAttribute('aria-label', CFG.titulo || (CFG.kicker + ' ' + CFG.palabra));
    word.innerHTML = Array.from(CFG.palabra).map((c) => '<span aria-hidden="true">' + HL.esc(c) + '</span>').join('');
    const letters = Array.from(word.children);

    /* ---------- Geometría del escenario y ancho ideal de imagen ---------- */
    function geom() {
      const W = hero.clientWidth;
      const H = hero.clientHeight;
      const sw = Math.max(W, H * 16 / 9);
      const sh = sw * 9 / 16;
      return { W, H, sw, sh, top: (H - sh) / 2 };
    }
    // 1x: ancho necesario redondeado a la siguiente centena. HiDPI: 2000 cubre un escenario de 1600.
    function pickW(cssWidth) {
      const dpr = window.devicePixelRatio || 1;
      const need = dpr > 1.05 ? Math.max(2000, cssWidth * 1.25) : cssWidth;
      return Math.min(2700, Math.max(100, Math.ceil(need / 100) * 100));
    }

    const simple = CFG.modo === 'imagen';
    const layerImgs = simple
      ? [[$('img', back), media.fondo]]
      : [[$('img', back), media.fondo], [$('img', mid), media.ciudad], [$('img', front), media.frente]];
    let layerW = pickW(geom().sw);
    layerImgs.forEach(([el, tpl]) => { el.src = url(tpl, layerW); });

    /* ---------- Tamaño del titular ---------- */
    const meas = document.createElement('div');
    meas.className = 'word measure';
    meas.setAttribute('aria-hidden', 'true');
    meas.innerHTML = letters.map((l) => '<span>' + l.textContent + '</span>').join('') + '<i></i>';
    hero.appendChild(meas);
    let perEm = 3.6;
    let asc = 0.864;
    let kOff = -0.1;     // centro del kicker respecto al centro del titular, en em
    let kDrop = 0.747;   // borde superior del kicker sobre la línea base, en em
    function measure() {
      const w = meas.getBoundingClientRect().width;
      if (w > 0) {
        perEm = w / 100;
        asc = meas.lastChild.offsetTop / 100;
        placeKicker(w);
      }
    }
    /* El kicker descansa en la línea de mayúsculas, entre letras altas. Para no chocar con
       acentos (é), puntos (i) o ascendentes (b, t), se dibuja el titular en un canvas, se busca
       un hueco libre en esa franja lo más cerca posible del centro y, si no lo hay,
       el kicker sube por encima del titular. */
    function placeKicker(w) {
      kOff = -0.1;
      kDrop = 0.747;
      try {
        const S = 100;
        const pad = 10;
        const family = getComputedStyle(word).fontFamily;
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(w) + pad * 2;
        canvas.height = 130;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const base = 110;
        ctx.font = '700 ' + S + 'px ' + family;
        Array.from(meas.children).forEach((s) => { if (s.tagName === 'SPAN') ctx.fillText(s.textContent, s.offsetLeft + pad, base); });
        const y0 = Math.round(base - 0.8 * S);
        const y1 = Math.round(base - 0.6 * S);
        const px = ctx.getImageData(0, y0, canvas.width, y1 - y0).data;
        const margin = Math.round(0.03 * S);
        const blocked = new Uint8Array(canvas.width);
        for (let x = 0; x < canvas.width; x++) {
          for (let y = 0; y < y1 - y0; y++) {
            if (px[(y * canvas.width + x) * 4 + 3] > 40) {
              for (let k = Math.max(0, x - margin); k <= Math.min(canvas.width - 1, x + margin); k++) blocked[k] = 1;
              break;
            }
          }
        }
        ctx.font = '300 ' + (0.118 * S) + 'px ' + family;
        const half = ctx.measureText(kicker.textContent).width / 2;
        const pref = pad + w / 2 - 0.1 * S;
        let best = null;
        for (let cx = Math.ceil(pad + half); cx <= Math.floor(pad + w - half); cx++) {
          let free = true;
          for (let x = Math.floor(cx - half); x <= Math.ceil(cx + half); x++) if (blocked[x]) { free = false; break; }
          if (free && (best === null || Math.abs(cx - pref) < Math.abs(best - pref))) best = cx;
        }
        if (best !== null && Math.abs(best - pref) <= 0.45 * S) kOff = (best - pad - w / 2) / S;
        else kDrop = 0.9;   // sin hueco cercano: arriba del titular, centrado
      } catch (e) { /* sin canvas: posición por defecto */ }
    }
    function layout() {
      const g = geom();
      const base = (g.H > 1.2 * g.W ? 0.362 : 0.43) * g.sh;
      const size = Math.max(12, Math.min(
        0.625 * g.sw / perEm,
        0.92 * g.W / perEm,
        // 0.88 em del titular; si el kicker sube por encima, se le reserva su altura
        (g.top + base - (heroNavBottom() + 0.035 * g.H)) / Math.max(0.88, kDrop + 0.02)
      ));
      headline.style.setProperty('--F', size.toFixed(2) + 'px');
      headline.style.setProperty('--base', base.toFixed(2) + 'px');
      headline.style.setProperty('--asc', asc.toFixed(4));
      headline.style.setProperty('--koff', kOff.toFixed(4));
      headline.style.setProperty('--kdrop', String(kDrop));
    }
    measure();
    layout();
    const fontReady = document.fonts && document.fonts.load
      ? document.fonts.load('700 100px "Inter"').catch(() => {})
      : Promise.resolve();
    fontReady.then(() => { measure(); layout(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); layout(); });

    // Imágenes más nítidas si el escenario crece (ventana maximizada, rotación)
    let upgradeTimer = 0;
    function upgradeImages() {
      const w = pickW(geom().sw);
      if (w <= layerW) return;
      layerW = w;
      layerImgs.forEach(([el, tpl]) => {
        if (String(tpl).indexOf('{w}') < 0) return;
        const next = new Image();
        next.src = url(tpl, w);
        next.decode().then(() => { el.src = next.src; }, () => {});
      });
    }
    let resizeFrame = 0;
    const onResize = () => {
      if (!resizeFrame) resizeFrame = requestAnimationFrame(() => { resizeFrame = 0; layout(); });
      clearTimeout(upgradeTimer);
      upgradeTimer = setTimeout(upgradeImages, 400);
    };
    if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(hero);
    else window.addEventListener('resize', onResize);

    /* ---------- Lluvia: dos copias, cruce de 0.7 s, solo los primeros 3.6 s ---------- */
    const LOOP = 3.6;
    const XFADE = 0.75;
    let rainOn = false;
    let active = null;
    let heroVisible = true;
    const play = (v) => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
    function swap() {
      const prev = active;
      const next = prev === rainA ? rainB : rainA;
      active = next;
      next.currentTime = 0;
      play(next);
      next.classList.add('on');
      prev.classList.remove('on');
      setTimeout(() => {
        if (prev === active) return;
        prev.pause();
        prev.currentTime = 0;   // estacionada en su primer cuadro, lista para el siguiente cruce
      }, 800);
    }
    function check(v, time) {
      if (v === active && time >= LOOP - XFADE) swap();
    }
    [rainA, rainB].forEach((v) => {
      v.muted = true;
      v.addEventListener('timeupdate', () => check(v, v.currentTime));
      v.addEventListener('ended', () => { if (v === active) swap(); });
      if ('requestVideoFrameCallback' in v) {
        const onFrame = (now, meta) => { check(v, meta.mediaTime); v.requestVideoFrameCallback(onFrame); };
        v.requestVideoFrameCallback(onFrame);
      }
    });
    function loadRain() {
      if (!rainA.getAttribute('src')) { rainA.src = media.lluvia; rainB.src = media.lluvia; }
    }
    function startRain() {
      rainOn = true;
      loadRain();
      active = rainA;
      rainA.currentTime = 0;
      rainA.classList.add('on');
      if (heroVisible) play(rainA);
    }
    // Ahorro de batería: la lluvia se pausa cuando el hero sale de pantalla
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        heroVisible = entry.isIntersecting;
        if (!rainOn || !active) return;
        if (heroVisible) play(active);
        else { rainA.pause(); rainB.pause(); }
      }).observe(hero);
    }

    /* ---------- Estado final inmediato (movimiento reducido, enlace directo, modo imagen) ---------- */
    function showFinal(withRain) {
      body.classList.remove('is-intro');
      opening.hidden = true;
      doors.hidden = true;
      tilt.remove();
      if (withRain) startRain();
      else { rainA.remove(); rainB.remove(); }
      HL.store.emit('intro:done');
    }

    if (simple) {
      hero.classList.add('hero--simple');
      showFinal(false);
      return;
    }
    if (HL.reducedMotion()) {
      showFinal(false);
      return;
    }
    // Si se llega con un enlace directo (#propiedades, #propiedad/…), sin intro
    if (location.hash && location.hash !== '#inicio') {
      showFinal(true);
      return;
    }

    /* ---------- Medios de la apertura ---------- */
    const doorURL = url(media.puertas, pickW(geom().W));
    const doorImg = new Image();
    doorImg.fetchPriority = 'high';
    doorImg.src = doorURL;
    doorL.style.backgroundImage = doorR.style.backgroundImage = 'url("' + doorURL + '")';
    aerial.fetchPriority = 'high';
    aerial.src = url(media.aerea, layerW);
    tilt.muted = true;
    tilt.src = media.tilt;

    /* ---------- Línea de tiempo maestra (7.4 s, un reloj) ---------- */
    const D = 7400;
    const anims = [];
    const off = (s) => Math.min(1, Math.max(0, (s * 1000) / D));
    // pts: [[segundos, {propiedad: valor}, easing hacia el siguiente punto], ...]
    function track(el, pts) {
      const kf = [];
      const first = pts[0];
      const last = pts[pts.length - 1];
      if (first[0] > 0) kf.push(Object.assign({ offset: 0 }, first[1]));
      pts.forEach(([t, v, e]) => kf.push(Object.assign({ offset: off(t), easing: e || 'linear' }, v)));
      if (last[0] * 1000 < D) kf.push(Object.assign({ offset: 1 }, last[1]));
      const a = el.animate(kf, { duration: D, fill: 'both' });
      a.pause();
      a.currentTime = 0;
      anims.push(a);
    }
    const tY = (v) => ({ transform: 'translateY(' + v + ')' });
    const tX = (v) => ({ transform: 'translateX(' + v + ')' });
    const op = (v) => ({ opacity: v });
    const rise = 'cubic-bezier(.2,.65,.3,1)';

    track(doorL, [[0.02, tX('0'), 'cubic-bezier(.1,.2,.8,1)'], [1.13, tX('-101%')]]);
    track(doorR, [[0.02, tX('0'), 'cubic-bezier(.4,.6,.9,1)'], [1.24, tX('101%')]]);
    track(tilt, [[1.19, op(0), 'ease-in-out'], [1.47, op(1)]]);
    track(opening, [[2.45, op(1), 'cubic-bezier(.45,0,.55,1)'], [2.95, op(0)]]);
    // La barra se desliza; el fundido va en sus tres grupos (el blur de las pills sigue viendo el cielo)
    track(nav, [[2.45, tY('-6px'), 'ease-out'], [2.75, tY('0')]]);
    Array.from(nav.children).forEach((part) => track(part, [[2.45, op(0), 'ease-out'], [2.75, op(1)]]));
    track(kicker, [
      [2.45, { opacity: 0, transform: 'translateY(.5em)' }, rise],
      [3.10, { opacity: 1, transform: 'translateY(0)' }]
    ]);
    letters.forEach((el, i) => {
      const t = 2.45 + i * 0.054;
      track(el, [
        [t, { opacity: 0, transform: 'translateY(.14em)' }, rise],
        [t + 0.70, { opacity: 1, transform: 'translateY(0)' }]
      ]);
    });
    track(shade, [[2.90, op(0), 'ease-in-out'], [3.70, op(1)]]);
    track(back, [[2.90, tY('0'), 'cubic-bezier(.45,0,.35,1)'], [4.30, tY('-1.5%')]]);
    track(mid, [
      [2.90, tY('0'), 'cubic-bezier(.45,0,.3,1)'],
      [4.30, tY('-4%')],
      [4.60, tY('-4%'), 'cubic-bezier(.45,0,.55,1)'],
      [6.90, tY('0')]
    ]);
    track(headline, [[3.00, tY('6%'), 'cubic-bezier(.3,0,.4,1)'], [4.80, tY('0')]]);
    track(front, [
      [3.35, tY('66%'), 'cubic-bezier(.2,.5,.2,1)'],
      [6.00, tY('-2.5%'), 'cubic-bezier(.45,0,.55,1)'],
      [7.30, tY('0')]
    ]);
    // El buscador aparece cuando la figura ya se asentó ("translate" no pisa su centrado)
    track(search, [
      [5.80, { opacity: 0, translate: '0 14px' }, 'cubic-bezier(.2,.65,.3,1)'],
      [6.80, { opacity: 1, translate: '0 0' }]
    ]);

    /* ---------- Video del tilt: el clip completo dentro de 1.25 → 2.85 s ---------- */
    const W0 = 1.25;
    const W1 = 2.85;
    let tiltStarted = false;
    let tiltDone = false;
    let tiltScrub = false;   // si el navegador niega autoplay (modo ahorro), se avanza cuadro a cuadro
    const clipLength = () => (isFinite(tilt.duration) && tilt.duration > 0 ? tilt.duration : 5.0417);
    function driveTilt(s) {
      if (tiltDone || s < W0) return;
      const dur = clipLength();
      if (s >= W1) {
        tiltDone = true;
        tilt.pause();
        try { tilt.currentTime = Math.max(0, dur - 0.02); } catch (e) { /* aún no se puede buscar */ }
        return;
      }
      const base = dur / (W1 - W0);
      const target = ((s - W0) / (W1 - W0)) * dur;
      if (!tiltStarted) {
        tiltStarted = true;
        tilt.playbackRate = base;
        const p = tilt.play();
        if (p && p.catch) p.catch(() => { if (!tiltDone) tiltScrub = true; });
        return;
      }
      if (tiltScrub) {
        if (!tilt.seeking) { try { tilt.currentTime = target; } catch (e) { /* ignorar */ } }
        return;
      }
      // Empuja la velocidad hacia el reloj maestro (0.85–1.2 × la velocidad base)
      const k = Math.min(1.2, Math.max(0.85, 1 + (target - tilt.currentTime) * 1.5));
      const rate = base * k;
      if (Math.abs(tilt.playbackRate - rate) > base * 0.01) tilt.playbackRate = rate;
    }

    /* ---------- Reloj ---------- */
    let started = false;
    let t0 = -1;
    function frame(now) {
      if (t0 < 0) t0 = now;
      const t = Math.min(D, Math.max(0, now - t0));
      anims.forEach((a) => { a.currentTime = t; });
      const s = t / 1000;
      if (!rainOn && s >= 2.4) startRain();
      driveTilt(s);
      if (t >= D) finish();
      else requestAnimationFrame(frame);
    }
    function finish() {
      anims.forEach((a) => a.cancel());
      anims.length = 0;
      body.classList.remove('is-intro');
      opening.hidden = true;
      doors.hidden = true;
      doorL.style.backgroundImage = doorR.style.backgroundImage = '';
      tilt.pause();
      tilt.removeAttribute('src');
      tilt.load();
      HL.store.emit('intro:done');
    }
    function start() {
      if (started) return;
      started = true;
      loadRain();
      requestAnimationFrame(frame);
    }

    /* ---------- Arranca cuando todo está listo (+120 ms), o a los 5 s de todos modos ---------- */
    function ready(el) {
      return new Promise((resolve) => {
        if (el.tagName === 'VIDEO') {
          if (el.readyState >= 4) return resolve();
          el.addEventListener('canplaythrough', resolve, { once: true });
          el.addEventListener('error', resolve, { once: true });
          return;
        }
        const wait = () => {
          if (el.complete) return resolve();
          el.addEventListener('load', resolve, { once: true });
          el.addEventListener('error', resolve, { once: true });
        };
        if (el.decode) el.decode().then(resolve, wait);
        else wait();
      });
    }
    Promise.all([ready(doorImg), ready(aerial)]
      .concat(layerImgs.map(([el]) => ready(el)), ready(tilt), fontReady))
      .then(() => setTimeout(start, 120));
    setTimeout(start, 5000);
  }
})(window.HL = window.HL || {});
