/* =====================================================================
   WIDGET DE CHAT "ASISTENTE SOLAR"
   Cómo usarlo: pega esta línea antes de </body> en tu página:

   <script src="chat-widget.js"
           data-endpoint="https://asistente-solar.TU-USUARIO.workers.dev"
           data-whatsapp="34600000000"
           data-contact="#contacto"
           data-name="Asistente solar"></script>

   - data-endpoint: la dirección de tu backend (Cloudflare Worker)
   - data-whatsapp: tu número con código de país, sin "+" ni espacios
   - data-contact: (opcional) enlace al formulario si no usas WhatsApp
   ===================================================================== */
(function () {
  const script = document.currentScript;
  const CONFIG = {
    endpoint: script?.dataset.endpoint || "",
    whatsapp: script?.dataset.whatsapp || "",
    name: script?.dataset.name || "Asistente solar",
    contact: script?.dataset.contact || "", // ej. "#contacto": botón al formulario si no hay WhatsApp
  };

  const SUGGESTIONS = [
    "¿Puedo poner placas en un tejado plano?",
    "¿Cuántos paneles necesito para mi casa?",
    "¿Funcionan en días nublados?",
  ];

  const history = []; // la conversación vive solo en esta pestaña

  // ---------- estilos ----------
  const css = `
  .sc-root{--sc-pine:#0C3628;--sc-ocean:#0A1F2C;--sc-leaf:#B9F27C;--sc-sun:#B9F27C;
    --sc-mist:#F5F6F0;--sc-ink:#0B1E27;--sc-soft:#5B6D66;--sc-line:#DDE3DA;
    --sc-font:"Manrope",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
    font-family:var(--sc-font);
    position:fixed;right:20px;bottom:20px;z-index:2147483000;color:var(--sc-ink)}
  .sc-root *{box-sizing:border-box}
  .sc-launch{display:flex;align-items:center;gap:10px;border:0;cursor:pointer;
    background:var(--sc-ocean);color:#fff;padding:10px 18px 10px 10px;border-radius:999px;border:1px solid rgba(238,242,234,.14);
    font:600 15px/1 var(--sc-font);box-shadow:0 10px 30px rgba(12,44,62,.35);transition:transform .2s}
  .sc-launch:hover{transform:translateY(-2px)}
  .sc-launch:focus-visible,.sc-root button:focus-visible,.sc-root textarea:focus-visible{
    outline:3px solid var(--sc-sun);outline-offset:2px}
  .sc-sun{width:36px;height:36px;border-radius:50%;background:var(--sc-sun);
    display:grid;place-items:center;flex:none}
  .sc-panel{position:absolute;right:0;bottom:64px;width:min(380px,calc(100vw - 32px));
    height:min(580px,calc(100vh - 110px));background:#fff;border-radius:22px;overflow:hidden;
    display:flex;flex-direction:column;box-shadow:0 24px 60px rgba(12,44,62,.35);
    transform-origin:bottom right;transform:scale(.92) translateY(10px);opacity:0;
    pointer-events:none;transition:transform .22s ease,opacity .22s ease}
  .sc-root.open .sc-panel{transform:none;opacity:1;pointer-events:auto}
  .sc-head{background:linear-gradient(160deg,var(--sc-pine),var(--sc-ocean));color:#fff;
    padding:16px 16px 14px;display:flex;align-items:center;gap:12px}
  .sc-head h2{margin:0;font:700 16px/1.2 var(--sc-font)}
  .sc-head p{margin:3px 0 0;font:400 13px/1.3 var(--sc-font);color:var(--sc-leaf)}
  .sc-close{margin-left:auto;background:rgba(255,255,255,.12);border:0;color:#fff;
    width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:18px}
  .sc-body{flex:1;overflow-y:auto;padding:16px;background:var(--sc-mist);
    display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}
  .sc-msg{max-width:86%;padding:10px 13px;border-radius:16px;font:400 14.5px/1.5 var(--sc-font);
    word-wrap:break-word}
  .sc-msg p{margin:0 0 6px}.sc-msg p:last-child{margin:0}
  .sc-msg ul,.sc-msg ol{margin:4px 0 6px;padding-left:20px}
  .sc-bot{background:#fff;border:1px solid var(--sc-line);border-bottom-left-radius:4px;align-self:flex-start}
  .sc-user{background:var(--sc-pine);color:#fff;border-bottom-right-radius:4px;align-self:flex-end}
  .sc-chips{display:flex;flex-direction:column;gap:6px;align-items:flex-start}
  .sc-chip{background:#fff;border:1px solid var(--sc-pine);color:var(--sc-pine);cursor:pointer;
    border-radius:999px;padding:7px 12px;font:500 13.5px/1.3 var(--sc-font);text-align:left}
  .sc-chip:hover{background:var(--sc-pine);color:#fff}
  .sc-typing{display:flex;gap:4px;padding:14px}
  .sc-typing span{width:7px;height:7px;border-radius:50%;background:var(--sc-soft);
    animation:sc-b 1s infinite ease-in-out}
  .sc-typing span:nth-child(2){animation-delay:.15s}.sc-typing span:nth-child(3){animation-delay:.3s}
  @keyframes sc-b{0%,80%,100%{opacity:.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
  .sc-wa{display:inline-block;margin-top:8px;background:#1FAF5A;color:#fff;text-decoration:none;
    padding:8px 12px;border-radius:10px;font:600 13.5px/1 var(--sc-font)}
  .sc-cta{display:inline-block;margin-top:8px;background:var(--sc-leaf);color:var(--sc-ocean);text-decoration:none;
    padding:8px 12px;border-radius:10px;font:700 13.5px/1 var(--sc-font)}
  .sc-foot{border-top:1px solid var(--sc-line);padding:10px;background:#fff}
  .sc-form{display:flex;gap:8px;align-items:flex-end}
  .sc-input{flex:1;resize:none;border:1px solid var(--sc-line);border-radius:14px;
    padding:10px 12px;font:400 14.5px/1.4 var(--sc-font);max-height:110px;color:var(--sc-ink)}
  .sc-send{background:var(--sc-pine);color:#fff;border:0;border-radius:12px;width:42px;height:42px;
    cursor:pointer;display:grid;place-items:center;flex:none}
  .sc-send:disabled{opacity:.45;cursor:not-allowed}
  .sc-note{margin:7px 2px 0;font:400 11.5px/1.35 var(--sc-font);color:var(--sc-soft)}
  @media (max-width:480px){.sc-root{right:12px;bottom:12px}
    .sc-launch-text{display:none}.sc-launch{padding:10px}}
  @media (prefers-reduced-motion:reduce){.sc-panel,.sc-launch{transition:none}.sc-typing span{animation:none}}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- estructura ----------
  const sunIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A1F2C" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;

  const root = document.createElement("div");
  root.className = "sc-root";
  root.innerHTML = `
    <div class="sc-panel" role="dialog" aria-label="${esc(CONFIG.name)}">
      <div class="sc-head">
        <div class="sc-sun">${sunIcon}</div>
        <div><h2>${esc(CONFIG.name)}</h2><p>Resuelvo tus dudas sobre placas solares</p></div>
        <button class="sc-close" aria-label="Cerrar chat">×</button>
      </div>
      <div class="sc-body" aria-live="polite"></div>
      <div class="sc-foot">
        <form class="sc-form">
          <textarea class="sc-input" rows="1" maxlength="1000" placeholder="Escribe tu pregunta…" aria-label="Tu pregunta"></textarea>
          <button class="sc-send" type="submit" aria-label="Enviar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </form>
        <p class="sc-note">Las respuestas son orientativas. No compartas datos personales en este chat.</p>
      </div>
    </div>
    <button class="sc-launch" aria-expanded="false">
      <span class="sc-sun">${sunIcon}</span><span class="sc-launch-text">¿Tienes dudas?</span>
    </button>`;
  document.body.appendChild(root);

  const $ = (s) => root.querySelector(s);
  const body = $(".sc-body"), input = $(".sc-input"), send = $(".sc-send"),
        launch = $(".sc-launch"), form = $(".sc-form");

  // Mensaje de bienvenida + preguntas sugeridas
  addBot("¡Hola! Pregúntame lo que quieras sobre placas solares: tipos de tejado, cuántos paneles necesitas, ahorro, mantenimiento…");
  const chips = document.createElement("div");
  chips.className = "sc-chips";
  SUGGESTIONS.forEach((q) => {
    const b = document.createElement("button");
    b.className = "sc-chip"; b.type = "button"; b.textContent = q;
    b.onclick = () => { chips.remove(); ask(q); };
    chips.appendChild(b);
  });
  body.appendChild(chips);

  // ---------- eventos ----------
  launch.onclick = () => toggle();
  $(".sc-close").onclick = () => toggle(false);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggle(false); });

  form.onsubmit = (e) => { e.preventDefault(); const t = input.value.trim(); if (t) { chips.remove(); ask(t); } };
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
  });
  input.addEventListener("input", () => {
    input.style.height = "auto"; input.style.height = input.scrollHeight + "px";
  });

  function toggle(force) {
    const open = force ?? !root.classList.contains("open");
    root.classList.toggle("open", open);
    launch.setAttribute("aria-expanded", String(open));
    if (open) setTimeout(() => input.focus(), 200);
  }

  // ---------- conversación ----------
  async function ask(text) {
    addUser(text);
    history.push({ role: "user", content: text });
    input.value = ""; input.style.height = "auto";
    send.disabled = true;
    const typing = showTyping();

    try {
      if (!CONFIG.endpoint) throw new Error("no-endpoint");
      const res = await fetch(CONFIG.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-10) }),
      });
      const data = await res.json().catch(() => ({}));
      typing.remove();

      if (data.reply) {
        addBot(data.reply, !res.ok); // si hubo límite, muestra también WhatsApp
        if (res.ok) history.push({ role: "assistant", content: data.reply });
      } else {
        addBot("No he podido responder en este momento. Un asesor puede ayudarte personalmente.", true);
      }
    } catch (err) {
      typing.remove();
      addBot(err.message === "no-endpoint"
        ? "Nuestro asistente estará disponible muy pronto. Mientras tanto, un asesor puede resolver tus dudas personalmente."
        : "No hay conexión con el asistente. Revisa tu internet o habla directamente con un asesor.", true);
    } finally {
      send.disabled = false;
      input.focus();
    }
  }

  function addUser(text) {
    const d = document.createElement("div");
    d.className = "sc-msg sc-user"; d.textContent = text;
    body.appendChild(d); scroll();
  }

  function addBot(text, withWhatsApp) {
    const d = document.createElement("div");
    d.className = "sc-msg sc-bot";
    d.innerHTML = renderMarkdown(text);
    if (withWhatsApp && CONFIG.whatsapp) {
      const a = document.createElement("a");
      a.className = "sc-wa"; a.target = "_blank"; a.rel = "noopener";
      a.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Hola, tengo una duda sobre placas solares")}`;
      a.textContent = "Escribir por WhatsApp";
      d.appendChild(a);
    } else if (withWhatsApp && CONFIG.contact) {
      const a = document.createElement("a");
      a.className = "sc-cta"; a.href = CONFIG.contact;
      a.textContent = "Pedir estudio gratuito";
      a.onclick = () => toggle(false);
      d.appendChild(a);
    }
    body.appendChild(d); scroll();
  }

  function showTyping() {
    const d = document.createElement("div");
    d.className = "sc-msg sc-bot sc-typing";
    d.setAttribute("aria-label", "El asistente está escribiendo");
    d.innerHTML = "<span></span><span></span><span></span>";
    body.appendChild(d); scroll();
    return d;
  }

  function scroll() { body.scrollTop = body.scrollHeight; }

  // Convierte **negritas** y listas en HTML de forma SEGURA (escapa todo antes)
  function renderMarkdown(src) {
    const lines = esc(src).split("\n");
    let html = "", list = null;
    for (const raw of lines) {
      const line = raw.trim();
      const ul = line.match(/^[-*•]\s+(.*)/), ol = line.match(/^\d+[.)]\s+(.*)/);
      const type = ul ? "ul" : ol ? "ol" : null;
      if (list && list !== type) { html += `</${list}>`; list = null; }
      if (type) {
        if (!list) { html += `<${type}>`; list = type; }
        html += `<li>${inline((ul || ol)[1])}</li>`;
      } else if (line) {
        html += `<p>${inline(line)}</p>`;
      }
    }
    if (list) html += `</${list}>`;
    return html;
  }
  function inline(s) { return s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
})();
