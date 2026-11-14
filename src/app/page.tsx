import { JsonLd } from "@/components/layout/JsonLd";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Portfolio } from "@/components/sections/Portfolio";
import { Pricing } from "@/components/sections/Pricing";
import { Process } from "@/components/sections/Process";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { Services } from "@/components/sections/Services";
import { Story } from "@/components/sections/Story";
import { faqSchema, localBusinessSchema, plansSchema, servicesSchema } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Services />
      <Portfolio />
      <Process />
      <Story />
      <Pricing />
      <QuoteSection />
      <Faq />
      <Contact />
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={servicesSchema()} />
      <JsonLd data={plansSchema()} />
      <JsonLd data={faqSchema()} />
    </>
  );
}
