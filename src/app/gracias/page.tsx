import type { Metadata } from "next";
import { Check } from "lucide-react";
import { company, whatsappUrl } from "@/config/site";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Gracias, recibimos tu mensaje",
  description: "Recibimos tu solicitud. El equipo de Vantgard Systems te contactará pronto.",
  alternates: { canonical: "/gracias" },
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ tipo?: string }> };

export default async function ThanksPage({ searchParams }: Props) {
  const { tipo } = await searchParams;
  const isQuote = tipo === "cotizacion";

  return (
    <div className="relative grid min-h-[100svh] place-items-center overflow-hidden px-5 pt-24 pb-16">
      <div aria-hidden="true" className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div aria-hidden="true" className="absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-flame/15 blur-3xl" />
      <div className="relative max-w-xl text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-flame/50 bg-flame/10">
          <Check className="h-7 w-7 text-flame" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <h1 className="h-section mt-8">{isQuote ? "Cotización enviada" : "Mensaje enviado"}</h1>
        <p className="mt-6 text-lg text-mute">
          {isQuote
            ? "Te enviamos una copia a tu correo. Te escribimos por WhatsApp para agendar tu diagnóstico gratis."
            : "Gracias por escribirnos. Te respondemos en menos de 2 horas dentro de nuestro horario."}
        </p>
        <p className="mt-2 font-mono text-xs text-mute">{company.hours}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/#portafolio" size="lg">
            Ver proyectos
          </Button>
          <Button href={whatsappUrl("Hola, acabo de enviar mis datos desde la página.")} external variant="outline" size="lg">
            Escribir por WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
