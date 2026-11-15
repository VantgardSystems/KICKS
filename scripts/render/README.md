# Fotografía del sitio (renders)

Las 16 imágenes de `public/images/` salen de estas escenas de Blender (Cycles) con un grade común.
Si después las reemplazas por fotos de IA, usa los mismos nombres y medidas.

```bash
python -m venv .venv && .venv/bin/pip install bpy==5.3.0 pillow
.venv/bin/python scenes.py hero 2400 1350 128 out/hero.png   # una escena
.venv/bin/python grade.py out/hero.png out/g-hero.png         # grade B&N + naranja, grano y aberración
node publish.mjs out                                           # WebP q82 + AVIF en public/images
```
