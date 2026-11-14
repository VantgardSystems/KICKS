"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Calculator, MessageCircle, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { assistant, whatsappUrl } from "@/config/site";

type Msg = { role: "user" | "assistant"; content: string };

const STORE = "vg-chat";
const WA_LINK = whatsappUrl("Hola, vengo del chat de la página y quiero hablar con una persona.");
const greeting: Msg = { role: "assistant", content: assistant.greeting };

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([greeting]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const used = messages.filter((m) => m.role === "user").length;
  const left = assistant.maxMessagesPerSession - used;
  const limitReached = left <= 0;

  // La conversación vive solo en esta pestaña (sessionStorage).
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORE);
      if (raw) {
        const saved = JSON.parse(raw) as Msg[];
        if (Array.isArray(saved) && saved.length) setMessages(saved);
      }
    } catch {
      /* sin historial */
    }
  }, []);

  useEffect(() => {
    if (busy) return;
    try {
      window.sessionStorage.setItem(STORE, JSON.stringify(messages));
    } catch {
      /* sin almacenamiento */
    }
  }, [messages, busy]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const send = async (text: string) => {
    const content = text.trim().slice(0, assistant.maxMessageLength);
    if (!content || busy) return;
    if (content === "Hablar por WhatsApp") {
      window.open(WA_LINK, "_blank", "noopener,noreferrer");
      return;
    }
    if (limitReached) return;

    const history = [...messages, { role: "user", content } as Msg];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    setError(null);

    const fail = (message: string) => {
      setMessages(history);
      setError(message);
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(1) }),
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        fail(data.error ?? "El asistente no pudo responder. Intenta de nuevo o sigue por WhatsApp.");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: reply }]);
      }
      if (!reply.trim()) fail("El asistente no pudo responder. Intenta de nuevo o sigue por WhatsApp.");
    } catch {
      fail("No hay conexión. Revisa tu internet e intenta de nuevo.");
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  const showQuick = used === 0 && !busy;
  const lastIsEmpty = busy && messages[messages.length - 1]?.content === "";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? "Cerrar asistente" : `Abrir ${assistant.name}`}
        aria-expanded={open}
        aria-controls="chat-panel"
        onClick={() => (open ? close() : setOpen(true))}
        className="fixed right-5 bottom-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-flame text-ink shadow-[0_0_0_1px_rgb(255_107_26/0.5),0_12px_40px_-8px_rgb(255_107_26/0.7)] transition-colors duration-200 hover:bg-flame-hi md:right-6 md:bottom-6"
      >
        {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Sparkles className="h-6 w-6" aria-hidden="true" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="chat-panel"
            ref={panelRef}
            role="dialog"
            aria-label={assistant.name}
            data-lenis-prevent
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.15, ease: "easeIn" } }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-x-3 top-3 bottom-[88px] z-50 flex flex-col overflow-hidden rounded-[24px] border border-line-strong bg-raised shadow-[0_32px_80px_-16px_rgb(0_0_0/0.95)] sm:inset-x-auto sm:top-auto sm:right-6 sm:bottom-[96px] sm:h-[min(640px,calc(100dvh-128px))] sm:w-[400px]"
          >
            <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-flame/15">
                  <Sparkles className="h-4 w-4 text-flame" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-base font-semibold tracking-normal">{assistant.name}</h2>
                  <p className="flex items-center gap-1.5 font-mono text-xs text-mute">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                    En línea 24/7
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar asistente"
                className="grid h-11 w-11 place-items-center rounded-full text-mute hover:bg-white/5 hover:text-paper"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>

            <p className="border-b border-line bg-flame/[0.07] px-5 py-2.5 text-xs text-paper/90">
              {assistant.disclosure}
            </p>

            <div ref={logRef} role="log" aria-live="polite" aria-label="Conversación" className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-5 py-4">
              {messages.map((m, i) =>
                m.content ? (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <p
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.9375rem] leading-relaxed whitespace-pre-wrap ${
                        m.role === "user"
                          ? "rounded-br-md bg-flame text-ink"
                          : "rounded-bl-md border border-line bg-ink text-paper"
                      }`}
                    >
                      <span className="sr-only">{m.role === "user" ? "Tú: " : "Asistente: "}</span>
                      {m.content}
                    </p>
                  </div>
                ) : null,
              )}

              {lastIsEmpty && (
                <div className="flex justify-start" aria-label="El asistente está escribiendo">
                  <p className="flex gap-1.5 rounded-2xl rounded-bl-md border border-line bg-ink px-4 py-3.5">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-mute"
                        style={{ animation: `blink 1.2s ${d * 0.18}s infinite` }}
                      />
                    ))}
                  </p>
                </div>
              )}

              {showQuick && (
                <ul className="flex flex-wrap gap-2 pt-2" aria-label="Preguntas rápidas">
                  {assistant.quickReplies.map((q) => (
                    <li key={q}>
                      <button
                        type="button"
                        onClick={() => void send(q)}
                        className="min-h-10 rounded-full border border-line-strong px-4 text-left text-sm text-paper transition-colors hover:border-flame hover:text-flame-hi"
                      >
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {error && (
                <p role="alert" className="rounded-xl border border-flame/40 bg-flame/10 px-4 py-3 text-sm">
                  {error}
                </p>
              )}

              {limitReached && !busy && (
                <p className="rounded-xl border border-line bg-ink px-4 py-3 text-sm text-mute">
                  Llegamos al límite de mensajes de esta conversación. Sigue con una persona del equipo por WhatsApp o
                  abre el cotizador.
                </p>
              )}
            </div>

            <div className="border-t border-line p-3">
              <div className="mb-3 grid grid-cols-2 gap-2">
                <Link
                  href="/cotizar"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-line-strong text-sm hover:border-white/40"
                >
                  <Calculator className="h-4 w-4 text-flame" aria-hidden="true" />
                  Abrir cotizador
                </Link>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-line-strong text-sm hover:border-white/40"
                >
                  <MessageCircle className="h-4 w-4 text-flame" aria-hidden="true" />
                  Hablar por WhatsApp
                </a>
              </div>
              <form onSubmit={onSubmit} className="flex items-end gap-2">
                <label htmlFor="chat-input" className="sr-only">
                  Escribe tu mensaje
                </label>
                <textarea
                  id="chat-input"
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={assistant.maxMessageLength}
                  readOnly={limitReached}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={limitReached ? "Límite de mensajes alcanzado" : "Escribe tu mensaje"}
                  className="field max-h-28 min-h-12 flex-1 resize-none rounded-2xl py-3"
                />
                <button
                  type="submit"
                  aria-label="Enviar mensaje"
                  aria-disabled={busy || limitReached || !input.trim()}
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-full bg-flame text-ink transition-opacity hover:bg-flame-hi ${
                    busy || limitReached || !input.trim() ? "opacity-50" : ""
                  }`}
                >
                  <ArrowUp className="h-5 w-5" aria-hidden="true" />
                </button>
              </form>
              <p className="mt-2 px-1 text-[0.75rem] leading-snug text-mute">
                Usamos tus mensajes solo para responderte; los procesa Google Gemini.{" "}
                <Link href="/aviso-de-privacidad" className="text-paper underline underline-offset-2">
                  Aviso de privacidad
                </Link>
                {!limitReached && left <= 5 && <span className="font-mono"> · {left} mensajes restantes</span>}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
