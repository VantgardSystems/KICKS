# GEM · Grupo Eléctrico Mexicano — Sitio web

Página de una sola sección para **instalación de paneles solares en León, Guanajuato**.
Todo el diseño y los textos llevan al visitante a pedir su cotización por WhatsApp o
con el formulario.

- HTML5 + CSS3 + JavaScript sin librerías ni proceso de compilación.
- Listo para subir a cualquier hosting compartido (solo copia los archivos).
- Mobile-first, de 375 px a 1440 px. Accesible (teclado, lectores de pantalla, movimiento reducido).

## Hero Mañana / Noche

El hero muestra una casa con paneles solares a pantalla completa. Con el selector **Mañana / Noche**
la casa se hunde en la niebla, cambia de hora en el punto más hondo y vuelve a subir con la nueva luz.

- Cinco capas: cielo fijo → casa (solo se mueve en Y) → desenfoque inferior → niebla WebGL2 → textos.
- Un solo reloj (`requestAnimationFrame`) en `iniciarHero()` de `main.js` controla todo y escribe
  `--k` (0 mañana, 1 noche), `--k2`, `--dip` y `--sink`. Los colores se mezclan con `color-mix()`.
- La niebla es un shader generado (no es video): nunca se repite. Baja su resolución sola si el equipo
  es lento, y en equipos sin GPU se usa una niebla de respaldo en CSS.
- Tiempos editables en `HERO_TIEMPOS` (`main.js`). Para depurar la niebla en un equipo sin GPU,
  abre la página con `?niebla=software`.
- Primero se pintan el titular y el cielo; la casa de noche se pide justo después y la de mañana
  cuando la página ya cargó.

## Estructura

```
index.html          Página completa, SEO local, Open Graph y JSON-LD (LocalBusiness)
css/styles.css      Estilos. Colores, tipografías y medidas en :root
js/main.js          CONFIG del negocio, constantes de la calculadora y funciones
assets/img/         Fotos del hero y de secciones (WebP), logo, favicon e imagen para redes (ver LEEME.md y CREDITOS.md)
```

## Cómo personalizarlo

1. **Datos del negocio**: edita el objeto `CONFIG` al inicio de `js/main.js`
   (teléfono, WhatsApp, correo, dirección, horario, años, instalaciones, redes, mapa…).
   Se actualizan solos en todo el sitio.
2. **Calculadora**: ajusta `CALCULADORA` en `js/main.js` (precio del kWh, horas sol pico,
   potencia del panel, eficiencia, costo por kW, % de ahorro).
3. **Mensajes de WhatsApp**: edita `MENSAJES_WA` en `js/main.js`.
4. **SEO**: en `index.html` reemplaza `[DOMINIO]` en las etiquetas Open Graph, activa la línea
   `canonical` y completa el bloque JSON-LD.
5. **Contenido de ejemplo**: los proyectos y testimonios están marcados con
   `EJEMPLO – reemplazar por reales`; las opciones de pago con `[CONFIRMAR OPCIONES]`.
   Las fotos de proyectos, servicios y "Por qué GEM" son de stock (Pexels): cámbialas por fotos reales.
6. Al publicar, cambia `resaltarMarcadores` a `false` en `CONFIG`.

Para buscar todo lo pendiente: busca el texto `[` en `index.html` y `js/main.js`.

## Probar en tu computadora

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Medición de conversiones

`main.js` envía eventos a `window.dataLayer` (`click_whatsapp`, `formulario_enviado`,
`chat_completado`, `calculadora_a_formulario`, `faq_abierta`, `chat_abierto`, `hero_hora`).
Si instalas Google Tag Manager o GA4, llegan sin tocar el código.
