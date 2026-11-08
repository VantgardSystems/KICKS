/* =========================================================================
   GEM · Grupo Eléctrico Mexicano — main.js
   JavaScript sin librerías. Se carga con "defer", así que el HTML ya existe.

   ▸ Para personalizar el sitio solo necesitas editar las 3 secciones de arriba:
       1. CONFIG ........... datos del negocio (teléfono, WhatsApp, etc.)
       2. CALCULADORA ...... constantes de la calculadora de ahorro
       3. MENSAJES_WA ...... textos que se escriben solos en WhatsApp
   ========================================================================= */
'use strict';

/* -------------------------------------------------------------------------
   1. CONFIG — Datos del negocio
   Reemplaza cada [MARCADOR] por el dato real. Lo que cambies aquí se
   actualiza automáticamente en todo el sitio.
   ------------------------------------------------------------------------- */
const CONFIG = {
  nombre: 'Grupo Eléctrico Mexicano',
  telefono: '[TELÉFONO]',            // Como quieres que se vea. Ej: '477 123 4567'
  whatsapp: '[WHATSAPP]',            // Solo números con 52 al inicio. Ej: '524771234567'
  correo: '[CORREO]',                // Ej: 'contacto@gem.mx'
  direccion: '[DIRECCIÓN]',          // Ej: 'Blvd. Adolfo López Mateos 1234, Col. Centro'
  horario: '[HORARIO]',              // Ej: 'Lunes a viernes de 9:00 a 18:00, sábados de 9:00 a 14:00'
  anios: '[AÑOS]',                   // Número. Ej: 8  (años de experiencia)
  instalaciones: '[INSTALACIONES]',  // Número. Ej: 350 (sistemas instalados)
  kwInstalados: '[KW]',              // Número. Ej: 1200 (kW instalados en total)
  calificacion: '[CALIFICACIÓN]',    // Ej: '4.9' (calificación en Google)
  resenas: '[RESEÑAS]',              // Ej: '120' (número de reseñas en Google)
  marcas: '[MARCAS]',                // Ej: 'Jinko, Trina, Huawei y Fronius'
  // Mapa: en Google Maps busca tu negocio → Compartir → Insertar un mapa → copia solo la URL del src.
  mapaUrl: 'https://www.google.com/maps?q=Le%C3%B3n%2C%20Guanajuato&output=embed', // [URL_MAPA]
  avisoPrivacidadUrl: '[URL_AVISO_PRIVACIDAD]',
  redes: {
    facebook: '[URL_FACEBOOK]',
    instagram: '[URL_INSTAGRAM]',
    tiktok: '[URL_TIKTOK]',
  },
  // true = resalta en amarillo los [MARCADORES] pendientes. Cámbialo a false al publicar.
  resaltarMarcadores: true,
};

/* -------------------------------------------------------------------------
   2. CALCULADORA — Constantes editables
   ------------------------------------------------------------------------- */
const CALCULADORA = {
  precioKwh: { casa: 5.8, negocio: 4.8 }, // MXN por kWh, promedio con IVA [CONFIRMAR]
  horasSolPico: 5.5,                      // Horas sol pico promedio en León
  potenciaPanelW: 550,                    // Potencia de cada panel en watts
  eficienciaSistema: 0.8,                 // Pérdidas por calor, cableado e inversor
  costoPorKw: 25000,                      // MXN por kW instalado, con IVA [CONFIRMAR]
  porcentajeAhorro: 0.95,                 // 0.95 = 95% (usa 0.90 para un cálculo más conservador)
  aumentoTarifaAnual: 0.04,               // Aumento anual estimado de la tarifa de CFE (para 25 años)
  degradacionAnual: 0.005,                // Pérdida anual de rendimiento de los paneles
  factorCO2: 0.438,                       // kg de CO₂ por kWh (factor de emisión del sistema eléctrico nacional; actualízalo con el vigente)
  diasBimestre: 60,
  // Límites del slider según el tipo de inmueble
  rango: {
    casa: { min: 500, max: 25000, paso: 100 },
    negocio: { min: 1000, max: 150000, paso: 500 },
  },
};

/* -------------------------------------------------------------------------
   3. MENSAJES_WA — Texto inicial de WhatsApp según el botón que se use
   ------------------------------------------------------------------------- */
const MENSAJES_WA = {
  general: 'Hola, vi su página y quiero cotizar paneles solares.',
  hero: 'Hola, vi su página y quiero cotizar paneles solares para bajar mi recibo de luz.',
  menu: 'Hola, vi su página y quiero cotizar paneles solares.',
  visita: 'Hola, quiero agendar una visita para cotizar paneles solares.',
  residencial: 'Hola, quiero cotizar paneles solares para mi casa.',
  comercial: 'Hola, quiero cotizar paneles solares para mi negocio.',
  industrial: 'Hola, quiero cotizar un sistema solar para mi industria.',
  mantenimiento: 'Hola, quiero agendar mantenimiento o limpieza de mis paneles solares.',
  proyectos: 'Hola, vi sus proyectos y quiero un sistema solar así.',
  financiamiento: 'Hola, quiero conocer sus opciones de financiamiento para paneles solares.',
  preguntas: 'Hola, tengo una duda sobre los paneles solares.',
  contacto: 'Hola, quiero cotizar paneles solares.',
  flotante: 'Hola, quiero cotizar paneles solares.',
};

/* =========================================================================
   A partir de aquí no necesitas modificar nada.
   ========================================================================= */

/* ---------- Utilidades ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const formatoMXN = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
const formatoNumero = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });
const formatoDecimal = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** ¿El valor sigue siendo un marcador tipo [ALGO]? */
const esMarcador = (valor) => typeof valor === 'string' && /^\s*\[.*\]\s*$/.test(valor);

/** Deja solo los dígitos de un texto */
const soloDigitos = (texto) => String(texto || '').replace(/\D/g, '');

/** Convierte un texto con números a entero (ej. "$4,500" → 4500) */
const aNumero = (texto) => {
  const digitos = soloDigitos(texto);
  return digitos ? parseInt(digitos, 10) : 0;
};

/** Lee una propiedad anidada, ej. leer(CONFIG, 'redes.facebook') */
const leer = (obj, ruta) => ruta.split('.').reduce((acc, clave) => (acc == null ? acc : acc[clave]), obj);

/** Arma el enlace de WhatsApp con el mensaje ya escrito */
function enlaceWhatsApp(mensaje) {
  const numero = soloDigitos(CONFIG.whatsapp);
  const texto = encodeURIComponent(mensaje || MENSAJES_WA.general);
  // Si aún no hay número, WhatsApp deja elegir el contacto (útil mientras se prueba)
  return numero ? `https://wa.me/${numero}?text=${texto}` : `https://wa.me/?text=${texto}`;
}

/** Abre WhatsApp en una pestaña nueva (o en la misma si el navegador la bloquea) */
function abrirWhatsApp(mensaje) {
  const url = enlaceWhatsApp(mensaje);
  const ventana = window.open(url, '_blank');
  if (ventana) {
    try { ventana.opener = null; } catch (e) { /* sin acción */ }
  } else {
    window.location.href = url;
  }
  return url;
}

/** Formatea el número de WhatsApp para mostrarlo: 524771234567 → +52 477 123 4567 */
function formatoWhatsApp(valor) {
  if (esMarcador(valor)) return valor;
  const d = soloDigitos(valor);
  if (d.length === 12 && d.startsWith('52')) return `+52 ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
  return valor;
}

/**
 * Registra eventos de conversión. Si instalas Google Tag Manager o GA4,
 * llegan solos a través de window.dataLayer.
 */
function registrarEvento(nombre, datos = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: nombre, ...datos });
}

/** Anima un número de "desde" a "hasta" llamando a pintar(valor) en cada cuadro */
function animarNumero(desde, hasta, duracion, pintar) {
  if (reducirMovimiento || duracion <= 0 || desde === hasta) {
    pintar(hasta);
    return;
  }
  const inicio = performance.now();
  const paso = (ahora) => {
    const t = Math.min((ahora - inicio) / duracion, 1);
    const suavizado = 1 - Math.pow(1 - t, 3); // easeOutCubic
    pintar(desde + (hasta - desde) * suavizado);
    if (t < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}

/* -------------------------------------------------------------------------
   Aplicar CONFIG al HTML
   ------------------------------------------------------------------------- */
function aplicarConfig() {
  const valores = { ...CONFIG, whatsappVisible: formatoWhatsApp(CONFIG.whatsapp) };

  if (CONFIG.resaltarMarcadores) document.documentElement.classList.add('marcadores');

  // Textos: data-config="clave"
  $$('[data-config]').forEach((el) => {
    const valor = leer(valores, el.dataset.config);
    if (valor == null) return;
    el.textContent = valor;
    el.classList.toggle('is-placeholder', esMarcador(valor));
  });

  // Enlaces: data-config-href="clave"
  $$('[data-config-href]').forEach((el) => {
    const valor = leer(valores, el.dataset.configHref);
    if (!valor || esMarcador(valor)) {
      el.setAttribute('href', '#');
      el.classList.add('is-placeholder');
      el.removeAttribute('target');
      el.addEventListener('click', (e) => e.preventDefault());
    } else {
      el.setAttribute('href', valor);
    }
  });

  // Teléfono
  const telefono = soloDigitos(CONFIG.telefono);
  $$('[data-tel]').forEach((el) => {
    if (telefono) el.setAttribute('href', `tel:${telefono.length === 10 ? '+52' : '+'}${telefono}`);
  });

  // Correo
  $$('[data-mail]').forEach((el) => {
    if (CONFIG.correo.includes('@')) el.setAttribute('href', `mailto:${CONFIG.correo}`);
  });

  // Mapa
  $$('[data-config-src]').forEach((el) => {
    const valor = leer(valores, el.dataset.configSrc);
    if (valor && !esMarcador(valor) && el.getAttribute('src') !== valor) el.setAttribute('src', valor);
  });

  // Botones de WhatsApp: data-wa="contexto"
  $$('[data-wa]').forEach((el) => {
    const contexto = el.dataset.wa;
    el.setAttribute('href', enlaceWhatsApp(MENSAJES_WA[contexto] || MENSAJES_WA.general));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
    el.addEventListener('click', () => registrarEvento('click_whatsapp', { origen: contexto }));
  });

  // Año del footer
  const anio = $('#anio');
  if (anio) anio.textContent = String(new Date().getFullYear());
}

/* -------------------------------------------------------------------------
   Header: fondo al hacer scroll, menú móvil y sección activa
   ------------------------------------------------------------------------- */
function iniciarHeader() {
  const header = $('#header');
  const boton = $('.menu-toggle', header);
  const nav = $('#menu-principal');
  if (!header || !boton || !nav) return;

  // Fondo sólido al hacer scroll
  const alHacerScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  alHacerScroll();
  window.addEventListener('scroll', alHacerScroll, { passive: true });

  // Menú móvil
  const escritorio = window.matchMedia('(min-width: 960px)');
  let abierto = false;

  const abrir = () => {
    abierto = true;
    header.classList.add('is-open');
    document.body.classList.add('menu-abierto');
    boton.setAttribute('aria-expanded', 'true');
    boton.setAttribute('aria-label', 'Cerrar menú');
    const primerEnlace = $('.nav__link', nav);
    if (primerEnlace) setTimeout(() => primerEnlace.focus(), 60);
  };

  const cerrar = (devolverFoco = true) => {
    if (!abierto) return;
    abierto = false;
    header.classList.remove('is-open');
    document.body.classList.remove('menu-abierto');
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-label', 'Abrir menú');
    if (devolverFoco) boton.focus();
  };

  boton.addEventListener('click', () => (abierto ? cerrar() : abrir()));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) cerrar(false); });
  escritorio.addEventListener('change', (e) => { if (e.matches) cerrar(false); });

  document.addEventListener('keydown', (e) => {
    if (!abierto) return;
    if (e.key === 'Escape') {
      cerrar();
      return;
    }
    // Mantener el foco dentro del header mientras el menú está abierto
    if (e.key === 'Tab') {
      const enfocables = $$('a[href], button:not([disabled])', header).filter((el) => el.offsetParent !== null);
      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }
  });

  // Marcar la sección visible en el menú
  const enlaces = $$('.nav__link', nav);
  const secciones = enlaces.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  if (!('IntersectionObserver' in window) || !secciones.length) return;

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      const id = `#${entrada.target.id}`;
      enlaces.forEach((a) => {
        const activo = a.getAttribute('href') === id;
        a.classList.toggle('is-active', activo);
        if (activo) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  secciones.forEach((s) => observador.observe(s));
}

/* -------------------------------------------------------------------------
   Aparición al hacer scroll
   ------------------------------------------------------------------------- */
function iniciarApariciones() {
  // Retraso escalonado para los elementos dentro de [data-stagger]
  $$('[data-stagger]').forEach((grupo) => {
    $$(':scope > .reveal', grupo).forEach((el, i) => el.style.setProperty('--d', `${Math.min(i, 7) * 80}ms`));
  });

  const elementos = $$('.reveal');
  if (reducirMovimiento || !('IntersectionObserver' in window)) {
    elementos.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('is-visible');
        observador.unobserve(entrada.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  elementos.forEach((el) => observador.observe(el));
}

/* -------------------------------------------------------------------------
   Contadores animados
   data-counter="clave de CONFIG" o data-counter="25" (número fijo)
   ------------------------------------------------------------------------- */
function iniciarContadores() {
  const contadores = $$('[data-counter]');
  if (!contadores.length) return;

  const animar = (el) => {
    const final = Number(el.dataset.final);
    animarNumero(0, final, 1800, (v) => { el.textContent = formatoNumero.format(Math.round(v)); });
  };

  const pendientes = [];
  contadores.forEach((el) => {
    const clave = el.dataset.counter;
    const valor = clave in CONFIG ? CONFIG[clave] : clave;
    const numero = Number(String(valor).replace(/,/g, ''));
    const contenedor = el.closest('.stat__num');
    const sufijo = contenedor ? $('.stat__suffix', contenedor) : null;

    if (!Number.isFinite(numero) || esMarcador(String(valor))) {
      // Aún es un marcador: se muestra tal cual, sin animación ni sufijo
      el.textContent = valor;
      el.classList.add('is-placeholder');
      if (contenedor) contenedor.classList.add('is-placeholder-num');
      if (sufijo) sufijo.hidden = true;
      return;
    }

    el.dataset.final = String(numero);
    if (reducirMovimiento || !('IntersectionObserver' in window)) {
      el.textContent = formatoNumero.format(numero);
    } else {
      el.textContent = '0';
      pendientes.push(el);
    }
  });

  if (!pendientes.length) return;
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        animar(entrada.target);
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.6 });
  pendientes.forEach((el) => observador.observe(el));
}

/* -------------------------------------------------------------------------
   Calculadora de ahorro
   ------------------------------------------------------------------------- */

/** Hace el cálculo a partir del recibo bimestral y el tipo de inmueble */
function calcularAhorro(reciboBimestral, tipo) {
  const c = CALCULADORA;
  const precio = c.precioKwh[tipo] || c.precioKwh.casa;

  const consumoBimestralKwh = reciboBimestral / precio;
  const consumoDiarioKwh = consumoBimestralKwh / c.diasBimestre;
  const kwNecesarios = consumoDiarioKwh / (c.horasSolPico * c.eficienciaSistema);
  const paneles = Math.max(1, Math.ceil((kwNecesarios * 1000) / c.potenciaPanelW));
  const sistemaKw = (paneles * c.potenciaPanelW) / 1000;
  const inversion = sistemaKw * c.costoPorKw;

  const ahorroBimestral = reciboBimestral * c.porcentajeAhorro;
  const ahorroAnual = ahorroBimestral * 6;
  const retornoAnios = ahorroAnual > 0 ? inversion / ahorroAnual : 0;

  // Ahorro acumulado a 25 años con aumento de tarifa y pérdida de rendimiento
  let ahorro25 = 0;
  for (let anio = 0; anio < 25; anio++) {
    ahorro25 += ahorroAnual * Math.pow(1 + c.aumentoTarifaAnual, anio) * Math.pow(1 - c.degradacionAnual, anio);
  }

  const generacionAnualKwh = sistemaKw * c.horasSolPico * c.eficienciaSistema * 365;
  const co2Toneladas = (generacionAnualKwh * c.factorCO2) / 1000;

  return { ahorroBimestral, ahorroAnual, paneles, sistemaKw, inversion, retornoAnios, ahorro25, co2Toneladas };
}

function iniciarCalculadora() {
  const form = $('#calc-form');
  if (!form) return;

  const campoMonto = $('#calc-monto');
  const slider = $('#calc-rango');
  const ayuda = $('#calc-ayuda');
  const etiquetaMin = $('#calc-min');
  const etiquetaMax = $('#calc-max');
  const contenedor = $('.calc__results');
  const anuncio = $('#calc-anuncio');
  const botonWhatsApp = $('#calc-whatsapp');
  const botonFormulario = $('#calc-formulario');
  const textoAyuda = ayuda.textContent;
  const salida = {};
  $$('[data-result]').forEach((el) => { salida[el.dataset.result] = el; });

  // Mostrar en "¿Cómo calculamos esto?" los mismos valores que usa el cálculo
  const porcentaje = (v) => `${Math.round(v * 1000) / 10}%`;
  const constantes = {
    precioCasa: `$${CALCULADORA.precioKwh.casa.toFixed(2)}`,
    precioNegocio: `$${CALCULADORA.precioKwh.negocio.toFixed(2)}`,
    hsp: String(CALCULADORA.horasSolPico),
    panel: String(CALCULADORA.potenciaPanelW),
    eficiencia: porcentaje(CALCULADORA.eficienciaSistema),
    aumento: porcentaje(CALCULADORA.aumentoTarifaAnual),
    degradacion: porcentaje(CALCULADORA.degradacionAnual),
  };
  $$('[data-calc]').forEach((el) => {
    if (constantes[el.dataset.calc]) el.textContent = constantes[el.dataset.calc];
  });

  const estado = { tipo: 'casa', monto: aNumero(campoMonto.value) || 4500, ultimo: null };
  let temporizadorAnuncio = null;

  const tipoSeleccionado = () => ($('input[name="calc-tipo"]:checked', form) || {}).value || 'casa';

  function actualizarSlider() {
    const r = CALCULADORA.rango[estado.tipo];
    slider.min = r.min;
    slider.max = r.max;
    slider.step = r.paso;
    const valor = Math.min(Math.max(estado.monto, r.min), r.max);
    slider.value = valor;
    const avance = ((valor - r.min) / (r.max - r.min)) * 100;
    slider.style.setProperty('--p', `${avance}%`);
    slider.setAttribute('aria-valuetext', `${formatoNumero.format(estado.monto)} pesos al bimestre`);
    etiquetaMin.textContent = formatoMXN.format(r.min);
    etiquetaMax.textContent = `${formatoMXN.format(r.max)}+`;
  }

  /** Pinta un resultado con animación corta */
  function pintar(clave, valor, formato) {
    const el = salida[clave];
    if (!el) return;
    const anterior = Number(el.dataset.valor || 0);
    el.dataset.valor = String(valor);
    animarNumero(anterior, valor, 450, (v) => { el.textContent = formato(v); });
  }

  function mensajeWhatsApp(r) {
    const tipoTexto = estado.tipo === 'casa' ? 'Casa' : 'Negocio';
    return [
      'Hola, usé la calculadora de su página y quiero mi cotización exacta.',
      '',
      `*Inmueble:* ${tipoTexto}`,
      `*Recibo bimestral:* ${formatoMXN.format(estado.monto)}`,
      `*Ahorro estimado:* ${formatoMXN.format(r.ahorroBimestral)} al bimestre (${formatoMXN.format(r.ahorroAnual)} al año)`,
      `*Sistema aproximado:* ${r.paneles} paneles de ${CALCULADORA.potenciaPanelW} W (${formatoDecimal.format(r.sistemaKw)} kW)`,
      `*Recuperación estimada:* ${formatoDecimal.format(r.retornoAnios)} años`,
      '',
      '¿Me pueden ayudar con una cotización?',
    ].join('\n');
  }

  function calcular() {
    estado.tipo = tipoSeleccionado();
    actualizarSlider();

    const r = CALCULADORA.rango[estado.tipo];
    const valido = estado.monto >= 100;
    contenedor.classList.toggle('is-empty', !valido);

    if (!valido) {
      ayuda.textContent = 'Escribe un monto de al menos $100 para calcular tu ahorro.';
      ayuda.classList.add('is-warning');
      return;
    }
    ayuda.textContent = estado.monto > r.max
      ? `Para recibos mayores a ${formatoMXN.format(r.max)}, te recomendamos una cotización personalizada.`
      : textoAyuda;
    ayuda.classList.toggle('is-warning', estado.monto > r.max);

    const res = calcularAhorro(estado.monto, estado.tipo);
    estado.ultimo = res;

    pintar('ahorroBimestral', res.ahorroBimestral, (v) => formatoMXN.format(v));
    pintar('ahorroAnual', res.ahorroAnual, (v) => formatoMXN.format(v));
    pintar('paneles', res.paneles, (v) => {
      const n = Math.round(v);
      return `${n} ${n === 1 ? 'panel' : 'paneles'}`;
    });
    salida.sistema.textContent = `de ${CALCULADORA.potenciaPanelW} W · sistema de ${formatoDecimal.format(res.sistemaKw)} kW`;
    pintar('retorno', res.retornoAnios, (v) => `${formatoDecimal.format(v)} años`);
    pintar('ahorro25', res.ahorro25, (v) => formatoMXN.format(Math.round(v / 1000) * 1000));
    pintar('co2', res.co2Toneladas, (v) => `${formatoDecimal.format(v)} t al año`);

    botonWhatsApp.setAttribute('href', enlaceWhatsApp(mensajeWhatsApp(res)));

    // Aviso para lectores de pantalla, cuando el usuario deja de mover el slider
    clearTimeout(temporizadorAnuncio);
    temporizadorAnuncio = setTimeout(() => {
      anuncio.textContent = `Ahorro estimado: ${formatoMXN.format(res.ahorroBimestral)} al bimestre, ${formatoMXN.format(res.ahorroAnual)} al año. Recuperas tu inversión en ${formatoDecimal.format(res.retornoAnios)} años.`;
    }, 900);
  }

  // Eventos
  form.addEventListener('submit', (e) => e.preventDefault());

  $$('input[name="calc-tipo"]', form).forEach((radio) => radio.addEventListener('change', calcular));

  slider.addEventListener('input', () => {
    estado.monto = Number(slider.value);
    campoMonto.value = formatoNumero.format(estado.monto);
    calcular();
  });

  campoMonto.addEventListener('input', () => {
    const digitos = soloDigitos(campoMonto.value).slice(0, 7);
    if (campoMonto.value !== digitos) campoMonto.value = digitos;
    estado.monto = digitos ? parseInt(digitos, 10) : 0;
    calcular();
  });

  // Al entrar al campo se quitan las comas y se selecciona todo, así lo que escribas reemplaza el monto
  campoMonto.addEventListener('focus', () => {
    campoMonto.value = soloDigitos(campoMonto.value);
    campoMonto.select();
  });
  campoMonto.addEventListener('blur', () => { if (estado.monto) campoMonto.value = formatoNumero.format(estado.monto); });

  botonWhatsApp.addEventListener('click', (e) => {
    if (!estado.ultimo) return;
    e.preventDefault();
    abrirWhatsApp(mensajeWhatsApp(estado.ultimo));
    registrarEvento('click_whatsapp', { origen: 'calculadora', recibo: estado.monto, tipo: estado.tipo });
  });

  // "Prefiero llenar el formulario": pasa el monto y el tipo al formulario de contacto
  botonFormulario.addEventListener('click', () => {
    const recibo = $('#f-recibo');
    const tipo = $('#f-tipo');
    if (recibo && estado.monto) recibo.value = String(estado.monto);
    if (tipo) tipo.value = estado.tipo === 'casa' ? 'Casa' : 'Negocio';
    const nombre = $('#f-nombre');
    if (nombre) setTimeout(() => nombre.focus({ preventScroll: true }), reducirMovimiento ? 0 : 700);
    registrarEvento('calculadora_a_formulario', { recibo: estado.monto });
  });

  calcular();
}

/* -------------------------------------------------------------------------
   Proyectos: filtros
   ------------------------------------------------------------------------- */
function iniciarProyectos() {
  const botones = $$('.filter');
  const proyectos = $$('.project');
  const estado = $('#proyectos-estado');
  if (!botones.length) return;

  botones.forEach((boton) => {
    boton.addEventListener('click', () => {
      const filtro = boton.dataset.filter;
      botones.forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));

      let visibles = 0;
      proyectos.forEach((p) => {
        const mostrar = filtro === 'todos' || p.dataset.categoria === filtro;
        clearTimeout(p.temporizador);
        if (mostrar) {
          visibles++;
          p.hidden = false;
          p.classList.add('is-visible');
          void p.offsetWidth; // fuerza el reflow para que la transición se vea
          p.classList.remove('is-hiding');
        } else {
          p.classList.add('is-hiding');
          p.temporizador = setTimeout(() => { p.hidden = true; }, reducirMovimiento ? 0 : 260);
        }
      });

      const nombre = filtro === 'todos' ? '' : ` ${boton.textContent.trim().toLowerCase()}es`;
      estado.textContent = `Mostrando ${visibles} proyectos${filtro === 'todos' ? '' : nombre}.`;
    });
  });
}

/* -------------------------------------------------------------------------
   Carrusel de testimonios (scroll-snap nativo + botones, puntos y teclado)
   ------------------------------------------------------------------------- */
function iniciarCarrusel() {
  const raiz = $('.carousel');
  if (!raiz) return;
  const viewport = $('.carousel__viewport', raiz);
  const slides = $$('.testimonial', raiz);
  const anterior = $('[data-dir="prev"]', raiz);
  const siguiente = $('[data-dir="next"]', raiz);
  const contenedorPuntos = $('.carousel__dots', raiz);
  let indice = 0;
  let puntos = [];

  const porVista = () => {
    const ancho = slides[0].getBoundingClientRect().width;
    return ancho ? Math.max(1, Math.round(viewport.clientWidth / ancho)) : 1;
  };
  const indiceMaximo = () => Math.max(0, slides.length - porVista());

  function crearPuntos() {
    const total = indiceMaximo() + 1;
    if (puntos.length === total) return;
    contenedorPuntos.innerHTML = '';
    puntos = Array.from({ length: total }, (_, i) => {
      const punto = document.createElement('button');
      punto.type = 'button';
      punto.className = 'carousel__dot';
      punto.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
      punto.addEventListener('click', () => irA(i));
      contenedorPuntos.appendChild(punto);
      return punto;
    });
  }

  function actualizarControles() {
    const max = indiceMaximo();
    indice = Math.min(indice, max);
    anterior.disabled = indice <= 0;
    siguiente.disabled = indice >= max;
    puntos.forEach((p, i) => {
      if (i === indice) p.setAttribute('aria-current', 'true');
      else p.removeAttribute('aria-current');
    });
  }

  function irA(i) {
    indice = Math.max(0, Math.min(i, indiceMaximo()));
    viewport.scrollTo({ left: slides[indice].offsetLeft, behavior: reducirMovimiento ? 'auto' : 'smooth' });
    actualizarControles();
  }

  // Detectar en qué tarjeta quedó el scroll (al deslizar con el dedo)
  let cuadro = null;
  viewport.addEventListener('scroll', () => {
    if (cuadro) return;
    cuadro = requestAnimationFrame(() => {
      cuadro = null;
      const x = viewport.scrollLeft;
      let mejor = 0;
      let distancia = Infinity;
      slides.forEach((s, i) => {
        const d = Math.abs(s.offsetLeft - x);
        if (d < distancia) { distancia = d; mejor = i; }
      });
      // Al llegar al final del scroll, marcar el último grupo
      if (x + viewport.clientWidth >= viewport.scrollWidth - 4) mejor = indiceMaximo();
      indice = Math.min(mejor, indiceMaximo());
      actualizarControles();
    });
  }, { passive: true });

  anterior.addEventListener('click', () => irA(indice - 1));
  siguiente.addEventListener('click', () => irA(indice + 1));

  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); irA(indice + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); irA(indice - 1); }
  });

  let temporizadorResize = null;
  window.addEventListener('resize', () => {
    clearTimeout(temporizadorResize);
    temporizadorResize = setTimeout(() => { crearPuntos(); actualizarControles(); }, 150);
  });

  crearPuntos();
  actualizarControles();
}

/* -------------------------------------------------------------------------
   Preguntas frecuentes (acordeón)
   ------------------------------------------------------------------------- */
function iniciarFaq() {
  const botones = $$('.accordion__trigger');
  if (!botones.length) return;

  const cambiar = (boton, abrir) => {
    boton.setAttribute('aria-expanded', String(abrir));
    boton.closest('.accordion__item').classList.toggle('is-open', abrir);
  };

  botones.forEach((boton, i) => {
    boton.addEventListener('click', () => {
      const abrir = boton.getAttribute('aria-expanded') !== 'true';
      // Solo una respuesta abierta a la vez
      botones.forEach((otro) => { if (otro !== boton) cambiar(otro, false); });
      cambiar(boton, abrir);
      if (abrir) registrarEvento('faq_abierta', { pregunta: boton.textContent.trim() });
    });

    // Navegación con flechas, Inicio y Fin
    boton.addEventListener('keydown', (e) => {
      const destinos = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: botones.length - 1 };
      if (!(e.key in destinos)) return;
      e.preventDefault();
      const destino = (destinos[e.key] + botones.length) % botones.length;
      botones[destino].focus();
    });
  });
}

/* -------------------------------------------------------------------------
   Formulario de contacto → WhatsApp
   Valida cada campo al salir de él y limpia el error en cuanto se corrige.
   ------------------------------------------------------------------------- */
function normalizarTelefono(valor) {
  let d = soloDigitos(valor);
  if (d.length === 13 && d.startsWith('521')) d = d.slice(3);
  else if (d.length === 12 && d.startsWith('52')) d = d.slice(2);
  return d;
}

const REGLAS_FORMULARIO = {
  nombre: (v) => v.trim().length >= 3 || 'Escribe tu nombre para saber cómo dirigirnos a ti.',
  telefono: (v) => normalizarTelefono(v).length === 10 || 'Escribe un teléfono de 10 dígitos, por ejemplo 477 123 4567.',
  colonia: (v) => v.trim().length >= 3 || 'Escribe tu colonia o municipio para ubicar tu inmueble.',
  recibo: (v) => {
    if (!v.trim()) return true;
    const n = aNumero(v);
    return (n >= 100 && n <= 5000000) || 'Escribe solo el monto en pesos, por ejemplo 3500.';
  },
  tipo: (v) => v !== '' || 'Elige el tipo de inmueble.',
  mensaje: (v) => v.length <= 600 || 'Resume tu mensaje en 600 caracteres o menos.',
};

function iniciarFormulario() {
  const form = $('#form-contacto');
  if (!form) return;
  const estado = $('#form-estado');
  const campos = Object.keys(REGLAS_FORMULARIO).map((nombre) => form.elements[nombre]).filter(Boolean);

  function validar(campo) {
    const resultado = REGLAS_FORMULARIO[campo.name](campo.value);
    const valido = resultado === true;
    const error = $(`#${campo.id}-error`);
    campo.setAttribute('aria-invalid', String(!valido));
    if (error) error.textContent = valido ? '' : resultado;
    campo.closest('.field').classList.toggle('is-valid', valido && campo.value.trim() !== '');
    return valido;
  }

  campos.forEach((campo) => {
    campo.addEventListener('blur', () => {
      campo.dataset.tocado = 'true';
      validar(campo);
    });
    const alCambiar = () => { if (campo.dataset.tocado) validar(campo); };
    campo.addEventListener('input', alCambiar);
    campo.addEventListener('change', alCambiar);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const invalidos = campos.filter((campo) => {
      campo.dataset.tocado = 'true';
      return !validar(campo);
    });

    if (invalidos.length) {
      estado.hidden = false;
      estado.classList.add('is-error');
      estado.textContent = invalidos.length === 1
        ? 'Falta un dato para preparar tu cotización. Revisa el campo marcado.'
        : `Faltan ${invalidos.length} datos para preparar tu cotización. Revisa los campos marcados.`;
      invalidos[0].focus();
      return;
    }

    const datos = Object.fromEntries(new FormData(form).entries());
    const recibo = aNumero(datos.recibo);
    const lineas = [
      'Hola, quiero una cotización de paneles solares.',
      '',
      `*Nombre:* ${datos.nombre.trim()}`,
      `*Teléfono:* ${datos.telefono.trim()}`,
      `*Colonia o municipio:* ${datos.colonia.trim()}`,
      `*Recibo bimestral:* ${recibo ? formatoMXN.format(recibo) : 'No lo indicó'}`,
      `*Tipo de inmueble:* ${datos.tipo}`,
    ];
    if (datos.mensaje && datos.mensaje.trim()) lineas.push(`*Mensaje:* ${datos.mensaje.trim()}`);
    lineas.push('', '(Enviado desde el formulario de la página web)');

    const url = abrirWhatsApp(lineas.join('\n'));
    registrarEvento('formulario_enviado', { tipo: datos.tipo, recibo });

    estado.hidden = false;
    estado.classList.remove('is-error');
    estado.innerHTML = '';
    const texto = document.createElement('span');
    texto.textContent = '¡Listo! Abrimos WhatsApp con tus datos. Solo presiona enviar y te respondemos pronto. ';
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.target = '_blank';
    enlace.rel = 'noopener';
    enlace.textContent = '¿No se abrió? Toca aquí.';
    estado.append(texto, enlace);
  });
}

/* -------------------------------------------------------------------------
   Asistente de chat (sin API): 3 preguntas → resumen por WhatsApp
   ------------------------------------------------------------------------- */
function iniciarChat() {
  const panel = $('#chat-panel');
  const lanzador = $('#chat-launcher');
  if (!panel || !lanzador) return;

  const mensajes = $('#chat-mensajes');
  const opciones = $('#chat-opciones');
  const form = $('#chat-form');
  const input = $('#chat-input');
  const cerrarBtn = $('.chat__close', panel);
  const teaser = $('#chat-teaser');

  const PASOS = [
    {
      clave: 'tipo',
      etiqueta: 'Tipo de inmueble',
      pregunta: '¿Para qué tipo de inmueble quieres los paneles?',
      opciones: ['Casa', 'Negocio', 'Industria'],
    },
    {
      clave: 'recibo',
      etiqueta: 'Recibo bimestral',
      pregunta: '¿Cuánto pagas de luz cada bimestre, más o menos?',
      opciones: ['Menos de $2,000', '$2,000 a $5,000', '$5,000 a $10,000', 'Más de $10,000'],
      libre: {
        placeholder: 'O escribe el monto, ej. 3500',
        inputmode: 'numeric',
        validar: (v) => aNumero(v) >= 100 || 'Escribe solo el monto en pesos, por ejemplo 3500.',
        formatear: (v) => formatoMXN.format(aNumero(v)),
      },
    },
    {
      clave: 'colonia',
      etiqueta: 'Colonia o municipio',
      pregunta: 'Por último, ¿en qué colonia o municipio está el inmueble?',
      libre: {
        placeholder: 'Ej. Jardines del Moral, León',
        inputmode: 'text',
        validar: (v) => v.trim().length >= 3 || 'Escribe al menos 3 letras de tu colonia o municipio.',
        formatear: (v) => v.trim(),
      },
    },
  ];

  const estado = { paso: 0, respuestas: {}, iniciado: false, ocupado: false };
  const espera = (ms) => new Promise((r) => setTimeout(r, reducirMovimiento ? 0 : ms));

  const bajarScroll = () => { mensajes.scrollTop = mensajes.scrollHeight; };

  function agregarMensaje(contenido, tipo = 'bot') {
    const burbuja = document.createElement('div');
    burbuja.className = `msg msg--${tipo}`;
    if (typeof contenido === 'string') burbuja.textContent = contenido;
    else burbuja.appendChild(contenido);
    mensajes.appendChild(burbuja);
    bajarScroll();
    return burbuja;
  }

  async function botDice(contenido) {
    const escribiendo = document.createElement('div');
    escribiendo.className = 'msg msg--bot msg--typing';
    escribiendo.setAttribute('aria-hidden', 'true');
    escribiendo.innerHTML = '<span></span><span></span><span></span>';
    mensajes.appendChild(escribiendo);
    bajarScroll();
    await espera(650);
    escribiendo.remove();
    return agregarMensaje(contenido, 'bot');
  }

  function limpiarRespuestas() {
    opciones.innerHTML = '';
    form.hidden = true;
    input.value = '';
  }

  async function mostrarPaso() {
    const paso = PASOS[estado.paso];
    estado.ocupado = true;
    await botDice(paso.pregunta);
    estado.ocupado = false;

    (paso.opciones || []).forEach((texto) => {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'chat__option';
      boton.textContent = texto;
      boton.addEventListener('click', () => responder(texto));
      opciones.appendChild(boton);
    });

    if (paso.libre) {
      form.hidden = false;
      input.placeholder = paso.libre.placeholder;
      input.setAttribute('inputmode', paso.libre.inputmode);
    }

    const primero = $('.chat__option', opciones) || (paso.libre ? input : null);
    if (primero && !panel.hidden) primero.focus({ preventScroll: true });
  }

  async function responder(valor) {
    if (estado.ocupado) return;
    const paso = PASOS[estado.paso];
    estado.respuestas[paso.clave] = valor;
    limpiarRespuestas();
    agregarMensaje(valor, 'user');
    estado.paso++;
    if (estado.paso < PASOS.length) mostrarPaso();
    else mostrarResumen();
  }

  function mensajeResumen() {
    return [
      'Hola, quiero una cotización de paneles solares.',
      '',
      ...PASOS.map((p) => `*${p.etiqueta}:* ${estado.respuestas[p.clave]}`),
      '',
      '(Enviado desde el asistente de la página web)',
    ].join('\n');
  }

  async function mostrarResumen() {
    estado.ocupado = true;
    await botDice('¡Gracias! Este es el resumen que le enviaré a un asesor de GEM:');

    const lista = document.createElement('dl');
    lista.className = 'msg__summary';
    PASOS.forEach((p) => {
      const fila = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = `${p.etiqueta}:`;
      dd.textContent = estado.respuestas[p.clave];
      fila.append(dt, dd);
      lista.appendChild(fila);
    });
    agregarMensaje(lista, 'bot');
    estado.ocupado = false;

    const enviar = document.createElement('a');
    enviar.className = 'btn btn--primary btn--block';
    enviar.href = enlaceWhatsApp(mensajeResumen());
    enviar.target = '_blank';
    enviar.rel = 'noopener';
    enviar.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-whatsapp"/></svg>Envía tu resumen por WhatsApp';
    enviar.addEventListener('click', () => {
      registrarEvento('chat_completado', { ...estado.respuestas });
    });

    const reiniciar = document.createElement('button');
    reiniciar.type = 'button';
    reiniciar.className = 'chat__option';
    reiniciar.textContent = 'Empezar de nuevo';
    reiniciar.addEventListener('click', iniciarConversacion);

    opciones.append(enviar, reiniciar);
    enviar.focus({ preventScroll: true });
  }

  async function iniciarConversacion() {
    estado.paso = 0;
    estado.respuestas = {};
    mensajes.innerHTML = '';
    limpiarRespuestas();
    estado.ocupado = true;
    await botDice('¡Hola! Soy el asistente de GEM. Te hago 3 preguntas rápidas para preparar tu cotización.');
    mostrarPaso();
  }

  function abrir() {
    ocultarTeaser();
    panel.hidden = false;
    lanzador.setAttribute('aria-expanded', 'true');
    if (!estado.iniciado) {
      estado.iniciado = true;
      panel.focus({ preventScroll: true });
      iniciarConversacion();
      registrarEvento('chat_abierto');
    } else {
      const primero = $('.chat__option, .btn', opciones) || (form.hidden ? panel : input);
      primero.focus({ preventScroll: true });
    }
  }

  function cerrar() {
    panel.hidden = true;
    lanzador.setAttribute('aria-expanded', 'false');
    lanzador.focus({ preventScroll: true });
  }

  // Respuesta escrita
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const paso = PASOS[estado.paso];
    if (!paso || !paso.libre) return;
    const resultado = paso.libre.validar(input.value);
    if (resultado !== true) {
      const aviso = agregarMensaje(resultado, 'bot');
      aviso.classList.add('msg__error');
      input.focus();
      return;
    }
    responder(paso.libre.formatear(input.value));
  });

  $$('[data-chat-open]').forEach((el) => el.addEventListener('click', () => {
    if (el === lanzador && !panel.hidden) cerrar();
    else abrir();
  }));
  cerrarBtn.addEventListener('click', cerrar);
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });

  // Mensaje de invitación: aparece una sola vez por visita, después de 15 s
  const CLAVE_TEASER = 'gem-teaser-visto';
  let teaserVisto = false;
  try { teaserVisto = sessionStorage.getItem(CLAVE_TEASER) === '1'; } catch (e) { /* almacenamiento no disponible */ }

  function ocultarTeaser() {
    if (!teaser) return;
    teaser.hidden = true;
    try { sessionStorage.setItem(CLAVE_TEASER, '1'); } catch (e) { /* sin acción */ }
  }

  if (teaser) {
    $('.chat-teaser__close', teaser).addEventListener('click', ocultarTeaser);
    if (!teaserVisto) {
      setTimeout(() => {
        if (!estado.iniciado && panel.hidden && !document.body.classList.contains('menu-abierto')) teaser.hidden = false;
      }, 15000);
    }
  }
}

/* -------------------------------------------------------------------------
   Luz que sigue al cursor en las tarjetas (solo en equipos con mouse)
   ------------------------------------------------------------------------- */
function iniciarBrilloTarjetas() {
  if (reducirMovimiento || !window.matchMedia('(hover: hover)').matches) return;
  $$('.card').forEach((tarjeta) => {
    tarjeta.addEventListener('pointermove', (e) => {
      const r = tarjeta.getBoundingClientRect();
      tarjeta.style.setProperty('--mx', `${e.clientX - r.left}px`);
      tarjeta.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

/* -------------------------------------------------------------------------
   Inicio
   ------------------------------------------------------------------------- */
aplicarConfig();
iniciarHeader();
iniciarApariciones();
iniciarContadores();
iniciarCalculadora();
iniciarProyectos();
iniciarCarrusel();
iniciarFaq();
iniciarFormulario();
iniciarChat();
iniciarBrilloTarjetas();
