import { NextResponse } from "next/server";
import { company } from "@/config/site";
import { inbox, sendEmail } from "@/lib/email";
import { calcQuote, quoteSummaryText, rangeText, sanitizeChoices } from "@/lib/pricing";
import { clientIp, rateLimit, sameOrigin } from "@/lib/rate-limit";
import { sanitizeText, validate } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });

  const limit = rateLimit(`quote:${clientIp(request)}`, 5, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Recibimos varias solicitudes seguidas. Espera unos minutos o escríbenos por WhatsApp." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot: los bots llenan el campo oculto. Respondemos OK sin hacer nada.
  if (sanitizeText(body.website)) return NextResponse.json({ ok: true });

  const errors = validate(["name", "business", "industry", "whatsapp", "email", "privacy"], body);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const contact = {
    name: sanitizeText(body.name, 80),
    business: sanitizeText(body.business, 120),
    industry: sanitizeText(body.industry, 120),
    whatsapp: sanitizeText(body.whatsapp, 20),
    email: sanitizeText(body.email, 254),
  };
  // El total se recalcula aquí: nunca confiamos en números del navegador.
  const choices = sanitizeChoices(body.choices as never);
  const quote = calcQuote(choices);
  const summary = quoteSummaryText(choices, contact).split("\n").slice(2).join("\n");
  const promos = body.promos === true ? "Sí" : "No";

  const [toTeam, toClient] = await Promise.all([
    sendEmail({
      to: inbox(),
      subject: `Nueva cotización: ${contact.business} (${rangeText(quote)})`,
      text: `${summary}\n\nAcepta promociones: ${promos}`,
      replyTo: contact.email,
    }),
    sendEmail({
      to: contact.email,
      subject: `Tu cotización de ${company.name}`,
      text: `Hola, ${contact.name}:\n\nGracias por cotizar con nosotros. Este es tu estimado.\n\n${summary}\n\nTe contactamos por WhatsApp para agendar tu diagnóstico gratis.\n\n${company.name}\n${company.url}`,
      replyTo: inbox(),
    }),
  ]);

  if (toTeam === "no-key") return NextResponse.json({ ok: false, fallback: "whatsapp" });
  if (toTeam === "error") {
    return NextResponse.json(
      { ok: false, fallback: "whatsapp", error: "No pudimos enviar el correo. Tu cotización sigue aquí: envíala por WhatsApp." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true, clientCopy: toClient === "sent" });
}
