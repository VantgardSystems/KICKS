"use client";

import Script from "next/script";

/**
 * Analítica: solo se monta si el visitante acepta las cookies (lo decide CookieBanner).
 * Configura UNA de estas variables en Netlify:
 * - NEXT_PUBLIC_PLAUSIBLE_DOMAIN: tu dominio en Plausible (sin cookies, más privado).
 * - NEXT_PUBLIC_GA_ID: el ID de medición de Google Analytics 4 (G-XXXXXXX).
 * Sin ninguna, no se carga nada.
 */
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const analyticsConfigured = Boolean(plausibleDomain || gaId);

export function AnalyticsScripts() {
  if (plausibleDomain) {
    return <Script src="https://plausible.io/js/script.js" data-domain={plausibleDomain} strategy="afterInteractive" />;
  }
  if (gaId && /^G-[A-Z0-9]+$/.test(gaId)) {
    return (
      <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
        </Script>
      </>
    );
  }
  return null;
}
