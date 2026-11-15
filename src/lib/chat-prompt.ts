import {
  assistant,
  company,
  delivery,
  extras,
  faq,
  formatMXN,
  maintenance,
  plans,
  pricing,
  processSteps,
  projectTypes,
  services,
} from "@/config/site";

/** Prompt de sistema del Asistente Vantgard, armado con el contenido de site.ts. */
export function buildSystemPrompt() {
  const lines = [
    `Eres "${assistant.name}", el asistente de ventas de ${company.name}.`,
    company.description,
    "",
    "REGLAS",
    ...assistant.rules.map((r) => `- ${r}`),
    "",
    `PRECIOS (en ${pricing.currency}, ${pricing.taxLabel}; ${pricing.note})`,
    "Planes:",
    ...plans.map((p) => `- ${p.name}: desde ${formatMXN(p.price)}. ${p.summary} Incluye: ${p.features.join("; ")}.`),
    "Tipos de proyecto del cotizador:",
    ...projectTypes.map(
      (t) =>
        `- ${t.label}: desde ${formatMXN(t.base)}, incluye ${t.included} ${t.unit.plural}; cada ${t.unit.singular} adicional ${formatMXN(t.perUnit)}.`,
    ),
    "Extras:",
    ...extras.map((e) => `- ${e.label}: ${formatMXN(e.price)}. ${e.description}`),
    "Mantenimiento mensual (opcional):",
    ...maintenance
      .filter((m) => m.monthly > 0)
      .map((m) => `- ${m.label}: ${formatMXN(m.monthly)}/mes. ${m.features.join("; ")}.`),
    "Tiempos de entrega:",
    ...delivery.map(
      (d) => `- ${d.label}: ${d.time}${d.surcharge ? ` (+${Math.round(d.surcharge * 100)} % sobre el total)` : ""}.`,
    ),
    "",
    "SERVICIOS",
    ...services.map((s) => `- ${s.title}: ${s.description}`),
    "",
    "PROCESO",
    ...processSteps.map((s, i) => `${i + 1}. ${s.title}: ${s.description}`),
    "",
    "PREGUNTAS FRECUENTES",
    ...faq.map((f) => `P: ${f.q}\nR: ${f.a}`),
    "",
    "CONTACTO",
    `- Correo: ${company.email}`,
    `- Horario: ${company.hours}`,
    "- WhatsApp: indica que use el botón «Hablar por WhatsApp» del chat.",
    "- Cotizador: indica que use el botón «Abrir cotizador» del chat o la página /cotizar.",
  ];
  return lines.join("\n");
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Respuesta del modo demo (sin GEMINI_API_KEY): por palabras clave. */
export function demoReply(message: string) {
  const m = norm(message);
  const r = assistant.demoReplies;
  if (/whats|humano|persona|asesor/.test(m)) return r.whatsapp;
  if (/demo|anticipo|sandbox|prueba/.test(m)) return r.demo;
  if (/tienda|vender|producto|carrito|ecommerce/.test(m)) return r.tienda;
  if (/cita|agenda|reserv/.test(m)) return r.citas;
  if (/agente|ia\b|inteligencia|chatbot|bot\b/.test(m)) return r.agente;
  if (/tiempo|tarda|cuando|dias|entrega|urge/.test(m)) return r.tiempo;
  if (/pago|pagar|tarjeta|transfer|factura|meses/.test(m)) return r.pago;
  if (/cuanto|cuesta|precio|costo|cotiza|vale/.test(m)) return r.precio;
  return r.fallback;
}
