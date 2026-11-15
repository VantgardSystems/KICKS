import { assistant } from "@/config/site";
import { buildSystemPrompt, demoReply } from "@/lib/chat-prompt";
import { clientIp, rateLimit, sameOrigin } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/validation";

export const runtime = "nodejs";
export const maxDuration = 30;

type Msg = { role: "user" | "assistant"; content: string };

const json = (body: object, status: number, headers?: HeadersInit) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });

/** Devuelve texto plano en streaming, por trozos pequeños. */
function streamText(text: string, mode: string) {
  const encoder = new TextEncoder();
  const words = text.split(/(\s+)/);
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const w of words) {
        controller.enqueue(encoder.encode(w));
        await new Promise((r) => setTimeout(r, 18));
      }
      controller.close();
    },
  });
  return new Response(stream, { headers: streamHeaders(mode) });
}

const streamHeaders = (mode: string) => ({
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Chat-Mode": mode,
});

async function callGemini(key: string, messages: Msg[], withThinkingOff: boolean) {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: buildSystemPrompt() }] },
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 450,
          ...(withThinkingOff ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
        },
      }),
      signal: AbortSignal.timeout(25_000),
    },
  );
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Origen no permitido." }, 403);

  const limit = rateLimit(`chat:${clientIp(request)}`, 30, 10 * 60_000);
  if (!limit.ok) {
    return json(
      { error: "Recibimos muchos mensajes seguidos. Espera un momento o escríbenos por WhatsApp." },
      429,
      { "Retry-After": String(limit.retryAfter) },
    );
  }

  let raw: unknown;
  try {
    raw = (await request.json())?.messages;
  } catch {
    return json({ error: "Mensaje ilegible." }, 400);
  }
  if (!Array.isArray(raw) || raw.length === 0) return json({ error: "Escribe un mensaje." }, 400);

  const messages: Msg[] = raw
    .filter((m): m is Msg => (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string")
    .map((m) => ({ role: m.role, content: sanitizeText(m.content, m.role === "user" ? assistant.maxMessageLength : 1500) }))
    .filter((m) => m.content);

  const userCount = messages.filter((m) => m.role === "user").length;
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user") return json({ error: "Escribe un mensaje." }, 400);
  if (userCount > assistant.maxMessagesPerSession) {
    return json({ error: "Llegamos al límite de mensajes de esta conversación. Sigamos por WhatsApp." }, 429);
  }

  // Gemini exige que la conversación empiece con el usuario.
  const firstUser = messages.findIndex((m) => m.role === "user");
  const history = messages.slice(firstUser).slice(-16);

  const key = process.env.GEMINI_API_KEY;
  if (!key) return streamText(demoReply(last.content), "demo");

  try {
    let upstream = await callGemini(key, history, true);
    if (upstream.status === 400) upstream = await callGemini(key, history, false);
    if (!upstream.ok || !upstream.body) return streamText(demoReply(last.content), "fallback");

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = "";
    let sent = false;

    const stream = new ReadableStream<Uint8Array>({
      async pull(controller) {
        try {
          const { done, value } = await reader.read();
          if (done) {
            if (!sent) controller.enqueue(encoder.encode(demoReply(last.content)));
            controller.close();
            return;
          }
          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split(/\r?\n\r?\n/);
          buffer = events.pop() ?? "";
          for (const event of events) {
            for (const line of event.split(/\r?\n/)) {
              if (!line.startsWith("data:")) continue;
              try {
                const data = JSON.parse(line.slice(5).trim());
                const parts = data?.candidates?.[0]?.content?.parts as { text?: string; thought?: boolean }[] | undefined;
                const text = parts?.filter((p) => !p.thought).map((p) => p.text ?? "").join("") ?? "";
                if (text) {
                  sent = true;
                  controller.enqueue(encoder.encode(text));
                }
              } catch {
                /* fragmento incompleto: se ignora */
              }
            }
          }
        } catch {
          if (!sent) controller.enqueue(encoder.encode(demoReply(last.content)));
          controller.close();
        }
      },
      cancel() {
        reader.cancel().catch(() => {});
      },
    });
    return new Response(stream, { headers: streamHeaders("gemini") });
  } catch {
    return streamText(demoReply(last.content), "fallback");
  }
}
