# Sneaker District

Tienda de tenis de una sola página (demo). Venta por WhatsApp. "Originales o nada."

## Archivos

- `index.html`, `styles.css`, `main.js`: la página (HTML, CSS y JS puros, sin build).
- `products.js`: datos de la tienda (tenis, colores, temas del hero, lanzamientos, reseñas y contacto). Casi todo se edita aquí.
- `assets/img/` (fotos WebP), `assets/models/` (modelos 3D .glb) y `assets/video/`. `assets/_originales/` no se publica.
- `CLAUDE.md`: reglas del proyecto para Claude Code. `docs/`: guía de fases y página de inspiración.

## Antes de publicar: lo marcado con [EDITAR]

- `products.js` → `STORE.whatsapp`: tu número con 52 y sin espacios (por ejemplo `525512345678`). Mientras diga `52XXXXXXXXXX`, los botones de WhatsApp no llegan a nadie.
- `products.js` → Instagram, TikTok (el usuario, con o sin @), dirección, pagos y envíos. Al llenarlos, el footer los vuelve links solo.
- `products.js` → nombres de las reseñas (`[Nombre]`).
- `index.html` → la devolución del 100 % (Garantía) y las respuestas de Preguntas frecuentes.

## Fotos y modelos 3D

Mientras no existan, la página muestra un dibujo con los colores de cada par. Al agregar `assets/img/{id}-{color}.webp` o `assets/models/{id}-{color}.glb` con los nombres exactos de `products.js`, se usan solos: sin modelo se ve la foto, y sin foto, el dibujo. Los modelos 3D solo cargan con la página publicada o en un servidor local (abriendo `index.html` directo del disco se ve la foto).

## Publicar en Netlify Drop

1. En la carpeta del proyecto corre `node publicar.mjs`. Crea `publicar/` solo con lo que va a internet (sin `assets/_originales`) y revisa que no haya rutas rotas.
2. Abre https://app.netlify.com/drop y arrastra la carpeta `publicar/`.
3. Netlify te da un link para compartir. Crea una cuenta gratis para que el sitio quede guardado a tu nombre.
4. Para actualizarlo: vuelve a correr `node publicar.mjs` y arrastra la carpeta nueva en la pestaña "Deploys" de tu sitio en Netlify.
