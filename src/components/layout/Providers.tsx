"use client";

import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

/** Scroll suave (Lenis) + enlaces a secciones + configuración global de animaciones. */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    // En táctil el scroll nativo ya es fluido: no lo interceptamos.
    const lenis = !reduce && fine ? new Lenis({ duration: 1.05, autoRaf: true }) : null;

    const goTo = (el: HTMLElement) => {
      if (lenis) lenis.scrollTo(el);
      else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };

    // Enlaces tipo /#seccion dentro de la misma página: los movemos nosotros
    // para que el scroll suave y el salto del navegador no se estorben.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || !link.hash) return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      window.history.pushState(null, "", url.hash);
      goTo(target);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      lenis?.destroy();
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
