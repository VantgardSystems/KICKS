// Sneaker District: lógica de la página.
// Los datos (STORE, SIZES, PRODUCTS, DROPS, REVIEWS, formatPrice) vienen de products.js.
(() => {
  'use strict';

  const root = document.documentElement;
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
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
  const header = document.querySelector('.site-header');
  const menuBtn = header.querySelector('.menu-btn');
  const menu = document.getElementById('menu');
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
    if (open && e.detail === 0) menu.querySelector('a').focus();
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

  window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
    if (e.matches && isMenuOpen()) setMenu(false);
  });

  // Inicio -------------------------------------------------------------------
  document.querySelectorAll('[data-wa-contact]').forEach((a) => {
    a.href = waLink();
  });

  applyTheme(PRODUCTS[0].colors[0].theme);
})();
