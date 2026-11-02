// Sneaker District: prepara la carpeta "publicar/" para subirla a Netlify Drop.
// Uso (en la carpeta del proyecto):  node publicar.mjs
// Copia solo lo que va a internet (assets/_originales NO se sube) y revisa las rutas.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'publicar');
const FILES = ['index.html', 'styles.css', 'main.js', 'products.js'];
const ASSET_DIRS = ['assets/img', 'assets/models', 'assets/video']; // _originales se queda fuera

// 1. Carpeta limpia con los archivos de la página
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const file of FILES) fs.copyFileSync(path.join(root, file), path.join(out, file));
for (const dir of ASSET_DIRS) {
  const src = path.join(root, dir);
  if (!fs.existsSync(src)) continue;
  fs.mkdirSync(path.join(out, dir), { recursive: true });
  for (const name of fs.readdirSync(src)) {
    if (name.startsWith('.')) continue; // .gitkeep y archivos ocultos
    fs.cpSync(path.join(src, name), path.join(out, dir, name), { recursive: true });
  }
}

// 2. Revisión de rutas
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const errores = [];
const avisos = [];

// Fotos y modelos que espera products.js (si faltan, la página usa la foto o el dibujo)
const sandbox = {};
vm.createContext(sandbox);
const productsSrc = fs.readFileSync(path.join(root, 'products.js'), 'utf8');
vm.runInContext(`${productsSrc}\nthis.PRODUCTS = PRODUCTS; this.STORE = STORE;`, sandbox);
const colores = sandbox.PRODUCTS.flatMap((p) => p.colors);
const faltanFotos = colores.filter((c) => !fs.existsSync(path.join(out, c.img)));
const faltanModelos = colores.filter((c) => !fs.existsSync(path.join(out, c.glb)));
const rutasDeProductos = new Set(colores.flatMap((c) => [c.img, c.glb]));

// Archivos locales que pide index.html (src/href sin dominio ni ancla).
// Las fotos de products.js que aún no existen se cuentan aparte como pendientes.
for (const [, ref] of html.matchAll(/(?:src|href)="([^"#:?]+)"/g)) {
  if (!fs.existsSync(path.join(out, ref)) && !rutasDeProductos.has(ref)) {
    errores.push(`Falta ${ref} (lo pide index.html)`);
  }
}

// Links internos (#seccion) que apuntan a una sección que existe
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.has(id)) errores.push(`El link #${id} no tiene sección con ese id`);
}

// Datos que el dueño todavía tiene que llenar
if (/X/.test(sandbox.STORE.whatsapp)) {
  avisos.push(`El WhatsApp sigue como ${sandbox.STORE.whatsapp}: cámbialo en products.js (STORE.whatsapp), si no, los botones no llegan a nadie.`);
}
const editar = (productsSrc.match(/\[EDITAR/g) || []).length + (html.match(/\[EDITAR/g) || []).length;
if (editar) avisos.push(`Quedan ${editar} textos marcados [EDITAR] en products.js e index.html.`);

// 3. Resumen
const peso = (dir) => fs.readdirSync(dir, { withFileTypes: true }).reduce((total, entry) => {
  const p = path.join(dir, entry.name);
  return total + (entry.isDirectory() ? peso(p) : fs.statSync(p).size);
}, 0);

console.log(`\nCarpeta lista: publicar/ (${(peso(out) / 1024).toFixed(0)} KB). assets/_originales no se incluye.`);
console.log(errores.length ? `\nRutas rotas:\n  - ${errores.join('\n  - ')}` : 'Rutas: sin rutas rotas.');
console.log(`Fotos WebP: ${colores.length - faltanFotos.length} de ${colores.length}${faltanFotos.length ? ' (las que faltan se ven con el dibujo de relleno)' : ''}.`);
console.log(`Modelos 3D: ${colores.length - faltanModelos.length} de ${colores.length}${faltanModelos.length ? ' (sin modelo se ve la foto)' : ''}.`);
if (avisos.length) console.log(`\nAntes de publicar:\n  - ${avisos.join('\n  - ')}`);
console.log('\nSiguiente paso: arrastra la carpeta publicar/ a https://app.netlify.com/drop\n');

process.exitCode = errores.length ? 1 : 0;
