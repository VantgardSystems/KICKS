import type { MetadataRoute } from "next";
import { company } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/gracias"] }],
    sitemap: `${company.url}/sitemap.xml`,
    host: company.url,
  };
}
