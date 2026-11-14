"use client";

import Image from "next/image";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { processSteps } from "@/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Step = (typeof processSteps)[number];

function StepBlock({ step, index, onActive }: { step: Step; index: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li ref={ref} className="flex flex-col justify-center border-t border-line py-10 first:border-t-0 lg:min-h-[58vh] lg:border-t-0 lg:py-0">
      <div className={`transition-opacity duration-300 ${inView ? "lg:opacity-100" : "lg:opacity-50"}`}>
        <p className="font-mono text-sm text-flame">Paso {index + 1} de {processSteps.length}</p>
        <h3 className="mt-3 text-3xl md:text-4xl">{step.title}</h3>
        <p className="mt-4 max-w-md text-lg text-mute">{step.description}</p>
        <p className="mt-6 inline-flex rounded-full border border-line-strong px-4 py-2 font-mono text-xs text-paper">
          {step.detail}
        </p>
        {/* En celular cada paso lleva su imagen */}
        <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[20px] border border-line lg:hidden">
          <Image src={step.image} alt={step.imageAlt} fill sizes="100vw" className="object-cover" />
        </div>
      </div>
    </li>
  );
}

export function Process() {
  const [active, setActive] = useState(0);

  return (
    <section id="proceso" aria-labelledby="proceso-titulo" className="section">
      <div className="container-x">
        <SectionHeading
          id="proceso-titulo"
          eyebrow="Proceso"
          title="Primero la ves funcionando. Después decides."
          description="Cuatro pasos, sin letras chiquitas. No pagas nada hasta que la demo te convenza."
        />

        <div className="mt-8 grid gap-x-16 lg:mt-0 lg:grid-cols-2">
          <ol>
            {processSteps.map((step, i) => (
              <StepBlock key={step.title} step={step} index={i} onActive={setActive} />
            ))}
          </ol>

          {/* Panel fijo: solo en escritorio */}
          <div className="hidden lg:block" aria-hidden="true">
            <div className="sticky top-[18vh] flex h-[64vh] flex-col justify-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] border border-line bg-coal shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]">
                {processSteps.map((step, i) => (
                  <Image
                    key={step.image}
                    src={step.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 50vw, 0px"
                    className={`object-cover transition-[opacity,transform] duration-700 ease-out ${
                      i === active ? "scale-100 opacity-100" : "scale-105 opacity-0"
                    }`}
                  />
                ))}
                <span className="absolute bottom-5 left-6 font-mono text-7xl font-medium tracking-tighter text-paper/90">
                  0{active + 1}
                </span>
              </div>
              <div className="mt-6 flex gap-2">
                {processSteps.map((step, i) => (
                  <span key={step.title} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
                    <span
                      className={`block h-full origin-left bg-flame transition-transform duration-500 ease-out ${
                        i <= active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
