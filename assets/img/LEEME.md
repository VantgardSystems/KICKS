# Imágenes del sitio

Las imágenes actuales son **ilustraciones de reemplazo**. Cámbialas por fotos reales
de tus instalaciones. La forma más fácil es guardar la foto con el mismo nombre y
actualizar la extensión en `index.html` (por ejemplo, `.svg` → `.webp`).

| Archivo | Dónde se usa | Medida recomendada |
|---|---|---|
| `hero-casa-paneles.svg` | Imagen grande del inicio | 1600 × 1400 px (proporción 8:7) |
| `proyecto-residencial-1/2/3.svg` | Galería de proyectos | 1200 × 900 px (proporción 4:3) |
| `proyecto-comercial-1/2/3.svg` | Galería de proyectos | 1200 × 900 px (proporción 4:3) |
| `og-gem.jpg` | Vista previa al compartir en WhatsApp y Facebook | 1200 × 630 px |
| `logo-gem.svg` | Logo para Google (datos estructurados) | Vectorial |
| `favicon.svg` / `apple-touch-icon.png` | Ícono de la pestaña y del iPhone | 180 × 180 px para el PNG |

## Recomendaciones

- Usa formato **WebP** (o JPG) con calidad de 75–80 %. Cada foto debería pesar menos de 200 KB.
  Puedes convertirlas gratis en https://squoosh.app
- Si cambias la medida o proporción, actualiza también `width` y `height` en el `<img>`
  para que la página no "brinque" al cargar.
- Actualiza el texto `alt` de cada foto con lo que realmente se ve
  (ej. "Casa en Jardines del Moral con 10 paneles solares").
- La imagen del inicio **no** lleva `loading="lazy"` a propósito: es lo primero que se ve.
