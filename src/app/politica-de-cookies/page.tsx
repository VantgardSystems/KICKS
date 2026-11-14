import type { Metadata } from "next";
import Link from "next/link";
import { company } from "@/config/site";
import { CookieSettingsButton } from "@/components/layout/CookieSettingsButton";
import { LegalLayout, type LegalSection } from "@/components/legal/LegalLayout";

const title = "Política de cookies";
const description =
  "Política de cookies de Vantgard Systems: qué guardamos en tu navegador, para qué sirve y cómo aceptar, rechazar o desactivar la analítica.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/politica-de-cookies" },
  openGraph: { title, description, url: "/politica-de-cookies" },
};

const rows = [
  ["vg-consent", "Necesaria", "Recuerda si aceptaste o rechazaste la analítica.", "Hasta que la borres"],
  ["vg-quote-draft", "Necesaria", "Guarda el avance del cotizador (sin datos personales).", "Hasta que envíes o reinicies"],
  ["vg-chat", "Necesaria", "Mantiene la conversación con el asistente mientras navegas.", "Hasta cerrar la pestaña"],
  ["Vercel Analytics", "Analítica (opcional)", "Cuenta visitas de forma anónima, sin identificarte.", "Solo si la aceptas"],
  ["Vercel Speed Insights", "Analítica (opcional)", "Mide la velocidad de carga del sitio.", "Solo si la aceptas"],
];

const sections: LegalSection[] = [
  {
    id: "que-son",
    title: "Qué son las cookies",
    content: (
      <p>
        Son pequeños archivos o datos que un sitio guarda en tu navegador para recordar información entre visitas.
        Aquí usamos sobre todo el almacenamiento local del navegador, que funciona de forma parecida. En esta
        política llamamos «cookies» a ambas cosas.
      </p>
    ),
  },
  {
    id: "cuales",
    title: "Qué usamos en este sitio",
    content: (
      <>
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-coal text-paper">
              <tr>
                {["Nombre", "Tipo", "Para qué sirve", "Duración"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r[0]} className="border-t border-line align-top">
                  <th scope="row" className="px-4 py-3 font-mono text-xs font-normal text-paper">
                    {r[0]}
                  </th>
                  <td className="px-4 py-3">{r[1]}</td>
                  <td className="px-4 py-3">{r[2]}</td>
                  <td className="px-4 py-3">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4">No usamos cookies de publicidad ni vendemos información a anunciantes.</p>
      </>
    ),
  },
  {
    id: "consentimiento",
    title: "Tu elección",
    content: (
      <>
        <p>
          La primera vez que entras ves un banner con tres opciones: Aceptar, Rechazar y Configurar. La analítica{" "}
          <strong>no se carga</strong> hasta que la aceptas. Si la rechazas, el sitio funciona igual.
        </p>
        <p>
          Puedes cambiar tu elección cuando quieras:{" "}
          <CookieSettingsButton className="text-flame-hi underline underline-offset-4" />.
        </p>
      </>
    ),
  },
  {
    id: "desactivar",
    title: "Cómo desactivarlas desde tu navegador",
    content: (
      <>
        <p>También puedes borrar o bloquear cookies y datos de sitios desde la configuración de tu navegador:</p>
        <ul>
          <li>
            <strong>Chrome:</strong> Configuración, Privacidad y seguridad, Cookies y otros datos de sitios.
          </li>
          <li>
            <strong>Safari:</strong> Ajustes, Safari, Privacidad y seguridad.
          </li>
          <li>
            <strong>Firefox:</strong> Ajustes, Privacidad y seguridad, Cookies y datos del sitio.
          </li>
          <li>
            <strong>Edge:</strong> Configuración, Cookies y permisos del sitio.
          </li>
        </ul>
        <p>Si bloqueas todo, el sitio no recordará tu elección ni el avance del cotizador.</p>
      </>
    ),
  },
  {
    id: "mas",
    title: "Más información",
    content: (
      <p>
        El uso de tus datos personales se explica en el{" "}
        <Link href="/aviso-de-privacidad">aviso de privacidad integral</Link>. Si tienes dudas, escríbenos a{" "}
        <a href={`mailto:${company.legal.privacyEmail}`}>{company.legal.privacyEmail}</a>.
      </p>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Política de cookies"
      path="/politica-de-cookies"
      sections={sections}
      intro={<p>Aquí te explicamos qué guarda este sitio en tu navegador y cómo puedes controlarlo.</p>}
    />
  );
}
