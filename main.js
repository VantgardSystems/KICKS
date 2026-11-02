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
    img: $('.hero__img', hero),
    drawing: $('.hero__drawing', hero),
    model: $('.hero__model', hero),
    sidePrev: $('[data-hero-side="prev"]', hero),
    sideNext: $('[data-hero-side="next"]', hero),
  };

  const state = { p: 0, c: 0, size: null };
  const sidesMQ = window.matchMedia('(min-width: 1024px)');
  let renderToken = 0;

  const wrap = (i) => (i + PRODUCTS.length) % PRODUCTS.length;
  const current = () => {
    const product = PRODUCTS[state.p];
    return { product, color: product.colors[state.c] };
  };
  const labelOf = (product, color) => `${product.brand} ${product.name} color ${color.name}`;

  // Tenis central: modelo 3D si existe el .glb; si no, foto WebP; si no, dibujo
  async function paintMain(product, color, token) {
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
  async function paintSide(box, product, token) {
    const color = product.colors[0];
    const ok = await hasImage(color.img);
    if (token !== renderToken) return;
    box.innerHTML = ok
      ? `<img src="${color.img}" alt="" width="1200" height="600" decoding="async">`
      : shoeDrawing(color);
  }

  function paintSides(token) {
    if (!sidesMQ.matches) return;
    paintSide(el.sidePrev, PRODUCTS[wrap(state.p - 1)], token);
    paintSide(el.sideNext, PRODUCTS[wrap(state.p + 1)], token);
  }

  sidesMQ.addEventListener('change', () => paintSides(renderToken));

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

  function render() {
    const token = ++renderToken;
    const { product, color } = current();

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
    paintMain(product, color, token);
    paintSides(token);

    // Precarga los otros colores y los pares vecinos para que el cambio sea inmediato
    product.colors.forEach((c) => hasImage(c.img));
    hasImage(PRODUCTS[wrap(state.p + 1)].colors[0].img);
    hasImage(PRODUCTS[wrap(state.p - 1)].colors[0].img);
  }

  function setProduct(index) {
    const p = wrap(index);
    if (p === state.p) return;
    state.p = p;
    state.c = 0;
    renderColors(PRODUCTS[p]);
    render();
  }

  function setColor(index) {
    if (index === state.c) return;
    state.c = index;
    render();
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
    btn.addEventListener('click', () => setProduct(state.p + Number(btn.dataset.go)));
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

  // Inicio -------------------------------------------------------------------
  document.querySelectorAll('[data-wa-contact]').forEach((a) => {
    a.href = waLink();
  });

  renderColors(PRODUCTS[state.p]);
  render();
})();
