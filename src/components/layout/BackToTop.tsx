"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Volver arriba"
      title="Volver arriba"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        document.getElementById("contenido")?.focus({ preventScroll: true });
      }}
      className={`fixed right-5 bottom-[88px] z-40 grid h-11 w-11 place-items-center rounded-full border border-line-strong bg-coal/90 text-paper backdrop-blur transition-all duration-300 hover:border-white/40 md:right-6 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
      tabIndex={show ? 0 : -1}
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
