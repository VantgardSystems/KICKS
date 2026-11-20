/* =====================================================================
   PLANOS — dibuja plantas arquitectónicas en SVG a partir de data.js.
   Cada espacio es un rectángulo en metros: { n, x, y, w, h, t }.
   Incluye cotas generales, áreas por espacio, norte y escala gráfica.
   ===================================================================== */
(function (HL) {
  'use strict';

  const S = 10;        // 1 m = 10 unidades SVG (evita tamaños de fuente diminutos)
  const M = 3.4;       // margen en metros para cotas
  const fmt = (n) => (Math.round(n * 100) / 100).toFixed(2);
  let K = 1;           // factor de escala de rótulos según el tamaño del plano

  HL.floorplan = { render };

  function render(level) {
    if (level.imagen) {
      return '<img src="' + HL.esc(level.imagen) + '" alt="' + HL.esc('Plano: ' + level.nombre) + '" loading="lazy">';
    }
    const W = level.ancho;
    const H = level.fondo;
    // Planos grandes (p. ej. un terreno de 50 m) escalan cotas, norte y escala gráfica
    K = Math.max(1, Math.max(W, H) / 25);
    const m = M * K;
    const vbX = -m * S;
    const vbY = -m * S;
    const vbW = (W + 2 * m) * S;
    const vbH = (H + 2 * m) * S;
    const out = [];

    out.push('<svg viewBox="' + [vbX, vbY, vbW, vbH].join(' ') + '" role="img" aria-label="' + HL.esc('Plano arquitectónico: ' + level.nombre + ', ' + fmt(W) + ' por ' + fmt(H) + ' metros') + '" font-family="inherit">');
    out.push(
      '<defs>' +
        '<pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
          '<line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" stroke-width="1" opacity=".22"/>' +
        '</pattern>' +
        '<pattern id="waves" width="24" height="10" patternUnits="userSpaceOnUse">' +
          '<path d="M0 5 Q6 1 12 5 T24 5" fill="none" stroke="currentColor" stroke-width="1" opacity=".45"/>' +
        '</pattern>' +
      '</defs>'
    );

    // Espacios (orden: lote → exteriores → interiores → agua encima)
    const order = { lote: 0, ext: 1, desplante: 2, undefined: 3, serv: 3, agua: 4 };
    const rooms = level.espacios.slice().sort((a, b) => (order[a.t] ?? 3) - (order[b.t] ?? 3));
    rooms.forEach((r) => out.push(room(r)));
    // Un exterior que contiene alberca lleva su etiqueta en la esquina, para no encimarse
    const pools = rooms.filter((r) => r.t === 'agua');
    const holdsPool = (r) => r.t === 'ext' && pools.some((w) => w.x >= r.x && w.y >= r.y && w.x + w.w <= r.x + r.w && w.y + w.h <= r.y + r.h);
    rooms.forEach((r) => out.push(holdsPool(r) ? cornerLabel(r) : label(r)));

    // Cotas generales
    out.push(dimension(0, -1.7 * K, W, -1.7 * K, fmt(W) + ' m', false));
    out.push(dimension(-1.7 * K, 0, -1.7 * K, H, fmt(H) + ' m', true));

    // Norte
    const nx = (W + 1.7 * K) * S;
    const ny = -1.9 * K * S;
    out.push(
      '<g transform="translate(' + nx + ' ' + ny + ') scale(' + K + ')" opacity=".85">' +
        '<circle r="9" fill="none" stroke="currentColor" stroke-width="1"/>' +
        '<path d="M0 -7 L4 5 L0 2 L-4 5 Z" fill="currentColor"/>' +
        '<text y="-12" text-anchor="middle" font-size="7" font-weight="600" fill="currentColor">N</text>' +
      '</g>'
    );

    // Escala gráfica 0–5 m
    const sy = (H + 1.9 * K) * S;
    const unit = K > 1.5 ? 2 : 1;            // segmentos de 1 m (o 2 m en planos grandes)
    const seg = Math.min(5, Math.floor(W / (2 * unit)));
    let bar = '<g opacity=".8">';
    for (let i = 0; i < seg; i++) {
      bar += '<rect x="' + i * unit * S + '" y="' + sy + '" width="' + unit * S + '" height="' + 3 * K + '" fill="' + (i % 2 ? 'none' : 'currentColor') + '" stroke="currentColor" stroke-width="' + 0.6 * K + '"/>';
    }
    bar += '<text x="0" y="' + (sy + 12 * K) + '" font-size="' + 6 * K + '" fill="currentColor">0</text>';
    bar += '<text x="' + seg * unit * S + '" y="' + (sy + 12 * K) + '" font-size="' + 6 * K + '" text-anchor="middle" fill="currentColor">' + seg * unit + ' m</text></g>';
    out.push(bar);

    out.push('</svg>');
    return out.join('');
  }

  function room(r) {
    const x = r.x * S;
    const y = r.y * S;
    const w = r.w * S;
    const h = r.h * S;
    switch (r.t) {
      case 'ext':
        return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="url(#hatch)" stroke="currentColor" stroke-width=".9" stroke-dasharray="4 3" opacity=".9"/>';
      case 'agua':
        return '<g style="color: var(--brand-accent-2)"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2" style="fill: color-mix(in srgb, var(--brand-accent-2) 22%, transparent)" stroke="currentColor" stroke-width="1"/>' +
          '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2" fill="url(#waves)"/></g>';
      case 'lote':
        return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="rgba(255,255,255,.03)" stroke="currentColor" stroke-width="2.4"/>';
      case 'desplante':
        return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" style="fill: color-mix(in srgb, var(--brand-accent) 12%, transparent); stroke: var(--brand-accent)" stroke-width="1.2" stroke-dasharray="6 4"/>';
      case 'serv':
        return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="rgba(255,255,255,.07)" stroke="currentColor" stroke-width="1.8"/>';
      default:
        return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="rgba(255,255,255,.025)" stroke="currentColor" stroke-width="1.8"/>';
    }
  }

  function label(r) {
    const cx = (r.x + r.w / 2) * S;
    let cy = (r.y + r.h / 2) * S;
    if (r.t === 'desplante') cy = (r.y + r.h - 1.2) * S;
    if (r.t === 'lote') cy = (r.y + r.h * 0.78) * S;   // fuera del área de desplante
    const area = r.t === 'lote' ? '' : fmt(r.w * r.h).replace(/\.00$/, '') + ' m²';
    // Tamaño de letra según el espacio disponible
    const maxF = r.t === 'lote' ? 1.5 : r.t === 'desplante' ? 1 : 0.55;
    let f = Math.max(0.3, Math.min(maxF, Math.min(r.w, r.h) * 0.17)) * S;
    let lines = [r.n];
    const fits = (txt, size) => txt.length * size * 0.56 <= r.w * S * 0.88;
    if (!fits(r.n, f) && r.n.indexOf(' ') > 0) {
      let mid = r.n.lastIndexOf(' ', Math.ceil(r.n.length / 2) + 2);
      if (mid <= 0) mid = r.n.indexOf(' ');
      lines = [r.n.slice(0, mid), r.n.slice(mid + 1)];
    }
    const longest = lines.reduce((a, b) => (a.length > b.length ? a : b));
    while (!fits(longest, f) && f > 2.2) f -= 0.25;
    const lh = f * 1.15;
    const total = lines.length * lh + (area ? f * 0.95 : 0);
    let y = cy - total / 2 + f * 0.85;
    let svg = '<g text-anchor="middle" fill="currentColor"' + (r.t === 'agua' ? ' style="fill: var(--brand-accent-2)"' : '') + '>';
    lines.forEach((ln) => {
      svg += '<text x="' + cx + '" y="' + y.toFixed(1) + '" font-size="' + f.toFixed(2) + '" font-weight="600">' + HL.esc(ln) + '</text>';
      y += lh;
    });
    if (area && r.h * S > total + 2) {
      svg += '<text x="' + cx + '" y="' + (y - lh + f * 1.05).toFixed(1) + '" font-size="' + (f * 0.78).toFixed(2) + '" opacity=".62">' + area + '</text>';
    }
    return svg + '</g>';
  }

  function cornerLabel(r) {
    const f = 0.42 * S;
    const x = (r.x + 0.45) * S;
    const y = (r.y + 0.75) * S;
    return '<g fill="currentColor"><text x="' + x + '" y="' + y + '" font-size="' + f + '" font-weight="600">' + HL.esc(r.n) + '</text>' +
      '<text x="' + x + '" y="' + (y + f * 1.05) + '" font-size="' + (f * 0.78) + '" opacity=".62">' + fmt(r.w * r.h).replace(/\.00$/, '') + ' m²</text></g>';
  }

  function dimension(x1, y1, x2, y2, text, vertical) {
    const a = [x1 * S, y1 * S];
    const b = [x2 * S, y2 * S];
    const tick = 3 * K;
    const fs = 6.5 * K;
    const off = 4 * K;
    let g = '<g stroke="currentColor" stroke-width="' + 0.7 * K + '" opacity=".75">';
    g += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>';
    if (vertical) {
      g += '<line x1="' + (a[0] - tick) + '" y1="' + a[1] + '" x2="' + (a[0] + tick) + '" y2="' + a[1] + '"/>';
      g += '<line x1="' + (b[0] - tick) + '" y1="' + b[1] + '" x2="' + (b[0] + tick) + '" y2="' + b[1] + '"/>';
    } else {
      g += '<line x1="' + a[0] + '" y1="' + (a[1] - tick) + '" x2="' + a[0] + '" y2="' + (a[1] + tick) + '"/>';
      g += '<line x1="' + b[0] + '" y1="' + (b[1] - tick) + '" x2="' + b[0] + '" y2="' + (b[1] + tick) + '"/>';
    }
    g += '</g>';
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    const t = vertical
      ? '<text x="' + (mx - off) + '" y="' + my + '" font-size="' + fs + '" text-anchor="middle" fill="currentColor" opacity=".85" transform="rotate(-90 ' + (mx - off) + ' ' + my + ')">' + text + '</text>'
      : '<text x="' + mx + '" y="' + (my - off) + '" font-size="' + fs + '" text-anchor="middle" fill="currentColor" opacity=".85">' + text + '</text>';
    return g + t;
  }
})(window.HL = window.HL || {});
