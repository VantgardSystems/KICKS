import type { Metadata } from "next";
import { QuoteWizard } from "@/components/quote/QuoteWizard";
import { plans } from "@/config/site";

const title = "Cotiza tu página web";
const description =
  "Cotizador en línea de Vantgard Systems: elige tipo de proyecto, tamaño y extras, y recibe un estimado en MXN al instante. Demo sin anticipo.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/cotizar" },
  openGraph: { title, description, url: "/cotizar" },
  twitter: { card: "summary_large_image", title, description },
};

type Props = { searchParams: Promise<{ plan?: string }> };

export default async function QuotePage({ searchParams }: Props) {
  const { plan } = await searchParams;
  const initialPlan = plans.some((p) => p.id === plan) ? plan : undefined;

  return (
    <div className="relative pt-28 pb-20 md:pt-36 md:pb-28">
      <div aria-hidden="true" className="bg-grid absolute inset-x-0 top-0 h-[480px] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_0%,black,transparent)]" />
      <div className="container-x relative">
        <p className="eyebrow">Cotizador</p>
        <h1 className="h-section mt-4 max-w-2xl">Cotiza tu página web</h1>
        <p className="mt-6 max-w-xl text-lg text-mute">
          Seis preguntas y tienes un estimado. El precio final se confirma tras tu diagnóstico gratis.
        </p>
        <div className="mt-12">
          <QuoteWizard initialPlan={initialPlan} headingLevel="h2" />
        </div>
      </div>
    </div>
  );
}
