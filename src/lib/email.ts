import { company } from "@/config/site";
import { escapeHtml } from "./validation";

interface Mail {
  to: string | string[];
  subject: string;
  /** Texto plano; se convierte a HTML sencillo. */
  text: string;
  replyTo?: string;
}

export type MailResult = "sent" | "no-key" | "error";

/** Envía con la API de Resend. Sin RESEND_API_KEY devuelve "no-key". */
export async function sendEmail({ to, subject, text, replyTo }: Mail): Promise<MailResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return "no-key";

  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">
<p style="font-weight:700;letter-spacing:.04em">VANTGARD <span style="color:#FF6B1A">SYSTEMS</span></p>
<pre style="font-family:inherit;white-space:pre-wrap;margin:0">${escapeHtml(text)}</pre>
</div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? `${company.name} <onboarding@resend.dev>`,
        to: Array.isArray(to) ? to : [to],
        subject,
        text,
        html,
        reply_to: replyTo,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok ? "sent" : "error";
  } catch {
    return "error";
  }
}

export const inbox = () => process.env.CONTACT_TO ?? company.email;
