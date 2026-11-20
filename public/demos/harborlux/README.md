# Plantilla inmobiliaria — guía de personalización

Sitio completo para una agencia inmobiliaria de alto nivel: hero cinemático, buscador avanzado, catálogo con filtros instantáneos, ficha de propiedad (galería, planos, mapa y recorrido 360°), agendador de visitas por WhatsApp o correo, comparador de hasta 3 propiedades, calculadora hipotecaria, servicios, valuación gratuita y contacto.

HTML5 + CSS + JavaScript sin dependencias ni compilación. Esta copia está configurada para la marca de demostración **Harborlux**.

## Verlo

- Abre `index.html` con doble clic: funciona sin servidor.
- O sírvelo con cualquier servidor estático (`npx serve .`, `python3 -m http.server`).
- Dentro del sitio de Vantgard: `/harborlux` (redirige a `/demos/harborlux/index.html`).

## Estructura

```
index.html          Esqueleto semántico (no lleva contenido: todo sale de data.js)
aviso-de-privacidad.html, terminos.html   Páginas legales (texto armado desde data.js → legal)
css/tokens.css      COLORES, vidrio, tipografía, radios  ← lo único que cambias de CSS
css/base.css        Reset, botones, formularios, vidrio, tipografía
css/hero.css        Hero cinemático, barra flotante y buscador
css/components.css  Catálogo, tarjetas, modales, calculadora, comparador, secciones
js/data.js          MARCA, CONTACTO, ASESORES, PROPIEDADES, PLANOS  ← el contenido
js/core.js          Utilidades, íconos, formato de moneda y estado compartido
js/hero.js          Intro de 7.4 s, lluvia en bucle y navegación
js/catalog.js       Buscador, filtros, orden y tarjetas
js/property.js      Ficha de propiedad y agendador
js/floorplan.js     Dibuja los planos en SVG
js/compare.js       Guardar y comparar
js/mortgage.js      Calculadora hipotecaria
js/sections.js      Métricas, servicios, valuación, asesores, footer y SEO
js/main.js          Arranque
js/legal.js         Aviso de privacidad y términos
img/                Fotos (img/propiedades/), fondos e imagen para redes (og.jpg)
PROMPTS-FOTOS.md    Prompts y nombres de archivo de las fotos pendientes
```

## Nuevo cliente en 4 pasos

1. **Colores** (`css/tokens.css`): `--brand-bg`, `--brand-accent`, `--brand-accent-2` y los resplandores `--brand-glow-1/2` cambian toda la identidad. El vidrio se ajusta con `--glass-alpha` y `--glass-blur`.
2. **Marca y contacto** (`js/data.js` → `marca`, `contacto`, `asesores`): nombre, wordmark, WhatsApp (solo dígitos con lada: `5215512345678`), correos, dirección, horario y redes.
3. **Inventario** (`js/data.js` → `propiedades`): una entrada por propiedad. Los filtros, zonas, comparador y datos estructurados se generan solos.
4. **SEO y legal**: actualiza `<title>`, `meta description` y `og:image` en `index.html` (con la URL absoluta del dominio), `marca.url` en `data.js`, y los datos de `legal` (razón social, RFC, correo de privacidad). Cuando el abogado del cliente valide los textos, pon `legal.borrador: false`.

Busca `[EDITAR]` en `data.js` para los datos que no deben quedarse de ejemplo.

## Propiedades

Campos principales de cada propiedad:

| Campo | Ejemplo | Notas |
| --- | --- | --- |
| `operacion` | `'venta'`, `'renta'`, `'preventa'` | Define la etiqueta y los rangos de presupuesto |
| `tipo` | `'Casa'`, `'Departamento'`, `'Terreno'`, `'Local Comercial'` | Debe existir en `catalogo.tipos` |
| `precio`, `moneda` | `28900000`, `'MXN'` o `'USD'` | Renta = mensual. `precioDesde: true` muestra “Desde” |
| `superficie` | `{ construccion, terreno, terraza }` | En m²; `null` si no aplica |
| `recamaras`, `banos`, `estacionamientos` | `3`, `3.5`, `2` | `null` en terrenos |
| `plusvalia` | `9.8` | % anual estimado (etiqueta verde) |
| `amenidades` | `['seguridad', 'alberca']` | Claves de `amenidades` (agrega nuevas ahí) |
| `ubicacion` | `{ direccion, zona, ciudad, estado, lat, lng }` | `zona` alimenta el filtro; `lat/lng` el mapa |
| `fotos` | `[{ src, srcset?, alt }]` | Ver abajo |
| `planos` | `'casa-2n'` | Clave de `planos` |
| `panorama` / `tour360` | imagen panorámica / URL de Matterport o Kuula | Pestaña “Recorrido 360°” |
| `asesor` | `'mariana'` | Recibe las solicitudes de visita de esa propiedad |

### Fotos

- Formato recomendado: **WebP 3:2**, 1600 × 1067 px (y una de 800 px si quieres `srcset`).
- Guárdalas en `img/propiedades/` y escribe la ruta en `src`.
- Mientras una foto tenga `pendiente: true` no se muestra; en su lugar aparece un marcador con el ícono del tipo de propiedad. Quita esa línea al subir el archivo.
- Solo arquitectura, interiores, fachadas y vistas: sin personas.
- `PROMPTS-FOTOS.md` tiene un prompt por foto para generarlas con IA.

### Planos

Se dibujan solos en SVG a partir de rectángulos en metros. Cada nivel:

```js
{ nombre: 'Planta baja', ancho: 20, fondo: 18, espacios: [
  { n: 'Sala', x: 0, y: 6.5, w: 8, h: 6.5 },
  { n: 'Jardín', x: 9, y: 13, w: 11, h: 5, t: 'ext' },   // exterior (rayado)
  { n: 'Alberca', x: 11, y: 13.8, w: 8, h: 3.4, t: 'agua' }
]}
```

Tipos: `ext` (terraza/jardín), `agua` (alberca), `serv` (servicio, baños chicos, circulación), `lote` y `desplante` (terrenos). Si tienes el plano del desarrollador, usa `imagen: 'img/planos/archivo.webp'` en el nivel.

## Hero

- `hero.modo: 'cinematico'`: puertas → toma aérea → video de tilt → parallax de cuatro capas → titular letra por letra → figura que sube, y lluvia en bucle. Necesita los siete medios de `hero.media`, alineados en el mismo encuadre 16:9 (`ciudad` y `frente` son PNG con transparencia).
- `hero.modo: 'imagen'`: una sola foto (`media.fondo`) con el titular, sin intro. Úsalo si el cliente no tiene medios cinemáticos.
- `kicker` + `palabra` forman el titular (la palabra gigante se ajusta sola a la pantalla). `titulo` es el texto completo para lectores de pantalla y SEO.
- Con *reducir movimiento* activo, o al entrar con un enlace a una sección o propiedad, el hero aparece directamente en su cuadro final.

## Herramientas

- **Buscador del hero**: operación, tipo, zona y presupuesto. Aplica los filtros al catálogo y baja hasta él.
- **Filtros y orden**: instantáneos, sin recargar, con reacomodo animado (View Transitions). Rangos de presupuesto en `catalogo.presupuestos` (MXN; se muestran en la moneda activa).
- **Moneda**: MXN/USD desde el globo de la barra o el selector del catálogo, con `moneda.tipoCambio`.
- **Comparador**: hasta 3 propiedades guardadas en `localStorage` (`<slug>:comparar`). La tabla marca el mejor valor por fila.
- **Agendador**: fecha (días hábiles de `agenda.diasHabiles`), horario, presencial o videollamada. Abre WhatsApp o el correo del asesor con el mensaje prellenado y el enlace a la propiedad.
- **Calculadora hipotecaria**: sistema francés con tasa fija, ingreso recomendado (`relacionPagoIngreso`) y gastos de escrituración (`gastosEscrituracion`).
- **Enlace compartible**: `index.html#propiedad/<slug>` abre la ficha; el botón Atrás la cierra.

## Rendimiento y accesibilidad

- Vidrio con `backdrop-filter` solo en la barra, el buscador, la calculadora, la bandeja de comparación y la barra de los modales. Las tarjetas usan vidrio estático (sin blur) sobre resplandores fijos: se ven igual y cuestan mucho menos a la GPU.
- Fotos con `loading="lazy"` y `srcset`; secciones con `content-visibility: auto`; la lluvia se pausa cuando el hero sale de pantalla.
- Formularios con validación al salir del campo, mensajes que dicen cómo corregir, foco al primer error y etiquetas visibles.
- Modales nativos (`<dialog>`): foco atrapado, Esc para cerrar y regreso del foco.
- `prefers-reduced-motion`: sin intro, sin videos y sin animaciones.

## Publicar

Funciona en cualquier hosting estático (Netlify, Vercel, Cloudflare Pages, S3). Si el servidor envía una Content-Security-Policy, permite:

- `img-src`: `images.higgs.ai` (hero)
- `media-src`: `d8j0ntlcm91z4.cloudfront.net` (videos del hero)
- `font-src`: `fonts.gstatic.com`
- `frame-src`: `www.openstreetmap.org` y el dominio de tu visor 360° (Matterport, Kuula…)

## Páginas legales

`aviso-de-privacidad.html` y `terminos.html` usan los datos de `marca`, `contacto` y `legal`. Son una base pensada para México (derechos ARCO, finalidades primarias y secundarias, transferencias, almacenamiento local en lugar de cookies de rastreo) y declaran que imágenes y planos son ilustrativos y que la calculadora es una simulación. Revísalas con el abogado del cliente antes de publicar.

## Imagen para redes

`img/og.jpg` (1200 × 630) es el cuadro final del hero. Para regenerarla con otra marca, abre el sitio con *reducir movimiento* activo en una ventana de 1200 × 630 y haz una captura, o reemplázala por la imagen que prefieras.
