"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const labOptions = {
  type: {
    label: "Tipografía",
    choices: [
      { id: "A", label: "A · Inter Tight + Inter", short: "Tipo A (Inter Tight)" },
      { id: "B", label: "B · Satoshi", short: "Tipo B (Satoshi)" },
      { id: "C", label: "C · Clash + General Sans", short: "Tipo C (Clash Display)" },
      { id: "D", label: "D · Instrument + serif", short: "Tipo D (Instrument)" },
      { id: "E", label: "E · Geist 800", short: "Tipo E (Geist)" },
    ],
  },
  hero: {
    label: "Hero",
    choices: [
      { id: "H1", label: "H1 · Cinemático", short: "Hero H1 Cinemático" },
      { id: "H2", label: "H2 · Ficha", short: "Hero H2 Ficha" },
      { id: "H3", label: "H3 · Actual mejorado", short: "Hero H3 Mockups" },
    ],
  },
  cards: {
    label: "Tarjetas",
    choices: [
      { id: "glass", label: "Vidrio", short: "Tarjetas vidrio" },
      { id: "solid", label: "Grafito sólido", short: "Tarjetas grafito" },
      { id: "swatch", label: "Muestras de color", short: "Tarjetas muestra" },
    ],
  },
  btn: {
    label: "Botones",
    choices: [
      { id: "pill", label: "Píldora", short: "Botón píldora" },
      { id: "arrow", label: "Píldora + flecha", short: "Botón flecha" },
      { id: "rect", label: "Rectangular 12px", short: "Botón rectangular" },
    ],
  },
  bg: {
    label: "Fondo del hero",
    choices: [
      { id: "grain", label: "Negro con grano", short: "Fondo grano" },
      { id: "graphite", label: "Grafito degradado", short: "Fondo grafito" },
      { id: "chrome", label: "WebGL liquid chrome", short: "Fondo liquid chrome" },
    ],
  },
  rhythm: {
    label: "Ritmo",
    choices: [
      { id: "dark", label: "Oscuro + 1 clara", short: "Ritmo oscuro" },
      { id: "alt", label: "Alternado", short: "Ritmo alternado" },
    ],
  },
  orange: {
    label: "Naranja",
    choices: [
      { id: "min", label: "Mínimo (CTAs)", short: "Naranja mínimo" },
      { id: "mid", label: "Medio (números y palabra)", short: "Naranja medio" },
    ],
  },
} as const;

export type LabKey = keyof typeof labOptions;
export type LabState = { [K in LabKey]: (typeof labOptions)[K]["choices"][number]["id"] };

export const labDefaults: LabState = {
  type: "A",
  hero: "H1",
  cards: "glass",
  btn: "arrow",
  bg: "grain",
  rhythm: "dark",
  orange: "min",
};

const STORE = "vg-lab";

interface Ctx {
  state: LabState;
  set: <K extends LabKey>(key: K, value: LabState[K]) => void;
  reset: () => void;
  summary: string;
}

const LabCtx = createContext<Ctx | null>(null);

/** Fuera de /lab devuelve los valores por defecto, para que los componentes funcionen igual. */
export function useLab(): Ctx {
  return (
    useContext(LabCtx) ?? {
      state: labDefaults,
      set: () => {},
      reset: () => {},
      summary: "",
    }
  );
}

export function LabProvider({ children }: { children: (state: LabState) => ReactNode }) {
  const [state, setState] = useState<LabState>(labDefaults);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORE);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<LabState>;
        const next = { ...labDefaults };
        for (const key of Object.keys(labOptions) as LabKey[]) {
          const value = saved[key];
          if (labOptions[key].choices.some((c) => c.id === value)) (next as Record<string, string>)[key] = value as string;
        }
        setState(next);
      }
    } catch {
      /* sin almacenamiento: usamos los valores por defecto */
    }
  }, []);

  const set = useCallback(<K extends LabKey>(key: K, value: LabState[K]) => {
    setState((prev) => {
      const next = { ...prev, [key]: value };
      try {
        window.localStorage.setItem(STORE, JSON.stringify(next));
      } catch {
        /* sin almacenamiento */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setState(labDefaults);
    try {
      window.localStorage.removeItem(STORE);
    } catch {
      /* nada que borrar */
    }
  }, []);

  const summary = useMemo(
    () =>
      (Object.keys(labOptions) as LabKey[])
        .map((key) => labOptions[key].choices.find((c) => c.id === state[key])?.short ?? "")
        .join(" · "),
    [state],
  );

  return <LabCtx.Provider value={{ state, set, reset, summary }}>{children(state)}</LabCtx.Provider>;
}
