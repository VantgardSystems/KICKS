# Plantilla maestra · tienda de sneakers

Tienda de una página en **un solo `index.html`**: sin librerías y con la fuente incrustada. Se carga en una sola petición (≈75 KB con gzip) y cada venta se cierra por WhatsApp.

- **Hero de drops:** slider de 4 colorways con barrido medido, paralaje, autoplay, swipe y teclado.
- **Catálogo:** filtros por marca y por talla MX, con el link compartible `?marca=jordan&talla=27`.
- **Compra en 1 clic:** eliges la talla en la tarjeta y se abre WhatsApp con el mensaje listo.
- **Pares por encargo:** formulario que manda la solicitud a WhatsApp.
- **Confianza:** barra de garantías, guía de tallas MX/US/CM y preguntas frecuentes.

## Verla

Abre `index.html` en el navegador. Para publicarla, arrastra esta carpeta a <https://app.netlify.com/drop>.

## Clonarla para otra boutique

Solo se editan los 3 bloques marcados con ✏️ al inicio del archivo. La guía de 5 pasos, con números de línea, está en el comentario al final de `index.html`.

## Fotos del hero

Sin fotos, el hero usa ilustraciones SVG del mismo color que cada slide. Para usar fotos reales:

1. Pon las imágenes en `assets/raw/` con estos nombres:
   - `lilac-shoe.png`, `mint-shoe.png`, `lemon-shoe.png` y `bubblegum-shoe.png`: foto real del par, de perfil.
   - `lilac-pieces.png`, etc.: 3 objetos en fila sobre fondo blanco.
2. Corre `pip install "rembg[cpu]" pillow numpy` y luego `python tools/prepare_assets.py`. El script quita el fondo y la sombra del piso, recorta y guarda WebP en `assets/kicks/`. Revisa `assets/kicks/_check.png`.
3. En `STORE_CONFIG.hero.slides` llena estos campos de cada slide:
   - `zapato: "assets/kicks/lilac-shoe.webp"`
   - `piezas: ["assets/kicks/lilac-piece-1.webp", "assets/kicks/lilac-piece-2.webp", "assets/kicks/lilac-piece-3.webp"]`
   - `voltear: true` si la punta del tenis apunta a la izquierda.
4. Descomenta en el `<head>` la línea `preload` de la primera foto.

La foto de un tenis de marca debe ser la del par real (tuya o una imagen oficial que puedas usar). No generes con IA copias de modelos de marca; las piezas flotantes sí pueden ser IA.
