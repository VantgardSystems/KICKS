"""Prepara las imágenes del hero: recorte de la casa (sin cielo), suelo y cielo sin casa.

Método: cada columna se recorre de arriba hacia abajo siguiendo el color del cielo,
que cambia poco a poco. Donde el color salta de golpe durante varias filas seguidas
empieza la casa (o los árboles del horizonte). Así funciona con degradados y con el
halo del sol, y las estrellas sueltas no cortan el cielo.

Uso: python3 herramientas/preparar-hero.py foto.png assets/img/hero dia   (o noche)
Requiere Python 3 con numpy y Pillow.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

foto, salida, prefijo = sys.argv[1], sys.argv[2], sys.argv[3]
UMBRAL = 26.0      # salto de color que marca el borde
FILAS = 4          # filas seguidas que debe durar el salto
LIMITE = 0.86      # más abajo de esto todo es casa o jardín

im = Image.open(foto).convert('RGB')
W, H = im.size
a = np.asarray(im).astype(np.float32)

seguimiento = a[0].copy()
techo = np.full(W, int(H * LIMITE))
listo = np.zeros(W, bool)
racha = np.zeros(W, int)
color_borde = np.zeros((W, 3), np.float32)
for y in range(1, int(H * LIMITE)):
    d = np.sqrt(((a[y] - seguimiento) ** 2).sum(axis=1))
    salto = d > UMBRAL
    racha = np.where(salto & ~listo, racha + 1, 0)
    nuevos = (racha >= FILAS) & ~listo
    techo[nuevos] = y - FILAS + 1
    color_borde[nuevos] = seguimiento[nuevos]
    listo |= nuevos
    sigue = ~salto & ~listo
    seguimiento[sigue] = seguimiento[sigue] * 0.85 + a[y][sigue] * 0.15
color_borde[~listo] = seguimiento[~listo]
# Suaviza el color de relleno entre columnas para que el cielo sin casa no tenga rayas.
ventana = max(3, W // 8)
nucleo = np.ones(ventana) / ventana
color_borde = np.stack([np.convolve(np.pad(color_borde[:, c], ventana, mode='edge'), nucleo, mode='same')[ventana:-ventana] for c in range(3)], axis=1)

# Quita picos de una sola columna (ruido) sin redondear esquinas.
pad = np.pad(techo, 1, mode='edge')
techo = np.median(np.stack([pad[:-2], pad[1:-1], pad[2:]]), axis=0).astype(int)

filas = np.arange(H)[:, None]
masc = (filas >= techo[None, :]).astype(np.float32)
alfa = Image.fromarray((masc * 255).astype(np.uint8)).copy()
alfa = alfa.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.9))
recorte = im.copy()
recorte.putalpha(alfa)

# Cielo sin casa: arriba del techo, el cielo original; abajo, el color del borde.
cielo = a.copy()
debajo = filas >= techo[None, :]
cielo = np.where(debajo[:, :, None], color_borde[None, :, :], cielo)
cielo_img = Image.fromarray(np.clip(cielo, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(10))

for ancho, sufijo in [(2400, ''), (1280, '-1280')]:
    alto = round(H * ancho / W)
    im.resize((ancho, alto), Image.LANCZOS).save(f'{salida}/{prefijo}-suelo{sufijo}.webp', quality=82, method=6)
    recorte.resize((ancho, alto), Image.LANCZOS).save(f'{salida}/{prefijo}-casa{sufijo}.webp', quality=86, method=6)
for ancho, sufijo in [(1600, ''), (800, '-800')]:
    alto = round(H * ancho / W)
    cielo_img.resize((ancho, alto), Image.LANCZOS).save(f'{salida}/{prefijo}-cielo{sufijo}.webp', quality=80, method=6)

ctrl = Image.new('RGBA', (W, H), (255, 0, 255, 255))
ctrl.alpha_composite(recorte.convert('RGBA'))
ctrl.convert('RGB').resize((960, round(960 * H / W))).save(f'{salida}/control-{prefijo}.jpg', quality=85)
print(prefijo, 'techo entre', round(techo.min() / H, 3), 'y', round(techo.max() / H, 3), 'columnas sin borde:', int((~listo).sum()))
