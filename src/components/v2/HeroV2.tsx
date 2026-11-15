"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { preload } from "react-dom";
import { formatMXN, hero, plans, pricing } from "@/config/site";
import { Btn } from "./Btn";
import { SpecCard } from "./SpecCard";

const fromPrice = formatMXN(Math.min(...plans.map((p) => p.price)));

/* Entrada con CSS (no espera al JavaScript): el titular cuenta como pintado desde el primer frame. */
const reveal = (d: number) => ({ className: "fade-up", style: { ["--d" as string]: `${Math.round(d * 1000)}ms` } });

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
          {/* AVIF pesa menos de la mitad; WebP queda de respaldo. */}
          <source media="(min-width: 768px)" type="image/avif" srcSet="/images/hero-bg.avif" />
          <source media="(min-width: 768px)" srcSet="/images/hero-bg.webp" />
          <source type="image/avif" srcSet="/images/hero-bg-mobile.avif" />
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
  // La foto es el LCP: se pide desde el <head>, antes que el CSS y el JavaScript.
  preload("/images/hero-bg-mobile.avif", { as: "image", type: "image/avif", fetchPriority: "high", media: "(max-width: 767px)" });
  preload("/images/hero-bg.avif", { as: "image", type: "image/avif", fetchPriority: "high", media: "(min-width: 768px)" });
  return (
    <section aria-labelledby="hero-title" className="tone-dark relative isolate flex min-h-[100svh] items-end overflow-hidden">
      <Backdrop />
      <div className="container-x grid w-full gap-10 pt-32 pb-12 md:pb-16 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-8">
          <div {...reveal(0.1)}>
            <Headline />
          </div>
          <p style={reveal(0.25).style} className="fade-up t-lead mt-6 max-w-[46ch] text-[#ADB5BD]">
            {hero.subtitle}
          </p>
          <div style={reveal(0.35).style} className="fade-up mt-8 flex flex-col gap-3 sm:flex-row">
            <Btn href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
            </Btn>
            <Btn href={hero.secondaryCta.href} size="lg" variant="secondary">
              {hero.secondaryCta.label}
            </Btn>
          </div>
        </div>
        <div style={reveal(0.5).style} className="fade-up lg:col-span-4">
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
        </div>
      </div>
    </section>
  );
}
