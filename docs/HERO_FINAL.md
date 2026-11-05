# Sneaker District: hero final con Kling

Fotos 4K, giro 360 de cada tenis, video y todas las transiciones del hero.
Copia cada prompt tal cual, uno por mensaje, y escribe /clear al terminar cada fase.

---

## Antes de empezar (una sola vez)

1. Reemplaza el CLAUDE.md de tu carpeta por el nuevo.
2. Conecta Kling en Claude Code: escribe `/plugin`, busca "Kling AI" e instálalo. Luego `/mcp`, elige kling-ai e inicia sesión con tu cuenta.
3. Pega esto para dejar todo listo:

```
Instala rembg para quitar fondos en esta computadora (pip install "rembg[cpu,cli]") y descarga su modelo birefnet-general. Revisa que ffmpeg esté instalado. Luego revisa mis créditos de Kling y dime cuántos tengo. No generes nada.
```

Por qué giro 360 y no modelo 3D: Kling no crea modelos 3D. En su lugar hacemos un video del tenis dando una vuelta, lo partimos en 48 cuadros y en la página lo giras arrastrando. Se ve más real que un 3D hecho con IA y carga más rápido.

---

## Fase 1: foto maestra (1 foto)

```
Lee CLAUDE.md y products.js y usa la skill kling-ai-generate-image.
Cotiza UNA imagen 1:1 en 4k con el mejor modelo de imagen disponible y espera mi OK.
Con mi OK, genera solo la foto maestra (jordan-1-high, color bred) con este prompt:

"Studio product photograph of a single original high-top leather basketball sneaker, black leather base with varsity red overlays on the toe cap, heel and collar, white midsole, red rubber outsole. Right shoe, outer side profile, toe pointing right, perfectly horizontal, centered, filling 80% of the frame width. Soft even studio lighting from the top left, subtle contact shadow, seamless pure white background. Photorealistic, ultra sharp materials: leather grain, stitching, perforations. No logos, no brand marks, no text, no watermark."

Guárdala en assets/_originales/jordan-1-high-bred.png y enséñamela. No sigas hasta que la apruebe.
```

---

## Fase 2: las otras 19 fotos

```
Aprobada. Ahora las otras 19 fotos con la skill kling-ai-generate-image.
Para cada una usa el mismo prompt de la foto maestra cambiando solo el tipo de tenis y los colores según la tabla, y usa assets/_originales/jordan-1-high-bred.png como referencia de composición ("same camera angle, framing, scale and lighting as the reference image"). 1:1, 4k.
Cotiza el total y espera mi OK. Genera en tandas de 5 y enséñame cada tanda antes de seguir.
Al final, para las 20: quita el fondo con rembg (birefnet-general), recorta dejando 6% de margen y guarda la versión 4K en assets/_originales y la versión web en assets/img como WebP de 1600 px de ancho, calidad 82, con el nombre exacto de products.js.

| archivo | tipo de tenis | colores |
|---|---|---|
| jordan-1-high-chicago | original high-top leather basketball sneaker | white leather base, varsity red overlays, black collar, white midsole, red outsole |
| jordan-1-high-royal | original high-top leather basketball sneaker | black leather base, royal blue overlays, white midsole, royal blue outsole |
| nb-550-verde | original low-top retro basketball sneaker with chunky cupsole and perforated toe | white leather, forest green suede overlays, cream midsole |
| nb-550-marino | original low-top retro basketball sneaker with chunky cupsole and perforated toe | white leather, navy suede overlays, cream midsole |
| samba-og-negro | original low-profile indoor football sneaker with T-shaped suede toe overlay and slim sole | black leather, white accents, gum rubber sole |
| samba-og-blanco | original low-profile indoor football sneaker with T-shaped suede toe overlay and slim sole | white leather, black accents, gum rubber sole |
| ow-out-of-office-blanco | original chunky low-top lifestyle sneaker with oversized padded collar, layered panels and thick sculpted sole | white leather, light grey suede panels, white sole |
| ow-out-of-office-negro | same as above | black leather, grey suede panels, white sole |
| ow-off-court-3-high-blanco | original high-top chunky skate sneaker with padded tongue and thick midsole | white leather, black panels, white sole |
| ow-off-court-3-high-negro | same as above | black leather, charcoal panels, white sole |
| amiri-ma-1-blanco | original luxury high-top sneaker in glossy leather with bold side overlays and chunky sole | white with black overlays, white sole |
| amiri-ma-1-negro | same as above | black with dark grey overlays, white sole |
| lv-trainer-blanco | original luxury retro basketball low-top in mixed grained leather and suede | white with light grey panels, white sole |
| lv-trainer-verde | same as above | white with deep green panels, white sole |
| gucci-ace-clasico | original minimalist low-top leather court sneaker with slim flat sole | white leather, deep green heel tab |
| gucci-ace-rojo | same as above | white leather, red heel tab |
| yeezy-350-v2-zebra | original knit running sneaker with sock-like upper and ribbed translucent foam sole | white knit with black stripe pattern, white sole |
| yeezy-350-v2-onyx | same as above | all black knit, black sole |
| yeezy-350-v2-bone | same as above | cream knit, cream sole |
```

---

## Fase 3: giro 360 de prueba (1 video)

```
Usa la skill kling-ai-generate-video. Cotiza UN video de imagen a video y espera mi OK:
- Primer cuadro y último cuadro: assets/_originales/jordan-1-high-bred.png (así el giro cierra donde empezó).
- Prompt: "The sneaker rotates exactly one full 360 degree turn clockwise on an invisible turntable at a perfectly constant speed and returns to its starting pose. Camera locked, no zoom, no cuts, no camera movement. Same studio lighting, seamless pure white background, nothing else in frame."
- 5 s, 1:1, la mayor resolución disponible (4k si existe; si no, 1080p).

Con el video listo:
1. Guárdalo en assets/_originales/spin-jordan-1-high-bred.mp4.
2. Saca 48 cuadros parejos con ffmpeg, quítales el fondo con rembg (birefnet-general) y guárdalos como WebP de 1200 px, calidad 80, en assets/spin/jordan-1-high-bred/00.webp a 47.webp.
3. Revisa que el giro sea parejo y cierre bien comparando el cuadro 0 con el 47. Si no da la vuelta completa, usa solo los cuadros hasta que vuelva a la pose inicial y dime cuántos quedaron.
4. Arma una hoja de contacto con todos los cuadros en assets/_originales/contacto-bred.jpg y enséñamela.
5. En products.js agrega solo esto dentro del forEach: c.spin = `assets/spin/${p.id}-${c.slug}/`; c.frames = 48;
No sigas hasta que lo apruebe.
```

## Fase 4: giros de los demás

```
Aprobado. Pregúntame con AskUserQuestion si hacemos el giro para los 20 colores o solo para el primer color de cada tenis (9). Cotiza las dos opciones antes de preguntar.
Con mi respuesta, repite el proceso de la Fase 3 para cada uno, en tandas de 4, y enséñame la hoja de contacto de cada tanda. Si alguno sale chueco, no lo repitas: avísame.
```

---

## Fase 5: hero final (código)

```
Usa frontend-design, emil-design-eng y las skills de GSAP. Rehaz SOLO el header y el hero con este diseño final. No toques las demás secciones.

CAPAS (de atrás hacia adelante)
1. Fondo: dos capas a pantalla completa con el color bg del tema. Al cambiar, la nueva entra con opacity 0→1; no animes background-color.
2. Nombre corto gigante: Archivo Black, clamp(9rem, 22vw, 20rem), letter-spacing -0.04em, color big, centrado, top 8%. Cada letra en su propio span.
3. Círculo: diámetro min(60vh, 600px), centrado detrás del tenis, color disc.
4. Tenis anterior y siguiente: primer cuadro de su giro, ancho 20%, escala .72, opacidad .28, rotados ±8°, a ±36vw del centro. Ocultos en celular.
5. Visor 360 al centro: <canvas>, ancho min(62vw, 800px), relación 2:1, inclinación base -8°. Sombra elíptica debajo: 60% del ancho, 18px de alto, negro al 30%, desenfoque 12px.
6. Info debajo: marca, nombre, precio, bolitas de color, tallas y botón de WhatsApp.

VISOR 360
- Muestra primero la foto WebP del color (poster). En segundo plano carga solo los cuadros del color visible; cuando estén listos, cambia al canvas con fade de 300 ms.
- Giro automático: una vuelta cada 8 s. Se pausa al pasar el cursor, al arrastrar y cuando el hero no está en pantalla (IntersectionObserver).
- Arrastre horizontal sobre el tenis: 1 cuadro cada 8 px, con inercia al soltar que frena en 1 s; el giro automático vuelve 2 s después. Arrastre vertical deja hacer scroll (touch-action: pan-y). Cursor grab y grabbing.
- Con foco en el visor: flechas izquierda/derecha giran 1 cuadro (con Shift, 6).
- Si un color no tiene giro, usa su foto con inclinación 3D al mover el puntero (máx. 12°).

CAMBIAR DE PAR (flechas, indicadores, deslizar en la zona de abajo, teclado, Marcas o Más vendidos)
- Un timeline de GSAP que se pueda interrumpir: con clics rápidos salta al nuevo par sin esperar.
- Salida del tenis actual (0 a 300 ms, ease-in): se va 14vw hacia el lado contrario, gira ∓4°, escala .94, opacidad 0.
- Fondo nuevo: fade de 700 ms ease-out desde el inicio. Círculo: escala .9 a 1 en 600 ms.
- Nombre gigante: letras viejas suben 30% y desaparecen en 150 ms; las nuevas suben desde 40%, 25 ms entre letras, máximo 200 ms de stagger, 500 ms cada una, ease-out.
- Entrada del tenis nuevo (empieza a los 200 ms, dura 800 ms, expo.out): llega desde 18vw con rotación ±6° y escala .9, y al mismo tiempo da un cuarto de vuelta rápida (12 cuadros) que frena justo al llegar. Es el movimiento estrella: que se note.
- Info: marca, nombre y precio entran desde abajo con máscara (y 100% a 0), 30 ms entre líneas, 300 ms. Los números del precio ruedan como contador.
- Indicadores: la barra activa crece con scaleX, nunca con width.

CAMBIAR SOLO DE COLOR
- El color nuevo aparece en el MISMO cuadro del giro donde estaba el anterior, para que el tenis no salte.
- Fundido cruzado de 300 ms con escala .97 a 1. Fondo nuevo en 700 ms.

ENTRADA AL ABRIR LA PÁGINA (una sola vez, máximo 1.6 s)
- El fondo pasa de carbón al tema del primer par. Las letras del nombre gigante suben (25 ms entre letras). El círculo crece de .6 a 1. El tenis baja 40px mientras da una vuelta completa rápida (48 cuadros en 1.2 s que frena al final). La info entra al final.

CONTROLES
- Duraciones solo de 100, 150, 200 o 300 ms; ease-out al entrar, ease-in al salir, sin rebote. Al presionar, escala .97. Hover del botón de WhatsApp: oscurece 8%.

QUITAR
- model-viewer y todo su código de carga.
- El flotado infinito del tenis.

MOVIMIENTO REDUCIDO
- Sin giro automático, sin entrada, cambios instantáneos. El arrastre para girar sí funciona.

CELULAR (hasta 760 px)
- Lados ocultos, visor de 92vw, nombre gigante de 30vw. Deslizar sobre la info cambia de par; arrastrar el tenis lo gira.

RENDIMIENTO
- Canvas con devicePixelRatio (máximo 2) y cuadros decodificados con createImageBitmap.
- Fuera del par visible solo se carga el primer cuadro del anterior y del siguiente.

Al terminar, dime qué archivos cambiaste y qué debo probar. Luego ofréceme 3 extras con AskUserQuestion.
```

## Fase 6: revisión del hero

```
Usa emil-design-eng y revisa todas las animaciones del hero: que se sientan finas, que se puedan interrumpir y que nada brinque. Luego usa ui-ux-pro-max para revisar contraste, celular (375 px), foco con teclado y movimiento reducido. Mide el peso que carga el hero al abrir y dime si pasa de 2 MB. Corrige y dame una lista corta.
```

---

## Fase 7 (opcional): video de lanzamiento

```
Con la skill kling-ai-generate-video, cotiza un video de 5 s, 16:9, a partir de la foto de yeezy-350-v2-bone: "The sneaker emerges from darkness as a slow beam of studio light sweeps across it from left to right, revealing the knit texture. Camera slowly pushes in. Dark charcoal background, no text, no logos." Espera mi OK.
Con mi OK, guárdalo en assets/video/drop-yeezy-bone.mp4 (H.264, sin audio, menos de 3 MB) y úsalo como fondo de la tarjeta grande de Lanzamientos: se reproduce solo cuando la tarjeta está en pantalla, en silencio y en loop, con la foto como poster. Con movimiento reducido, solo la foto.
```
