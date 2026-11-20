/* =====================================================================
   DATA.JS — TODO el contenido del sitio vive aquí.
   ---------------------------------------------------------------------
   Para vender esta plantilla a otra inmobiliaria:
     1. Edita este archivo (marca, contacto, asesores, propiedades).
     2. Edita los colores en css/tokens.css.
     3. Coloca las fotos en img/propiedades/ y enlázalas en "fotos".
   No hace falta tocar el HTML ni el resto del JavaScript.

   Convenciones:
     • Precios en número entero, sin comas. Renta = precio mensual.
     • "moneda" de cada propiedad: 'MXN' o 'USD'. El sitio convierte
       con moneda.tipoCambio y permite al visitante alternar MXN/USD.
     • Superficies en m². Usa null cuando no aplique (p. ej. terreno
       en un departamento).
     • Una foto con  pendiente: true  no se muestra (se ve un marcador
       elegante). Quita esa línea cuando subas el archivo.
   ===================================================================== */

window.SITE = {

  /* ---------------------------------------------------------------
     MARCA
     --------------------------------------------------------------- */
  marca: {
    nombre: 'Harborlux',
    logoTexto: 'HARBORLUX',          // wordmark de la barra de navegación
    slug: 'harborlux',               // prefijo para guardar datos en el navegador
    eslogan: 'Patrimonio con vista al futuro',
    descripcion: 'Harborlux: penthouses, residencias y terrenos con plusvalía comprobada en las zonas más cotizadas de México. Valuación gratuita, asesoría hipotecaria y legal, y comercialización exclusiva.',
    url: 'https://harborlux.example', // dominio final del cliente (SEO y enlaces compartidos)
    anioFundacion: 2008
  },

  /* ---------------------------------------------------------------
     CONTACTO GENERAL (botón flotante, formularios generales, footer)
     [EDITAR] WhatsApp: solo dígitos con lada internacional, ej. 5215512345678
     --------------------------------------------------------------- */
  contacto: {
    whatsapp: '5210000000000',
    telefono: '+52 55 0000 0000',
    email: 'contacto@harborlux.example',
    direccion: 'Av. Presidente Masaryk 111, piso 9, Polanco, Miguel Hidalgo, 11560, CDMX',
    horario: 'Lunes a viernes 9:00–19:00 · Sábados 10:00–15:00',
    mapa: { lat: 19.4318, lng: -99.1942 },
    redes: [
      { nombre: 'Instagram', url: '#' },
      { nombre: 'Facebook', url: '#' },
      { nombre: 'LinkedIn', url: '#' },
      { nombre: 'YouTube', url: '#' }
    ],
    avisoPrivacidad: 'aviso-de-privacidad.html',
    terminos: 'terminos.html'
  },

  /* ---------------------------------------------------------------
     DATOS LEGALES (aviso de privacidad y términos)
     [EDITAR] razón social, RFC y correo de privacidad del cliente.
     borrador: true muestra un aviso de "pendiente de revisión legal".
     --------------------------------------------------------------- */
  legal: {
    razonSocial: 'Harborlux Bienes Raíces, S.A. de C.V.',
    rfc: 'XAXX010101000',
    correoPrivacidad: 'privacidad@harborlux.example',
    jurisdiccion: 'Ciudad de México',
    actualizado: '2026-11-20',
    borrador: true
  },

  /* ---------------------------------------------------------------
     MONEDA
     --------------------------------------------------------------- */
  moneda: {
    local: 'MXN',
    locale: 'es-MX',
    tipoCambio: 18.20,               // MXN por 1 USD (referencia; actualízalo cuando cambie)
    inicial: 'MXN'                   // moneda que ve el visitante al entrar
  },

  /* ---------------------------------------------------------------
     NAVEGACIÓN
     --------------------------------------------------------------- */
  nav: {
    links: [
      { texto: 'Inicio', href: '#inicio' },
      { texto: 'Propiedades', href: '#propiedades' },
      { texto: 'Servicios', href: '#servicios' },
      { texto: 'Contacto', href: '#contacto' }
    ],
    cta: { texto: 'Agendar visita', corto: 'Agendar', href: '#contacto' }
  },

  /* ---------------------------------------------------------------
     HERO
     modo: 'cinematico' (puertas + toma aérea + parallax + lluvia)
           'imagen'     (una sola foto de fondo con el titular; usa media.fondo)
     En las URLs de imagen, {w} se reemplaza por el ancho ideal según la pantalla.
     --------------------------------------------------------------- */
  hero: {
    modo: 'cinematico',
    kicker: 'Alcanza tu',
    palabra: 'Cumbre',
    titulo: 'Alcanza tu cumbre: penthouses, residencias y terrenos para construir patrimonio',
    buscador: {
      etiqueta: 'Buscar propiedades',
      boton: 'Buscar'
    },
    media: {
      puertas: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261117_063048_97fd9a70-adbe-46bd-bfce-ec1004f6c7d8.png&w={w}&q=85',
      aerea: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261117_063055_ee1debcd-d200-484f-b94f-fad6dcffd4eb.png&w={w}&q=85',
      fondo: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261117_063251_24fbd7cc-00df-49ec-8fbf-d8a0349b1e98.png&w={w}&q=85',
      ciudad: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261117_063252_b9f2fecf-9be0-485f-842f-3aa6bbc251f2.png&w={w}&q=85',
      frente: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261117_063151_7804d758-a2eb-4499-9b56-8f493edbb206.png&w={w}&q=85',
      tilt: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261117_063355_a600befc-45d6-4a32-9db6-9d6565a89609.mp4',
      lluvia: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261117_063703_04e54df7-2236-4dff-b95b-a9a34c1f78ec.mp4'
    }
  },

  /* ---------------------------------------------------------------
     INDICADORES DE CONFIANZA
     valor numérico = contador animado. Usa "texto" para un sello fijo.
     --------------------------------------------------------------- */
  metricas: [
    { prefijo: '+', valor: 120, sufijo: '', etiqueta: 'propiedades escrituradas' },
    { prefijo: 'US$', valor: 45, sufijo: 'M+', etiqueta: 'en cartera gestionada' },
    { prefijo: '', valor: 18, sufijo: ' años', etiqueta: 'en el mercado inmobiliario' },
    { texto: 'AMPI', etiqueta: 'Certificación AMPI y asesoría legal integral' }
  ],

  /* ---------------------------------------------------------------
     SERVICIOS  (icono: valuacion | hipoteca | rentas | exclusiva)
     --------------------------------------------------------------- */
  servicios: [
    {
      icono: 'valuacion',
      titulo: 'Valuación comercial gratuita',
      texto: 'Opinión de valor con comparables reales de la zona, en 48 horas hábiles y sin compromiso.',
      cta: 'Solicitar valuación',
      accion: '#vende'
    },
    {
      icono: 'hipoteca',
      titulo: 'Asesoría hipotecaria y legal',
      texto: 'Comparamos créditos de más de 10 bancos, Infonavit y Fovissste. Revisamos escrituras, gravámenes y contratos con nuestro equipo jurídico.',
      cta: 'Simular mi crédito',
      accion: '#calculadora'
    },
    {
      icono: 'rentas',
      titulo: 'Administración de rentas',
      texto: 'Investigación de inquilinos, póliza jurídica, cobranza mensual y mantenimiento preventivo con reporte transparente.',
      cta: 'Hablar con un asesor',
      accion: 'whatsapp'
    },
    {
      icono: 'exclusiva',
      titulo: 'Comercialización exclusiva',
      texto: 'Fotografía profesional, recorrido virtual 360°, campañas digitales y red de brokers AMPI para vender en menos tiempo.',
      cta: 'Vender con nosotros',
      accion: '#vende'
    }
  ],

  /* ---------------------------------------------------------------
     ASESORES (sin fotos: se muestran iniciales)
     [EDITAR] whatsapp y email reales de cada asesor
     --------------------------------------------------------------- */
  asesores: [
    { id: 'mariana', nombre: 'Mariana Robles', cargo: 'Directora comercial · Costa y Caribe', certificacion: 'Asesora certificada AMPI', whatsapp: '5210000000001', email: 'mariana@harborlux.example' },
    { id: 'diego', nombre: 'Diego Garza', cargo: 'Residencial y comercial · Norte y Occidente', certificacion: 'Asesor certificado AMPI', whatsapp: '5210000000002', email: 'diego@harborlux.example' },
    { id: 'sofia', nombre: 'Sofía Aranda', cargo: 'Residencial · CDMX y Sureste', certificacion: 'Asesora certificada AMPI', whatsapp: '5210000000003', email: 'sofia@harborlux.example' }
  ],

  /* ---------------------------------------------------------------
     CALCULADORA HIPOTECARIA
     --------------------------------------------------------------- */
  hipoteca: {
    valor: { min: 1000000, max: 60000000, paso: 100000, inicial: 8500000 },
    enganche: { min: 10, max: 50, paso: 1, inicial: 20 },   // % del valor
    plazos: [10, 15, 20],                                   // años
    plazoInicial: 20,
    tasa: { min: 8, max: 16, paso: 0.05, inicial: 10.75 },  // % anual fija
    relacionPagoIngreso: 0.30,      // la mensualidad no debería superar el 30 % del ingreso
    gastosEscrituracion: 0.06,      // estimado de gastos notariales e impuestos (6 %)
    beneficios: [
      'Comparamos más de 10 bancos, Infonavit y Fovissste',
      'Precalificación sin costo en 24 horas hábiles',
      'Acompañamiento legal y notarial hasta la firma'
    ],
    nota: 'Cálculo ilustrativo con tasa fija. No incluye seguros de vida y daños, comisión por apertura ni avalúo. La tasa final depende del banco y de tu perfil crediticio.'
  },

  /* ---------------------------------------------------------------
     AGENDA DE VISITAS
     diasHabiles: 0 = domingo … 6 = sábado
     --------------------------------------------------------------- */
  agenda: {
    horarios: ['10:00', '11:30', '13:00', '16:00', '17:30'],
    diasHabiles: [1, 2, 3, 4, 5, 6],
    anticipacionDias: 1,
    maxDias: 45,
    confirmacion: 'Tu asesor confirmará la cita en menos de 2 horas hábiles.'
  },

  /* ---------------------------------------------------------------
     CATÁLOGO: textos de operación, tipos y rangos de presupuesto (MXN)
     --------------------------------------------------------------- */
  catalogo: {
    operaciones: {
      venta: { filtro: 'Compra', badge: 'En Venta' },
      renta: { filtro: 'Renta', badge: 'En Renta' },
      preventa: { filtro: 'Preventa', badge: 'Preventa' }
    },
    tipos: ['Casa', 'Departamento', 'Terreno', 'Local Comercial'],
    presupuestos: {
      venta: [[0, 5000000], [5000000, 10000000], [10000000, 20000000], [20000000, 40000000], [40000000, null]],
      renta: [[0, 40000], [40000, 80000], [80000, 150000], [150000, null]]
    }
  },

  /* ---------------------------------------------------------------
     AMENIDADES (clave → nombre + icono)
     --------------------------------------------------------------- */
  amenidades: {
    seguridad: { nombre: 'Seguridad 24/7', icono: 'shield' },
    alberca: { nombre: 'Alberca', icono: 'pool' },
    roofGarden: { nombre: 'Roof garden', icono: 'leaf' },
    paneles: { nombre: 'Paneles solares', icono: 'sun' },
    gimnasio: { nombre: 'Gimnasio', icono: 'dumbbell' },
    spa: { nombre: 'Spa y vapor', icono: 'spa' },
    elevador: { nombre: 'Elevador', icono: 'elevator' },
    vistaMar: { nombre: 'Vista al mar', icono: 'wave' },
    jardin: { nombre: 'Jardín', icono: 'tree' },
    terraza: { nombre: 'Terraza', icono: 'terrace' },
    cuartoServicio: { nombre: 'Cuarto de servicio', icono: 'door' },
    estacionamientoVisitas: { nombre: 'Estacionamiento de visitas', icono: 'car' },
    petFriendly: { nombre: 'Pet friendly', icono: 'paw' },
    coworking: { nombre: 'Business center', icono: 'laptop' },
    bodega: { nombre: 'Bodega', icono: 'box' },
    smartHome: { nombre: 'Domótica', icono: 'chip' },
    cisterna: { nombre: 'Cisterna', icono: 'drop' },
    plantaEmergencia: { nombre: 'Planta de emergencia', icono: 'bolt' },
    casaClub: { nombre: 'Casa club', icono: 'club' },
    accesoControlado: { nombre: 'Acceso controlado', icono: 'gate' },
    serviciosSubterraneos: { nombre: 'Servicios subterráneos', icono: 'pipe' },
    aireAcondicionado: { nombre: 'Aire acondicionado', icono: 'snow' }
  },

  /* ---------------------------------------------------------------
     PLANOS ARQUITECTÓNICOS
     Se dibujan en SVG a partir de rectángulos en metros (x, y, ancho, fondo).
     t: 'ext' exterior/terraza · 'agua' alberca · 'serv' servicio · 'lote' · 'desplante'
     Si tienes el plano del desarrollador, usa  imagen: 'img/planos/archivo.webp'.
     --------------------------------------------------------------- */
  planos: {
    'ph-3r': [
      {
        nombre: 'Nivel 32', ancho: 24, fondo: 19,
        espacios: [
          { n: 'Terraza', x: 0, y: 0, w: 24, h: 5.5, t: 'ext' },
          { n: 'Alberca infinita', x: 13.5, y: 0.9, w: 9.5, h: 3.4, t: 'agua' },
          { n: 'Estancia doble altura', x: 0, y: 5.5, w: 9, h: 7 },
          { n: 'Comedor', x: 9, y: 5.5, w: 5.5, h: 7 },
          { n: 'Cocina', x: 14.5, y: 5.5, w: 5.5, h: 4.5 },
          { n: 'Estudio', x: 20, y: 5.5, w: 4, h: 4.5 },
          { n: 'Servicio', x: 14.5, y: 10, w: 4, h: 2.5, t: 'serv' },
          { n: 'Elev.', x: 18.5, y: 10, w: 2, h: 2.5, t: 'serv' },
          { n: 'Vestíbulo', x: 20.5, y: 10, w: 3.5, h: 2.5 },
          { n: 'Recámara principal', x: 0, y: 12.5, w: 8, h: 6.5 },
          { n: 'Vestidor', x: 8, y: 12.5, w: 3, h: 3 },
          { n: 'Baño', x: 8, y: 15.5, w: 3, h: 3.5 },
          { n: 'Circ.', x: 11, y: 12.5, w: 2, h: 6.5, t: 'serv' },
          { n: 'Recámara 2', x: 13, y: 12.5, w: 5.5, h: 6.5 },
          { n: 'Baño', x: 18.5, y: 12.5, w: 2, h: 3.5 },
          { n: 'Baño', x: 18.5, y: 16, w: 2, h: 3 },
          { n: 'Recámara 3', x: 20.5, y: 12.5, w: 3.5, h: 6.5 }
        ]
      }
    ],
    'casa-2n': [
      {
        nombre: 'Planta baja', ancho: 20, fondo: 18,
        espacios: [
          { n: 'Cochera', x: 0, y: 0, w: 7, h: 6.5 },
          { n: 'Vestíbulo', x: 7, y: 0, w: 4, h: 6.5 },
          { n: 'Estudio', x: 11, y: 0, w: 5, h: 6.5 },
          { n: '½ baño', x: 16, y: 0, w: 4, h: 3, t: 'serv' },
          { n: 'Servicio', x: 16, y: 3, w: 4, h: 3.5, t: 'serv' },
          { n: 'Sala', x: 0, y: 6.5, w: 8, h: 6.5 },
          { n: 'Comedor', x: 8, y: 6.5, w: 5.5, h: 6.5 },
          { n: 'Cocina', x: 13.5, y: 6.5, w: 6.5, h: 6.5 },
          { n: 'Terraza', x: 0, y: 13, w: 9, h: 5, t: 'ext' },
          { n: 'Jardín', x: 9, y: 13, w: 11, h: 5, t: 'ext' },
          { n: 'Alberca', x: 11, y: 13.8, w: 8, h: 3.4, t: 'agua' }
        ]
      },
      {
        nombre: 'Planta alta', ancho: 20, fondo: 13,
        espacios: [
          { n: 'Recámara principal', x: 0, y: 0, w: 8, h: 7 },
          { n: 'Vestidor', x: 8, y: 0, w: 3, h: 3.5 },
          { n: 'Baño', x: 8, y: 3.5, w: 3, h: 3.5 },
          { n: 'Recámara 2', x: 11, y: 0, w: 5, h: 6.5 },
          { n: 'Baño', x: 16, y: 0, w: 4, h: 3 },
          { n: 'Baño', x: 16, y: 3, w: 4, h: 3.5 },
          { n: 'Family room', x: 0, y: 7, w: 8, h: 6 },
          { n: 'Escalera', x: 8, y: 7, w: 3, h: 6, t: 'serv' },
          { n: 'Recámara 3', x: 11, y: 6.5, w: 4.5, h: 6.5 },
          { n: 'Recámara 4', x: 15.5, y: 6.5, w: 4.5, h: 6.5 }
        ]
      }
    ],
    'depto-2r': [
      {
        nombre: 'Planta tipo', ancho: 13.5, fondo: 14,
        espacios: [
          { n: 'Terraza', x: 0, y: 0, w: 13.5, h: 2.8, t: 'ext' },
          { n: 'Sala-comedor', x: 0, y: 2.8, w: 8, h: 6 },
          { n: 'Cocina', x: 8, y: 2.8, w: 5.5, h: 3.8 },
          { n: 'Lavado', x: 8, y: 6.6, w: 3, h: 2.2, t: 'serv' },
          { n: '½ baño', x: 11, y: 6.6, w: 2.5, h: 2.2, t: 'serv' },
          { n: 'Recámara principal', x: 0, y: 8.8, w: 6, h: 5.2 },
          { n: 'Baño', x: 6, y: 8.8, w: 2.6, h: 2.8 },
          { n: 'Vestidor', x: 6, y: 11.6, w: 2.6, h: 2.4 },
          { n: 'Recámara 2', x: 8.6, y: 8.8, w: 4.9, h: 3.4 },
          { n: 'Baño', x: 8.6, y: 12.2, w: 4.9, h: 1.8 }
        ]
      }
    ],
    'depto-3r': [
      {
        nombre: 'Planta tipo', ancho: 15, fondo: 14.5,
        espacios: [
          { n: 'Balcón', x: 0, y: 0, w: 8, h: 2.2, t: 'ext' },
          { n: 'Sala-comedor', x: 0, y: 2.2, w: 8, h: 6 },
          { n: 'Cocina', x: 8, y: 0, w: 4.5, h: 4.6 },
          { n: 'Lavado', x: 12.5, y: 0, w: 2.5, h: 4.6, t: 'serv' },
          { n: 'Estudio', x: 8, y: 4.6, w: 4.5, h: 3.6 },
          { n: '½ baño', x: 12.5, y: 4.6, w: 2.5, h: 3.6, t: 'serv' },
          { n: 'Recámara principal', x: 0, y: 8.2, w: 5.5, h: 6.3 },
          { n: 'Baño', x: 5.5, y: 8.2, w: 2.5, h: 3.2 },
          { n: 'Vestidor', x: 5.5, y: 11.4, w: 2.5, h: 3.1 },
          { n: 'Recámara 2', x: 8, y: 8.2, w: 3.8, h: 3.9 },
          { n: 'Recámara 3', x: 11.8, y: 8.2, w: 3.2, h: 3.9 },
          { n: 'Baño', x: 8, y: 12.1, w: 7, h: 2.4 }
        ]
      }
    ],
    'casa-patio': [
      {
        nombre: 'Planta única', ancho: 20, fondo: 23.5,
        espacios: [
          { n: 'Cochera', x: 0, y: 0, w: 7, h: 6 },
          { n: 'Zaguán', x: 7, y: 0, w: 3, h: 6 },
          { n: 'Estudio', x: 10, y: 0, w: 5, h: 6 },
          { n: 'Recámara 3', x: 15, y: 0, w: 5, h: 6 },
          { n: 'Sala', x: 0, y: 6, w: 7, h: 7 },
          { n: 'Patio', x: 7, y: 6, w: 6, h: 9, t: 'ext' },
          { n: 'Alberca', x: 8, y: 7, w: 4, h: 7, t: 'agua' },
          { n: 'Comedor', x: 13, y: 6, w: 7, h: 4.5 },
          { n: 'Cocina', x: 13, y: 10.5, w: 7, h: 4.5 },
          { n: 'Recámara principal', x: 0, y: 13, w: 7, h: 7 },
          { n: 'Terraza', x: 7, y: 15, w: 13, h: 4, t: 'ext' },
          { n: 'Baño', x: 0, y: 20, w: 4, h: 3.5 },
          { n: 'Vestidor', x: 4, y: 20, w: 3, h: 3.5 },
          { n: 'Servicio', x: 7, y: 19, w: 2.5, h: 4.5, t: 'serv' },
          { n: 'Baño', x: 9.5, y: 19, w: 3.5, h: 4.5 },
          { n: 'Recámara 2', x: 13, y: 19, w: 7, h: 4.5 }
        ]
      }
    ],
    'local': [
      {
        nombre: 'Planta baja', ancho: 20, fondo: 13,
        nota: 'Frente de 14 m sobre Av. Presidente Masaryk · altura libre 5.2 m',
        espacios: [
          { n: 'Área de exhibición', x: 0, y: 0, w: 14, h: 13 },
          { n: 'Bodega', x: 14, y: 0, w: 6, h: 5.5, t: 'serv' },
          { n: 'Oficina', x: 14, y: 5.5, w: 6, h: 4 },
          { n: 'Sanitarios', x: 14, y: 9.5, w: 6, h: 3.5, t: 'serv' }
        ]
      }
    ],
    'terreno': [
      {
        nombre: 'Lote 14', ancho: 25, fondo: 50,
        nota: 'Uso de suelo H2 · COS 40 % · CUS 1.2 · restricción frontal 5 m',
        espacios: [
          { n: 'Lote 14 · 1,250 m²', x: 0, y: 0, w: 25, h: 50, t: 'lote' },
          { n: 'Área de desplante (COS 40 %)', x: 3, y: 5, w: 19, h: 26.3, t: 'desplante' }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     INVENTARIO DE PROPIEDADES
     --------------------------------------------------------------- */
  propiedades: [
    {
      id: 'HLX-101',
      slug: 'penthouse-summit-puerto-cancun',
      titulo: 'Penthouse Summit',
      operacion: 'venta',
      tipo: 'Departamento',
      exclusiva: true,
      publicado: '2026-11-14',
      precio: 28900000,
      moneda: 'MXN',
      mantenimiento: 21500,
      ubicacion: { direccion: 'Torre Harbor, piso 32, Blvd. Kukulcán km 1.5', zona: 'Puerto Cancún', ciudad: 'Cancún', estado: 'Q. Roo', lat: 21.1625, lng: -86.8065 },
      superficie: { construccion: 420, terreno: null, terraza: 160 },
      recamaras: 3, banos: 3.5, estacionamientos: 3,
      plusvalia: 9.8,
      antiguedad: 'A estrenar',
      amenidades: ['seguridad', 'alberca', 'roofGarden', 'gimnasio', 'spa', 'elevador', 'vistaMar', 'smartHome', 'estacionamientoVisitas', 'bodega', 'paneles'],
      descripcion: 'Penthouse en el piso 32 con terraza privada de 160 m² y alberca infinita orientada a la marina. Estancia a doble altura con ventanales de piso a techo, cocina italiana con isla de cuarzo y recámara principal con vestidor y baño tipo spa. Incluye tres cajones techados, bodega y acceso directo desde el elevador.',
      caracteristicas: ['Elevador con acceso directo al departamento', 'Doble cristal templado con control solar', 'Domótica de iluminación y persianas', 'Cuarto de servicio con baño completo', 'Entrega inmediata con escrituras'],
      fotos: [
        { src: 'img/propiedades/hlx-101-alberca-aerea-1600.webp', srcset: 'img/propiedades/hlx-101-alberca-aerea-800.webp 800w, img/propiedades/hlx-101-alberca-aerea-1600.webp 1600w', alt: 'Vista aérea de la alberca y el roof garden de la Torre Harbor de noche' },
        { src: 'img/propiedades/hlx-101-vista-terraza-1600.webp', srcset: 'img/propiedades/hlx-101-vista-terraza-800.webp 800w, img/propiedades/hlx-101-vista-terraza-1600.webp 1600w', alt: 'Vista nocturna de la bahía y el skyline desde la terraza del penthouse' },
        { src: 'img/propiedades/hlx-101-roof-garden-1200.webp', srcset: 'img/propiedades/hlx-101-roof-garden-640.webp 640w, img/propiedades/hlx-101-roof-garden-1200.webp 1200w', alt: 'Roof garden con alberca iluminada y camastros en la azotea' },
        { src: 'img/propiedades/hlx-101-vista-marina-1200.webp', srcset: 'img/propiedades/hlx-101-vista-marina-640.webp 640w, img/propiedades/hlx-101-vista-marina-1200.webp 1200w', alt: 'Vista aérea de la marina iluminada al anochecer' },
        { src: 'img/propiedades/hlx-101-acceso-1600.webp', srcset: 'img/propiedades/hlx-101-acceso-800.webp 800w, img/propiedades/hlx-101-acceso-1600.webp 1600w', alt: 'Puertas lacadas en negro del acceso privado al penthouse' }
      ],
      planos: 'ph-3r',
      panorama: { src: 'img/propiedades/hlx-101-panorama-2400.webp', alt: 'Panorámica de la bahía desde la terraza' },
      tour360: '',          // URL de Matterport, Kuula u otro visor (se inserta como iframe)
      asesor: 'mariana'
    },
    {
      id: 'HLX-102',
      slug: 'residencia-lomas-del-valle-san-pedro',
      titulo: 'Residencia Lomas del Valle',
      operacion: 'venta',
      tipo: 'Casa',
      exclusiva: false,
      publicado: '2026-10-28',
      precio: 34500000,
      moneda: 'MXN',
      mantenimiento: 6800,
      ubicacion: { direccion: 'Privada Lomas del Valle, Calzada San Pedro', zona: 'San Pedro Garza García', ciudad: 'San Pedro Garza García', estado: 'N.L.', lat: 25.6505, lng: -100.3690 },
      superficie: { construccion: 680, terreno: 900, terraza: 85 },
      recamaras: 4, banos: 5.5, estacionamientos: 4,
      plusvalia: 8.6,
      antiguedad: '2 años',
      amenidades: ['seguridad', 'alberca', 'jardin', 'terraza', 'paneles', 'cisterna', 'cuartoServicio', 'smartHome', 'plantaEmergencia'],
      descripcion: 'Residencia contemporánea en privada con caseta y vista a la Sierra Madre. Planta baja abierta a jardín y alberca, estudio con acceso independiente y cocina con isla y despensa. En planta alta, cuatro recámaras con baño completo y family room.',
      caracteristicas: ['Privada con 18 residencias y caseta 24/7', '12 paneles solares interconectados', 'Cisterna de 20,000 L con hidroneumático', 'Cochera techada para 4 autos', 'Recámara principal con terraza propia'],
      fotos: [
        { src: 'img/propiedades/hlx-102-fachada-1264.webp', srcset: 'img/propiedades/hlx-102-fachada-640.webp 640w, img/propiedades/hlx-102-fachada-1264.webp 1264w', alt: 'Fachada contemporánea de concreto y madera iluminada al anochecer, con la Sierra Madre al fondo' },
        { src: 'img/propiedades/hlx-102-estancia-1264.webp', srcset: 'img/propiedades/hlx-102-estancia-640.webp 640w, img/propiedades/hlx-102-estancia-1264.webp 1264w', alt: 'Estancia a doble altura con piso de travertino, abierta al jardín y la alberca' },
        { src: 'img/propiedades/hlx-102-alberca.webp', alt: 'Alberca y jardín con vista a la montaña', pendiente: true }
      ],
      planos: 'casa-2n',
      asesor: 'diego'
    },
    {
      id: 'HLX-103',
      slug: 'departamento-arquimedes-polanco',
      titulo: 'Departamento Arquímedes 1204',
      operacion: 'renta',
      tipo: 'Departamento',
      exclusiva: false,
      publicado: '2026-11-10',
      precio: 78000,
      moneda: 'MXN',
      mantenimiento: 0,
      mantenimientoNota: 'Incluido en la renta',
      amueblado: true,
      ubicacion: { direccion: 'Calle Arquímedes, piso 12', zona: 'Polanco', ciudad: 'Miguel Hidalgo', estado: 'CDMX', lat: 19.4295, lng: -99.1990 },
      superficie: { construccion: 210, terreno: null, terraza: 18 },
      recamaras: 2, banos: 2.5, estacionamientos: 2,
      plusvalia: 7.4,
      antiguedad: '6 años',
      amenidades: ['seguridad', 'gimnasio', 'roofGarden', 'elevador', 'petFriendly', 'coworking', 'bodega', 'aireAcondicionado'],
      descripcion: 'Departamento amueblado a dos calles de Masaryk, con terraza hacia el Parque Lincoln. Cocina equipada, estancia con chimenea de gas y dos recámaras con baño y vestidor. Listo para habitar.',
      caracteristicas: ['Amueblado y equipado', 'Contrato mínimo de 12 meses', 'Póliza jurídica y un mes de depósito', 'Mascotas pequeñas bienvenidas', 'Mantenimiento incluido'],
      fotos: [
        { src: 'img/propiedades/hlx-103-estancia.webp', alt: 'Estancia amueblada con ventanal y vista a la ciudad de noche', pendiente: true },
        { src: 'img/propiedades/hlx-103-cocina.webp', alt: 'Cocina abierta con isla de mármol', pendiente: true },
        { src: 'img/propiedades/hlx-103-recamara.webp', alt: 'Recámara principal con vista a Polanco', pendiente: true }
      ],
      planos: 'depto-2r',
      asesor: 'sofia'
    },
    {
      id: 'HLX-104',
      slug: 'marea-residences-marina-vallarta',
      titulo: 'Marea Residences',
      operacion: 'preventa',
      tipo: 'Departamento',
      exclusiva: true,
      publicado: '2026-11-18',
      precio: 8950000,
      precioDesde: true,
      moneda: 'MXN',
      mantenimiento: 5900,
      entrega: 'Diciembre 2028',
      esquemaPago: '30 % de enganche · 60 % durante la obra · 10 % a la entrega',
      ubicacion: { direccion: 'Paseo de la Marina, frente al muelle', zona: 'Marina Vallarta', ciudad: 'Puerto Vallarta', estado: 'Jal.', lat: 20.6640, lng: -105.2515 },
      superficie: { construccion: 145, terreno: null, terraza: 32 },
      recamaras: 2, banos: 2, estacionamientos: 2,
      plusvalia: 12.5,
      antiguedad: 'Preventa',
      amenidades: ['alberca', 'roofGarden', 'gimnasio', 'seguridad', 'coworking', 'petFriendly', 'vistaMar', 'elevador', 'casaClub', 'paneles'],
      descripcion: 'Torre de 18 niveles frente a la marina con rooftop, alberca infinita y casa club. Departamentos de dos recámaras con terraza de 32 m² y vista al mar. Precio de preventa con plusvalía estimada al momento de la entrega.',
      caracteristicas: ['Entrega estimada: diciembre 2028', 'Esquema 30 / 60 / 10', 'Licencia de construcción vigente', 'Programa de rentas vacacionales', 'Acabados en mármol y madera de parota'],
      fotos: [
        { src: 'img/propiedades/hlx-104-torre.webp', alt: 'Render de la torre frente a la marina al atardecer', pendiente: true },
        { src: 'img/propiedades/hlx-104-rooftop.webp', alt: 'Rooftop con alberca infinita y vista al mar', pendiente: true },
        { src: 'img/propiedades/hlx-104-interior.webp', alt: 'Estancia con terraza abierta al océano', pendiente: true }
      ],
      planos: 'depto-2r',
      asesor: 'mariana'
    },
    {
      id: 'HLX-105',
      slug: 'terreno-aldea-zama-tulum',
      titulo: 'Terreno Aldea Zamá, Lote 14',
      operacion: 'venta',
      tipo: 'Terreno',
      exclusiva: false,
      publicado: '2026-09-30',
      precio: 342000,
      moneda: 'USD',
      mantenimiento: 2400,
      usoSuelo: 'Habitacional H2 · COS 40 % · CUS 1.2',
      ubicacion: { direccion: 'Av. Aldea Zamá, sección Alhambra', zona: 'Aldea Zamá', ciudad: 'Tulum', estado: 'Q. Roo', lat: 20.2010, lng: -87.4640 },
      superficie: { construccion: null, terreno: 1250, terraza: null },
      recamaras: null, banos: null, estacionamientos: null,
      plusvalia: 14.2,
      antiguedad: 'Lote urbanizado',
      amenidades: ['accesoControlado', 'serviciosSubterraneos', 'seguridad', 'jardin'],
      descripcion: 'Lote plano de 25 × 50 m en la zona residencial más consolidada de Tulum, a 2.5 km de la playa. Urbanizado con servicios subterráneos, escrituras individuales y factibilidad para residencia o villas boutique.',
      caracteristicas: ['Escritura individual libre de gravamen', 'Luz, agua y drenaje subterráneos', 'Factibilidad para 2 villas', 'A 2.5 km de la playa', 'Precio en dólares'],
      fotos: [
        { src: 'img/propiedades/hlx-105-aereo.webp', alt: 'Vista aérea con dron del lote rodeado de selva', pendiente: true },
        { src: 'img/propiedades/hlx-105-acceso.webp', alt: 'Vialidad de acceso con iluminación y vegetación', pendiente: true },
        { src: 'img/propiedades/hlx-105-cenote.webp', alt: 'Cenote cercano a la sección residencial', pendiente: true }
      ],
      planos: 'terreno',
      asesor: 'mariana'
    },
    {
      id: 'HLX-106',
      slug: 'casa-patio-montebello-merida',
      titulo: 'Casa Patio Montebello',
      operacion: 'venta',
      tipo: 'Casa',
      exclusiva: true,
      publicado: '2026-11-05',
      precio: 9800000,
      moneda: 'MXN',
      mantenimiento: 1900,
      ubicacion: { direccion: 'Calle 23, privada Montebello', zona: 'Mérida Norte', ciudad: 'Mérida', estado: 'Yuc.', lat: 21.0300, lng: -89.6040 },
      superficie: { construccion: 380, terreno: 520, terraza: 52 },
      recamaras: 3, banos: 3.5, estacionamientos: 2,
      plusvalia: 10.4,
      antiguedad: 'A estrenar',
      amenidades: ['alberca', 'jardin', 'terraza', 'paneles', 'cisterna', 'seguridad', 'cuartoServicio', 'aireAcondicionado'],
      descripcion: 'Casa de una planta organizada alrededor de un patio con alberca, con muros de chukum, piso de pasta y techos altos con vigas de madera. Ventilación cruzada en todas las áreas y paneles solares para reducir el consumo de aire acondicionado.',
      caracteristicas: ['Arquitectura contemporánea yucateca', 'Chukum y pisos de pasta artesanal', '8 paneles solares', 'Minisplits inverter en todas las recámaras', 'Privada con vigilancia'],
      fotos: [
        { src: 'img/propiedades/hlx-106-patio.webp', alt: 'Patio central con alberca y muros de chukum', pendiente: true },
        { src: 'img/propiedades/hlx-106-estancia.webp', alt: 'Estancia con techos altos y vigas de madera', pendiente: true },
        { src: 'img/propiedades/hlx-106-recamara.webp', alt: 'Recámara principal abierta al jardín', pendiente: true }
      ],
      planos: 'casa-patio',
      asesor: 'sofia'
    },
    {
      id: 'HLX-107',
      slug: 'local-masaryk-polanco',
      titulo: 'Local en esquina Masaryk',
      operacion: 'renta',
      tipo: 'Local Comercial',
      exclusiva: true,
      publicado: '2026-10-20',
      precio: 185000,
      moneda: 'MXN',
      mantenimiento: 9500,
      usoSuelo: 'Comercial · uso de suelo vigente',
      ubicacion: { direccion: 'Av. Presidente Masaryk esquina Lope de Vega', zona: 'Polanco', ciudad: 'Miguel Hidalgo', estado: 'CDMX', lat: 19.4318, lng: -99.1942 },
      superficie: { construccion: 260, terreno: null, terraza: null },
      recamaras: null, banos: 2, estacionamientos: 4,
      plusvalia: 6.1,
      antiguedad: '10 años',
      amenidades: ['seguridad', 'plantaEmergencia', 'aireAcondicionado', 'bodega', 'estacionamientoVisitas'],
      descripcion: 'Local en esquina sobre el corredor comercial más exclusivo del país, con 14 m de frente de cristal y altura libre de 5.2 m. Ideal para boutique, showroom o restaurante de autor.',
      caracteristicas: ['14 m de frente sobre Masaryk', 'Altura libre de 5.2 m', 'Uso de suelo comercial vigente', 'Contrato de 3 a 5 años', 'Subestación eléctrica propia'],
      fotos: [
        { src: 'img/propiedades/hlx-107-fachada.webp', alt: 'Fachada de cristal del local en esquina iluminada de noche', pendiente: true },
        { src: 'img/propiedades/hlx-107-interior.webp', alt: 'Interior vacío con doble altura y concreto pulido', pendiente: true }
      ],
      planos: 'local',
      asesor: 'diego'
    },
    {
      id: 'HLX-108',
      slug: 'departamento-santa-fe-vista',
      titulo: 'Departamento Santa Fe Vista',
      operacion: 'venta',
      tipo: 'Departamento',
      exclusiva: false,
      publicado: '2026-11-08',
      precio: 11400000,
      moneda: 'MXN',
      mantenimiento: 7200,
      ubicacion: { direccion: 'Av. Santa Fe, torre Vista, piso 21', zona: 'Santa Fe', ciudad: 'Cuajimalpa', estado: 'CDMX', lat: 19.3620, lng: -99.2665 },
      superficie: { construccion: 185, terreno: null, terraza: 14 },
      recamaras: 3, banos: 2.5, estacionamientos: 2,
      plusvalia: 6.8,
      antiguedad: '5 años',
      amenidades: ['seguridad', 'alberca', 'gimnasio', 'elevador', 'estacionamientoVisitas', 'petFriendly', 'bodega', 'coworking'],
      descripcion: 'Departamento en piso 21 con vista abierta al poniente, a pasos de corporativos y del centro comercial. Tres recámaras, estudio y balcón. Edificio con alberca techada, gimnasio y business center.',
      caracteristicas: ['Piso 21 con vista al poniente', 'Estudio independiente', 'Dos cajones y bodega', 'Alberca techada y climatizada', 'Escrituras listas para traslado'],
      fotos: [
        { src: 'img/propiedades/hlx-108-vista.webp', alt: 'Vista del skyline de Santa Fe al atardecer desde el balcón', pendiente: true },
        { src: 'img/propiedades/hlx-108-estancia.webp', alt: 'Sala-comedor con piso de madera y ventanal', pendiente: true },
        { src: 'img/propiedades/hlx-108-cocina.webp', alt: 'Cocina integral en tonos grafito', pendiente: true }
      ],
      planos: 'depto-3r',
      asesor: 'sofia'
    },
    {
      id: 'HLX-109',
      slug: 'villa-puerta-de-hierro-zapopan',
      titulo: 'Villa Puerta de Hierro',
      operacion: 'renta',
      tipo: 'Casa',
      exclusiva: false,
      publicado: '2026-10-12',
      precio: 95000,
      moneda: 'MXN',
      mantenimiento: 0,
      mantenimientoNota: 'Incluido en la renta',
      amueblado: true,
      ubicacion: { direccion: 'Coto Bosques de Puerta de Hierro', zona: 'Puerta de Hierro', ciudad: 'Zapopan', estado: 'Jal.', lat: 20.7110, lng: -103.4120 },
      superficie: { construccion: 520, terreno: 700, terraza: 60 },
      recamaras: 4, banos: 4.5, estacionamientos: 3,
      plusvalia: 7.9,
      antiguedad: '8 años',
      amenidades: ['seguridad', 'alberca', 'jardin', 'terraza', 'cuartoServicio', 'paneles', 'cisterna', 'petFriendly'],
      descripcion: 'Villa amueblada en coto con seguridad, rodeada de jardín y con alberca climatizada. Planta baja social abierta a la terraza y cuatro recámaras en planta alta. Disponible para contrato corporativo.',
      caracteristicas: ['Amueblada y equipada', 'Alberca climatizada con paneles', 'Coto con 3 filtros de seguridad', 'Contrato corporativo disponible', 'Jardín de 180 m²'],
      fotos: [
        { src: 'img/propiedades/hlx-109-fachada.webp', alt: 'Fachada de la villa iluminada al anochecer', pendiente: true },
        { src: 'img/propiedades/hlx-109-jardin.webp', alt: 'Jardín con alberca y terraza techada', pendiente: true },
        { src: 'img/propiedades/hlx-109-estancia.webp', alt: 'Estancia amueblada con chimenea', pendiente: true }
      ],
      planos: 'casa-2n',
      asesor: 'diego'
    }
  ]
};
