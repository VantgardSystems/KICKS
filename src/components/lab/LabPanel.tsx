"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { labOptions, useLab, type LabKey, type LabState } from "./LabContext";

/** Panel flotante para cambiar el diseño en vivo. En celular se abre como hoja inferior. */
export function LabPanel() {
  const { state, set, reset, summary } = useLab();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
    } catch {
      const area = document.createElement("textarea");
      area.value = summary;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="lab-panel" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="lab-panel"
        className="fixed bottom-5 left-5 z-[90] inline-flex min-h-12 items-center gap-2 rounded-full border border-white/15 bg-[#212529] px-5 text-[15px] text-[#E9ECEF] shadow-[0_12px_40px_-12px_rgb(0_0_0/0.9)] md:bottom-6 md:left-6"
      >
        {open ? <X className="h-4 w-4" aria-hidden="true" /> : <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />}
        Diseño
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="lab-panel"
            role="dialog"
            aria-label="Opciones de diseño"
            data-lenis-prevent
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-2 bottom-[76px] z-[90] max-h-[72dvh] overflow-y-auto overscroll-contain rounded-[24px] border border-white/12 bg-[#16181B]/97 p-4 text-[#E9ECEF] shadow-[0_32px_80px_-16px_rgb(0_0_0/0.95)] backdrop-blur-xl sm:inset-x-auto sm:left-6 sm:bottom-[88px] sm:w-[380px] sm:p-5"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[15px] font-semibold">Laboratorio de diseño</p>
                <p className="mt-0.5 text-[13px] text-[#ADB5BD]">Los cambios se ven al instante y se guardan.</p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-[13px] text-[#ADB5BD] hover:bg-white/5 hover:text-[#E9ECEF]"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Restablecer
              </button>
            </div>

            <div className="space-y-4">
              {(Object.keys(labOptions) as LabKey[]).map((key) => (
                <fieldset key={key}>
                  <legend className="mb-2 text-[12px] tracking-[0.08em] text-[#ADB5BD] uppercase">
                    {labOptions[key].label}
                  </legend>
                  <div className="flex flex-wrap gap-1.5">
                    {labOptions[key].choices.map((choice) => {
                      const active = state[key] === choice.id;
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => set(key, choice.id as LabState[typeof key])}
                          className={`min-h-10 rounded-full border px-3.5 text-[13px] transition-colors ${
                            active
                              ? "border-[#FB5607] bg-[#FB5607] text-[#0B0C0E]"
                              : "border-white/15 text-[#E9ECEF] hover:border-white/40"
                          }`}
                        >
                          {choice.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-3">
              <p className="text-[12px] tracking-[0.08em] text-[#ADB5BD] uppercase">Tu selección</p>
              <p className="mt-1.5 text-[13px] leading-relaxed">{summary}</p>
            </div>
            <button
              type="button"
              onClick={copy}
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#FB5607] text-[15px] text-[#0B0C0E] hover:bg-[#FF6A1F]"
            >
              {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              {copied ? "Selección copiada" : "Copiar mi selección"}
            </button>
            <p className="sr-only" aria-live="polite">
              {copied ? "Selección copiada al portapapeles" : ""}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
