import Link from "next/link";
import { company, nav, services, whatsappUrl } from "@/config/site";
import { Logo } from "@/components/ui/Logo";
import { CookieSettingsButton } from "./CookieSettingsButton";
import { Year } from "./Year";

const legalLinks = [
  { label: "Aviso de privacidad", href: "/aviso-de-privacidad" },
  { label: "Términos y condiciones", href: "/terminos-y-condiciones" },
  { label: "Política de cookies", href: "/politica-de-cookies" },
];

const linkCls = "inline-block py-1.5 text-sm text-mute transition-colors hover:text-paper";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="container-x py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_repeat(4,1fr)] lg:gap-8">
          <div>
            <Link href="/" aria-label="VANTGARD SYSTEMS, ir al inicio" className="inline-block rounded-md">
              <Logo />
            </Link>
            <p className="mt-5 max-w-xs text-sm text-mute">
              Páginas web que atienden, agendan y venden por tu negocio. Demo sin anticipo.
            </p>
            <ul className="mt-6 flex gap-2">
              <li>
                <a
                  href={company.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm text-mute transition-colors hover:border-white/30 hover:text-paper"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={company.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm text-mute transition-colors hover:border-white/30 hover:text-paper"
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Servicios">
            <h2 className="mb-3 font-mono text-xs tracking-wider text-paper">Servicios</h2>
            <ul>
              {services.map((s) => (
                <li key={s.id}>
                  <Link href="/#servicios" className={linkCls}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Empresa">
            <h2 className="mb-3 font-mono text-xs tracking-wider text-paper">Empresa</h2>
            <ul>
              {nav
                .filter((n) => n.label !== "Servicios")
                .map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className={linkCls}>
                      {n.label}
                    </Link>
                  </li>
                ))}
              <li>
                <Link href="/#faq" className={linkCls}>
                  Preguntas frecuentes
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h2 className="mb-3 font-mono text-xs tracking-wider text-paper">Legal</h2>
            <ul>
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton className={linkCls} />
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="mb-3 font-mono text-xs tracking-wider text-paper">Contacto</h2>
            <ul>
              <li>
                <a
                  href={whatsappUrl("Hola, quiero información sobre una página web.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkCls}
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${company.email}`} className={`${linkCls} break-all`}>
                  {company.email}
                </a>
              </li>
              <li className="py-1.5 text-sm text-mute">{company.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 text-sm text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <Year /> {company.name}. Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-2">
            <span aria-hidden="true" className="inline-flex h-2.5 w-4 overflow-hidden rounded-[2px]">
              <span className="w-1/3 bg-[#006847]" />
              <span className="w-1/3 bg-white" />
              <span className="w-1/3 bg-[#CE1126]" />
            </span>
            Hecho en México
          </p>
        </div>
      </div>
    </footer>
  );
}
