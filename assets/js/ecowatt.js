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

  // Hero de día y noche: tiempos de la animación y datos de la foto.
  hero: {
    hundir: 240,          // ms que tarda la casa en hundirse en la niebla
    subir: 820,           // ms que tarda en volver a subir con la nueva luz
    profundidad: 0.32,    // cuánto se hunde, como fracción de la altura de la ventana del hero
    imagen: { ancho: 2400, alto: 1350 }, // tamaño de las fotos del hero
    porche: { x: 0.825, y: 0.68 },       // dónde está la luz del porche en la foto de noche (0 a 1); tiñe la niebla de ámbar
    nieblaReposo: 0.74,   // dónde empieza la niebla quieta, de 0 (arriba de la ventana) a 1 (abajo)
  },

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

  let alCambiarMenu = () => {};
  const cerrarMenu = (devolverFoco = false) => {
    nav.classList.remove('abierto');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuTexto.textContent = 'Abrir menú';
    document.documentElement.classList.remove('sin-scroll');
    alCambiarMenu();
    if (devolverFoco) menuBtn.focus();
  };
  const abrirMenu = () => {
    nav.classList.add('abierto');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuTexto.textContent = 'Cerrar menú';
    document.documentElement.classList.add('sin-scroll');
    alCambiarMenu();
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
     2b. Hero de día y noche
     Un solo reloj (requestAnimationFrame) calcula, desde el clic, cuánto se
     hunde la casa, la oleada de niebla y la mezcla de colores, y lo escribe en
     variables CSS (--sink, --dip, --k) y en el shader. La casa se cambia en el
     punto más hondo, cuando la niebla tapa el techo.
     ------------------------------------------------------------------------ */
  const hero = $('#inicio');
  const escena = $('.hero-escena');
  const lienzo = $('#niebla');
  if (hero && escena && lienzo) {
    const H = CONFIG.hero;
    const raiz = document.documentElement.style;
    const cabecera = $('.cabecera');
    const SINK = H.hundir;
    const RISE = H.subir;
    const DEPTH = H.profundidad;
    const limitar = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
    const suave = (a, b, x) => { const t = limitar((x - a) / (b - a)); return t * t * (3 - 2 * t); };
    const sets = [$('#set-dia'), $('#set-noche')];
    const botones = [$('#b-dia'), $('#b-noche')];
    let objetivo = 0;
    let desde = 0;
    let inicio = -1;
    let enCola = null;
    let cambiado = true;
    let k = 0;
    let oleada = 0;
    let animando = false;
    let enVista = true;
    let cuadroHero = 0;
    let porche = [0.72, 0.74];
    const t0 = performance.now();

    const escribir = (sinkPx, dip, kk) => {
      raiz.setProperty('--sink', `${sinkPx.toFixed(1)}px`);
      raiz.setProperty('--dip', dip.toFixed(3));
      raiz.setProperty('--k', kk.toFixed(3));
    };

    // Las imágenes de noche se piden cuando la página ya cargó, para no frenar la primera vista.
    let nocheCargada = false;
    const cargarNoche = () => {
      if (nocheCargada) return;
      nocheCargada = true;
      $$('img[data-src]', hero).forEach((img) => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
    };
    const listas = (n) => {
      const imgs = $$('img', sets[n]);
      if (n === 1) imgs.push($('#cielo-noche'));
      return Promise.all(imgs.map((img) => (img.complete && img.naturalWidth ? null : img.decode().catch(() => {}))));
    };
    if (document.readyState === 'complete') setTimeout(cargarNoche, 400);
    else window.addEventListener('load', () => setTimeout(cargarNoche, 400), { once: true });
    $('.toggle', hero).addEventListener('pointerenter', cargarNoche, { once: true });

    const mostrarSet = (n) => sets.forEach((el, i) => el.classList.toggle('is-on', i === n));
    const marcarBotones = (n) => botones.forEach((b, i) => b.setAttribute('aria-pressed', String(i === n)));

    // Niebla: shader de ruido fractal sobre un triángulo que cubre la pantalla.
    const gl = lienzo.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false });
    let U = null;
    if (gl) {
      const vs = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}`;
      const fs = `#version 300 es
precision highp float;
uniform vec2 R;uniform float T,S,K,F;uniform vec2 G;
out vec4 o;
float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;p=mat2(.8,.6,-.6,.8)*p+5.3;
  for(int i=0;i<5;i++){v+=a*n(p);p=mat2(1.6,1.2,-1.2,1.6)*p;a*=.5;}return v;}
void main(){
  vec2 q=vec2(gl_FragCoord.x/R.x,1.-gl_FragCoord.y/R.y);
  float y=q.y;
  vec2 p=vec2(q.x*R.x/R.y,y)*2.4;
  float t=T*.05;
  vec2 w=vec2(fbm(p+vec2(t,0.)),fbm(p+vec2(-t*.7,t*.3)+3.7));
  float d=fbm(p+w*1.5+vec2(t*1.4,0.));
  float e=fbm(p*.55+w*.9+vec2(-t*.5,t*.2));
  float low=smoothstep(F,F+.34,y+(d-.5)*.34);
  float side=((1.-smoothstep(0.,.24,q.x))+smoothstep(.76,1.,q.x))*smoothstep(.2,.95,y+(e-.5)*.5)*.2;
  float wisps=smoothstep(.56,.86,e)*smoothstep(.12,.42,y)*(1.-smoothstep(.62,.9,y))*.18;
  float rest=clamp(low+side+wisps,0.,1.);
  float front=1.02-S*.68;
  float rise=smoothstep(front-.02,front+.26,y+(d-.5)*.5);
  float haze=S*(.3+.46*d);
  float a=clamp(max(rest,max(rise*.97,haze)),0.,1.);
  vec3 c=mix(mix(vec3(.79,.78,.71),vec3(.97,.93,.84),d),mix(vec3(.15,.19,.29),vec3(.40,.45,.57),d),K);
  vec2 g=(q-G)*vec2(R.x/R.y,1.);
  c=mix(c,vec3(.86,.55,.27),K*(1.-S)*.42*exp(-dot(g,g)*18.));
  o=vec4(c*a,a);
}`;
      const compilar = (tipo, codigo) => {
        const sh = gl.createShader(tipo);
        gl.shaderSource(sh, codigo);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
        return sh;
      };
      try {
        const prog = gl.createProgram();
        gl.attachShader(prog, compilar(gl.VERTEX_SHADER, vs));
        gl.attachShader(prog, compilar(gl.FRAGMENT_SHADER, fs));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
        gl.useProgram(prog);
        gl.bindVertexArray(gl.createVertexArray());
        U = Object.fromEntries(['R', 'T', 'S', 'K', 'G', 'F'].map((nombre) => [nombre, gl.getUniformLocation(prog, nombre)]));
      } catch (err) {
        console.warn('[Ecowatt] La niebla no está disponible en este navegador.', err);
        lienzo.hidden = true;
      }
    } else {
      lienzo.hidden = true;
    }

    // Geometría de la foto con object-fit: cover dentro de la capa de la casa.
    // La capa de la casa vive dentro de la ventana (.hero-escena), igual que la niebla.
    const caja = $('.hero-casa');
    const geometria = () => {
      const img = $('.recorte', sets[1]);
      const W = caja.clientWidth;
      const Hc = caja.clientHeight;
      const iw = img.naturalWidth || H.imagen.ancho;
      const ih = img.naturalHeight || H.imagen.alto;
      const esc = Math.max(W / iw, Hc / ih);
      const [px, py] = getComputedStyle(img).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
      return {
        iw, ih, esc,
        ox: (W - iw * esc) * px,
        oy: (Hc - ih * esc) * py,
        izq: caja.offsetLeft,
        arriba: caja.offsetTop,
        anchoEscena: escena.clientWidth,
        altoEscena: escena.clientHeight,
      };
    };

    // Lleva la posición del porche (en la foto) a coordenadas de la niebla.
    const calcularPorche = () => {
      const g = geometria();
      porche = [
        (g.izq + g.ox + H.porche.x * g.iw * g.esc) / g.anchoEscena,
        (g.arriba + g.oy + H.porche.y * g.ih * g.esc) / g.altoEscena,
      ];
    };

    const medir = () => {
      calcularPorche();
      if (!U) return;
      const W = escena.clientWidth;
      const esc = Math.min(1, 960 / W);
      lienzo.width = Math.max(1, Math.round(W * esc));
      lienzo.height = Math.max(1, Math.round(escena.clientHeight * esc));
      gl.viewport(0, 0, lienzo.width, lienzo.height);
    };

    const dibujar = (ahora) => {
      if (!U) return;
      const T = movimientoReducido.matches ? 40 : (ahora - t0) / 1000 + 40;
      gl.uniform2f(U.R, lienzo.width, lienzo.height);
      gl.uniform1f(U.T, T);
      gl.uniform1f(U.S, oleada);
      gl.uniform1f(U.K, k);
      gl.uniform2f(U.G, porche[0], porche[1]);
      gl.uniform1f(U.F, H.nieblaReposo);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const siguiente = () => {
      if (enCola === null) return;
      const t = enCola;
      enCola = null;
      if (t !== objetivo) pedir(t);
    };

    function paso(ahora) {
      cuadroHero = 0;
      if (animando && inicio >= 0) {
        const d = ahora - inicio;
        let y;
        if (d < SINK) {
          const x = d / SINK;
          y = x * x * (3 - 2 * x) * DEPTH;
        } else {
          if (!cambiado) { mostrarSet(objetivo); cambiado = true; }
          const x = limitar((d - SINK) / RISE);
          y = Math.pow(1 - x, 3.4) * DEPTH;
        }
        oleada = suave(0, SINK * 0.92, d) * (1 - suave(SINK + 70, SINK + RISE * 0.92, d));
        const dip = suave(30, 190, d) * (1 - suave(330, 720, d));
        k = desde + (objetivo - desde) * suave(120, 520, d);
        escribir(y * escena.clientHeight, dip, k);
        if (d >= SINK + RISE) {
          animando = false;
          inicio = -1;
          oleada = 0;
          k = objetivo;
          escribir(0, 0, k);
          siguiente();
        }
      }
      dibujar(ahora);
      if ((enVista && !movimientoReducido.matches) || animando) cuadroHero = requestAnimationFrame(paso);
    }
    const arrancar = () => { if (!cuadroHero) cuadroHero = requestAnimationFrame(paso); };

    async function pedir(t) {
      if (animando) {
        enCola = t !== objetivo ? t : null;
        return;
      }
      if (t === objetivo) return;
      animando = true;
      objetivo = t;
      marcarBotones(t);
      cargarNoche();
      await listas(t);
      if (movimientoReducido.matches) {
        k = t;
        mostrarSet(t);
        escribir(0, 0, k);
        animando = false;
        dibujar(performance.now());
        siguiente();
        return;
      }
      desde = k;
      cambiado = false;
      inicio = performance.now();
      arrancar();
    }
    botones.forEach((b, i) => b.addEventListener('click', () => pedir(i)));

    // Mientras el hero está en pantalla, en celular se esconde la burbuja del asistente.
    const estadoCabecera = () => {
      const sobre = hero.getBoundingClientRect().bottom > cabecera.offsetHeight + 2 && !nav.classList.contains('abierto');
      document.body.classList.toggle('en-hero', sobre);
    };
    alCambiarMenu = estadoCabecera;
    window.addEventListener('scroll', estadoCabecera, { passive: true });
    window.addEventListener('resize', () => { medir(); estadoCabecera(); dibujar(performance.now()); });
    $$('img', sets[1]).forEach((img) => img.addEventListener('load', calcularPorche));

    // La niebla solo se anima mientras el hero está en pantalla.
    new IntersectionObserver(([e]) => {
      enVista = e.isIntersecting;
      if (enVista) arrancar();
    }).observe(hero);

    escribir(0, 0, 0);
    medir();
    estadoCabecera();
    arrancar();
    if (document.fonts) document.fonts.ready.then(medir);
    $$('img', sets[0]).forEach((img) => img.addEventListener('load', medir));
  }

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
     7b. Aparición suave de las secciones al hacer scroll (300 ms)
     ------------------------------------------------------------------------ */
  const revelables = $$('[data-revelar], .grafica');
  if ('IntersectionObserver' in window && !movimientoReducido.matches && revelables.length) {
    document.documentElement.classList.add('revelar-activo');
    const vigia = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('revelado');
          vigia.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revelables.forEach((el) => vigia.observe(el));
  }

  /* ------------------------------------------------------------------------
     8. Año actual en el pie
     ------------------------------------------------------------------------ */
  $$('[data-anio]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
})();
