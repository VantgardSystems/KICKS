import { NextResponse } from "next/server";
import { company, contactServices } from "@/config/site";
import { inbox, sendEmail } from "@/lib/email";
import { clientIp, rateLimit, sameOrigin } from "@/lib/rate-limit";
import { sanitizeText, validate } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });

  const limit = rateLimit(`contact:${clientIp(request)}`, 5, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Recibimos varios mensajes seguidos. Espera unos minutos o escríbenos por WhatsApp." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot
  if (sanitizeText(body.website)) return NextResponse.json({ ok: true });

  const errors = validate(["name", "business", "whatsapp", "email", "message", "privacy"], body);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const service = sanitizeText(body.service, 60);
  const data = {
    name: sanitizeText(body.name, 80),
    business: sanitizeText(body.business, 120),
    whatsapp: sanitizeText(body.whatsapp, 20),
    email: sanitizeText(body.email, 254),
    service: (contactServices as readonly string[]).includes(service) ? service : "Aún no lo sé",
    message: sanitizeText(body.message, 2000),
  };

  const result = await sendEmail({
    to: inbox(),
    subject: `Nuevo contacto: ${data.business} (${data.service})`,
    text: [
      `Nombre: ${data.name}`,
      `Negocio: ${data.business}`,
      `WhatsApp: ${data.whatsapp}`,
      `Correo: ${data.email}`,
      `Servicio de interés: ${data.service}`,
      `Acepta promociones: ${body.promos === true ? "Sí" : "No"}`,
      "",
      data.message,
      "",
      `Enviado desde ${company.url}`,
    ].join("\n"),
    replyTo: data.email,
  });

  if (result === "no-key") return NextResponse.json({ ok: false, fallback: "whatsapp" });
  if (result === "error") {
    return NextResponse.json(
      { ok: false, fallback: "whatsapp", error: "No pudimos enviar el correo. Tu mensaje sigue aquí: envíalo por WhatsApp." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
