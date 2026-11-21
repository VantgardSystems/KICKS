# Plantilla de landing para inmobiliarias

Landing de una sola página pensada para tráfico de anuncios en celular (Instagram, Facebook, link en bio). El prospecto responde 3 preguntas y su solicitud llega armada al WhatsApp del asesor.

Todo está en `index.html` (HTML, CSS y JS en el mismo archivo, sin librerías). Lo demás son archivos estáticos:

```
index.html            la página completa
fotos/                fotos de la vitrina y de "Propietarios" (WebP de 600 y 1000 px)
media/ciudad.webp     la ciudad del hero
media/cuarto.webp     el cuarto con la ventana (el vidrio ya viene transparente)
media/agua.mp4        el movimiento del agua (solo escritorio con buena conexión)
media/og.jpg          la imagen que aparece al compartir el enlace (1200×630)
fuentes/              Poppins, Outfit y Pinyon Script (licencia OFL)
favicon.svg, apple-touch-icon.png
vercel.json           caché de fotos, fuentes y video
```

## Clonar para otra inmobiliaria (5 pasos)

Todo se edita en `index.html`:

1. **Datos del negocio: líneas 27 a 37.** `nombre`, `marca` (texto del logo), `ciudad` (también es la palabra gigante del hero), `whatsapp` (52 + 10 dígitos, sin espacios ni "+": `524421234567`), `telefonoVisible`, `correo`, `direccion`, `horario` y `horarioSchema` (el mismo horario para Google, por ejemplo `Mo-Sa 09:00-19:00`).
   Mientras `whatsapp` esté vacío, la página funciona en **modo demo**: WhatsApp abre el mensaje armado y pide elegir a quién mandarlo.
2. **Colores: líneas 96 a 99.** `--primario`, `--acento`, `--noche` (fondo) y `--whatsapp`. Si cambias `--noche`, pon el mismo color en `theme-color` (línea 19).
3. **Textos y zonas: líneas 39 a 52.** Frase del hero, título, subtítulo, botón, los 3 badges, la nota de precios y las 4 zonas reales de la ciudad (paso 2 del precalificador).
4. **Propiedades: líneas 55 a 68.** Título, `Venta` o `Renta`, precio, ubicación, m², recámaras, baños, referencia y foto. Las fotos van en `fotos/` en dos tamaños (`-600.webp` y `-1000.webp`, formato 3:2).
5. **Google y redes: líneas 7 a 12.** `<title>`, descripción y `og:image`. Una vez publicada, `og:image` debe llevar la URL completa (`https://tudominio.com/media/og.jpg`) para que Facebook y WhatsApp muestren la imagen.

Opcionales:
- `escenaVentana: false` (línea 77) quita la escena de la ventana y deja el hero más corto.
- `palabraHero` (línea 41) cambia la palabra gigante si no quieres usar la ciudad.
- La foto de "Propietarios" está en la línea 493.

## Aviso de privacidad

La plantilla trae un aviso de privacidad base que se llena solo con los datos de `CONFIG` y se abre desde el pie de página (o con `#aviso-de-privacidad` al final de la URL). **Es un borrador: que lo revise el abogado de cada inmobiliaria antes de publicar.** Si la inmobiliaria ya tiene el suyo, pon su URL en `avisoPrivacidad`.

## Medición

La página dispara eventos si encuentra Meta Pixel, Google Analytics 4 o Google Tag Manager; si no los hay, no hace nada:
- `Lead` (Meta) / `generate_lead` (GA4): al terminar el precalificador.
- `Contact` (Meta) / `contact` (GA4): al tocar cualquier botón de WhatsApp.

Pega el código de Pixel o GA4 dentro de `<head>` y menciónalo en el aviso de privacidad (ya incluye un párrafo de cookies).

Los anuncios pueden llevar `?utm_source=instagram&utm_campaign=nombre` en el enlace: el mensaje de WhatsApp incluye el origen para que el asesor sepa de qué anuncio llegó el prospecto (se apaga con `incluirOrigen: false`).

## Publicar

No necesita compilar nada. Tres formas, de la más fácil a la más técnica:

**Netlify Drop (1 minuto, sin cuenta de GitHub):** entra a app.netlify.com/drop y arrastra la carpeta `inmobiliaria` completa.

**Vercel desde GitHub:** en vercel.com → *Add New* → *Project* → importa el repositorio. En *Root Directory* elige `inmobiliaria`, en *Framework Preset* deja *Other* y publica. Si la carpeta todavía no está en la rama principal, cambia la rama en *Settings* → *Git* → *Production Branch*.

**Vercel desde tu computadora:** abre una terminal dentro de la carpeta `inmobiliaria` y corre `npx vercel --prod`.

## Fotos nuevas

Formato 3:2, al atardecer, misma paleta lila y rosa. Prompts que funcionan bien:

- **Casa en venta:** *Professional real estate listing photograph, contemporary Mexican two-storey house at blue-hour twilight, white stucco with parota wood slat accents, flat roof, glowing windows, agave and bougainvillea garden, cantera stone driveway, lilac-to-rose sky, 24mm lens, photorealistic, no people, no text.*
- **Departamento en renta:** *Professional real estate listing photograph, modern mid-rise apartment building in a Mexican city at blue-hour twilight, white and warm wood façade, glass balconies with planters, palm and jacaranda trees on the sidewalk, lilac-to-rose sky, 24mm lens, photorealistic, no people, no text.*
- **Casa campestre:** *Professional real estate listing photograph, single-storey country house with stone walls, clay tile roof and a lit timber porch in the Mexican highlands at blue-hour twilight, mesquite trees, dry-stone wall, lilac-to-rose sky, 24mm lens, photorealistic, no people, no text.*
- **Propietarios:** *Professional real estate photograph, colonial-modern Mexican house façade at blue-hour twilight, pink cantera stone door frame, carved mesquite wood door, wrought-iron balcony, bougainvillea, cobblestone sidewalk, lilac-to-rose sky, 35mm lens, photorealistic, no people, no text.*

Para convertirlas (con Python y Pillow):

```bash
python3 -c "
from PIL import Image
im = Image.open('foto.jpg').convert('RGB')
for w in (1000, 600):
    im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(f'casa-venta-{w}.webp', 'WEBP', quality=78, method=6)
"
```

## Antes de entregar a un cliente

- [ ] Número de WhatsApp, teléfono, correo y dirección reales
- [ ] 3 propiedades reales con sus fotos
- [ ] Aviso de privacidad revisado por su abogado
- [ ] `og:image` con la URL completa del dominio
- [ ] Pixel o GA4 instalado (si va a correr anuncios)
- [ ] Probar en un iPhone, en un Android y desde el navegador de Instagram
