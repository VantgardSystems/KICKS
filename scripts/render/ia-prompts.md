# Fotos del sitio con IA (Higgsfield)

Plan para reemplazar los 16 renders de `public/images/` por fotos generadas con IA,
con los mismos nombres y medidas. No hay que tocar código.

## Modelo y costo

- Modelo: **Nano Banana Pro** (`nano_banana_pro`) a **2K**.
- Costo medido: **2 créditos por foto** → 16 fotos ≈ 32 créditos, más las que haya que repetir.
- Revisa el saldo antes (`balance`) y el precio exacto con `get_cost: true` (es gratis).

## Orden

1. **3 pruebas primero**: `hero`, `tienda` y `marca`. Enseñarlas y esperar el OK.
2. Con el OK, las otras 13 (se pueden mandar en lote).
3. Revisar cada foto: sin texto, sin logos, sin marcas reales, sin objetos deformes, y que el naranja sea solo el acento.

## Procesado (igual que los renders)

Guardar cada resultado como `out/<clave>.png` y luego:

```bash
python grade.py out/<clave>.png out/g-<clave>.png   # B&N + solo el naranja, curva, aberración y grano
node publish.mjs out                                # WebP q82 + AVIF, nombre y medida final en public/images
rm -rf ../../.next/cache/images                     # que Next no sirva las versiones viejas
```

`grade.py` necesita `numpy` y `pillow`. `publish.mjs` recorta al centro (`cover`) a la medida final.

## Estilo común (va al final de cada prompt)

> Cinematic black-and-white photograph, deep rich blacks, soft directional studio light, subtle 35mm film grain,
> photorealistic, shot on a medium format camera, shallow depth of field. The only color in the whole image is one
> vivid nitro orange accent (#FB5607). Everything else is pure monochrome. No text, no logos, no lettering, no brand
> marks, no readable screens anywhere.

## Las 16 fotos

| Clave | Archivo final | Medida | Aspecto a pedir | Prompt (antes del estilo común) |
| --- | --- | --- | --- | --- |
| `hero` | hero-bg | 2400×1350 | 16:9 | Extreme close-up of the rear flank of a matte black sports car, a sharp body crease rising toward the rear wheel arch, glossy clear coat catching a long soft highlight. One thin line of orange light runs along the crease. The car fills the right two thirds of the frame; the left third falls into soft shadow and receding depth of the same studio, calm enough for a headline. |
| `hero-m` | hero-bg-mobile | 1080×1920 | 9:16 | Vertical close-up of the rear flank of a matte black sports car, the body crease and wheel arch in the upper half, one thin line of orange light along the crease. The lower half is the same dark studio floor fading into soft shadow, calm enough for text. |
| `dunes` | hero-dunes | 2400×1350 | 16:9 | Wide view of desert sand dunes at dusk, sharp wind-carved ridges with fine ripples, long low shadows. A thin band of orange glow sits right on the horizon line. The dunes fill the frame edge to edge. |
| `cta` | cta-bg | 2400×1000 | 21:9 | Low raking light across close sand dune ripples, no horizon and no sky, the ripples fill the frame edge to edge. A single ridge on the right catches a soft orange light. The center stays calm and even for text. |
| `landing` | servicio-landing | 1000×1000 | 1:1 | A single frosted glass pane standing upright on a polished black stone floor, warm orange light glowing softly through it from behind. Centered, generous space around it. |
| `sitio` | servicio-sitio | 1000×1000 | 1:1 | Three frosted glass panes standing upright, staggered in depth on a polished black stone floor, orange light glowing through the farthest pane. |
| `tienda` | servicio-tienda | 1000×1000 | 1:1 | A matte black paper shopping bag with orange rope handles standing on a round black stone pedestal. Plain bag, no print at all. Centered, the whole bag and its handles visible with margin. |
| `citas` | servicio-citas | 1000×1000 | 1:1 | A minimal matte black desk clock with a plain face and no numbers, a thin orange second hand, on a dark stone surface. |
| `agente` | servicio-agente | 1000×1000 | 1:1 | A clear glass cube on black stone with a softly glowing orange sphere floating inside it, reflections on the glass edges. |
| `mantenimiento` | servicio-mantenimiento | 1000×1000 | 1:1 | Macro photo of interlocking watch gears in brushed steel, one single gear in orange, crisp teeth, shallow focus. |
| `diagnostico` | proceso-diagnostico | 1200×900 | 4:3 | A magnifying glass resting over a dark textured stone surface, an orange rim light along the lens edge, the texture magnified inside the lens. |
| `sandbox` | proceso-sandbox | 1200×900 | 4:3 | A small clear glass cube on a wide black stone surface with a small orange glowing sphere inside, seen from a little distance, lots of calm surface around it. |
| `marca` | proceso-marca | 1200×900 | 4:3 | A fan of material swatches spread on dark stone: paper, linen, brushed metal and leather in shades of grey, with one single swatch in orange. Top-down angle, slight perspective. |
| `lanzamiento` | proceso-lanzamiento | 1200×900 | 4:3 | Long exposure of a single orange light trail streaking from the lower left to the upper right through a dark concrete tunnel, the tunnel walls in soft monochrome. |
| `historia` | historia | 1920×1080 | 16:9 | A designer's desk at night in a dark studio: a closed laptop, paper sketches of layouts with no readable writing, a pencil, a ceramic cup. One small orange desk lamp casts a warm pool of light. Wide shot with calm space on the left. |
| `404` | 404 | 1000×1000 | 1:1 | An unplugged cable lying on a black concrete floor, its plug ending in an orange connector, the loose end facing the camera. Centered with margin. |
