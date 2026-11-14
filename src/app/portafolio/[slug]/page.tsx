import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ChevronRight } from "lucide-react";
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
            <p className="eyebrow">{project.industry}</p>
            <h1 className="h-display mt-4">{project.name}</h1>
            <p className="mt-6 max-w-xl text-xl text-mute">{project.summary}</p>
          </div>
          <div className="flex flex-col gap-6 lg:items-end">
            <ul className="flex flex-wrap gap-2 lg:justify-end" aria-label="Incluye">
              {project.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-line-strong px-3 py-1 font-mono text-xs text-mute">
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

        <div className="relative mt-12 overflow-hidden rounded-[24px] border border-line bg-coal px-5 pt-10 md:mt-16 md:px-16 md:pt-16">
          <div aria-hidden="true" className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
          <div aria-hidden="true" className="absolute -top-40 left-1/2 h-80 w-[70%] -translate-x-1/2 rounded-full bg-flame/15 blur-3xl" />
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

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-3 lg:gap-16">
          <section aria-labelledby="reto">
            <h2 id="reto" className="text-2xl">
              El reto
            </h2>
            <p className="mt-4 text-lg text-mute">{project.challenge}</p>
          </section>
          <section aria-labelledby="solucion">
            <h2 id="solucion" className="text-2xl">
              La solución
            </h2>
            <p className="mt-4 text-lg text-mute">{project.solution}</p>
          </section>
          <section aria-labelledby="resultado">
            <h2 id="resultado" className="text-2xl">
              Lo que quedó funcionando
            </h2>
            <ul className="mt-4 space-y-3">
              {project.results.map((r) => (
                <li key={r} className="flex gap-3 text-lg text-paper">
                  <Check className="mt-1.5 h-4 w-4 shrink-0 text-flame" strokeWidth={3} aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="mt-20 border-t border-line bg-coal md:mt-28">
        <div className="container-x flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div>
            <h2 className="h-section max-w-xl">¿Quieres algo así para tu negocio?</h2>
            <p className="mt-4 text-lg text-mute">Te hacemos una demo sin anticipo.</p>
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
        <div className="container-x border-t border-line py-6">
          <Link href="/#portafolio" className="inline-flex min-h-11 items-center gap-2 text-sm text-mute hover:text-paper">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al portafolio
          </Link>
        </div>
      </div>
    </article>
  );
}
