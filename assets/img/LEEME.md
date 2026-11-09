# Imágenes del sitio

Todas están en **WebP** y en varios tamaños: el navegador descarga solo la que necesita la pantalla.
Origen y licencias: ver `CREDITOS.md`.

## Hero (`hero/`)

| Archivo | Qué es |
|---|---|
| `cielo-m/n-960|1600.webp` | Cielo de mañana / noche, **ya desenfocado** (no usar `filter: blur` en CSS: hace lenta la niebla) |
| `suelo-m/n-1440|1920|2560.webp` | Foto completa; solo se ve la parte de abajo (pasto y arbustos). La mitad superior va rellena para pesar menos |
| `casa-m/n-1440|1920|2560.webp` | Casa recortada con fondo transparente |
| `suelo-m/n-movil.webp`, `casa-m/n-movil.webp` | Recorte vertical para celular (porche y paneles en cuadro) |

Para cambiar la casa del hero hacen falta, por cada hora: un cielo sin casa, la foto completa y la casa
recortada con fondo transparente, las tres del mismo encuadre (16:9).

## Fotos de secciones (`fotos/`)

| Archivo | Dónde | Proporción | Tamaños |
|---|---|---|---|
| `proyecto-*-480|800|1200.webp` | Galería de proyectos | 4:3 | 480, 800 y 1200 px |
| `servicio-*-480|800|1200.webp` | Tarjetas de servicios | 16:10 | 480, 800 y 1200 px |
| `instalador-gem-640|960|1280.webp` | Sección "Por qué GEM" | 4:3 | 640, 960 y 1280 px |

Para reemplazar una foto por una real: recórtala a la misma proporción, expórtala en esos anchos
(calidad 70–80 %, por ejemplo con https://squoosh.app) y guárdala con el mismo nombre. Actualiza el `alt`
en `index.html` con lo que realmente se ve.

## Otros

| Archivo | Uso |
|---|---|
| `og-gem.jpg` | Vista previa al compartir en WhatsApp y Facebook (1200 × 630) |
| `logo-gem.svg` | Logo para Google (datos estructurados) |
| `favicon.svg`, `apple-touch-icon.png` | Ícono de la pestaña y del iPhone |
