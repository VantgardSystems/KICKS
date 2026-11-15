/** Validación compartida: mismas reglas en el navegador y en el servidor. */

export type Validator = (value: string) => string | null;

const clean = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export const rules = {
  name: (v: string) => (clean(v).length >= 2 ? null : "Escribe tu nombre."),
  business: (v: string) => (clean(v).length >= 2 ? null : "Escribe el nombre de tu negocio."),
  industry: (v: string) => (clean(v).length >= 2 ? null : "Escribe el giro, por ejemplo: clínica dental."),
  whatsapp: (v: string) => {
    const digits = clean(v).replace(/\D/g, "").replace(/^521?(?=\d{10}$)/, "");
    return digits.length === 10 ? null : "Escribe los 10 dígitos, por ejemplo 55 1234 5678.";
  },
  email: (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean(v)) && clean(v).length <= 254
      ? null
      : "Escribe un correo como nombre@dominio.com.",
  service: (v: string) => (clean(v) ? null : "Elige el servicio que te interesa."),
  message: (v: string) => {
    const len = clean(v).length;
    if (len < 10) return "Cuéntanos un poco más, con una frase basta.";
    if (len > 2000) return "Acorta el mensaje a 2,000 caracteres.";
    return null;
  },
  privacy: (v: string) => (v === "true" ? null : "Marca la casilla para poder contactarte."),
} satisfies Record<string, Validator>;

export type RuleName = keyof typeof rules;

export function validate<T extends RuleName>(fields: readonly T[], data: Record<string, unknown>) {
  const errors: Partial<Record<T, string>> = {};
  for (const f of fields) {
    const raw = data[f];
    const value = typeof raw === "boolean" ? String(raw) : clean(raw);
    const error = rules[f](value);
    if (error) errors[f] = error;
  }
  return errors;
}

/** Recorta y limita texto libre que llega al servidor. */
export function sanitizeText(value: unknown, max = 300) {
  return clean(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .slice(0, max);
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
