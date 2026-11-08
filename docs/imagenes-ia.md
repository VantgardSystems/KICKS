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

Los mismos prompts funcionan en Kling con `kling-image-v3_0_omni`. La foto de día va como texto a imagen, en 2K y 16:9. La de noche va como imagen a imagen, con la foto de día como `image_1`. Después corren `herramientas/preparar-hero.py` y ajustan `CONFIG.hero.porche` y `CONFIG.hero.techo` en `assets/js/ecowatt.js`.
