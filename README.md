# Ecowatt: página de paneles solares en León

Página de una sola pantalla para [ecowatt.mx](https://ecowatt.mx). Está diseñada primero para celular y su meta es que cada visita termine en una cotización por WhatsApp.

```
index.html               La página completa (HTML estático, sin build)
assets/css/ecowatt.css   Estilos: paleta del logo, móvil primero
assets/js/ecowatt.js     CONFIG de la calculadora + interacciones (sin librerías)
assets/img/              Logo, logo inverso, favicon e ícono para iOS
docs/plan-de-diseno.md   Paleta, tipografía, wireframes, principios y revisión del plan
docs/imagenes-hero-kling.md  Prompts de Kling y pasos para las imágenes del hero
```

Para verla en tu compu: `python3 -m http.server` y abre `http://localhost:8000`.

## Antes de publicar

1. **Conecta el formulario.** En `assets/js/ecowatt.js`, pon en `CONFIG.formulario.endpoint` la URL que va a recibir los datos (Formspree, Netlify Forms, un webhook o un PHP propio; llegan por POST multipart, con la foto del recibo). Mientras esté vacío, el formulario funciona en **modo demostración**: muestra el mensaje de éxito, pero no manda los datos a ningún lado.
2. **Ajusta la calculadora.** Revisa cada valor marcado con `[Ajustar]` en `CONFIG` y luego cambia `datosDeEjemplo` a `false` para quitar la etiqueta "Valores de ejemplo".
3. **Reemplaza los placeholders** de la lista de abajo y borra cada etiqueta `<span class="ej">Ejemplo</span>` que acompaña al dato que ya confirmaste.
4. **Cambia las fotos.** Cada `<div class="foto" role="img" aria-label="…">` describe la foto que va ahí. Sustitúyelo por `<img class="foto" src="assets/img/….webp" alt="(misma descripción)" width="1200" height="900" loading="lazy" decoding="async">`. Usa WebP de unos 1200 px de ancho.

## Páginas por ciudad

La página ya está lista para duplicarse por ciudad, por ejemplo `/paneles-solares/queretaro/`. Las instrucciones están en un comentario dentro del `<head>` de `index.html`. En resumen: copia el archivo, cambia `data-ciudad="leon"` por el slug de la ciudad (lo encuentras en `CONFIG.ciudades`) y ajusta el título, la descripción, el canonical y el H1. La calculadora, el formulario y todos los mensajes de WhatsApp toman la ciudad de ese atributo.

## Lista de placeholders que hay que reemplazar

### Hero de día y noche (imágenes temporales)
| Dónde | Placeholder |
|---|---|
| Hero | Las 6 imágenes son **temporales**: vienen de la referencia "Lumen Roof", una casa de campo genérica. Cámbialas por las de Ecowatt generadas con Kling. Los prompts y los pasos están en `docs/imagenes-hero-kling.md` |
| `CONFIG.hero` | Al cambiar las fotos, ajusta `porche` (luz ámbar de noche), `techo` e `imagen` |

### Confianza y reputación
| Dónde | Placeholder |
|---|---|
| Hero (franja de confianza) | `[4.9] de 5` calificación en Google |
| Hero (franja de confianza) | `[000]` sistemas instalados |
| Testimonios (bloque de Google) | `[4.9]` calificación y `[000]` reseñas |
| Testimonios (3) | `[Testimonio real de cliente…]`, `[Nombre del cliente]` / `[Nombre y negocio]`, `[Colonia]` y la foto del cliente |
| Botón "Ver reseñas en Google" | Confirmar que `https://maps.app.goo.gl/Gwjrf4gjT9DuF31M9` (tomado del sitio actual) abre la ficha de Google con las reseñas |

### Proceso y tiempos
| Dónde | Placeholder |
|---|---|
| Cómo funciona, paso 4 | Instalación en `[X días]` |
| Cómo funciona, paso 5 | `[Confirmar: Ecowatt hace el trámite ante CFE por ti]` |
| Formulario, éxito y promesa | Respuesta en menos de `[24 h]` (aparece 3 veces) |
| Preguntas: instalación y CFE | `[X días]`, `[X semanas]`, `[Confirmar quién hace el trámite ante CFE.]` |

### Experiencia
| Dónde | Placeholder |
|---|---|
| Quiénes somos | Desde hace `[X]` años en sistemas solares |
| Quiénes somos | `[Historia corta de Ecowatt: quién la fundó y cómo empezó.]` |

### Proyectos (8 tarjetas)
| Dónde | Placeholder |
|---|---|
| Residencial La Campiña, Santa Lucía, Porta Fontana, El Molino, Santa Fe, casa en San Miguel de Allende y tienda de abarrotes | `[00]` paneles, recibo antes `[$0,000]` y recibo después `[$000]` |
| Cabaña sin red de CFE | `[Ubicación]`, `[00]` paneles y `[baterías]` (capacidad) |
| Las 8 tarjetas | Foto real del proyecto |

### Garantías, marcas y certificaciones
| Dónde | Placeholder |
|---|---|
| Paneles | `[00] años` y `[Confirmar si es de producto, de rendimiento o ambas.]` |
| Inversor | `[00] años` |
| Instalación | `[00] años` y `[Confirmar alcance.]` |
| Marcas (6 espacios) | `[Logo de marca de paneles]` ×2, `[Logo de marca de inversores]` ×2, `[Logo de marca de estructura]` y `[Logo de marca de monitoreo]` |
| Certificaciones (4 espacios) | `[Sello de certificación]` |

### Formas de pago
| Dónde | Placeholder |
|---|---|
| Contado | `[Confirmar si hay descuento por pago de contado.]` |
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

### Pie de página y legal
| Dónde | Placeholder |
|---|---|
| Pie | `[Días y horario de atención]` (agrégalo también como `openingHoursSpecification` en el JSON-LD) |
| Aviso de privacidad | `[Texto completo del aviso de privacidad…]` y `[Confirmar con el aviso real.]` |

### Fotos reales (12 espacios)
Hero (cuadrilla instalando en una azotea de León), Para tu casa, Para tu negocio, Para tu industria, Sistemas aislados, los 8 proyectos, el equipo frente a la bodega, la camioneta y el interior de la bodega. Cada espacio trae la descripción de la foto que va ahí.

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

### Asistente 24/7
Por ahora es una maqueta visual con una conversación de muestra y lleva la etiqueta "Ejemplo". Los botones "Agenda tu visita" y "Calcula tu ahorro" sí funcionan. Cuando conecten un chatbot real, reemplacen el bloque `#chat-panel`.
