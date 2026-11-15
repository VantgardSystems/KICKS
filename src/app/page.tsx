import { JsonLd } from "@/components/layout/JsonLd";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { StoryV2 } from "@/components/v2/StoryV2";
import { LazyQuoteWizard } from "@/components/quote/LazyQuoteWizard";
import { HeroV2 } from "@/components/v2/HeroV2";
import { CtaBand, Heading, MarqueeV2, PortfolioV2, PricingV2, ProcessV2, ServicesV2 } from "@/components/v2/Sections";
import { faqSchema, localBusinessSchema, plansSchema, servicesSchema } from "@/lib/seo";

function QuoteSection() {
  return (
    <section id="cotizar" aria-labelledby="cotizar-titulo" className="tone-dark section">
      <div className="container-x">
        <Heading
          id="cotizar-titulo"
          label="Cotizador"
          title="Calcula tu página en un minuto"
          kw="un minuto"
          text="Responde seis preguntas y ve el estimado en vivo. Sin registrarte y sin compromiso."
        />
        <div className="mt-14 md:mt-20">
          <LazyQuoteWizard />
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroV2 />
      <MarqueeV2 />
      <ServicesV2 />
      <PortfolioV2 />
      <ProcessV2 />
      <StoryV2 />
      <PricingV2 />
      <QuoteSection />
      <div className="tone-dark">
        <Faq />
      </div>
      <CtaBand />
      <div className="tone-dark">
        <Contact />
      </div>
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={servicesSchema()} />
      <JsonLd data={plansSchema()} />
      <JsonLd data={faqSchema()} />
    </>
  );
}
