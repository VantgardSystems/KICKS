/* =====================================================================
   CATÁLOGO — buscador del hero, filtros en vivo, ordenamiento y tarjetas.
   Filtra sin recargar; usa View Transitions cuando el navegador las tiene
   (reacomodo fluido) y una entrada suave como respaldo.
   ===================================================================== */
(function (HL) {
  'use strict';

  const SITE = window.SITE;
  const CARD_SIZES = '(max-width: 720px) 100vw, (max-width: 1140px) 50vw, 400px';
  let grid, form, heroForm, countEl, emptyEl;
  const cards = new Map();   // id → <li>
  let activeTransition = null;

  HL.catalog = { init };

  function init() {
    grid = HL.$('#catalog-grid');
    form = HL.$('#catalog-filters');
    heroForm = HL.$('#hero-search');
    countEl = HL.$('#catalog-count');
    emptyEl = HL.$('#catalog-empty');

    fillStaticSelects();
    SITE.propiedades.forEach((p) => {
      const li = document.createElement('li');
      li.dataset.id = p.id;
      li.style.viewTransitionName = 'card-' + p.id.toLowerCase();
      li.innerHTML = cardHTML(p);
      cards.set(p.id, li);
      grid.appendChild(li);
    });

    bindHeroSearch();
    bindToolbar();
    bindCards();

    HL.store.on('filters', (d) => { syncToolbar(); apply(d && d.source !== 'init'); });
    HL.store.on('currency', () => {
      fillBudget(form.elements.presupuesto, HL.store.state.filters.op, HL.store.state.filters.presupuesto);
      fillBudget(heroForm.elements.presupuesto, heroOp(), heroForm.elements.presupuesto.value);
      cards.forEach((li, id) => { HL.$('.price', li).outerHTML = priceHTML(HL.byId(id)); });
      paintCurrencyToggle();
    });
    HL.store.on('saved', paintSaved);

    syncToolbar();
    paintCurrencyToggle();
    apply(false);
  }

  /* ---------- Opciones de los selects ---------- */
  function fillStaticSelects() {
    // En el buscador del hero el espacio es corto: "Todos" / "Todas" (la etiqueta ya dice qué es)
    const tipos = (all) => '<option value="">' + all + '</option>' + SITE.catalogo.tipos.map((t) => '<option>' + HL.esc(t) + '</option>').join('');
    const zonas = (all) => '<option value="">' + all + '</option>' + HL.zones().map((z) => '<option value="' + HL.esc(z.value) + '">' + HL.esc(z.label) + '</option>').join('');
    form.elements.tipo.innerHTML = tipos('Todos los tipos');
    form.elements.zona.innerHTML = zonas('Todas las zonas');
    heroForm.elements.tipo.innerHTML = tipos('Todos');
    heroForm.elements.zona.innerHTML = zonas('Todas');
    fillBudget(form.elements.presupuesto, 'todas', '');
    fillBudget(heroForm.elements.presupuesto, 'venta', '');
  }

  /* Rangos de presupuesto en la moneda activa. Valor: "venta|min|max" en MXN */
  function budgetOptions(kind) {
    const cur = HL.store.state.currency;
    const rent = kind === 'renta';
    const f = (mxn) => HL.money(HL.fromMXN(mxn, cur), cur, { compact: true });
    const per = rent ? '/mes' : '';
    return SITE.catalogo.presupuestos[kind].map(([min, max]) => {
      const label = !min ? 'Hasta ' + f(max) : max == null ? 'Más de ' + f(min) : f(min) + ' – ' + f(max);
      return '<option value="' + kind + '|' + min + '|' + (max == null ? '' : max) + '">' + label + per + '</option>';
    }).join('');
  }
  function fillBudget(select, op, keep) {
    let html = '<option value="">Cualquiera</option>';
    if (op === 'renta') html += budgetOptions('renta');
    else if (op === 'venta' || op === 'preventa') html += budgetOptions('venta');
    else html += '<optgroup label="Compra y preventa">' + budgetOptions('venta') + '</optgroup><optgroup label="Renta mensual">' + budgetOptions('renta') + '</optgroup>';
    select.innerHTML = html;
    select.value = Array.from(select.options).some((o) => o.value === keep) ? keep : '';
  }

  /* ---------- Buscador del hero ---------- */
  const heroOp = () => (heroForm.querySelector('input[name="op"]:checked') || {}).value || 'venta';
  function bindHeroSearch() {
    heroForm.addEventListener('change', (e) => {
      if (e.target.name === 'op') fillBudget(heroForm.elements.presupuesto, heroOp(), '');
    });
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      HL.store.setFilters({
        op: heroOp(),
        tipo: heroForm.elements.tipo.value,
        zona: heroForm.elements.zona.value,
        presupuesto: heroForm.elements.presupuesto.value,
        recamaras: 0
      }, 'hero');
      const target = HL.$('#propiedades');
      target.scrollIntoView({ behavior: HL.reducedMotion() ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Barra de filtros ---------- */
  function bindToolbar() {
    form.addEventListener('submit', (e) => e.preventDefault());
    form.addEventListener('change', (e) => {
      const el = e.target;
      if (!el.name) return;
      const patch = {};
      if (el.name === 'op') {
        patch.op = el.value;
        // Al cambiar entre compra y renta, el rango anterior deja de tener sentido
        const cur = HL.store.state.filters.presupuesto;
        const kind = cur ? cur.split('|')[0] : '';
        if (cur && ((el.value === 'renta' && kind !== 'renta') || ((el.value === 'venta' || el.value === 'preventa') && kind !== 'venta'))) patch.presupuesto = '';
      } else if (el.name === 'recamaras') {
        patch.recamaras = Number(el.value) || 0;
      } else {
        patch[el.name] = el.value;
      }
      HL.store.setFilters(patch, 'toolbar');
    });
    HL.$$('[data-clear-filters]').forEach((b) => b.addEventListener('click', () => HL.store.resetFilters('clear')));
    HL.$$('[data-currency]', form).forEach((b) => b.addEventListener('click', () => HL.store.setCurrency(b.dataset.currency)));
  }
  function syncToolbar() {
    const f = HL.store.state.filters;
    const radio = form.querySelector('input[name="op"][value="' + f.op + '"]');
    if (radio) radio.checked = true;
    form.elements.tipo.value = f.tipo;
    form.elements.zona.value = f.zona;
    fillBudget(form.elements.presupuesto, f.op, f.presupuesto);
    form.elements.recamaras.value = String(f.recamaras || 0);
    form.elements.orden.value = f.orden;
  }
  function paintCurrencyToggle() {
    HL.$$('[data-currency]', form).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.currency === HL.store.state.currency)));
  }

  /* ---------- Filtrar y ordenar ---------- */
  function matches(p, f) {
    if (f.op !== 'todas' && p.operacion !== f.op) return false;
    if (f.tipo && p.tipo !== f.tipo) return false;
    if (f.zona && p.ubicacion.zona !== f.zona) return false;
    if (f.recamaras && (p.recamaras || 0) < f.recamaras) return false;
    if (f.presupuesto) {
      const [kind, min, max] = f.presupuesto.split('|');
      if ((kind === 'renta') !== (p.operacion === 'renta')) return false;
      const v = HL.priceMXN(p);
      if (v < Number(min)) return false;
      if (max !== '' && v > Number(max)) return false;
    }
    return true;
  }
  const SORTS = {
    recientes: (a, b) => b.publicado.localeCompare(a.publicado),
    'precio-asc': (a, b) => HL.priceMXN(a) - HL.priceMXN(b),
    'precio-desc': (a, b) => HL.priceMXN(b) - HL.priceMXN(a),
    superficie: (a, b) => HL.mainArea(b) - HL.mainArea(a),
    plusvalia: (a, b) => (b.plusvalia || 0) - (a.plusvalia || 0)
  };
  function apply(animate) {
    const f = HL.store.state.filters;
    const list = SITE.propiedades.filter((p) => matches(p, f)).sort(SORTS[f.orden] || SORTS.recientes);
    const visible = new Set(list.map((p) => p.id));

    const update = () => {
      cards.forEach((li, id) => {
        const show = visible.has(id);
        if (show && li.hidden && animate && !document.startViewTransition) {
          li.classList.remove('is-entering');
          void li.offsetWidth;
          li.classList.add('is-entering');
        }
        li.hidden = !show;
      });
      list.forEach((p) => grid.appendChild(cards.get(p.id)));
      emptyEl.hidden = list.length > 0;
    };

    const gridOnScreen = grid.getBoundingClientRect().top < window.innerHeight && grid.getBoundingClientRect().bottom > 0;
    if (animate && document.startViewTransition && !HL.reducedMotion() && gridOnScreen) {
      // Si llega otro filtro a media animación, se salta la anterior (sus promesas se rechazan a propósito)
      if (activeTransition) activeTransition.skipTransition();
      const vt = document.startViewTransition(update);
      activeTransition = vt;
      const quiet = () => {};
      vt.ready.catch(quiet);
      vt.updateCallbackDone.catch(quiet);
      vt.finished.catch(quiet).then(() => { if (activeTransition === vt) activeTransition = null; });
    } else update();

    const n = list.length;
    countEl.innerHTML = '<strong>' + n + '</strong> ' + (n === 1 ? 'propiedad' : 'propiedades');
    const dirty = ['op', 'tipo', 'zona', 'presupuesto', 'recamaras'].some((k) => String(f[k]) !== String(HL.store.defaults[k]));
    HL.$$('[data-clear-filters]', form).forEach((b) => { b.hidden = !dirty; });
    const alert = HL.$('[data-alert-wa]', emptyEl);
    if (alert) alert.href = HL.waLink(SITE.contacto.whatsapp, alertMessage(f));
  }
  function alertMessage(f) {
    const ops = { todas: 'cualquier operación', venta: 'compra', renta: 'renta', preventa: 'preventa' };
    const parts = ['Hola, busco una propiedad en ' + ops[f.op]];
    if (f.tipo) parts.push('tipo: ' + f.tipo);
    if (f.zona) parts.push('zona: ' + f.zona);
    if (f.presupuesto) {
      const opt = HL.$('select[name="presupuesto"] option[value="' + CSS.escape(f.presupuesto) + '"]', form);
      if (opt) parts.push('presupuesto: ' + opt.textContent);
    }
    if (f.recamaras) parts.push(f.recamaras + '+ recámaras');
    return parts.join(', ') + '. ¿Me avisan cuando tengan algo así? Gracias.';
  }

  /* ---------- Tarjeta ---------- */
  function priceHTML(p) {
    const pp = HL.priceParts(p, HL.store.state.currency);
    return '<p class="price"><span class="price__main">' + (pp.prefix ? '<small>' + pp.prefix + '</small>' : '') + pp.main +
      (pp.suffix ? '<small>' + pp.suffix + '</small>' : '') + '</span><span class="price__alt">' + pp.alt + '</span></p>';
  }
  HL.priceHTML = priceHTML;

  function specsHTML(p) {
    const s = p.superficie || {};
    const items = [];
    const add = (icon, value, unit, hidden) => items.push('<li>' + HL.icon(icon) + '<span><strong>' + value + '</strong>' + (unit ? ' ' + unit : '') + (hidden ? '<span class="visually-hidden"> ' + hidden + '</span>' : '') + '</span></li>');
    if (s.construccion) add('area', HL.num(s.construccion), 'm²', 'de construcción');
    if (s.terreno) add('land', HL.num(s.terreno), 'm²', 'de terreno');
    else if (s.terraza) add('terrace', HL.num(s.terraza), 'm²', 'de terraza');
    if (p.recamaras) add('bed', p.recamaras, 'rec.', 'recámaras');
    if (p.banos) add('bath', String(p.banos), 'baños');
    if (p.estacionamientos) add('car', p.estacionamientos, 'estac.', 'cajones de estacionamiento');
    if (p.usoSuelo && !p.recamaras) items.push('<li>' + HL.icon('info') + '<span>' + HL.esc(p.usoSuelo.split('·')[0].trim()) + '</span></li>');
    return '<ul class="specs" aria-label="Características">' + items.join('') + '</ul>';
  }
  HL.specsHTML = specsHTML;

  function mediaHTML(p) {
    const photos = HL.photos(p);
    const slides = photos.length
      ? photos.map((ph, i) => HL.img(ph, CARD_SIZES, i ? '' : 'fetchpriority="low"')).join('')
      : HL.placeholder(p);
    const multi = photos.length > 1;
    return '<div class="card__media">' +
      '<div class="track" tabindex="-1">' + slides + '</div>' +
      '<div class="card__badges">' + badgesHTML(p) + '</div>' +
      '<button class="icon-btn card__save" type="button" data-save="' + p.id + '" aria-pressed="' + HL.store.isSaved(p.id) + '" aria-label="' + HL.esc('Guardar para comparar: ' + p.titulo) + '">' + HL.icon('heart') + '</button>' +
      (multi ? '<button class="icon-btn card__arrow card__arrow--prev" type="button" data-step="-1" aria-label="Foto anterior">' + HL.icon('left') + '</button>' +
        '<button class="icon-btn card__arrow card__arrow--next" type="button" data-step="1" aria-label="Foto siguiente">' + HL.icon('right') + '</button>' +
        '<div class="dots" aria-hidden="true">' + photos.map((_, i) => '<i' + (i ? '' : ' class="is-on"') + '></i>').join('') + '</div>' : '') +
      (p.plusvalia ? '<span class="card__growth">' + HL.icon('trend') + '+' + HL.dec(p.plusvalia) + ' % plusvalía anual</span>' : '') +
      '</div>';
  }
  function badgesHTML(p) {
    return '<span class="badge badge--' + p.operacion + '">' + HL.esc(HL.opBadge(p.operacion)) + '</span>' +
      (p.exclusiva ? '<span class="badge badge--exclusiva">Exclusiva</span>' : '');
  }
  HL.badgesHTML = badgesHTML;

  function cardHTML(p) {
    return '<article class="card glass-static">' +
      mediaHTML(p) +
      '<div class="card__body">' +
        priceHTML(p) +
        '<h3 class="card__title"><button class="card__open" type="button" data-open="' + p.id + '">' + HL.esc(p.titulo) + '</button></h3>' +
        '<p class="loc">' + HL.icon('pin') + '<span>' + HL.esc(p.ubicacion.zona + ', ' + (p.ubicacion.ciudad !== p.ubicacion.zona ? p.ubicacion.ciudad + ', ' : '') + p.ubicacion.estado) + '</span></p>' +
        specsHTML(p) +
      '</div>' +
      '<footer class="card__foot"><span>' + HL.esc(p.id) + ' · ' + HL.esc(p.tipo) + '</span><span class="link-arrow" aria-hidden="true">Ver detalles' + HL.icon('arrow') + '</span></footer>' +
    '</article>';
  }

  /* ---------- Interacción de tarjetas (delegada) ---------- */
  function bindCards() {
    grid.addEventListener('click', (e) => {
      const save = e.target.closest('[data-save]');
      if (save) { HL.toggleSave(save.dataset.save); return; }
      const step = e.target.closest('[data-step]');
      if (step) {
        const track = HL.$('.track', step.closest('.card__media'));
        track.scrollBy({ left: Number(step.dataset.step) * track.clientWidth, behavior: HL.reducedMotion() ? 'auto' : 'smooth' });
        return;
      }
      const open = e.target.closest('[data-open]') || (e.target.closest('.track img') && e.target.closest('li[data-id]'));
      if (open) HL.property.open(open.dataset.open || open.dataset.id, open.closest('li').querySelector('.card__open'));
    });
    // Puntos de la galería según la foto visible
    grid.addEventListener('scroll', (e) => {
      const track = e.target;
      if (!track.classList || !track.classList.contains('track')) return;
      const dots = HL.$$('.dots i', track.parentElement);
      if (!dots.length) return;
      const i = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
    }, { capture: true, passive: true });
  }
  function paintSaved() {
    cards.forEach((li, id) => {
      const b = HL.$('[data-save]', li);
      if (b) b.setAttribute('aria-pressed', String(HL.store.isSaved(id)));
    });
  }

  /* Guardar / quitar del comparador (usado por tarjetas y modal) */
  HL.toggleSave = (id) => {
    const p = HL.byId(id);
    const r = HL.store.toggleSaved(id);
    if (!r.ok) {
      HL.toast('Puedes comparar hasta ' + HL.MAX_COMPARE + ' propiedades. Quita una para agregar otra.');
      return false;
    }
    HL.toast(r.saved ? p.titulo + ' se guardó para comparar' : p.titulo + ' se quitó de tus guardadas');
    return true;
  };
})(window.HL = window.HL || {});
