"use client";

import { LabPanel } from "@/components/lab/LabPanel";
import { LabProvider } from "@/components/lab/LabContext";
import { QuoteWizard } from "@/components/quote/QuoteWizard";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Story } from "@/components/sections/Story";
import { HeroV2 } from "@/components/v2/HeroV2";
import { NavbarV2 } from "@/components/v2/NavbarV2";
import {
  CtaBand,
  FooterV2,
  Heading,
  MarqueeV2,
  PortfolioV2,
  PricingV2,
  ProcessV2,
  ServicesV2,
} from "@/components/v2/Sections";
import { useTone } from "@/components/v2/tone";

function QuoteV2() {
  const tone = useTone("quote");
  return (
    <section id="cotizar" aria-labelledby="cotizar-titulo" className={`${tone} section`}>
      <div className="container-x">
        <Heading
          id="cotizar-titulo"
          label="Cotizador"
          title="Calcula tu página en un minuto"
          kw="un minuto"
          text="Responde seis preguntas y ve el estimado en vivo. Sin registrarte y sin compromiso."
        />
        <div className="mt-14 md:mt-20">
          <QuoteWizard />
        </div>
      </div>
    </section>
  );
}

function Toned({ name, children }: { name: "story" | "faq" | "contact"; children: React.ReactNode }) {
  const tone = useTone(name);
  return <div className={tone}>{children}</div>;
}

export function LabHome({ fontVars }: { fontVars: string }) {
  return (
    <LabProvider>
      {(state) => (
        <div
          className={`lab ${fontVars}`}
          data-type={state.type}
          data-cards={state.cards}
          data-btn={state.btn}
          data-bg={state.bg}
          data-rhythm={state.rhythm}
          data-orange={state.orange}
        >
          <NavbarV2 />
          <HeroV2 />
          <MarqueeV2 />
          <ServicesV2 />
          <PortfolioV2 />
          <ProcessV2 />
          <Toned name="story">
            <Story />
          </Toned>
          <PricingV2 />
          <QuoteV2 />
          <Toned name="faq">
            <Faq />
          </Toned>
          <CtaBand />
          <Toned name="contact">
            <Contact />
          </Toned>
          <FooterV2 />
          <LabPanel />
        </div>
      )}
    </LabProvider>
  );
}
