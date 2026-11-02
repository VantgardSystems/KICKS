// Sneaker District: lógica de la página.
// Los datos (STORE, SIZES, PRODUCTS, DROPS, REVIEWS, formatPrice) vienen de products.js.
(() => {
  'use strict';

  const $ = (sel, el = document) => el.querySelector(sel);
  const root = document.documentElement;
  const themeColorMeta = $('meta[name="theme-color"]');
  const THEME_KEYS = ['bg', 'ink', 'muted', 'disc', 'big', 'accent', 'on'];

  // WhatsApp ---------------------------------------------------------------
  const waLink = (text) =>
    'https://wa.me/' + STORE.whatsapp + (text ? '?text=' + encodeURIComponent(text) : '');

  // Tema del hero: escribe las variables CSS que usan header y hero ---------
  function applyTheme(theme) {
    THEME_KEYS.forEach((key) => root.style.setProperty('--' + key, theme[key]));
    if (themeColorMeta) themeColorMeta.setAttribute('content', theme.bg);
  }

  // Menú en celular ------------------------------------------------------------
  const header = $('.site-header');
  const menuBtn = $('.menu-btn', header);
  const menu = $('#menu');
  const isMenuOpen = () => header.hasAttribute('data-menu-open');

  function setMenu(open, focusButton) {
    header.toggleAttribute('data-menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (!open && focusButton) menuBtn.focus();
  }

  menuBtn.addEventListener('click', (e) => {
    const open = !isMenuOpen();
    setMenu(open);
    // Abierto con teclado (detail 0): el foco pasa al primer link
    if (open && e.detail === 0) $('a', menu).focus();
  });

  menu.addEventListener('click', (e) => {
    if (e.target.closest('a') && isMenuOpen()) setMenu(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen()) setMenu(false, true);
  });

  document.addEventListener('click', (e) => {
    if (isMenuOpen() && !header.contains(e.target)) setMenu(false);
  });

  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    if (e.matches && isMenuOpen()) setMenu(false);
  });

  // Fotos y modelos: se revisa una sola vez si cada archivo existe ----------
  const imageCache = new Map();
  function hasImage(url) {
    if (!imageCache.has(url)) {
      imageCache.set(url, new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      }));
    }
    return imageCache.get(url);
  }

  const modelCache = new Map();
  function hasModel(url) {
    if (!modelCache.has(url)) {
      // Abriendo el archivo directo (file://) no se pueden cargar .glb: se usa la foto
      const check = location.protocol.startsWith('http')
        ? fetch(url, { method: 'HEAD' }).then((r) => r.ok).catch(() => false)
        : Promise.resolve(false);
      modelCache.set(url, check);
    }
    return modelCache.get(url);
  }

  // Dibujo de relleno (el de la inspiración) mientras no exista la foto WebP
  function shoeDrawing(color, label) {
    const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
    return `<svg class="shoe-svg" viewBox="0 0 400 190" ${a11y}>
      <path d="M18 150 L390 150 L390 162 Q388 176 366 178 L40 178 Q18 176 18 162 Z" fill="${color.sole}"/>
      <path d="M116 42 Q126 18 152 24 L160 40 Z" fill="${color.upper}"/>
      <path d="M24 150 Q20 104 52 84 L116 42 Q136 30 158 38 L204 62 Q236 76 276 86 L344 104 Q384 116 386 150 Z" fill="${color.upper}"/>
      <path d="M64 150 Q104 104 186 98 Q258 94 340 124 L352 150 Z" fill="${color.panel}"/>
      <path d="M24 150 Q20 104 52 84 L66 76 Q80 118 74 150 Z" fill="${color.panel}"/>
      <path d="M300 98 Q372 110 386 150 L320 150 Q320 120 300 98 Z" fill="${color.panel}"/>
      <path class="hl" d="M60 96 Q108 62 150 44 Q192 60 236 76 Q196 72 150 62 Q104 76 60 104 Z" fill="#FFFFFF" opacity="0.2"/>
      <path class="hl" d="M30 150 Q26 126 40 110 Q60 138 130 148 Z" fill="#000000" opacity="0.14"/>
      <path class="lace" d="M150 50 L168 58 M172 60 L190 68 M194 70 L212 77 M216 79 L234 84"/>
    </svg>`;
  }

  // Foto de un par para tarjetas. Si el WebP no existe, se cambia solo por el dibujo.
  // (El evento error no burbujea: se escucha en fase de captura.)
  const findColor = (id, slug) => {
    const product = PRODUCTS.find((p) => p.id === id);
    return { product, color: product && product.colors.find((c) => c.slug === slug) };
  };

  function shoePic(product, color) {
    return `<img class="shoe-pic" src="${color.img}" alt="" width="1200" height="600" loading="lazy" decoding="async" data-shoe="${product.id}/${color.slug}">`;
  }

  document.addEventListener('error', (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement) || !img.dataset.shoe) return;
    const { color } = findColor(...img.dataset.shoe.split('/'));
    if (!color) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = shoeDrawing(color);
    const svg = tmp.firstElementChild;
    svg.classList.add('shoe-pic');
    img.replaceWith(svg);
  }, true);

  // Hero ---------------------------------------------------------------------
  const hero = $('.hero');
  const el = {
    short: $('[data-hero-short]', hero),
    brand: $('[data-hero-brand]', hero),
    name: $('[data-hero-name]', hero),
    price: $('[data-hero-price]', hero),
    colorName: $('[data-hero-color-name]', hero),
    colors: $('[data-hero-colors]', hero),
    sizes: $('[data-hero-sizes]', hero),
    dots: $('[data-hero-dots]', hero),
    cta: $('[data-hero-cta]', hero),
    main: $('.hero__main', hero),
    shoe: $('.hero__shoe', hero),
    fallback: $('[data-hero-fallback]', hero),
    img: $('.hero__img', hero),
    drawing: $('.hero__drawing', hero),
    model: $('.hero__model', hero),
    disc: $('.hero__disc', hero),
    bigname: $('.hero__bigname', hero),
    title: $('.hero__title', hero),
    swipe: $('.hero__swipe', hero),
    sidePrev: $('[data-hero-side="prev"]', hero),
    sideNext: $('[data-hero-side="next"]', hero),
  };

  const state = { p: 0, c: 0, size: null };
  const sidesMQ = window.matchMedia('(min-width: 1024px)');
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointerMQ = window.matchMedia('(hover: hover) and (pointer: fine)');
  const hasGSAP = typeof window.gsap !== 'undefined';
  const motionOK = () => hasGSAP && !reduceMQ.matches;
  let renderToken = 0;

  const wrap = (i) => (i + PRODUCTS.length) % PRODUCTS.length;
  const current = () => {
    const product = PRODUCTS[state.p];
    return { product, color: product.colors[state.c] };
  };
  const labelOf = (product, color) => `${product.brand} ${product.name} color ${color.name}`;

  // Animación ----------------------------------------------------------------
  // Misma curva que la transición del tema en CSS: cubic-bezier(.2, .8, .2, 1)
  function cubicBezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
    const sampleY = (t) => ((ay * t + by) * t + cy) * t;
    const slopeX = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return (p) => {
      if (p <= 0) return 0;
      if (p >= 1) return 1;
      let t = p;
      for (let i = 0; i < 8; i++) {
        const err = sampleX(t) - p;
        const slope = slopeX(t);
        if (Math.abs(err) < 1e-6 || Math.abs(slope) < 1e-6) break;
        t -= err / slope;
      }
      return sampleY(Math.min(1, Math.max(0, t)));
    };
  }
  const EASE = cubicBezier(0.2, 0.8, 0.2, 1);

  // Mientras cambia el tema (700 ms), las tallas siguen el ritmo del fondo
  let themingTimer = 0;
  function markTheming() {
    hero.setAttribute('data-theming', '');
    clearTimeout(themingTimer);
    themingTimer = setTimeout(() => hero.removeAttribute('data-theming'), 750);
  }

  // Al cambiar de par: círculo, nombre gigante y textos entran con el tenis
  function animateScene(dir) {
    if (!motionOK()) return;
    gsap.fromTo(el.disc, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: EASE, overwrite: true });
    gsap.fromTo(el.bigname, { x: 60 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: EASE, overwrite: true });
    gsap.fromTo(el.title, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: EASE, overwrite: true });
  }

  // Tenis: entra desde el lado hacia el que avanzas (x ±120, giro leve, 800 ms);
  // si solo cambia el color: fade + escala .92 a 1
  function animateShoe(change) {
    if (!motionOK() || !change.type) return;
    const isNewPair = change.type === 'product' || change.type === 'intro';
    gsap.fromTo(el.shoe,
      isNewPair
        ? { x: 120 * change.dir, rotation: 8 * change.dir, scale: 1, autoAlpha: 0 }
        : { x: 0, rotation: 0, scale: 0.92, autoAlpha: 0 },
      { x: 0, rotation: 0, scale: 1, autoAlpha: 1, duration: isNewPair ? 0.8 : 0.6, ease: EASE, overwrite: true });
  }

  // Extra: entrada al abrir la página. Espera las fuentes (máx. 0.8 s) para que
  // el nombre gigante no cambie de tipografía a media animación.
  const introReady = Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((resolve) => setTimeout(resolve, 800)),
  ]);

  // Tenis central: modelo 3D si existe el .glb; si no, foto WebP; si no, dibujo
  async function paintMain(product, color, token, onSwap) {
    const label = labelOf(product, color);
    const imgOk = await hasImage(color.img);
    if (token !== renderToken) return;

    if (imgOk) {
      el.img.src = color.img;
      el.img.alt = label;
      el.img.hidden = false;
      el.drawing.hidden = true;
      el.drawing.textContent = '';
    } else {
      el.drawing.innerHTML = shoeDrawing(color, label);
      el.drawing.hidden = false;
      el.img.hidden = true;
    }
    onSwap();

    const modelOk = await hasModel(color.glb);
    if (token !== renderToken) return;

    if (modelOk) {
      el.model.alt = label;
      if (imgOk) el.model.setAttribute('poster', color.img);
      else el.model.removeAttribute('poster');
      // Un solo <model-viewer>: solo cambia su src
      if (el.model.getAttribute('src') === color.glb && el.model.loaded) {
        el.main.dataset.model = 'ready';
      } else {
        el.main.dataset.model = 'loading';
        el.model.setAttribute('src', color.glb);
      }
    } else {
      delete el.main.dataset.model;
      el.model.removeAttribute('src');
    }
  }

  el.model.addEventListener('load', () => {
    if (el.model.getAttribute('src') === current().color.glb) el.main.dataset.model = 'ready';
  });

  el.model.addEventListener('error', () => {
    const url = current().color.glb;
    modelCache.set(url, Promise.resolve(false));
    delete el.main.dataset.model;
  });

  // Tenis anterior y siguiente (solo se pintan en pantallas grandes)
  async function paintSide(box, product, token, animate) {
    const color = product.colors[0];
    const ok = await hasImage(color.img);
    if (token !== renderToken) return;
    box.title = `Ver ${product.brand} ${product.name}`;
    box.innerHTML = ok
      ? `<img src="${color.img}" alt="" width="1200" height="600" decoding="async">`
      : shoeDrawing(color);
    if (animate && motionOK()) {
      gsap.fromTo(box.firstElementChild, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: EASE });
    }
  }

  function paintSides(token, animate) {
    if (!sidesMQ.matches) return;
    paintSide(el.sidePrev, PRODUCTS[wrap(state.p - 1)], token, animate);
    paintSide(el.sideNext, PRODUCTS[wrap(state.p + 1)], token, animate);
  }

  sidesMQ.addEventListener('change', () => paintSides(renderToken, false));

  // Extra: tocar el tenis de un lado cambia a ese par
  el.sidePrev.addEventListener('click', () => setProduct(state.p - 1, -1));
  el.sideNext.addEventListener('click', () => setProduct(state.p + 1, 1));

  // Mensaje prellenado: modelo, color y talla
  function updateCta() {
    const { product, color } = current();
    const base = `Hola, quiero los ${product.brand} ${product.name} color ${color.name}`;
    const text = state.size
      ? `${base} en talla ${state.size} MX.`
      : `${base}. ¿Qué tallas tienen disponibles?`;
    el.cta.href = waLink(text);
  }

  function renderColors(product) {
    el.colors.innerHTML = product.colors.map((c, j) => `
      <label class="swatch" title="${c.name}">
        <input class="visually-hidden" type="radio" name="color" value="${j}"${j === state.c ? ' checked' : ''}>
        <span class="swatch__dot" style="--c1: ${c.upper}; --c2: ${c.panel}" aria-hidden="true"></span>
        <span class="visually-hidden">${c.name}</span>
      </label>`).join('');
  }

  // change: {} sin animación, { type: 'intro', dir } al abrir,
  // { type: 'product', dir } al cambiar de par o { type: 'color' }
  function render(change = {}) {
    const token = ++renderToken;
    const { product, color } = current();

    if (change.type === 'product' || change.type === 'color') markTheming();
    applyTheme(color.theme);
    el.short.textContent = product.short;
    el.brand.textContent = product.brand;
    el.name.textContent = product.name;
    el.price.textContent = formatPrice(product.price);
    el.colorName.textContent = color.name;

    el.dots.querySelectorAll('.hero__dot').forEach((dot, i) => {
      dot.setAttribute('aria-current', i === state.p ? 'true' : 'false');
    });

    updateCta();
    if (change.type === 'product') animateScene(change.dir);
    if (change.type === 'intro') {
      introReady.then(() => {
        root.classList.remove('intro');
        animateScene(change.dir);
      });
    }
    paintMain(product, color, token, () => {
      if (change.type === 'intro') introReady.then(() => animateShoe(change));
      else animateShoe(change);
    });
    paintSides(token, change.type === 'product' || change.type === 'intro');

    // Precarga los otros colores y los pares vecinos para que el cambio sea inmediato
    product.colors.forEach((c) => hasImage(c.img));
    hasImage(PRODUCTS[wrap(state.p + 1)].colors[0].img);
    hasImage(PRODUCTS[wrap(state.p - 1)].colors[0].img);
  }

  // dir: 1 avanza (entra por la derecha), -1 retrocede (entra por la izquierda)
  function setProduct(index, dir) {
    const p = wrap(index);
    if (p === state.p) return;
    const step = dir || Math.sign(index - state.p) || 1;
    state.p = p;
    state.c = 0;
    renderColors(PRODUCTS[p]);
    render({ type: 'product', dir: step });
  }

  function setColor(index) {
    if (index === state.c) return;
    state.c = index;
    render({ type: 'color' });
  }

  // Controles del hero
  el.dots.innerHTML = PRODUCTS.map((p, i) =>
    `<button class="hero__dot" type="button" aria-label="Ver ${p.brand} ${p.name}" aria-current="${i === state.p}"></button>`
  ).join('');

  el.sizes.innerHTML = SIZES.map((s) => `
    <label class="size">
      <input class="visually-hidden" type="radio" name="talla" value="${s}">
      <span>${s}</span>
    </label>`).join('');

  hero.querySelectorAll('[data-go]').forEach((btn) => {
    const dir = Number(btn.dataset.go);
    btn.addEventListener('click', () => setProduct(state.p + dir, dir));
  });

  el.dots.addEventListener('click', (e) => {
    const dot = e.target.closest('.hero__dot');
    if (dot) setProduct([...el.dots.children].indexOf(dot));
  });

  el.colors.addEventListener('change', (e) => setColor(Number(e.target.value)));

  el.sizes.addEventListener('change', (e) => {
    state.size = e.target.value;
    updateCta();
  });

  // Teclado: flechas izquierda/derecha cambian de par mientras el hero está a la vista.
  // No interfiere con los radios (colores y tallas) ni con el modelo 3D enfocado.
  let heroInView = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { heroInView = entry.isIntersecting; }, { threshold: 0.2 })
      .observe(hero);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (!heroInView || isMenuOpen()) return;
    const target = e.target instanceof Element ? e.target : null;
    if (target && target.closest('input, textarea, select, [contenteditable="true"], model-viewer')) return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    setProduct(state.p + dir, dir);
  });

  // Deslizar con Draggable en la zona de abajo del tenis (no encima del modelo:
  // ahí arrastrar lo gira). Un swipe rápido basta aunque sea corto.
  if (hasGSAP && window.Draggable) {
    gsap.registerPlugin(Draggable);
    const proxy = document.createElement('div');
    proxy.className = 'hero__drag-proxy';
    el.swipe.appendChild(proxy);
    let dragStart = 0;

    Draggable.create(proxy, {
      type: 'x',
      trigger: el.swipe,
      dragClickables: true,
      minimumMovement: 6,
      cursor: 'grab',
      activeCursor: 'grabbing',
      onPress() {
        dragStart = performance.now();
      },
      onDragStart() {
        gsap.killTweensOf(el.shoe);
      },
      onDrag() {
        if (motionOK()) {
          const dx = gsap.utils.clamp(-160, 160, this.x);
          gsap.set(el.shoe, { x: dx * 0.5, rotation: dx * 0.03 });
        }
      },
      onDragEnd() {
        const dx = this.x;
        // Velocidad promedio del gesto (px/ms): un swipe rápido cuenta aunque sea corto
        const velocity = Math.abs(dx) / Math.max(1, performance.now() - dragStart);
        gsap.set(proxy, { x: 0 });
        this.update();

        if (Math.abs(dx) > 60 || (Math.abs(dx) > 20 && velocity > 0.15)) {
          const dir = dx < 0 ? 1 : -1;
          setProduct(state.p + dir, dir);
        } else if (motionOK()) {
          gsap.to(el.shoe, { x: 0, rotation: 0, scale: 1, autoAlpha: 1, duration: 0.35, ease: 'power3.out', overwrite: true });
        }
      },
    });
  }

  // Inclinación 3D con el puntero cuando se ve la foto en lugar del modelo
  if (hasGSAP) {
    const tiltX = gsap.quickTo(el.fallback, 'rotationX', { duration: 0.6, ease: 'power3' });
    const tiltY = gsap.quickTo(el.fallback, 'rotationY', { duration: 0.6, ease: 'power3' });

    el.main.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || !finePointerMQ.matches || !motionOK()) return;
      if (el.main.dataset.model === 'ready') return;
      const r = el.main.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tiltY(gsap.utils.clamp(-15, 15, px * 30));
      tiltX(gsap.utils.clamp(-15, 15, -py * 30));
    });

    el.main.addEventListener('pointerleave', () => {
      tiltX(0);
      tiltY(0);
    });
  }

  // Mostrar un par en el hero y subir hasta él (Marcas y Más vendidos).
  // El cambio ocurre cuando el hero ya se ve, para que la entrada no pase desapercibida.
  function showInHero(index) {
    // El foco pasa al nombre del par (útil con teclado y lector de pantalla)
    const go = () => {
      setProduct(index);
      el.name.focus({ preventScroll: true });
    };
    if (window.scrollY < 10 || reduceMQ.matches) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      go();
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const start = performance.now();
    const waitForHero = () => {
      if (window.scrollY < hero.offsetHeight * 0.5 || performance.now() - start > 1200) go();
      else requestAnimationFrame(waitForHero);
    };
    requestAnimationFrame(waitForHero);
  }

  // Marcas -------------------------------------------------------------------
  const brandsList = $('[data-brands]');
  const brands = [...new Set(PRODUCTS.map((p) => p.brand))];

  brandsList.innerHTML = brands.map((brand) =>
    `<li><a class="brands__link" href="#inicio" data-brand="${brand}">${brand}</a></li>`
  ).join('');

  brandsList.addEventListener('click', (e) => {
    const link = e.target.closest('[data-brand]');
    if (!link) return;
    e.preventDefault();
    showInHero(PRODUCTS.findIndex((p) => p.brand === link.dataset.brand));
  });

  // Lanzamientos: cada tarjeta usa el tema de su color -------------------------
  $('[data-drops]').innerHTML = DROPS.map(([id, slug, label]) => {
    const { product, color } = findColor(id, slug);
    const t = color.theme;
    const text = `Hola, quiero apartar los ${product.brand} ${product.name} color ${color.name} (${label}). ¿Qué tallas van a tener?`;
    return `
      <article class="drop" style="--bg: ${t.bg}; --ink: ${t.ink}; --muted: ${t.muted}; --disc: ${t.disc}; --accent: ${t.accent}; --on: ${t.on}">
        <div class="drop__media">
          ${shoePic(product, color)}
          <p class="drop__tag">${label}</p>
        </div>
        <div>
          <p class="drop__brand">${product.brand}</p>
          <h3 class="drop__name">${product.name}</h3>
          <p class="drop__meta">${color.name}, ${formatPrice(product.price)}</p>
        </div>
        <a class="btn btn--theme drop__cta" href="${waLink(text)}" target="_blank" rel="noopener">Apartar por WhatsApp</a>
      </article>`;
  }).join('');

  // Más vendidos: todos los PRODUCTS con el tema de su primer color ----------
  const bestList = $('[data-best]');

  bestList.innerHTML = PRODUCTS.map((product, i) => {
    const color = product.colors[0];
    return `
      <li>
        <a class="tile" href="#inicio" data-pick="${i}" style="--bg: ${color.theme.bg}">
          <div class="tile__media">${shoePic(product, color)}</div>
          <p class="tile__brand">${product.brand}</p>
          <h3 class="tile__name">${product.name}</h3>
          <p class="tile__price">${formatPrice(product.price)}</p>
        </a>
      </li>`;
  }).join('');

  bestList.addEventListener('click', (e) => {
    const tile = e.target.closest('[data-pick]');
    if (!tile) return;
    e.preventDefault();
    showInHero(Number(tile.dataset.pick));
  });

  // Movimiento reducido: sin auto-rotate ni inclinación, y nada a medio animar
  function syncMotion() {
    el.model.toggleAttribute('auto-rotate', !reduceMQ.matches);
    if (reduceMQ.matches && hasGSAP) {
      gsap.killTweensOf([el.shoe, el.disc, el.bigname, el.title, el.fallback]);
      gsap.set([el.shoe, el.disc, el.bigname, el.title, el.fallback], { clearProps: 'all' });
    }
  }

  reduceMQ.addEventListener('change', syncMotion);

  // Inicio -------------------------------------------------------------------
  document.querySelectorAll('[data-wa-contact]').forEach((a) => {
    a.href = waLink();
  });

  const playIntro = root.classList.contains('intro') && motionOK();
  if (!playIntro) root.classList.remove('intro');

  syncMotion();
  renderColors(PRODUCTS[state.p]);
  render(playIntro ? { type: 'intro', dir: 1 } : {});
})();
