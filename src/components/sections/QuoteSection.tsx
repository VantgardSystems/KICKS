import { QuoteWizard } from "@/components/quote/QuoteWizard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function QuoteSection() {
  return (
    <section id="cotizar" aria-labelledby="cotizar-titulo" className="section relative overflow-hidden bg-coal">
      <div aria-hidden="true" className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <div className="container-x relative">
        <SectionHeading
          id="cotizar-titulo"
          eyebrow="Cotizador"
          title="Calcula tu página en un minuto"
          description="Responde seis preguntas y ve el estimado en vivo. Sin registrarte y sin compromiso."
        />
        <div className="mt-12 md:mt-16">
          <QuoteWizard />
        </div>
      </div>
    </section>
  );
}
