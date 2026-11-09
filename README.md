# Ecowatt: página de paneles solares en León

Página de una sola pantalla para [ecowatt.mx](https://ecowatt.mx). Está diseñada primero para celular y su meta es que cada visita termine en una cotización por WhatsApp.

```
index.html               La página completa (HTML estático, sin build)
aviso-de-privacidad.html Aviso de privacidad integral (borrador para revisión legal)
assets/css/ecowatt.css   Estilos: paleta del logo, móvil primero
assets/js/ecowatt.js     CONFIG de la calculadora + interacciones (sin librerías)
assets/img/              Logo, logo inverso, favicon e ícono para iOS
docs/plan-de-diseno.md   Paleta, tipografía, wireframes, principios y revisión del plan
docs/imagenes-ia.md      Imágenes generadas con IA: modelos, prompts y cómo regenerarlas
herramientas/preparar-hero.py  Recorta la casa y prepara las 3 capas del hero a partir de una foto
herramientas/estilo-imagen.py  Da a cualquier foto la luz cálida de la página y la exporta en WebP en dos tamaños
```

Para verla en tu compu: `python3 -m http.server` y abre `http://localhost:8000`.

## Antes de publicar

1. **Conecta el formulario.** En `assets/js/ecowatt.js`, pon en `CONFIG.formulario.endpoint` la URL que va a recibir los datos (Formspree, Netlify Forms, un webhook o un PHP propio; llegan por POST multipart, con la foto del recibo). Mientras esté vacío, el formulario funciona en **modo demostración**: muestra el mensaje de éxito, pero no manda los datos a ningún lado.
2. **Ajusta la calculadora.** Revisa cada valor marcado con `[Ajustar]` en `CONFIG` y luego cambia `datosDeEjemplo` a `false` para quitar la etiqueta "Valores de ejemplo".
3. **Reemplaza los placeholders** de la lista de abajo y borra cada etiqueta `<span class="ej">EDITAR</span>` que acompaña al dato que ya confirmaste.
4. **Pon las fotos reales.** Las fotos de Ecowatt pueden reemplazar las tres imágenes ilustrativas de "Ventajas" (casas, negocios e industrias) y ocupar los espacios marcados `[Pendiente]` en "Ventajas", "Cómo funciona" y "Garantía". Pásalas antes por `python3 herramientas/estilo-imagen.py foto.jpg assets/img/secciones/nombre --anchos 1200 720 --recorte 4:3`: así quedan con la misma luz que el resto de la página, en WebP y en dos tamaños. En el HTML usa `loading="lazy"`, `width` y `height`, y un texto alternativo que describa la foto.

## Publicar el demo en Netlify

Para el demo se suben solo `index.html`, `aviso-de-privacidad.html` y `assets/`; `docs/` y `herramientas/` no van. Además se agrega un archivo `_headers` con `X-Robots-Tag: noindex, nofollow`, para que Google no indexe el demo con los datos de ejemplo. El archivo **no** está en el repositorio, a propósito, para que la página real no herede el "noindex":

```
/*
  X-Robots-Tag: noindex, nofollow
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
/assets/*
  Cache-Control: public, max-age=604800
```

Hay dos formas de subirlo:
- Arrastra la carpeta (o el .zip) a https://app.netlify.com/drop.
- Usa la API de Netlify con un token personal.

Para el lanzamiento real en ecowatt.mx, quita el `_headers` del demo y conecta `CONFIG.formulario.endpoint`.

## Páginas por ciudad

La página ya está lista para duplicarse por ciudad, por ejemplo `/paneles-solares/queretaro/`. Las instrucciones están en un comentario dentro del `<head>` de `index.html`. En resumen: copia el archivo, cambia `data-ciudad="leon"` por el slug de la ciudad (lo encuentras en `CONFIG.ciudades`) y ajusta el título, la descripción, el canonical y el H1. La calculadora, el formulario y todos los mensajes de WhatsApp toman la ciudad de ese atributo.

## Lista de placeholders que hay que reemplazar

### Imágenes generadas con IA
| Dónde | Nota |
|---|---|
| Hero y las 3 fotos de "Ventajas" (casas, negocios, industrias) | Son imágenes generadas con IA (Higgsfield). Debajo de las de "Ventajas" dice "Imágenes ilustrativas". Si Ecowatt tiene fotos propias de buena calidad, conviene usarlas. Detalles en `docs/imagenes-ia.md` |
| Familia ("Ventajas"), instaladores ("Cómo funciona") y detalle de panel ("Garantía") | Generadas con FLUX.1-schnell en AI Horde, con la leyenda "Imagen ilustrativa". Los instaladores no son el equipo de Ecowatt: cámbienlos por una foto real de la cuadrilla en cuanto la tengan |

### Confianza y reputación
| Dónde | Placeholder |
|---|---|
| Hero (fila de datos, debajo de los botones) | `[4.9]` de 5 en Google |
| Hero (fila de datos, debajo de los botones) | `[000]` sistemas instalados |
| Testimonios (bloque de Google) | `[4.9]` calificación y `[000]` reseñas |
| Barra de confianza (6 espacios, debajo del hero) | `[Marca de paneles]` ×2, `[Marca de inversores]` ×2 y `[Certificación]` ×2. Solo marcas que Ecowatt instala y certificaciones que tiene |
| Testimonios (3) | Son ejemplos: `[Testimonio real de cliente…]`, `[Nombre del cliente]` / `[Nombre y negocio]`, `[Colonia]` y la foto del cliente. Cada testimonio real necesita permiso por escrito |
| Botón "Lee las reseñas en Google" | Confirmar que `https://maps.app.goo.gl/Gwjrf4gjT9DuF31M9` (tomado del sitio actual) abre la ficha de Google con las reseñas |

### Proceso y tiempos
| Dónde | Placeholder |
|---|---|
| Cómo funciona, paso 3 (Instalación) | Instalación en `[X días]` y `[Confirmar: Ecowatt hace por ti el trámite del medidor con CFE.]` |
| Formulario, éxito y promesa | Respuesta en menos de `[24 h]` (aparece 3 veces) |
| Preguntas: instalación y CFE | `[X días]`, `[X semanas]`, `[Confirmar quién hace el trámite ante CFE.]` |

### Lugares donde hemos instalado (en "Opiniones")
Es una lista de nombres reales: Residencial La Campiña, Santa Lucía, Porta Fontana, El Molino, Santa Fe, una casa en San Miguel de Allende, una tienda de abarrotes y una cabaña sin red de CFE. No lleva cifras. Agrega paneles o recibos antes y después solo cuando estén confirmados.

### Garantías
| Dónde | Placeholder |
|---|---|
| Paneles | `[00] años` y `[Confirmar si es de producto, de rendimiento o ambas.]` |
| Inversor | `[00] años` |
| Instalación | `[00] años` y `[Confirmar alcance.]` |

### Formas de pago
| Dónde | Placeholder |
|---|---|
| Contado | `[Confirmar si hay descuento.]` |
| Financiamiento | `[Confirmar institución, plazos y requisitos.]` |
| Meses sin intereses | `[Confirmar bancos y plazos.]` |

### Preguntas frecuentes
| Pregunta | Placeholder |
|---|---|
| ¿Cuánto cuesta? | Rango de `[$00,000]` a `[$00,000]` |
| ¿En cuánto tiempo recupero mi inversión? | Entre `[X]` y `[X]` años |
| ¿Funciona en días nublados o con granizo? | `[dato de resistencia al granizo de los paneles que instalan y la norma que lo respalda]` |
| ¿Daña mi techo? | `[Explicar cómo fijan la estructura y cómo cuidan el impermeabilizante.]` |
| ¿Qué mantenimiento necesita? | Limpieza `[cada X meses]` |
| ¿Qué pasa si me cambio de casa? | `[Confirmar si Ecowatt desmonta y reinstala, y en qué condiciones.]` |

### Pie de página
| Dónde | Placeholder |
|---|---|
| Pie | `[Días y horario de atención]` (agrégalo también como `openingHoursSpecification` en el JSON-LD) |

### Aviso de privacidad (`aviso-de-privacidad.html` y la ventana del formulario)
Está redactado como **borrador conforme a la LFPDPPP** y lo debe revisar un abogado antes de publicarse. Cuando esté listo, borra el aviso amarillo de "Borrador" y las etiquetas "Ejemplo".

| Dónde | Placeholder |
|---|---|
| Responsable (página y ventana) | `[Razón social de la empresa]` |
| Responsable | `[Nombre o área]` a cargo de los datos personales |
| Encabezado | Fecha de "Última actualización" |
| Datos que recabamos | Qué datos de facturación y pago piden, y qué datos pide CFE para el trámite |
| Con quién los compartimos | Confirmar CFE y fabricantes, y la lista real de proveedores (mensajería, correo, alojamiento, formulario, monitoreo, contabilidad) |
| Derechos ARCO | Plazo de respuesta `[20 días hábiles]` |
| Conservación | Plazo para borrar cotizaciones no contratadas `[12 meses]` |
| Cookies | Actualizar si se agrega Google Analytics, Tag Manager o el píxel de Meta |
| Autoridad | Confirmar la autoridad vigente en protección de datos |

El formulario pide solo nombre, WhatsApp y cuánto pagas, además de la casilla obligatoria del aviso. Tipo (casa o negocio) y ciudad viajan ocultos: salen de la calculadora o de `data-ciudad`. Ya no hay casilla de promociones: el aviso dice que solo se mandan si la persona acepta por separado (por ejemplo, cuando se lo preguntan por WhatsApp).

### Contenido que salió en la Fase 5
La página siguió el orden que pidió el cliente. Lo que no tenía lugar se integró o salió:
- **Las tarjetas de soluciones** (casa, negocio, industria y sistemas aislados) quedaron como tres fotos en "Ventajas". La deducción del 100 % para negocios es ahora una ventaja.
- **El bloque de la DAC** quedó como una ventaja.
- **Los proyectos** quedaron como lista de nombres en "Opiniones".
- **La cobertura** (8 ciudades) sigue en "Preguntas" y en el pie.
- **Salió "Quiénes somos"**, con la historia de Ecowatt (`[EDITAR]`) y los tres espacios de fotos del equipo, la camioneta y la bodega. Si se quiere de vuelta, conviene una página propia `/nosotros/` con fotos reales.

### Calculadora (`CONFIG` en `assets/js/ecowatt.js`)
| Valor | Qué es | Valor de referencia |
|---|---|---|
| `tarifas.casa.precioKwh` | Pesos por kWh con IVA, promedio en casas | 3.2 |
| `tarifas.casa.cargoMinimoBimestral` | Lo que se sigue pagando a CFE con paneles | 150 |
| `tarifas.casa.pagoBajo` | Monto bajo el cual avisamos que tarda más en pagarse | 1,200 |
| `tarifas.negocio.precioKwh` | Pesos por kWh con IVA, promedio en negocios | 4.6 |
| `tarifas.negocio.cargoMinimoBimestral` | Cargo mínimo de negocio | 400 |
| `tarifas.negocio.pagoBajo` | Monto bajo para negocio | 3,000 |
| `panel.potenciaW` | Watts de cada panel que instalan | 550 |
| `panel.costoInstaladoPorPanel` | Costo por panel ya instalado (solo calcula los años de retorno; no se muestra) | 11,500 |
| `rendimientoSistema` | Factor de pérdidas | 0.78 |
| `ciudades[].hsp` | Horas de sol pico por ciudad | 5.4 a 6.0 |
| `datosDeEjemplo` | Cámbialo a `false` cuando todo esté confirmado | `true` |

### Asistente (vista previa)
Es una maqueta visual con una conversación de muestra y la etiqueta EDITAR. Se ve en tableta y computadora. En celular se oculta porque tapaba el contenido; ahí ya está la barra con WhatsApp y llamada. Los botones "Agenda tu visita" y "Calcula tu ahorro" sí funcionan. Si conectan un asistente real (por ejemplo con Gemini), reemplacen el bloque `#chat-panel` y conserven `#chat-btn`. No le pongan "24/7" ni "te atiende las 24 horas" hasta que sea cierto.
