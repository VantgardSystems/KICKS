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

  // Inicio -------------------------------------------------------------------
  document.querySelectorAll('[data-wa-contact]').forEach((a) => {
    a.href = waLink();
  });

  applyTheme(PRODUCTS[0].colors[0].theme);
})();
