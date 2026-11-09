/* =====================================================================
   Solenna · Calculadora de ahorro — asistente por pasos
   Script clásico + IIFE. Cada parte va en safe(): si algo falla, la página
   sigue funcionando y siempre hay una alternativa manual.
   ===================================================================== */
(function () {
  "use strict";

  var CFG = window.__SOLENNA_CALC__ || {};
  var S = CFG.supuestos || {};
  var CALC = window.SolennaCalc;
  var V = CFG.version || "20261026";
  var reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var KEY = "solenna_calc_v1";
  var PENDING = "solenna_lead_pendiente";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  /* ---------- Utilidades ---------- */
  function safe(fn, name) { try { return fn(); } catch (e) { if (window.console) console.warn("[Calculadora] " + name, e); } }
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function fmt(n, d) {
    d = d || 0;
    if (n === null || n === undefined || !isFinite(n)) return "—";
    var p = Math.abs(n).toFixed(d).split(".");
    p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return (n < 0 ? "−" : "") + p.join(",");
  }
  function parseNum(v) {
    var s = String(v == null ? "" : v).replace(/[\s€a-zA-Z²/]/g, "");
    if (s.indexOf(",") > -1) s = s.replace(/\./g, "").replace(",", ".");
    var n = parseFloat(s);
    return isFinite(n) ? n : null;
  }
  function inRange(v, a, b) { return v !== null && v >= a && v <= b; }
  function debounce(fn, ms) { var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms); }; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /** Petición a nuestros endpoints PHP. Nunca lanza: devuelve {ok, status, data}. */
  function api(url, opts, timeout) {
    opts = opts || {};
    var ctrl = window.AbortController ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, timeout || 20000);
    if (opts.signal && ctrl) opts.signal.addEventListener("abort", function () { ctrl.abort(); });
    var headers = Object.assign({ "X-Solenna": "calc" }, opts.headers || {});
    return fetch(url, { method: opts.method || "GET", headers: headers, body: opts.body, signal: ctrl ? ctrl.signal : undefined, credentials: "same-origin" })
      .then(function (res) {
        return res.text().then(function (txt) {
          var data = null;
          try { data = JSON.parse(txt); } catch (e) { /* respuesta no JSON */ }
          return { ok: res.ok && !!data && data.ok !== false, status: res.status, data: data };
        });
      })
      .catch(function (e) { return { ok: false, status: 0, data: null, aborted: e && e.name === "AbortError" }; })
      .then(function (r) { clearTimeout(t); return r; });
  }

  /* ---------- Estado (se guarda en la pestaña; nunca la factura) ---------- */
  var state = { paso: 1, factura: {}, origen: null, ubicacion: null, puntos: [], areaManual: null, resultado: null, rend: null, desbloqueado: false };
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* modo privado */ } }
  function load() { try { var s = JSON.parse(sessionStorage.getItem(KEY) || "null"); if (s && typeof s === "object") Object.assign(state, s); } catch (e) { /* nada */ } }

  /* ---------- Navegación entre pasos ---------- */
  var current = 0;
  var onEnter = {};

  function go(n, opts) {
    opts = opts || {};
    var steps = $$(".step");
    steps.forEach(function (s) { s.hidden = Number(s.getAttribute("data-step")) !== n; s.classList.remove("is-entering"); });
    var el = $('.step[data-step="' + n + '"]');
    if (!el) return;
    void el.offsetWidth;
    if (!reduced) el.classList.add("is-entering");
    current = n;
    state.paso = n;
    save();

    var fill = $("#progressFill");
    if (fill) fill.style.width = ((n - 1) / 4 * 100) + "%";
    $$(".progress__steps li").forEach(function (li) {
      var p = Number(li.getAttribute("data-p"));
      li.classList.toggle("is-done", p < n || (n === 5 && state.desbloqueado));
      li.classList.toggle("is-current", p === n && !(n === 5 && state.desbloqueado));
    });

    if (onEnter[n]) safe(onEnter[n], "paso " + n);
    if (!opts.noFocus) {
      var h = $("h2", el);
      if (h) safe(function () { h.focus({ preventScroll: true }); }, "focus");
      var top = $(".progress").getBoundingClientRect().top + window.pageYOffset - 12;
      if (Math.abs(window.pageYOffset - top) > 40) window.scrollTo({ top: Math.max(0, top), behavior: reduced ? "auto" : "smooth" });
    }
  }

  function initNav() {
    $$("[data-next]").forEach(function (b) { b.addEventListener("click", function () { if (!b.disabled) go(Number(b.getAttribute("data-next"))); }); });
    $$("[data-back]").forEach(function (b) { b.addEventListener("click", function () { go(Number(b.getAttribute("data-back"))); }); });
    var main = CFG.mainUrl || "/";
    $$("[data-main-link]").forEach(function (a) { a.setAttribute("href", main); });
  }

  /* =====================================================================
     PASO 1 · FACTURA
     ===================================================================== */
  var F = {};
  function initFactura() {
    F = { input: $("#fileInput"), drop: $("#drop"), reading: $("#reading"), readingFile: $("#readingFile"), msg: $("#s1msg"),
          datos: $("#datos"), badge: $("#datosBadge"), gasto: $("#fGasto"), consumo: $("#fConsumo"), precio: $("#fPrecio"),
          fijo: $("#fFijo"), potencia: $("#fPotencia"), comer: $("#fComer"), more: $("#moreFields"), next: $("#next1") };

    F.input.addEventListener("change", function () { if (F.input.files && F.input.files[0]) handleFile(F.input.files[0]); });
    ["dragenter", "dragover"].forEach(function (ev) { F.drop.addEventListener(ev, function (e) { e.preventDefault(); F.drop.classList.add("is-over"); }); });
    ["dragleave", "drop"].forEach(function (ev) { F.drop.addEventListener(ev, function (e) { e.preventDefault(); F.drop.classList.remove("is-over"); }); });
    F.drop.addEventListener("drop", function (e) { var f = e.dataTransfer && e.dataTransfer.files[0]; if (f) handleFile(f); });

    $("#manualBtn").addEventListener("click", function () { showDatos(false); F.gasto.focus(); });
    [F.gasto, F.consumo, F.precio, F.fijo, F.potencia].forEach(function (i) { i.addEventListener("input", validate1); });

    // Restaurar lo que el usuario ya había escrito
    var f = state.factura || {};
    if (f.gasto) {
      F.gasto.value = fmt(f.gasto, f.gasto % 1 ? 2 : 0);
      if (f.consumo) F.consumo.value = fmt(f.consumo);
      if (f.precio) F.precio.value = fmt(f.precio, 3);
      if (f.fijo) F.fijo.value = fmt(f.fijo, 2);
      if (f.potencia) F.potencia.value = fmt(f.potencia, 2);
      if (f.comercializadora) F.comer.textContent = "Comercializadora: " + f.comercializadora;
      showDatos(state.origen === "ia");
      validate1();
    }
  }

  function showDatos(fromAI) {
    F.datos.hidden = false;
    F.badge.hidden = !fromAI;
    if (!fromAI && !state.origen) state.origen = "manual";
  }

  function validate1() {
    var g = parseNum(F.gasto.value), c = parseNum(F.consumo.value), p = parseNum(F.precio.value), fj = parseNum(F.fijo.value), pt = parseNum(F.potencia.value);
    var okG = inRange(g, 10, 2000);
    var okC = c === null || inRange(c, 30, 6000);
    var okP = p === null || inRange(p, 0.05, 0.6);
    var okF = fj === null || inRange(fj, 1, 300);
    var okPt = pt === null || inRange(pt, 1, 30);
    F.gasto.closest(".field").classList.toggle("is-error", F.gasto.value !== "" && !okG);
    F.consumo.closest(".field").classList.toggle("is-error", !okC);
    F.precio.closest(".field").classList.toggle("is-error", !okP);
    F.fijo.closest(".field").classList.toggle("is-error", !okF);
    F.potencia.closest(".field").classList.toggle("is-error", !okPt);
    var ok = okG && okC && okP && okF && okPt;
    F.next.disabled = !ok;
    if (F.gasto.value !== "" && !okG) setMsg(F.msg, "Escribe un gasto mensual entre 10 € y 2.000 €.");
    else if (F.gasto.value !== "" && !ok) setMsg(F.msg, "Revisa los datos marcados en rojo (o déjalos vacíos).");
    else if (ok) setMsg(F.msg, "");
    state.factura = Object.assign({}, state.factura, { gasto: okG ? g : null, consumo: okC ? c : null, precio: okP ? p : null, fijo: okF ? fj : null, potencia: okPt ? pt : null });
    save();
  }

  function setMsg(el, txt, info) { el.textContent = txt || ""; el.classList.toggle("is-info", !!info); }

  function handleFile(file) {
    setMsg(F.msg, "");
    var isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
    var isImg = /^image\//.test(file.type) || /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
    if (!isPdf && !isImg) { setMsg(F.msg, "Ese formato no vale. Sube una foto (JPG o PNG) o un PDF."); F.input.value = ""; return; }
    if (file.size > (isImg ? 30 : 10) * 1024 * 1024) { setMsg(F.msg, "El archivo pesa demasiado (máximo 10 MB). Prueba con una foto más ligera."); F.input.value = ""; return; }

    F.reading.hidden = false;
    F.readingFile.textContent = file.name;
    prepareFile(file, isImg).then(function (blob) {
      if (blob.size > 10 * 1024 * 1024) throw new Error("grande");
      var fd = new FormData();
      fd.append("factura", blob, isImg && blob.type === "image/jpeg" ? "factura.jpg" : file.name);
      return api("factura.php", { method: "POST", body: fd }, 75000);
    }).then(function (r) {
      F.reading.hidden = true;
      F.input.value = "";
      if (r.ok && r.data && r.data.datos) { fillDatos(r.data.datos); return; }
      var m = (r.data && r.data.mensaje) || (r.status === 0 ? "No hay conexión con el lector de facturas." : "No hemos podido leer la factura.");
      setMsg(F.msg, m + (/a mano/.test(m) ? "" : " Escribe tu gasto mensual a mano y seguimos."));
      showDatos(false);
      state.origen = "manual";
      F.gasto.focus();
    }).catch(function () {
      F.reading.hidden = true;
      F.input.value = "";
      setMsg(F.msg, "No hemos podido procesar el archivo. Escribe tu gasto mensual a mano y seguimos.");
      showDatos(false);
      state.origen = "manual";
    });
  }

  /** Reduce fotos grandes del móvil antes de enviarlas (más rápido y barato). */
  function prepareFile(file, isImg) {
    if (!isImg || /heic|heif/i.test(file.type + file.name) || (file.size < 1.6 * 1024 * 1024)) return Promise.resolve(file);
    return new Promise(function (resolve) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        try {
          var max = 2200, k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
          var c = document.createElement("canvas");
          c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          c.toBlob(function (b) { URL.revokeObjectURL(url); resolve(b && b.size < file.size ? b : file); }, "image/jpeg", 0.85);
        } catch (e) { URL.revokeObjectURL(url); resolve(file); }
      };
      img.onerror = function () { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }

  function fillDatos(d) {
    state.origen = "ia";
    var set = function (el, v, dec) { el.value = v === null || v === undefined ? "" : fmt(v, dec); };
    set(F.gasto, d.gasto_mensual_eur, 2);
    set(F.consumo, d.consumo_mensual_kwh, 0);
    set(F.precio, d.precio_kwh_eur, 3);
    set(F.fijo, d.termino_fijo_mensual_eur, 2);
    set(F.potencia, d.potencia_contratada_kw, 2);
    state.factura = { comercializadora: d.comercializadora || null, consumoAnual: d.consumo_anual_kwh || null };
    F.comer.textContent = d.comercializadora ? "Comercializadora: " + d.comercializadora : "";
    showDatos(true);
    if (d.consumo_mensual_kwh || d.precio_kwh_eur) F.more.open = true;
    if (!d.gasto_mensual_eur) { setMsg(F.msg, "No encontramos el total en la factura: escríbelo a mano, por favor."); F.gasto.focus(); }
    validate1();
  }

  /* =====================================================================
     PASO 2 · UBICACIÓN (autocompletado)
     ===================================================================== */
  var G = {};
  function initUbicacion() {
    G = { input: $("#addr"), list: $("#addrList"), btn: $("#addrSearch"), geo: $("#geoBtn"), picked: $("#picked"),
          title: $("#pickedTitle"), detail: $("#pickedDetail"), prov: $("#provSel"), provBox: $("#provBox"), msg: $("#s2msg"), next: $("#next2"),
          results: [], active: -1, seq: 0, ctrl: null };

    CALC.PROVINCIAS.slice().sort(function (a, b) { return a.nombre.localeCompare(b.nombre, "es"); }).forEach(function (p) {
      var o = document.createElement("option"); o.value = p.nombre; o.textContent = p.nombre; G.prov.appendChild(o);
    });

    G.input.addEventListener("input", debounce(function () { suggest(G.input.value.trim(), "sugerir"); }, 380));
    G.input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (G.list.hidden || !G.results.length) return;
        e.preventDefault();
        G.active = (G.active + (e.key === "ArrowDown" ? 1 : -1) + G.results.length) % G.results.length;
        paintActive();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (!G.list.hidden && G.active > -1) choose(G.results[G.active]);
        else suggest(G.input.value.trim(), "buscar");
      } else if (e.key === "Escape") closeList();
    });
    G.input.addEventListener("blur", function () { setTimeout(closeList, 220); });
    G.btn.addEventListener("click", function () { suggest(G.input.value.trim(), "buscar"); G.input.focus(); });
    G.list.addEventListener("mousedown", function (e) { e.preventDefault(); });
    G.list.addEventListener("click", function (e) {
      var li = e.target.closest("li[data-i]");
      if (li) choose(G.results[Number(li.getAttribute("data-i"))]);
    });
    G.geo.addEventListener("click", useGPS);
    G.prov.addEventListener("change", function () {
      var p = CALC.buscaProvincia(G.prov.value);
      if (p) setLocation({ titulo: "Provincia de " + p.nombre, detalle: "Busca tu casa moviendo el mapa en el siguiente paso", lat: p.lat, lon: p.lon, provincia: p.nombre, precision: "provincia" });
    });

    if (state.ubicacion) showPicked(state.ubicacion);
  }

  function suggest(q, modo) {
    setMsg(G.msg, "");
    if (q.length < 3) { if (modo === "buscar") setMsg(G.msg, "Escribe al menos la calle y el municipio."); closeList(); return; }
    var seq = ++G.seq;
    if (G.ctrl) G.ctrl.abort();
    G.ctrl = window.AbortController ? new AbortController() : null;
    if (modo === "buscar") G.btn.classList.add("is-busy");
    api("geo.php?modo=" + modo + "&q=" + encodeURIComponent(q), { signal: G.ctrl ? G.ctrl.signal : undefined }, 12000).then(function (r) {
      G.btn.classList.remove("is-busy");
      if (seq !== G.seq || r.aborted) return;
      if (!r.ok) {
        closeList();
        if (modo === "buscar" || r.status === 429 || r.status >= 500 || r.status === 0) {
          setMsg(G.msg, (r.data && r.data.mensaje ? r.data.mensaje + " " : "El buscador no responde ahora mismo. ") + "Pulsa “Usar mi ubicación actual” o elige tu provincia.");
          G.provBox.open = true;
        }
        return;
      }
      G.results = r.data.resultados || [];
      renderList(q, modo);
    });
  }

  function renderList(q, modo) {
    G.active = -1;
    if (!G.results.length) {
      G.list.innerHTML = '<li class="suggest__empty" role="option" aria-disabled="true">' + (modo === "buscar"
        ? "No encontramos esa dirección. Prueba con calle y municipio, o elige tu provincia."
        : "Sigue escribiendo o pulsa “Buscar”…") + "</li>";
    } else {
      var words = q.toLowerCase().split(/\s+/).filter(function (w) { return w.length > 2; });
      G.list.innerHTML = G.results.map(function (r, i) {
        var t = esc(r.titulo);
        words.forEach(function (w) { t = t.replace(new RegExp("(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>"); });
        return '<li role="option" id="opt-' + i + '" data-i="' + i + '" aria-selected="false">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>' +
          "<div><strong>" + t + "</strong><small>" + esc(r.detalle) + "</small></div></li>";
      }).join("");
    }
    G.list.hidden = false;
    G.input.setAttribute("aria-expanded", "true");
  }

  function paintActive() {
    $$("li[data-i]", G.list).forEach(function (li, i) { li.setAttribute("aria-selected", i === G.active ? "true" : "false"); });
    G.input.setAttribute("aria-activedescendant", G.active > -1 ? "opt-" + G.active : "");
    var li = $("#opt-" + G.active);
    if (li) li.scrollIntoView({ block: "nearest" });
  }

  function closeList() { G.list.hidden = true; G.input.setAttribute("aria-expanded", "false"); G.input.removeAttribute("aria-activedescendant"); }

  function choose(r) {
    if (!r) return;
    G.input.value = r.titulo;
    closeList();
    setLocation({ titulo: r.titulo, detalle: r.detalle, lat: r.lat, lon: r.lon, municipio: r.municipio, provincia: r.provincia, cp: r.cp, precision: "direccion" });
  }

  function useGPS() {
    setMsg(G.msg, "");
    if (!navigator.geolocation) { setMsg(G.msg, "Tu navegador no permite usar la ubicación. Escribe tu dirección."); return; }
    G.geo.textContent = "📍 Buscando tu ubicación…";
    navigator.geolocation.getCurrentPosition(function (p) {
      G.geo.textContent = "📍 Usar mi ubicación actual";
      setLocation({ titulo: "Tu ubicación actual", detalle: "Precisión aproximada: " + Math.round(p.coords.accuracy) + " m", lat: p.coords.latitude, lon: p.coords.longitude, precision: "gps" });
    }, function () {
      G.geo.textContent = "📍 Usar mi ubicación actual";
      setMsg(G.msg, "No hemos podido obtener tu ubicación (quizá no diste permiso). Escribe tu dirección o elige tu provincia.");
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  }

  function setLocation(loc) {
    var prev = state.ubicacion;
    var moved = !prev || Math.abs(prev.lat - loc.lat) > 0.002 || Math.abs(prev.lon - loc.lon) > 0.002;
    state.ubicacion = loc;
    if (moved) { state.puntos = []; state.areaManual = null; state.rend = null; }
    save();
    showPicked(loc);
    safe(function () { ensureLeaflet().catch(function () {}); fetchRend(); }, "prefetch");
  }

  function showPicked(loc) {
    G.picked.hidden = false;
    G.title.textContent = loc.titulo;
    G.detail.textContent = loc.detalle || "";
    G.next.disabled = false;
  }

  /* ---------- Producción solar (PVGIS → tabla por provincia) ---------- */
  var rendPromise = null, rendKey = "";
  function fetchRend() {
    var u = state.ubicacion;
    if (!u) return Promise.resolve({ rendimiento: 1500, fuente: "media" });
    var k = u.lat.toFixed(2) + "," + u.lon.toFixed(2);
    if (rendPromise && rendKey === k) return rendPromise;
    rendKey = k;
    rendPromise = api("pvgis.php?lat=" + u.lat.toFixed(4) + "&lon=" + u.lon.toFixed(4), {}, 14000).then(function (r) {
      if (r.ok && r.data.rendimiento_kwh_kwp) return { rendimiento: r.data.rendimiento_kwh_kwp, fuente: "PVGIS" };
      var b = CALC.rendimientoRespaldo(u.lat, u.lon, u.provincia);
      return { rendimiento: b.rendimiento, fuente: "tabla", provincia: b.provincia };
    });
    return rendPromise;
  }

  /* =====================================================================
     PASO 3 · TEJADO (mapa satélite + dibujo táctil)
     ===================================================================== */
  var M = { map: null, layer: null, poly: null, markers: [], home: null };
  var leafletPromise = null;

  function ensureLeaflet() {
    if (window.L && window.L.map) return Promise.resolve();
    if (leafletPromise) return leafletPromise;
    leafletPromise = new Promise(function (resolve, reject) {
      var css = document.createElement("link");
      css.rel = "stylesheet"; css.href = "lib/leaflet/leaflet.css?v=" + V;
      document.head.appendChild(css);
      var s = document.createElement("script");
      s.src = "lib/leaflet/leaflet.js?v=" + V;
      var t = setTimeout(function () { reject(new Error("timeout")); }, 15000);
      s.onload = function () { clearTimeout(t); if (window.L && window.L.map) resolve(); else reject(new Error("sin L")); };
      s.onerror = function () { clearTimeout(t); reject(new Error("carga")); };
      document.head.appendChild(s);
    });
    leafletPromise.catch(function () { leafletPromise = null; });
    return leafletPromise;
  }

  var T = {};
  function initTejado() {
    T = { hint: $("#mapHint"), loading: $("#mapLoading"), undo: $("#undoBtn"), clear: $("#clearBtn"), pill: $("#areaPill"),
          val: $("#areaVal"), kwp: $("#areaKwp"), manual: $("#areaManual"), box: $("#areaBox"), msg: $("#s3msg"), next: $("#next3") };
    T.undo.addEventListener("click", function () { state.puntos.pop(); redraw(); });
    T.clear.addEventListener("click", function () { state.puntos = []; redraw(); });
    T.manual.addEventListener("input", function () {
      var v = parseNum(T.manual.value);
      state.areaManual = inRange(v, S.areaMinimaM2 || 10, 3000) ? v : null;
      T.manual.closest(".field").classList.toggle("is-error", T.manual.value !== "" && state.areaManual === null);
      validate3();
    });
    if (state.areaManual) { T.manual.value = fmt(state.areaManual); T.box.open = true; }
    window.addEventListener("resize", debounce(function () { if (M.map) M.map.invalidateSize(); }, 200));
  }

  onEnter[3] = function () {
    validate3();
    if (!state.ubicacion) { go(2); return; }
    T.loading.hidden = false;
    ensureLeaflet().then(initMap).catch(function () { mapFailed("No hemos podido cargar el mapa."); });
  };

  function mapFailed(why) {
    T.loading.hidden = true;
    T.box.open = true;
    setMsg(T.msg, why + " Indica los m² aproximados de tu tejado en la casilla de abajo.");
  }

  function tileLayer(kind) {
    if (kind === "pnoa") {
      return L.tileLayer("https://www.ign.es/wmts/pnoa-ma?request=GetTile&service=WMTS&version=1.0.0&layer=OI.OrthoimageCoverage&style=default&tilematrixset=GoogleMapsCompatible&tilematrix={z}&tilerow={y}&tilecol={x}&format=image/jpeg",
        { maxNativeZoom: 19, maxZoom: 21, attribution: 'Ortofoto PNOA © <a href="https://www.ign.es" target="_blank" rel="noopener">IGN</a>' });
    }
    return L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { maxNativeZoom: 19, maxZoom: 21, attribution: "Imágenes © Esri, Maxar, Earthstar Geographics" });
  }

  function useLayer(kind) {
    if (M.layer) M.map.removeLayer(M.layer);
    var ok = 0, bad = 0;
    M.kind = kind;
    M.layer = tileLayer(kind).addTo(M.map);
    M.layer.on("tileload", function () { ok++; T.loading.hidden = true; });
    M.layer.on("tileerror", function () {
      bad++;
      if (ok === 0 && bad >= 6) {
        if (kind === "pnoa") { M.fallback = true; useLayer("esri"); }
        else mapFailed("No se puede cargar la vista satélite ahora mismo.");
      }
    });
  }

  function initMap() {
    var u = state.ubicacion;
    var zoom = u.precision === "provincia" ? 12 : 19;
    if (!M.map) {
      M.map = L.map("map", { zoomControl: true, doubleClickZoom: false, maxZoom: 21, minZoom: 5, zoomSnap: 0.5, bounceAtZoomLimits: false });
      M.map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
      M.map.zoomControl.setPosition("topright");
      M.map.on("click", function (e) {
        if (state.puntos.length >= 40) return;
        state.puntos.push({ lat: e.latlng.lat, lng: e.latlng.lng });
        redraw();
      });
    }
    var spain = u.lat > 27 && u.lat < 44.5 && u.lon > -19 && u.lon < 5;
    var want = spain && !M.fallback ? "pnoa" : "esri";
    if (!M.layer || M.kind !== want) useLayer(want);
    M.map.setView([u.lat, u.lon], zoom, { animate: false });
    if (M.home) M.map.removeLayer(M.home);
    if (u.precision !== "provincia") {
      M.home = L.marker([u.lat, u.lon], { icon: L.divIcon({ className: "home-pin", iconSize: [20, 20] }), interactive: false, keyboard: false }).addTo(M.map);
    }
    setTimeout(function () { M.map.invalidateSize(); }, 60);
    setTimeout(function () { T.loading.hidden = true; }, 9000);
    redraw();
  }

  function redraw() {
    if (M.map) {
      M.markers.forEach(function (m) { M.map.removeLayer(m); });
      M.markers = [];
      if (M.poly) { M.map.removeLayer(M.poly); M.poly = null; }
      var ll = state.puntos.map(function (p) { return [p.lat, p.lng]; });
      if (ll.length >= 2) {
        M.poly = (ll.length >= 3 ? L.polygon(ll, { color: "#b9f27c", weight: 2.5, fillColor: "#b9f27c", fillOpacity: 0.22, interactive: false })
                                 : L.polyline(ll, { color: "#b9f27c", weight: 2.5, dashArray: "6 6", interactive: false })).addTo(M.map);
      }
      state.puntos.forEach(function (p, i) {
        var m = L.marker([p.lat, p.lng], { draggable: true, keyboard: false, icon: L.divIcon({ className: "vx" + (i === 0 ? " vx--first" : ""), iconSize: [30, 30] }) }).addTo(M.map);
        m.on("drag", function (e) {
          var q = e.target.getLatLng();
          state.puntos[i] = { lat: q.lat, lng: q.lng };
          if (M.poly) M.poly.setLatLngs(state.puntos.map(function (x) { return [x.lat, x.lng]; }));
          updateArea();
        });
        m.on("dragend", function () { save(); });
        M.markers.push(m);
      });
    }
    updateArea();
    save();
  }

  function polygonInfo() {
    var area = CALC.areaGeodesica(state.puntos);
    var cruza = CALC.seCruza(state.puntos);
    var ok = state.puntos.length >= 3 && !cruza && area >= (S.areaMinimaM2 || 10) && area <= 5000;
    return { area: area, cruza: cruza, ok: ok };
  }

  function updateArea() {
    var n = state.puntos.length, info = polygonInfo();
    T.val.textContent = fmt(n >= 3 ? info.area : 0);
    var kwp = info.area / S.m2PorKwp, placas = Math.floor(kwp * 1000 / S.wpPanel);
    T.kwp.textContent = n < 3 ? "Marca al menos 3 esquinas"
      : info.cruza ? "Las líneas se cruzan: mueve un punto"
      : info.area < (S.areaMinimaM2 || 10) ? "Muy pequeño: mínimo " + (S.areaMinimaM2 || 10) + " m²"
      : info.area > 5000 ? "Demasiado grande: marca solo tu tejado"
      : "≈ " + placas + " placas · " + fmt(kwp, 1) + " kWp máx.";
    T.pill.classList.toggle("is-ok", info.ok);
    T.hint.textContent = n === 0 ? "Toca la primera esquina de tu tejado"
      : n < 3 ? "Sigue tocando las esquinas (" + n + " de al menos 3)"
      : info.ok ? "¡Bien! Arrastra los puntos para ajustar o pulsa “Calcular”" : "Ajusta los puntos sobre tu tejado";
    T.undo.disabled = n === 0;
    T.clear.disabled = n === 0;
    validate3();
  }

  function validate3() {
    var ok = polygonInfo().ok || !!state.areaManual;
    if (T.next) T.next.disabled = !ok;
    if (ok) setMsg(T.msg, "");
  }

  /* =====================================================================
     PASO 4 · CÁLCULO (determinista)
     ===================================================================== */
  onEnter[4] = function () {
    var items = $$("#checklist li");
    items.forEach(function (li) { li.className = ""; });
    var step = reduced ? 150 : 650;
    var anim = items.reduce(function (p, li, i) {
      return p.then(function () {
        if (i > 0) { items[i - 1].classList.remove("is-active"); items[i - 1].classList.add("is-done"); }
        li.classList.add("is-active");
        return wait(step);
      });
    }, Promise.resolve());

    var info = polygonInfo();
    var area = info.ok ? info.area : state.areaManual;
    Promise.all([fetchRend(), anim]).then(function (res) {
      var rend = res[0];
      items.forEach(function (li) { li.classList.remove("is-active"); li.classList.add("is-done"); });
      var f = state.factura || {};
      var r = CALC.calcula({
        gastoMensual: f.gasto, consumoMensual: f.consumo, consumoAnual: f.consumoAnual,
        precioKwh: f.precio, fijoMensual: f.fijo, areaM2: area, rendimiento: rend.rendimiento
      }, S);
      if (!r) { go(1); setMsg(F.msg, "Falta tu gasto mensual para calcular. Revísalo, por favor."); return; }
      state.resultado = r;
      state.rend = rend;
      state.areaUsada = area;
      save();
      return wait(reduced ? 0 : 350).then(function () { go(5); });
    });
  };

  /* =====================================================================
     PASO 5 · MURO DE EMAIL + INFORME
     ===================================================================== */
  var gateShownAt = 0;
  onEnter[5] = function () {
    if (!state.resultado) { go(3); return; }
    if (state.desbloqueado) { unlock(true); return; }
    $("#report").classList.add("is-locked");
    $("#report").setAttribute("aria-hidden", "true");
    $("#gate").hidden = false;
    gateShownAt = Date.now();
    drawChart(decoySerie(), true);
    $("#barNow").style.width = "100%";
    $("#barSolar").style.width = "46%";
    setTimeout(function () { var e = $("#gEmail"); if (e && window.innerWidth > 720) e.focus({ preventScroll: true }); }, 400);
  };

  function decoySerie() {
    var d = CALC.calcula({ gastoMensual: 110, areaM2: 45, rendimiento: 1500 }, S);
    return d ? d : null;
  }

  function initGate() {
    var form = $("#gateForm"), msg = $("#gMsg"), btn = $("#gSubmit");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      setMsg(msg, "");
      var email = $("#gEmail").value.trim(), tel = $("#gTel").value.trim(), consent = $("#gConsent").checked;
      var okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      var telDigits = tel.replace(/[^\d+]/g, "");
      var okTel = tel === "" || /^\+?\d{9,15}$/.test(telDigits);
      $("#gEmail").closest(".field").classList.toggle("is-error", !okEmail);
      $("#gTel").closest(".field").classList.toggle("is-error", !okTel);
      $("#gConsent").closest(".check").classList.toggle("is-error", !consent);
      if (!okEmail) { setMsg(msg, "Escribe un email válido."); $("#gEmail").focus(); return; }
      if (!okTel) { setMsg(msg, "Revisa el teléfono o déjalo vacío."); return; }
      if (!consent) { setMsg(msg, "Necesitamos tu consentimiento para enviarte el informe."); return; }

      var payload = buildLead(email, telDigits, $("#gMarketing").checked);
      btn.classList.add("is-busy");
      btn.textContent = "Desbloqueando…";
      api("lead.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }, 15000).then(function (r) {
        btn.classList.remove("is-busy");
        btn.innerHTML = 'Ver mi informe <i aria-hidden="true">→</i>';
        if (!r.ok && r.status === 422) { setMsg(msg, (r.data && r.data.mensaje) || "Revisa tus datos."); return; }
        if (!r.ok && (r.status === 0 || r.status >= 500)) {
          try { localStorage.setItem(PENDING, JSON.stringify(payload)); } catch (e2) { /* nada */ }
        }
        unlock(false);
      });
    });
  }

  function buildLead(email, tel, marketing) {
    var r = state.resultado, u = state.ubicacion || {}, f = state.factura || {};
    return {
      email: email, telefono: tel, consentimiento: true, comercial: !!marketing,
      web: $("#gWeb").value, t: Date.now() - gateShownAt,
      calculo: {
        gasto_mensual: r.entradas.gastoMensual, consumo_mensual: Math.round(r.entradas.consumoMensual),
        ahorro_mensual: Math.round(r.ahorroMensual * 100) / 100, ahorro_anual: Math.round(r.ahorroAnual),
        cobertura_pct: Math.round(r.cobertura * 100), payback: r.payback ? Math.round(r.payback * 10) / 10 : null,
        ahorro25: Math.round(r.ahorro25Neto), coste: Math.round(r.coste), kwp: r.kwp, placas: r.placas,
        area_m2: Math.round(state.areaUsada || 0), produccion: Math.round(r.produccionAnual),
        municipio: u.municipio || "", provincia: u.provincia || (state.rend && state.rend.provincia) || "", cp: u.cp || "",
        lat: u.lat ? Math.round(u.lat * 100) / 100 : null, lon: u.lon ? Math.round(u.lon * 100) / 100 : null,
        origen: state.origen === "ia" ? "ia" : "manual", comercializadora: f.comercializadora || ""
      }
    };
  }

  function unlock(fromRestore) {
    state.desbloqueado = true;
    save();
    $("#gate").hidden = true;
    var rep = $("#report");
    rep.classList.remove("is-locked");
    rep.removeAttribute("aria-hidden");
    $$(".progress__steps li").forEach(function (li) { li.classList.add("is-done"); li.classList.remove("is-current"); });
    $("#progressFill").style.width = "100%";
    renderReport(!fromRestore && !reduced);
    if (!fromRestore) {
      var h = $("#s5t");
      if (h) h.focus({ preventScroll: true });
      window.scrollTo({ top: Math.max(0, rep.getBoundingClientRect().top + window.pageYOffset - 16), behavior: reduced ? "auto" : "smooth" });
    }
  }

  function renderReport(animate) {
    var r = state.resultado;
    var vals = {
      ahorroAnual: [r.ahorroAnual, 0], ahorroMensual: [r.ahorroMensual, 0], cobertura: [Math.round(r.cobertura * 100), 0],
      placas: [r.placas, 0], kwp: [r.kwp, 2], produccion: [r.produccionAnual, 0], coste: [Math.round(r.coste / 50) * 50, 0],
      payback: [r.payback, 1], ahorro25: [r.ahorro25Neto, 0], co2: [r.co2TotalKg / 1000, 1], cuota: [r.cuotaMensual, 0],
      coberturaCuota: [Math.min(999, Math.round(r.coberturaCuota * 100)), 0], finMeses: [S.financiacionMeses, 0],
      gasto: [r.entradas.gastoMensual, 0], facturaCon: [r.facturaMensualCon, 0]
    };
    $$("[data-k]").forEach(function (el) {
      var k = el.getAttribute("data-k"), v = vals[k];
      if (!v) return;
      if (k === "payback" && !r.payback) { el.textContent = "más de 25"; return; }
      if (animate && typeof v[0] === "number") countUp(el, v[0], v[1]);
      else el.textContent = fmt(v[0], v[1]);
    });
    $("#barNow").style.width = "100%";
    $("#barSolar").style.width = Math.max(3, Math.min(100, r.facturaMensualCon / r.entradas.gastoMensual * 100)) + "%";
    drawChart(r, false);
    renderOffer();
    renderHow(r);
  }

  function countUp(el, to, dec) {
    var t0 = null, dur = 1300;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e, dec);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Gráfica: gasto acumulado en luz, con y sin placas ---------- */
  function drawChart(r, decoy) {
    var box = $("#chart");
    if (!box || !r || !r.serie) return;
    var W = 640, H = 300, L0 = 58, R0 = 18, T0 = 18, B0 = 34;
    var serie = [{ ano: 0, sinPlacas: 0, conPlacas: r.coste }].concat(r.serie);
    var maxY = Math.max(serie[serie.length - 1].sinPlacas, serie[serie.length - 1].conPlacas) * 1.08;
    var x = function (a) { return L0 + a / 25 * (W - L0 - R0); };
    var y = function (v) { return T0 + (1 - v / maxY) * (H - T0 - B0); };
    var pts = function (k) { return serie.map(function (s) { return x(s.ano).toFixed(1) + "," + y(s[k]).toFixed(1); }).join(" "); };
    var stepY = niceStep(maxY / 4), grid = "";
    for (var v = 0; v <= maxY; v += stepY) {
      grid += '<line class="ax" x1="' + L0 + '" x2="' + (W - R0) + '" y1="' + y(v) + '" y2="' + y(v) + '"/>' +
        '<text x="' + (L0 - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + (v >= 1000 ? fmt(v / 1000) + "k" : fmt(v)) + " €</text>";
    }
    [0, 5, 10, 15, 20, 25].forEach(function (a) { grid += '<text x="' + x(a) + '" y="' + (H - 10) + '" text-anchor="middle">' + (a === 0 ? "Hoy" : "Año " + a) + "</text>"; });

    // Punto en que las placas ya han salido más baratas que no tenerlas
    var cross = "";
    for (var i = 1; i < serie.length; i++) {
      var a = serie[i - 1], b = serie[i];
      if (a.conPlacas > a.sinPlacas && b.conPlacas <= b.sinPlacas) {
        var f = (a.conPlacas - a.sinPlacas) / ((a.conPlacas - a.sinPlacas) - (b.conPlacas - b.sinPlacas));
        var cx = x(a.ano + f), cy = y(a.sinPlacas + (b.sinPlacas - a.sinPlacas) * f);
        cross = '<circle class="pb" cx="' + cx + '" cy="' + cy + '" r="6"/><text class="pb-t" x="' + (cx + 10) + '" y="' + (cy - 12) + '">' + (decoy ? "Año ?" : "Recuperas la inversión · año " + fmt(a.ano + f, 1)) + "</text>";
        break;
      }
    }
    var area = x(0) + "," + y(0) + " " + pts("conPlacas") + " " + x(25) + "," + y(0);
    box.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<defs><linearGradient id="gOn" x1="0" x2="1"><stop offset="0" stop-color="#b9f27c"/><stop offset=".55" stop-color="#8fe3a0"/><stop offset="1" stop-color="#4fc48d"/></linearGradient>' +
      '<linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9f27c" stop-opacity=".18"/><stop offset="1" stop-color="#b9f27c" stop-opacity="0"/></linearGradient></defs>' +
      grid + '<polygon class="a-on" points="' + area + '"/>' +
      '<polyline class="l-off" points="' + pts("sinPlacas") + '"/><polyline class="l-on draw-me" points="' + pts("conPlacas") + '"/>' + cross + "</svg>";
    if (!reduced && !decoy) {
      var l = $(".draw-me", box);
      if (l && l.getTotalLength) { l.style.setProperty("--len", Math.ceil(l.getTotalLength())); l.classList.add("draw"); }
    }
  }
  function niceStep(raw) {
    var p = Math.pow(10, Math.floor(Math.log10(raw))), n = raw / p;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
  }

  /* ---------- Oferta semanal ---------- */
  var offerTimer = null;
  function renderOffer() {
    var o = CFG.oferta || {}, box = $("#offer");
    $("#ctaStudy").setAttribute("href", (CFG.mainUrl || "/") + (CFG.contactHash || "#contacto"));
    if (!o.activa) { $("h3", box).hidden = true; $(".offer__sub", box).hidden = true; $(".offer__tag", box).textContent = "Siguiente paso"; return; }
    var now = new Date(), end = new Date(now);
    end.setDate(now.getDate() + ((7 - now.getDay()) % 7));
    end.setHours(23, 59, 59, 0);
    var dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    $("#offerDate").textContent = dias[end.getDay()] + " " + end.getDate() + "/" + (end.getMonth() + 1);
    $("#offerAmount").textContent = fmt(o.descuentoEur || 0);
    $("#offerSlots").textContent = o.plazasSemana || 0;
    function tick() {
      var ms = end - new Date();
      if (ms <= 0) { $("#offerCountdown").textContent = "hoy"; return; }
      var d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
      $("#offerCountdown").textContent = (d ? d + (d === 1 ? " día y " : " días y ") : "") + h + " h " + (d ? "" : m + " min");
    }
    tick();
    clearInterval(offerTimer);
    offerTimer = setInterval(tick, 30000);
  }

  function renderHow(r) {
    var rend = state.rend || {};
    var items = [
      "Producción solar de tu zona: " + fmt(r.entradas.rendimiento) + " kWh por kWp al año (" + (rend.fuente === "PVGIS" ? "PVGIS, Comisión Europea" : "tabla orientativa por provincia") + "), placas a 30° orientadas al sur.",
      "Tejado: " + fmt(r.entradas.areaM2) + " m² · unos " + fmt(S.m2PorKwp, 1) + " m² por kWp · placas de " + S.wpPanel + " W." + (r.limitadoPorTejado ? " Tu tejado limita la potencia: una zona más amplia aumentaría el ahorro." : ""),
      "Consumo: " + fmt(r.entradas.consumoMensual) + " kWh/mes · precio de la energía " + fmt(r.entradas.precioKwh, 3) + " €/kWh con impuestos (" + (state.origen === "ia" ? "leído de tu factura" : "valor medio si no lo indicas") + ").",
      "Consumes al momento el " + Math.round(S.autoconsumo * 100) + " % de lo que producen las placas; los excedentes se descuentan a " + fmt(S.precioCompensacion, 2) + " €/kWh (compensación simplificada).",
      "Inversión: " + fmt(S.costeBaseEur) + " € + " + fmt(S.costeKwpEur) + " € por kWp, IVA incluido, sin descontar ayudas ni deducciones.",
      "Subida de la luz del " + fmt(S.subidaLuzAnual * 100, 0) + " % anual y pérdida de rendimiento de las placas del " + fmt(S.degradacionAnual * 100, 1) + " % anual, durante " + S.anos + " años.",
      "Financiación de referencia: " + S.financiacionMeses + " meses al " + fmt(S.financiacionTin * 100, 1) + " % TIN. CO₂: " + fmt(S.co2KgPorKwh, 2) + " kg por kWh."
    ];
    $("#howList").innerHTML = items.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
  }

  /* ---------- Repetir ---------- */
  function initRestart() {
    $("#restartBtn").addEventListener("click", function () {
      try { sessionStorage.removeItem(KEY); } catch (e) { /* nada */ }
      state = { paso: 1, factura: {}, origen: null, ubicacion: null, puntos: [], areaManual: null, resultado: null, rend: null, desbloqueado: false };
      [F.gasto, F.consumo, F.precio, F.fijo, F.potencia, G.input, T.manual].forEach(function (i) { if (i) i.value = ""; });
      F.datos.hidden = true; G.picked.hidden = true; G.next.disabled = true; F.next.disabled = true;
      $("#gate").hidden = false; $("#report").classList.add("is-locked");
      rendPromise = null;
      redraw();
      go(1);
    });
  }

  /* ---------- Reenvío de un lead que no se pudo guardar ---------- */
  function retryPending() {
    var p = null;
    try { p = JSON.parse(localStorage.getItem(PENDING) || "null"); } catch (e) { /* nada */ }
    if (!p) return;
    api("lead.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) }, 15000).then(function (r) {
      if (r.ok || r.status === 422) { try { localStorage.removeItem(PENDING); } catch (e) { /* nada */ } }
    });
  }

  /* ---------- Arranque ---------- */
  function start() {
    load();
    safe(initNav, "nav");
    safe(initFactura, "factura");
    safe(initUbicacion, "ubicacion");
    safe(initTejado, "tejado");
    safe(initGate, "muro");
    safe(initRestart, "repetir");
    safe(retryPending, "pendiente");

    var f = state.factura || {};
    var n = 1;
    if (state.desbloqueado && state.resultado) n = 5;
    else if (state.paso >= 3 && f.gasto && state.ubicacion) n = 3;
    else if (state.paso >= 2 && f.gasto) n = 2;
    go(n, { noFocus: true });
  }

  if (!CALC) { var s1 = document.getElementById("s1msg"); if (s1) s1.textContent = "No se ha podido cargar la calculadora. Recarga la página."; return; }
  start();
})();
