/* ==========================================================================
   Ecowatt — interacciones de la página
   Sin librerías. Funciona en navegadores modernos.
   ========================================================================== */

/* ==========================================================================
   CONFIG — Ecowatt: ajusta aquí los valores de la calculadora y del sitio.
   Todos los números marcados con [Ajustar] son valores de referencia:
   reemplázalos por los reales antes de publicar.
   ========================================================================== */
const CONFIG = {
  // Mientras sea true, la calculadora muestra la etiqueta "Valores de ejemplo".
  // Cámbialo a false cuando Ecowatt confirme todos los números de abajo.
  datosDeEjemplo: true,

  contacto: {
    whatsapp: '524772992060', // Número con lada de país (52), sin "+" ni espacios.
  },

  // kWh = kilowatt-hora, la unidad con la que CFE cobra la luz.
  tarifas: {
    casa: {
      precioKwh: 3.2,             // [Ajustar] Pesos por kWh, con IVA. Promedio de los recibos de casa que cotizan.
      cargoMinimoBimestral: 150,  // [Ajustar] Lo que se sigue pagando a CFE con paneles (cargo mínimo + alumbrado público).
      pagoInicial: 3500,          // Monto con el que arranca la calculadora.
      pagoMaximoDeslizador: 20000,
      pagoBajo: 1200,             // [Ajustar] Abajo de este monto avisamos que el sistema tarda más en pagarse.
    },
    negocio: {
      precioKwh: 4.6,             // [Ajustar] Pesos por kWh, con IVA. Promedio de recibos de negocio.
      cargoMinimoBimestral: 400,  // [Ajustar]
      pagoInicial: 12000,
      pagoMaximoDeslizador: 150000,
      pagoBajo: 3000,             // [Ajustar]
    },
  },

  panel: {
    potenciaW: 550,               // [Ajustar] Watts de cada panel que instala Ecowatt.
    costoInstaladoPorPanel: 11500 // [Ajustar] Pesos por panel, con inversor, estructura e instalación prorrateados.
                                  // Solo se usa para estimar los años de recuperación; no se muestra en la página.
  },

  rendimientoSistema: 0.78,       // [Ajustar] Pérdidas por calor, polvo, cableado e inversor (lo común: 0.75 a 0.82).
  diasPorBimestre: 61,

  // hsp = horas de sol pico al día, promedio anual. [Ajustar con los datos de Ecowatt]
  // slug: identifica la ciudad en los <select> y en las páginas por ciudad (<body data-ciudad="slug">).
  ciudades: [
    { slug: 'leon',                  nombre: 'León',                  hsp: 5.6 },
    { slug: 'san-miguel-de-allende', nombre: 'San Miguel de Allende', hsp: 5.7 },
    { slug: 'guadalajara',           nombre: 'Guadalajara',           hsp: 5.6 },
    { slug: 'morelia',               nombre: 'Morelia',               hsp: 5.4 },
    { slug: 'san-luis-potosi',       nombre: 'San Luis Potosí',       hsp: 5.8 },
    { slug: 'aguascalientes',        nombre: 'Aguascalientes',        hsp: 5.9 },
    { slug: 'queretaro',             nombre: 'Querétaro',             hsp: 5.7 },
    { slug: 'zacatecas',             nombre: 'Zacatecas',             hsp: 6.0 },
  ],
  ciudadOtra: { slug: 'otra', nombre: 'Otra ciudad', hsp: 5.5 },

  formulario: {
    // URL que recibe el formulario por POST (multipart/form-data, incluye la foto del recibo).
    // Sirve Formspree, Netlify Forms, un webhook o un PHP propio.
    // Vacío = modo demostración: la página muestra el mensaje de éxito pero los datos NO se envían.
    endpoint: '',
    tamanoMaximoMB: 10,
  },
};

/* ==========================================================================
   Utilidades
   ========================================================================== */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');

  const formatoPesos = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
  const formatoNumero = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });
  const formatoDecimal = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const pesos = (n) => formatoPesos.format(Math.round(n));

  const linkWhatsApp = (mensaje) =>
    `https://wa.me/${CONFIG.contacto.whatsapp}?text=${encodeURIComponent(mensaje)}`;

  const buscarCiudad = (slug) => CONFIG.ciudades.find((c) => c.slug === slug) || CONFIG.ciudadOtra;
  const ciudadPagina = buscarCiudad(document.body.dataset.ciudad || 'leon');
  const nombreCiudadPagina = ciudadPagina.slug === 'otra' ? 'mi ciudad' : ciudadPagina.nombre;

  const leerMonto = (texto) => {
    const n = parseInt(String(texto).replace(/\D/g, ''), 10);
    return Number.isFinite(n) ? n : 0;
  };

  // Formulario final: se declara aquí porque la calculadora lo rellena.
  const form = $('#form-cotiza');
  const tocados = new Set();

  /* ------------------------------------------------------------------------
     1. Enlaces de WhatsApp con mensaje ya escrito
     Cada enlace trae su mensaje en data-wa; {ciudad} se cambia por la ciudad
     de la página (útil para las páginas por ciudad).
     ------------------------------------------------------------------------ */
  $$('a[data-wa]').forEach((a) => {
    a.href = linkWhatsApp(a.dataset.wa.replaceAll('{ciudad}', nombreCiudadPagina));
  });

  /* ------------------------------------------------------------------------
     2. Menú móvil
     ------------------------------------------------------------------------ */
  const menuBtn = $('#menu-btn');
  const nav = $('#nav');
  const menuTexto = $('[data-menu-texto]');

  const cerrarMenu = (devolverFoco = false) => {
    nav.classList.remove('abierto');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuTexto.textContent = 'Abrir menú';
    document.documentElement.classList.remove('sin-scroll');
    if (devolverFoco) menuBtn.focus();
  };
  const abrirMenu = () => {
    nav.classList.add('abierto');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuTexto.textContent = 'Cerrar menú';
    document.documentElement.classList.add('sin-scroll');
    const primero = $('a', nav);
    if (primero) primero.focus();
  };

  menuBtn.addEventListener('click', () => {
    if (menuBtn.getAttribute('aria-expanded') === 'true') cerrarMenu();
    else abrirMenu();
  });
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) cerrarMenu();
  });
  window.matchMedia('(min-width: 1080px)').addEventListener('change', (e) => {
    if (e.matches) cerrarMenu();
  });

  /* ------------------------------------------------------------------------
     3. Calculadora de ahorro
     ------------------------------------------------------------------------ */
  const calc = {
    form: $('#calc-form'),
    pago: $('#calc-pago'),
    rango: $('#calc-rango'),
    ciudad: $('#calc-ciudad'),
    recibo: $('#recibo'),
    cifra: $('#r-despues'),
    antes: $('#r-antes'),
    barra: $('#r-barra'),
    barraPct: $('#r-barra-pct'),
    sello: $('#r-sello'),
    wa: $('#calc-wa'),
  };

  const tipoCalc = () => $('input[name="calc-tipo"]:checked').value;

  function calcular({ tipo, pago, ciudad }) {
    const t = CONFIG.tarifas[tipo];
    const c = buscarCiudad(ciudad);
    const despues = Math.min(pago, t.cargoMinimoBimestral);
    const ahorroBimestral = Math.max(0, pago - despues);
    const kwhACubrir = ahorroBimestral / t.precioKwh;
    const kwhPorPanel = (CONFIG.panel.potenciaW / 1000) * c.hsp * CONFIG.rendimientoSistema * CONFIG.diasPorBimestre;
    const paneles = ahorroBimestral > 0 ? Math.max(1, Math.ceil(kwhACubrir / kwhPorPanel)) : 0;
    const kwp = (paneles * CONFIG.panel.potenciaW) / 1000;
    const ahorroAnual = ahorroBimestral * 6;
    const inversion = paneles * CONFIG.panel.costoInstaladoPorPanel;
    const anos = ahorroAnual > 0 ? inversion / ahorroAnual : null;
    return { tipo, pago, ciudad: c, despues, ahorroBimestral, ahorroAnual, paneles, kwp, anos, bajo: pago < t.pagoBajo };
  }

  function textoAnos(anos) {
    if (anos == null) return '—';
    if (anos < 1) return 'Menos de 1 año';
    const menor = Math.floor(anos);
    const mayor = Math.ceil(anos);
    if (menor === mayor) return `${menor} ${menor === 1 ? 'año' : 'años'}`;
    return `${menor} a ${mayor} años`;
  }

  function lugarTexto(c) {
    return c.slug === 'otra' ? 'en otra ciudad' : `en ${c.nombre}`;
  }

  function mensajeCalculo(r) {
    return `Hola, usé la calculadora de ecowatt.mx. Es para mi ${r.tipo} ${lugarTexto(r.ciudad)} ` +
      `y pago ${pesos(r.pago)} de luz al bimestre. El estimado me dio ${r.paneles} ` +
      `${r.paneles === 1 ? 'panel' : 'paneles'} y un ahorro de ${pesos(r.ahorroBimestral)} al bimestre. ` +
      'Quiero mi cotización exacta.';
  }

  /* Animación del recibo: el total baja de lo que pagas hoy a lo que pagarías. */
  let cuadro = 0;
  let espera = 0;
  let reciboVisto = false;
  let ultimo = null;

  function ponerTotal(valor, r) {
    calc.cifra.textContent = pesos(valor);
    const proporcion = r.pago > 0 ? valor / r.pago : 1;
    calc.barra.style.transform = `scaleX(${proporcion})`;
    calc.barraPct.textContent = `${Math.round(proporcion * 100)}%`;
  }

  function mostrarAntes(r) {
    cancelAnimationFrame(cuadro);
    calc.recibo.classList.remove('hecho');
    ponerTotal(r.pago, r);
  }

  function animarRecibo(r) {
    cancelAnimationFrame(cuadro);
    const terminar = () => {
      ponerTotal(r.despues, r);
      calc.recibo.classList.add('hecho');
    };
    if (movimientoReducido.matches || r.ahorroBimestral <= 0) {
      terminar();
      return;
    }
    calc.recibo.classList.remove('hecho');
    const duracion = 1300;
    const pausa = 250;
    const inicio = performance.now();
    const paso = (ahora) => {
      const t = Math.min(1, Math.max(0, (ahora - inicio - pausa) / duracion));
      const suave = 1 - Math.pow(1 - t, 3);
      ponerTotal(r.pago + (r.despues - r.pago) * suave, r);
      if (t < 1) cuadro = requestAnimationFrame(paso);
      else terminar();
    };
    cuadro = requestAnimationFrame(paso);
  }

  function pintar(r) {
    $('#r-tipo').textContent = r.tipo === 'casa' ? 'Casa' : 'Negocio';
    $('#r-ciudad').textContent = r.ciudad.slug === 'otra' ? 'otra ciudad' : r.ciudad.nombre;
    calc.antes.textContent = pesos(r.pago);
    calc.sello.textContent = `Ahorras ${pesos(r.ahorroBimestral)} al bimestre`;

    $('#c-paneles').textContent = r.paneles > 0 ? `${r.paneles} ${r.paneles === 1 ? 'panel' : 'paneles'}` : '—';
    $('#c-kwp').textContent = r.paneles > 0 ? `Sistema de ${formatoDecimal.format(r.kwp)} kWp` : 'Sistema de — kWp';
    $('#c-bimestre').textContent = r.ahorroBimestral > 0 ? pesos(r.ahorroBimestral) : '—';
    $('#c-anual').textContent = r.ahorroAnual > 0 ? pesos(r.ahorroAnual) : '—';
    $('#c-retorno').textContent = textoAnos(r.anos);

    const aviso = $('#c-aviso');
    if (r.pago <= 0) {
      aviso.textContent = 'Escribe cuánto pagas de luz al bimestre para ver tu estimado.';
      aviso.hidden = false;
    } else if (r.ahorroBimestral <= 0) {
      aviso.textContent = 'Tu recibo ya está cerca del mínimo. Escríbenos y revisamos si te conviene un sistema.';
      aviso.hidden = false;
    } else if (r.bajo) {
      aviso.textContent = 'Con un recibo así de bajo, el sistema tarda más en pagarse. Escríbenos y revisamos tu caso.';
      aviso.hidden = false;
    } else {
      aviso.hidden = true;
    }

    $('#c-fiscal').hidden = r.tipo !== 'negocio';
    $$('[data-solo-negocio]').forEach((el) => { el.hidden = r.tipo !== 'negocio'; });

    calc.wa.href = r.paneles > 0
      ? linkWhatsApp(mensajeCalculo(r))
      : linkWhatsApp(`Hola, quiero cotizar paneles solares para mi ${r.tipo} ${lugarTexto(r.ciudad)}.`);

    $('#c-resumen').textContent = r.paneles > 0
      ? `Estimado: ${r.paneles} paneles. Tu recibo bajaría de ${pesos(r.pago)} a ${pesos(r.despues)} al bimestre. ` +
        `Ahorras ${pesos(r.ahorroAnual)} al año y recuperas tu inversión en ${textoAnos(r.anos)}.`
      : '';
  }

  function leerCalculadora() {
    return { tipo: tipoCalc(), pago: leerMonto(calc.pago.value), ciudad: calc.ciudad.value };
  }

  function actualizarRango(valor) {
    const min = Number(calc.rango.min);
    const max = Number(calc.rango.max);
    const v = Math.min(max, Math.max(min, valor));
    calc.rango.value = String(v);
    calc.rango.style.setProperty('--lleno', `${((v - min) / (max - min)) * 100}%`);
  }

  // inmediato: true al arrancar o cuando el recibo entra en pantalla.
  // Mientras la persona escribe o arrastra, el recibo muestra lo que paga hoy;
  // al soltar, el total baja a lo que pagaría con paneles.
  function recalcular({ inmediato = false } = {}) {
    const r = calcular(leerCalculadora());
    ultimo = r;
    pintar(r);
    rellenarFormulario(r);
    clearTimeout(espera);
    if (!reciboVisto) {
      mostrarAntes(r);
      return;
    }
    if (inmediato) {
      animarRecibo(r);
      return;
    }
    mostrarAntes(r);
    espera = setTimeout(() => animarRecibo(r), 450);
  }

  if (calc.form) {
    $('#calc-ejemplo').hidden = !CONFIG.datosDeEjemplo;
    calc.ciudad.value = buscarCiudad(ciudadPagina.slug).slug;

    const aplicarTipo = (tipo, cambiarMonto) => {
      const t = CONFIG.tarifas[tipo];
      calc.rango.max = String(t.pagoMaximoDeslizador);
      calc.rango.step = tipo === 'negocio' ? '500' : '100';
      if (cambiarMonto) calc.pago.value = formatoNumero.format(t.pagoInicial);
      actualizarRango(leerMonto(calc.pago.value));
    };
    aplicarTipo(tipoCalc(), true);

    let montoTocado = false;
    calc.form.addEventListener('submit', (e) => e.preventDefault());

    $$('input[name="calc-tipo"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        aplicarTipo(tipoCalc(), !montoTocado);
        recalcular();
      });
    });

    calc.pago.addEventListener('input', () => {
      montoTocado = true;
      const limpio = calc.pago.value.replace(/[^\d,]/g, '');
      if (limpio !== calc.pago.value) calc.pago.value = limpio;
      actualizarRango(leerMonto(calc.pago.value));
      recalcular();
    });
    calc.pago.addEventListener('blur', () => {
      const n = leerMonto(calc.pago.value);
      calc.pago.value = n > 0 ? formatoNumero.format(n) : '';
    });

    calc.rango.addEventListener('input', () => {
      montoTocado = true;
      const v = Number(calc.rango.value);
      calc.pago.value = formatoNumero.format(v);
      actualizarRango(v);
      recalcular();
    });

    calc.ciudad.addEventListener('change', () => recalcular());

    recalcular();

    // El momento orquestado de la página: el recibo baja cuando lo ves por primera vez.
    if ('IntersectionObserver' in window) {
      const observador = new IntersectionObserver((entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          reciboVisto = true;
          observador.disconnect();
          recalcular({ inmediato: true });
        }
      }, { threshold: 0.55 });
      observador.observe(calc.recibo);
    } else {
      reciboVisto = true;
      recalcular({ inmediato: true });
    }
  }

  /* ------------------------------------------------------------------------
     4. Filtro de proyectos
     ------------------------------------------------------------------------ */
  const botonesFiltro = $$('.filtro button');
  botonesFiltro.forEach((boton) => {
    boton.addEventListener('click', () => {
      const filtro = boton.dataset.filtro;
      botonesFiltro.forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
      let visibles = 0;
      $$('.proyecto').forEach((p) => {
        const mostrar = filtro === 'todos' || p.dataset.tipo === filtro;
        p.hidden = !mostrar;
        if (mostrar) visibles += 1;
      });
      $('#proyectos-estado').textContent = `Mostrando ${visibles} ${visibles === 1 ? 'proyecto' : 'proyectos'}.`;
    });
  });

  /* ------------------------------------------------------------------------
     5. Formulario de cotización
     Valida al salir de cada campo; si hay error, lo quita en cuanto se corrige.
     ------------------------------------------------------------------------ */
  function normalizarTelefono(texto) {
    let d = String(texto).replace(/\D/g, '');
    if (d.length === 13 && d.startsWith('521')) d = d.slice(3);
    else if (d.length === 12 && d.startsWith('52')) d = d.slice(2);
    return d;
  }

  const maxMB = CONFIG.formulario.tamanoMaximoMB;
  const reglas = {
    tipo: () => (form.elements.tipo.value ? '' : 'Elige si los paneles son para tu casa o tu negocio.'),
    pago: () => (leerMonto(form.elements.pago.value) >= 50
      ? '' : 'Escribe cuánto pagas al bimestre, solo el número. Por ejemplo: 2500.'),
    ciudad: () => (form.elements.ciudad.value ? '' : 'Elige tu ciudad. Si no aparece, elige “Otra ciudad”.'),
    nombre: () => (form.elements.nombre.value.trim().length >= 2 ? '' : 'Escribe tu nombre.'),
    whatsapp: () => (normalizarTelefono(form.elements.whatsapp.value).length === 10
      ? '' : 'Escribe tu WhatsApp a 10 dígitos.'),
    recibo: () => {
      const archivo = form.elements.recibo.files[0];
      if (!archivo) return '';
      if (!/^image\//.test(archivo.type) && archivo.type !== 'application/pdf') {
        return 'Sube una foto (JPG o PNG) o un PDF de tu recibo.';
      }
      if (archivo.size > maxMB * 1024 * 1024) {
        return `La foto pesa más de ${maxMB} MB. Prueba con una más ligera o con una captura de pantalla.`;
      }
      return '';
    },
    privacidad: () => (form.elements.privacidad.checked ? '' : 'Marca la casilla para aceptar el aviso de privacidad.'),
  };

  function mostrarError(nombre, mensaje) {
    const campo = $(`[data-campo="${nombre}"]`, form);
    const error = $('.error', campo);
    error.textContent = mensaje;
    error.hidden = !mensaje;
    $$('input, select', campo).forEach((control) => {
      if (mensaje) control.setAttribute('aria-invalid', 'true');
      else control.removeAttribute('aria-invalid');
    });
    const seg = $('.seg', campo);
    if (seg) seg.classList.toggle('invalido', Boolean(mensaje));
  }

  function validar(nombre) {
    const mensaje = reglas[nombre]();
    mostrarError(nombre, mensaje);
    return !mensaje;
  }

  function enfocarCampo(nombre) {
    const campo = $(`[data-campo="${nombre}"]`, form);
    const control = $('input:not([type="hidden"]), select', campo);
    if (control) control.focus();
  }

  // Si la persona usó la calculadora, adelantamos esos datos en el formulario.
  function rellenarFormulario(r) {
    if (!form) return;
    if (!tocados.has('tipo')) {
      const radio = $(`input[name="tipo"][value="${r.tipo}"]`, form);
      if (radio) radio.checked = true;
    }
    if (!tocados.has('pago') && r.pago > 0) form.elements.pago.value = formatoNumero.format(r.pago);
    if (!tocados.has('ciudad')) form.elements.ciudad.value = r.ciudad.slug;
  }

  if (form) {
    const nombreDe = (el) => el.closest('[data-campo]')?.dataset.campo;

    form.addEventListener('focusout', (e) => {
      const nombre = nombreDe(e.target);
      if (!nombre || nombre === 'recibo') return;
      // Los radios se validan al cambiar; no al pasar de una opción a otra.
      if (e.target.type === 'radio' && form.contains(e.relatedTarget) && nombreDe(e.relatedTarget) === nombre) return;
      if (e.target.value || tocados.has(nombre)) {
        tocados.add(nombre);
        validar(nombre);
      }
    });

    const alCambiar = (e) => {
      const nombre = nombreDe(e.target);
      if (!nombre) return;
      tocados.add(nombre);
      const error = $(`[data-campo="${nombre}"] .error`, form);
      const esInmediato = ['tipo', 'ciudad', 'privacidad', 'recibo'].includes(nombre);
      if (esInmediato || !error.hidden) validar(nombre);
    };
    form.addEventListener('input', alCambiar);
    form.addEventListener('change', alCambiar);

    // Foto del recibo
    const archivo = form.elements.recibo;
    const elegido = $('#f-recibo-elegido');
    archivo.addEventListener('change', () => {
      const f = archivo.files[0];
      elegido.hidden = !f;
      $('#f-recibo-nombre').textContent = f ? f.name : '';
    });
    $('#f-recibo-quitar').addEventListener('click', () => {
      archivo.value = '';
      elegido.hidden = true;
      mostrarError('recibo', '');
      archivo.focus();
    });

    const boton = $('#form-enviar');
    const textoBoton = boton.textContent;
    const errorGeneral = $('#form-error');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorGeneral.hidden = true;
      let primero = null;
      Object.keys(reglas).forEach((nombre) => {
        tocados.add(nombre);
        if (!validar(nombre) && !primero) primero = nombre;
      });
      if (primero) {
        enfocarCampo(primero);
        return;
      }

      boton.disabled = true;
      boton.textContent = 'Mandando tus datos…';

      try {
        const datos = new FormData(form);
        datos.set('whatsapp', normalizarTelefono(form.elements.whatsapp.value));
        datos.set('pago', String(leerMonto(form.elements.pago.value)));
        datos.set('pagina', window.location.href);
        if (ultimo && ultimo.paneles > 0) {
          datos.set('estimado_paneles', String(ultimo.paneles));
          datos.set('estimado_ahorro_bimestral', String(Math.round(ultimo.ahorroBimestral)));
        }

        if (CONFIG.formulario.endpoint) {
          const respuesta = await fetch(CONFIG.formulario.endpoint, {
            method: 'POST',
            body: datos,
            headers: { Accept: 'application/json' },
          });
          if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        } else {
          console.warn('[Ecowatt] Formulario en modo demostración: configura CONFIG.formulario.endpoint para recibir los datos.');
        }

        const nombre = form.elements.nombre.value.trim();
        const ciudad = buscarCiudad(form.elements.ciudad.value);
        $('#form-exito-wa').href = linkWhatsApp(
          `Hola, soy ${nombre}. Acabo de dejar mis datos en ecowatt.mx para una cotización ${lugarTexto(ciudad)}. Les mando la foto de mi recibo.`
        );
        form.hidden = true;
        $('#form-exito').hidden = false;
        $('#form-exito-titulo').focus();
      } catch (err) {
        errorGeneral.innerHTML = '';
        errorGeneral.append('No pudimos mandar tus datos. Revisa tu conexión e intenta de nuevo, o ');
        const enlace = document.createElement('a');
        enlace.href = linkWhatsApp(`Hola, quiero cotizar paneles solares en ${nombreCiudadPagina}.`);
        enlace.target = '_blank';
        enlace.rel = 'noopener';
        enlace.textContent = 'escríbenos por WhatsApp';
        errorGeneral.append(enlace, '.');
        errorGeneral.hidden = false;
        boton.disabled = false;
        boton.textContent = textoBoton;
      }
    });
  }

  /* ------------------------------------------------------------------------
     6. Asistente 24/7 (maqueta)
     ------------------------------------------------------------------------ */
  const chatBtn = $('#chat-btn');
  const chatPanel = $('#chat-panel');
  const abrirChat = () => {
    chatPanel.hidden = false;
    chatBtn.setAttribute('aria-expanded', 'true');
    $('#chat-cerrar').focus();
  };
  const cerrarChat = (devolverFoco = true) => {
    chatPanel.hidden = true;
    chatBtn.setAttribute('aria-expanded', 'false');
    if (devolverFoco) chatBtn.focus();
  };
  if (chatBtn && chatPanel) {
    chatBtn.addEventListener('click', () => (chatPanel.hidden ? abrirChat() : cerrarChat()));
    $('#chat-cerrar').addEventListener('click', () => cerrarChat());
    $$('[data-cerrar-chat]', chatPanel).forEach((a) => a.addEventListener('click', () => cerrarChat(false)));
  }

  /* Escape cierra el menú o el asistente */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (menuBtn.getAttribute('aria-expanded') === 'true') cerrarMenu(true);
    else if (chatPanel && !chatPanel.hidden) cerrarChat();
  });

  /* ------------------------------------------------------------------------
     7. Aviso de privacidad
     ------------------------------------------------------------------------ */
  const aviso = $('#aviso-privacidad');
  $$('[data-abrir-aviso]').forEach((enlace) => {
    enlace.addEventListener('click', (e) => {
      if (aviso && typeof aviso.showModal === 'function') {
        e.preventDefault();
        aviso.showModal();
      }
    });
  });

  /* ------------------------------------------------------------------------
     8. Año actual en el pie
     ------------------------------------------------------------------------ */
  $$('[data-anio]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
})();
