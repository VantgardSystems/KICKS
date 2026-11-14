"use client";

import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";
import { CONSENT_EVENT, OPEN_CONSENT_EVENT, readConsent, saveConsent, type Consent } from "@/lib/consent";

const btn =
  "min-h-11 rounded-full px-4 text-sm font-medium transition-colors duration-200 sm:px-5";

/** Banner de cookies. La analítica solo se monta si el usuario acepta. */
export function CookieBanner() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    setConsent(stored);
    setAnalytics(stored?.analytics ?? false);
    // Espera a que pase el loader para no tapar la primera vista.
    const t = window.setTimeout(() => setOpen(!stored), 1600);

    const onConsent = (e: Event) => setConsent((e as CustomEvent<Consent>).detail);
    const onOpen = () => {
      setSettings(true);
      setOpen(true);
    };
    window.addEventListener(CONSENT_EVENT, onConsent);
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener(CONSENT_EVENT, onConsent);
      window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
    };
  }, []);

  const decide = (value: boolean) => {
    saveConsent(value);
    setAnalytics(value);
    setOpen(false);
    setSettings(false);
  };

  return (
    <>
      {consent?.analytics && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}

      {open && (
        <section
          role="region"
          aria-label="Aviso de cookies"
          className="fade-up fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-xl rounded-[20px] border border-line-strong bg-raised/95 p-4 shadow-[0_24px_64px_-16px_rgb(0_0_0/0.9)] backdrop-blur-xl md:inset-x-auto md:left-6 md:bottom-6 md:mx-0"
        >
          <h2 className="text-base font-semibold tracking-normal">Tú decides qué cookies usamos</h2>
          <p className="mt-2 text-sm text-mute">
            Usamos las necesarias para que el sitio funcione y, con tu permiso, medimos visitas de forma anónima.{" "}
            <Link href="/politica-de-cookies" className="text-paper underline underline-offset-4">
              Política de cookies
            </Link>
          </p>

          {settings && (
            <div className="mt-4 space-y-3 rounded-xl border border-line p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Necesarias</p>
                  <p className="text-sm text-mute">Guardan tu elección y el avance del cotizador.</p>
                </div>
                <span className="font-mono text-xs text-mute">Siempre activas</span>
              </div>
              <label className="flex cursor-pointer items-start justify-between gap-4 border-t border-line pt-3">
                <span>
                  <span className="block text-sm font-medium">Analítica</span>
                  <span className="block text-sm text-mute">Visitas y velocidad del sitio, sin identificarte.</span>
                </span>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 accent-[#FF6B1A]"
                />
              </label>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {settings ? (
              <button type="button" onClick={() => decide(analytics)} className={`${btn} bg-flame text-ink hover:bg-flame-hi`}>
                Guardar mi elección
              </button>
            ) : (
              <>
                <button type="button" onClick={() => decide(true)} className={`${btn} bg-flame text-ink hover:bg-flame-hi`}>
                  Aceptar
                </button>
                <button
                  type="button"
                  onClick={() => decide(false)}
                  className={`${btn} border border-line-strong text-paper hover:border-white/40`}
                >
                  Rechazar
                </button>
                <button type="button" onClick={() => setSettings(true)} className={`${btn} text-mute hover:text-paper`}>
                  Configurar
                </button>
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
}
