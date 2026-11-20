/* =====================================================================
   COMPARADOR — "Guardar y comparar" (máx. 3, guardado en localStorage).
   Bandeja flotante de vidrio + tabla comparativa lado a lado.
   ===================================================================== */
(function (HL) {
  'use strict';

  const SITE = window.SITE;
  let tray, dlg, returnFocus = null;

  HL.compare = { init, open };

  function init() {
    tray = HL.$('#compare-tray');
    dlg = HL.$('#compare-modal');
    HL.store.on('saved', () => { renderTray(); if (dlg.open) renderTable(); });
    HL.store.on('currency', () => { if (dlg.open) renderTable(); });
    tray.addEventListener('click', (e) => {
      const rm = e.target.closest('[data-remove]');
      if (rm) { HL.toggleSave(rm.dataset.remove); return; }
      if (e.target.closest('[data-clear-saved]')) { HL.store.clearSaved(); HL.toast('Vaciaste tu lista de comparación'); return; }
      const cmp = e.target.closest('[data-compare]');
      if (cmp) {
        if (HL.store.state.saved.length < 2) HL.toast('Guarda al menos 2 propiedades para compararlas.');
        else open(cmp);
      }
    });
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg || e.target.closest('[data-close]')) { dlg.close(); return; }
      const rm = e.target.closest('[data-remove]');
      if (rm) { HL.toggleSave(rm.dataset.remove); return; }
      const view = e.target.closest('[data-view]');
      if (view) { dlg.close(); HL.property.open(view.dataset.view); }
    });
    dlg.addEventListener('close', () => {
      document.documentElement.classList.remove('is-locked');
      if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
    });
    renderTray();
  }

  /* ---------- Bandeja ---------- */
  function renderTray() {
    const ids = HL.store.state.saved;
    const n = ids.length;
    document.body.classList.toggle('has-tray', n > 0);
    tray.hidden = n === 0;
    if (!n) return;
    tray.setAttribute('aria-label', 'Propiedades guardadas para comparar');
    tray.innerHTML =
      '<p class="tray__label">' + n + ' ' + (n === 1 ? 'guardada' : 'guardadas') + ' <span>de ' + HL.MAX_COMPARE + '</span></p>' +
      '<ul class="tray__items">' + ids.map((id) => {
        const p = HL.byId(id);
        const ph = HL.photos(p)[0];
        return '<li class="tray__item" title="' + HL.esc(p.titulo) + '">' +
          (ph ? '<img src="' + HL.esc(thumb(ph)) + '" alt="">' : HL.placeholder(p, true)) +
          '<button class="tray__remove" type="button" data-remove="' + p.id + '" aria-label="' + HL.esc('Quitar ' + p.titulo) + '">' + HL.icon('close') + '</button></li>';
      }).join('') + '</ul>' +
      '<button class="btn btn--primary btn--sm" type="button" data-compare' + (n < 2 ? ' aria-disabled="true" style="opacity:.55"' : '') + '>' + HL.icon('columns') + 'Comparar</button>' +
      '<button class="icon-btn" type="button" data-clear-saved aria-label="Vaciar lista de comparación">' + HL.icon('trash') + '</button>';
  }
  const thumb = (ph) => (ph.srcset ? ph.srcset.split(',')[0].trim().split(' ')[0] : ph.src);

  /* ---------- Modal comparativo ---------- */
  function open(focusEl) {
    returnFocus = focusEl || document.activeElement;
    renderTable();
    if (!dlg.open) dlg.showModal();
    document.documentElement.classList.add('is-locked');
    const close = HL.$('[data-close]', dlg);
    if (close) close.focus({ preventScroll: true });
  }

  function renderTable() {
    const props = HL.store.state.saved.map(HL.byId).filter(Boolean);
    const cur = HL.store.state.currency;
    if (!props.length) { dlg.close(); return; }

    const sameKind = props.every((p) => (p.operacion === 'renta') === (props[0].operacion === 'renta'));
    // Fila numérica con resaltado del mejor valor
    const numRow = (label, get, fmt, better) => {
      const vals = props.map(get);
      const valid = vals.filter((v) => v != null && v !== 0);
      let best = null;
      if (better && valid.length > 1) best = better === 'max' ? Math.max(...valid) : Math.min(...valid);
      return '<tr><th scope="row">' + label + '</th>' + vals.map((v) =>
        '<td>' + (v == null || v === 0 ? '<span class="no">—</span>' : fmt(v) + (best != null && v === best ? '<span class="best">Mejor</span>' : '')) + '</td>').join('') + '</tr>';
    };
    const textRow = (label, get) => '<tr><th scope="row">' + label + '</th>' + props.map((p) => '<td>' + (get(p) || '<span class="no">—</span>') + '</td>').join('') + '</tr>';

    const amenityKeys = [];
    props.forEach((p) => (p.amenidades || []).forEach((k) => { if (amenityKeys.indexOf(k) < 0) amenityKeys.push(k); }));

    const head = '<thead><tr><th scope="col" class="visually-hidden">Característica</th>' + props.map((p) => {
      const ph = HL.photos(p)[0];
      return '<th scope="col"><div class="compare__prop">' +
        '<div class="compare__img">' + (ph ? '<img src="' + HL.esc(thumb(ph)) + '" alt="' + HL.esc(ph.alt) + '" loading="lazy">' : HL.placeholder(p, true)) + '</div>' +
        '<span class="compare__name">' + HL.esc(p.titulo) + '</span>' +
        '<span style="display:flex;gap:8px;flex-wrap:wrap">' +
          '<button class="btn btn--ghost btn--sm" type="button" data-view="' + p.id + '">Ver detalle</button>' +
          '<button class="icon-btn" type="button" data-remove="' + p.id + '" aria-label="' + HL.esc('Quitar ' + p.titulo + ' de la comparación') + '" style="width:38px;height:38px">' + HL.icon('close') + '</button>' +
        '</span></div></th>';
    }).join('') + '</tr></thead>';

    const rows = [
      textRow('Operación', (p) => HL.esc(HL.opBadge(p.operacion)) + (p.exclusiva ? ' · Exclusiva' : '')),
      textRow('Tipo', (p) => HL.esc(p.tipo)),
      numRow('Precio', (p) => HL.priceIn(p, cur), (v) => HL.money(v, cur), sameKind ? 'min' : null),
      numRow('Precio por m²', (p) => HL.pricePerM2(p, cur), (v) => HL.money(v, cur), sameKind ? 'min' : null),
      numRow('Construcción', (p) => p.superficie.construccion, HL.m2, 'max'),
      numRow('Terreno', (p) => p.superficie.terreno, HL.m2, 'max'),
      numRow('Terraza', (p) => p.superficie.terraza, HL.m2, 'max'),
      numRow('Recámaras', (p) => p.recamaras, String, 'max'),
      numRow('Baños', (p) => p.banos, String, 'max'),
      numRow('Estacionamientos', (p) => p.estacionamientos, String, 'max'),
      textRow('Ubicación', (p) => HL.esc(p.ubicacion.zona + ', ' + p.ubicacion.estado)),
      numRow('Plusvalía anual est.', (p) => p.plusvalia, (v) => '+' + HL.dec(v) + ' %', 'max'),
      textRow('Mantenimiento', (p) => (p.mantenimientoNota ? HL.esc(p.mantenimientoNota) : p.mantenimiento ? HL.money(HL.fromMXN(p.mantenimiento, cur), cur) + '/mes' : '')),
      textRow('Entrega / antigüedad', (p) => HL.esc(p.entrega || p.antiguedad || ''))
    ].join('');
    const amenRows = amenityKeys.map((k) => {
      const a = SITE.amenidades[k] || { nombre: k };
      return '<tr><th scope="row">' + HL.esc(a.nombre) + '</th>' + props.map((p) => (p.amenidades || []).indexOf(k) >= 0
        ? '<td class="yes">' + HL.icon('check', 'width="18" height="18"') + '<span class="visually-hidden">Sí</span></td>'
        : '<td class="no">—<span class="visually-hidden">No</span></td>').join('') + '</tr>';
    }).join('');

    dlg.innerHTML =
      '<div class="modal__bar"><h2 class="modal__title" id="cmp-title">Comparar propiedades (' + props.length + ')</h2>' +
      '<div class="modal__actions"><button class="icon-btn" type="button" data-close aria-label="Cerrar">' + HL.icon('close') + '</button></div></div>' +
      '<div class="modal__body">' +
        (props.length < 2 ? '<p class="compare__empty">Guarda otra propiedad desde el catálogo para verlas lado a lado.</p>' : '') +
        '<div class="compare-wrap"><table class="compare">' + head + '<tbody>' + rows +
          (amenRows ? '<tr><th scope="rowgroup" colspan="' + (props.length + 1) + '" style="position:static;padding-top:24px;color:var(--text);font-weight:600">Amenidades</th></tr>' + amenRows : '') +
        '</tbody></table></div>' +
        (sameKind ? '' : '<p class="compare__empty" style="padding-top:0">Comparas propiedades en venta y en renta: el precio no se marca como "mejor" porque no son equivalentes.</p>') +
      '</div>';
  }
})(window.HL = window.HL || {});
