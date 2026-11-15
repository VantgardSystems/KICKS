// Grade ya aplicado -> WebP q82 + AVIF con nombres y medidas finales en public/images.
import fs from "node:fs";
import { createRequire } from "node:module";
const sharp = createRequire(new URL("../../", import.meta.url).pathname)("sharp");
const dir = process.argv[2];
const out = new URL("../../public/images", import.meta.url).pathname;
const map = {
  hero: ["hero-bg", 2400, 1350], "hero-m": ["hero-bg-mobile", 1080, 1920], dunes: ["hero-dunes", 2400, 1350],
  cta: ["cta-bg", 2400, 1000], landing: ["servicio-landing", 1000, 1000], sitio: ["servicio-sitio", 1000, 1000],
  tienda: ["servicio-tienda", 1000, 1000], citas: ["servicio-citas", 1000, 1000], agente: ["servicio-agente", 1000, 1000],
  mantenimiento: ["servicio-mantenimiento", 1000, 1000], diagnostico: ["proceso-diagnostico", 1200, 900],
  sandbox: ["proceso-sandbox", 1200, 900], marca: ["proceso-marca", 1200, 900], lanzamiento: ["proceso-lanzamiento", 1200, 900],
  historia: ["historia", 1920, 1080], "404": ["404", 1000, 1000],
};
for (const [k, [name, w, h]] of Object.entries(map)) {
  const src = `${dir}/g-${k}.png`;
  if (!fs.existsSync(src)) { console.log("falta", k); continue; }
  const img = sharp(src).resize(w, h, { fit: "cover" });
  await img.clone().webp({ quality: 82 }).toFile(`${out}/${name}.webp`);
  await img.clone().avif({ quality: 60 }).toFile(`${out}/${name}.avif`);
  const st = fs.statSync(`${out}/${name}.webp`).size;
  console.log(name, w + "x" + h, Math.round(st / 1024) + "KB");
}
