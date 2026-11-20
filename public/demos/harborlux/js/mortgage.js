/* =====================================================================
   CALCULADORA HIPOTECARIA — mensualidad (sistema francés, tasa fija),
   ingreso recomendado y desembolso inicial, en tiempo real.
   ===================================================================== */
(function (HL) {
  'use strict';

  const SITE = window.SITE;
  const C = SITE.hipoteca;

  /* Matemática pura (también la usa el detalle de propiedad) */
  HL.mortgageCalc = {
    payment(principal, annualRatePct, years) {
      const n = years * 12;
      const r = annualRatePct / 100 / 12;
      if (principal <= 0) return 0;
      if (!r) return principal / n;
      return principal * r / (1 - Math.pow(1 + r, -n));
    }
  };

  let form;
  const state = {
    valor: C.valor.inicial,
    enganche: C.enganche.inicial,
    plazoIdx: Math.max(0, C.plazos.indexOf(C.plazoInicial)),
    tasa: C.tasa.inicial
  };

  HL.mortgage = { init, setValue };

  function init() {
    form = HL.$('#mortgage');
    HL.$('#calc-checks').innerHTML = (C.beneficios || []).map((b) => '<li>' + HL.icon('check') + '<span>' + HL.esc(b) + '</span></li>').join('');
    form.innerHTML =
      '<div class="calc__controls">' +
        range('valor', 'Valor de la propiedad', C.valor.min, C.valor.max, C.valor.paso, state.valor) +
        range('enganche', 'Enganche', C.enganche.min, C.enganche.max, C.enganche.paso, state.enganche) +
        range('plazo', 'Plazo', 0, C.plazos.length - 1, 1, state.plazoIdx, C.plazos.map((y) => y + ' años')) +
        range('tasa', 'Tasa de interés anual', C.tasa.min, C.tasa.max, C.tasa.paso, state.tasa) +
      '</div>' +
      '<div class="calc__result" aria-live="polite">' +
        '<div class="donut" data-donut role="img"></div>' +
        '<div class="calc__pay">' +
          '<span class="calc__pay-label">Mensualidad estimada</span>' +
          '<span class="calc__pay-value" data-out="pago"></span>' +
          '<span class="calc__income">Ingreso mensual recomendado: <strong data-out="ingreso"></strong></span>' +
          '<div class="legend"><span><i style="background:var(--brand-accent)"></i>Capital</span><span><i style="background:var(--brand-accent-2)"></i>Intereses</span></div>' +
        '</div>' +
      '</div>' +
      '<dl class="calc__table">' +
        cell('Monto del crédito', 'credito') + cell('Enganche', 'enganche') +
        cell('Gastos de escrituración (est.)', 'gastos') + cell('Desembolso inicial', 'inicial') +
        cell('Intereses totales', 'intereses') + cell('Total pagado al banco', 'total') +
      '</dl>' +
      '<p class="calc__note">' + HL.esc(C.nota) + '</p>' +
      '<div class="calc__actions">' +
        '<a class="btn btn--primary" href="#" target="_blank" rel="noopener" data-prequal>' + HL.icon('whatsapp') + 'Solicitar precalificación</a>' +
        '<button class="btn btn--ghost" type="button" data-see-range>Ver propiedades en este rango</button>' +
      '</div>';

    form.addEventListener('submit', (e) => e.preventDefault());
    form.addEventListener('input', (e) => {
      const el = e.target;
      if (el.type !== 'range') return;
      if (el.name === 'plazo') state.plazoIdx = Number(el.value);
      else state[el.name] = Number(el.value);
      update();
    });
    HL.$('[data-see-range]', form).addEventListener('click', seeRange);
    HL.store.on('currency', update);
    update();
  }

  function range(name, label, min, max, step, value, ticks) {
    const t = ticks || [fmtValue(name, min, true), fmtValue(name, max, true)];
    return '<div class="range">' +
      '<div class="range__top"><label class="range__label" for="r-' + name + '">' + label + '</label><output class="range__value" for="r-' + name + '" data-val="' + name + '"></output></div>' +
      '<input type="range" id="r-' + name + '" name="' + name + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '">' +
      '<div class="range__ticks" aria-hidden="true" data-ticks="' + name + '">' + t.map((x) => '<span>' + x + '</span>').join('') + '</div>' +
    '</div>';
  }
  const cell = (label, key) => '<div><dt>' + label + '</dt><dd data-out="' + key + '"></dd></div>';

  function fmtValue(name, v, compact) {
    const cur = HL.store.state.currency;
    if (name === 'valor') return HL.money(HL.fromMXN(v, cur), cur, { compact: true });
    if (name === 'enganche') return v + ' %';
    if (name === 'tasa') return (compact ? HL.dec(v) : v.toFixed(2)) + ' %';
    return v;
  }

  function update() {
    const cur = HL.store.state.currency;
    const m = (mxn) => HL.money(HL.fromMXN(mxn, cur), cur);
    const years = C.plazos[state.plazoIdx];
    const down = state.valor * state.enganche / 100;
    const principal = state.valor - down;
    const pay = HL.mortgageCalc.payment(principal, state.tasa, years);
    const totalPaid = pay * years * 12;
    const interest = Math.max(0, totalPaid - principal);
    const fees = state.valor * C.gastosEscrituracion;
    const income = pay / C.relacionPagoIngreso;

    // Etiquetas de los sliders + relleno del track + texto para lectores de pantalla
    const labels = {
      valor: HL.money(HL.fromMXN(state.valor, cur), cur),
      enganche: state.enganche + ' % · ' + m(down),
      plazo: years + ' años',
      tasa: state.tasa.toFixed(2) + ' %'
    };
    ['valor', 'enganche', 'plazo', 'tasa'].forEach((name) => {
      const input = form.elements[name];
      const pct = (input.value - input.min) / (input.max - input.min) * 100;
      input.style.setProperty('--fill', pct + '%');
      input.setAttribute('aria-valuetext', labels[name]);
      HL.$('[data-val="' + name + '"]', form).textContent = labels[name];
    });
    HL.$('[data-ticks="valor"]', form).innerHTML = '<span>' + fmtValue('valor', C.valor.min, true) + '</span><span>' + fmtValue('valor', C.valor.max, true) + '</span>';

    const out = (k, v) => { HL.$('[data-out="' + k + '"]', form).textContent = v; };
    out('pago', m(pay));
    out('ingreso', m(income));
    out('credito', m(principal));
    out('enganche', m(down));
    out('gastos', m(fees));
    out('inicial', m(down + fees));
    out('intereses', m(interest));
    out('total', m(totalPaid));

    const capitalPct = totalPaid ? Math.round(principal / totalPaid * 100) : 100;
    const donut = HL.$('[data-donut]', form);
    donut.style.setProperty('--capital', capitalPct);
    donut.setAttribute('aria-label', 'Del total pagado, ' + capitalPct + ' % es capital y ' + (100 - capitalPct) + ' % intereses');

    const msg = [
      'Hola, quiero precalificar para un crédito hipotecario.',
      '• Valor de la propiedad: ' + HL.money(state.valor, 'MXN', { code: true }),
      '• Enganche: ' + state.enganche + ' % (' + HL.money(down, 'MXN') + ')',
      '• Plazo: ' + years + ' años',
      '• Tasa de referencia: ' + state.tasa.toFixed(2) + ' %',
      '• Mensualidad estimada: ' + HL.money(pay, 'MXN')
    ].join('\n');
    HL.$('[data-prequal]', form).href = HL.waLink(SITE.contacto.whatsapp, msg);
  }

  /* Prellena el valor (desde "Simular mi crédito" en una propiedad) */
  function setValue(mxn) {
    const v = Math.min(C.valor.max, Math.max(C.valor.min, Math.round(mxn / C.valor.paso) * C.valor.paso));
    state.valor = v;
    if (form) {
      form.elements.valor.value = String(v);
      update();
    }
  }

  /* Lleva al catálogo con el rango de compra que contiene el valor elegido */
  function seeRange() {
    const ranges = SITE.catalogo.presupuestos.venta;
    const r = ranges.find(([min, max]) => state.valor >= min && (max == null || state.valor <= max)) || ranges[0];
    HL.store.setFilters({ op: 'venta', presupuesto: 'venta|' + r[0] + '|' + (r[1] == null ? '' : r[1]), tipo: '', zona: '', recamaras: 0 }, 'mortgage');
    HL.$('#propiedades').scrollIntoView({ behavior: HL.reducedMotion() ? 'auto' : 'smooth' });
  }
})(window.HL = window.HL || {});
