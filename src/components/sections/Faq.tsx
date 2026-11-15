"use client";

import { faq } from "@/config/site";
import { Heading, Rise } from "@/components/v2/Sections";

/** Acordeón con <details>: funciona sin JavaScript y con teclado. */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-titulo" className="section">
      <div className="container-x">
        <Heading
          id="faq-titulo"
          label="Preguntas frecuentes"
          title="Lo que casi todos preguntan antes de empezar"
          kw="antes de empezar"
          text="¿Te queda otra duda? El asistente de la esquina te responde ahora mismo."
        />
        <Rise className="mt-14 md:mt-20">
          <ul className="border-t border-white/12">
            {faq.map((item, i) => (
              <li key={item.q} className="border-b border-white/12">
                <details className="group">
                  <summary className="grid min-h-20 cursor-pointer list-none grid-cols-[48px_1fr_44px] items-center gap-4 py-6 md:grid-cols-[80px_1fr_44px] [&::-webkit-details-marker]:hidden">
                    <span className="t-label num tabular text-[#6C757D]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="f-display text-[clamp(20px,2.2vw,30px)] leading-tight">{item.q}</span>
                    <span
                      aria-hidden="true"
                      className="relative grid h-11 w-11 place-items-center rounded-full border border-white/20 transition-colors duration-300 group-open:border-[#FB5607] group-open:bg-[#FB5607]"
                    >
                      <span className="absolute h-[1.5px] w-4 bg-current transition-colors group-open:bg-[#0B0C0E]" />
                      <span className="absolute h-4 w-[1.5px] bg-current transition-transform duration-300 group-open:scale-y-0" />
                    </span>
                  </summary>
                  <p className="max-w-[62ch] pb-8 pl-[64px] text-[#ADB5BD] md:pl-[96px]">{item.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </Rise>
      </div>
    </section>
  );
}
