# Sneaker District (tienda de tenis, demo)

Slogan: "Originales o nada." Página única, venta por WhatsApp, público de 16 a 30 años en México.
Lo marcado con [EDITAR] se queda así: lo cambia el dueño.

## Archivos
- index.html, styles.css, main.js
- products.js: YA ESTÁ HECHO (tienda, 9 tenis, colores, temas del hero, rutas, lanzamientos, reseñas). Úsalo, no lo reescribas.
- assets/img/*.webp, assets/models/*.glb, assets/video/*.mp4, assets/_originales/ (fotos sin procesar, no se publican)

## Stack (no cambiar)
- HTML + CSS + JS puro, sin frameworks ni build.
- model-viewer: https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js (type="module")
- GSAP 3.13.0 (solo gsap y Draggable): https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js y .../dist/Draggable.min.js
- Fuentes: https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600&display=swap

## Diseño
- Colores fijos de marca: carbón #1C1C1E, rojo #C8102E, cemento #9A9B9F (solo sobre fondos oscuros), gris de texto #55565A (sobre fondos claros), cemento claro #ECECED, blanco.
- Títulos Archivo Black (400, letter-spacing -0.02em, line-height 0.95). Texto Archivo 400/500; botones 600.
- Escala: h1 clamp(3rem,10vw,8rem); h2 clamp(2rem,4.5vw,3.25rem); cuerpo 1rem/1.6.
- Sin etiquetas chiquitas en MAYÚSCULAS sobre los títulos. Sin "→" en botones. Botones con verbo.
- Números 1-2-3 solo en "Cómo comprar". Íconos SVG de trazo, nunca emojis.
- No animar cada sección al hacer scroll. Lo memorable es el hero; lo demás, sobrio.
- Contraste WCAG AA. Móvil primero (375, 768, 1280). Foco visible. Respetar prefers-reduced-motion.

## Hero (lo más importante)
- Cada color de products.js trae su tema. Header + hero usan variables CSS (--bg, --ink, --muted, --disc, --big, --accent, --on) que JS cambia; transición de 700 ms cubic-bezier(.2,.8,.2,1) en background-color y color.
- Capas: fondo del tema; nombre corto gigante (color big) detrás; círculo grande (color disc) detrás del tenis; tenis al centro; tenis anterior y siguiente a los lados (imagen WebP, escala .7, inclinados, opacidad .3; ocultos en celular).
- Tenis central: un solo <model-viewer> (cambiar su src, no crear varios) con camera-controls, auto-rotate lento, disable-zoom, touch-action="pan-y" y poster = la imagen WebP. Arrastrarlo lo gira 360°.
- Si el .glb no existe o falla: muestra la imagen WebP con inclinación 3D al mover el puntero (rotateX/Y máx. 15°, perspective 1200px).
- Cambiar de par: flechas, teclado izquierda/derecha, barrita de 9 indicadores y deslizar con GSAP Draggable en la zona de abajo del tenis (no encima del modelo, para no chocar con el giro).
- Animación al cambiar de par: el tenis entra desde el lado hacia el que avanzas (x ±120px, giro leve, opacidad 0 a 1, 800 ms); círculo y nombre gigante entran con él. Al cambiar solo de color: fade + escala .92 a 1.
- Reposo: el tenis flota 16px en un ciclo de 5 s; sombra elíptica que se encoge cuando sube.
- Debajo: marca, nombre, precio (formatPrice), bolitas de color de dos tonos, tallas (SIZES) y botón "Pedir por WhatsApp" con mensaje prellenado (modelo, color, talla).
- Con reduced motion: sin flotado, sin auto-rotate ni inclinación, cambios sin animación.

## Secciones (en orden)
1. Header (usa el tema del hero) 2. Hero 3. Marcas (nombres en Archivo Black, sin logos; al tocar, carga su primer tenis en el hero) 4. Lanzamientos (DROPS; fondo de cada tarjeta = theme.bg de ese color) 5. Más vendidos (todos los PRODUCTS; mosaico con theme.bg del primer color; al tocar, carga en el hero y sube) 6. Garantía de originalidad (banda carbón con textura de puntitos tipo cemento) 7. Cómo comprar y envíos 8. Reseñas (REVIEWS) 9. Preguntas frecuentes (<details>, sin JS) 10. Avísame del próximo drop (abre WhatsApp con mensaje) 11. Footer + botón flotante verde de WhatsApp con texto "Contacto".

## Skills: cuándo usar cada una
- frontend-design: antes de escribir cualquier UI.
- emil-design-eng: toda animación, easing, duración y microinteracción.
- GSAP skills: Draggable del carrusel y timelines del hero.
- ui-ux-pro-max: solo en la revisión final.
- Higgsfield (MCP): fotos, modelos 3D y video. Ver reglas abajo.

## Reglas de Higgsfield (fotos, 3D, video)
- SIEMPRE cotiza antes (get_cost), dime cuántos créditos son y espera mi OK. Nunca generes en lote sin aprobación.
- Genera primero UNA prueba y espera que la apruebe antes de seguir.
- Fotos: todas iguales: perfil lateral exterior, punta a la derecha, mismo encuadre y luz, fondo blanco liso, 1:1. Usa la primera foto aprobada como imagen de referencia para todas las demás.
- Después: quitar fondo, recortar con 6% de margen, WebP de 1200px de ancho y menos de 200 KB. Nombre exacto según products.js (img).
- 3D: image_to_3d desde la foto aprobada (multi_image_to_3d con 2 a 4 vistas si sale deforme). Comprimir con gltf-transform a menos de 5 MB. Nombre según products.js (glb).
- Video: solo si te lo pido.

## Forma de trabajar (ahorrar tokens)
- Una fase por mensaje. No rehagas lo terminado. No leas archivos que no vas a tocar.
- Respuestas cortas: qué archivos cambiaste y qué debo revisar. Sin pegar código completo.
- Al terminar cada fase, ofréceme 2 o 3 extras opcionales con la herramienta AskUserQuestion (opciones para elegir) y espera. No agregues nada que no apruebe.
