# Sneaker District: guía para Claude Code

Copia cada prompt tal cual, uno por mensaje. Después de cada fase revisa en el navegador y escribe /clear antes de la siguiente (borra la plática, no tu código).

---

## Fase 0: preparación (una sola vez)

1. Crea la carpeta `sneaker-district` y pon dentro `CLAUDE.md` y `products.js`.
2. Dentro crea: `assets/img`, `assets/models`, `assets/video`, `assets/_originales`.
3. En la terminal, dentro de la carpeta, instala las skills:

```
npx skills add emilkowalski/skill
npx skills add https://github.com/greensock/gsap-skills
```

4. Conecta Higgsfield (fotos, 3D y video) desde la terminal:

```
claude mcp add --transport http higgsfield https://mcp.higgsfield.ai/mcp
```

5. Abre Claude Code en la carpeta y escribe:

```
/plugin install frontend-design@claude-plugins-official
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
/reload-plugins
/mcp
```

En `/mcp` elige higgsfield e inicia sesión con tu cuenta.

6. Comprueba que todo cargó:

```
Dime en una lista corta qué skills y qué servidores MCP tienes disponibles. No hagas nada más.
```

Deben salir: frontend-design, emil-design-eng, las de GSAP, ui-ux-pro-max y higgsfield.

---

## Fase 1: fotos de los tenis (Higgsfield)

### Prompt 1A: foto de prueba
```
Lee CLAUDE.md y products.js. Vamos a generar las fotos con Higgsfield.
Primero cotiza (get_cost) UNA foto y dime cuántos créditos cuesta. Si te digo que sí, genera solo la del Air Jordan 1 High color Bred con el modelo gpt_image_2_5 y este prompt:

"Studio product photo of a single Nike Air Jordan 1 High sneaker, Bred colorway (black and red leather, white midsole). Right shoe, outer side profile, toe pointing right, perfectly horizontal, centered, filling 80% of the frame width. Soft even studio lighting from the top left, subtle contact shadow, seamless pure white background (#FFFFFF). Ultra sharp, realistic leather texture, no text, no watermark, square 1:1."

Guárdala en assets/_originales y enséñame el resultado. No sigas hasta que la apruebe.
```

### Prompt 1B: el resto de las fotos
```
Aprobada. Ahora cotiza las fotos que faltan (todos los colores de products.js) y dime el total de créditos.
Cuando te diga que sí: genera cada una con el mismo prompt cambiando solo modelo y colores, y usa la foto aprobada como imagen de referencia ("same camera angle, framing, scale and lighting as the reference image").
Hazlo en tandas de 5 y enséñame cada tanda antes de seguir.
```

### Prompt 1C: dejarlas listas para la web
```
Con las fotos aprobadas: quita el fondo con Higgsfield (remove_background), recorta dejando 6% de margen, conviértelas a WebP de 1200px de ancho y menos de 200 KB, y guárdalas en assets/img con el nombre exacto de products.js. Dime si alguna quedó mal.
```

---

## Fase 2: modelos 3D (Higgsfield)

```
Vamos a probar el 3D. Cotiza un modelo 3D con image_to_3d a partir de assets/img/jordan-1-high-bred.webp y dime el costo.
Si te digo que sí: genéralo, comprímelo con "npx @gltf-transform/cli optimize" a menos de 5 MB y guárdalo en assets/models con el nombre de products.js.
Si la forma sale deforme, propón multi_image_to_3d generando 2 a 4 vistas (lado, frente, atrás, arriba) con la foto como referencia, y cotízalo antes.
Luego pregúntame si hacemos 3D para todos los colores o solo para el primer color de cada modelo (los demás usan la foto con inclinación).
```

---

## Fase 3: base de la página

```
Lee CLAUDE.md. Crea index.html, styles.css y main.js: carga products.js, las fuentes, GSAP y model-viewer; variables CSS de la marca y del tema del hero; header y todas las secciones vacías (solo su título) en el orden de CLAUDE.md. No construyas las secciones todavía.
```

---

## Fase 4: hero (lo más importante)

### Prompt 4A: estructura
```
Usa frontend-design. Construye solo el hero según CLAUDE.md: capas (fondo del tema, nombre gigante, círculo, tenis central en model-viewer con poster, tenis de los lados), info debajo (marca, nombre, precio, bolitas de color, tallas, botón de WhatsApp con mensaje prellenado), flechas e indicadores. Aún sin animaciones.
```

### Prompt 4B: fondos y animaciones
```
Usa emil-design-eng y las skills de GSAP. Agrega al hero:
1. Cambio de tema (fondo, letras, círculo, nombre gigante, botón) con transición de 700 ms al cambiar de par o de color.
2. Entrada del tenis desde el lado hacia el que avanzas; círculo y nombre gigante entran con él. Al cambiar solo de color: fade + escala.
3. Flotado suave y sombra que se encoge cuando el tenis sube.
4. Deslizar con Draggable en la zona de abajo del tenis, teclado izquierda/derecha, indicadores clicables.
5. Inclinación 3D con el puntero cuando se muestra la imagen en lugar del modelo.
6. prefers-reduced-motion: todo sin animación.
Revisa en celular que la página siga haciendo scroll vertical al tocar el tenis.
```

---

## Fase 5: marcas y lanzamientos
```
Construye solo Marcas y Lanzamientos según CLAUDE.md. Al tocar una marca, carga su primer tenis en el hero y sube suave hasta él.
```

## Fase 6: más vendidos
```
Construye solo Más vendidos: mosaico con todos los PRODUCTS, cada tarjeta con el fondo del tema de su primer color, la foto WebP, marca, nombre y precio. Al tocar, carga ese tenis en el hero y sube.
```

## Fase 7: garantía y cómo comprar
```
Construye solo Garantía de originalidad (banda carbón con textura de puntitos tipo cemento, 3 puntos con ícono) y Cómo comprar (3 pasos numerados, con pagos y envíos de STORE).
```

## Fase 8: reseñas, preguntas y avísame
```
Construye solo Reseñas (REVIEWS), Preguntas frecuentes (4 preguntas con <details>; las respuestas que no sepas van con [EDITAR]) y Avísame del próximo drop (campo de WhatsApp que abre un mensaje prellenado).
```

## Fase 9: footer y botón flotante
```
Construye el footer (logo, slogan, links, contacto de STORE) y el botón flotante verde de WhatsApp con ícono y texto "Contacto".
```

---

## Fase 10: pulido de animaciones
```
Usa emil-design-eng para revisar TODAS las animaciones e interacciones de la página: easing, duraciones, estados hover y active de botones, foco con teclado. Corrige lo que no se sienta fino y dame una lista corta de cambios.
```

## Fase 11: revisión final
```
Usa ui-ux-pro-max y haz la revisión final: contraste, 375/768/1280 px, foco visible, reduced motion, peso de imágenes y modelos, que la página cargue rápido (lazy loading en imágenes fuera de pantalla, model-viewer solo carga el modelo visible). Corrige y dame la lista.
```

---

## Fase 12: extras (Claude te pregunta)
```
Revisa este banco de extras y pregúntame con AskUserQuestion cuáles agregar (máximo 4 opciones por pregunta). Después agrega solo los que elija, uno por mensaje.
Banco: guía de tallas (MX/US/cm); bolsa de WhatsApp (juntar varios pares en un solo mensaje); contador regresivo en Lanzamientos; filtro por marca en Más vendidos; "Vistos recientemente"; botón compartir (link directo a un tenis con #id); sección de fotos de clientes; loader con el logo al abrir; video corto en loop de fondo en un lanzamiento (Higgsfield, cotizar antes).
```

## Fase 13: publicar
```
Prepara la carpeta para publicar: quita assets/_originales de lo que se sube, revisa que no haya rutas rotas y dime los pasos para subirla a Netlify Drop.
```
Luego arrastras la carpeta a app.netlify.com/drop y te da el link para mandarlo.

## Fase 14 (opcional): video para vender la página
En otra carpeta, aparte de la web:
```
npx skills add remotion-dev/skills
```
Y en Claude Code:
```
Con Remotion, haz un video vertical de 20 segundos para Instagram/TikTok que presente Sneaker District: el hero cambiando de color con cada tenis, el giro 3D, Más vendidos y el botón de WhatsApp. Usa capturas de la página publicada. Pregúntame el texto antes de renderizar.
```

---

## Para gastar menos tokens
- Una fase por mensaje y /clear entre fases.
- Si una fase se alarga, escribe /compact.
- Pide cambios concretos: "el botón más grande y con texto blanco", no "mejóralo".
- No pegues fotos ni código en el chat si ya están en la carpeta: dile el nombre del archivo.
