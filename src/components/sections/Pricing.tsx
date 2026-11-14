"use client";

import { Check } from "lucide-react";
import { formatMXN, maintenance, plans, pricing } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const PLAN_EVENT = "vg:plan";

function choosePlan(id: string) {
  window.dispatchEvent(new CustomEvent(PLAN_EVENT, { detail: id }));
}

export function Pricing() {
  const paid = maintenance.filter((m) => m.monthly > 0);
  return (
    <section id="precios" aria-labelledby="precios-titulo" className="section">
      <div className="container-x">
        <SectionHeading
          id="precios-titulo"
          eyebrow="Precios"
          title="Precios claros desde el primer día"
          description={`Cuatro planes para empezar. Todos incluyen la demo sin anticipo y el diseño a tu marca. Precios en ${pricing.currency}, ${pricing.taxLabel}.`}
        />

        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan, i) => (
            <Reveal
              as="li"
              key={plan.id}
              delay={i * 0.07}
              className={`relative flex flex-col rounded-[20px] border p-6 md:p-7 ${
                plan.featured
                  ? "border-flame bg-[linear-gradient(180deg,rgb(255_107_26/0.1),transparent_45%)] shadow-[0_0_64px_-24px_rgb(255_107_26/0.6)]"
                  : "border-line bg-coal shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-6 rounded-full bg-flame px-3 py-1 font-mono text-xs font-medium text-ink">
                  Más elegido
                </span>
              )}
              <h3 className="text-xl">{plan.name}</h3>
              <p className="mt-2 min-h-12 text-sm text-mute">{plan.summary}</p>
              <p className="mt-6 font-mono">
                <span className="block text-xs text-mute">Desde</span>
                <span className="text-4xl font-medium tracking-tighter">{formatMXN(plan.price)}</span>{" "}
                <span className="text-sm text-mute">{pricing.currency}</span>
              </p>
              <ul className="mt-6 mb-8 flex-1 space-y-3 border-t border-line pt-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-paper/90">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-flame" strokeWidth={2.5} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                href="/#cotizar"
                variant={plan.featured ? "primary" : "outline"}
                fullWidth
                onClick={() => choosePlan(plan.id)}
                aria-label={`Cotizar el plan ${plan.name}`}
              >
                Cotizar este plan
              </Button>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-16">
          <h3 className="text-2xl">Mantenimiento mensual</h3>
          <p className="mt-2 max-w-xl text-mute">
            Opcional. Nosotros cuidamos tu sitio y tú te dedicas a tu negocio. Cancelas cuando quieras.
          </p>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {paid.map((m) => (
              <li key={m.id} className="card p-6 md:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="text-xl">{m.label}</h4>
                  <p className="font-mono">
                    <span className="text-2xl font-medium tracking-tighter">{formatMXN(m.monthly)}</span>
                    <span className="text-sm text-mute"> {pricing.currency}/mes</span>
                  </p>
                </div>
                <p className="mt-2 text-sm text-mute">{m.description}</p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {m.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-paper/90">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-flame" strokeWidth={2.5} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-mono text-xs text-mute">
            Precios {pricing.taxLabel}. {pricing.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
