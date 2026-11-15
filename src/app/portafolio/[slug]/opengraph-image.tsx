import { projects } from "@/config/site";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Proyecto del portafolio de Vantgard Systems";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return renderOg({
    eyebrow: project ? `Portafolio / ${project.industry}` : "Portafolio",
    title: project?.name ?? "Proyectos de Vantgard Systems",
  });
}
