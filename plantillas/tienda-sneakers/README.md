# Plantilla maestra · tienda de sneakers

Plantilla para vender a boutiques de sneakers: tienda de una página en **un solo `index.html`**, sin librerías y con la fuente incrustada. La página se carga en una sola petición (≈80 KB con gzip) más las fotos, y cada venta se cierra por WhatsApp.

- **Hero de drops:** slider de 4 colorways con fotos, barrido medido, paralaje, autoplay, swipe y teclado.
- **Catálogo:** filtros por marca y por talla MX, orden por precio, botón «Ver más» y link compartible `?marca=jordan&talla=27`.
- **Compra en 1 clic:** eliges la talla en la tarjeta y se abre WhatsApp con el mensaje listo.
- **Pares por encargo:** formulario que manda la solicitud a WhatsApp.
- **Confianza:** barra de garantías, reseñas de clientes, guía de tallas MX/US/CM y preguntas frecuentes.
- **Sobre la tienda:** historia, cifras, dirección con «Cómo llegar», horario y botón para agendar visita.
- **Legal:** aviso de privacidad y términos de compra editables (texto de referencia; revisarlo con un asesor).
- **Vista previa al compartir:** `assets/og.jpg` de 1200×630 para WhatsApp, Instagram y Facebook.

Todo el contenido sale de `STORE_CONFIG`. Las reseñas, cifras y la dirección de la demo son **ejemplos**: hay que cambiarlas por las reales de cada cliente antes de publicar.

## Verla

Abre `index.html` en el navegador. Para publicarla, arrastra esta carpeta a <https://app.netlify.com/drop>.

## Clonarla para otra boutique

Solo se editan los 3 bloques marcados con ✏️ al inicio del archivo. La guía de 5 pasos, con números de línea, está en el comentario al final de `index.html`.

## Fotos del hero

El hero ya trae fotos: 4 tenis genéricos sin logos (Lilac, Mint, Lemon y Bubblegum) y 12 piezas flotantes. Están en `assets/kicks/` (≈490 KB en total, ≈140 KB del primer slide). Se generaron con la IA de Figma (Nano Banana 2) usando los prompts del brief, y los originales están en el archivo de Figma "Kicks – assets del hero". Si se borra una foto, ese slide usa su ilustración SVG automáticamente.

Para cambiarlas por las fotos reales de cada par:

1. Pon las imágenes en `assets/raw/` con estos nombres:
   - `lilac-shoe.png`, `mint-shoe.png`, `lemon-shoe.png` y `bubblegum-shoe.png`: foto real del par, de perfil.
   - `lilac-pieces.png`, etc.: 3 objetos en fila sobre fondo blanco.
2. Corre `pip install "rembg[cpu]" pillow numpy` y luego `python tools/prepare_assets.py`. El script quita el fondo y la sombra del piso, rellena los huecos que el quitafondos abre en la piel blanca, recorta y guarda WebP en `assets/kicks/` con los mismos nombres. Revisa `assets/kicks/_check.png`.
3. Si la punta del tenis apunta a la izquierda en tu foto, pon `voltear: true` en ese slide de `STORE_CONFIG.hero.slides`.
4. Si cambias el primer slide, cambia también la línea `preload` del `<head>`.

La foto de un tenis de marca debe ser la del par real (tuya o una imagen oficial que puedas usar). No generes con IA copias de modelos de marca; las piezas flotantes sí pueden ser IA.
