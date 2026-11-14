"use client";

import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

/** Scroll suave (Lenis) + configuración global de animaciones. */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    // En táctil el scroll nativo ya es fluido: no lo interceptamos.
    if (reduce || !fine) return;

    const lenis = new Lenis({ duration: 1.05, anchors: { offset: -80 }, autoRaf: true });
    return () => lenis.destroy();
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
