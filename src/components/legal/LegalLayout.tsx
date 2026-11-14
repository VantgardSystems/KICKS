import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { company } from "@/config/site";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface Props {
  title: string;
  path: string;
  intro: ReactNode;
  sections: LegalSection[];
}

const months = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${months[m - 1]} de ${y}`;
}

/** Plantilla de páginas legales: índice lateral y líneas de ~70 caracteres. */
export function LegalLayout({ title, path, intro, sections }: Props) {
  return (
    <div className="pt-28 pb-20 md:pt-36 md:pb-28">
      <JsonLd data={breadcrumbSchema([{ name: "Inicio", path: "/" }, { name: title, path }])} />
      <div className="container-x">
        <nav aria-label="Ruta de navegación">
          <ol className="flex items-center gap-1 text-sm text-mute">
            <li className="flex items-center gap-1">
              <Link href="/" className="rounded py-2 underline-offset-4 hover:text-paper hover:underline">
                Inicio
              </Link>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </li>
            <li aria-current="page" className="py-2 text-paper">
              {title}
            </li>
          </ol>
        </nav>

        <header className="mt-6 border-b border-line pb-10">
          <h1 className="h-section max-w-3xl">{title}</h1>
          <p className="mt-5 font-mono text-xs text-mute">
            Última actualización:{" "}
            <time dateTime={company.legal.lastUpdated}>{formatDate(company.legal.lastUpdated)}</time>
          </p>
        </header>

        <div className="mt-10 grid gap-12 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Índice" className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="mb-3 font-mono text-xs tracking-wider text-paper">En esta página</h2>
            <ol className="border-l border-line">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-ml-px flex gap-3 border-l border-transparent py-1.5 pl-4 text-sm text-mute transition-colors hover:border-flame hover:text-paper"
                  >
                    <span className="font-mono text-xs leading-5 text-mute/70">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="prose-legal">
            <div className="text-lg text-paper/90">{intro}</div>
            {sections.map((s, i) => (
              <section key={s.id} aria-labelledby={s.id}>
                <h2 id={s.id}>
                  {i + 1}. {s.title}
                </h2>
                {s.content}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Marca visible para datos que aún debes completar. */
export function P({ children }: { children: ReactNode }) {
  return <mark className="pending">{children}</mark>;
}
