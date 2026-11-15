/** Ritmo del sitio: todo oscuro, con Nuestra historia como única sección clara. */
type SectionName = "services" | "portfolio" | "process" | "story" | "pricing" | "quote" | "faq" | "contact";

export function useTone(section: SectionName) {
  return section === "story" ? "tone-light" : "tone-dark";
}
