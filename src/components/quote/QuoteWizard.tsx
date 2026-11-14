"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Mail, MessageCircle, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  delivery,
  extras,
  formatMXN,
  maintenance,
  plans,
  pricing,
  projectTypes,
  whatsappUrl,
  type ExtraId,
} from "@/config/site";
import { PrivacyLabel, PrivacyNotice } from "@/components/legal/PrivacyNotice";
import { PLAN_EVENT } from "@/components/sections/Pricing";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, useForm } from "@/components/ui/Field";
import {
  calcQuote,
  defaultChoices,
  getType,
  quoteSummaryText,
  rangeText,
  sanitizeChoices,
  type QuoteChoices,
} from "@/lib/pricing";

const STEPS = ["Tipo de proyecto", "Tamaño", "Extras", "Tiempo de entrega", "Mantenimiento", "Tus datos"] as const;
const SUMMARY = STEPS.length;
const DRAFT_KEY = "vg-quote-draft";

/* ---------- piezas ---------- */

function OptionCard({
  type,
  name,
  checked,
  disabled,
  onChange,
  title,
  description,
  aside,
}: {
  type: "radio" | "checkbox";
  name: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  title: string;
  description?: string;
  aside?: ReactNode;
}) {
  return (
    <label
      className={`relative flex min-h-[72px] cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-flame ${
        checked ? "border-flame bg-flame/[0.08]" : "border-line-strong hover:border-white/35"
      } ${disabled ? "cursor-default opacity-80" : ""}`}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border transition-colors ${
          type === "radio" ? "rounded-full" : "rounded-md"
        } ${checked ? "border-flame bg-flame text-ink" : "border-white/35"}`}
      >
        {checked && <Check className="h-3 w-3" strokeWidth={3.5} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-paper">{title}</span>
        {description && <span className="mt-1 block text-sm text-mute">{description}</span>}
      </span>
      {aside && <span className="shrink-0 pl-2 text-right font-mono text-sm text-paper">{aside}</span>}
    </label>
  );
}

function Estimate({ choices, compact }: { choices: QuoteChoices; compact?: boolean }) {
  const q = calcQuote(choices);
  if (compact) {
    return (
      <p className="flex items-baseline justify-between gap-3 font-mono" aria-live="polite">
        <span className="text-xs text-mute">Estimado</span>
        <span className="text-base text-flame">{rangeText(q)}</span>
      </p>
    );
  }
  return (
    <div>
      <dl className="space-y-3 text-sm">
        {q.lines.map((l) => (
          <div key={l.label} className="flex items-start justify-between gap-4">
            <dt className="text-paper/90">
              {l.label}
              {l.note && <span className="block text-xs text-mute">{l.note}</span>}
            </dt>
            <dd className="shrink-0 font-mono text-paper">
              {l.amount === 0 ? "Incluido" : `${l.amount < 0 ? "−" : ""}${formatMXN(Math.abs(l.amount))}`}
            </dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 border-t border-line pt-3">
          <dt className="text-mute">Entrega</dt>
          <dd className="text-right text-paper">{q.deliveryLabel}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-mute">Mantenimiento</dt>
          <dd className="text-right font-mono text-paper">
            {q.monthly ? `${q.monthlyLabel}, ${formatMXN(q.monthly)}/mes` : "Ninguno"}
          </dd>
        </div>
      </dl>
      <div className="mt-5 border-t border-line pt-5" aria-live="polite">
        <p className="font-mono text-xs text-mute">Rango estimado</p>
        <p className="mt-1 font-mono text-2xl font-medium tracking-tight text-flame">{rangeText(q)}</p>
        <p className="mt-2 text-xs text-mute">
          {pricing.taxLabel}. {pricing.note}
        </p>
      </div>
    </div>
  );
}

/* ---------- wizard ---------- */

export function QuoteWizard({ initialPlan, headingLevel: Heading = "h3" }: { initialPlan?: string; headingLevel?: "h2" | "h3" }) {
  const Sub = Heading === "h2" ? "h3" : "h4";
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<QuoteChoices>(defaultChoices);
  const [restored, setRestored] = useState(false);
  const [planNote, setPlanNote] = useState<string | null>(null);
  const [promos, setPromos] = useState(false);
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  const form = useForm(
    { name: "", business: "", industry: "", whatsapp: "", email: "", privacy: false as boolean },
    ["name", "business", "industry", "whatsapp", "email", "privacy"],
  );

  const type = getType(choices.type);
  const quote = useMemo(() => calcQuote(choices), [choices]);

  const applyPlan = useCallback((id: string) => {
    const plan = plans.find((p) => p.id === id);
    if (!plan) return;
    const t = getType(plan.preset.type);
    setChoices((c) => sanitizeChoices({ ...c, type: t.id, units: t.included, extras: plan.preset.extras }));
    setStep(0);
    setPlanNote(`Plan ${plan.name} elegido. Ajusta lo que necesites.`);
    setRestored(false);
  }, []);

  // Cargar borrador o plan inicial (solo opciones del proyecto, nunca datos personales).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw && !initialPlan) {
        const draft = JSON.parse(raw) as { choices: QuoteChoices; step: number };
        setChoices(sanitizeChoices(draft.choices));
        setStep(Math.min(Math.max(0, draft.step | 0), SUMMARY - 1));
        setRestored(true);
      }
    } catch {
      /* borrador ilegible: empezamos de cero */
    }
    if (initialPlan) applyPlan(initialPlan);
    loaded.current = true;

    const onPlan = (e: Event) => applyPlan((e as CustomEvent<string>).detail);
    window.addEventListener(PLAN_EVENT, onPlan);
    return () => window.removeEventListener(PLAN_EVENT, onPlan);
  }, [initialPlan, applyPlan]);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ choices, step: Math.min(step, SUMMARY - 1) }));
    } catch {
      /* sin almacenamiento */
    }
  }, [choices, step]);

  const go = (next: number) => {
    setStep(next);
    setNotice(null);
    requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      const top = rootRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) rootRef.current?.scrollIntoView({ block: "start" });
    });
  };

  const next = () => {
    if (step === SUMMARY - 1 && !form.validateAll(formRef.current)) return;
    go(step + 1);
  };

  const restart = () => {
    setChoices(defaultChoices);
    setRestored(false);
    setPlanNote(null);
    go(0);
  };

  const update = (patch: Partial<QuoteChoices>) => setChoices((c) => sanitizeChoices({ ...c, ...patch }));
  const toggleExtra = (id: ExtraId) =>
    update({ extras: choices.extras.includes(id) ? choices.extras.filter((e) => e !== id) : [...choices.extras, id] });

  const contact = {
    name: String(form.values.name).trim(),
    business: String(form.values.business).trim(),
    industry: String(form.values.industry).trim(),
    whatsapp: String(form.values.whatsapp).trim(),
    email: String(form.values.email).trim(),
  };
  const waLink = whatsappUrl(quoteSummaryText(choices, contact));

  const clearDraft = () => {
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* nada que borrar */
    }
  };

  const sendByEmail = async () => {
    setSending(true);
    setNotice(null);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contact, privacy: form.values.privacy, promos, website, choices }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; fallback?: string; error?: string };
      if (data.ok) {
        clearDraft();
        router.push("/gracias?tipo=cotizacion");
        return;
      }
      if (data.fallback === "whatsapp") {
        const win = window.open(waLink, "_blank", "noopener,noreferrer");
        setNotice(
          data.error ??
            (win
              ? "El correo no está disponible en este momento. Abrimos WhatsApp con tu cotización lista para enviar."
              : "El correo no está disponible en este momento. Usa el botón de WhatsApp: tu cotización ya va escrita."),
        );
      } else {
        setNotice(data.error ?? "No pudimos enviar tu cotización. Intenta de nuevo o envíala por WhatsApp.");
      }
    } catch {
      setNotice("No hay conexión con el servidor. Revisa tu internet e intenta de nuevo, o envíala por WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  const isSummary = step === SUMMARY;
  const progress = isSummary ? 1 : (step + 1) / STEPS.length;

  return (
    <div ref={rootRef} className={`grid scroll-mt-24 gap-5 lg:items-start ${isSummary ? "mx-auto max-w-3xl" : "lg:grid-cols-[minmax(0,1fr)_360px]"}`}>
      <div className="card min-w-0 overflow-hidden">
        {/* Progreso */}
        <div className="border-b border-line p-5 md:px-8">
          <div className="flex items-center justify-between gap-4 font-mono text-xs text-mute">
            <span>{isSummary ? "Resumen" : `Paso ${step + 1} de ${STEPS.length}`}</span>
            <span aria-hidden="true">{Math.round(progress * 100)}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Avance del cotizador"
            aria-valuemin={0}
            aria-valuemax={STEPS.length}
            aria-valuenow={isSummary ? STEPS.length : step + 1}
            className="mt-3 h-1 overflow-hidden rounded-full bg-white/10"
          >
            <div
              className="h-full origin-left rounded-full bg-flame transition-transform duration-300 ease-out"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        </div>

        <div className="p-5 md:p-8">
          {(restored || planNote) && !isSummary && (
            <p className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-ink px-4 py-3 text-sm text-mute">
              {planNote ?? "Recuperamos tu avance."}
              <button type="button" onClick={restart} className="min-h-8 text-paper underline underline-offset-4">
                Empezar de nuevo
              </button>
            </p>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Heading ref={headingRef} tabIndex={-1} className="text-2xl outline-none md:text-3xl">
                {
                  [
                    "¿Qué tipo de proyecto necesitas?",
                    `¿${type.unit.plural === "productos" ? "Cuántos" : "Cuántas"} ${type.unit.plural} tendrá?`,
                    "¿Qué extras quieres agregar?",
                    "¿Para cuándo la necesitas?",
                    "¿Quieres que la mantengamos al día?",
                    "¿A quién le enviamos la cotización?",
                    "Tu cotización estimada",
                  ][step]
                }
              </Heading>

              {step === 0 && (
                <fieldset className="mt-6">
                  <legend className="sr-only">Tipo de proyecto</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {projectTypes.map((t) => (
                      <OptionCard
                        key={t.id}
                        type="radio"
                        name="tipo"
                        checked={choices.type === t.id}
                        onChange={() => {
                          update({ type: t.id, units: t.included });
                          setPlanNote(null);
                        }}
                        title={t.label}
                        description={t.description}
                        aside={
                          <>
                            <span className="block text-xs text-mute">Desde</span>
                            {formatMXN(t.base)}
                          </>
                        }
                      />
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 1 && (
                <div className="mt-6">
                  <p className="text-mute">
                    Tu plan incluye hasta {type.included} {type.unit.plural}. Cada {type.unit.singular} adicional
                    cuesta {formatMXN(type.perUnit)}. Si no estás seguro, deja un aproximado.
                  </p>
                  <div className="mt-8 flex items-end justify-between gap-4">
                    <label htmlFor="q-units" className="text-sm font-medium">
                      Número de {type.unit.plural}
                    </label>
                    <output htmlFor="q-units" className="font-mono text-5xl font-medium tracking-tighter text-paper">
                      {choices.units}
                    </output>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Quitar ${type.step}`}
                      onClick={() => update({ units: choices.units - type.step })}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line-strong hover:border-white/40"
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <input
                      id="q-units"
                      type="range"
                      min={type.min}
                      max={type.max}
                      step={type.step}
                      value={choices.units}
                      onChange={(e) => update({ units: Number(e.target.value) })}
                      aria-valuetext={`${choices.units} ${type.unit.plural}`}
                      className="h-11 w-full"
                    />
                    <button
                      type="button"
                      aria-label={`Agregar ${type.step}`}
                      onClick={() => update({ units: choices.units + type.step })}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line-strong hover:border-white/40"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-1 flex justify-between px-14 font-mono text-xs text-mute">
                    <span>{type.min}</span>
                    <span>{type.max}</span>
                  </div>
                </div>
              )}

              {step === 2 && (
                <fieldset className="mt-6">
                  <legend className="mb-4 text-mute">Elige los que quieras. Puedes dejarlo sin extras.</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {extras.map((e) => {
                      const included = type.includesExtras?.includes(e.id) ?? false;
                      return (
                        <OptionCard
                          key={e.id}
                          type="checkbox"
                          name={`extra-${e.id}`}
                          checked={included || choices.extras.includes(e.id)}
                          disabled={included}
                          onChange={() => toggleExtra(e.id)}
                          title={e.label}
                          description={e.description}
                          aside={included ? "Incluido" : `+${formatMXN(e.price)}`}
                        />
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {step === 3 && (
                <fieldset className="mt-6">
                  <legend className="sr-only">Tiempo de entrega</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {delivery.map((d) => (
                      <OptionCard
                        key={d.id}
                        type="radio"
                        name="entrega"
                        checked={choices.delivery === d.id}
                        onChange={() => update({ delivery: d.id })}
                        title={d.label}
                        description={d.time}
                        aside={d.surcharge ? `+${Math.round(d.surcharge * 100)} %` : "Sin costo"}
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-mute">Los días cuentan desde que apruebas tu demo.</p>
                </fieldset>
              )}

              {step === 4 && (
                <fieldset className="mt-6">
                  <legend className="sr-only">Mantenimiento mensual</legend>
                  <div className="grid gap-3">
                    {maintenance.map((m) => (
                      <OptionCard
                        key={m.id}
                        type="radio"
                        name="mantenimiento"
                        checked={choices.maintenance === m.id}
                        onChange={() => update({ maintenance: m.id })}
                        title={m.label}
                        description={m.features.length ? `${m.description} ${m.features.slice(0, 3).join(", ")}.` : m.description}
                        aside={m.monthly ? `${formatMXN(m.monthly)}/mes` : "$0"}
                      />
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 5 && (
                <div ref={formRef} className="mt-6">
                  <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
                    <Field label="Nombre" name="name" idPrefix="q" error={form.errors.name}>
                      {(p) => (
                        <input
                          {...p}
                          type="text"
                          autoComplete="name"
                          required
                          value={String(form.values.name)}
                          onChange={(e) => form.set("name", e.target.value)}
                          onBlur={() => form.blur("name")}
                        />
                      )}
                    </Field>
                    <Field label="Negocio" name="business" idPrefix="q" error={form.errors.business}>
                      {(p) => (
                        <input
                          {...p}
                          type="text"
                          autoComplete="organization"
                          required
                          value={String(form.values.business)}
                          onChange={(e) => form.set("business", e.target.value)}
                          onBlur={() => form.blur("business")}
                        />
                      )}
                    </Field>
                    <Field label="Giro" name="industry" idPrefix="q" error={form.errors.industry} hint="Ejemplo: clínica dental, tienda de ropa.">
                      {(p) => (
                        <input
                          {...p}
                          type="text"
                          required
                          value={String(form.values.industry)}
                          onChange={(e) => form.set("industry", e.target.value)}
                          onBlur={() => form.blur("industry")}
                        />
                      )}
                    </Field>
                    <Field label="WhatsApp" name="whatsapp" idPrefix="q" error={form.errors.whatsapp} hint="10 dígitos.">
                      {(p) => (
                        <input
                          {...p}
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel-national"
                          required
                          value={String(form.values.whatsapp)}
                          onChange={(e) => form.set("whatsapp", e.target.value)}
                          onBlur={() => form.blur("whatsapp")}
                        />
                      )}
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Correo" name="email" idPrefix="q" error={form.errors.email}>
                        {(p) => (
                          <input
                            {...p}
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            required
                            value={String(form.values.email)}
                            onChange={(e) => form.set("email", e.target.value)}
                            onBlur={() => form.blur("email")}
                          />
                        )}
                      </Field>
                    </div>
                  </div>

                  {/* Honeypot: invisible para personas */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label>
                      No llenes este campo
                      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                    </label>
                  </div>

                  <div className="mt-2 space-y-4">
                    <Checkbox
                      name="privacy"
                      idPrefix="q"
                      required
                      checked={Boolean(form.values.privacy)}
                      onChange={(v) => form.set("privacy", v)}
                      error={form.errors.privacy}
                    >
                      <PrivacyLabel />
                    </Checkbox>
                    <Checkbox name="promos" idPrefix="q" checked={promos} onChange={setPromos}>
                      Quiero recibir promociones y novedades. <span className="text-mute/80">Opcional.</span>
                    </Checkbox>
                    <PrivacyNotice purpose="preparar y enviarte tu cotización" />
                  </div>
                </div>
              )}

              {isSummary && (
                <div className="mt-6">
                  <p className="text-mute">
                    {contact.name}, este es el estimado para {contact.business}. Envíalo y te contactamos para tu
                    diagnóstico gratis.
                  </p>
                  <div className="mt-6 rounded-2xl border border-line bg-ink p-5 md:p-6">
                    <Estimate choices={choices} />
                  </div>
                  {notice && (
                    <p role="alert" className="mt-4 rounded-xl border border-flame/40 bg-flame/10 px-4 py-3 text-sm text-paper">
                      {notice}
                    </p>
                  )}
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <Button href={waLink} external fullWidth size="lg" onClick={clearDraft}>
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      Enviar por WhatsApp
                    </Button>
                    <Button variant="outline" fullWidth size="lg" loading={sending} onClick={sendByEmail}>
                      {!sending && <Mail className="h-4 w-4" aria-hidden="true" />}
                      {sending ? "Enviando cotización" : "Recibir por correo"}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navegación */}
        <div className="border-t border-line p-5 md:px-8">
          {!isSummary && (
            <div className="mb-4 border-b border-line pb-4 lg:hidden">
              <Estimate choices={choices} compact />
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            {step > 0 ? (
              <Button variant="ghost" magnetic={false} onClick={() => go(step - 1)} className="-ml-4">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {isSummary ? "Editar respuestas" : "Atrás"}
              </Button>
            ) : (
              <span />
            )}
            {!isSummary && (
              <Button onClick={next} magnetic={false}>
                {step === SUMMARY - 1 ? "Ver mi cotización" : "Continuar"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Total en vivo (escritorio) */}
      <aside aria-label="Tu estimado" className={`card hidden p-6 lg:sticky lg:top-24 ${isSummary ? "" : "lg:block"}`}>
        <Sub className="mb-5 text-lg tracking-tight">Tu estimado</Sub>
        <Estimate choices={choices} />
        <p className="sr-only" aria-live="polite">
          Total estimado {rangeText(quote)}
        </p>
      </aside>
    </div>
  );
}
