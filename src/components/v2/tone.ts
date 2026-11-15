"use client";

import { useLab } from "@/components/lab/LabContext";

type SectionName = "services" | "portfolio" | "process" | "story" | "pricing" | "quote" | "faq" | "contact";

const alternate: Record<SectionName, "dark" | "light"> = {
  services: "dark",
  portfolio: "light",
  process: "dark",
  story: "light",
  pricing: "dark",
  quote: "light",
  faq: "dark",
  contact: "light",
};

/** Clase de tono de cada sección según el ritmo elegido. */
export function useTone(section: SectionName) {
  const { state } = useLab();
  const tone = state.rhythm === "alt" ? alternate[section] : section === "story" ? "light" : "dark";
  return tone === "light" ? "tone-light" : "tone-dark";
}
