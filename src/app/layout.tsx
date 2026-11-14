import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { company } from "@/config/site";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SiteExtras } from "@/components/layout/SiteExtras";
import { Logo } from "@/components/ui/Logo";
import { JsonLd } from "@/components/layout/JsonLd";
import { organizationSchema } from "@/lib/seo";

// Geist y Geist Mono (paquete "geist"), recortadas a caracteres latinos: 51 KB en vez de 140 KB.
const GeistSans = localFont({
  src: "../fonts/Geist-Variable-latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});
const GeistMono = localFont({
  src: "../fonts/GeistMono-Variable-latin.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: `${company.name} | ${company.tagline}`,
    template: `%s | ${company.name}`,
  },
  description: company.description,
  applicationName: company.name,
  authors: [{ name: company.name, url: company.url }],
  creator: company.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: company.name,
    url: "/",
    title: `${company.name} | ${company.tagline}`,
    description: company.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${company.name} | ${company.tagline}`,
    description: company.description,
  },
  robots: { index: true, follow: true },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="grain bg-ink text-paper">
        <div className="loader" aria-hidden="true">
          <div className="flex flex-col items-center gap-5">
            <Logo className="scale-125" />
            <span className="block h-px w-32 overflow-hidden bg-white/10">
              <span className="loader-bar block h-full w-full bg-flame" />
            </span>
          </div>
        </div>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[110] focus:rounded-full focus:bg-flame focus:px-5 focus:py-3 focus:font-medium focus:text-ink"
        >
          Saltar al contenido
        </a>
        <Providers>
          <Navbar />
          <main id="contenido" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <SiteExtras />
        </Providers>
        <JsonLd data={organizationSchema()} />
      </body>
    </html>
  );
}
