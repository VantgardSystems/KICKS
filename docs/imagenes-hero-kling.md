# Imágenes del hero de día y noche (Kling AI)

El hero usa hoy **imágenes temporales**: las de la referencia "Lumen Roof", una casa de campo genérica. Sirven para ver el efecto funcionando, pero no son de León ni de Ecowatt. Hay que cambiarlas antes de publicar.

> Estado: la cuenta de Kling conectada tiene **0 créditos**, así que todavía no se generaron. Al recargar, estos prompts están listos para usarse tal cual.

## Qué imágenes necesita el hero

Cada hora del día usa 3 archivos, alineados entre sí al píxel:

| Archivo | Qué es | Cómo se obtiene |
|---|---|---|
| `foto-dia` | Foto completa de día (casa, jardín y cielo) | Kling, texto a imagen |
| `foto-noche` | La misma foto de noche | Kling, imagen a imagen a partir de `foto-dia` |
| `casa-dia` / `casa-noche` | La casa recortada con fondo transparente (sin cielo) | Quitar el cielo de cada foto (remover fondo) |
| `cielo-dia` / `cielo-noche` | Solo el cielo y el horizonte, sin casa | Kling, imagen a imagen ("quita la casa"), o rellenar el hueco de la casa y desenfocar |

## Prompt 1: foto de día (texto a imagen)

- Modelo: `kling-image-v3_0_omni` · Resolución: `2k` · Proporción: `16:9` · 1 imagen

```
Photorealistic architectural photograph for a website hero, 16:9. A contemporary
two-story house in a residential neighborhood of León, Guanajuato, Mexico: smooth
charcoal-gray stucco walls with warm wood accents, large windows, a wooden front
door with a small porch light, a low front wall with agaves, lavender and low
shrubs. Flat roof with a neat row of dark blue solar panels on aluminum racks
tilted toward the sun, and a black rooftop water tank. Camera slightly elevated
(about 6 m), straight-on, 35 mm lens, so the solar panels are clearly visible.
The house is centered in the lower half of the frame and fills about 60% of the
width; the roof starts around 45% from the top. The upper 45% of the frame is
clear, empty sky in soft late-morning light, pale blue with a warm haze near the
horizon, with no trees or cables behind the house. Natural colors, crisp detail,
no people, no cars, no text, no logos.
```

Por qué así: el cielo limpio arriba deja espacio para el titular, los botones y el menú. La fachada oscura contra el cielo claro hace que el recorte de la casa salga limpio.

## Prompt 2: foto de noche (imagen a imagen)

- Modelo: `kling-image-v3_0_omni` · Entrada: `image_1` = la foto de día · Resolución: `2k` · Proporción: `16:9` · 1 imagen

```
Same house, same camera, same framing and architecture as 图片1. Change only the
time of day: blue hour after sunset, deep navy sky fading to luminous blue near
the horizon, warm amber light glowing from every window and from the porch light,
soft garden lights, solar panels reflecting the dark sky. Keep every wall, window,
panel and plant in exactly the same position. No people, no text.
```

## Prompt 3 (opcional): cielos sin casa (imagen a imagen, uno por cada foto)

```
Same photo as 图片1, but remove the house, the wall and the rooftop equipment
completely. Keep only the sky and a distant, softly blurred horizon of fields and
trees, with the same light and colors. No buildings, no people, no text.
```

## Cómo integrarlas

1. Guarda los 6 archivos en `assets/img/hero/` en formato WebP, a 2560 px de ancho (los recortes, en WebP con transparencia).
2. En `index.html` (sección `<!-- 2. Hero de día y noche -->`), reemplaza las 6 URLs temporales. Las de noche van en `data-src`, porque se cargan después.
3. En `assets/js/ecowatt.js`, ajusta `CONFIG.hero`:
   - `imagen`: el tamaño real de las fotos.
   - `porche`: dónde está la luz del porche en la foto de noche (de 0 a 1), para el brillo ámbar de la niebla.
   - `techo`: dónde empieza el techo (de 0 a 1 desde arriba). En escritorio, la casa se acomoda sola debajo de los botones.
4. Cambia los textos alternativos si la casa nueva es distinta.

Nota de honestidad: son imágenes generadas, no un proyecto de Ecowatt. No las uses en "Proyectos" ni las presentes como una instalación real.
