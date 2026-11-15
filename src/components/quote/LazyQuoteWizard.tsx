"use client";

import dynamic from "next/dynamic";

/** Esqueleto del mismo tamaño que el cotizador: la página no brinca cuando carga. */
function QuoteSkeleton() {
  return (
    <div role="status" aria-label="Cargando el cotizador" className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="glass min-h-[640px] rounded-[28px] p-5 md:p-8">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton mt-4 h-1 w-full" />
        <div className="skeleton mt-10 h-8 w-2/3" />
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton h-[88px] rounded-[16px]" />
          ))}
        </div>
      </div>
      <div className="glass hidden min-h-[320px] rounded-[28px] p-6 lg:block">
        <div className="skeleton h-5 w-32" />
        <div className="skeleton mt-6 h-4 w-full" />
        <div className="skeleton mt-3 h-4 w-4/5" />
        <div className="skeleton mt-10 h-9 w-3/4" />
      </div>
    </div>
  );
}

// El cotizador vive muy abajo en la portada: se carga aparte para no frenar la primera pintura.
export const LazyQuoteWizard = dynamic(() => import("./QuoteWizard").then((m) => m.QuoteWizard), {
  ssr: false,
  loading: QuoteSkeleton,
});
