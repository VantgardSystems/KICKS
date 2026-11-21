#!/usr/bin/env python3
"""
Prepara las fotos del hero (slider de colorways) para la plantilla de tienda.

Entrada  assets/raw/<colorway>-shoe.png     foto del tenis (perfil, punta a la derecha)
         assets/raw/<colorway>-pieces.png   3 objetos en fila (izquierda=1, centro=2, derecha=3)
Salida   assets/kicks/<colorway>-shoe.webp            recortado, sin fondo, máx. 1600 px de ancho
         assets/kicks/<colorway>-piece-1|2|3.webp     cada pieza recortada, máx. 800 px
         assets/kicks/_check.png                      hoja de contacto para revisar los recortes

Uso      pip install "rembg[cpu]" pillow numpy      (rembg baja su modelo la primera vez)
         python tools/prepare_assets.py
         python tools/prepare_assets.py --raw otra/carpeta --out assets/kicks

Reglas
- Si la imagen ya trae transparencia real (algún píxel con alfa < 250) se respeta.
- Si no, se quita el fondo con rembg (isnet-general-use, post_process_mask=True).
  Nunca se borra el blanco por color: los tenis son de piel blanca y deben quedar sólidos.
- En los tenis se elimina la sombra gris del piso que traen las fotos de producto
  (píxeles semitransparentes por debajo de --sombra); la página dibuja su propia sombra.
"""
from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image

ALPHA_MIN = 8          # alfa por debajo de esto cuenta como vacío
_session = None


def remove_background(img: Image.Image) -> Image.Image:
    """Devuelve RGBA sin fondo. Respeta el alfa existente; si no hay, usa rembg."""
    rgba = img.convert("RGBA")
    if np.asarray(rgba)[..., 3].min() < 250:
        return rgba
    global _session
    try:
        from rembg import new_session, remove
    except ImportError as exc:  # pragma: no cover - depende del entorno
        raise SystemExit('Falta rembg: pip install "rembg[cpu]" pillow numpy') from exc
    if _session is None:
        _session = new_session("isnet-general-use")
    return remove(rgba, session=_session, post_process_mask=True).convert("RGBA")


def bbox(alpha: np.ndarray) -> tuple[int, int, int, int] | None:
    ys, xs = np.nonzero(alpha > ALPHA_MIN)
    if not len(xs):
        return None
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


def crop_pad(img: Image.Image, pad_ratio: float, base: str = "width") -> Image.Image:
    """Recorta al contenido y agrega margen transparente (pad_ratio del ancho o del lado mayor)."""
    a = np.asarray(img)[..., 3]
    box = bbox(a)
    if box is None:
        return img
    part = img.crop(box)
    ref = part.width if base == "width" else max(part.size)
    pad = max(1, round(ref * pad_ratio))
    canvas = Image.new("RGBA", (part.width + 2 * pad, part.height + 2 * pad), (0, 0, 0, 0))
    canvas.paste(part, (pad, pad))
    return canvas


def scale_down(img: Image.Image, max_w: int | None = None, max_side: int | None = None) -> Image.Image:
    w, h = img.size
    k = 1.0
    if max_w and w > max_w:
        k = max_w / w
    if max_side and max(w, h) * k > max_side:
        k = max_side / max(w, h)
    if k >= 1:
        return img  # nunca se agranda
    return img.resize((max(1, round(w * k)), max(1, round(h * k))), Image.LANCZOS)


def drop_floor_shadow(img: Image.Image, threshold: int) -> Image.Image:
    """Quita los restos semitransparentes (sombra del piso, halos) por debajo del umbral."""
    if threshold <= 0:
        return img
    arr = np.array(img)
    arr[..., 3][arr[..., 3] < threshold] = 0
    return Image.fromarray(arr, "RGBA")


def solid_shoe(img: Image.Image, original: Image.Image, radius: int = 14) -> Image.Image:
    """Rellena los huecos que el quitafondos abre en la piel blanca (paneles "transparentes").

    Cierra el contorno con una operación morfológica, detecta las zonas encerradas que quedaron
    vacías y las vuelve opacas con el color de la foto original. El contorno exterior no cambia.
    """
    try:
        from scipy import ndimage as ndi  # viene con rembg
    except ImportError:
        return img
    arr = np.array(img)
    mask = arr[..., 3] > 128
    cross = ndi.generate_binary_structure(2, 1)
    closed = ndi.binary_closing(np.pad(mask, radius + 2), structure=cross, iterations=radius)[radius + 2:-radius - 2, radius + 2:-radius - 2]
    holes = ndi.binary_fill_holes(closed) & ~closed
    bridge = closed & ~mask & ndi.binary_dilation(holes, structure=cross, iterations=radius + 2)
    small = ndi.binary_fill_holes(mask) & ~mask  # huecos chicos ya encerrados en la máscara original
    fill = holes | bridge | small
    arr[..., :3][fill] = np.asarray(original.convert("RGB"))[fill]
    arr[..., 3][fill] = 255
    return Image.fromarray(arr, "RGBA")


def split_pieces(img: Image.Image) -> list[Image.Image]:
    """Corta en 3 por los dos huecos verticales más anchos; si no existen, en tercios iguales."""
    a = np.asarray(img)[..., 3]
    profile = a.max(axis=0)
    empty = profile <= ALPHA_MIN
    runs, start = [], None
    for x, e in enumerate(empty):
        if e and start is None:
            start = x
        elif not e and start is not None:
            runs.append((start, x))
            start = None
    if start is not None:
        runs.append((start, len(empty)))
    # Solo cuentan los huecos internos (no los márgenes de los bordes)
    inner = [(s, e) for s, e in runs if s > 0 and e < len(empty)]
    w = img.width
    if len(inner) >= 2:
        two = sorted(sorted(inner, key=lambda r: r[1] - r[0], reverse=True)[:2])
        cuts = [(s + e) // 2 for s, e in two]
    else:
        cuts = [w // 3, 2 * w // 3]
    edges = [0, *cuts, w]
    return [img.crop((edges[i], 0, edges[i + 1], img.height)) for i in range(3)]


def save_webp(img: Image.Image, path: Path, quality: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "WEBP", quality=quality, method=6, exact=True)
    print(f"  {path.name:<28} {img.width} × {img.height}px")


def contact_sheet(files: list[Path], out: Path) -> None:
    if not files:
        return
    thumbs = []
    for f in files:
        im = Image.open(f).convert("RGBA")
        im.thumbnail((320, 220))
        thumbs.append(im)
    cols = 4
    rows = (len(thumbs) + cols - 1) // cols
    sheet = Image.new("RGBA", (cols * 340, rows * 240), (194, 176, 220, 255))  # fondo lila: delata halos blancos
    for i, t in enumerate(thumbs):
        x = (i % cols) * 340 + (340 - t.width) // 2
        y = (i // cols) * 240 + (240 - t.height) // 2
        sheet.alpha_composite(t, (x, y))
    sheet.convert("RGB").save(out)
    print(f"  {out.name:<28} hoja de contacto")


def main() -> None:
    here = Path(__file__).resolve().parent.parent
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--raw", type=Path, default=here / "assets" / "raw")
    ap.add_argument("--out", type=Path, default=here / "assets" / "kicks")
    ap.add_argument("--sombra", type=int, default=48, help="alfa mínimo que se conserva en los tenis (0 = no tocar)")
    args = ap.parse_args()

    sources = sorted(p for p in args.raw.glob("*") if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"})
    if not sources:
        raise SystemExit(f"No hay imágenes en {args.raw}")
    made: list[Path] = []
    for src in sources:
        stem = src.stem.lower()
        if stem.endswith("-shoe"):
            print(f"{src.name}")
            original = Image.open(src).convert("RGBA")
            img = solid_shoe(drop_floor_shadow(remove_background(original), args.sombra), original)
            img = scale_down(crop_pad(img, 0.01, "width"), max_w=1600)
            out = args.out / f"{stem}.webp"
            save_webp(img, out, 88)
            made.append(out)
        elif stem.endswith("-pieces"):
            print(f"{src.name}")
            key = stem[: -len("-pieces")]
            img = remove_background(Image.open(src))
            for n, part in enumerate(split_pieces(img), start=1):
                part = scale_down(crop_pad(part, 0.02, "side"), max_side=800)
                out = args.out / f"{key}-piece-{n}.webp"
                save_webp(part, out, 88)
                made.append(out)
        else:
            print(f"{src.name}: se ignora (usa <colorway>-shoe.png o <colorway>-pieces.png)")
    shoes = [f for f in made if f.stem.endswith("-shoe")]
    pieces = [f for f in made if "-piece-" in f.stem]
    contact_sheet(shoes + pieces[:8], args.out / "_check.png")


if __name__ == "__main__":
    main()
