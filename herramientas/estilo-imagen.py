"""Da a una foto el estilo visual de Ecowatt y la exporta en WebP, en dos tamaños.

El estilo es luz cálida de atardecer con sombras azul petróleo, para que todas
las fotos de la página se vean de la misma sesión:
  - altas luces hacia ámbar y sombras hacia azul verdoso (los colores de la marca),
  - un sol bajo que entra por una esquina (screen suave),
  - un poco más de contraste y una viñeta ligera.

Sirve para las imágenes generadas con IA y, sobre todo, para las fotos reales
que mande Ecowatt: así todas quedan con la misma luz.

Uso:
  python3 herramientas/estilo-imagen.py ENTRADA SALIDA_BASE [--anchos 1200 720]
         [--recorte 4:3] [--sol derecha|izquierda|ninguno] [--fuerza 1.0]

Ejemplo:
  python3 herramientas/estilo-imagen.py fotos/techo.jpg assets/img/secciones/techo --anchos 1200 720 --recorte 4:3
  → assets/img/secciones/techo.webp (1200 px) y assets/img/secciones/techo-720.webp

Una imagen con transparencia (PNG o WebP con canal alfa) conserva su alfa.
Requiere Pillow y NumPy.
"""
import argparse
import pathlib

import numpy as np
from PIL import Image

AMBAR = np.array([1.00, 0.92, 0.81])      # multiplicador de altas luces (cálido)
PETROLEO = np.array([0.86, 0.98, 1.04])   # multiplicador de sombras (azul verdoso)
SOL = np.array([1.00, 0.72, 0.42])        # color del sol bajo


def suave(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def estilo(rgb, fuerza=1.0, sol='derecha'):
    """rgb: arreglo float 0–1 de forma (alto, ancho, 3). Devuelve el arreglo con el estilo aplicado."""
    h, w, _ = rgb.shape
    lum = (rgb * [0.2126, 0.7152, 0.0722]).sum(-1, keepdims=True)

    # 1. Tonos divididos: altas luces cálidas, sombras azul petróleo
    alto = suave(0.40, 1.0, lum) * 0.75 * fuerza
    bajo = (1 - suave(0.0, 0.55, lum)) * 0.9 * fuerza
    out = rgb * (1 - alto) + rgb * AMBAR * alto
    out = out * (1 - bajo) + out * PETROLEO * bajo

    # 2. Balance general un poco más cálido
    out = out * (1 + np.array([0.03, 0.0, -0.05]) * fuerza)

    # 3. Sol bajo desde una esquina superior (mezcla screen)
    if sol != 'ninguno':
        yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
        cx = w * (1.05 if sol == 'derecha' else -0.05)
        cy = h * -0.10
        d = np.sqrt(((xx - cx) / w) ** 2 + ((yy - cy) / h) ** 2)
        luz = (np.exp(-(d ** 2) * 1.6) * 0.28 * fuerza)[..., None]
        out = 1 - (1 - out) * (1 - SOL * luz)

    # 4. Contraste en S suave y un poco más de saturación
    out = np.clip(out, 0, 1)
    out = out + (out - out * out) * (out - 0.5) * 0.35 * fuerza
    gris = (out * [0.2126, 0.7152, 0.0722]).sum(-1, keepdims=True)
    out = gris + (out - gris) * (1 + 0.06 * fuerza)

    # 5. Viñeta ligera
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r2 = ((xx / w - 0.5) ** 2 + (yy / h - 0.5) ** 2) * 2
    out = out * (1 - 0.14 * fuerza * r2[..., None] ** 1.2)
    return np.clip(out, 0, 1)


def recortar(im, proporcion):
    a, b = (float(x) for x in proporcion.split(':'))
    objetivo = a / b
    w, h = im.size
    if w / h > objetivo:
        nw = round(h * objetivo)
        x = (w - nw) // 2
        return im.crop((x, 0, x + nw, h))
    nh = round(w / objetivo)
    y = (h - nh) // 2
    return im.crop((0, y, w, y + nh))


def procesar(entrada, salida_base, anchos=(1200, 720), proporcion=None, sol='derecha', fuerza=1.0, calidad=82):
    im = Image.open(entrada)
    alfa = im.getchannel('A') if im.mode in ('RGBA', 'LA') else None
    im = im.convert('RGB')
    if proporcion:
        if alfa is not None:
            raise SystemExit('No recortes imágenes con transparencia: se desalinean de sus otras capas.')
        im = recortar(im, proporcion)
    arr = np.asarray(im, dtype=np.float32) / 255
    res = Image.fromarray((estilo(arr, fuerza, sol) * 255 + 0.5).astype(np.uint8))
    if alfa is not None:
        res.putalpha(alfa)
    salida_base = pathlib.Path(salida_base)
    salida_base.parent.mkdir(parents=True, exist_ok=True)
    hechos = []
    for i, ancho in enumerate(anchos):
        ancho = min(ancho, res.width)
        alto = round(res.height * ancho / res.width)
        nombre = salida_base.with_name(salida_base.name + ('' if i == 0 else f'-{ancho}') + '.webp')
        res.resize((ancho, alto), Image.LANCZOS).save(nombre, 'WEBP', quality=calidad, method=6)
        hechos.append(f'{nombre} ({ancho}×{alto}, {nombre.stat().st_size // 1024} KB)')
    return hechos


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('entrada')
    ap.add_argument('salida_base', help='ruta sin extensión; el primer ancho se guarda sin sufijo')
    ap.add_argument('--anchos', type=int, nargs='+', default=[1200, 720])
    ap.add_argument('--recorte', help='proporción, por ejemplo 4:3 o 16:9')
    ap.add_argument('--sol', choices=['derecha', 'izquierda', 'ninguno'], default='derecha')
    ap.add_argument('--fuerza', type=float, default=1.0, help='0 = sin cambios, 1 = estilo completo')
    ap.add_argument('--calidad', type=int, default=82)
    a = ap.parse_args()
    for linea in procesar(a.entrada, a.salida_base, a.anchos, a.recorte, a.sol, a.fuerza, a.calidad):
        print(linea)
