/**
 * VANTGARD SYSTEMS — fuente única de contenido.
 * Todo lo editable del sitio vive aquí: empresa, servicios, precios,
 * cotizador, portafolio, proceso, historia, FAQ y conocimiento del agente.
 *
 * Lo que diga [PENDIENTE] debes completarlo tú (lista completa en el README).
 */

export const PENDING = "[PENDIENTE]";

/* ------------------------------------------------------------------ */
/* Empresa                                                             */
/* ------------------------------------------------------------------ */

export const company = {
  name: "Vantgard Systems",
  shortName: "Vantgard",
  tagline: "Páginas web que trabajan por tu negocio 24/7",
  description:
    "Diseñamos páginas web de alto rendimiento para negocios en México, con sistemas que atienden clientes, agendan citas y filtran prospectos las 24 horas. Demo sin anticipo.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.vantgardsystems.com",
  email: "erick.castro@vantgardsystems.com",
  /** Solo dígitos, con lada de país. Ejemplo: 5215512345678 */
  whatsapp: "520000000000", // [PENDIENTE] tu número de WhatsApp
  whatsappDisplay: `${PENDING} tu WhatsApp`,
  hours: "Lunes a sábado, 9:00 a 19:00 h (centro de México)",
  social: {
    instagram: "https://www.instagram.com/vantgardsystems", // [PENDIENTE] confirma tu usuario
    tiktok: "https://www.tiktok.com/@vantgardsystems", // [PENDIENTE] confirma tu usuario
  },
  /** Datos legales del responsable (aviso de privacidad y términos). */
  legal: {
    businessName: `${PENDING} nombre o razón social`,
    address: `${PENDING} domicilio completo`,
    privacyEmail: "erick.castro@vantgardsystems.com",
    jurisdiction: `${PENDING} ciudad y estado`,
    lastUpdated: "2026-11-14",
    arcoResponseDays: 20,
  },
} as const;

/* ------------------------------------------------------------------ */
/* Navegación                                                          */
/* ------------------------------------------------------------------ */

export const nav = [
  { label: "Servicios", href: "/#servicios" },
  { label: "Portafolio", href: "/#portafolio" },
  { label: "Historia", href: "/#historia" },
  { label: "Precios", href: "/#precios" },
  { label: "Cotizar", href: "/#cotizar" },
  { label: "Contacto", href: "/#contacto" },
] as const;

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const hero = {
  title: "Páginas web que trabajan por tu negocio 24/7",
  subtitle:
    "Diseñamos sitios de alto rendimiento con sistemas que atienden, agendan y venden por ti, incluso mientras duermes.",
  primaryCta: { label: "Cotiza tu página", href: "/#cotizar" },
  secondaryCta: { label: "Ver proyectos", href: "/#portafolio" },
  badges: ["Demo sin anticipo", "100% a tu marca", "Soporte real"],
} as const;

export const industries = [
  "Clínicas",
  "Inmobiliarias",
  "Ropa",
  "Tenis",
  "Perfumes",
  "Paneles solares",
  "Restaurantes",
  "Muebles",
  "Electrónicos",
] as const;

/* ------------------------------------------------------------------ */
/* Precios                                                             */
/* ------------------------------------------------------------------ */

export const pricing = {
  currency: "MXN",
  /** [PENDIENTE] Cambia a "IVA incluido" si tus precios ya lo incluyen. */
  taxLabel: "+ IVA",
  /** Margen del rango estimado: total −7 % a +7 %. */
  rangeSpread: 0.07,
  note: "Precio final tras diagnóstico.",
} as const;

export type ProjectTypeId = "landing" | "profesional" | "tienda" | "citas" | "rediseno" | "medida";
export type ExtraId =
  | "agente"
  | "citas"
  | "whatsapp"
  | "seo"
  | "logo"
  | "media"
  | "idiomas"
  | "hosting";
export type MaintenanceId = "ninguno" | "basico" | "pro";
export type DeliveryId = "normal" | "express";

export interface ProjectType {
  id: ProjectTypeId;
  label: string;
  description: string;
  base: number;
  /** Qué mide el slider del paso 2. */
  unit: { singular: string; plural: string };
  included: number;
  min: number;
  max: number;
  step: number;
  /** Costo por cada unidad arriba de las incluidas. */
  perUnit: number;
  /** Extras que ya vienen dentro del precio base. */
  includesExtras?: ExtraId[];
}

export const projectTypes: ProjectType[] = [
  {
    id: "landing",
    label: "Landing page",
    description: "Una sola página enfocada en que te contacten o te compren.",
    base: 4900,
    unit: { singular: "sección", plural: "secciones" },
    included: 5,
    min: 3,
    max: 12,
    step: 1,
    perUnit: 450,
  },
  {
    id: "profesional",
    label: "Sitio profesional",
    description: "Varias páginas: inicio, servicios, nosotros, contacto y más.",
    base: 9900,
    unit: { singular: "página", plural: "páginas" },
    included: 5,
    min: 3,
    max: 20,
    step: 1,
    perUnit: 900,
  },
  {
    id: "tienda",
    label: "Tienda en línea",
    description: "Catálogo, carrito y pagos para vender todo el día.",
    base: 16900,
    unit: { singular: "producto", plural: "productos" },
    included: 30,
    min: 10,
    max: 300,
    step: 10,
    perUnit: 35,
  },
  {
    id: "citas",
    label: "Sistema de citas",
    description: "Sitio con agenda en línea, recordatorios y confirmaciones.",
    base: 12900,
    unit: { singular: "página", plural: "páginas" },
    included: 4,
    min: 3,
    max: 15,
    step: 1,
    perUnit: 900,
    includesExtras: ["citas"],
  },
  {
    id: "rediseno",
    label: "Rediseño",
    description: "Tu sitio actual, más rápido, moderno y fácil de usar.",
    base: 6900,
    unit: { singular: "página", plural: "páginas" },
    included: 5,
    min: 1,
    max: 20,
    step: 1,
    perUnit: 700,
  },
  {
    id: "medida",
    label: "A la medida",
    description: "Portales, paneles o integraciones que no caben en un plan.",
    base: 24900,
    unit: { singular: "pantalla", plural: "pantallas" },
    included: 8,
    min: 4,
    max: 40,
    step: 1,
    perUnit: 1400,
  },
];

export interface Extra {
  id: ExtraId;
  label: string;
  description: string;
  price: number;
}

export const extras: Extra[] = [
  {
    id: "agente",
    label: "Agente IA 24/7",
    description: "Responde dudas, filtra prospectos y te pasa los contactos listos.",
    price: 6900,
  },
  {
    id: "citas",
    label: "Sistema de citas",
    description: "Agenda en línea con confirmación y recordatorios.",
    price: 4500,
  },
  {
    id: "whatsapp",
    label: "Catálogo por WhatsApp",
    description: "Tus productos listos para pedir desde el chat.",
    price: 2500,
  },
  {
    id: "seo",
    label: "SEO",
    description: "Estructura, textos y configuración para aparecer en Google.",
    price: 3500,
  },
  {
    id: "logo",
    label: "Logo e identidad",
    description: "Logotipo, colores y tipografías para tu marca.",
    price: 3900,
  },
  {
    id: "media",
    label: "Imágenes o video para tu marca",
    description: "Material visual hecho para tu negocio, no fotos de stock.",
    price: 2900,
  },
  {
    id: "idiomas",
    label: "Multilenguaje",
    description: "Tu sitio en español e inglés.",
    price: 3500,
  },
  {
    id: "hosting",
    label: "Dominio + hosting 1 año",
    description: "Tu .com o .mx y el servidor, configurados por nosotros.",
    price: 1900,
  },
];

/** Descuento al combinar extras (el plan Autónomo sale de aquí). */
export const bundles = [
  {
    id: "autonomo",
    label: "Paquete Autónomo (agente IA + citas)",
    requires: ["agente", "citas"] as ExtraId[],
    discount: 1400,
  },
];

export const delivery: { id: DeliveryId; label: string; time: string; surcharge: number }[] = [
  { id: "normal", label: "Normal", time: "10 a 15 días hábiles", surcharge: 0 },
  { id: "express", label: "Express", time: "5 a 7 días hábiles", surcharge: 0.3 },
];

export interface MaintenancePlan {
  id: MaintenanceId;
  label: string;
  monthly: number;
  description: string;
  features: string[];
}

export const maintenance: MaintenancePlan[] = [
  {
    id: "ninguno",
    label: "Ninguno",
    monthly: 0,
    description: "Tú administras tu sitio. Te entregamos todo documentado.",
    features: [],
  },
  {
    id: "basico",
    label: "Básico",
    monthly: 690,
    description: "Tu sitio siempre en línea, seguro y actualizado.",
    features: [
      "Hosting y certificado SSL",
      "Respaldos semanales",
      "Monitoreo de caídas",
      "1 hora de cambios al mes",
    ],
  },
  {
    id: "pro",
    label: "Pro",
    monthly: 1490,
    description: "Para negocios que cambian precios, productos o promociones seguido.",
    features: [
      "Todo lo del plan Básico",
      "4 horas de cambios al mes",
      "Ajustes al agente IA y a la agenda",
      "Reporte mensual de visitas y contactos",
      "Atención prioritaria por WhatsApp",
    ],
  },
];

export interface Plan {
  id: string;
  name: string;
  price: number;
  summary: string;
  features: string[];
  featured?: boolean;
  /** Con qué arranca el cotizador al elegir este plan. */
  preset: { type: ProjectTypeId; extras: ExtraId[] };
}

export const plans: Plan[] = [
  {
    id: "landing",
    name: "Landing",
    price: 4900,
    summary: "Para lanzar un producto, servicio o campaña.",
    features: [
      "Una página con hasta 5 secciones",
      "Diseño a la medida de tu marca",
      "Botón de WhatsApp y formulario",
      "Lista para celular",
      "2 rondas de cambios",
    ],
    preset: { type: "landing", extras: [] },
  },
  {
    id: "profesional",
    name: "Profesional",
    price: 9900,
    summary: "El sitio completo de tu negocio.",
    features: [
      "Hasta 5 páginas",
      "Diseño a la medida de tu marca",
      "Formularios y WhatsApp",
      "SEO básico y Google Maps",
      "Panel para editar textos e imágenes",
      "3 rondas de cambios",
    ],
    featured: true,
    preset: { type: "profesional", extras: [] },
  },
  {
    id: "tienda",
    name: "Tienda en línea",
    price: 16900,
    summary: "Vende con catálogo, carrito y pagos.",
    features: [
      "Hasta 30 productos cargados",
      "Carrito y pagos con tarjeta",
      "Inventario y pedidos",
      "Envíos y cupones",
      "Capacitación para administrarla",
      "3 rondas de cambios",
    ],
    preset: { type: "tienda", extras: [] },
  },
  {
    id: "autonomo",
    name: "Autónomo",
    price: 19900,
    summary: "Sitio + agente IA + citas. Atiende solo.",
    features: [
      "Todo lo del plan Profesional",
      "Agente IA entrenado con tu negocio",
      "Agenda en línea con recordatorios",
      "Filtro de prospectos 24/7",
      "Avisos a tu WhatsApp",
      "3 rondas de cambios",
    ],
    preset: { type: "profesional", extras: ["agente", "citas"] },
  },
];

/* ------------------------------------------------------------------ */
/* Servicios                                                           */
/* ------------------------------------------------------------------ */

export interface Service {
  id: string;
  title: string;
  description: string;
  from: number;
  fromSuffix?: string;
  /** Nombre del icono de lucide-react. */
  icon: "PanelTop" | "Globe" | "ShoppingCart" | "CalendarCheck" | "BotMessageSquare" | "Wrench";
  image: string;
  imageAlt: string;
  /** Tamaño en el bento grid. */
  size: "lg" | "md";
}

export const services: Service[] = [
  {
    id: "landing",
    title: "Landing pages",
    description: "Una página directa al punto para que te escriban hoy mismo.",
    from: 4900,
    icon: "PanelTop",
    image: "/images/servicio-landing.webp",
    imageAlt: "Ventana de navegador en 3D negro mate con brillo naranja",
    size: "lg",
  },
  {
    id: "sitios",
    title: "Sitios profesionales",
    description: "Tu negocio completo en línea, rápido y fácil de encontrar.",
    from: 9900,
    icon: "Globe",
    image: "/images/servicio-sitio.webp",
    imageAlt: "Cohete en 3D negro mate con brillo naranja",
    size: "md",
  },
  {
    id: "tiendas",
    title: "Tiendas en línea",
    description: "Catálogo, carrito y pagos. Vende aunque el local esté cerrado.",
    from: 16900,
    icon: "ShoppingCart",
    image: "/images/servicio-tienda.webp",
    imageAlt: "Carrito de compras en 3D negro mate con brillo naranja",
    size: "md",
  },
  {
    id: "citas",
    title: "Sistemas de citas",
    description: "Tus clientes agendan solos y reciben recordatorio.",
    from: 4500,
    icon: "CalendarCheck",
    image: "/images/servicio-citas.webp",
    imageAlt: "Calendario en 3D negro mate con brillo naranja",
    size: "md",
  },
  {
    id: "agentes",
    title: "Agentes IA 24/7",
    description: "Contesta dudas, filtra prospectos y te manda solo los que van en serio.",
    from: 6900,
    icon: "BotMessageSquare",
    image: "/images/servicio-agente.webp",
    imageAlt: "Burbuja de chat con chispa en 3D negro mate con brillo naranja",
    size: "lg",
  },
  {
    id: "mantenimiento",
    title: "Rediseño y mantenimiento",
    description: "Renovamos tu sitio actual y lo mantenemos al día.",
    from: 690,
    fromSuffix: "/mes",
    icon: "Wrench",
    image: "/images/servicio-mantenimiento.webp",
    imageAlt: "Engrane en 3D negro mate con brillo naranja",
    size: "md",
  },
];

/* ------------------------------------------------------------------ */
/* Portafolio                                                          */
/* ------------------------------------------------------------------ */

export const portfolioFilters = ["Todos", "Tiendas", "Salud", "Energía", "Servicios"] as const;
export type PortfolioCategory = Exclude<(typeof portfolioFilters)[number], "Todos">;

export interface Project {
  slug: string;
  name: string;
  industry: string;
  category: PortfolioCategory;
  tags: string[];
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
  /** [PENDIENTE] Link de la demo en vivo. Vacío = se oculta el botón. */
  demoUrl: string;
  /** Capturas (placeholders hasta tener las reales). */
  desktop: string;
  mobile: string;
  status: "live" | "development";
}

export const projects: Project[] = [
  {
    slug: "solenna",
    name: "Solenna",
    industry: "Energía solar residencial",
    category: "Energía",
    tags: ["Agente IA", "Cotizador", "Landing"],
    summary: "Sitio que calcula el ahorro de cada casa y filtra prospectos solos.",
    challenge:
      "Los interesados en paneles solares preguntan lo mismo: cuánto cuesta y cuánto voy a ahorrar. El equipo perdía horas contestando a personas que no estaban listas para comprar.",
    solution:
      "Un sitio con calculadora de ahorro según el recibo de luz y un agente IA que resuelve dudas, pide los datos clave y solo pasa a ventas a quien ya quiere una visita técnica.",
    results: ["Calculadora de ahorro en vivo", "Prospectos filtrados por el agente", "Carga en menos de 2 segundos"],
    demoUrl: "",
    desktop: "/portfolio/solenna-desktop.webp",
    mobile: "/portfolio/solenna-mobile.webp",
    status: "live",
  },
  {
    slug: "empire-kicks",
    name: "Empire Kicks",
    industry: "Tienda de tenis",
    category: "Tiendas",
    tags: ["Tienda", "Catálogo WhatsApp"],
    summary: "Tienda en línea de tenis con catálogo por talla y pedido por WhatsApp.",
    challenge:
      "Vender por Instagram funcionaba, pero cada pedido era un chat largo: modelo, talla, precio, disponibilidad. Con más seguidores, más mensajes sin contestar.",
    solution:
      "Una tienda con filtros por marca y talla, existencias al día y pedido en dos toques. El cliente llega al WhatsApp con el modelo y la talla ya elegidos.",
    results: ["Catálogo con filtros por talla", "Pedido listo en dos toques", "Hecha para comprar desde el celular"],
    demoUrl: "",
    desktop: "/portfolio/empire-kicks-desktop.webp",
    mobile: "/portfolio/empire-kicks-mobile.webp",
    status: "live",
  },
  {
    slug: "sneaker-district",
    name: "Sneaker District",
    industry: "Tienda de tenis premium",
    category: "Tiendas",
    tags: ["Tienda", "Pagos en línea"],
    summary: "Tienda premium con lanzamientos, pagos con tarjeta y diseño editorial.",
    challenge:
      "Un catálogo de pares exclusivos necesita verse a la altura del producto. Una plantilla genérica le restaba valor a tenis de edición limitada.",
    solution:
      "Diseño editorial con fotografía grande, páginas de lanzamiento con cuenta regresiva y pago con tarjeta sin salir del sitio.",
    results: ["Páginas de lanzamiento", "Pago con tarjeta integrado", "Diseño editorial a la medida"],
    demoUrl: "",
    desktop: "/portfolio/sneaker-district-desktop.webp",
    mobile: "/portfolio/sneaker-district-mobile.webp",
    status: "live",
  },
  {
    slug: "clinica-de-cirugia",
    name: "Clínica de cirugía",
    industry: "Salud",
    category: "Salud",
    tags: ["Citas", "Agente IA"],
    summary: "Sitio médico con agenda en línea y valoraciones sin llamadas.",
    challenge:
      "Los pacientes escribían fuera de horario y la recepción no alcanzaba a contestar. Muchas valoraciones se perdían antes de agendarse.",
    solution:
      "Un sitio sobrio con la información de cada procedimiento y una agenda en línea: el paciente elige día y hora, recibe confirmación y un recordatorio antes de su cita.",
    results: ["Agenda abierta las 24 horas", "Recordatorios automáticos", "Información clara por procedimiento"],
    demoUrl: "",
    desktop: "/portfolio/clinica-desktop.webp",
    mobile: "/portfolio/clinica-mobile.webp",
    status: "live",
  },
];

export const upcomingProjects = [
  { name: "Tienda de sudaderas", industry: "Ropa", category: "Tiendas" as PortfolioCategory },
  { name: "Mueblería", industry: "Muebles", category: "Tiendas" as PortfolioCategory },
  { name: "Tienda de electrónicos", industry: "Electrónicos", category: "Tiendas" as PortfolioCategory },
];

/* ------------------------------------------------------------------ */
/* Proceso                                                             */
/* ------------------------------------------------------------------ */

export const processSteps = [
  {
    title: "Diagnóstico gratis",
    description:
      "Platicamos 20 minutos sobre tu negocio, tus clientes y lo que hoy te quita tiempo. Sales con una recomendación clara, la contrates o no.",
    detail: "20 min, por llamada o WhatsApp",
    image: "/images/proceso-diagnostico.webp",
    imageAlt: "Lupa sobre un sitio web, en 3D negro con luz naranja",
  },
  {
    title: "Demo en Sandbox sin anticipo",
    description:
      "Construimos una demo real de tu página en un servidor de prueba. No pagas nada y no tocamos tu sitio actual. La ves funcionando antes de decidir.",
    detail: "Sin anticipo y sin compromiso",
    image: "/images/proceso-sandbox.webp",
    imageAlt: "Servidor de prueba brillando en naranja sobre fondo negro",
  },
  {
    title: "Ajustes a tu marca",
    description:
      "Afinamos colores, textos, fotos y funciones hasta que se sienta tuya. Las rondas de cambios vienen incluidas en tu plan.",
    detail: "2 a 3 rondas de cambios incluidas",
    image: "/images/proceso-marca.webp",
    imageAlt: "Paleta de colores aplicándose a una página web en 3D",
  },
  {
    title: "Lanzamiento y soporte",
    description:
      "Publicamos en tu dominio, conectamos WhatsApp, agenda y agente IA, y te enseñamos a usar todo. Después seguimos contigo.",
    detail: "Soporte por WhatsApp con personas reales",
    image: "/images/proceso-lanzamiento.webp",
    imageAlt: "Cohete despegando con estela naranja sobre fondo negro",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Nuestra historia                                                    */
/* ------------------------------------------------------------------ */

export const story = {
  title: "Nuestra historia",
  /** [PENDIENTE] Completa año, ciudad y por qué nació Vantgard Systems. */
  origin: [
    `Vantgard Systems nació en ${PENDING} año, en ${PENDING} ciudad, con una idea simple: un negocio no debería perder clientes por no contestar a tiempo.`,
    `${PENDING} Cuenta aquí por qué empezaste: qué problema viste, a quién ayudaste primero y qué te hizo dedicarte a esto.`,
  ],
  mission:
    "Darle a cada negocio una página que trabaje sola: que atienda, agende y venda mientras su dueño se ocupa de lo demás.",
  vision:
    "Ser el equipo de confianza de los negocios mexicanos que quieren vender en línea sin complicarse.",
  values: [
    {
      title: "Primero lo ves, luego decides",
      description: "Por eso hacemos la demo antes de pedirte un peso.",
    },
    {
      title: "Hecho para tu marca",
      description: "Nada de plantillas. Cada sitio se diseña desde cero.",
    },
    {
      title: "Soporte de personas",
      description: "Te contesta alguien del equipo, no un ticket.",
    },
  ],
  /** [PENDIENTE] Hitos reales con su fecha. */
  timeline: [
    { date: PENDING, title: "El inicio", description: `${PENDING} Primer proyecto o primer cliente.` },
    { date: PENDING, title: "Primeras tiendas en línea", description: "Empire Kicks y Sneaker District salen a vender." },
    { date: PENDING, title: "Llegan los agentes IA", description: "Solenna estrena un asistente que filtra prospectos." },
    { date: PENDING, title: "Demo en Sandbox", description: "Adoptamos la demo sin anticipo como forma de trabajo." },
  ],
  /** [PENDIENTE] Confirma estas cifras. */
  stats: [
    { value: 7, suffix: "", label: "proyectos" },
    { value: 6, suffix: "", label: "industrias" },
    { value: 2, prefix: "<", suffix: " h", label: "tiempo de respuesta" },
  ],
  image: "/images/historia.webp",
  imageAlt: "Escritorio de noche con monitores mostrando código y diseños web, iluminado por una lámpara naranja",
} as const;

/* ------------------------------------------------------------------ */
/* Preguntas frecuentes                                                */
/* ------------------------------------------------------------------ */

export const faq = [
  {
    q: "¿Cuánto tardan en entregar mi página?",
    a: "Una entrega normal toma de 10 a 15 días hábiles desde que apruebas la demo. Si te urge, la entrega Express es de 5 a 7 días hábiles con un cargo adicional del 30 %.",
  },
  {
    q: "¿De verdad no piden anticipo?",
    a: "No para la demo. Construimos una versión real de tu página en un servidor de prueba (Sandbox), sin tocar tu sitio actual. Si te gusta, la contratas; si no, no pagas nada.",
  },
  {
    q: "¿Puedo editar mi página yo mismo?",
    a: "Sí. El plan Profesional y los superiores incluyen un panel para cambiar textos, imágenes, productos y precios. También te capacitamos, y si prefieres no meterte, lo hacemos nosotros con un plan de mantenimiento.",
  },
  {
    q: "¿Incluye dominio y hosting?",
    a: "Puedes usar el dominio y hosting que ya tengas, o agregar el extra de Dominio + hosting por 1 año y nosotros lo configuramos todo. Con los planes de mantenimiento el hosting ya va incluido.",
  },
  {
    q: "¿Cómo funciona el agente IA?",
    a: "Lo entrenamos con la información de tu negocio: servicios, precios, horarios y preguntas comunes. Atiende en tu página las 24 horas, pide los datos del cliente y te avisa por WhatsApp cuando alguien está listo para comprar o agendar. Nunca inventa precios: solo usa lo que tú autorizas.",
  },
  {
    q: "¿Qué formas de pago aceptan?",
    a: "Transferencia bancaria (SPEI) y tarjeta de crédito o débito. Normalmente es 50 % al aprobar la demo y 50 % antes de publicar. Emitimos factura si la necesitas.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Contacto                                                            */
/* ------------------------------------------------------------------ */

export const contactServices = [
  "Landing page",
  "Sitio profesional",
  "Tienda en línea",
  "Sistema de citas",
  "Agente IA 24/7",
  "Rediseño o mantenimiento",
  "Aún no lo sé",
] as const;

/* ------------------------------------------------------------------ */
/* Agente IA ("Asistente Vantgard")                                    */
/* ------------------------------------------------------------------ */

export const assistant = {
  name: "Asistente Vantgard",
  greeting:
    "Hola, soy el asistente de Vantgard Systems. Te ayudo con precios, tiempos y con la demo sin anticipo. ¿Qué tipo de negocio tienes?",
  disclosure: "Estás hablando con un asistente de IA. No compartas datos sensibles.",
  /** Máximo de mensajes del usuario por sesión (cuida la cuota de Gemini). */
  maxMessagesPerSession: 15,
  /** Máximo de caracteres por mensaje. */
  maxMessageLength: 500,
  quickReplies: [
    "¿Cuánto cuesta una página?",
    "Quiero una tienda en línea",
    "¿Cómo funciona la demo sin anticipo?",
    "Hablar por WhatsApp",
  ],
  /** Reglas extra de comportamiento para el prompt de sistema. */
  rules: [
    "Responde en español de México, con tono amable, directo y vendedor.",
    "Respuestas cortas: máximo 3 o 4 oraciones, sin listas largas.",
    "Usa únicamente los precios de este documento. Si no hay un precio, di que se define en el diagnóstico gratis.",
    "Todos los precios son 'desde' y el precio final se confirma tras el diagnóstico.",
    "Si la persona muestra interés, pídele su nombre y su WhatsApp, y ofrécele abrir el cotizador (/cotizar).",
    "No pidas ni aceptes datos sensibles (salud, datos bancarios, contraseñas).",
    "Si preguntan algo ajeno a Vantgard Systems, redirige con amabilidad a cómo podemos ayudar a su negocio.",
    "Nunca prometas fechas exactas ni resultados de ventas garantizados.",
  ],
  /** Respuestas del modo demo (cuando no hay GEMINI_API_KEY). */
  demoReplies: {
    precio:
      "Una landing arranca desde $4,900 MXN, un sitio profesional desde $9,900 y una tienda en línea desde $16,900. El precio final se confirma tras un diagnóstico gratis. ¿Quieres que abramos el cotizador para darte un estimado?",
    tienda:
      "Una tienda en línea arranca desde $16,900 MXN con catálogo, carrito, pagos con tarjeta e inventario para 30 productos. ¿Cuántos productos manejas y cómo te llamas? Así te doy un estimado más preciso.",
    demo:
      "Hacemos una demo real de tu página en un servidor de prueba (Sandbox), sin anticipo y sin tocar tu sitio actual. La ves funcionando y decides. Si no te convence, no pagas nada. ¿Me compartes tu nombre y tu WhatsApp para agendar el diagnóstico gratis?",
    citas:
      "El sistema de citas deja que tus clientes agenden solos, con confirmación y recordatorio. Como extra cuesta desde $4,500 MXN, o desde $12,900 con todo y sitio. ¿Qué tipo de negocio tienes?",
    agente:
      "El agente IA atiende tu página las 24 horas, responde dudas, filtra prospectos y te avisa por WhatsApp. Como extra cuesta desde $6,900 MXN. ¿Te interesa sumarlo a un sitio nuevo o al que ya tienes?",
    tiempo:
      "La entrega normal es de 10 a 15 días hábiles desde que apruebas la demo. La Express es de 5 a 7 días con un 30 % adicional. ¿Para cuándo necesitas tu página?",
    pago:
      "Aceptamos transferencia (SPEI) y tarjeta. Normalmente es 50 % al aprobar la demo y 50 % antes de publicar. La demo no requiere anticipo.",
    whatsapp: "Claro. Toca el botón de abajo y seguimos por WhatsApp con una persona del equipo.",
    fallback:
      "Te puedo ayudar con precios, tiempos de entrega y la demo sin anticipo. Si prefieres un estimado exacto, el cotizador te lo da en un minuto. ¿Qué tipo de negocio tienes?",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Utilidades de formato                                               */
/* ------------------------------------------------------------------ */

export function formatMXN(amount: number): string {
  return `$${Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
}
