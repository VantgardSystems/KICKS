import type { MetadataRoute } from "next";
import { company, projects } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(company.legal.lastUpdated);
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly") => ({
    url: `${company.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });
  return [
    page("/", 1, "weekly"),
    page("/cotizar", 0.9, "monthly"),
    ...projects.map((p) => page(`/portafolio/${p.slug}`, 0.7, "monthly")),
    page("/aviso-de-privacidad", 0.2, "yearly"),
    page("/terminos-y-condiciones", 0.2, "yearly"),
    page("/politica-de-cookies", 0.2, "yearly"),
  ];
}
