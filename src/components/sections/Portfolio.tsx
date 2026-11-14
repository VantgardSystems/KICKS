"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { portfolioFilters, projects, upcomingProjects } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";

type Filter = (typeof portfolioFilters)[number];

const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};

export function Portfolio() {
  const [filter, setFilter] = useState<Filter>("Todos");
  const shown = projects.filter((p) => filter === "Todos" || p.category === filter);
  const upcoming = upcomingProjects.filter((p) => filter === "Todos" || p.category === filter);
  const empty = shown.length === 0 && upcoming.length === 0;

  return (
    <section id="portafolio" aria-labelledby="portafolio-titulo" className="section bg-coal">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="portafolio-titulo"
            eyebrow="Portafolio"
            title="Proyectos que ya están trabajando"
            description="Cada sitio se diseñó desde cero para su marca. Entra a cualquiera para ver el reto y cómo lo resolvimos."
          />
          <div role="group" aria-label="Filtrar proyectos" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0 lg:shrink-0">
            {portfolioFilters.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`min-h-11 shrink-0 rounded-full border px-5 text-sm transition-colors duration-200 ${
                  filter === f
                    ? "border-paper bg-paper font-medium text-ink"
                    : "border-line-strong text-mute hover:border-white/40 hover:text-paper"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p, i) => (
              <motion.li
                key={p.slug}
                layout
                {...item}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard>
                  <Link
                    href={`/portafolio/${p.slug}`}
                    className="group block overflow-hidden rounded-[20px] border border-line bg-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] transition-colors duration-300 hover:border-white/25"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
                      <Image
                        src={p.desktop}
                        alt={`Captura del sitio de ${p.name}`}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl">{p.name}</h3>
                          <p className="mt-1 text-sm text-mute">{p.industry}</p>
                        </div>
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line-strong transition-colors duration-300 group-hover:border-flame group-hover:bg-flame group-hover:text-ink">
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </div>
                      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Incluye">
                        {p.tags.map((tag) => (
                          <li key={tag} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-mute">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Link>
                </TiltCard>
              </motion.li>
            ))}

          </AnimatePresence>
        </ul>

        {upcoming.length > 0 && (
          <ul className="mt-5 grid gap-5 sm:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
            {upcoming.map((p) => (
                <motion.li
                  key={p.name}
                  layout
                  {...item}
                  transition={{ duration: 0.4 }}
                  className="flex min-h-[160px] flex-col justify-between rounded-[20px] border border-dashed border-line-strong p-6"
                >
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-flame/40 bg-flame/10 px-3 py-1 font-mono text-xs text-flame-hi">
                    <span className="h-1.5 w-1.5 rounded-full bg-flame" aria-hidden="true" />
                    En desarrollo
                  </span>
                  <div>
                    <h3 className="text-xl">{p.name}</h3>
                    <p className="mt-1 text-sm text-mute">{p.industry}</p>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}

        {empty && (
          <div className="rounded-[20px] border border-dashed border-line-strong px-6 py-16 text-center">
            <h3 className="text-2xl">Aún no publicamos proyectos de {filter.toLowerCase()}</h3>
            <p className="mx-auto mt-3 max-w-md text-mute">
              El tuyo puede ser el primero. Te hacemos una demo sin anticipo para que la veas funcionando.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/#cotizar">Cotiza tu página</Button>
              <Button variant="outline" onClick={() => setFilter("Todos")}>
                Ver todos los proyectos
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
