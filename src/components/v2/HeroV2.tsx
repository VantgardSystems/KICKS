"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { formatMXN, hero, plans, pricing, projects } from "@/config/site";
import { useLab } from "@/components/lab/LabContext";
import { LaptopMockup, PhoneMockup } from "@/components/ui/DeviceMockups";
import { Btn } from "./Btn";
import { SpecCard } from "./SpecCard";

const LiquidChrome = dynamic(() => import("./LiquidChrome").then((m) => m.LiquidChrome), { ssr: false });

// Hasta que lleguen las fotos con IA se usan las actuales en B&N.
const PHOTO = { src: "/images/hero-bg.webp", mobile: "/images/hero-bg-mobile.webp", temp: true };
const fromPrice = formatMXN(Math.min(...plans.map((p) => p.price)));

/** Titular con una palabra clave marcable (naranja o serif itálica, según el tema). */
function Headline({ className }: { className: string }) {
  const words = hero.title.split(" ");
  const last = words.pop();
  return (
    <h1 className={className}>
      {words.join(" ")} <span className="kw">{last}</span>
    </h1>
  );
}

function Backdrop({ align = "left" }: { align?: "left" | "center" }) {
  const { state } = useLab();
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "12%"]);

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      {state.bg === "chrome" ? (
        <div className="absolute inset-0 bg-[#0B0C0E]">
          <LiquidChrome />
        </div>
      ) : (
        <motion.div style={{ y }} className={`film absolute inset-[-6%_0] ${state.bg === "graphite" ? "opacity-55 mix-blend-luminosity" : ""}`}>
          <picture>
            <source media="(min-width: 768px)" srcSet={PHOTO.src} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PHOTO.mobile} alt="" fetchPriority="high" className={`h-full w-full object-cover ${PHOTO.temp ? "photo-temp" : ""}`} />
          </picture>
        </motion.div>
      )}
      {state.bg === "graphite" && (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_70%_20%,#343A40_0%,#212529_35%,#0B0C0E_75%)]" />
      )}
      <div
        className={`absolute inset-0 ${
          align === "center"
            ? "bg-[radial-gradient(70%_60%_at_50%_55%,transparent,rgb(11_12_14/0.55))]"
            : "bg-gradient-to-r from-[#0B0C0E]/85 via-[#0B0C0E]/30 to-transparent"
        }`}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0B0C0E] to-transparent" />
    </div>
  );
}

function HeroCta({ center }: { center?: boolean }) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${center ? "sm:justify-center" : ""}`}>
      <Btn href={hero.primaryCta.href} size="lg">
        {hero.primaryCta.label}
      </Btn>
      <Btn href={hero.secondaryCta.href} size="lg" variant="secondary">
        {hero.secondaryCta.label}
      </Btn>
    </div>
  );
}

const reveal = (d: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay: d, ease: [0.16, 1, 0.3, 1] as const },
});

/* H1 · Cinemático: foto a sangre, titular abajo a la izquierda, ficha de vidrio a la derecha. */
function HeroCinematic() {
  return (
    <section aria-labelledby="hero-title" className="tone-dark relative isolate flex min-h-[100svh] items-end overflow-hidden">
      <Backdrop />
      <div className="container-x grid w-full gap-10 pt-32 pb-12 md:pb-16 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-8">
          <motion.div {...reveal(0.1)}>
            <Headline className="t-display max-w-[11ch]" />
          </motion.div>
          <motion.p {...reveal(0.25)} className="t-lead mt-6 max-w-[46ch] text-[#ADB5BD]">
            {hero.subtitle}
          </motion.p>
          <motion.div {...reveal(0.35)} className="mt-8">
            <HeroCta />
          </motion.div>
        </div>
        <motion.div {...reveal(0.5)} className="lg:col-span-4">
          <SpecCard
            variant="glass"
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

/* H2 · Ficha: foto B&N y una ficha de vidrio grande al centro con el titular adentro. */
function HeroSpec() {
  return (
    <section aria-labelledby="hero-title" className="tone-dark relative isolate flex min-h-[100svh] items-center overflow-hidden">
      <Backdrop align="center" />
      <div className="container-x w-full pt-28 pb-16">
        <motion.div
          {...reveal(0.15)}
          className="glass mx-auto flex min-h-[560px] max-w-[1040px] flex-col justify-between rounded-[28px] p-6 md:min-h-[600px] md:p-12"
        >
          <div>
            <Headline className="t-display-sm max-w-[13ch]" />
            <p className="t-lead mt-6 max-w-[44ch] text-[#ADB5BD]">{hero.subtitle}</p>
          </div>
          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:flex sm:gap-12">
              <div>
                <dt className="t-label">Demo</dt>
                <dd className="mt-1 text-[15px] text-[#ADB5BD]">Sin anticipo</dd>
              </div>
              <div>
                <dt className="t-label">Diseño</dt>
                <dd className="mt-1 text-[15px] text-[#ADB5BD]">100% a tu marca</dd>
              </div>
              <div>
                <dt className="t-label">Soporte</dt>
                <dd className="mt-1 text-[15px] text-[#ADB5BD]">Personas reales</dd>
              </div>
              <div>
                <dt className="t-label">Desde</dt>
                <dd className="num mt-1 text-[15px] text-[#ADB5BD]">{`${fromPrice} ${pricing.currency}`}</dd>
              </div>
            </dl>
            <HeroCta />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* H3 · Actual mejorado: texto a la izquierda, mockups sobre vidrio a la derecha. */
function HeroMockups() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const project = projects[index];
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % projects.length), 4500);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <section aria-labelledby="hero-title" className="tone-dark relative isolate overflow-hidden">
      <Backdrop />
      <div className="container-x grid min-h-[100svh] items-center gap-12 pt-32 pb-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <motion.div {...reveal(0.1)}>
            <Headline className="t-display-sm max-w-[12ch]" />
          </motion.div>
          <motion.p {...reveal(0.25)} className="t-lead mt-6 max-w-[44ch] text-[#ADB5BD]">
            {hero.subtitle}
          </motion.p>
          <motion.div {...reveal(0.35)} className="mt-8">
            <HeroCta />
          </motion.div>
          <motion.ul {...reveal(0.45)} className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {hero.badges.map((b) => (
              <li key={b} className="t-label text-[#ADB5BD]">
                {b}
              </li>
            ))}
          </motion.ul>
        </div>
        <motion.div {...reveal(0.3)} className="lg:col-span-6">
          <div className="glass rounded-[28px] p-5 pr-[12%] pb-[12%] md:p-8 md:pr-[12%] md:pb-[10%]">
            <div className="relative">
              <LaptopMockup>
                <AnimatePresence initial={false}>
                  <motion.div key={project.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
                    <Image src={project.desktop} alt={`Sitio de ${project.name} en escritorio`} fill sizes="(min-width: 1024px) 560px, 90vw" className="object-cover object-top" />
                  </motion.div>
                </AnimatePresence>
              </LaptopMockup>
              <PhoneMockup className="absolute right-[-14%] bottom-[-18%] w-[26%]">
                <Image src={project.mobile} alt={`Sitio de ${project.name} en celular`} fill sizes="160px" className="object-cover object-top" />
              </PhoneMockup>
            </div>
          </div>
          <p className="t-label mt-5 text-[#ADB5BD]" aria-live="polite">
            {project.name} / {project.industry}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function HeroV2() {
  const { state } = useLab();
  if (state.hero === "H2") return <HeroSpec />;
  if (state.hero === "H3") return <HeroMockups />;
  return <HeroCinematic />;
}
