"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { formatMXN, hero, plans, pricing } from "@/config/site";
import { Btn } from "./Btn";
import { SpecCard } from "./SpecCard";

const fromPrice = formatMXN(Math.min(...plans.map((p) => p.price)));

const reveal = (d: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay: d, ease: [0.16, 1, 0.3, 1] as const },
});

/** Titular con la última palabra como palabra clave (naranja). */
function Headline() {
  const words = hero.title.split(" ");
  const last = words.pop();
  return (
    <h1 id="hero-title" className="t-display max-w-[11ch]">
      {words.join(" ")} <span className="kw">{last}</span>
    </h1>
  );
}

/** Foto a sangre en B&N con parallax sutil, grano y degradados para que el texto se lea. */
function Backdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "12%"]);

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-[#0B0C0E]">
      <motion.div style={{ y }} className="film absolute inset-[-6%_0]">
        <picture>
          <source media="(min-width: 768px)" srcSet="/images/hero-bg.webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero-bg-mobile.webp" alt="" fetchPriority="high" className="h-full w-full object-cover" />
        </picture>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C0E]/85 via-[#0B0C0E]/30 to-transparent" />
      {/* En celular el texto ocupa todo el ancho: oscurecemos un poco más la foto para que se lea. */}
      <div className="absolute inset-0 bg-[#0B0C0E]/45 md:hidden" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0B0C0E] to-transparent" />
    </div>
  );
}

/** Portada cinemática: foto a sangre, titular enorme abajo a la izquierda y ficha de vidrio a la derecha. */
export function HeroV2() {
  return (
    <section aria-labelledby="hero-title" className="tone-dark relative isolate flex min-h-[100svh] items-end overflow-hidden">
      <Backdrop />
      <div className="container-x grid w-full gap-10 pt-32 pb-12 md:pb-16 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-8">
          <motion.div {...reveal(0.1)}>
            <Headline />
          </motion.div>
          <motion.p {...reveal(0.25)} className="t-lead mt-6 max-w-[46ch] text-[#ADB5BD]">
            {hero.subtitle}
          </motion.p>
          <motion.div {...reveal(0.35)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Btn href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
            </Btn>
            <Btn href={hero.secondaryCta.href} size="lg" variant="secondary">
              {hero.secondaryCta.label}
            </Btn>
          </motion.div>
        </div>
        <motion.div {...reveal(0.5)} className="lg:col-span-4">
          <SpecCard
            interactive={false}
            title="Demo sin anticipo"
            titleAs="h2"
            rows={[
              { label: "Entrega", value: "10–15 días" },
              { label: "Diseño", value: "100% a tu marca" },
              { label: "Desde", value: <span className="num">{`${fromPrice} ${pricing.currency}`}</span> },
            ]}
            pill={{ label: "Cotizar", href: "/#cotizar" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
