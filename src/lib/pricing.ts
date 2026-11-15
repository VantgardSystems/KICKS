import {
  bundles,
  delivery,
  extras,
  formatMXN,
  maintenance,
  pricing,
  projectTypes,
  type DeliveryId,
  type ExtraId,
  type MaintenanceId,
  type ProjectTypeId,
} from "@/config/site";

export interface QuoteChoices {
  type: ProjectTypeId;
  units: number;
  extras: ExtraId[];
  delivery: DeliveryId;
  maintenance: MaintenanceId;
}

export interface QuoteLine {
  label: string;
  amount: number;
  note?: string;
}

export interface QuoteResult {
  lines: QuoteLine[];
  total: number;
  min: number;
  max: number;
  monthly: number;
  monthlyLabel: string;
  deliveryLabel: string;
  typeLabel: string;
}

export const defaultChoices: QuoteChoices = {
  type: "profesional",
  units: 5,
  extras: [],
  delivery: "normal",
  maintenance: "ninguno",
};

export function getType(id: ProjectTypeId) {
  return projectTypes.find((t) => t.id === id) ?? projectTypes[0];
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Limpia cualquier entrada (del navegador o del servidor) contra site.ts. */
export function sanitizeChoices(input: Partial<QuoteChoices> | null | undefined): QuoteChoices {
  const type = projectTypes.find((t) => t.id === input?.type) ?? getType(defaultChoices.type);
  const rawUnits = Number(input?.units);
  const units = Number.isFinite(rawUnits)
    ? clamp(Math.round(rawUnits / type.step) * type.step, type.min, type.max)
    : type.included;
  const valid = new Set(extras.map((e) => e.id));
  const included = new Set(type.includesExtras ?? []);
  const chosen = Array.isArray(input?.extras)
    ? [...new Set(input.extras)].filter((id) => valid.has(id) && !included.has(id))
    : [];
  return {
    type: type.id,
    units,
    extras: chosen,
    delivery: delivery.some((d) => d.id === input?.delivery) ? input!.delivery! : "normal",
    maintenance: maintenance.some((m) => m.id === input?.maintenance) ? input!.maintenance! : "ninguno",
  };
}

/** Todos los números salen de site.ts. Se usa igual en cliente y servidor. */
export function calcQuote(raw: QuoteChoices): QuoteResult {
  const c = sanitizeChoices(raw);
  const type = getType(c.type);
  const lines: QuoteLine[] = [];

  lines.push({
    label: type.label,
    amount: type.base,
    note: `Incluye hasta ${type.included} ${type.unit.plural}`,
  });

  const extraUnits = Math.max(0, c.units - type.included);
  if (extraUnits > 0) {
    lines.push({
      label: `${extraUnits} ${extraUnits === 1 ? type.unit.singular : type.unit.plural} adicionales`,
      amount: extraUnits * type.perUnit,
      note: `${formatMXN(type.perUnit)} c/u`,
    });
  }

  for (const id of type.includesExtras ?? []) {
    const e = extras.find((x) => x.id === id);
    if (e) lines.push({ label: e.label, amount: 0, note: "Incluido" });
  }

  for (const id of c.extras) {
    const e = extras.find((x) => x.id === id);
    if (e) lines.push({ label: e.label, amount: e.price });
  }

  const owned = new Set<ExtraId>([...c.extras, ...(type.includesExtras ?? [])]);
  for (const b of bundles) {
    // El descuento solo aplica si ambos extras se pagan aparte.
    if (b.requires.every((id) => c.extras.includes(id)) && b.requires.every((id) => owned.has(id))) {
      lines.push({ label: b.label, amount: -b.discount, note: "Descuento" });
    }
  }

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);
  const d = delivery.find((x) => x.id === c.delivery) ?? delivery[0];
  if (d.surcharge > 0) {
    lines.push({
      label: `Entrega ${d.label}`,
      amount: Math.round(subtotal * d.surcharge),
      note: `+${Math.round(d.surcharge * 100)} %`,
    });
  }

  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  const m = maintenance.find((x) => x.id === c.maintenance) ?? maintenance[0];

  return {
    lines,
    total,
    min: Math.floor((total * (1 - pricing.rangeSpread)) / 100) * 100,
    max: Math.ceil((total * (1 + pricing.rangeSpread)) / 100) * 100,
    monthly: m.monthly,
    monthlyLabel: m.label,
    deliveryLabel: `${d.label} (${d.time})`,
    typeLabel: type.label,
  };
}

export function rangeText(q: QuoteResult) {
  return `${formatMXN(q.min)} – ${formatMXN(q.max)} ${pricing.currency}`;
}

export interface QuoteContact {
  name: string;
  business: string;
  industry: string;
  whatsapp: string;
  email: string;
}

/** Texto plano del resumen: sirve para WhatsApp y para el correo. */
export function quoteSummaryText(choices: QuoteChoices, contact: QuoteContact) {
  const q = calcQuote(choices);
  const type = getType(sanitizeChoices(choices).type);
  const rows = q.lines.map(
    (l) => `• ${l.label}: ${l.amount === 0 ? "incluido" : (l.amount < 0 ? "-" : "") + formatMXN(Math.abs(l.amount))}`,
  );
  return [
    "Hola, quiero cotizar mi página con Vantgard Systems.",
    "",
    `Nombre: ${contact.name}`,
    `Negocio: ${contact.business}`,
    `Giro: ${contact.industry}`,
    `WhatsApp: ${contact.whatsapp}`,
    `Correo: ${contact.email}`,
    "",
    `Proyecto: ${q.typeLabel} (${sanitizeChoices(choices).units} ${type.unit.plural})`,
    ...rows,
    `Entrega: ${q.deliveryLabel}`,
    `Mantenimiento: ${q.monthlyLabel}${q.monthly ? ` (${formatMXN(q.monthly)}/mes)` : ""}`,
    "",
    `Estimado: ${rangeText(q)} ${pricing.taxLabel}`,
    pricing.note,
  ].join("\n");
}
