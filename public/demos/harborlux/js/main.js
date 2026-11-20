/* =====================================================================
   MAIN — arranque. El orden importa: el hero primero (es lo que se ve),
   después el catálogo y las herramientas.
   ===================================================================== */
(function (HL) {
  'use strict';

  if (!window.SITE) {
    console.error('Falta js/data.js: el sitio no tiene contenido que mostrar.');
    return;
  }

  HL.pageTitle = document.title;

  const steps = [
    ['hero', () => HL.hero.init()],
    ['catálogo', () => HL.catalog.init()],
    ['detalle', () => HL.property.init()],
    ['comparador', () => HL.compare.init()],
    ['calculadora', () => HL.mortgage.init()],
    ['secciones', () => HL.sections.init()]
  ];
  // Si un módulo falla, el resto del sitio sigue funcionando
  steps.forEach(([name, fn]) => {
    try { fn(); } catch (e) { console.error('Error al iniciar ' + name + ':', e); }
  });

  // Enlace directo a una propiedad: #propiedad/<slug>
  const m = location.hash.match(/^#propiedad\/(.+)$/);
  if (m) {
    const p = HL.bySlug(decodeURIComponent(m[1]));
    if (p) setTimeout(() => HL.property.open(p.id), 50);
  }
})(window.HL = window.HL || {});
