import { Plus } from "lucide-react";
import { faq } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Acordeón con <details>: funciona sin JavaScript y con teclado. */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-titulo" className="section">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading
          id="faq-titulo"
          eyebrow="Preguntas frecuentes"
          title="Lo que casi todos preguntan antes de empezar"
          description="¿Te queda otra duda? El asistente de la esquina te responde ahora mismo."
        />
        <Reveal>
          <ul className="border-t border-line">
            {faq.map((item) => (
              <li key={item.q} className="border-b border-line">
                <details className="group">
                  <summary className="flex min-h-16 list-none items-center justify-between gap-6 py-5 text-lg font-medium [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line-strong transition-colors duration-200 group-open:border-flame group-open:bg-flame group-open:text-ink">
                      <Plus className="h-4 w-4 transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
                    </span>
                  </summary>
                  <p className="max-w-[65ch] pr-12 pb-6 text-mute">{item.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
