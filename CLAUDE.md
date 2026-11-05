# Sneaker District (tienda de tenis, demo)

Slogan: "Originales o nada." Página única, venta por WhatsApp, público de 16 a 30 años en México.
Lo marcado con [EDITAR] se queda así: lo cambia el dueño.

## Archivos
- index.html, styles.css, main.js
- products.js: ya hecho (tienda, 9 tenis, colores, temas del hero, rutas, lanzamientos, reseñas). Úsalo; solo puedes agregar líneas cuando un prompt lo pida.
- assets/img/*.webp (fotos web, 1600 px), assets/spin/{id}-{slug}/00.webp... (cuadros del giro 360), assets/video/*.mp4
- assets/_originales/ (fotos 4K, videos crudos, hojas de contacto; no se publican)

## Stack (no cambiar)
- HTML + CSS + JS puro, sin frameworks ni build.
- GSAP 3.13.0 (gsap y Draggable): https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js y .../dist/Draggable.min.js
- Fuentes: https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600&display=swap
- El "3D" es un giro 360 hecho con cuadros de video en un <canvas>. No usar model-viewer.

## Diseño
- Colores fijos de marca: carbón #1C1C1E, rojo #C8102E, cemento #9A9B9F (solo sobre fondos oscuros), gris de texto #55565A (sobre fondos claros), cemento claro #ECECED, blanco.
- Títulos Archivo Black (400, letter-spacing -0.02em, line-height 0.95). Texto Archivo 400/500; botones 600.
- Sin etiquetas chiquitas en MAYÚSCULAS sobre los títulos. Sin "→" en botones. Botones con verbo. Íconos SVG de trazo, nunca emojis.
- Números 1-2-3 solo en "Cómo comprar". No animar cada sección al hacer scroll. Lo memorable es el hero; lo demás, sobrio.
- Contraste WCAG AA. Móvil primero (375, 768, 1280). Foco visible. Respetar prefers-reduced-motion.

## Movimiento
- Controles (botones, tallas, bolitas, indicadores, menú): solo 100/150/200/300 ms, ease-out al entrar, ease-in al salir, sin rebote, solo transform y opacity.
- Escaparate del hero (tenis, fondo, nombre gigante): excepción documentada, hasta 800 ms, definido en el prompt del hero.
- Stagger máximo 30 ms por elemento y 200 ms en total. Toda animación se puede interrumpir.
- Sin loops decorativos infinitos. El giro automático del tenis se pausa fuera de pantalla.

## Skills: cuándo usar cada una
- frontend-design: antes de escribir cualquier UI.
- emil-design-eng: toda animación, easing, duración y microinteracción.
- GSAP skills: Draggable y timelines del hero.
- ui-ux-pro-max: solo en la revisión final.
- kling-ai-generate-image y kling-ai-generate-video: fotos y videos.

## Reglas de Kling
- SIEMPRE revisa créditos y cotiza antes; dime el costo y espera mi OK. Nunca generes en lote sin aprobación ni reintentes solo.
- Primero UNA prueba; espera que la apruebe antes de seguir.
- Tenis originales sin logos ni marcas, como dicen los prompts.
- Fotos: perfil lateral exterior, punta a la derecha, mismo encuadre y luz, fondo blanco liso, 1:1, 4k. La foto maestra aprobada es la referencia de composición de todas.
- Quitar fondos con rembg (modelo birefnet-general) en la computadora, no con créditos.

## Forma de trabajar (ahorrar tokens)
- Una fase por mensaje. No rehagas lo terminado. No leas archivos que no vas a tocar.
- Respuestas cortas: qué archivos cambiaste y qué debo revisar. Sin pegar código completo.
- Al terminar cada fase, ofréceme 2 o 3 extras opcionales con AskUserQuestion y espera. No agregues nada que no apruebe.
