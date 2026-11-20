import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://plausible.io https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self' data:",
  `connect-src 'self' https://plausible.io https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com${isDev ? " ws:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

// Plantilla inmobiliaria Harborlux (public/demos/harborlux): sitio estático que carga el hero
// desde sus CDN, el mapa de OpenStreetMap y visores 360° en iframe, así que lleva su propia CSP.
// Next aplica la última regla que coincide.
const harborluxCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://images.higgs.ai",
  "media-src 'self' https://d8j0ntlcm91z4.cloudfront.net",
  "font-src 'self' https://fonts.gstatic.com",
  "frame-src https://www.openstreetmap.org https://my.matterport.com https://kuula.co",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    const demoHeaders = [{ key: "Content-Security-Policy", value: harborluxCsp }];
    return [
      { source: "/(.*)", headers: securityHeaders },
      { source: "/demos/harborlux/:path*", headers: demoHeaders },
    ];
  },
  // La plantilla usa rutas relativas (css/, js/, img/): se redirige a su carpeta en lugar de reescribir
  async redirects() {
    return [{ source: "/harborlux", destination: "/demos/harborlux/index.html", permanent: false }];
  },
};

export default nextConfig;
