/* =========================================================
   Solenna · interacciones
   Script clásico + IIFE. Cada init va envuelto en safe():
   si uno falla, el resto de la web sigue funcionando.
   ========================================================= */
(function () {
  "use strict";

  var BRAND = window.__BRAND__ || {};
  var doc = document.documentElement;
  var body = document.body;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  // Solo para efectos intrusivos (splash largo, parallax, partículas pesadas)
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function safe(fn, name) {
    try { fn(); } catch (e) { if (window.console) console.warn("[Solenna] " + name + ":", e); }
  }
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  /* ---------- Splash ---------- */
  function initSplash() {
    var splash = $("#splash"), count = $("#splashCount");
    var done = false, n = 0;
    function finish() {
      if (done) return;
      done = true;
      if (count) count.textContent = "100";
      body.classList.add("is-loaded");
      setTimeout(function () { if (splash) splash.style.display = "none"; }, 1200);
    }
    var timer = setInterval(function () {
      n = Math.min(n + Math.ceil(Math.random() * 9), 99);
      if (count) count.textContent = n < 10 ? "0" + n : String(n);
    }, 40);
    var minTime = reduced ? 300 : 1400;
    var start = Date.now();
    function onLoad() {
      setTimeout(function () { clearInterval(timer); finish(); }, Math.max(0, minTime - (Date.now() - start)));
    }
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);
    // Red de seguridad: pase lo que pase, a los 2,8 s se muestra la web
    setTimeout(function () { clearInterval(timer); finish(); }, 2800);
  }

  /* ---------- Titular del hero: retardo escalonado por palabra ---------- */
  function initHeroWords() {
    $$(".hero__title .word").forEach(function (w, i) { w.style.setProperty("--i", i); });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  function initReveal() {
    var items = $$(".reveal, .parallax-in");
    // Escalonado entre hermanos
    items.forEach(function (el) {
      var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.classList.contains("reveal"); });
      var idx = sibs.indexOf(el);
      if (idx > 0) el.style.setProperty("--d", Math.min(idx, 6) * 90 + "ms");
    });
    function showAll() { items.forEach(function (el) { el.classList.add("is-in"); }); }
    if (!("IntersectionObserver" in window)) { showAll(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.02, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (el) { io.observe(el); });
    // Red de seguridad: lo que esté en pantalla a los 3 s se muestra sí o sí
    setTimeout(function () {
      items.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in");
      });
    }, 3000);
  }

  /* ---------- Contadores ---------- */
  function initCounters() {
    var els = $$(".count");
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target, to = parseFloat(el.getAttribute("data-to")), t0 = null, dur = 1800;
        function step(t) {
          if (!t0) t0 = t;
          var p = clamp((t - t0) / dur, 0, 1), ease = 1 - Math.pow(1 - p, 4);
          el.textContent = fmt(to * ease);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Manifiesto: las palabras se encienden al hacer scroll ---------- */
  function initManifesto() {
    var p = $("#manifesto");
    if (!p) return;
    var highlight = ["sol", "gratis", "conectamos"];
    var words = p.textContent.trim().split(/\s+/);
    p.innerHTML = words.map(function (w) {
      var clean = w.toLowerCase().replace(/[^a-záéíóúñ]/g, "");
      var cls = highlight.indexOf(clean) > -1 ? "w hl" : "w";
      return '<span class="' + cls + '">' + w + "</span>";
    }).join(" ");
    var spans = $$(".w", p);
    function update() {
      var r = p.getBoundingClientRect(), vh = window.innerHeight;
      var prog = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
      var lit = Math.round(prog * spans.length);
      for (var i = 0; i < spans.length; i++) spans[i].classList.toggle("on", i < lit);
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Nav: se oculta al bajar, vuelve al subir ---------- */
  function initNav() {
    var nav = $("#nav"), last = 0;
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      nav.classList.toggle("is-scrolled", y > 40);
      nav.classList.toggle("is-hidden", y > 500 && y > last && !body.classList.contains("menu-open"));
      last = y;
    }, { passive: true });

    var burger = $("#burger"), menu = $("#menu");
    function toggle(open) {
      burger.setAttribute("aria-expanded", open);
      menu.classList.toggle("is-open", open);
      menu.setAttribute("aria-hidden", !open);
      body.classList.toggle("menu-open", open);
    }
    burger.addEventListener("click", function () { toggle(burger.getAttribute("aria-expanded") !== "true"); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { toggle(false); }); });
  }

  /* ---------- Cursor personalizado + botones magnéticos ---------- */
  function initCursor() {
    if (!finePointer) return;
    body.classList.add("has-cursor");
    var dot = $(".cursor__dot"), ring = $(".cursor__ring");
    var x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    window.addEventListener("mousemove", function (e) { x = e.clientX; y = e.clientY; }, { passive: true });
    (function loop() {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      dot.style.transform = "translate(" + x + "px," + y + "px)";
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      requestAnimationFrame(loop);
    })();
    $$("a, button, input[type=range], label").forEach(function (el) {
      el.addEventListener("mouseenter", function () { body.classList.add("cursor-hover"); });
      el.addEventListener("mouseleave", function () { body.classList.remove("cursor-hover"); });
    });
  }

  function initMagnetic() {
    if (!finePointer) return;
    $$(".magnetic").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + dx * 0.22 + "px," + dy * 0.3 + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- Tarjetas: inclinación 3D + foco de luz ---------- */
  function initTilt() {
    if (!finePointer) return;
    $$(".tilt").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
        card.style.transform = "perspective(1000px) rotateX(" + (0.5 - py) * 6 + "deg) rotateY(" + (px - 0.5) * 6 + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  /* ---------- Parallax suave en el hero ---------- */
  function initParallax() {
    if (reduced) return;
    var els = $$("[data-speed]"), visual = $("#heroVisual");
    var mx = 0, my = 0;
    if (finePointer) {
      window.addEventListener("mousemove", function (e) {
        mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5;
      }, { passive: true });
    }
    (function loop() {
      var y = window.scrollY;
      if (y < innerHeight * 1.2) {
        els.forEach(function (el) {
          var s = parseFloat(el.getAttribute("data-speed"));
          el.style.transform = "translate3d(" + mx * s * 300 + "px," + (y * s + my * s * 300) + "px,0)";
        });
        if (visual) visual.style.transform = "translate3d(0," + y * 0.08 + "px,0)";
      }
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Lienzo del hero: polvo de luz que sube hacia el sol ---------- */
  function initCanvas() {
    var c = $("#heroCanvas");
    if (!c || !c.getContext) return;
    var ctx = c.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h, parts = [], mouse = { x: -999, y: -999 }, visible = true;
    var count = innerWidth < 700 ? 40 : 90;
    if (reduced) count = Math.round(count / 2);

    function resize() {
      w = c.offsetWidth; h = c.offsetHeight;
      c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn(p, fresh) {
      p.x = Math.random() * w;
      p.y = fresh ? Math.random() * h : h + 10;
      p.r = Math.random() * 1.8 + 0.4;
      p.vy = -(Math.random() * 0.35 + 0.08);
      p.vx = (Math.random() - 0.5) * 0.15;
      p.a = Math.random() * 0.6 + 0.2;
      p.t = Math.random() * Math.PI * 2;
      return p;
    }
    resize();
    for (var i = 0; i < count; i++) parts.push(spawn({}, true));
    window.addEventListener("resize", resize);
    c.parentNode.addEventListener("mousemove", function (e) {
      var r = c.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0 }).observe(c);
    }

    (function draw() {
      requestAnimationFrame(draw);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      // Rayos de luz diagonales que respiran
      var t = Date.now() * 0.0002;
      for (var k = 0; k < 4; k++) {
        var x0 = w * (0.55 + k * 0.12) + Math.sin(t + k) * 30;
        var g = ctx.createLinearGradient(x0, 0, x0 - w * 0.35, h);
        var alpha = 0.035 + Math.sin(t * 2 + k) * 0.015;
        g.addColorStop(0, "rgba(185,242,124," + alpha + ")");
        g.addColorStop(1, "rgba(185,242,124,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(x0 - 30, 0); ctx.lineTo(x0 + 30 + k * 10, 0);
        ctx.lineTo(x0 - w * 0.35 + 120, h); ctx.lineTo(x0 - w * 0.35, h);
        ctx.fill();
      }
      for (var j = 0; j < parts.length; j++) {
        var p = parts[j];
        p.t += 0.02;
        p.x += p.vx + Math.sin(p.t) * 0.15;
        p.y += p.vy;
        var dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) { p.x += dx / d * 1.2; p.y += dy / d * 1.2; }
        if (p.y < -10) spawn(p, false);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(205,248,150," + (p.a * (0.6 + Math.sin(p.t) * 0.4)) + ")";
        ctx.fill();
      }
    })();
  }

  /* ---------- Producción "en vivo" ---------- */
  function initLive() {
    var el = $("#liveKwh");
    if (!el) return;
    var v = 18.4;
    setInterval(function () {
      v += Math.random() * 0.08;
      el.textContent = v.toFixed(1).replace(".", ",");
    }, 1600);
  }

  /* ---------- Calculadora de ahorro ---------- */
  function initCalc() {
    var range = $("#bill");
    if (!range) return;
    var cfg = BRAND.calc || { savingRate: 0.72, kgCO2PerEuro: 1.15, priceIncrease: 0.03, years: 25 };
    var out = $("#billOut"), y1 = $("#resYear"), y25 = $("#res25"), co2 = $("#resCo2");
    var shown = { a: 0, b: 0, c: 0 }, target = { a: 0, b: 0, c: 0 }, raf = null;

    function tween() {
      var moving = false;
      ["a", "b", "c"].forEach(function (k) {
        var diff = target[k] - shown[k];
        if (Math.abs(diff) > 0.5) { shown[k] += diff * 0.16; moving = true; } else shown[k] = target[k];
      });
      y1.textContent = fmt(shown.a); y25.textContent = fmt(shown.b); co2.textContent = fmt(shown.c);
      raf = moving ? requestAnimationFrame(tween) : null;
    }
    function update() {
      var bill = +range.value;
      out.textContent = bill;
      range.style.setProperty("--p", ((bill - range.min) / (range.max - range.min)) * 100 + "%");
      var year = bill * 12 * cfg.savingRate;
      var total = year * (Math.pow(1 + cfg.priceIncrease, cfg.years) - 1) / cfg.priceIncrease;
      target.a = year; target.b = Math.round(total / 100) * 100; target.c = year * cfg.kgCO2PerEuro;
      if (!raf) raf = requestAnimationFrame(tween);
    }
    range.addEventListener("input", update);
    update();
  }

  /* ---------- Línea de progreso del proceso ---------- */
  function initSteps() {
    var wrap = $("#steps"), fill = $("#stepsFill");
    if (!wrap || !fill) return;
    function update() {
      var r = wrap.getBoundingClientRect(), vh = window.innerHeight;
      var p = clamp((vh * 0.8 - r.top) / (r.height + vh * 0.2), 0, 1);
      fill.style.setProperty("--prog", p);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- Fotos que se desplazan dentro de su marco al hacer scroll ---------- */
  function initDrift() {
    if (reduced) return;
    var imgs = $$("[data-drift]");
    function update() {
      var vh = window.innerHeight;
      imgs.forEach(function (img) {
        var r = img.parentNode.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var p = clamp((vh - r.top) / (vh + r.height), 0, 1);
        img.style.transform = "translate3d(0," + (-p * 15) + "%,0)";
      });
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Escena: la foto se expande a pantalla completa al hacer scroll ---------- */
  function initScene() {
    var scene = $("#escena");
    if (!scene) return;
    if (reduced) { scene.style.setProperty("--p", 1); return; }
    function update() {
      var r = scene.getBoundingClientRect(), vh = window.innerHeight;
      var travel = r.height - vh;
      var p = clamp((vh * 0.6 - r.top) / (vh * 0.6 + travel * 0.6), 0, 1);
      scene.style.setProperty("--p", p.toFixed(3));
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Testimonios ---------- */
  function initTestimonials() {
    var stage = $("#testiStage");
    if (!stage) return;
    var quotes = $$(".quote", stage), idx = 0, timer, bar = $("#tBar");
    $("#tTotal").textContent = ("0" + quotes.length).slice(-2);

    quotes.forEach(function (q) {
      var bq = $("blockquote", q);
      bq.innerHTML = bq.textContent.split(" ").map(function (w, i) {
        return '<span class="qw" style="--i:' + i + '">' + w + "</span>";
      }).join(" ");
    });

    function go(n) {
      quotes[idx].classList.remove("is-active");
      idx = (n + quotes.length) % quotes.length;
      quotes[idx].classList.add("is-active");
      $("#tIdx").textContent = ("0" + (idx + 1)).slice(-2);
      restart();
    }
    function restart() {
      clearTimeout(timer);
      bar.classList.remove("run"); void bar.offsetWidth; bar.classList.add("run");
      timer = setTimeout(function () { go(idx + 1); }, 7000);
    }
    $("#tNext").addEventListener("click", function () { go(idx + 1); });
    $("#tPrev").addEventListener("click", function () { go(idx - 1); });

    // Deslizar con el dedo
    var sx = null;
    stage.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1));
      sx = null;
    });
    restart();
  }

  /* ---------- Formulario de contacto ---------- */
  function initForm() {
    var form = $("#contactForm");
    if (!form) return;
    var msg = $("#formMsg"), ok = $("#formOk");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var errors = [];
      $$(".field", form).forEach(function (f) { f.classList.remove("is-error"); });
      var name = $("#f-name"), phone = $("#f-phone"), cp = $("#f-cp"), email = $("#f-email");
      var priv = $("input[name=privacidad]", form);
      if (name.value.trim().length < 2) { name.parentNode.classList.add("is-error"); errors.push("nombre"); }
      if (!/^[\d\s+]{9,}$/.test(phone.value.trim())) { phone.parentNode.classList.add("is-error"); errors.push("teléfono"); }
      if (!/^\d{5}$/.test(cp.value.trim())) { cp.parentNode.classList.add("is-error"); errors.push("código postal"); }
      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { email.parentNode.classList.add("is-error"); errors.push("email"); }
      priv.parentNode.classList.toggle("is-error", !priv.checked);
      if (!priv.checked) errors.push("aceptar la privacidad");
      if (errors.length) { msg.textContent = "Revisa: " + errors.join(", ") + "."; return; }
      msg.textContent = "";
      // TODO: conectar con el sistema de envío real (correo / CRM)
      ok.hidden = false;
    });
  }

  safe(initSplash, "splash");
  safe(initHeroWords, "heroWords");
  safe(initReveal, "reveal");
  safe(initCounters, "counters");
  safe(initManifesto, "manifesto");
  safe(initNav, "nav");
  safe(initCursor, "cursor");
  safe(initMagnetic, "magnetic");
  safe(initTilt, "tilt");
  safe(initParallax, "parallax");
  safe(initCanvas, "canvas");
  safe(initLive, "live");
  safe(initCalc, "calc");
  safe(initSteps, "steps");
  safe(initScene, "scene");
  safe(initDrift, "drift");
  safe(initTestimonials, "testimonials");
  safe(initForm, "form");
})();
