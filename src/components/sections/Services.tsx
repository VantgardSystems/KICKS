import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BotMessageSquare,
  CalendarCheck,
  Globe,
  PanelTop,
  ShoppingCart,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { formatMXN, pricing, services, type Service } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const icons: Record<Service["icon"], LucideIcon> = {
  PanelTop,
  Globe,
  ShoppingCart,
  CalendarCheck,
  BotMessageSquare,
  Wrench,
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = icons[service.icon];
  const large = service.size === "lg";
  return (
    <Reveal
      as="article"
      delay={(index % 3) * 0.08}
      className={`card group relative flex min-h-[340px] flex-col justify-end overflow-hidden transition-colors duration-300 hover:border-white/20 ${
        large ? "md:col-span-2" : ""
      }`}
    >
      <div
        aria-hidden="true"
        className={`absolute top-0 right-0 ${large ? "h-full w-full md:w-[62%]" : "h-[68%] w-full"}`}
      >
        <Image
          src={service.image}
          alt=""
          fill
          sizes={large ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
          className="object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div
          className={`absolute inset-0 ${
            large
              ? "bg-gradient-to-t from-coal via-coal/40 to-transparent md:bg-gradient-to-r md:from-coal md:via-coal/30"
              : "bg-gradient-to-t from-coal via-coal/30 to-transparent"
          }`}
        />
      </div>

      <div className={`relative p-6 md:p-8 ${large ? "md:max-w-[52%]" : ""}`}>
        <span className="mb-5 grid h-11 w-11 place-items-center rounded-xl border border-line-strong bg-ink/70 backdrop-blur">
          <Icon className="h-5 w-5 text-flame" aria-hidden="true" />
        </span>
        <h3 className="text-2xl">{service.title}</h3>
        <p className="mt-2 text-mute">{service.description}</p>
        <p className="mt-5 font-mono text-sm text-paper">
          Desde <span className="text-flame">{formatMXN(service.from)}</span>
          {service.fromSuffix ?? ""} <span className="text-mute">{pricing.currency}</span>
        </p>
      </div>
    </Reveal>
  );
}

export function Services() {
  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="section">
      <div className="container-x">
        <SectionHeading
          id="servicios-titulo"
          eyebrow="Servicios"
          title="Todo lo que tu negocio necesita para vender en línea"
          description="Desde una página sencilla hasta un sitio que contesta, agenda y cobra por ti. Empiezas con lo que necesitas hoy y creces cuando quieras."
        />

        <div className="mt-12 grid grid-flow-dense gap-4 md:mt-16 md:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
          <Reveal delay={0.16} className="h-full">
            <Link
              href="/#contacto"
              className="group flex h-full min-h-[220px] flex-col justify-between rounded-[20px] border border-flame/40 bg-flame/[0.06] p-6 transition-colors duration-300 hover:bg-flame/[0.12] md:min-h-[340px] md:p-8"
            >
              <ArrowUpRight
                className="h-8 w-8 text-flame transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              />
              <span>
                <span className="block text-2xl font-semibold tracking-tight">¿No sabes cuál te conviene?</span>
                <span className="mt-2 block text-mute">Agenda un diagnóstico gratis de 20 minutos.</span>
              </span>
            </Link>
          </Reveal>
        </div>
        <p className="mt-6 font-mono text-xs text-mute">Precios en {pricing.currency}, {pricing.taxLabel}.</p>
      </div>
    </section>
  );
}
