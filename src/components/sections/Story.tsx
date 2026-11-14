"use client";

import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { story } from "@/config/site";
import { Counter } from "@/components/ui/Counter";
import { WithPending } from "@/components/ui/Pending";
import { Reveal } from "@/components/ui/Reveal";

function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <ol ref={ref} className="relative">
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-neutral-300" />
      <motion.span
        aria-hidden="true"
        style={{ scaleY }}
        className="absolute top-2 bottom-2 left-[6px] w-[3px] origin-top rounded-full bg-flame"
      />
      {story.timeline.map((m, i) => (
        <Reveal as="li" key={m.title} delay={i * 0.05} className="relative pb-10 pl-10 last:pb-0">
          <span
            aria-hidden="true"
            className="absolute top-1.5 left-0 h-[15px] w-[15px] rounded-full border-[3px] border-paper bg-ink ring-1 ring-neutral-300"
          />
          <p className="font-mono text-xs text-neutral-600">
            <WithPending text={m.date} tone="light" />
          </p>
          <h4 className="mt-1 text-xl tracking-tight">{m.title}</h4>
          <p className="mt-1 text-neutral-600">
            <WithPending text={m.description} tone="light" />
          </p>
        </Reveal>
      ))}
    </ol>
  );
}

export function Story() {
  return (
    <section id="historia" aria-labelledby="historia-titulo" className="section bg-paper text-ink [color-scheme:light]">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.08em] text-[#B8470A]">Nuestra historia</p>
            <h2 id="historia-titulo" className="h-section mt-4">
              Nacimos para que ningún negocio pierda un cliente por no contestar
            </h2>
            <div className="mt-8 max-w-xl space-y-4 text-lg text-neutral-700">
              {story.origin.map((p) => (
                <p key={p}>
                  <WithPending text={p} tone="light" />
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative aspect-[16/11] overflow-hidden rounded-[24px] bg-ink lg:aspect-auto lg:min-h-[420px]">
            <Image
              src={story.image}
              alt={story.imageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </Reveal>
        </div>

        {/* Cifras */}
        <dl className="mt-16 grid grid-cols-1 border-y border-neutral-200 sm:grid-cols-3 lg:mt-24">
          {story.stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col-reverse gap-1 py-8 sm:px-8 sm:first:pl-0 ${
                i > 0 ? "border-t border-neutral-200 sm:border-t-0 sm:border-l" : ""
              }`}
            >
              <dt className="text-neutral-600">{s.label}</dt>
              <dd className="font-mono text-6xl font-medium tracking-tighter md:text-7xl">
                <Counter value={s.value} prefix={"prefix" in s ? s.prefix : ""} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-10">
            <Reveal>
              <h3 className="text-2xl">Misión</h3>
              <p className="mt-3 max-w-lg text-lg text-neutral-700">{story.mission}</p>
            </Reveal>
            <Reveal>
              <h3 className="text-2xl">Visión</h3>
              <p className="mt-3 max-w-lg text-lg text-neutral-700">{story.vision}</p>
            </Reveal>
            <Reveal>
              <h3 className="text-2xl">En lo que creemos</h3>
              <ul className="mt-5 divide-y divide-neutral-200 border-y border-neutral-200">
                {story.values.map((v) => (
                  <li key={v.title} className="grid gap-1 py-5 sm:grid-cols-[1fr_1.2fr] sm:gap-6">
                    <span className="font-medium">{v.title}</span>
                    <span className="text-neutral-600">{v.description}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div>
            <h3 className="mb-8 text-2xl">Cómo hemos crecido</h3>
            <Timeline />
          </div>
        </div>
      </div>
    </section>
  );
}
