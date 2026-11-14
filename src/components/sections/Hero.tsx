"use client";

import Image, { getImageProps } from "next/image";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useState, type PointerEvent } from "react";
import { hero, projects } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { LaptopMockup, PhoneMockup } from "@/components/ui/DeviceMockups";

const words = hero.title.split(" ");

function HeroBackground() {
  const common = { alt: "", fill: true, priority: true } as const;
  const { props: desktop } = getImageProps({ ...common, src: "/images/hero-bg.webp", sizes: "100vw" });
  const { props: mobile } = getImageProps({ ...common, src: "/images/hero-bg-mobile.webp", sizes: "100vw" });
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktop.srcSet} sizes="100vw" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...mobile} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
    </picture>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const project = projects[index];

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const gx = useSpring(glowX, { stiffness: 90, damping: 22 });
  const gy = useSpring(glowY, { stiffness: 90, damping: 22 });
  const [glowOn, setGlowOn] = useState(false);

  const laptopX = useTransform(sx, (v) => v * -22);
  const laptopY = useTransform(sy, (v) => v * -14);
  const phoneX = useTransform(sx, (v) => v * 34);
  const phoneY = useTransform(sy, (v) => v * 22);
  const tiltY = useTransform(sx, (v) => v * 5);
  const tiltX = useTransform(sy, (v) => v * -4);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % projects.length), 4500);
    return () => window.clearInterval(id);
  }, [reduce]);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
    glowX.set(e.clientX - r.left);
    glowY.set(e.clientY - r.top);
    if (!glowOn) setGlowOn(true);
  };

  return (
    <section
      aria-labelledby="hero-title"
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative isolate overflow-hidden"
    >
      {/* Fondo */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <HeroBackground />
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink" />
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-ink/90 via-ink/50 to-transparent lg:w-2/3" />
        <motion.div
          style={{ x: gx, y: gy, opacity: glowOn ? 1 : 0 }}
          className="pointer-events-none absolute top-0 left-0 -ml-[280px] -mt-[280px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgb(255_107_26/0.2),transparent_65%)] blur-2xl transition-opacity duration-700"
        />
      </div>

      <div className="container-x grid min-h-[100svh] items-center gap-12 pt-28 pb-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:pt-32 lg:pb-24">
        <div>
          <h1 id="hero-title" className="h-display max-w-[13ch]" aria-label={hero.title}>
            {words.map((word, i) => (
              <span key={i} aria-hidden="true">
                <span
                  className={`word ${word === "24/7" ? "font-mono tracking-[-0.06em] text-flame" : ""}`}
                  style={{ ["--i" as string]: i }}
                >
                  {word}
                </span>{" "}
              </span>
            ))}
          </h1>
          <p className="fade-up mt-6 max-w-xl text-lg text-mute md:text-xl" style={{ ["--d" as string]: "1150ms" }}>
            {hero.subtitle}
          </p>
          <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ ["--d" as string]: "1300ms" }}>
            <Button href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} size="lg" variant="outline">
              {hero.secondaryCta.label}
            </Button>
          </div>
          <ul className="fade-up mt-10 flex flex-wrap gap-x-6 gap-y-3" style={{ ["--d" as string]: "1450ms" }}>
            {hero.badges.map((badge) => (
              <li key={badge} className="flex items-center gap-2 text-sm text-paper/90">
                <span className="grid h-5 w-5 place-items-center rounded-full border border-flame/50 bg-flame/10">
                  <Check className="h-3 w-3 text-flame" strokeWidth={3} aria-hidden="true" />
                </span>
                {badge}
              </li>
            ))}
          </ul>
        </div>

        {/* Mockups */}
        <div className="fade-up relative mx-auto w-full max-w-[560px] lg:max-w-none" style={{ ["--d" as string]: "900ms", perspective: 1400 }}>
          <motion.div style={{ rotateX: tiltX, rotateY: tiltY }} className="relative pr-[8%] pb-[10%]">
            <motion.div style={{ x: laptopX, y: laptopY }}>
              <motion.div
                animate={reduce ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <LaptopMockup>
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={project.slug}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={project.desktop}
                        alt={`Sitio de ${project.name} en escritorio`}
                        fill
                        sizes="(min-width: 1024px) 560px, 90vw"
                        className="object-cover object-top"
                        priority={index === 0}
                      />
                    </motion.div>
                  </AnimatePresence>
                </LaptopMockup>
              </motion.div>
            </motion.div>

            <motion.div style={{ x: phoneX, y: phoneY }} className="absolute right-0 bottom-0 w-[24%]">
              <motion.div
                animate={reduce ? undefined : { y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <PhoneMockup>
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={project.slug}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={project.mobile}
                        alt={`Sitio de ${project.name} en celular`}
                        fill
                        sizes="160px"
                        className="object-cover object-top"
                      />
                    </motion.div>
                  </AnimatePresence>
                </PhoneMockup>
              </motion.div>
            </motion.div>
          </motion.div>

          <div className="mt-6 flex items-center justify-between gap-4 pr-[8%]">
            <p className="font-mono text-xs text-mute" aria-live="polite">
              <span className="text-paper">{project.name}</span> / {project.industry}
            </p>
            <div className="flex gap-1" role="group" aria-label="Elegir proyecto">
              {projects.map((p, i) => (
                <button
                  key={p.slug}
                  type="button"
                  aria-label={`Ver ${p.name}`}
                  aria-pressed={i === index}
                  onClick={() => setIndex(i)}
                  className="grid h-8 w-8 place-items-center"
                >
                  <span className={`h-[3px] rounded-full transition-all duration-500 ${i === index ? "w-6 bg-flame" : "w-3 bg-white/25"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
