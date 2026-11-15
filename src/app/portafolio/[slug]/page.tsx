import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { SpecCard } from "@/components/v2/SpecCard";
import { projects, whatsappUrl } from "@/config/site";
import { JsonLd } from "@/components/layout/JsonLd";
import { Button } from "@/components/ui/Button";
import { LaptopMockup, PhoneMockup } from "@/components/ui/DeviceMockups";
import { breadcrumbSchema } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const title = `${project.name}: ${project.industry}`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/portafolio/${project.slug}` },
    openGraph: { title, description: project.summary, url: `/portafolio/${project.slug}`, type: "article" },
    twitter: { card: "summary_large_image", title, description: project.summary },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  const crumbs = [
    { name: "Inicio", path: "/" },
    { name: "Portafolio", path: "/#portafolio" },
    { name: project.name, path: `/portafolio/${project.slug}` },
  ];

  return (
    <article className="pt-28 md:pt-36">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <div className="container-x">
        <nav aria-label="Ruta de navegación">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-mute">
            {crumbs.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1">
                {i < crumbs.length - 1 ? (
                  <>
                    <Link href={c.path} className="rounded py-2 underline-offset-4 hover:text-paper hover:underline">
                      {c.name}
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </>
                ) : (
                  <span aria-current="page" className="py-2 text-paper">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <header className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="t-label opacity-70">{project.industry}</p>
            <h1 className="t-display mt-4">{project.name}</h1>
            <p className="t-lead mt-6 max-w-xl text-[#ADB5BD]">{project.summary}</p>
          </div>
          <div className="flex flex-col gap-6 lg:items-end">
            <dl className="grid grid-cols-3 gap-6 border-t border-white/12 pt-5 lg:w-full">
              <div>
                <dt className="t-label">Industria</dt>
                <dd className="mt-1 text-[15px] text-[#ADB5BD]">{project.industry}</dd>
              </div>
              <div>
                <dt className="t-label">Año</dt>
                <dd className="num mt-1 text-[15px]">{project.year}</dd>
              </div>
              <div>
                <dt className="t-label">Stack</dt>
                <dd className="mt-1 text-[15px] text-[#ADB5BD]">{project.stack}</dd>
              </div>
            </dl>
            <ul className="flex flex-wrap gap-2 lg:justify-end" aria-label="Incluye">
              {project.tags.map((tag) => (
                <li key={tag} className="spec-pill border-white/20 text-[#ADB5BD]">
                  {tag}
                </li>
              ))}
            </ul>
            {project.demoUrl ? (
              <Button href={project.demoUrl} external size="lg">
                Ver demo en vivo
              </Button>
            ) : (
              <Button
                href={whatsappUrl(`Hola, quiero ver la demo en vivo de ${project.name}.`)}
                external
                size="lg"
              >
                Pedir la demo en vivo
              </Button>
            )}
          </div>
        </header>

        <div className="film relative isolate mt-12 overflow-hidden rounded-[28px] px-5 pt-10 md:mt-16 md:px-16 md:pt-16">
          <Image src="/images/hero-dunes.webp" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-60" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0B0C0E]/30 to-[#0B0C0E]/80" />
          <div className="relative mx-auto max-w-4xl pr-[10%]">
            <LaptopMockup>
              <Image
                src={project.desktop}
                alt={`Sitio de ${project.name} en escritorio`}
                fill
                preload
                fetchPriority="high"
                sizes="(min-width: 1024px) 860px, 90vw"
                className="object-cover object-top"
              />
            </LaptopMockup>
            <PhoneMockup className="absolute right-0 bottom-[-4%] w-[22%]">
              <Image
                src={project.mobile}
                alt={`Sitio de ${project.name} en celular`}
                fill
                sizes="200px"
                className="object-cover object-top"
              />
            </PhoneMockup>
          </div>
          <div className="h-10 md:h-16" />
        </div>

        <div className="mt-16 grid gap-4 md:mt-24 lg:grid-cols-3">
          <SpecCard as="section" interactive={false} titleAs="h2" title="El reto" summary={project.challenge} className="[&_.spec-value]:text-[17px]" />
          <SpecCard as="section" interactive={false} titleAs="h2" title="La solución" summary={project.solution} className="[&_.spec-value]:text-[17px]" />
          <SpecCard as="section" featured interactive={false} titleAs="h2" title="Lo que quedó funcionando">
            <ul className="mt-5 space-y-3">
              {project.results.map((r) => (
                <li key={r} className="flex gap-3 text-[17px] leading-snug">
                  <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                  {r}
                </li>
              ))}
            </ul>
          </SpecCard>
        </div>
      </div>

      <div className="film relative isolate mt-20 overflow-hidden md:mt-28">
        <Image src="/images/cta-bg.webp" alt="" fill sizes="100vw" className="-z-10 object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#0B0C0E]/55" />
        <div className="container-x flex flex-col gap-8 py-20 md:flex-row md:items-end md:justify-between md:py-28">
          <div>
            <h2 className="t-section max-w-[14ch]">
              ¿Quieres algo así para tu <span className="kw">negocio</span>?
            </h2>
            <p className="t-lead mt-4 text-[#ADB5BD]">Te hacemos una demo sin anticipo.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/cotizar" size="lg">
              Cotiza tu página
            </Button>
            <Button href={`/portafolio/${next.slug}`} size="lg" variant="outline">
              Siguiente: {next.name}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div className="container-x border-t border-white/12 py-6">
          <Link href="/#portafolio" className="inline-flex min-h-11 items-center gap-2 text-sm text-mute hover:text-paper">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al portafolio
          </Link>
        </div>
      </div>
    </article>
  );
}
