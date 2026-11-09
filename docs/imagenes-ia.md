# Imágenes generadas con IA

Kling no tenía créditos, así que las imágenes se generaron con **Higgsfield**, con los créditos disponibles en la cuenta: 1.15 de 1.2.

| Archivo | Modelo | Uso en la página |
|---|---|---|
| `assets/img/hero/dia-*` | Seedream 5.0 Flash, 2K, texto a imagen | Hero de día |
| `assets/img/hero/noche-*` | Seedream 5.0 Flash, 2K, editando la foto de día | Hero de noche, la misma casa y el mismo encuadre |
| `assets/img/secciones/casa*` | Recorte de la foto de día | Tarjeta "Para tu casa" |
| `assets/img/secciones/industria*` y `negocio*` | Z-Image, 16:9 | Tarjetas "Para tu industria" (vista amplia) y "Para tu negocio" (acercamiento a los paneles) |

Las tarjetas de "Sistemas aislados" y de los 8 proyectos usan **ilustraciones SVG**, no fotos. Las de los proyectos dicen "Foto real pendiente".

> Honestidad: son imágenes generadas, no proyectos de Ecowatt. En la página llevan la etiqueta "Imagen ilustrativa" y nunca se usan en "Proyectos" ni en "Quiénes somos". Esas secciones esperan fotos reales.

## Cómo se arma el hero

Cada hora del día usa 3 archivos, generados por `herramientas/preparar-hero.py` a partir de una sola foto:

- `*-suelo`: la foto completa. La página solo muestra la parte de abajo (jardín y barda).
- `*-casa`: la casa recortada, sin cielo (WebP con transparencia).
- `*-cielo`: el cielo sin la casa, desenfocado.

Cada archivo se exporta en dos tamaños: el grande para computadora y el chico (`-1280`, `-800`) para celular.

```
python3 herramientas/preparar-hero.py foto-dia.png assets/img/hero dia
python3 herramientas/preparar-hero.py foto-noche.png assets/img/hero noche
```

Para que el recorte salga limpio, la foto necesita un cielo despejado y liso arriba, sin árboles ni cables detrás de la casa.

## Prompts usados

**Hero de día** (Seedream 5.0 Flash, 16:9, 2K):

```
Ultra-realistic architectural photograph for a website hero, 16:9. A contemporary
two-story Mexican house in a residential neighborhood of León, Guanajuato: smooth
charcoal-gray stucco walls with warm wood accents, large dark-framed windows, a
wooden front door with a small porch light on the right side of the facade, a low
stone front wall with agaves, lavender and low shrubs. Flat roof with a neat array
of dark blue monocrystalline solar panels on aluminum racks tilted toward the sun,
and a black rooftop water tank. Camera slightly elevated, straight-on, 35mm lens,
so the solar panels are clearly visible. The house is centered and fills about 55%
of the image width; the top of the roof and panels begins about 42% down from the
top of the frame. The top 40% of the frame is a completely clear, cloudless sky: a
smooth gradient from deep sky blue at the top to pale warm yellow near the horizon,
bright late-morning sunlight. No trees, poles, wires or buildings behind or above
the house. Soft green lawn in the foreground. Crisp detail, natural colors, no
people, no cars, no text, no logos.
```

**Hero de noche** (Seedream 5.0 Flash, editando la foto de día):

```
Edit this exact photo: keep the same house, same camera angle, same framing, same
composition, and keep every wall, window, solar panel, water tank, stone wall and
plant in exactly the same position and size. Change only the time of day to blue
hour after sunset: a smooth clear sky gradient from deep navy blue at the top to
luminous cobalt blue near the horizon, a few faint stars, no clouds. Warm amber
light glows from every window and from the porch light by the front door, soft warm
garden uplights on the agaves and the stone wall, the solar panels reflect the dark
blue sky. Photorealistic, crisp detail, no people, no text.
```

**Techo comercial** (Z-Image, 16:9):

```
Photorealistic aerial photograph of a large flat roof of a modern commercial
warehouse in central Mexico covered with long neat rows of dark blue solar panels
on aluminum racks, bright clear midday sunlight, deep blue sky at the top edge,
crisp shadows, distant hills, professional architectural photography, natural
colors, no people, no text, no logos
```

## Si después quieren regenerarlas con Kling

Los mismos prompts funcionan en Kling con `kling-image-v3_0_omni`. La foto de día va como texto a imagen, en 2K y 16:9. La de noche va como imagen a imagen, con la foto de día como `image_1`. Después corren `herramientas/preparar-hero.py`, luego `herramientas/estilo-imagen.py` sobre los archivos de día (ver abajo), y ajustan `CONFIG.hero.porche` en `assets/js/ecowatt.js`.

## Fase 4: un solo estilo para todas las fotos

**Problema:** las fotos de la página no parecían de la misma sesión. La casa tenía luz cálida y los techos de negocio e industria, luz blanca y fría de mediodía.

**Arreglo:** `herramientas/estilo-imagen.py` da a cada foto el mismo tratamiento de color, como en un editor de fotos. No genera nada nuevo:
- altas luces hacia ámbar y sombras hacia azul petróleo, que son los colores de la marca;
- un sol bajo que entra por una esquina superior;
- un poco más de contraste y una viñeta ligera.

```
python3 herramientas/estilo-imagen.py ENTRADA SALIDA_BASE --anchos 1200 720 [--recorte 4:3] [--sol derecha|izquierda|ninguno] [--fuerza 1.0]
```

Ya se aplicó a:

| Archivos | Origen |
|---|---|
| `hero/dia-suelo`, `hero/dia-casa` (2400 y 1280) | Las capas de día del hero. Se usa el mismo tratamiento en las dos para que la casa recortada y el jardín queden igual. La transparencia se conserva |
| `hero/dia-cielo` (1600 y 800) | El cielo del hero |
| `secciones/casa`, `secciones/industria` | Los WebP anteriores |
| `secciones/negocio` | El PNG original de Higgsfield (2048 px), recortado a 4:3 |

Las fotos de noche no se tocaron.

Cualquier foto real que mande Ecowatt debe pasar por el mismo script, para que combine con el resto de la página.

## Imágenes pendientes (necesitan créditos)

La Fase 4 pide cuatro imágenes con el mismo estilo. Al hacerla:
- Kling tenía **0 créditos**.
- Higgsfield tenía **0.05**. Su modelo más barato (Z-Image) cuesta 0.15 por imagen y Seedream 5.0 Flash, 0.5.
- Un servicio gratuito (Pollinations) devolvía imágenes con marca de agua y de baja calidad.

Por eso:

| Imagen | Estado | Dónde va (Fase 5) | Archivo |
|---|---|---|---|
| Casa mexicana moderna con paneles al atardecer | **Resuelta**: es la casa del hero con la luz cálida nueva | Hero | `hero/dia-*` |
| Detalle de un panel con reflejos | **Resuelta** con FLUX.1-schnell (ver abajo) | Banda ancha en "Garantía y formas de pago" | `secciones/detalle-panel{,-720}.webp` |
| Instaladores con uniforme en un techo | **Resuelta** con FLUX.1-schnell. **Mejor una foto real** del equipo de Ecowatt en cuanto la tengan (ver la nota) | Junto al título de "Cómo funciona" | `secciones/instalacion{,-720}.webp` |
| Familia en casa con luz cálida | **Resuelta** con FLUX.1-schnell | Junto a las ventajas, **nunca como testimonio** | `secciones/familia{,-720}.webp` |

> **Nota sobre los instaladores:** una imagen de IA mostraría personas que no trabajan en Ecowatt, con un uniforme que no es el suyo. Es mejor una foto real de la cuadrilla. Si se usa IA, la ropa va sin logotipos y la imagen lleva la etiqueta "Imagen ilustrativa".

### Prompts listos

Para que las tres salgan con la misma luz que el resto, cada prompt termina con este bloque de estilo:

```
Warm late-afternoon golden-hour light, low sun from the right, long soft shadows,
deep teal-blue shadows and warm amber highlights. Candid documentary photography,
not posed, not stock-looking, real textures, 35mm lens, natural depth of field.
Setting: León, Guanajuato, Mexico. No text, no logos, no watermarks.
```

**Detalle de panel** (3:2, 2K):

```
Close-up photograph of the corner of a dark blue monocrystalline solar panel
mounted on an aluminum rail on the flat roof of a contemporary Mexican house. The
glass reflects a warm orange sunset sky with a few soft clouds; the cell grid,
thin silver busbars and the anodized frame edge are crisp. Slightly low angle
along the panel surface; the charcoal parapet and a black rooftop water tank are
softly out of focus in the background. [bloque de estilo]
```

**Instaladores** (4:3, 2K):

```
Two Mexican solar installers in plain dark teal work shirts without any logo or
text, white safety helmets and harnesses, fixing a solar panel onto aluminum rails
on the flat roof of a house in León. Candid moment in the middle of the task: one
kneels and tightens a clamp with a hand tool, the other steadies the panel. Seen
from roof level, slightly elevated; neighboring flat rooftops and water tanks in
the soft background. Faces partly turned away, not looking at the camera.
[bloque de estilo]
```

**Familia** (4:5 o 4:3, 2K):

```
A Mexican family (mother, father and a girl of about eight) in the living room of
a contemporary home in the early evening. Warm interior lamps are on; the girl
switches on a floor lamp while her parents laugh together on the sofa. A large
window shows the warm dusk outside. Natural, unposed moment, nobody looks at the
camera, lived-in details (books, a blanket, plants). [bloque de estilo]
```

**Hero al atardecer de verdad** (opcional; imagen a imagen sobre la foto de día, igual que la de noche):

```
Edit this exact photo: keep the same house, same camera angle, framing and
composition, every element in exactly the same position and size. Change only the
time of day to golden hour about 30 minutes before sunset: warm low sun from the
right, long soft shadows, a clear sky from soft blue at the top to warm peach near
the horizon, the solar panels catching warm reflections. Photorealistic, no people,
no text.
```

**Después de generarlas:**

```
python3 herramientas/estilo-imagen.py detalle.png assets/img/secciones/detalle-panel --anchos 1200 720 --recorte 3:2
python3 herramientas/estilo-imagen.py instaladores.png assets/img/secciones/instalacion --anchos 1200 720 --recorte 4:3
python3 herramientas/estilo-imagen.py familia.png assets/img/secciones/familia --anchos 1200 720 --recorte 4:3
```

En el HTML van con `loading="lazy"`, `decoding="async"`, `width` y `height`, `srcset` y `sizes`, y un `alt` que describa la escena. Las de IA llevan además la etiqueta "Imagen ilustrativa".

## Imágenes generadas con FLUX.1-schnell en AI Horde

Sin créditos en Kling ni en Higgsfield, se intentó con otras herramientas:
- **Hugging Face:** el espacio público de FLUX.1-schnell rechazó las peticiones porque se acabó la cuota gratuita anónima de GPU.
- **Pollinations:** devolvía imágenes con marca de agua y de baja calidad.
- **AI Horde** (aihorde.net) sí funcionó. Es una red gratuita de GPUs voluntarias y se usó con la clave anónima.

El modelo fue **FLUX.1-schnell**, con licencia Apache 2.0, que permite uso comercial. Cada imagen tardó de 3 a 15 minutos en la cola y se pidieron dos variantes de cada una.

| Archivo | Tamaño generado | Semilla | Variante elegida y por qué |
|---|---|---|---|
| `detalle-panel` | 1152×768 | 2627470209 | La 2: la cuadrícula de celdas es realista y tiene un tinaco de azotea. En la 1, las celdas salieron deformes |
| `instalacion` | 1152×896, recortada a 4:3 | 1925389325 | La 1: camisas lisas y manos y caras correctas. La 2 traía un logotipo en la camisa y texto basura en una esquina |
| `familia` | 1152×896, recortada a 4:3 | 1678688130 | La 1: aparece la niña y la ventana al atardecer. La 2 no tenía a la niña |

Las tres pasaron por `herramientas/estilo-imagen.py` con `--fuerza 0.6`, porque ya venían cálidas. Los prompts son los de la sección "Prompts listos", con el mismo bloque de estilo. Las tres llevan la leyenda "Imagen ilustrativa." debajo.

Para repetirlo, el cliente está en el historial del proyecto (`horde.py`): un POST a `/api/v2/generate/async` con `"models": ["Flux.1-Schnell fp8 (Compact)"]`, `steps: 4`, `cfg_scale: 1` y `sampler_name: "k_euler"`. Luego se consulta `/generate/check/{id}` hasta que diga `done` y se descarga de `/generate/status/{id}`. Ancho y alto deben ser múltiplos de 64. Se necesita un `User-Agent` propio, porque Cloudflare bloquea el de Python.
