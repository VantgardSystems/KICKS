# Vantgard Systems — sitio oficial

Sitio de una página con cotizador, portafolio, agente IA y páginas legales.
Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion + Lenis.

## Verlo en tu computadora

```bash
npm install
cp .env.example .env.local   # llena las keys (opcional para probar)
npm run dev                  # http://localhost:3000
```

Sin keys todo funciona: el chat entra en **modo demo** y los formularios abren **WhatsApp** con el mensaje listo.

Otros comandos: `npm run build` (producción), `npm run start`, `npm run typecheck`.

## Dónde se edita cada cosa

**Todo el contenido está en un solo archivo: `src/config/site.ts`**

| Qué | Dónde en `site.ts` |
| --- | --- |
| WhatsApp, correo, horario, redes, datos legales | `company` |
| Titular y botones del hero | `hero` |
| Marquee de industrias | `industries` |
| Planes y precios | `plans`, `pricing` |
| Cotizador: tipos, extras, entrega, mantenimiento | `projectTypes`, `extras`, `bundles`, `delivery`, `maintenance` |
| Servicios | `services` |
| Portafolio | `projects`, `upcomingProjects` |
| Proceso | `processSteps` |
| Historia, valores, línea de tiempo, cifras | `story` |
| Preguntas frecuentes | `faq` |
| Agente IA: saludo, reglas, respuestas demo, límite de mensajes | `assistant` |

El cotizador, la sección de precios, el JSON-LD y el prompt del agente leen de ahí. Cambias un precio una vez y se actualiza en todos lados.

## Pendientes que debes completar

Busca `[PENDIENTE]` en `src/config/site.ts`. En el sitio se ven resaltados en naranja.

1. **WhatsApp**: `company.whatsapp` (solo dígitos con lada, ej. `5215512345678`) y `company.whatsappDisplay`.
2. **IVA**: `pricing.taxLabel`. Hoy dice `+ IVA`; cámbialo a `IVA incluido` si aplica.
3. **Razón social y domicilio**: `company.legal.businessName` y `company.legal.address`.
4. **Jurisdicción** (ciudad y estado): `company.legal.jurisdiction`.
5. **Redes**: confirma los usuarios en `company.social`.
6. **Historia**: año, ciudad y por qué nació (`story.origin`), fechas e hitos (`story.timeline`) y cifras (`story.stats`).
7. **Precios de extras y mantenimiento**: son una propuesta; ajústalos en `extras`, `maintenance` y `projectTypes`.
8. **Links de demos**: `demoUrl` de cada proyecto. Vacío = el botón pide la demo por WhatsApp.
9. **Capturas reales del portafolio**: reemplaza los archivos de `public/portfolio/` (mismo nombre).
10. **Dominio**: `NEXT_PUBLIC_SITE_URL` en Vercel.
11. **Revisión legal**: el aviso de privacidad, los términos y la política de cookies son un borrador completo. Pide a un abogado que los revise antes de publicar.
12. **Fecha de los textos legales**: `company.legal.lastUpdated` cuando los cambies.

## Variables de entorno

| Variable | Para qué | Si falta |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL pública (SEO, sitemap, Open Graph) | Usa `https://www.vantgardsystems.com` |
| `GEMINI_API_KEY` | Agente IA con Google Gemini | Chat en modo demo |
| `GEMINI_MODEL` | Modelo Flash a usar | `gemini-2.5-flash` |
| `RESEND_API_KEY` | Envío de correos | Los formularios abren WhatsApp |
| `CONTACT_FROM` | Remitente verificado en Resend | `onboarding@resend.dev` (solo pruebas) |
| `CONTACT_TO` | Correo que recibe los avisos | `erick.castro@vantgardsystems.com` |
| `GOOGLE_SITE_VERIFICATION` | Código de Search Console | No se agrega la meta |

Ninguna key llega al navegador: solo se usan en las rutas `/api/*`.

### Conseguir las keys

**Gemini (gratis)**
1. Entra a <https://aistudio.google.com/apikey> y crea una API key.
2. Pégala en `GEMINI_API_KEY`.
3. Si Google publica un Flash más nuevo, cambia `GEMINI_MODEL` sin tocar código.

**Resend**
1. Crea una cuenta en <https://resend.com> y agrega tu dominio en *Domains* (te da registros DNS para verificarlo).
2. Crea una API key en *API Keys* y pégala en `RESEND_API_KEY`.
3. Pon en `CONTACT_FROM` un remitente de tu dominio, por ejemplo `Vantgard Systems <web@vantgardsystems.com>`.

## Publicar en Vercel

1. Sube el repositorio a GitHub (ya está en `vantgardsystems/kicks`).
2. En <https://vercel.com/new> elige el repositorio. Vercel detecta Next.js; no cambies nada del build.
3. En *Environment Variables* agrega las de la tabla de arriba.
4. Da clic en **Deploy**.
5. En *Settings → Domains* conecta tu dominio y pon esa URL en `NEXT_PUBLIC_SITE_URL`. Vuelve a desplegar.
6. En el proyecto activa **Analytics** y **Speed Insights** (pestañas del mismo nombre). El sitio solo las carga si el visitante acepta las cookies.
7. En <https://search.google.com/search-console> agrega el dominio, copia el código de la meta de verificación en `GOOGLE_SITE_VERIFICATION` y envía `https://tu-dominio/sitemap.xml`.

## Imágenes

- `public/images/`: fondo del hero, servicios, proceso, historia y 404. Son renders 3D hechos por código (negro con luz naranja). Para cambiarlas, reemplaza el archivo con el mismo nombre en WebP.
- `public/portfolio/`: capturas del portafolio (**placeholders**). Formato: `nombre-desktop.webp` (1440×900) y `nombre-mobile.webp` (780×1688).
- Logo e iconos: `src/components/ui/Logo.tsx`, `src/app/icon.svg`, `src/app/favicon.ico`, `src/app/apple-icon.png`, `public/icon-192.png`, `public/icon-512.png`.
- Open Graph: se generan con código en `src/lib/og.tsx` (una por página).

## Estructura

```
src/
  config/site.ts          contenido editable
  app/                    páginas, rutas API, SEO (sitemap, robots, manifest, OG)
  components/
    layout/               navbar, footer, cookies, volver arriba
    sections/             hero, servicios, portafolio, proceso, historia, precios, FAQ, contacto
    quote/                wizard del cotizador
    chat/                 Asistente Vantgard
    legal/                plantilla legal y aviso simplificado
    ui/                   botón, campos, mockups, contador, etc.
  lib/                    precios, validación, correo, rate limit, prompt del agente, SEO
  fonts/                  Geist y Geist Mono recortadas a caracteres latinos
```

## Seguridad y privacidad

- Headers en `next.config.ts`: CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy y HSTS.
- Formularios y chat: validación en navegador y servidor, honeypot, verificación de origen y límite de peticiones por IP.
- El límite por IP vive en memoria de cada instancia. Frena abuso básico; para un límite global usa Upstash o Vercel KV en `src/lib/rate-limit.ts`.
- El chat tiene un máximo de mensajes por sesión (`assistant.maxMessagesPerSession`) para cuidar la cuota de Gemini.
- La analítica solo se carga si el visitante acepta en el banner de cookies.

## Calidad medida (build de producción, Lighthouse)

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
| --- | --- | --- | --- | --- |
| Inicio (móvil, 4G simulado) | 91 | 100 | 100 | 100 |
| Inicio (escritorio) | 99 | 100 | 100 | 100 |
| /cotizar (móvil) | 91 | 100 | 100 | 100 |
| /portafolio/solenna (móvil) | 95 | 100 | 100 | 100 |
| /aviso-de-privacidad (móvil) | 100 | 100 | 100 | 100 |
