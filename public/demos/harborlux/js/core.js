/* =====================================================================
   CORE — utilidades, íconos, formato y estado compartido.
   Todos los módulos cuelgan de window.HL. Scripts clásicos con "defer":
   funcionan incluso abriendo index.html directo desde el disco.
   ===================================================================== */
(function (HL) {
  'use strict';

  const SITE = window.SITE;

  /* ---------- DOM ---------- */
  HL.$ = (sel, root) => (root || document).querySelector(sel);
  HL.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  HL.esc = (value) => String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  HL.debounce = (fn, ms) => {
    let t = 0;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  };
  HL.reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Almacenamiento seguro (modo privado puede bloquearlo) ---------- */
  const key = (k) => SITE.marca.slug + ':' + k;
  HL.storage = {
    get(k, fallback) {
      try {
        const raw = localStorage.getItem(key(k));
        return raw == null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set(k, value) {
      try { localStorage.setItem(key(k), JSON.stringify(value)); } catch (e) { /* sin almacenamiento */ }
    }
  };

  /* ---------- Íconos (SVG en línea, trazo 1.7, viewBox 24) ---------- */
  const P = {
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
    area: '<path d="M4 4h16v16H4z"/><path d="M4 9h3M4 14h3M9 4v3M14 4v3"/>',
    land: '<path d="M3 20h18"/><path d="m4 20 4-9 4 5 3-4 5 8"/><circle cx="17" cy="6" r="2"/>',
    terrace: '<path d="M3 20h18M5 20v-7h14v7M3 13h18M12 4v9M8 8h8"/>',
    bed: '<path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 15h18M3 18v2M21 18v2"/><path d="M7 10V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3"/>',
    bath: '<path d="M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-3ZM6 12V6a2 2 0 0 1 4 0"/><path d="M7 20l-1 1.5M17 20l1 1.5"/>',
    car: '<path d="M5 16V11l2-5h10l2 5v5M5 16h14M5 16v2M19 16v2M4 11h16"/><circle cx="8" cy="13.5" r=".9"/><circle cx="16" cy="13.5" r=".9"/>',
    heart: '<path d="M12 20s-7.5-4.6-9-9.6C2.1 7 4.4 4 7.6 4c1.9 0 3.4 1 4.4 2.5C13 5 14.5 4 16.4 4c3.2 0 5.5 3 4.6 6.4-1.5 5-9 9.6-9 9.6Z"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
    walk: '<path d="M3 21h18M6 21V9l6-5 6 5v12"/><path d="M10 21v-6h4v6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 7 8.5-7"/>',
    photo: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
    plan: '<path d="M3 3h18v18H3z"/><path d="M3 12h7v9M14 3v7h7M14 14h7"/>',
    map: '<path d="m9 4-6 2.5v13L9 17l6 2.5 6-2.5V4l-6 2.5L9 4Z"/><path d="M9 4v13M15 6.5v13"/>',
    pano: '<ellipse cx="12" cy="12" rx="9" ry="4"/><path d="M12 3v2M12 19v2M7 12h.01M17 12h.01"/><path d="M3 12c0 3 4 6 9 6s9-3 9-6"/>',
    drag: '<path d="M8 12H3m0 0 3-3m-3 3 3 3M16 12h5m0 0-3-3m3 3-3 3"/><circle cx="12" cy="12" r="1.5"/>',
    columns: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/>',
    pool: '<path d="M3 17c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0M3 21c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0"/><path d="M8 15V5a2 2 0 0 1 4 0M16 15V5a2 2 0 0 0-4 0M8 9h8M8 12h8"/>',
    leaf: '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19 14 10"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    dumbbell: '<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/>',
    spa: '<path d="M12 21c-4.5 0-8-3-8-7 3 0 6 1.5 8 4 2-2.5 5-4 8-4 0 4-3.5 7-8 7Z"/><path d="M12 18c-2-2.5-2-6 0-9 2 3 2 6.5 0 9Z"/>',
    elevator: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="m9 9 3-3 3 3M9 15l3 3 3-3"/>',
    wave: '<path d="M2 12c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5-1M2 17c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5-1M2 7c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5-1"/>',
    tree: '<path d="M12 22v-6M8 16h8l-4-6 3 0-3-6-3 6h3l-4 6Z"/>',
    door: '<path d="M4 21h16M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17"/><circle cx="15" cy="12" r=".9"/>',
    paw: '<circle cx="6.5" cy="10" r="1.8"/><circle cx="10" cy="6" r="1.8"/><circle cx="14" cy="6" r="1.8"/><circle cx="17.5" cy="10" r="1.8"/><path d="M12 12c-3 0-5.5 3.5-5.5 5.5 0 1.7 1.5 2.5 3 2.5 1 0 1.6-.5 2.5-.5s1.5.5 2.5.5c1.5 0 3-.8 3-2.5C17.5 15.5 15 12 12 12Z"/>',
    laptop: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',
    box: '<path d="m3 7 9-4 9 4v10l-9 4-9-4V7Z"/><path d="m3 7 9 4 9-4M12 11v10"/>',
    chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/>',
    drop: '<path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11Z"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
    club: '<path d="M3 21h18M5 21V10l7-6 7 6v11"/><path d="M9 21v-5h6v5M9 11h6"/>',
    gate: '<path d="M3 21V6M21 21V6M3 9h18M7 9v12M11 9v12M15 9v12M19 9v12"/>',
    pipe: '<path d="M3 8h8a4 4 0 0 1 4 4v9M3 12h8M15 21h6M21 3v18"/>',
    snow: '<path d="M12 2v20M4.9 7l14.2 10M4.9 17 19.1 7"/><path d="m9 4 3 2 3-2M9 20l3-2 3 2"/>',
    house: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
    building: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M11 21v-3h2v3"/>',
    plot: '<path d="M4 18 8 6h8l4 12H4Z"/><path d="M8 6l-1 12M16 6l1 12M5.5 13h13"/>',
    store: '<path d="M4 10v10h16V10"/><path d="M3 10 5 4h14l2 6c0 1.5-1.3 2.5-2.7 2.5S15.5 11.5 15.5 10c0 1.5-1.4 2.5-2.8 2.5S10 11.5 10 10c0 1.5-1.3 2.5-2.7 2.5S3 11.5 3 10Z"/><path d="M10 20v-5h4v5"/>',
    valuacion: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    hipoteca: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="m9.5 17 5-5"/><circle cx="10" cy="12.5" r=".9"/><circle cx="14" cy="16.5" r=".9"/>',
    rentas: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M14.5 8.5l2 2"/>',
    exclusiva: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-2.5 5 2.5-1.5-7"/><path d="m9.5 9 1.8 1.8L14.7 7.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8.4 19L4 20Z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2L9 9.5Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'
  };
  HL.icon = (name, attrs) => {
    const body = P[name] || P.info;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"' + (attrs ? ' ' + attrs : '') + '>' + body + '</svg>';
  };
  HL.typeIcon = (tipo) => ({ Casa: 'house', Departamento: 'building', Terreno: 'plot', 'Local Comercial': 'store' })[tipo] || 'house';

  /* ---------- Moneda y formato ---------- */
  const M = SITE.moneda;
  const nf0 = new Intl.NumberFormat(M.locale, { maximumFractionDigits: 0 });
  const nf1 = new Intl.NumberFormat(M.locale, { maximumFractionDigits: 1 });
  const nf2 = new Intl.NumberFormat(M.locale, { maximumFractionDigits: 2 });
  HL.toMXN = (amount, from) => (from === 'USD' ? amount * M.tipoCambio : amount);
  HL.fromMXN = (mxn, to) => (to === 'USD' ? mxn / M.tipoCambio : mxn);
  HL.priceMXN = (p) => HL.toMXN(p.precio, p.moneda);
  HL.priceIn = (p, cur) => (p.moneda === cur ? p.precio : HL.fromMXN(HL.priceMXN(p), cur));
  HL.money = (value, cur, opts) => {
    const o = opts || {};
    const sym = cur === 'USD' ? 'US$' : '$';
    if (o.compact) {
      const v = Math.abs(value);
      const code = o.code && cur !== 'USD' ? ' ' + cur : '';
      if (v >= 1e6) return sym + (v >= 1e7 ? nf1 : nf2).format(value / 1e6) + ' M' + code;
      if (v >= 1e4) return sym + nf0.format(value / 1e3) + ' mil' + code;
    }
    return sym + nf0.format(Math.round(value)) + (o.code && cur !== 'USD' ? ' ' + cur : '');
  };
  HL.num = (n) => nf0.format(n);
  HL.dec = (n) => nf1.format(n);
  HL.m2 = (n) => nf0.format(n) + ' m²';
  /* Precio principal y alterno de una propiedad, en la moneda activa */
  HL.priceParts = (p, cur) => {
    const alt = cur === 'USD' ? M.local : 'USD';
    const isRent = p.operacion === 'renta';
    return {
      prefix: p.precioDesde ? 'Desde ' : '',
      main: HL.money(HL.priceIn(p, cur), cur, { code: true }),
      suffix: isRent ? '/mes' : '',
      alt: '≈ ' + HL.money(HL.priceIn(p, alt), alt, { compact: true, code: true }) + (isRent ? '/mes' : '')
    };
  };
  /* Precio por m²: construcción; si no hay, terreno */
  HL.pricePerM2 = (p, cur) => {
    const s = p.superficie || {};
    const area = s.construccion || s.terreno;
    return area ? HL.priceIn(p, cur) / area : null;
  };
  HL.mainArea = (p) => {
    const s = p.superficie || {};
    return (s.construccion || 0) + (s.terraza || 0) || s.terreno || 0;
  };

  /* ---------- Datos derivados ---------- */
  HL.byId = (id) => SITE.propiedades.find((p) => p.id === id);
  HL.bySlug = (slug) => SITE.propiedades.find((p) => p.slug === slug);
  HL.advisor = (id) => SITE.asesores.find((a) => a.id === id) || SITE.asesores[0];
  HL.zones = () => {
    const seen = new Map();
    SITE.propiedades.forEach((p) => {
      const z = p.ubicacion.zona;
      if (!seen.has(z)) seen.set(z, z + ', ' + p.ubicacion.estado);
    });
    return Array.from(seen, ([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label, 'es'));
  };
  HL.photos = (p) => (p.fotos || []).filter((f) => !f.pendiente);
  HL.initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  HL.opBadge = (op) => (SITE.catalogo.operaciones[op] || {}).badge || op;
  HL.locationText = (p) => {
    const u = p.ubicacion;
    return u.direccion + ', ' + u.zona + (u.ciudad && u.ciudad !== u.zona ? ', ' + u.ciudad : '') + ', ' + u.estado;
  };

  /* ---------- Enlaces de contacto ---------- */
  HL.waLink = (number, text) => 'https://wa.me/' + String(number).replace(/\D/g, '') + '?text=' + encodeURIComponent(text);
  HL.mailLink = (to, subject, body) => 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  HL.propertyUrl = (p) => {
    const base = /^https?:/.test(location.protocol) ? location.href.split('#')[0] : SITE.marca.url + '/';
    return base + '#propiedad/' + p.slug;
  };

  /* ---------- Imagen con srcset + lazy ---------- */
  HL.img = (photo, sizes, extra) => '<img src="' + HL.esc(photo.src) + '"' +
    (photo.srcset ? ' srcset="' + HL.esc(photo.srcset) + '" sizes="' + (sizes || '100vw') + '"' : '') +
    ' alt="' + HL.esc(photo.alt || '') + '" loading="lazy" decoding="async" draggable="false"' + (extra ? ' ' + extra : '') + '>';
  /* Marcador elegante cuando una propiedad aún no tiene fotos */
  HL.placeholder = (p, small) => '<div class="ph" role="img" aria-label="' + HL.esc('Fotografía en producción: ' + p.titulo) + '">' +
    HL.icon(HL.typeIcon(p.tipo)) + (small ? '' : '<strong>Fotografías en producción</strong><span>' + HL.esc(p.id) + '</span>') + '</div>';

  /* ---------- Toast ---------- */
  let toastTimer = 0;
  HL.toast = (msg) => {
    const el = HL.$('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-on'), 3200);
  };

  /* ---------- Estado compartido (filtros, moneda, guardados) ---------- */
  const DEFAULT_FILTERS = { op: 'todas', tipo: '', zona: '', presupuesto: '', recamaras: 0, orden: 'recientes' };
  const validIds = new Set(SITE.propiedades.map((p) => p.id));
  const subs = {};
  const state = {
    filters: Object.assign({}, DEFAULT_FILTERS),
    currency: ['MXN', 'USD'].includes(HL.storage.get('moneda')) ? HL.storage.get('moneda') : (M.inicial || 'MXN'),
    saved: (HL.storage.get('comparar', []) || []).filter((id) => validIds.has(id)).slice(0, 3)
  };
  HL.MAX_COMPARE = 3;
  HL.store = {
    state,
    defaults: DEFAULT_FILTERS,
    on(evt, fn) { (subs[evt] = subs[evt] || []).push(fn); },
    emit(evt, detail) { (subs[evt] || []).forEach((fn) => fn(detail)); },
    setFilters(partial, source) {
      Object.assign(state.filters, partial);
      this.emit('filters', { source });
    },
    resetFilters(source) {
      state.filters = Object.assign({}, DEFAULT_FILTERS, { orden: state.filters.orden });
      this.emit('filters', { source });
    },
    setCurrency(cur) {
      if (cur === state.currency) return;
      state.currency = cur;
      HL.storage.set('moneda', cur);
      this.emit('currency');
    },
    isSaved: (id) => state.saved.includes(id),
    toggleSaved(id) {
      const i = state.saved.indexOf(id);
      if (i >= 0) state.saved.splice(i, 1);
      else if (state.saved.length >= HL.MAX_COMPARE) return { ok: false };
      else state.saved.push(id);
      HL.storage.set('comparar', state.saved);
      this.emit('saved');
      return { ok: true, saved: i < 0 };
    },
    clearSaved() {
      state.saved = [];
      HL.storage.set('comparar', state.saved);
      this.emit('saved');
    }
  };
})(window.HL = window.HL || {});
