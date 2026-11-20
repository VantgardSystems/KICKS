/* =====================================================================
   SECCIONES — métricas, servicios, valuación, asesores, oficina, footer,
   botón de WhatsApp y datos estructurados (SEO). Todo sale de data.js.
   ===================================================================== */
(function (HL) {
  'use strict';

  const SITE = window.SITE;
  HL.sections = { init };

  function init() {
    metrics();
    services();
    valuation();
    contact();
    footer();
    waFab();
    seo();
  }

  /* ---------- Indicadores de confianza con contador ---------- */
  function metrics() {
    const list = HL.$('#metrics');
    list.innerHTML = SITE.metricas.map((m) => m.texto
      ? '<li class="metric metric--seal glass-static"><span class="metric__value">' + HL.icon('award') + HL.esc(m.texto) + '</span><span class="metric__label">' + HL.esc(m.etiqueta) + '</span></li>'
      : '<li class="metric glass-static"><span class="metric__value" data-count="' + m.valor + '" data-prefix="' + HL.esc(m.prefijo || '') + '" data-suffix="' + HL.esc(m.sufijo || '') + '" aria-label="' + HL.esc((m.prefijo || '') + m.valor + (m.sufijo || '') + ' ' + m.etiqueta) + '">' +
        HL.esc((m.prefijo || '') + m.valor + (m.sufijo || '')) + '</span><span class="metric__label" aria-hidden="true">' + HL.esc(m.etiqueta) + '</span></li>').join('');
    const nums = HL.$$('[data-count]', list);
    if (HL.reducedMotion() || !('IntersectionObserver' in window)) return;
    const final = (el) => el.dataset.prefix + HL.num(Number(el.dataset.count)) + el.dataset.suffix;
    // Solo se ponen en cero las cifras que aún no se han visto (debajo del viewport)
    nums.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) el.textContent = el.dataset.prefix + '0' + el.dataset.suffix;
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (!entry.isIntersecting) {
          // Si se pasó de largo (salto con un enlace), queda la cifra final
          if (entry.boundingClientRect.bottom < 0) { el.textContent = final(el); io.unobserve(el); }
          return;
        }
        io.unobserve(el);
        const to = Number(el.dataset.count);
        const t0 = performance.now();
        const tick = (now) => {
          const k = Math.min(1, (now - t0) / 1300);
          const v = Math.round(to * (1 - Math.pow(1 - k, 3)));
          el.textContent = el.dataset.prefix + HL.num(v) + el.dataset.suffix;
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.25 });
    nums.forEach((el) => io.observe(el));
  }

  /* ---------- Servicios ---------- */
  function services() {
    HL.$('#services').innerHTML = SITE.servicios.map((s) => {
      const href = s.accion === 'whatsapp'
        ? HL.waLink(SITE.contacto.whatsapp, 'Hola, me interesa el servicio de ' + s.titulo.toLowerCase() + '.')
        : s.accion;
      const ext = s.accion === 'whatsapp' ? ' target="_blank" rel="noopener"' : '';
      return '<article class="service glass-static">' +
        '<span class="service__icon">' + HL.icon(s.icono) + '</span>' +
        '<h3 class="h3">' + HL.esc(s.titulo) + '</h3>' +
        '<p>' + HL.esc(s.texto) + '</p>' +
        '<a class="link-arrow" href="' + HL.esc(href) + '"' + ext + '>' + HL.esc(s.cta) + HL.icon('arrow') + '</a>' +
      '</article>';
    }).join('');
  }

  /* ---------- Valuación (formulario sólido → WhatsApp) ---------- */
  function valuation() {
    const form = HL.$('#valuation-form');
    form.innerHTML =
      '<div><h3 class="h3">Solicita tu valuación</h3><p class="subtle" style="font-size:14px;margin-top:4px">Te contactamos por WhatsApp con la opinión de valor.</p></div>' +
      '<fieldset class="field" style="border:0;margin:0;padding:0;min-width:0"><legend class="field__label" style="padding:0;margin-bottom:6px">¿Qué quieres hacer?</legend>' +
        '<div class="seg"><label class="chip"><input type="radio" name="operacion" value="Vender" checked><span>Vender</span></label><label class="chip"><input type="radio" name="operacion" value="Rentar"><span>Rentar</span></label></div></fieldset>' +
      '<div class="form-grid">' +
        '<label class="field"><span class="field__label">Tipo de propiedad</span><select class="select" name="tipo">' + SITE.catalogo.tipos.map((t) => '<option>' + HL.esc(t) + '</option>').join('') + '</select></label>' +
        '<label class="field"><span class="field__label">Construcción aprox. (m²)</span><input class="input" name="m2" type="number" inputmode="numeric" min="0" placeholder="Ej. 220"></label>' +
        '<label class="field span-2"><span class="field__label">Colonia y ciudad</span><input class="input" name="zona" autocomplete="address-level2" placeholder="Ej. Polanco, CDMX" required aria-describedby="val-zona-err"><span class="field__error" id="val-zona-err" hidden></span></label>' +
        '<label class="field"><span class="field__label">Nombre</span><input class="input" name="nombre" autocomplete="name" required aria-describedby="val-nombre-err"><span class="field__error" id="val-nombre-err" hidden></span></label>' +
        '<label class="field"><span class="field__label">Teléfono / WhatsApp</span><input class="input" name="telefono" type="tel" inputmode="tel" autocomplete="tel" placeholder="55 1234 5678" required aria-describedby="val-tel-err"><span class="field__error" id="val-tel-err" hidden></span></label>' +
      '</div>' +
      '<button class="btn btn--primary btn--block" type="submit">' + HL.icon('whatsapp') + 'Solicitar valuación gratuita</button>' +
      '<div class="success" data-success hidden></div>' +
      '<p class="form-note">Sin costo ni compromiso. <a href="' + HL.esc(SITE.contacto.avisoPrivacidad) + '">Aviso de privacidad</a></p>';

    const saved = HL.storage.get('contacto', {}) || {};
    if (saved.nombre) form.elements.nombre.value = saved.nombre;
    if (saved.telefono) form.elements.telefono.value = saved.telefono;

    const rules = {
      zona: (v) => (v.trim().length < 3 ? 'Escribe la colonia y la ciudad.' : ''),
      nombre: (v) => (v.trim().length < 3 ? 'Escribe tu nombre.' : ''),
      telefono: (v) => {
        const d = v.replace(/\D/g, '');
        return d.length === 10 || (d.length === 12 && d.indexOf('52') === 0) || (d.length === 13 && d.indexOf('521') === 0) ? '' : 'Escribe 10 dígitos, por ejemplo 55 1234 5678.';
      }
    };
    const errId = { zona: 'val-zona-err', nombre: 'val-nombre-err', telefono: 'val-tel-err' };
    const check = (name) => {
      const input = form.elements[name];
      const msg = rules[name](input.value);
      const el = HL.$('#' + errId[name]);
      el.textContent = msg;
      el.hidden = !msg;
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    };
    form.addEventListener('focusout', (e) => { if (rules[e.target.name] && e.target.value) check(e.target.name); });
    form.addEventListener('input', (e) => { if (rules[e.target.name] && e.target.getAttribute('aria-invalid') === 'true') check(e.target.name); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = Object.keys(rules).filter((n) => !check(n));
      if (bad.length) { form.elements[bad[0]].focus(); return; }
      const f = form.elements;
      const op = form.querySelector('input[name="operacion"]:checked').value;
      HL.storage.set('contacto', Object.assign({}, HL.storage.get('contacto', {}), { nombre: f.nombre.value.trim(), telefono: f.telefono.value.trim() }));
      const msg = [
        'Hola, quiero una valuación comercial gratuita para ' + op.toLowerCase() + ' mi propiedad.',
        '• Tipo: ' + f.tipo.value,
        f.m2.value ? '• Construcción aprox.: ' + f.m2.value + ' m²' : null,
        '• Ubicación: ' + f.zona.value.trim(),
        '• Nombre: ' + f.nombre.value.trim(),
        '• Teléfono: ' + f.telefono.value.trim()
      ].filter(Boolean).join('\n');
      window.open(HL.waLink(SITE.contacto.whatsapp, msg), '_blank', 'noopener');
      const ok = HL.$('[data-success]', form);
      ok.innerHTML = '<strong>' + HL.icon('check', 'width="18" height="18" style="display:inline;vertical-align:-4px"') + ' Solicitud lista</strong><p class="muted" style="font-size:14.5px">Abrimos WhatsApp con tus datos. Un asesor te responderá con la opinión de valor en 48 horas hábiles.</p>';
      ok.hidden = false;
    });

    // Fondo de la banda: se carga solo cuando se acerca al viewport
    const bg = HL.$('.valuation__bg');
    if (bg && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        bg.style.backgroundImage = 'url("' + bg.dataset.bg + '")';
        io.disconnect();
      }, { rootMargin: '600px 0px' });
      io.observe(bg);
    } else if (bg) bg.style.backgroundImage = 'url("' + bg.dataset.bg + '")';
  }

  /* ---------- Asesores y oficina ---------- */
  function contact() {
    HL.$('#advisors').innerHTML = SITE.asesores.map((a) => {
      const first = a.nombre.split(' ')[0];
      return '<article class="advisor glass-static">' +
        '<div class="advisor__head"><span class="avatar" aria-hidden="true">' + HL.initials(a.nombre) + '</span>' +
        '<div><h3 class="advisor__name">' + HL.esc(a.nombre) + '</h3><p class="advisor__role">' + HL.esc(a.cargo) + '</p></div></div>' +
        '<span class="advisor__cert">' + HL.icon('award') + HL.esc(a.certificacion) + '</span>' +
        '<div class="advisor__actions">' +
          '<a class="btn btn--wa btn--sm" href="' + HL.waLink(a.whatsapp, 'Hola ' + first + ', me interesa recibir asesoría.') + '" target="_blank" rel="noopener">' + HL.icon('whatsapp') + 'WhatsApp</a>' +
          '<a class="btn btn--ghost btn--sm" href="' + HL.mailLink(a.email, 'Asesoría inmobiliaria', 'Hola ' + first + ',\n\n') + '">' + HL.icon('mail') + 'Correo</a>' +
        '</div></article>';
    }).join('');

    const c = SITE.contacto;
    HL.$('#office').innerHTML =
      '<h3 class="h3">Oficina ' + HL.esc(SITE.marca.nombre) + '</h3>' +
      '<dl>' +
        '<div><dt>Dirección</dt><dd>' + HL.esc(c.direccion) + '</dd></div>' +
        '<div><dt>Horario</dt><dd>' + HL.esc(c.horario) + '</dd></div>' +
        '<div><dt>Teléfono</dt><dd><a href="tel:' + c.telefono.replace(/[^\d+]/g, '') + '">' + HL.esc(c.telefono) + '</a></dd></div>' +
        '<div><dt>Correo</dt><dd><a href="mailto:' + HL.esc(c.email) + '">' + HL.esc(c.email) + '</a></dd></div>' +
      '</dl>' +
      '<div style="display:flex;flex-wrap:wrap;gap:10px">' +
        '<a class="btn btn--primary btn--sm" href="' + HL.waLink(c.whatsapp, 'Hola, me gustaría recibir información.') + '" target="_blank" rel="noopener">' + HL.icon('whatsapp') + 'Escríbenos</a>' +
        '<a class="btn btn--ghost btn--sm" href="https://www.google.com/maps/search/?api=1&query=' + c.mapa.lat + ',' + c.mapa.lng + '" target="_blank" rel="noopener">' + HL.icon('map') + 'Cómo llegar</a>' +
      '</div>';
  }

  /* ---------- Footer ---------- */
  function footer() {
    const c = SITE.contacto;
    const year = new Date().getFullYear();
    HL.$('#footer').innerHTML =
      '<div class="container">' +
        '<div class="footer__grid">' +
          '<div style="display:grid;gap:14px;align-content:start"><span class="footer__brand">' + HL.esc(SITE.marca.logoTexto) + '</span><p>' + HL.esc(SITE.marca.descripcion) + '</p>' +
            '<p class="advisor__cert">' + HL.icon('award') + 'Miembro certificado AMPI · Asesoría legal integral</p></div>' +
          '<nav aria-label="Propiedades"><h3>Propiedades</h3><ul>' +
            '<li><a href="#propiedades" data-filter-op="venta">Comprar</a></li>' +
            '<li><a href="#propiedades" data-filter-op="renta">Rentar</a></li>' +
            '<li><a href="#propiedades" data-filter-op="preventa">Preventas</a></li>' +
            '<li><a href="#calculadora">Calculadora hipotecaria</a></li></ul></nav>' +
          '<nav aria-label="Servicios"><h3>Servicios</h3><ul>' + SITE.servicios.map((s) => '<li><a href="#servicios">' + HL.esc(s.titulo) + '</a></li>').join('') + '</ul></nav>' +
          '<div><h3>Contacto</h3><ul>' +
            '<li><a href="tel:' + c.telefono.replace(/[^\d+]/g, '') + '">' + HL.esc(c.telefono) + '</a></li>' +
            '<li><a href="mailto:' + HL.esc(c.email) + '">' + HL.esc(c.email) + '</a></li>' +
            c.redes.map((r) => '<li><a href="' + HL.esc(r.url) + '" rel="noopener">' + HL.esc(r.nombre) + '</a></li>').join('') +
          '</ul></div>' +
        '</div>' +
        '<div class="footer__legal">' +
          '<span>© ' + year + ' ' + HL.esc(SITE.marca.nombre) + '. Precios y disponibilidad sujetos a cambio sin previo aviso; imágenes y planos ilustrativos.</span>' +
          '<span><a href="' + HL.esc(c.avisoPrivacidad) + '">Aviso de privacidad</a> · <a href="' + HL.esc(c.terminos) + '">Términos y condiciones</a></span>' +
        '</div>' +
      '</div>';
    HL.$('#footer').addEventListener('click', (e) => {
      const a = e.target.closest('[data-filter-op]');
      if (a) HL.store.setFilters({ op: a.dataset.filterOp, presupuesto: '', tipo: '', zona: '', recamaras: 0 }, 'footer');
    });
  }

  /* Botón flotante: aparece al salir del hero para no tapar el buscador */
  function waFab() {
    HL.$('#wa-fab').href = HL.waLink(SITE.contacto.whatsapp, 'Hola, vi su sitio y me gustaría recibir información.');
    const onScroll = () => document.body.classList.toggle('show-fab', window.scrollY > window.innerHeight * 0.6);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- SEO: título, descripción y JSON-LD ---------- */
  function seo() {
    const desc = HL.$('meta[name="description"]');
    if (desc) desc.setAttribute('content', SITE.marca.descripcion);
    const c = SITE.contacto;
    const data = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: SITE.marca.nombre,
      description: SITE.marca.descripcion,
      url: SITE.marca.url,
      telephone: c.telefono,
      email: c.email,
      address: { '@type': 'PostalAddress', streetAddress: c.direccion, addressCountry: 'MX' },
      geo: { '@type': 'GeoCoordinates', latitude: c.mapa.lat, longitude: c.mapa.lng },
      openingHours: 'Mo-Fr 09:00-19:00, Sa 10:00-15:00',
      foundingDate: String(SITE.marca.anioFundacion),
      makesOffer: SITE.propiedades.map((p) => ({
        '@type': 'Offer',
        price: p.precio,
        priceCurrency: p.moneda,
        businessFunction: p.operacion === 'renta' ? 'http://purl.org/goodrelations/v1#LeaseOut' : 'http://purl.org/goodrelations/v1#Sell',
        itemOffered: { '@type': p.tipo === 'Terreno' ? 'Landform' : p.tipo === 'Local Comercial' ? 'Place' : 'Accommodation', name: p.titulo, address: HL.locationText(p) }
      }))
    };
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }
})(window.HL = window.HL || {});
