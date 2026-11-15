"""Grade común: B&N con solo el naranja intenso, negros profundos, contraste ligero,
grano de 35 mm y aberración cromática muy sutil. Uso: python grade.py in.png out.png [seed]"""
import sys

import numpy as np
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
seed = int(sys.argv[3]) if len(sys.argv) > 3 else 1
im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32) / 255.0
h, w, _ = im.shape

# 1) Selectivo: conservar solo naranjas saturados; el resto a B&N con un toque frío.
mx = im.max(-1)
mn = im.min(-1)
sat = np.where(mx > 1e-4, (mx - mn) / np.maximum(mx, 1e-4), 0)
r, g, b = im[..., 0], im[..., 1], im[..., 2]
hue = np.degrees(np.arctan2(np.sqrt(3) * (g - b), 2 * r - g - b)) % 360
hue_w = np.clip(1 - np.abs(hue - 22) / 22, 0, 1)
sat_w = np.clip((sat - 0.38) / 0.3, 0, 1)
val_w = np.clip((mx - 0.08) / 0.15, 0, 1)
keep = (hue_w * sat_w * val_w)[..., None]
luma = (0.2126 * r + 0.7152 * g + 0.0722 * b)[..., None]
mono = luma * np.array([0.985, 1.0, 1.03], np.float32)
out = mono * (1 - keep) + im * keep

# 2) Curva: negros profundos y contraste ligero.
x = np.clip(out, 0, 1)
x = np.clip((x - 0.012) / 0.988, 0, 1)
x = x ** 1.08
x = x + 0.08 * np.sin(np.pi * x) * (x - 0.5) * 2  # S suave
out = np.clip(x, 0, 1)

# 3) Aberración cromática radial muy sutil.
yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
cx, cy = (w - 1) / 2, (h - 1) / 2


def sample(ch, k):
    sx = np.clip(cx + (xx - cx) * k, 0, w - 1)
    sy = np.clip(cy + (yy - cy) * k, 0, h - 1)
    x0 = sx.astype(np.int32)
    y0 = sy.astype(np.int32)
    return ch[y0, x0]


ca = 0.0007
out[..., 0] = sample(out[..., 0], 1 - ca)
out[..., 2] = sample(out[..., 2], 1 + ca)

# 4) Viñeta suave.
d = np.sqrt(((xx - cx) / cx) ** 2 + ((yy - cy) / cy) ** 2)
vig = 1 - 0.18 * np.clip(d - 0.55, 0, 1) ** 1.6
out *= vig[..., None]

# 5) Grano de película (más en medios tonos).
rng = np.random.default_rng(seed)
grain = rng.normal(0, 1, (h, w)).astype(np.float32)
lum = out.mean(-1)
amp = 0.028 * (0.35 + 1.3 * lum * (1 - lum))
out += (grain * amp)[..., None]

Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8)).save(dst)
print("graded", dst)
