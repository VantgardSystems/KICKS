import { company, faq, plans, pricing, services } from "@/config/site";

const abs = (path: string) => `${company.url}${path}`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": abs("/#organizacion"),
    name: company.name,
    url: company.url,
    logo: abs("/icon-512.png"),
    email: company.email,
    description: company.description,
    sameAs: [company.social.instagram, company.social.tiktok],
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": abs("/#negocio"),
    name: company.name,
    url: company.url,
    image: abs("/opengraph-image"),
    email: company.email,
    description: company.description,
    areaServed: { "@type": "Country", name: "México" },
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    parentOrganization: { "@id": abs("/#organizacion") },
  };
}

export function servicesSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: s.description,
        provider: { "@id": abs("/#organizacion") },
        areaServed: "MX",
        offers: {
          "@type": "Offer",
          priceCurrency: pricing.currency,
          price: s.from,
          description: `Desde $${s.from} ${pricing.currency}${s.fromSuffix ?? ""}`,
        },
      },
    })),
  };
}

export function plansSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Planes de Vantgard Systems",
    itemListElement: plans.map((p) => ({
      "@type": "Offer",
      name: p.name,
      description: p.summary,
      priceCurrency: pricing.currency,
      price: p.price,
    })),
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}
