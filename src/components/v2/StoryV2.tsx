"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { story } from "@/config/site";
import { Counter } from "@/components/ui/Counter";
import { WithPending } from "@/components/ui/Pending";
import { Heading, Rise } from "./Sections";
import { SpecCard } from "./SpecCard";

function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  return (
    <ol ref={ref} className="relative">
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-[#ADB5BD]" />
      <motion.span aria-hidden="true" style={{ scaleY }} className="absolute top-2 bottom-2 left-[6px] w-[3px] origin-top rounded-full bg-[#D94A04]" />
      {story.timeline.map((m, i) => (
        <Rise as="li" key={m.title} delay={i * 0.03} className="relative pb-10 pl-10 last:pb-0">
          <span aria-hidden="true" className="absolute top-1.5 left-0 h-[15px] w-[15px] rounded-full border-[3px] border-[#E9ECEF] bg-[#0B0C0E] ring-1 ring-[#ADB5BD]" />
          <p className="t-label text-[#495057]">
            <WithPending text={m.date} tone="light" />
          </p>
          <h4 className="mt-1 text-[22px] leading-tight">{m.title}</h4>
          <p className="mt-1 text-[#495057]">
            <WithPending text={m.description} tone="light" />
          </p>
        </Rise>
      ))}
    </ol>
  );
}

/** Nuestra historia: la única sección clara. Entra con una transición suave desde el negro. */
export function StoryV2() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 35%"] });
  const shade = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: imgP } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const imgY = useTransform(imgP, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"]);

  return (
    <section ref={ref} id="historia" aria-labelledby="historia-titulo" className="tone-light section relative isolate overflow-hidden">
      {/* Velo negro que se desvanece al entrar: paso suave de oscuro a claro. */}
      {/* Siempre en el HTML (igual en servidor y navegador); con movimiento reducido lo oculta el CSS. */}
      <motion.div aria-hidden="true" style={{ opacity: shade }} className="pointer-events-none absolute inset-0 -z-10 bg-[#0B0C0E] motion-reduce:hidden" />
      <div className="container-x">
        <Heading id="historia-titulo" label="Nuestra historia" title="Nacimos para que ningún negocio pierda un cliente por no contestar" kw="no contestar" />

        <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-12 lg:gap-8">
          <Rise className="space-y-5 text-[#343A40] lg:col-span-5">
            {story.origin.map((p) => (
              <p key={p} className="t-lead">
                <WithPending text={p} tone="light" />
              </p>
            ))}
          </Rise>
          <Rise delay={0.1} className="lg:col-span-7">
            <div ref={imgRef} className="film relative aspect-[16/10] overflow-hidden rounded-[28px] bg-[#0B0C0E]">
              <motion.div style={{ y: imgY }} className="absolute inset-[-7%_0]">
                <Image src={story.image} alt={story.imageAlt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
              </motion.div>
            </div>
          </Rise>
        </div>

        {/* Cifras: protagonista visual */}
        <dl className="mt-16 grid grid-cols-1 border-y border-[#0B0C0E]/12 sm:grid-cols-3 lg:mt-24">
          {story.stats.map((s, i) => (
            <div key={s.label} className={`flex flex-col-reverse gap-2 py-8 sm:px-8 sm:first:pl-0 ${i > 0 ? "border-t border-[#0B0C0E]/12 sm:border-t-0 sm:border-l" : ""}`}>
              <dt className="t-label text-[#495057]">{s.label}</dt>
              <dd className="f-display num text-[clamp(72px,9vw,128px)] leading-[0.9] tracking-[-0.05em]">
                <Counter value={s.value} prefix={"prefix" in s ? s.prefix : ""} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-4 lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <Rise>
                <SpecCard as="div" variant="whiteout" interactive={false} size="md" title="Misión" summary={story.mission} className="h-full" />
              </Rise>
              <Rise delay={0.06}>
                <SpecCard as="div" variant="whiteout" interactive={false} size="md" title="Visión" summary={story.vision} className="h-full" />
              </Rise>
            </div>
          </div>
          <div className="lg:col-span-5">
            <h3 className="t-label mb-8 text-[#495057]">Cómo hemos crecido</h3>
            <Timeline />
          </div>
        </div>

        <h3 className="t-label mt-16 mb-6 text-[#495057] lg:mt-24">En lo que creemos</h3>
        <ul className="grid gap-4 md:grid-cols-3">
              {story.values.map((v, i) => (
                <Rise as="li" key={v.title} delay={0.06 * i}>
                  <SpecCard as="div" variant={i === 0 ? "blackstone" : "whiteout"} interactive={false} size="md" titleAs="h4" title={v.title} summary={v.description} className="h-full min-h-[200px] [&_.t-card]:text-[28px]" />
                </Rise>
              ))}
            </ul>
      </div>
    </section>
  );
}
