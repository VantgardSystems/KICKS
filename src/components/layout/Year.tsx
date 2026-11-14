"use client";

/** Año actual: se calcula en el navegador para que nunca quede viejo. */
export function Year() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
