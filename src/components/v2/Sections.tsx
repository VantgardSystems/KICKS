"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  company,
  formatMXN,
  industries,
  maintenance,
  nav,
  plans,
  portfolioFilters,
  pricing,
  processSteps,
  projects,
  services,
  upcomingProjects,
  whatsappUrl,
} from "@/config/site";
import { PLAN_EVENT } from "@/lib/events";
import { Logo } from "@/components/ui/Logo";
import { CookieSettingsButton } from "@/components/layout/CookieSettingsButton";
import { Year } from "@/components/layout/Year";
import { Btn } from "./Btn";
import { SpecCard } from "./SpecCard";
import { useTone } from "./tone";

const ease = [0.16, 1, 0.3, 1] as const;

/* Aparición sobria: 600–900 ms con ease-out-expo. */
export function Rise({ children, delay = 0, className, as = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </Tag>
  );
}

/** Título de sección: etiqueta, título grande con palabra clave y texto corto. */
export function Heading({
  label,
  title,
  kw,
  text,
  id,
  aside,
}: {
  label: string;
  title: string;
  kw?: string;
  text?: string;
  id: string;
  aside?: ReactNode;
}) {
  const parts = kw ? title.split(kw) : [title];
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
      <Rise className="min-w-0 lg:col-span-8">
        <p className="t-label mb-5 opacity-70">{label}</p>
        <h2 id={id} className="t-section max-w-[16ch]">
          {kw ? (
            <>
              {parts[0]}
              <span className="kw">{kw}</span>
              {parts[1]}
            </>
          ) : (
            title
          )}
        </h2>
      </Rise>
      {(text || aside) && (
        <Rise delay={0.1} className="min-w-0 lg:col-span-4">
          {text && <p className="t-lead max-w-[40ch] opacity-75">{text}</p>}
          {aside}
        </Rise>
      )}
    </div>
  );
}

/* ---------------- Marquee ---------------- */
export function MarqueeV2() {
  const row = (hidden?: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {industries.map((name) => (
        <li key={name} className="flex items-center">
          <span className="f-display outline-text px-6 text-[clamp(48px,7vw,104px)] leading-none whitespace-nowrap md:px-10">{name}</span>
          <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full bg-[#FB5607]" />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Industrias con las que trabajamos" className="tone-dark overflow-hidden py-14 md:py-20">
      <div className="marquee [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-track flex w-max">
          {row()}
          {row(true)}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Servicios ---------------- */
const serviceSpan = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4", "lg:col-span-12"];

export function ServicesV2() {
  const tone = useTone("services");
  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className={`${tone} section`}>
      <div className="container-x">
        <Heading
          id="servicios-titulo"
          label="Servicios"
          title="Todo lo que tu negocio necesita para vender en línea"
          kw="vender"
          text="Desde una página sencilla hasta un sitio que contesta, agenda y cobra por ti."
        />
        <ul className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2 lg:grid-cols-12">
          {services.map((s, i) => (
            <Rise as="li" key={s.id} delay={(i % 3) * 0.08} className={`${serviceSpan[i]} ${i === 5 ? "md:col-span-2" : ""}`}>
              <SpecCard
                as="div"
                index={i}
                title={s.title}
                summary={s.description}
                image={{ src: s.image, alt: s.imageAlt, sizes: "(min-width: 1024px) 50vw, 100vw", aspect: i === 5 ? "aspect-[4/3] lg:aspect-[21/8]" : "aspect-[4/3]" }}
                rows={[
                  { label: "Entrega", value: s.delivery },
                  { label: "Incluye", value: s.includes },
                  { label: "Desde", value: <span className="num">{`${formatMXN(s.from)}${s.fromSuffix ?? ""}`}</span> },
                ]}
                pill={{ label: "Cotizar", href: "/#cotizar", ariaLabel: `Cotizar ${s.title}` }}
                className="h-full"
              />
            </Rise>
          ))}
        </ul>
        <p className="t-label mt-8 opacity-60">
          Precios en {pricing.currency}, {pricing.taxLabel}
        </p>
      </div>
    </section>
  );
}

/* ---------------- Portafolio ---------------- */
function ViewCursor({ on }: { on: boolean }) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 500, damping: 40 });
  const sy = useSpring(y, { stiffness: 500, damping: 40 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);
  return (
    <motion.div aria-hidden="true" style={{ x: sx, y: sy }} className="view-cursor" data-on={on}>
      Ver
    </motion.div>
  );
}

export function PortfolioV2() {
  const tone = useTone("portfolio");
  const [filter, setFilter] = useState<(typeof portfolioFilters)[number]>("Todos");
  const [hover, setHover] = useState(false);
  const shown = projects.filter((p) => filter === "Todos" || p.category === filter);
  const upcoming = upcomingProjects.filter((p) => filter === "Todos" || p.category === filter);

  return (
    <section id="portafolio" aria-labelledby="portafolio-titulo" className={`${tone} section`}>
      <ViewCursor on={hover} />
      <div className="container-x">
        <Heading
          id="portafolio-titulo"
          label="Portafolio"
          title="Proyectos que ya están trabajando"
          kw="trabajando"
          aside={
            <div role="group" aria-label="Filtrar proyectos" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
              {portfolioFilters.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={`min-h-11 shrink-0 rounded-full border px-5 text-[15px] transition-colors ${
                    filter === f ? "border-current bg-[color:var(--color-paper)] text-[color:var(--color-ink)]" : "border-[color:var(--color-line-strong)] opacity-80 hover:opacity-100"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          }
        />

        <ul className="mt-14 grid gap-x-5 gap-y-14 md:mt-20 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p, i) => (
              <motion.li key={p.slug} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, delay: i * 0.05, ease }} className={i % 2 === 1 ? "md:mt-24" : ""}>
                <Link
                  href={`/portafolio/${p.slug}`}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
                  onPointerLeave={() => setHover(false)}
                  className="group block md:cursor-none"
                >
                  <div className="film relative aspect-[16/10] overflow-hidden rounded-[28px] bg-[#212529]">
                    <Image src={p.desktop} alt={`Captura del sitio de ${p.name}`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
                  </div>
                  <div className="mt-6 flex items-start justify-between gap-6">
                    <h3 className="t-card">{p.name}</h3>
                    <span className="spec-pill shrink-0 border-[color:var(--color-line-strong)] md:hidden">Ver</span>
                  </div>
                  <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-[color:var(--color-line)] pt-5">
                    <div>
                      <dt className="t-label">Industria</dt>
                      <dd className="mt-1 text-[15px] opacity-75">{p.industry}</dd>
                    </div>
                    <div>
                      <dt className="t-label">Año</dt>
                      <dd className="num mt-1 text-[15px]">{p.year}</dd>
                    </div>
                    <div>
                      <dt className="t-label">Stack</dt>
                      <dd className="mt-1 text-[15px] opacity-75">{p.stack}</dd>
                    </div>
                  </dl>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {upcoming.length > 0 && (
          <ul className="mt-16 grid gap-4 sm:grid-cols-3">
            {upcoming.map((p, i) => (
              <Rise as="li" key={p.name} delay={i * 0.06}>
                <SpecCard as="div" size="md" index={i + 1} interactive={false} title={p.name} rows={[{ label: "Estado", value: "En desarrollo" }, { label: "Giro", value: p.industry }]} className="min-h-[220px]" />
              </Rise>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ---------------- Proceso ---------------- */
function ProcessStep({ step, index, onActive }: { step: (typeof processSteps)[number]; index: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-50% 0px -50% 0px" });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);
  return (
    <li ref={ref} className="flex flex-col justify-center py-4 lg:min-h-[70vh] lg:py-0">
      <SpecCard
        as="div"
        index={index}
        title={step.title}
        summary={step.description}
        rows={[
          { label: "Paso", value: <span className="num">{`0${index + 1} / 0${processSteps.length}`}</span> },
          { label: "Detalle", value: step.detail },
        ]}
        className={`transition-opacity duration-500 ${inView ? "lg:opacity-100" : "lg:opacity-50"}`}
      >
        <div className="film relative mt-6 aspect-[4/3] overflow-hidden rounded-[16px] lg:hidden">
          <Image src={step.image} alt={step.imageAlt} fill sizes="100vw" className="object-cover" />
        </div>
      </SpecCard>
    </li>
  );
}

export function ProcessV2() {
  const tone = useTone("process");
  const [active, setActive] = useState(0);
  return (
    <section id="proceso" aria-labelledby="proceso-titulo" className={`${tone} section`}>
      <div className="container-x">
        <Heading
          id="proceso-titulo"
          label="Proceso"
          title="Primero la ves funcionando. Después decides."
          kw="funcionando."
          text="Cuatro pasos, sin letras chiquitas. No pagas nada hasta que la demo te convenza."
        />
        <div className="mt-12 grid gap-x-8 lg:mt-8 lg:grid-cols-12">
          <ol className="lg:col-span-6">
            {processSteps.map((step, i) => (
              <ProcessStep key={step.title} step={step} index={i} onActive={setActive} />
            ))}
          </ol>
          <div className="hidden lg:col-span-6 lg:block" aria-hidden="true">
            <div className="sticky top-[15vh] flex h-[70vh] flex-col justify-center">
              <div className="film relative h-full overflow-hidden rounded-[28px] bg-[#212529]">
                {processSteps.map((step, i) => (
                  <Image
                    key={step.image}
                    src={step.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 50vw, 0px"
                    className={`object-cover transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${i === active ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}
                  />
                ))}
                <span className="f-display num absolute bottom-6 left-8 text-[clamp(96px,12vw,180px)] leading-none text-[#E9ECEF]">0{active + 1}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Precios ---------------- */
export function PricingV2() {
  const tone = useTone("pricing");
  const paid = maintenance.filter((m) => m.monthly > 0);
  return (
    <section id="precios" aria-labelledby="precios-titulo" className={`${tone} section`}>
      <div className="container-x">
        <Heading
          id="precios-titulo"
          label="Precios"
          title="Precios claros desde el primer día"
          kw="claros"
          text={`Todos incluyen la demo sin anticipo y el diseño a tu marca. Precios en ${pricing.currency}, ${pricing.taxLabel}.`}
        />
        <ul className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan, i) => (
            <Rise as="li" key={plan.id} delay={i * 0.07}>
              <SpecCard
                as="div"
                index={i}
                featured={plan.featured}
                title={
                  <>
                    {plan.name}
                    {plan.featured && <span className="t-label mt-3 block">Más elegido</span>}
                  </>
                }
                summary={plan.summary}
                rows={[
                  {
                    label: "Desde",
                    value: (
                      <span className="whitespace-nowrap">
                        <span className="num f-display text-[34px] leading-none tracking-tight">{formatMXN(plan.price)}</span> {pricing.currency}
                      </span>
                    ),
                  },
                ]}
                pill={{
                  label: "Cotizar",
                  href: "/#cotizar",
                  ariaLabel: `Cotizar el plan ${plan.name}`,
                  onClick: () => window.dispatchEvent(new CustomEvent(PLAN_EVENT, { detail: plan.id })),
                }}
                pillBlock
                className="h-full min-h-[560px]"
              >
                <ul className="mt-8 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-3 text-[15px] leading-snug">
                      <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                      <span className="spec-value">{f}</span>
                    </li>
                  ))}
                </ul>
              </SpecCard>
            </Rise>
          ))}
        </ul>
        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {paid.map((m, i) => (
            <Rise key={m.id} delay={i * 0.07}>
              <SpecCard
                as="div"
                size="md"
                index={i + 1}
                variant={undefined}
                title={`Mantenimiento ${m.label}`}
                summary={m.description}
                rows={[
                  { label: "Mensual", value: <span className="num">{`${formatMXN(m.monthly)} ${pricing.currency}`}</span> },
                  { label: "Incluye", value: m.features.slice(0, 2).join(" · ") },
                ]}
                className="h-full"
              />
            </Rise>
          ))}
        </div>
        <p className="t-label mt-8 opacity-60">
          {pricing.taxLabel} · {pricing.note}
        </p>
      </div>
    </section>
  );
}

/* ---------------- Franja CTA ---------------- */
export function CtaBand() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);
  return (
    <section ref={ref} aria-labelledby="cta-titulo" className="tone-dark relative isolate overflow-hidden">
      <motion.div aria-hidden="true" style={{ y }} className="film absolute inset-[-10%_0] -z-10">
        <Image src="/images/cta-bg.webp" alt="" fill sizes="100vw" className="object-cover" />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#0B0C0E]/55" />
      <div className="container-x flex min-h-[70vh] flex-col items-start justify-end gap-8 py-20 md:flex-row md:items-end md:justify-between md:py-24">
        <Rise>
          <h2 id="cta-titulo" className="t-section max-w-[14ch]">
            ¿Lista tu <span className="kw">demo</span> esta semana?
          </h2>
        </Rise>
        <Rise delay={0.1}>
          <Btn href="/#cotizar" size="lg">
            Cotiza tu página
          </Btn>
        </Rise>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
export function FooterV2() {
  const linkCls = "inline-flex min-h-10 items-center text-[15px] text-[#ADB5BD] transition-colors hover:text-[#E9ECEF]";
  return (
    <footer className="tone-dark relative overflow-hidden border-t border-white/10">
      <div className="container-x relative z-10 pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-xs text-[15px] text-[#ADB5BD]">Páginas web que atienden, agendan y venden por tu negocio.</p>
          </div>
          <nav aria-label="Sitio" className="lg:col-span-2">
            <p className="t-label mb-3">Sitio</p>
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={linkCls}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Servicios" className="lg:col-span-2">
            <p className="t-label mb-3">Servicios</p>
            <ul>
              {services.map((s) => (
                <li key={s.id}>
                  <Link href="/#servicios" className={linkCls}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Legal" className="lg:col-span-2">
            <p className="t-label mb-3">Legal</p>
            <ul>
              <li>
                <Link href="/aviso-de-privacidad" className={linkCls}>
                  Aviso de privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos-y-condiciones" className={linkCls}>
                  Términos
                </Link>
              </li>
              <li>
                <Link href="/politica-de-cookies" className={linkCls}>
                  Cookies
                </Link>
              </li>
              <li>
                <CookieSettingsButton className={linkCls} />
              </li>
            </ul>
          </nav>
          <div className="lg:col-span-2">
            <p className="t-label mb-3">Contacto</p>
            <ul>
              <li>
                <a href={whatsappUrl("Hola, quiero información sobre una página web.")} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={company.social.instagram} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  Instagram
                </a>
              </li>
              <li>
                <a href={company.social.tiktok} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  TikTok
                </a>
              </li>
              <li>
                <a href={`mailto:${company.email}`} className={`${linkCls} break-all`}>
                  Correo
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-20 flex flex-col gap-2 border-t border-white/10 pt-6 text-[14px] text-[#ADB5BD] sm:flex-row sm:justify-between">
          <p>
            © <Year /> {company.name}
          </p>
          <p>Hecho en México</p>
        </div>
      </div>
      {/* Palabra gigante decorativa (SVG: no es texto que se lea, no entra en el árbol de accesibilidad). */}
      <svg aria-hidden="true" focusable="false" viewBox="0 0 1000 170" className="giant-svg pointer-events-none block w-full select-none">
        <text x="500" y="152" textAnchor="middle" fontSize="196" letterSpacing="-9" fill="rgb(233 236 239 / 0.06)" style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>
          VANTGARD
        </text>
      </svg>
    </footer>
  );
}
