"use client";

import { Clock, Mail, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { company, contactServices, whatsappUrl } from "@/config/site";
import { PrivacyLabel, PrivacyNotice } from "@/components/legal/PrivacyNotice";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, useForm } from "@/components/ui/Field";
import { WithPending } from "@/components/ui/Pending";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const DEFAULT_SERVICE = contactServices[contactServices.length - 1];

export function Contact() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [service, setService] = useState<string>(DEFAULT_SERVICE);
  const [promos, setPromos] = useState(false);
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const form = useForm(
    { name: "", business: "", whatsapp: "", email: "", message: "", privacy: false as boolean },
    ["name", "business", "whatsapp", "email", "message", "privacy"],
  );
  const v = form.values;

  const waMessage = () =>
    [
      "Hola, les escribo desde la página de Vantgard Systems.",
      `Nombre: ${v.name}`,
      `Negocio: ${v.business}`,
      `WhatsApp: ${v.whatsapp}`,
      `Correo: ${v.email}`,
      `Me interesa: ${service}`,
      "",
      String(v.message),
    ].join("\n");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.validateAll(formRef.current)) return;
    setSending(true);
    setNotice(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, service, promos, website }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        fallback?: string;
        error?: string;
        errors?: Record<string, string>;
      };
      if (data.ok) {
        router.push("/gracias?tipo=contacto");
        return;
      }
      if (data.errors) {
        form.setErrors(data.errors);
        setNotice("Revisa los campos marcados y envía de nuevo.");
      } else if (data.fallback === "whatsapp") {
        const win = window.open(whatsappUrl(waMessage()), "_blank", "noopener,noreferrer");
        setNotice(
          data.error ??
            (win
              ? "El correo no está disponible en este momento. Abrimos WhatsApp con tu mensaje listo para enviar."
              : "El correo no está disponible en este momento. Usa el botón de WhatsApp: tu mensaje ya va escrito."),
        );
      } else {
        setNotice(data.error ?? "No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos por WhatsApp.");
      }
    } catch {
      setNotice("No hay conexión con el servidor. Revisa tu internet e intenta de nuevo, o escríbenos por WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  const text = (name: "name" | "business" | "whatsapp" | "email") => ({
    value: String(v[name]),
    onChange: (e: { target: { value: string } }) => form.set(name, e.target.value),
    onBlur: () => form.blur(name),
    required: true,
  });

  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="section bg-coal">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            id="contacto-titulo"
            eyebrow="Contacto"
            title="Cuéntanos de tu negocio"
            description="Te respondemos en menos de 2 horas dentro de nuestro horario. El diagnóstico es gratis."
          />
          <Reveal delay={0.1}>
            <ul className="mt-10 divide-y divide-line border-y border-line">
              <li>
                <a
                  href={whatsappUrl("Hola, quiero información sobre una página web.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-16 items-center gap-4 py-4"
                >
                  <MessageCircle className="h-5 w-5 shrink-0 text-flame" aria-hidden="true" />
                  <span>
                    <span className="block text-sm text-mute">WhatsApp</span>
                    <span className="underline-offset-4 group-hover:underline">
                      <WithPending text={company.whatsappDisplay} />
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${company.email}`} className="group flex min-h-16 items-center gap-4 py-4">
                  <Mail className="h-5 w-5 shrink-0 text-flame" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-sm text-mute">Correo</span>
                    <span className="break-all underline-offset-4 group-hover:underline">{company.email}</span>
                  </span>
                </a>
              </li>
              <li className="flex min-h-16 items-center gap-4 py-4">
                <Clock className="h-5 w-5 shrink-0 text-flame" aria-hidden="true" />
                <span>
                  <span className="block text-sm text-mute">Horario</span>
                  {company.hours}
                </span>
              </li>
            </ul>
            <ul className="mt-6 flex gap-2">
              {[
                ["Instagram", company.social.instagram],
                ["TikTok", company.social.tiktok],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 text-sm transition-colors hover:border-white/40"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <form ref={formRef} onSubmit={onSubmit} noValidate className="rounded-[24px] border border-line bg-ink p-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] md:p-8">
            <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
              <Field label="Nombre" name="name" idPrefix="c" error={form.errors.name}>
                {(p) => <input {...p} {...text("name")} type="text" autoComplete="name" />}
              </Field>
              <Field label="Negocio" name="business" idPrefix="c" error={form.errors.business}>
                {(p) => <input {...p} {...text("business")} type="text" autoComplete="organization" />}
              </Field>
              <Field label="WhatsApp" name="whatsapp" idPrefix="c" error={form.errors.whatsapp} hint="10 dígitos.">
                {(p) => <input {...p} {...text("whatsapp")} type="tel" inputMode="tel" autoComplete="tel-national" />}
              </Field>
              <Field label="Correo" name="email" idPrefix="c" error={form.errors.email}>
                {(p) => <input {...p} {...text("email")} type="email" inputMode="email" autoComplete="email" />}
              </Field>
              <div className="sm:col-span-2">
                <Field label="Servicio de interés" name="service" idPrefix="c">
                  {(p) => (
                    <select {...p} value={service} onChange={(e) => setService(e.target.value)}>
                      {contactServices.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Mensaje"
                  name="message"
                  idPrefix="c"
                  error={form.errors.message}
                  hint="¿Qué vendes y qué te gustaría que hiciera tu página?"
                >
                  {(p) => (
                    <textarea
                      {...p}
                      rows={4}
                      required
                      maxLength={2000}
                      value={String(v.message)}
                      onChange={(e) => form.set("message", e.target.value)}
                      onBlur={() => form.blur("message")}
                      className="field min-h-28 resize-y"
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
                idPrefix="c"
                required
                checked={Boolean(v.privacy)}
                onChange={(val) => form.set("privacy", val)}
                error={form.errors.privacy}
              >
                <PrivacyLabel />
              </Checkbox>
              <Checkbox name="promos" idPrefix="c" checked={promos} onChange={setPromos}>
                Quiero recibir promociones y novedades. <span className="text-mute/80">Opcional.</span>
              </Checkbox>
            </div>

            {notice && (
              <p role="alert" className="mt-5 rounded-xl border border-flame/40 bg-flame/10 px-4 py-3 text-sm text-paper">
                {notice}
              </p>
            )}

            <div className="mt-6">
              <Button type="submit" size="lg" fullWidth loading={sending}>
                {sending ? "Enviando mensaje" : "Enviar mensaje"}
              </Button>
            </div>
            <PrivacyNotice purpose="responder tu mensaje y darte seguimiento" className="mt-5" />
          </form>
        </Reveal>
      </div>
    </section>
  );
}
