/* =====================================================================
   DETALLE DE PROPIEDAD — modal con galería, planos, mapa, recorrido 360°,
   amenidades y agendador de visitas (WhatsApp o correo prellenado).
   Enlace compartible: #propiedad/<slug> (el botón Atrás cierra el modal).
   ===================================================================== */
(function (HL) {
  'use strict';

  const SITE = window.SITE;
  const GALLERY_SIZES = '(max-width: 640px) 100vw, (max-width: 1200px) 92vw, 1136px';
  let dlg;
  let current = null;
  let returnFocus = null;
  let pushed = false;
  let closingFromHistory = false;
  let cleanup = [];

  HL.property = { init, open };

  function init() {
    dlg = HL.$('#property-modal');
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', onClose);
    window.addEventListener('popstate', () => {
      const m = location.hash.match(/^#propiedad\/(.+)$/);
      if (dlg.open && (!m || !current || m[1] !== current.slug)) {
        closingFromHistory = true;
        pushed = false;
        dlg.close();
      }
      if (m && !dlg.open) {
        const p = HL.bySlug(m[1]);
        if (p) open(p.id, null, { fromHistory: true });
      }
    });
    HL.store.on('saved', paintSave);
    HL.store.on('currency', () => { if (current && dlg.open) repaintPrices(current); });
  }

  /* ---------- Abrir / cerrar ---------- */
  function open(id, focusEl, opts) {
    const p = HL.byId(id);
    if (!p) return;
    const o = opts || {};
    current = p;
    returnFocus = focusEl || document.activeElement;
    runCleanup();
    dlg.innerHTML = build(p);
    bind(p);
    if (!dlg.open) dlg.showModal();
    document.documentElement.classList.add('is-locked');
    HL.$('.modal__body', dlg).scrollTop = 0;
    HL.$('[data-close]', dlg).focus({ preventScroll: true });
    if (!o.fromHistory) {
      const hash = '#propiedad/' + p.slug;
      if (location.hash === hash) { history.replaceState({ hlModal: p.id }, '', hash); pushed = false; }
      else { history.pushState({ hlModal: p.id }, '', hash); pushed = true; }
    }
    document.title = p.titulo + ' · ' + SITE.marca.nombre;
  }
  function onClose() {
    document.documentElement.classList.remove('is-locked');
    runCleanup();
    if (closingFromHistory) closingFromHistory = false;
    else if (pushed) { pushed = false; history.back(); }
    else if (location.hash.indexOf('#propiedad/') === 0) history.replaceState(null, '', location.pathname + location.search);
    document.title = HL.pageTitle || document.title;
    current = null;
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
  }
  function runCleanup() { cleanup.forEach((fn) => fn()); cleanup = []; }

  /* ---------- Plantilla ---------- */
  function build(p) {
    const tabs = [];
    tabs.push(['fotos', 'Fotos', 'photo']);
    if (p.planos && SITE.planos[p.planos]) tabs.push(['planos', 'Planos', 'plan']);
    if (p.ubicacion.lat != null) tabs.push(['mapa', 'Mapa', 'map']);
    tabs.push(['recorrido', '<span class="tab__long">Recorrido </span>360°', 'pano']);
    const saved = HL.store.isSaved(p.id);

    return '' +
      '<div class="modal__bar">' +
        '<p class="modal__title">' + HL.esc(p.titulo) + ' <span class="subtle">· ' + HL.esc(p.id) + '</span></p>' +
        '<div class="modal__actions">' +
          '<button class="icon-btn" type="button" data-save="' + p.id + '" aria-pressed="' + saved + '" aria-label="Guardar para comparar">' + HL.icon('heart') + '</button>' +
          '<button class="icon-btn" type="button" data-share aria-label="Compartir enlace">' + HL.icon('share') + '</button>' +
          '<button class="icon-btn" type="button" data-close aria-label="Cerrar">' + HL.icon('close') + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="modal__body">' +
        '<div class="pd__media">' +
          '<div class="tabs" role="tablist" aria-label="Contenido multimedia">' +
            tabs.map(([key, label, icon], i) => '<button class="tab" type="button" role="tab" id="tab-' + key + '" aria-controls="panel-' + key + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-tab="' + key + '">' + HL.icon(icon) + label + '</button>').join('') +
          '</div>' +
          tabs.map(([key], i) => '<div class="panel" role="tabpanel" id="panel-' + key + '" aria-labelledby="tab-' + key + '"' + (i === 0 ? '' : ' hidden') + '>' + (key === 'fotos' ? galleryHTML(p) : '') + '</div>').join('') +
        '</div>' +
        '<div class="pd__content">' +
          '<div class="pd__main">' +
            headHTML(p) +
            factsHTML(p) +
            '<section class="pd__section"><h3>Descripción</h3><p>' + HL.esc(p.descripcion) + '</p></section>' +
            amenitiesHTML(p) +
            featuresHTML(p) +
            miniMortgageHTML(p) +
          '</div>' +
          '<aside class="pd__side">' + scheduleHTML(p) + '</aside>' +
        '</div>' +
      '</div>';
  }

  function headHTML(p) {
    return '<header class="pd__head">' +
      '<div class="pd__badges">' + HL.badgesHTML(p) + (p.plusvalia ? '<span class="badge" style="color:var(--positive)">' + HL.icon('trend', 'width="13" height="13"') + '+' + HL.dec(p.plusvalia) + ' % plusvalía anual est.</span>' : '') + '</div>' +
      '<h2 class="pd__title" id="pd-title">' + HL.esc(p.titulo) + '</h2>' +
      '<p class="loc">' + HL.icon('pin') + '<span>' + HL.esc(HL.locationText(p)) + '</span></p>' +
      '<div data-price>' + HL.priceHTML(p) + '</div>' +
    '</header>';
  }

  function factsHTML(p) {
    const cur = HL.store.state.currency;
    const s = p.superficie || {};
    const f = [];
    const add = (icon, label, value) => f.push('<div class="fact">' + HL.icon(icon) + '<dt>' + label + '</dt><dd>' + value + '</dd></div>');
    if (s.construccion) add('area', 'Construcción', HL.m2(s.construccion));
    if (s.terreno) add('land', 'Terreno', HL.m2(s.terreno));
    if (s.terraza) add('terrace', 'Terraza', HL.m2(s.terraza));
    if (p.recamaras) add('bed', 'Recámaras', p.recamaras);
    if (p.banos) add('bath', 'Baños', p.banos);
    if (p.estacionamientos) add('car', 'Estacionamientos', p.estacionamientos);
    const ppm = HL.pricePerM2(p, cur);
    if (ppm) add('valuacion', 'Precio por m²', '<span data-ppm>' + HL.money(ppm, cur) + (p.operacion === 'renta' ? '/mes' : '') + '</span>');
    if (p.entrega) add('calendar', 'Entrega', HL.esc(p.entrega));
    else if (p.antiguedad) add('clock', 'Antigüedad', HL.esc(p.antiguedad));
    if (p.mantenimientoNota) add('shield', 'Mantenimiento', HL.esc(p.mantenimientoNota));
    else if (p.mantenimiento) add('shield', 'Mantenimiento', '<span data-mant>' + HL.money(HL.fromMXN(p.mantenimiento, cur), cur) + '/mes</span>');
    if (p.amueblado) add('house', 'Amueblado', 'Sí');
    return '<dl class="facts">' + f.join('') + '</dl>';
  }

  function amenitiesHTML(p) {
    if (!p.amenidades || !p.amenidades.length) return '';
    return '<section class="pd__section"><h3>Amenidades</h3><ul class="amenities">' +
      p.amenidades.map((k) => {
        const a = SITE.amenidades[k] || { nombre: k, icono: 'check' };
        return '<li>' + HL.icon(a.icono) + HL.esc(a.nombre) + '</li>';
      }).join('') + '</ul></section>';
  }

  function featuresHTML(p) {
    const list = (p.caracteristicas || []).slice();
    if (p.esquemaPago) list.unshift('Esquema de pago: ' + p.esquemaPago);
    if (p.usoSuelo) list.push('Uso de suelo: ' + p.usoSuelo);
    if (!list.length) return '';
    return '<section class="pd__section"><h3>Características</h3><ul class="features">' +
      list.map((t) => '<li>' + HL.icon('check') + '<span>' + HL.esc(t) + '</span></li>').join('') + '</ul></section>';
  }

  function miniMortgageHTML(p) {
    if (p.operacion === 'renta') return '';
    const h = SITE.hipoteca;
    const price = HL.priceMXN(p);
    const pay = HL.mortgageCalc.payment(price * (1 - h.enganche.inicial / 100), h.tasa.inicial, h.plazoInicial);
    return '<div class="mini-mortgage"><div><span>Mensualidad estimada con ' + h.enganche.inicial + ' % de enganche a ' + h.plazoInicial + ' años</span><br><strong data-mini-pay>' +
      HL.money(HL.fromMXN(pay, HL.store.state.currency), HL.store.state.currency) + '/mes</strong></div>' +
      '<button class="btn btn--glass btn--sm" type="button" data-simulate>' + HL.icon('hipoteca') + 'Simular mi crédito</button></div>';
  }

  /* ---------- Galería ---------- */
  function galleryHTML(p) {
    const photos = HL.photos(p);
    if (!photos.length) {
      const a = HL.advisor(p.asesor);
      return '<div class="gallery"><div class="gallery__stage">' + HL.placeholder(p) + '</div>' +
        '<p class="plan__note">Las fotografías de esta propiedad están en producción. ' +
        '<a class="link-arrow" target="_blank" rel="noopener" href="' + HL.waLink(a.whatsapp, 'Hola ' + a.nombre.split(' ')[0] + ', ¿me compartes fotos y video de ' + p.titulo + ' (' + p.id + ')?') + '">Pedir fotos y video por WhatsApp' + HL.icon('arrow') + '</a></p></div>';
    }
    return '<div class="gallery">' +
      '<div class="gallery__stage" tabindex="0" aria-roledescription="carrusel" aria-label="Fotos de ' + HL.esc(p.titulo) + '">' +
        '<div class="track">' + photos.map((ph) => HL.img(ph, GALLERY_SIZES)).join('') + '</div>' +
        (photos.length > 1 ? '<button class="icon-btn card__arrow card__arrow--prev" type="button" data-gstep="-1" aria-label="Foto anterior">' + HL.icon('left') + '</button>' +
          '<button class="icon-btn card__arrow card__arrow--next" type="button" data-gstep="1" aria-label="Foto siguiente">' + HL.icon('right') + '</button>' : '') +
        '<span class="gallery__count" aria-live="polite"><span data-gidx>1</span> / ' + photos.length + '</span>' +
      '</div>' +
      (photos.length > 1 ? '<div class="thumbs">' + photos.map((ph, i) => '<button class="thumb" type="button" data-thumb="' + i + '" aria-label="Ver foto ' + (i + 1) + '"' + (i ? '' : ' aria-current="true"') + '>' +
        '<img src="' + HL.esc(thumbSrc(ph)) + '" alt="" loading="lazy" decoding="async"></button>').join('') + '</div>' : '') +
    '</div>';
  }
  const thumbSrc = (ph) => (ph.srcset ? ph.srcset.split(',')[0].trim().split(' ')[0] : ph.src);

  /* ---------- Planos ---------- */
  function planHTML(p) {
    const levels = SITE.planos[p.planos];
    return '<div class="plan">' +
      (levels.length > 1 ? '<div class="plan__levels chips" role="radiogroup" aria-label="Nivel">' + levels.map((l, i) => '<label class="chip"><input type="radio" name="nivel" value="' + i + '"' + (i ? '' : ' checked') + '><span>' + HL.esc(l.nombre) + '</span></label>').join('') + '</div>' : '') +
      '<div class="plan__svg" data-plan>' + HL.floorplan.render(levels[0]) + '</div>' +
      '<p class="plan__note" data-plan-note>' + HL.esc(levels[0].nota || levels[0].nombre + ' · plano ilustrativo, medidas aproximadas.') + '</p>' +
    '</div>';
  }

  /* ---------- Mapa ---------- */
  function mapHTML(p) {
    const u = p.ubicacion;
    const dx = 0.012;
    const dy = 0.007;
    const src = 'https://www.openstreetmap.org/export/embed.html?bbox=' +
      [(u.lng - dx).toFixed(5), (u.lat - dy).toFixed(5), (u.lng + dx).toFixed(5), (u.lat + dy).toFixed(5)].join('%2C') +
      '&layer=mapnik&marker=' + u.lat + '%2C' + u.lng;
    return '<div class="map"><iframe title="' + HL.esc('Mapa de ubicación: ' + p.titulo) + '" src="' + src + '" loading="lazy" referrerpolicy="no-referrer"></iframe></div>' +
      '<div class="map__foot"><span>' + HL.icon('pin', 'width="16" height="16" style="display:inline;vertical-align:-3px;color:var(--brand-accent)"') + ' ' + HL.esc(HL.locationText(p)) + '</span>' +
      '<a class="link-arrow" href="https://www.google.com/maps/search/?api=1&query=' + u.lat + ',' + u.lng + '" target="_blank" rel="noopener">Abrir en Google Maps' + HL.icon('arrow') + '</a></div>';
  }

  /* ---------- Recorrido 360° / panorámica ---------- */
  function tourHTML(p) {
    if (p.tour360) {
      return '<div class="pano"><iframe title="' + HL.esc('Recorrido virtual 360°: ' + p.titulo) + '" src="' + HL.esc(p.tour360) + '" loading="lazy" allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer" allowfullscreen></iframe></div>';
    }
    if (p.panorama) {
      return '<div class="pano" data-pano tabindex="0" role="img" aria-label="' + HL.esc((p.panorama.alt || 'Vista panorámica') + '. Arrastra o usa las flechas para recorrer.') + '">' +
        '<img src="' + HL.esc(p.panorama.src) + '" alt="" decoding="async">' +
        '<div class="pano__ctrl"><button class="icon-btn" type="button" data-pstep="-1" aria-label="Girar a la izquierda">' + HL.icon('left') + '</button>' +
        '<button class="icon-btn" type="button" data-pstep="1" aria-label="Girar a la derecha">' + HL.icon('right') + '</button></div>' +
        '<span class="pano__hint">' + HL.icon('drag') + 'Arrastra para recorrer la vista</span></div>' +
        '<p class="plan__note" style="margin-top:10px">Vista panorámica. El recorrido virtual 360° completo se conecta en data.js (Matterport, Kuula u otro visor).</p>';
    }
    return '<div class="pano" style="cursor:default"><div class="ph">' + HL.icon('pano') + '<strong>Recorrido virtual 360° en producción</strong>' +
      '<span>Mientras tanto, te mostramos la propiedad en vivo por videollamada.</span>' +
      '<button class="btn btn--primary btn--sm" type="button" data-video-call style="margin-top:6px">' + HL.icon('video') + 'Agendar videollamada</button></div></div>';
  }

  /* ---------- Agendador ---------- */
  function ymd(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function scheduleHTML(p) {
    const ag = SITE.agenda;
    const a = HL.advisor(p.asesor);
    const today = new Date();
    const min = new Date(today.getFullYear(), today.getMonth(), today.getDate() + ag.anticipacionDias);
    const max = new Date(today.getFullYear(), today.getMonth(), today.getDate() + ag.maxDias);
    const saved = HL.storage.get('contacto', {}) || {};
    return '<form class="schedule" id="schedule-form" novalidate>' +
      '<div><h3>Agenda tu visita</h3><p class="subtle" style="font-size:14px;margin-top:4px">Elige fecha, horario y modalidad. Te confirmamos por WhatsApp.</p></div>' +
      '<div class="field"><label class="field__label" for="v-fecha">Fecha</label>' +
        '<input class="input" type="date" id="v-fecha" name="fecha" min="' + ymd(min) + '" max="' + ymd(max) + '" required aria-describedby="v-fecha-err">' +
        '<p class="field__error" id="v-fecha-err" hidden></p></div>' +
      '<fieldset class="field" style="border:0;margin:0;padding:0;min-width:0"><legend class="field__label" style="padding:0;margin-bottom:6px">Horario</legend>' +
        '<div class="slots chips">' + ag.horarios.map((h) => '<label class="chip"><input type="radio" name="hora" value="' + h + '"><span>' + h + '</span></label>').join('') + '</div>' +
        '<p class="field__error" data-err="hora" hidden></p></fieldset>' +
      '<fieldset class="field" style="border:0;margin:0;padding:0;min-width:0"><legend class="field__label" style="padding:0;margin-bottom:6px">Modalidad</legend>' +
        '<div class="seg">' +
          '<label class="chip"><input type="radio" name="modalidad" value="Presencial" checked><span>' + HL.icon('walk') + 'Presencial</span></label>' +
          '<label class="chip"><input type="radio" name="modalidad" value="Videollamada"><span>' + HL.icon('video') + 'Videollamada</span></label>' +
        '</div></fieldset>' +
      '<div class="field"><label class="field__label" for="v-nombre">Nombre completo</label>' +
        '<input class="input" id="v-nombre" name="nombre" autocomplete="name" required value="' + HL.esc(saved.nombre || '') + '" aria-describedby="v-nombre-err">' +
        '<p class="field__error" id="v-nombre-err" hidden></p></div>' +
      '<div class="field"><label class="field__label" for="v-tel">Teléfono / WhatsApp</label>' +
        '<input class="input" id="v-tel" name="telefono" type="tel" inputmode="tel" autocomplete="tel" placeholder="55 1234 5678" required value="' + HL.esc(saved.telefono || '') + '" aria-describedby="v-tel-err">' +
        '<p class="field__error" id="v-tel-err" hidden></p></div>' +
      '<div class="field"><label class="field__label" for="v-email">Correo <span class="subtle">(opcional)</span></label>' +
        '<input class="input" id="v-email" name="email" type="email" autocomplete="email" value="' + HL.esc(saved.email || '') + '" aria-describedby="v-email-err">' +
        '<p class="field__error" id="v-email-err" hidden></p></div>' +
      '<div class="schedule__actions" data-actions>' +
        '<button class="btn btn--wa btn--block" type="submit" name="canal" value="whatsapp">' + HL.icon('whatsapp') + 'Enviar por WhatsApp</button>' +
        '<button class="btn btn--ghost btn--block" type="submit" name="canal" value="correo">' + HL.icon('mail') + 'Enviar por correo</button>' +
      '</div>' +
      '<div class="success" data-success hidden></div>' +
      '<p class="form-note">Tus datos solo se comparten con tu asesor. <a href="' + HL.esc(SITE.contacto.avisoPrivacidad) + '">Aviso de privacidad</a></p>' +
      '<div class="agent"><span class="avatar avatar--sm" aria-hidden="true">' + HL.initials(a.nombre) + '</span><div><p class="agent__name">' + HL.esc(a.nombre) + '</p><p class="agent__role">' + HL.esc(a.certificacion) + '</p></div></div>' +
    '</form>';
  }

  function validate(form, field) {
    const ag = SITE.agenda;
    const els = form.elements;
    const errors = {};
    const v = (n) => (els[n] && els[n].value ? els[n].value.trim() : '');
    if (!v('fecha')) errors.fecha = 'Elige una fecha para la visita.';
    else {
      const [y, m, d] = v('fecha').split('-').map(Number);
      const date = new Date(y, m - 1, d);
      if (v('fecha') < els.fecha.min || v('fecha') > els.fecha.max) errors.fecha = 'Elige una fecha entre ' + fmtDate(els.fecha.min) + ' y ' + fmtDate(els.fecha.max) + '.';
      else if (ag.diasHabiles.indexOf(date.getDay()) < 0) errors.fecha = 'Ese día no agendamos visitas. Elige de lunes a sábado.';
    }
    if (!form.querySelector('input[name="hora"]:checked')) errors.hora = 'Elige un horario.';
    if (v('nombre').length < 3) errors.nombre = 'Escribe tu nombre para que tu asesor sepa a quién recibe.';
    const digits = v('telefono').replace(/\D/g, '');
    if (!(digits.length === 10 || (digits.length === 12 && digits.indexOf('52') === 0) || (digits.length === 13 && digits.indexOf('521') === 0))) {
      errors.telefono = 'Escribe 10 dígitos, por ejemplo 55 1234 5678.';
    }
    if (v('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('email'))) errors.email = 'Revisa el correo; parece incompleto.';

    const show = (name, msgEl, input) => {
      if (field && field !== name) return;
      const msg = errors[name];
      if (msgEl) { msgEl.textContent = msg || ''; msgEl.hidden = !msg; }
      if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    };
    show('fecha', HL.$('#v-fecha-err', form), els.fecha);
    show('hora', HL.$('[data-err="hora"]', form));
    show('nombre', HL.$('#v-nombre-err', form), els.nombre);
    show('telefono', HL.$('#v-tel-err', form), els.telefono);
    show('email', HL.$('#v-email-err', form), els.email);
    return errors;
  }
  function fmtDate(value, long) {
    const [y, m, d] = value.split('-').map(Number);
    return new Intl.DateTimeFormat('es-MX', long ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' } : { day: 'numeric', month: 'long' }).format(new Date(y, m - 1, d));
  }

  /* ---------- Comportamiento ---------- */
  function bind(p) {
    const tabs = HL.$$('[role="tab"]', dlg);
    const rendered = { fotos: true };

    dlg.onclick = null;
    dlg.addEventListener('click', onClick);
    cleanup.push(() => dlg.removeEventListener('click', onClick));

    function onClick(e) {
      if (e.target.closest('[data-close]')) { dlg.close(); return; }
      const save = e.target.closest('[data-save]');
      if (save) { HL.toggleSave(p.id); return; }
      if (e.target.closest('[data-share]')) { share(p); return; }
      const tab = e.target.closest('[role="tab"]');
      if (tab) { selectTab(tab.dataset.tab); return; }
      const g = e.target.closest('[data-gstep]');
      if (g) { stepGallery(Number(g.dataset.gstep)); return; }
      const th = e.target.closest('[data-thumb]');
      if (th) { goGallery(Number(th.dataset.thumb)); return; }
      if (e.target.closest('[data-simulate]')) {
        HL.mortgage.setValue(HL.priceMXN(p));
        dlg.close();
        setTimeout(() => HL.$('#calculadora').scrollIntoView({ behavior: HL.reducedMotion() ? 'auto' : 'smooth' }), 60);
        return;
      }
      if (e.target.closest('[data-video-call]')) {
        const vc = HL.$('input[name="modalidad"][value="Videollamada"]', dlg);
        vc.checked = true;
        HL.$('#v-fecha', dlg).focus();
        HL.$('#schedule-form', dlg).scrollIntoView({ behavior: HL.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
      }
    }

    // Pestañas con flechas del teclado (patrón ARIA)
    HL.$('[role="tablist"]', dlg).addEventListener('keydown', (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      let n = -1;
      if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') n = 0;
      if (e.key === 'End') n = tabs.length - 1;
      if (n < 0) return;
      e.preventDefault();
      tabs[n].focus();
      selectTab(tabs[n].dataset.tab);
    });
    function selectTab(key) {
      tabs.forEach((t) => {
        const on = t.dataset.tab === key;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        HL.$('#panel-' + t.dataset.tab, dlg).hidden = !on;
      });
      const panel = HL.$('#panel-' + key, dlg);
      if (!rendered[key]) {
        rendered[key] = true;
        if (key === 'planos') { panel.innerHTML = planHTML(p); bindPlan(panel, p); }
        if (key === 'mapa') panel.innerHTML = mapHTML(p);
        if (key === 'recorrido') { panel.innerHTML = tourHTML(p); bindPano(panel); }
      }
    }

    // Galería: índice según el scroll; teclado ← →
    const stage = HL.$('.gallery__stage[tabindex]', dlg);
    const track = stage && HL.$('.track', stage);
    function goGallery(i) {
      if (!track) return;
      track.scrollTo({ left: i * track.clientWidth, behavior: HL.reducedMotion() ? 'auto' : 'smooth' });
    }
    function stepGallery(d) {
      if (!track) return;
      const n = track.children.length;
      const i = Math.round(track.scrollLeft / track.clientWidth);
      goGallery((i + d + n) % n);
    }
    if (track) {
      const onScroll = () => {
        const i = Math.round(track.scrollLeft / track.clientWidth);
        HL.$('[data-gidx]', dlg).textContent = String(i + 1);
        HL.$$('[data-thumb]', dlg).forEach((t, k) => t.setAttribute('aria-current', String(k === i)));
      };
      track.addEventListener('scroll', onScroll, { passive: true });
      stage.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); stepGallery(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); stepGallery(-1); }
      });
    }

    // Agendador
    const form = HL.$('#schedule-form', dlg);
    form.addEventListener('focusout', (e) => { if (e.target.name && e.target.value) validate(form, e.target.name); });
    form.addEventListener('input', (e) => {
      const err = e.target.getAttribute('aria-invalid') === 'true';
      if (err) validate(form, e.target.name);
    });
    form.addEventListener('change', (e) => { if (e.target.name === 'hora' || e.target.name === 'fecha') validate(form, e.target.name); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const errors = validate(form);
      const first = Object.keys(errors)[0];
      if (first) {
        const target = first === 'hora' ? form.querySelector('input[name="hora"]') : form.elements[first];
        if (target) target.focus();
        return;
      }
      const canal = (e.submitter && e.submitter.value) || 'whatsapp';
      sendVisit(p, form, canal);
    });
  }

  function sendVisit(p, form, canal) {
    const els = form.elements;
    const a = HL.advisor(p.asesor);
    const data = {
      fecha: fmtDate(els.fecha.value, true),
      hora: form.querySelector('input[name="hora"]:checked').value,
      modalidad: form.querySelector('input[name="modalidad"]:checked').value,
      nombre: els.nombre.value.trim(),
      telefono: els.telefono.value.trim(),
      email: els.email.value.trim()
    };
    HL.storage.set('contacto', { nombre: data.nombre, telefono: data.telefono, email: data.email });
    const lines = [
      'Hola ' + a.nombre.split(' ')[0] + ', me gustaría agendar una visita.',
      '',
      '• Propiedad: ' + p.titulo + ' (' + p.id + ')',
      '• Fecha: ' + data.fecha,
      '• Horario: ' + data.hora + ' h',
      '• Modalidad: ' + data.modalidad,
      '• Nombre: ' + data.nombre,
      '• Teléfono: ' + data.telefono
    ];
    if (data.email) lines.push('• Correo: ' + data.email);
    lines.push('', HL.propertyUrl(p));
    const text = lines.join('\n');
    if (canal === 'correo') window.location.href = HL.mailLink(a.email, 'Visita: ' + p.titulo + ' (' + p.id + ')', text);
    else window.open(HL.waLink(a.whatsapp, text), '_blank', 'noopener');

    const ok = HL.$('[data-success]', form);
    ok.innerHTML = '<strong>' + HL.icon('check', 'width="18" height="18" style="display:inline;vertical-align:-4px"') + ' Solicitud lista</strong>' +
      '<p class="muted" style="font-size:14.5px">Abrimos ' + (canal === 'correo' ? 'tu correo' : 'WhatsApp') + ' con tu cita del ' + HL.esc(data.fecha) + ' a las ' + HL.esc(data.hora) + ' h. ' + HL.esc(SITE.agenda.confirmacion) + '</p>' +
      '<button class="btn-text" type="button" data-again style="justify-self:start">Agendar otra visita</button>';
    ok.hidden = false;
    HL.$('[data-actions]', form).hidden = true;
    HL.$('[data-again]', ok).addEventListener('click', () => { ok.hidden = true; HL.$('[data-actions]', form).hidden = false; els.fecha.focus(); });
  }

  function bindPlan(panel, p) {
    const levels = SITE.planos[p.planos];
    panel.addEventListener('change', (e) => {
      if (e.target.name !== 'nivel') return;
      const l = levels[Number(e.target.value)];
      HL.$('[data-plan]', panel).innerHTML = HL.floorplan.render(l);
      HL.$('[data-plan-note]', panel).textContent = l.nota || l.nombre + ' · plano ilustrativo, medidas aproximadas.';
    });
  }

  /* Visor panorámico ligero: arrastre con inercia, botones y teclado */
  function bindPano(panel) {
    const pano = HL.$('[data-pano]', panel);
    if (!pano) return;
    const img = HL.$('img', pano);
    let x = 0;
    let min = 0;
    let v = 0;
    let raf = 0;
    let dragging = false;
    let lastX = 0;
    let lastT = 0;
    const apply = () => { img.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0) scale(1.0001)'; };
    const bounds = () => {
      const scale = pano.clientHeight / (img.naturalHeight || 1);
      const w = Math.max((img.naturalWidth || 0) * scale * 1.35, pano.clientWidth);
      img.style.height = (pano.clientHeight * 1.35) + 'px';
      img.style.top = (-(pano.clientHeight * 0.35) / 2) + 'px';
      min = Math.min(0, pano.clientWidth - w);
    };
    const clamp = () => { x = Math.max(min, Math.min(0, x)); };
    const setup = () => { bounds(); x = min / 2; apply(); };
    if (img.complete) setup(); else img.addEventListener('load', setup, { once: true });
    const glide = () => {
      v *= 0.94;
      x += v;
      clamp();
      apply();
      if (Math.abs(v) > 0.2 && !dragging) raf = requestAnimationFrame(glide);
    };
    const down = (e) => {
      dragging = true;
      cancelAnimationFrame(raf);
      pano.classList.add('is-dragging', 'is-used');
      lastX = e.clientX;
      lastT = performance.now();
      v = 0;
      pano.setPointerCapture(e.pointerId);
    };
    const move = (e) => {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      x += dx;
      clamp();
      apply();
      v = dx / Math.max(1, now - lastT) * 16;
      lastX = e.clientX;
      lastT = now;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      pano.classList.remove('is-dragging');
      if (!HL.reducedMotion()) raf = requestAnimationFrame(glide);
    };
    const step = (d) => {
      pano.classList.add('is-used');
      const target = Math.max(min, Math.min(0, x - d * pano.clientWidth * 0.35));
      if (HL.reducedMotion()) { x = target; apply(); return; }
      const from = x;
      const t0 = performance.now();
      const anim = (now) => {
        const k = Math.min(1, (now - t0) / 450);
        x = from + (target - from) * (1 - Math.pow(1 - k, 3));
        apply();
        if (k < 1) raf = requestAnimationFrame(anim);
      };
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(anim);
    };
    pano.addEventListener('pointerdown', (e) => { if (!e.target.closest('button')) down(e); });
    pano.addEventListener('pointermove', move);
    pano.addEventListener('pointerup', up);
    pano.addEventListener('pointercancel', up);
    pano.addEventListener('click', (e) => { const b = e.target.closest('[data-pstep]'); if (b) step(Number(b.dataset.pstep)); });
    pano.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });
    const onResize = HL.debounce(() => { bounds(); clamp(); apply(); }, 150);
    window.addEventListener('resize', onResize);
    cleanup.push(() => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); });
  }

  function share(p) {
    const url = HL.propertyUrl(p);
    if (navigator.share) {
      navigator.share({ title: p.titulo + ' · ' + SITE.marca.nombre, url }).catch(() => {});
      return;
    }
    const done = () => HL.toast('Enlace copiado. Pégalo donde quieras compartirlo.');
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(done, () => window.prompt('Copia el enlace:', url));
    else window.prompt('Copia el enlace:', url);
  }

  function paintSave() {
    if (!current || !dlg.open) return;
    const b = HL.$('[data-save]', dlg);
    if (b) b.setAttribute('aria-pressed', String(HL.store.isSaved(current.id)));
  }
  function repaintPrices(p) {
    const cur = HL.store.state.currency;
    const pr = HL.$('[data-price]', dlg);
    if (pr) pr.innerHTML = HL.priceHTML(p);
    const ppm = HL.$('[data-ppm]', dlg);
    if (ppm) ppm.textContent = HL.money(HL.pricePerM2(p, cur), cur) + (p.operacion === 'renta' ? '/mes' : '');
    const mant = HL.$('[data-mant]', dlg);
    if (mant) mant.textContent = HL.money(HL.fromMXN(p.mantenimiento, cur), cur) + '/mes';
    const mini = HL.$('[data-mini-pay]', dlg);
    if (mini) {
      const h = SITE.hipoteca;
      const pay = HL.mortgageCalc.payment(HL.priceMXN(p) * (1 - h.enganche.inicial / 100), h.tasa.inicial, h.plazoInicial);
      mini.textContent = HL.money(HL.fromMXN(pay, cur), cur) + '/mes';
    }
  }
})(window.HL = window.HL || {});
