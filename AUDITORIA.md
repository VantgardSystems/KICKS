# Auditoría · Solenna (Fase 1)

Fecha: 9 de noviembre de 2026 · Alcance: todo el zip recibido (la web original está en la raíz del repo, en el commit `e375230`).

> Este documento es solo análisis. **No se ha cambiado nada de la web todavía.** Espero tu OK para empezar la Fase 2.

---

## 0. Antes de empezar

### 0.1 Qué leí

`index.html`, `styles.css`, `main.js`, `calculadora.html`, `calculadora.css`, `calculadora.js`, `calculadora-calc.js`, `calculadora-config.js`, `lib/manifest.js`, `lib/chat-widget.js`, `lib/leaflet/*` (librería de terceros, sin cambios), `aviso-legal.html`, `privacidad.html`, `cookies.html`, `legal.css` y las 14 imágenes de `assets/img/`.

### 0.2 Avisos importantes

| | Aviso | Consecuencia |
|---|---|---|
| ⚠️ | **`lumen-roof.html` no llegó.** Solo se adjuntó el zip de Solenna (el mensaje dice “Esa es la web de inspiración”, pero no hay un segundo archivo). | La Fase 4 trae la especificación completa (5 capas, shader, tiempos, colores), así que puedo **reconstruir el hero desde la especificación**. Si quieres fidelidad exacta con Lumen Roof (proporciones del tilt-shift, curvas de color-mix), envíamelo antes de la Fase 4. |
| ⚠️ | **El zip no incluye el backend.** La calculadora llama a `factura.php` (lectura del recibo con IA), `geo.php` (buscador de direcciones), `pvgis.php` (radiación solar) y `lead.php` (guardar el contacto). El chat llama a un Cloudflare Worker sin dirección (`data-endpoint=""`). También falta `PLAN-TECNICO.md`, citado en los comentarios. | Puedo adaptar todo el **frontend** a CFE. La **lectura del recibo de CFE con IA** depende del prompt que vive en `factura.php`: dejaré el contrato nuevo documentado (campos que el frontend espera) para que lo actualices en el servidor. Lo mismo para el prompt del chat. |
| ⚠️ | **El formulario de contacto no envía nada.** `main.js` hace `preventDefault()`, muestra “¡Recibido!” y deja un `// TODO: conectar con el sistema de envío real`. El `action="mailto:"` nunca se usa. | **Hoy se pierden todos los contactos del formulario de la portada.** Es el problema con más impacto en ventas de toda la auditoría (ver §6, decisión 3). |
| ⚠️ | **`index.html` lleva un documento HTML duplicado.** Empieza con `<!doctype html><html><head><style>…</style></head><body>` y dentro vuelve a abrir `<!doctype html><html lang="es"><head>…`. Parece un artefacto de exportación. | El `<title>`, la meta description, Open Graph y las hojas de estilo quedan dentro de `<body>`. Lighthouse marca “Document does not have a meta description”. Se corrige en la Fase 2. |

### 0.3 Skills

Todas las skills pedidas están instaladas y las cargué antes de esta fase: `design-critique`, `ux-audit`, `accessibility-audit` y `ux-writing`. Para las fases siguientes también están disponibles: `ui-ux-pro-max-skill`, `frontend-design`, `design-elevation`, `colour-palette`, `typography`, `spacing`, `motion`, `reduced-motion`, `transitions`, `viewports`, `keyboard`, `forms`, `labels`, `errors`, `verbs`, `loaders` y `anti-slop`. El conector de **Higgsfield está activo** (`generate_image`, `remove_background`). Figma, Adobe y AnimatedWebs fallaron al conectar, pero no hacen falta.

`ux-audit`: no hay `.ux-profile.md` en el proyecto, así que uso los valores por defecto del catálogo (WCAG 2.1 AA, tono utilitario). La excepción de glassmorphism que pediste se respeta como decisión de marca.

### 0.4 Medición de partida (evidencia)

Servidor local sin compresión, Chromium sin interfaz. Lighthouse en modo móvil.

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `index.html` | **84** | 91 | 96 | 91 | 3.8 s | 0.006 |
| `calculadora.html` | 90 | 96 | 100 | 100 | 2.7 s | 0.085 |

- **axe-core** (1280 px, con todas las animaciones terminadas): `index.html` 34 fallos de contraste; `calculadora.html` 3; `privacidad.html` 0.
- **Scroll horizontal**: ninguno a 375, 768, 1280 ni 1600 px en index, calculadora ni privacidad.
- **Teclado**: el orden de tabulación es lógico y el foco usa el contorno por defecto del navegador (visible, pero sin estilo propio).

---

## 1. Inventario de contenido (para verificar al final que no se pierde nada)

Cada elemento tiene un código. En la Fase 6 revisaré los códigos uno por uno. “→” indica a dónde va en el rediseño cuando cambia de sitio o de redacción.

### 1.1 `index.html` · cabecera del documento

- **H-01** Título: “Solenna · Paneles solares para tu casa, sin sorpresas en la factura” → “…sin sorpresas en el recibo de luz”.
- **H-02** Meta description (España) → texto de la Fase 2.
- **H-03** Open Graph: título “Solenna · Energía solar para tu casa” y descripción “Produce tu propia energía y deja de depender del precio de la luz.” (faltan imagen, URL y locale).
- **H-04** `theme-color` #06141c y favicon SVG (sol verde lima) → favicon con sol amarillo `--sun-400`.

### 1.2 Pantalla de carga, efectos globales y navegación

- **G-01** Pantalla de carga: sol, “Solenna” y contador 00→100 %.
- **G-02** Textura de grano animada y cursor personalizado con anillo.
- **N-01** Logo “Solenna” (SVG de sol) con enlace a `#top`.
- **N-02** Enlaces: Ventajas (`#ventajas`) · Calculadora (`calculadora.html`) · Cómo trabajamos (`#proceso`) · Opiniones (`#opiniones`).
- **N-03** Botón “Estudio gratuito →” (`#contacto`).
- **N-04** Menú móvil: Ventajas · Calculadora de ahorro · Cómo trabajamos · Opiniones · Contacto.
- **N-05** La barra se oculta al bajar y vuelve al subir; fondo al pasar 40 px.

### 1.3 Hero

- **R-01** Foto `casa-panoramica` (escritorio) / `casa-atardecer` (celular). Texto alternativo: “Vivienda unifamiliar blanca con paneles solares negros en el tejado al atardecer, rodeada de olivos” → se sustituye por la escena Mañana/Noche (Fase 4).
- **R-02** Lienzo de partículas de luz con rayos diagonales → sustituido por la niebla WebGL.
- **R-03** Antetítulo: “Instalación solar residencial · Estudio sin compromiso”.
- **R-04** H1: “La luz más barata / es la que produces / tú mismo.” → 2 líneas con tratamiento bicolor (Fase 4).
- **R-05** Entrada: “Paneles solares en tu tejado, llave en mano. Diseñamos, tramitamos e instalamos tu sistema para que reduzcas **hasta un 70%** tu factura desde el primer mes y dejes de mirar el precio de la luz.” → se divide en subtítulo + texto bajo el toggle (Fase 4), con vocabulario de México.
- **R-06** Botones: “Quiero mi estudio gratis →” (`#contacto`) y “Calcula tu ahorro en 2 min” (`calculadora.html`).
- **R-07** Confianza: “4,9 ★★★★★ +600 reseñas” · “25 años de garantía” · “0 € de entrada · financiación” → tarjeta de cristal “4.9 ★★★★★ +600 reseñas · 25 años de garantía · $0 de enganche con financiamiento”.
- **R-08** Chip “Producción hoy · 18,4 kWh” con mini gráfica (el número sube solo cada 1.6 s) → “18.4 kWh producidos hoy” en el toggle.
- **R-09** Chip “−72% en la factura de la familia Ortega” → “−72% en el recibo” en el toggle.
- **R-10** Sello giratorio “ESTUDIO GRATIS ↓” y aviso “Desliza” (decorativos).

### 1.4 Cinta de ventajas

- **M-01** “Estudio técnico gratuito ✦ Tramitamos las subvenciones ✦ Instalación en 1 día ✦ Monitorización desde el móvil ✦ Compensación de excedentes ✦ Baterías opcionales ✦” → cinta de México (Fase 2), justo debajo del hero.

### 1.5 (01) Por qué ahora · manifiesto y cifras

- **F-01** Etiqueta “(01) — Por qué ahora”.
- **F-02** Manifiesto (las palabras se iluminan al hacer scroll; resalta “sol”, “gratis” y “conectamos”) → texto de México de la Fase 2.
- **F-03** Cifra “2.400 · hogares ya producen su propia luz” → “2,400”.
- **F-04** Cifra “72% · de ahorro medio en la factura” → “…en el recibo”.
- **F-05** Cifra “6–8 · años para amortizar la inversión” → [VERIFICAR con proyectos reales; en DAC suele ser menor].
- **F-06** Cifra “25 · años de garantía en paneles”.
- **F-07** Contadores animados al entrar en pantalla.

### 1.6 (02) Ventajas

- **V-00** Etiqueta “(02) — Ventajas”, H2 “Tu casa, convertida en tu propia central eléctrica.” y entrada “No vendemos paneles. Vendemos tranquilidad: saber cuánto vas a pagar cada mes, durante décadas.” → “cada bimestre”.
- **V-01** 01 “Hasta un 70% menos en tu factura” + texto + barras “Antes / Con Solenna (28%)” → texto de la Fase 2.
- **V-02** Foto `panel-detalle` con pie “Full black · Paneles que se integran en tu tejado, sin romper la estética de tu casa.” → “techo”.
- **V-03** 02 “Subvenciones y papeleo, cosa nuestra” → “Los trámites con CFE, cosa nuestra” (Fase 2).
- **V-04** 03 “25 años de garantía real”: “Paneles de primera marca con garantía de producción y nuestro propio servicio técnico, sin intermediarios.”
- **V-05** 04 “Revaloriza tu vivienda y el planeta” + anillo “A · certificado” → anillo “Fuera de tarifa DAC”; se quita la mención al certificado energético.
- **V-06** 05 “Todo bajo control desde el móvil”: “Mira en tiempo real cuánto produces, cuánto consumes y cuánto estás ahorrando hoy.” → “celular”.

### 1.7 (03) Mini calculadora

- **C-01** Fondo `barrio-atardecer`, etiqueta “(03) — Calcula tu ahorro”, H2 “Mueve la barra. Mira tu futuro.”
- **C-02** Texto “Indica cuánto pagas al mes de luz…” → “al bimestre”.
- **C-03** Nota “*Estimación basada en instalaciones medias de vivienda unifamiliar. El estudio gratuito te dará la cifra exacta.” → “casa sola”.
- **C-04** Barra 40–400 €/mes, valor inicial 120 → rango en pesos por bimestre.
- **C-05** Resultados: ahorro al año (1.037 €), ahorro en 25 años (37.800 €), CO₂ evitado al año (1.193 kg). Fórmula: recibo × 12 × 0.72; 25 años con subida del 3 % anual; 1.15 kg de CO₂ por € → recalcular en MXN y por bimestre.
- **C-06** Botón “Calcularlo con mi factura y mi tejado →” → “…con mi recibo y mi techo”.

### 1.8 (04) Cómo trabajamos

- **P-00** Etiqueta, H2 “De la primera llamada a tu primer kWh, en 4 pasos.” y entrada “Un único interlocutor de principio a fin. Sin subcontratas, sin letra pequeña.”
- **P-01** Banda de foto `equipo-instalando` (se desplaza al hacer scroll).
- **P-02** 01 “Estudio gratuito” · Día 1–2 · “Analizamos tu factura y tu tejado (incluso por satélite) y te enviamos una propuesta en 48 h.” → “recibo” y “techo”.
- **P-03** 02 “Diseño a medida” · Semana 1 · “Calculamos el número exacto de paneles para tu consumo. Ni uno más, ni uno menos.”
- **P-04** 03 “Instalación en un día” · Semana 2–3 · “Nuestro equipo propio instala, limpia y deja todo funcionando en una sola jornada.”
- **P-05** 04 “A ahorrar” · Para siempre · “Legalizamos la instalación, activamos la compensación y te enseñamos a usar tu app.” → texto de CFE de la Fase 2 + plazos [VERIFICAR en la zona].
- **P-06** Línea de progreso que se llena al hacer scroll.

### 1.9 (05) Escena familiar

- **E-01** Foto `familia-atardecer` (se expande a pantalla completa al hacer scroll).
- **E-02** Etiqueta “(05) — Lo que cambia”, H2 “Tu casa sigue siendo tu casa. Solo que ahora trabaja para ti.”
- **E-03** Texto “Lavadora a mediodía, aire acondicionado en agosto, la terraza encendida al anochecer. Sin mirar el reloj ni la factura.” → texto de la Fase 2.

### 1.10 (06) Opiniones

- **T-00** Etiqueta, H2 “Familias que ya no temen a la factura.” → “…al recibo de luz.”; botones anterior/siguiente; contador 01/04; avance automático cada 7 s; deslizar con el dedo; barra de progreso.
- **T-01** Marta y Javier Ortega · Chalet en Majadahonda · 10 paneles · −72 %.
- **T-02** Luis Herrero · Adosado en Valencia · 8 paneles + batería · −81 %.
- **T-03** Carmen Ruiz · Casa de campo en Córdoba · 12 paneles · −68 %.
- **T-04** Andrés y Paula Martín · Unifamiliar en Zaragoza · 9 paneles · −65 %.
- → Mismas personas, paneles y porcentajes, en León, Querétaro, San Miguel de Allende y Aguascalientes, con montos en pesos por bimestre, marcados como EJEMPLO.

### 1.11 (07) Contacto y formulario

- **K-01** Fondo `tejado-aereo`, etiqueta “(07) — Contacto”, H2 “Hablemos de tu tejado.” → “…de tu techo.”
- **K-02** Texto “Déjanos tus datos y un asesor te llamará en menos de 24 horas laborables con un estudio personalizado. Sin compromiso y sin presión comercial.”
- **K-03** Teléfono gratuito 900 000 000 · Email hola@solenna.es · Horario “Lunes a viernes · 9:00 – 20:00” → teléfono [10 DÍGITOS], WhatsApp +52 [10 DÍGITOS], hola@solenna.mx [VERIFICAR], mismo horario.
- **K-04** Tarjeta “¿Prefieres una cifra ya? Sube tu factura y marca tu tejado: tu ahorro en 2 minutos →”.
- **K-05** Campos: `nombre`, `telefono`, `codigo_postal`, `email` (opcional).
- **K-06** “¿Cuánto pagas de luz al mes?”: < 60 € · 60–120 € (marcado) · 120–200 € · > 200 € → rangos por bimestre de la Fase 2.
- **K-07** “Tipo de vivienda”: Chalet independiente (marcado) · Adosado / pareado · Otra → Casa sola · Casa en privada o fraccionamiento · Otra.
- **K-08** Nueva pregunta “¿Tu recibo dice tarifa DAC?”: Sí · No · No sé.
- **K-09** Casilla “Acepto la política de privacidad y que me contactéis para enviarme el estudio.”
- **K-10** Botón “Solicitar estudio gratuito →”, mensaje de error y confirmación “¡Recibido! Un asesor te llamará en menos de 24 h laborables. Mientras, ve buscando una foto de tu última factura.” → “…ten a la mano una foto de tu último recibo de CFE.”

### 1.12 Pie de página

- **Z-01** “El sol sale para todos. Que también pague tu luz.” + botón “Empezar ahora →”.
- **Z-02** Palabra gigante “Solenna”.
- **Z-03** “© 2026 Solenna Energía S.L.” → “© 2026 Solenna Energía S.A. de C.V.” [VERIFICAR razón social].
- **Z-04** Enlaces legales: Aviso legal · Privacidad · Cookies → Términos · Aviso de privacidad · Cookies.
- **Z-05** “Volver arriba ↑”.

### 1.13 Datos y scripts compartidos

- **D-01** `lib/manifest.js`: nombre, lema, teléfono, email y parámetros de la mini calculadora.
- **D-02** `main.js`: 18 funciones (pantalla de carga, palabras del titular, aparición al hacer scroll, contadores, manifiesto, nav, cursor, botones magnéticos, inclinación 3D, parallax, lienzo, producción “en vivo”, mini calculadora, línea de pasos, escena, desplazamiento de fotos, testimonios, formulario).

### 1.14 `calculadora.html` (5 pasos)

- **Q-01** Cabecera: logo, “← Volver a la web”, “Estudio gratuito”. Título y descripción propios.
- **Q-02** Intro: “Calculadora de ahorro solar · 2 minutos · gratis”, H1 “Descubre cuánto ahorrarías con placas solares en tu casa” y entrada.
- **Q-03** Barra de progreso: Factura · Ubicación · Tejado · Cálculo · Informe → Recibo · Ubicación · Techo · Cálculo · Informe.
- **Q-04** Aviso `<noscript>` con enlace al formulario.
- **Q-05** **Paso 1** “Sube tu factura de la luz”: zona para soltar archivo (JPG, PNG o PDF de hasta 10 MB), estado “Leyendo tu factura…”, campos (gasto mensual €, consumo mensual kWh, precio €/kWh, término fijo €/mes, potencia kW, comercializadora), “No tengo la factura a mano · escribir mi gasto”, nota de privacidad (Gemini y, si falla, Claude) → “Sube tu recibo de CFE”: consumo del bimestre (kWh), tarifa (1, 1A–1F o DAC), total a pagar y periodo.
- **Q-06** **Paso 2** “¿Dónde está tu casa?”: buscador con autocompletado (`geo.php`), “📍 Usar mi ubicación actual”, alternativa “Elige tu provincia” (52 provincias) → “Elige tu estado” (32 estados) y mapa centrado en México.
- **Q-07** **Paso 3** “Dibuja tu tejado”: mapa satélite (PNOA o Esri), dibujo por esquinas, arrastrar puntos, Deshacer/Borrar, área en m² y kWp, alternativa con m² escritos → “Dibuja tu techo”.
- **Q-08** **Paso 4** animación “Calculando tu ahorro…” con 4 pasos.
- **Q-09** **Paso 5** muro de email (email, teléfono opcional, consentimiento, novedades opcionales, campo trampa contra bots) → `lead.php`.
- **Q-10** Informe: ahorro anual y mensual, % cubierto, paneles, kWp, producción anual, inversión (“IVA incluido, antes de ayudas”), años de recuperación, ahorro neto a 25 años, CO₂, cuota de financiación (120 meses), barras hoy/con paneles, gráfica a 25 años, oferta semanal, “Pedir mi estudio gratis”, “Repetir el cálculo” y “¿Cómo lo calculamos?” (7 puntos + nota de IRPF e IBI).
- **Q-11** Recuadro “Información de privacidad (RGPD)” → aviso de privacidad simplificado (LFPDPPP).
- **Q-12** Pie con enlaces legales, “© 2026 Solenna Energía S.L. · Cálculo orientativo, no vinculante.” y créditos (IGN, Esri, OpenStreetMap, PVGIS).
- **Q-13** Memoria de la pestaña (`solenna_calc_v1`), reenvío de contactos pendientes (`solenna_lead_pendiente`), restauración del paso al recargar.

### 1.15 Páginas legales

- **L-01** `aviso-legal.html`: 7 apartados (quiénes somos, objeto, calculadora y asistente, propiedad intelectual, responsabilidad, datos y cookies, legislación) → `terminos.html` “Términos y condiciones”.
- **L-02** `privacidad.html`: 8 apartados + tabla de 8 proveedores → “Aviso de privacidad integral” (LFPDPPP 2025).
- **L-03** `cookies.html`: 5 apartados + tabla de 3 almacenamientos → política de cookies sencilla de México.

### 1.16 Chat

- **X-01** Botón “¿Tienes dudas?”, cabecera “Asistente Solenna · Resuelvo tus dudas sobre placas solares”.
- **X-02** Bienvenida y 3 sugerencias (techo plano, cuántos paneles, días nublados).
- **X-03** Mensajes de respaldo (sin servidor o sin conexión), botón de WhatsApp (“Hola, tengo una duda sobre placas solares”) o “Pedir estudio gratuito”, nota “Las respuestas son orientativas…”.
- **X-04** Historial de 10 mensajes, Markdown seguro, Escape para cerrar.

---

## 2. Lo que le falta (ordenado por impacto en ventas)

“Qué haré” usa solo datos que ya existen en la web. Donde falta un dato real dejo un marcador visible **[DATO REAL: …]**.

| # | Falta | Por qué importa para vender | Qué haré (tras tu OK) |
|---|---|---|---|
| 1 | **El formulario no envía** (§0.2) | Cada contacto que llega a la portada se pierde. | Conectarlo según la decisión 3 de §6. Mientras no haya servidor: abrir WhatsApp con los datos ya escritos, para no perder el contacto. |
| 2 | **Botón de WhatsApp visible** | En México la mayoría de los contactos de servicios para el hogar llegan por WhatsApp. Hoy no aparece en ningún sitio (`data-whatsapp=""`). | Botón flotante y enlace en Contacto con `wa.me/52[10 DÍGITOS]` y un mensaje ya escrito. |
| 3 | **Llamada a la acción fija en celular** | En celular el botón “Estudio gratuito” desaparece al bajar; solo queda la burbuja del chat. | Barra inferior fija con “Estudio gratis” + WhatsApp, coordinada con el chat para que no se tapen. |
| 4 | **Preguntas frecuentes** | Las dudas de CFE frenan la decisión. No hay ninguna sección de preguntas frecuentes. | Sección nueva antes de Contacto: CFE y medidor bidireccional, tarifa DAC, interconexión y plazos, granizo, mantenimiento, financiamiento, nublados y techo plano (las sugerencias del chat). Las cifras normativas llevan [VERIFICAR]. |
| 5 | **Financiamiento** | Se promete “$0 de enganche” sin plazo, tasa ni financiera. | Bloque con lo que ya existe ($0 de enganche, cuota estimada en la calculadora) + [VERIFICAR con la financiera: tasa, plazo, CAT] + [DATO REAL: financiera]. |
| 6 | **Detalle de garantías** | “25 años” sin desglose genera desconfianza. | Desglose: paneles 25 años (dato existente), garantía de producción (existente), servicio técnico propio (existente) + [DATO REAL: años de garantía del inversor], [DATO REAL: garantía de instalación y mano de obra], [DATO REAL: garantía de impermeabilización del techo]. |
| 7 | **Galería de instalaciones reales** | Todas las fotos están generadas con IA (lo dice el aviso legal). No hay ni una instalación real. | Rejilla de 6 huecos con [DATO REAL: foto de instalación, ciudad, kWp] en lugar de inventarlas. |
| 8 | **Prueba social verificable** | “+600 reseñas” no enlaza a ningún sitio y los testimonios son de ejemplo. | Testimonios marcados EJEMPLO en el código + [DATO REAL: enlace a reseñas de Google]. |
| 9 | **Logos de marcas de paneles e inversores** | “Paneles de primera marca” sin nombres. | Franja de logos con [DATO REAL: marcas de paneles] y [DATO REAL: marcas de inversores]. |
| 10 | **Zona de cobertura** | No dice en qué estados instala; los testimonios apuntan al Bajío. | Bloque en Contacto: [DATO REAL: estados y ciudades donde instalamos]. |
| 11 | **Certificaciones del equipo** | Señal de confianza habitual en México (p. ej. el estándar de competencia EC0586 para instalación fotovoltaica residencial). | [DATO REAL: certificaciones del equipo instalador]. |
| 12 | **JSON-LD** `LocalBusiness` y `FAQPage` | Sin datos estructurados no hay ficha enriquecida en Google. | `LocalBusiness` con dirección en México ([DATO REAL: domicilio]) y `FAQPage` generado desde la sección de preguntas. |
| 13 | **Canonical y Open Graph completos** | Al compartir por WhatsApp sale sin imagen. | `canonical`, `og:url`, `og:image` (foto de mañana del hero), `og:locale=es_MX`, Twitter card. |
| 14 | **Baterías** | La cinta dice “Baterías opcionales”, pero no se explica en ningún sitio. | Una pregunta frecuente con lo existente + [DATO REAL: marca y capacidad de las baterías]. |
| 15 | `robots.txt`, `sitemap.xml`, `favicon.ico` | Lighthouse registra un 404 en consola por `favicon.ico`. | Añadir los tres. |

---

## 3. Problemas de UX, accesibilidad, rendimiento y SEO

Severidad: **C** crítico · **A** alto · **M** medio · **B** bajo. La columna “Skill” dice qué skill lo detectó.

### 3.1 Críticos

| # | Problema | Evidencia | Skill | Arreglo |
|---|---|---|---|---|
| C1 | El formulario de la portada no envía y aun así dice “¡Recibido!” | `main.js` `initForm` → `// TODO`, `ok.hidden = false` | design-critique (H1 visibilidad del estado, buena voluntad), ux-writing (lente “responsable”) | Envío real + estado de carga + error con alternativa (WhatsApp). |
| C2 | Documento HTML duplicado en `index.html`: meta y estilos dentro de `<body>` | Lighthouse SEO “no meta description”; `document.head` sin description | accessibility-audit (estructura HTML) | Un solo documento válido. |
| C3 | Manifiesto ilegible hasta hacer scroll: palabras apagadas a 1.52:1 | axe: 32 nodos `.w` (#2a363b sobre #05121a) | accessibility-audit (WCAG 1.4.3) | Palabras apagadas a ≥ 4.5:1 y encendidas a contraste máximo; con movimiento reducido, todo encendido. |
| C4 | Botón del chat sin nombre accesible en celular (≤ 480 px se oculta el texto) | Lighthouse `button-name` en `.sc-launch` | accessibility-audit (WCAG 4.1.2) | `aria-label` permanente. |

### 3.2 Altos

| # | Problema | Evidencia | Skill | Arreglo |
|---|---|---|---|---|
| A1 | Pantalla de carga de 1.4 s como mínimo antes de ver la web | `initSplash` `minTime 1400`; LCP 3.8 s | design-critique (Krug: “sizzle blocking content”), motion | Quitarla: el hero es la primera impresión. |
| A2 | Movimiento reducido incompleto: el CSS dice “solo se apagan los efectos intrusivos”; siguen el titular palabra por palabra, las apariciones, los contadores, la cinta (solo más lenta) y los testimonios automáticos | `styles.css` línea 661, `main.js` | reduced-motion, accessibility-audit (WCAG 2.2.2 y 2.3.3) | Con `prefers-reduced-motion`: sin bucles, cinta quieta, sin avance automático, apariciones solo con opacidad o instantáneas. |
| A3 | Carrusel de opiniones con avance automático cada 7 s, sin pausa y sin detenerse al pasar el cursor o el foco | `initTestimonials` | accessibility-audit (WCAG 2.2.2), keyboard | Botón de pausa, pausa con cursor o foco y `aria-live="polite"` solo al cambiar a mano. |
| A4 | Etiquetas de sección en verde sobre fondo claro a 3.09:1 (texto de 12 px) | axe `.section-head > .label` #2f9e6f sobre #f5f6f0 | accessibility-audit, colour-palette | Nueva paleta: el verde solo para cifras de ahorro, en tamaño grande o sobre marino. |
| A5 | Validación solo al enviar; un único mensaje genérico (“Revisa: nombre, teléfono.”) sin relación con cada campo | `initForm`; no hay `aria-invalid` ni `aria-describedby` | forms, errors, accessibility-audit (WCAG 3.3.1) | Validar al salir del campo, limpiar al editar, mensaje debajo de cada campo y foco al primer error. |
| A6 | Etiquetas flotantes (`placeholder=" "` y la etiqueta encima): al escribir se encogen a 11 px | `.field label` scale(.76) | labels, typography | Etiqueta visible fija encima del campo; el placeholder solo como ejemplo de formato. |
| A7 | Menú móvil: no mueve el foco, no se cierra con Escape y el botón siempre dice “Abrir menú” | `initNav` | keyboard, accessibility-audit (WCAG 2.4.3) | Foco al primer enlace, Escape, devolver el foco al botón y etiqueta “Cerrar menú”. |
| A8 | Oferta con urgencia artificial: la cuenta atrás siempre termina el domingo y “quedan 6 instalaciones” es fijo | `renderOffer` calcula la fecha desde hoy | ux-writing (lente “responsable”), design-critique (buena voluntad) | Solo con promoción real y fecha de vigencia en la config; si no, se oculta (lo pide la Fase 2). Riesgo de publicidad engañosa ante PROFECO. |
| A9 | Rendimiento móvil 84: tres familias tipográficas de Google con 8 pesos, pantalla de carga, imagen del hero con `decoding="async"` y 3–4 bucles `requestAnimationFrame` permanentes (cursor, parallax, lienzo) | Lighthouse: FCP 2.6 s, LCP 3.8 s | ux-audit (evidencia), motion | Fuentes propias en woff2 (Instrument Sans 400/500/600 + JetBrains Mono 400) con `preload`; precarga de la imagen de mañana; un solo rAF para el hero que se pausa fuera de pantalla. |
| A10 | Sin enlace “Saltar al contenido” | no existe `a[href="#main"]` | accessibility-audit (WCAG 2.4.1) | Añadirlo. |

### 3.3 Medios

| # | Problema | Evidencia | Skill | Arreglo |
|---|---|---|---|---|
| M1 | La barra de la mini calculadora anuncia “120” sin unidad y repite la etiqueta (`aria-label` + `<label>`) | `#bill` | accessibility-audit (WCAG 4.1.2) | `aria-valuetext="$2,400 al bimestre"`, una sola etiqueta. |
| M2 | Las estrellas “★★★★★” se leen como “estrella negra” cinco veces | `.hero__trust` | accessibility-audit | `aria-label="4.9 de 5 estrellas"` y estrellas con `aria-hidden`. |
| M3 | La cinta duplica su contenido: el lector de pantalla lo lee dos veces; `aria-label` en un `div` sin rol | `.marquee` | accessibility-audit | Copia duplicada con `aria-hidden` y lista accesible única. |
| M4 | La producción “en vivo” sube sin parar (18,4 → 18,5 → …) aunque no está conectada a nada | `initLive` | ux-writing (responsable), design-critique (H2) | Valor fijo “18.4 kWh producidos hoy”, como pide la Fase 4. |
| M5 | Cursor personalizado, botones magnéticos (el objetivo se mueve bajo el puntero) e inclinación 3D en tarjetas | `initCursor`, `initMagnetic`, `initTilt` | anti-slop, design-critique (ley de Fitts), motion | Quitar; dejar un hover sutil con `transform` y opacidad. |
| M6 | Grano animado a pantalla completa (repinta sin parar) | `.grain` `animation: grain 1.2s infinite` | anti-slop, motion | Quitar. |
| M7 | Etiquetas en MAYÚSCULAS con espaciado amplio (mono 11–12 px) en etiquetas, pasos y pies | `.label`, `.step__t`, `.card__cap span`, `.contact__list small` | typography (y tu brief: “sin etiquetas en mayúsculas”) | Minúsculas normales, Instrument Sans 500. |
| M8 | Muro de email antes del informe con una gráfica señuelo difuminada | `onEnter[5]`, `decoySerie` | design-critique (buena voluntad, excise) | No cambio la lógica (regla de la Fase 5). Propuesta: mostrar el ahorro anual antes del muro y pedir el email para el desglose. |
| M9 | Chat como `role="dialog"` sin `aria-modal` ni foco atrapado; la paleta del chat es la antigua (pino y lima) | `chat-widget.js` | keyboard, accessibility-audit | `aria-modal`, foco atrapado, devolver el foco al botón y nueva paleta. |
| M10 | Texto sobre fotos sin capa que garantice contraste (entrada del hero en blanco al 64 % sobre la foto) | captura a 375 px | accessibility-audit (manual: axe no mide texto sobre imagen) | Cristal con fondo opaco de respaldo detrás del texto. |
| M11 | Letra pequeña de la calculadora a 4.1:1 (12.5 px) | axe `#privacidad > .fine`, `.foot__credits` | accessibility-audit | Subir a ≥ 4.5:1. |
| M12 | CLS 0.085 en la calculadora (el paso que aparece y la barra de progreso empujan el contenido) | Lighthouse | viewports | Reservar alto mínimo para los pasos. |
| M13 | Manifiesto y cifras sin encabezado; la sección no tiene título para lectores de pantalla | `section.manifesto` | accessibility-audit (WCAG 1.3.1) | `aria-labelledby` con la etiqueta “Por qué ahora”. |

### 3.4 Bajos

- **B1** Sin `robots.txt`, `sitemap.xml` ni `favicon.ico` (404 en consola). · Lighthouse.
- **B2** CSS y JS sin minificar, sin compresión ni caché (depende del servidor). Propongo un `.htaccess` para Hostinger con gzip/brotli y caché larga. · Lighthouse.
- **B3** Emojis en la interfaz (“🔒”, “📍”, “🔥”). · anti-slop. Se sustituyen por iconos SVG.
- **B4** Contraste del contador “/ 04” a 4.41:1. · accessibility-audit.
- **B5** Sello giratorio “ESTUDIO GRATIS” y aviso “Desliza”: no aportan información. · anti-slop, design-critique (H8).

### 3.5 Puerta de calidad de `ux-audit` (estado actual)

| # | Control | Estado | Evidencia |
|---|---|---|---|
| 1 | Estética prohibida | ❌ | Grano, cursor personalizado, sello giratorio, emojis. El glassmorphism queda exceptuado por tu decisión de marca. |
| 2 | Modal donde tocaba panel lateral o edición en línea | ✅ | No hay modales de edición. |
| 3 | Renombrar sin mover la fila siguiente | n/a | No hay edición en línea. |
| 4 | Acciones destructivas con confirmación | ✅ | “Borrar” en el mapa es reversible con “Deshacer”. |
| 5 | Botones que empiezan con verbo y sin culpar al usuario | ⚠️ | “Ese formato no vale”, “Empezar ahora”, “A ahorrar”. Ver §3.6. |
| 6 | Validación al salir del campo y limpieza al editar | ❌ | Portada: solo al enviar. Calculadora: al escribir. |
| 7 | Movimiento con tokens de transform/opacidad y movimiento reducido respetado | ❌ | A2. |
| 8 | Patrón de página declarado | ✅ | Landing de marketing + asistente por pasos. |
| 9 | Sin scroll horizontal a 375 px y objetivos táctiles suficientes | ✅ | Medido a 375, 768, 1280 y 1600 px. |
| 10 | Acabado visual | ⚠️ | Correcto y cuidado, pero con estética de plantilla “agencia oscura”; no transmite marca energética premium. |

### 3.6 Propuestas de redacción (ux-writing) — **solo propuesta, no se aplican**

Fuera de los cambios de la Fase 2 no toco textos. Estas son mejoras que puedes aprobar o descartar:

| Dónde | Actual | Propuesta | Motivo |
|---|---|---|---|
| Botón del formulario | “Solicitar estudio gratuito” | “Pedir mi estudio gratis” | Mismo verbo y forma que “Quiero mi estudio gratis”; terminología única (“gratis” en todas partes). |
| Pie | “Empezar ahora” | “Pedir mi estudio gratis” | No dice qué empieza. |
| Paso 4 del proceso | “A ahorrar” | “Conexión con CFE y a ahorrar” | Describe lo que pasa en el paso. |
| Calculadora, botones | “Continuar” | “Continuar a ubicación” / “Continuar a tu techo” | Anticipa el siguiente paso. |
| Calculadora, error | “Ese formato no vale.” | “No podemos leer ese tipo de archivo. Sube una foto (JPG o PNG) o un PDF.” | Sin culpa y con salida. |
| Calculadora, error | “No hemos podido leer la factura.” | “No pudimos leer tu recibo. Escribe el total del bimestre y seguimos.” | Pretérito simple de México + salida en la misma frase. |
| Hero | “Desliza” | (quitar) | Indicador decorativo. |
| Mini calculadora | “Mueve la barra. Mira tu futuro.” | “Mueve la barra y mira cuánto ahorras.” | Más concreto. Opcional. |
| Oferta | “🔥 Oferta de esta semana” | “Promoción vigente hasta el [fecha]” | Sin emoji ni urgencia genérica. |
| Contacto | “Sin compromiso y sin presión comercial.” | (mantener) | Ya es buena. |

---

## 4. Lo que está pensado para España y debe cambiar para México

### 4.1 Formato

| Qué | Hoy | México |
|---|---|---|
| Idioma | `<html lang="es">` | `lang="es-MX"` en las 5 páginas |
| Miles y decimales | `fmt()` con punto de miles y coma decimal (`2.400`, `18,4`, `4,9`, `1.037 €`) en `main.js` y `calculadora.js` | `Intl.NumberFormat('es-MX')`: `2,400` · `18.4` · `4.9` · `$1,037` |
| Moneda | € después de la cifra | `$` antes, MXN; “MXN” explícito en inversión e informe |
| Periodo | mensual en todo | **bimestral** para el usuario (recibo de CFE); mensual solo dentro del cálculo |
| Teléfono | `900 000 000`, validación `^[\d\s+]{9,}$`, ejemplo “600 000 000” | 10 dígitos (`^\d{10}$` sin espacios ni lada +52), `tel:+52…` |
| Código postal | 5 dígitos | 5 dígitos (se mantiene; mensaje propio) |

### 4.2 Vocabulario (web, calculadora y chat)

| España | México | Dónde aparece (n.º de líneas) |
|---|---|---|
| factura (de la luz) | recibo de luz / recibo de CFE | index (23), calculadora (16 en HTML, 19 en JS), privacidad, cookies, manifest, config |
| tejado | techo | index (11), calculadora (12 en HTML, 8 en JS), calc, chat, privacidad; nombre de imagen `tejado-aereo*.webp` |
| placas | paneles | calculadora, chat, informe |
| móvil | celular | cinta, ventaja 05, calculadora (“foto con el móvil”) |
| chalet | casa sola | formulario, testimonio |
| adosado / pareado | casa en privada o fraccionamiento | formulario, testimonio |
| financiación | financiamiento | hero, informe |
| 0 € de entrada | $0 de enganche | hero |
| compensación de excedentes | medición neta con CFE | cinta, proceso, informe |
| teletrabajo | home office | testimonio 2 |
| críos | niños | testimonio 4 |
| provincia | estado | calculadora (14 en JS, 4 en HTML, 12 en calc) |
| aire acondicionado en agosto | minisplit en mayo | escena |
| terraza | jardín | escena |
| monitorización | monitoreo | cinta |

### 4.3 Conjugación y giros de España

| Hoy | México |
|---|---|
| “que me **contactéis**” (vosotros) | “que me **contacten**” |
| “No **hemos podido** leer / procesar / obtener / cargar…” (4 veces) · “No **he podido** responder” · “No **se ha podido** cargar” | “No **pudimos**…” · “No **pude** responder” · “No **se pudo** cargar” |
| “**Pulsa** ‘Buscar’ / ‘Usar mi ubicación’ / ‘Calcular’” | “**Toca** o **da clic en**…” |
| “Ese formato no **vale**” | “No podemos leer ese tipo de archivo” |
| “Ya se lo **he recomendado**” | “Ya se lo **recomendé**” |

### 4.4 Eliminar (no aplica en México)

- **IBI** (ventaja 02, informe), **IRPF** (informe), **subvenciones, ayudas municipales y bonificaciones** (cinta, ventaja 02, testimonio 3, informe “antes de ayudas”).
- **Licencias y “legalización”** (ventaja 02, paso 04).
- **Certificado energético “A”** (ventaja 04).
- **Teléfono 900**, **“S.L.”**, NIF/CIF, Registro Mercantil.
- **Peajes y tramos horarios** del manifiesto (se sustituye por el texto de la Fase 2).
- Campos del recibo español: **término fijo (potencia)**, **potencia contratada**, **comercializadora**, **CUPS**.
- **Ortofoto PNOA del IGN** (solo cubre España): el código ya usa Esri fuera de España; se elimina la capa y su crédito.

### 4.5 Calculadora: de supuestos españoles a CFE

`calculadora-config.js` (cada valor nuevo llevará `// VERIFICAR con las tarifas CFE del mes`):

| Clave actual | Hoy (España) | México |
|---|---|---|
| `precioKwhDefecto` 0.18 €/kWh | precio plano | **bloques por tarifa**: tarifa 1 básico 0–75 kWh/mes ≈ $1.10, intermedio 76–140 ≈ $1.35, excedente ≈ $3.40; 1A–1F con sus límites de bloque [VERIFICAR] |
| `fijoMensualDefecto` 18 € | término de potencia | solo en **DAC**: ≈ $6.20/kWh + cargo fijo ≈ $142/mes |
| — | — | **límite DAC** (promedio mensual de 12 meses): 1=250, 1A=300, 1B=400, 1C=850, 1D=1000, 1E=2000, 1F=2500 kWh |
| `factorImpuestos` 1.27 | impuesto eléctrico + IVA 21 % | **1.16** (IVA 16 %; el DAP municipal aparte) |
| `costeBaseEur` 1,000 + `costeKwpEur` 1,150 | | **≈ $22,000 MXN por kWp** (rango 18–28 mil); base [VERIFICAR] |
| `wpPanel` 450 | | **550 W** |
| rendimiento por provincia (1,100–1,750 kWh/kWp) | 52 provincias | **32 estados**; horas sol pico ≈ 5.5 Bajío, 5 sureste, 6 norte |
| `co2KgPorKwh` 0.12 | mix español | **0.444** |
| `precioCompensacion` 0.06 €/kWh | compensación simplificada | **medición neta kWh por kWh con saldo a favor** [VERIFICAR esquema vigente con la nueva Ley del Sector Eléctrico] |
| `financiacionTin` 6.9 %, 120 meses | | [VERIFICAR con la financiera] |
| `oferta` 300 €, 6 plazas, cada semana | urgencia automática | en pesos, **solo con promoción real y fecha de vigencia**; sin fecha → oculta |
| — | | **tarifa DAC**: si con los paneles el promedio baja del límite, el cálculo muestra la salida de DAC y el regreso a la tarifa subsidiada |

Lógica que cambia (pedida en la Fase 2): el ahorro descuenta **primero los kWh más caros** (excedente → intermedio → básico, o el precio plano de DAC). Todo se pregunta y se muestra por bimestre. `calculadora.js`: textos del informe sin IRPF/IBI, “IVA incluido”, mapa centrado en México (zoom de estado), selector de 32 estados.

**Contrato con el backend** (lo actualizas tú en el servidor):
- `factura.php` debe leer un recibo de CFE y devolver consumo del bimestre (kWh), tarifa, total a pagar (MXN) y periodo. Hoy devuelve `gasto_mensual_eur`, `precio_kwh_eur`, `termino_fijo_mensual_eur`, `potencia_contratada_kw` y `comercializadora`.
- `geo.php` debe limitar la búsqueda a México (`countrycodes=mx` en Nominatim / `bbox` en Photon).
- `lead.php` recibirá `estado` y `tarifa` en lugar de `provincia` y `comercializadora`.
- `pvgis.php`: PVGIS cubre México con su base de datos para América; se mantiene, con la tabla por estado como respaldo.

### 4.6 Textos de la web con referencias españolas

- Placeholder de dirección “Ej. calle Girona 12, Barcelona” → ejemplo mexicano (“Ej. Blvd. Adolfo López Mateos 1200, León, Gto.”).
- Texto alternativo del hero “…rodeada de olivos”, `tejado` en tres textos alternativos.
- Las fotos de `assets/img` tienen estética mediterránea (teja árabe, olivos). Encajan con el Bajío colonial (San Miguel de Allende, Querétaro), pero no son mexicanas a propósito. Se mantienen como fondos detrás del cristal, como pediste; la casa del hero se genera de cero.

### 4.7 Legales

| Hoy | México (todo marcado “revisar con abogado”) |
|---|---|
| `aviso-legal.html` · LSSI-CE, legislación española, juzgados del consumidor | `terminos.html` “Términos y condiciones”: precios en MXN con IVA, garantías por escrito, datos del responsable, Ley Federal de Protección al Consumidor. `aviso-legal.html` redirige a `terminos.html` para no romper enlaces. |
| `privacidad.html` · RGPD, LOPDGDD, AEPD, transferencias UE–EE. UU., menores de 14 | “Aviso de privacidad integral” (LFPDPPP publicada el 20 de marzo de 2025): responsable y domicilio, datos que se recaban, finalidades primarias y secundarias, derechos ARCO, envío del recibo a proveedores de IA, transferencias y remisiones, autoridad: Secretaría Anticorrupción y Buen Gobierno. Mayores de edad (18). |
| Recuadro “Información de privacidad (RGPD)” en la calculadora | **Aviso de privacidad simplificado** junto al formulario y en la calculadora. |
| `cookies.html` · artículo 22.2 LSSI-CE | Política sencilla enlazada desde el aviso, sin referencia a la ley española. Se quita IGN de la lista de proveedores. |

### 4.8 Chat

- Sugerencias y textos fijos en español de México (techo, paneles, recibo, CFE).
- `data-whatsapp="52XXXXXXXXXX"` y mensaje “Hola, tengo una duda sobre paneles solares”.
- Las respuestas las genera el servidor del chat (no incluido). Propongo: (a) respuestas locales para CFE, DAC, interconexión y medición neta cuando no hay servidor, sacadas de la sección de preguntas frecuentes; (b) un archivo `chat-prompt-mx.md` con el prompt de sistema para tu Cloudflare Worker.

---

## 5. Plan de rediseño

### 5.1 Principios

1. **Nada se pierde.** Cada código del §1 se comprueba en la Fase 6.
2. **Nada se inventa.** Datos que faltan → [DATO REAL: …]; cifras normativas o de mercado → [VERIFICAR …].
3. **Fuera de la Fase 2, no se cambian textos, cifras, enlaces, nombres de campos ni lógica.** Las mejoras de redacción quedan en §3.6.
4. **Cristal solo donde hay algo detrás** (foto o degradado), con borde de 1 px ≥ 3:1, fondo opaco si no hay `backdrop-filter` y texto AA.
5. **Rendimiento como requisito:** Lighthouse ≥ 90 en las cuatro categorías.

### 5.2 Archivos (misma estructura + añadidos)

```
index.html · styles.css · main.js                 (rediseñados)
calculadora.html · calculadora.css · calculadora.js · calculadora-calc.js · calculadora-config.js
terminos.html (nuevo) · aviso-legal.html (redirige) · privacidad.html · cookies.html · legal.css
lib/manifest.js · lib/chat-widget.js · lib/leaflet/ (sin cambios)
lib/hero.js            (nuevo: escena Mañana/Noche + niebla WebGL2, un solo rAF)
assets/img/hero/       (nuevo: 6 imágenes webp de Higgsfield)
assets/fonts/          (nuevo: Instrument Sans y JetBrains Mono en woff2)
robots.txt · sitemap.xml · favicon.ico · .htaccess   (nuevos)
AUDITORIA.md · DESIGN.md · PENDIENTES.md · chat-prompt-mx.md · BACKEND-MX.md
```

### 5.3 Fases

| Fase | Entregable | Notas |
|---|---|---|
| **2 · México** | Textos, formatos, calculadora (bloques CFE, DAC, bimestre, 32 estados), formulario (10 dígitos, CP, DAC), legales, chat, SEO (JSON-LD, OG, canonical) y secciones nuevas del §2 con marcadores | Corrijo también el documento duplicado (C2) y el envío del formulario (C1, según decisión 3). |
| **3 · Sistema de diseño** | `DESIGN.md` + variables CSS (paleta, cristal, tipografía, espaciado de 4/8, movimiento) | Antes leo ui-ux-pro-max-skill, frontend-design, design-elevation, colour-palette, typography y spacing. |
| **4 · Hero** | Escena de 5 capas, niebla WebGL2, toggle con `aria-pressed`, cola de clics, versión ≤ 820 px y movimiento reducido | **Antes de generar imágenes te digo el costo en créditos de Higgsfield.** Compruebo que día y noche coincidan en encuadre y contorno; si no, regenero. |
| **5 · Resto de la web** | Todas las secciones en su orden actual, calculadora, legales y chat | Fotos de `assets/img` como fondo del cristal. Entradas suaves al hacer scroll, hover sutil y movimiento reducido. |
| **6 · Calidad** | anti-slop, accessibility-audit, ux-audit; AA; teclado; 375/768/1280/1600 px; Lighthouse ≥ 90; búsqueda de términos prohibidos; inventario | Resultado en `PENDIENTES.md` + resumen sencillo. |

### 5.4 Qué propongo quitar (efectos, no contenido)

Pantalla de carga (A1), grano (M6), cursor personalizado, botones magnéticos e inclinación 3D (M5), lienzo de partículas (lo sustituye la niebla), sello giratorio y “Desliza” (B5), titular palabra por palabra (lo sustituye la animación de la Fase 4) y la producción “en vivo” que sube sola (M4). **Se conservan**: config de la calculadora, mapa Leaflet, lectura de recibos con IA, chat, contadores, manifiesto iluminado, escena que se expande, línea de pasos, carrusel (con pausa) y validación/envío del formulario.

### 5.5 Secciones nuevas y dónde van (sin reordenar las existentes)

Hero → cinta → (01) manifiesto → (02) ventajas **+ desglose de garantías** + **franja de marcas** → (03) mini calculadora **+ bloque de financiamiento** → (04) proceso → (05) escena → **galería de instalaciones** → (06) opiniones → **preguntas frecuentes** → (07) contacto **+ zona de cobertura + WhatsApp** → pie. Más: botón flotante de WhatsApp y barra fija en celular.

### 5.6 Riesgos

- **Higgsfield**: lograr que la casa de día y la de noche coincidan al píxel es lo más delicado. Plan: generar la de noche usando la de día como referencia; si el contorno no coincide, regenerar o recortar la de noche con la máscara de la de día.
- **WebGL2**: sin soporte, niebla estática en CSS; la escena sigue funcionando.
- **Backend**: la lectura del recibo de CFE no funcionará hasta que actualices `factura.php`. El frontend tendrá la entrada manual como alternativa (ya existe).
- **Búsqueda de términos prohibidos**: sin distinguir mayúsculas, “IBI” aparece dentro de “v**isibi**lity” y “posibilidad”, y “900” en `leaflet.js`. La búsqueda de la Fase 6 será por palabra completa, distinguiendo mayúsculas en IBI e IRPF, excluyendo `lib/leaflet/` (librería de terceros) y los documentos de auditoría (que citan los términos a propósito).

### 5.7 Criterios de aceptación (Fase 6)

Contraste AA en todo el texto · foco visible y navegación completa con teclado · sin scroll horizontal a 375, 768, 1280 y 1600 px · Lighthouse ≥ 90 en rendimiento, accesibilidad, buenas prácticas y SEO · cero “€”, “IBI”, “IRPF”, “tejado”, “factura”, “provincia”, “S.L.” y “900” · todos los códigos del §1 presentes.

---

## 6. Decisiones que necesito de ti

1. **`lumen-roof.html`** — No llegó. ¿Lo reconstruyo desde la especificación de la Fase 4 *(recomendado: es suficientemente precisa)* o me lo envías?
2. **Nombres internos con “factura”/“provincia”** — Tu búsqueda final exige cero apariciones, pero la regla de la Fase 5 dice no cambiar nombres de campos, y el backend espera `factura.php`, el campo `factura` y claves como `gasto_mensual_eur`. *Recomendado:* renombrarlo todo (`recibo.php`, `recibo_bimestral`, `estado`, `tarifa`…) y documentar el contrato nuevo en `BACKEND-MX.md`, porque el backend hay que tocarlo de todos modos para leer recibos de CFE. *Alternativa:* conservar los nombres del backend como única excepción a la búsqueda.
3. **Envío del formulario de la portada** — *Recomendado:* enviarlo a `lead.php` (el mismo servidor que ya usa la calculadora) con `tipo: "contacto"`, y si falla, abrir WhatsApp con los datos escritos. *Alternativa:* otro destino (correo o CRM) que me indiques.
4. **Efectos que propongo quitar (§5.4)** — ¿De acuerdo? Ninguno lleva contenido; todos afectan el rendimiento o la accesibilidad.

Con tu OK (y las respuestas, o “usa lo recomendado”) arranco la Fase 2.
