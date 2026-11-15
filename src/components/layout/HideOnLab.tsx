"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Oculta la navegación y el footer actuales dentro de /lab (allí se prueban los nuevos). */
export function HideOnLab({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/lab")) return null;
  return <>{children}</>;
}
