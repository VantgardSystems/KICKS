import type { Metadata } from "next";
import Link from "next/link";
import { company } from "@/config/site";
import { LegalLayout, type LegalSection } from "@/components/legal/LegalLayout";
import { WithPending } from "@/components/ui/Pending";

const title = "Aviso de privacidad";
const description =
  "Aviso de privacidad integral de Vantgard Systems: qué datos recabamos, para qué los usamos, con quién se comparten y cómo ejercer tus derechos ARCO.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/aviso-de-privacidad" },
  openGraph: { title, description, url: "/aviso-de-privacidad" },
};

const L = company.legal;
const mail = (
  <a href={`mailto:${L.privacyEmail}`}>{L.privacyEmail}</a>
);

const sections: LegalSection[] = [
  {
    id: "responsable",
    title: "Quién es el responsable de tus datos",
    content: (
      <>
        <p>
          <strong>
            <WithPending text={L.businessName} />
          </strong>
          , que opera con el nombre comercial <strong>{company.name}</strong> (en adelante, «{company.shortName}»),
          con domicilio en <WithPending text={L.address} />, es responsable del tratamiento de tus datos personales.
        </p>
        <p>Para cualquier tema de privacidad, escríbenos a {mail}.</p>
      </>
    ),
  },
  {
    id: "datos",
    title: "Qué datos personales recabamos",
    content: (
      <>
        <p>Recabamos solo los datos que tú nos das o que se generan al usar este sitio:</p>
        <ul>
          <li>
            <strong>Identificación y contacto:</strong> nombre, número de WhatsApp y correo electrónico.
          </li>
          <li>
            <strong>Datos de tu negocio:</strong> nombre del negocio, giro y lo que nos cuentes sobre tu proyecto.
          </li>
          <li>
            <strong>Mensajes:</strong> lo que escribes en los formularios, en el cotizador y en el chat con el
            Asistente Vantgard.
          </li>
          <li>
            <strong>Datos de navegación:</strong> páginas visitadas, tipo de dispositivo y navegador, país o región
            aproximada y medidas de velocidad del sitio. Solo se recaban con fines estadísticos si aceptas la
            analítica en el banner de cookies.
          </li>
        </ul>
        <p>
          <strong>No solicitamos datos personales sensibles</strong> (por ejemplo, de salud, creencias, origen
          étnico, datos biométricos o financieros). Te pedimos no compartirlos en los formularios ni en el chat. Si
          los recibimos por error, los eliminaremos.
        </p>
        <p>
          Este sitio está dirigido a personas mayores de edad que representan un negocio. No recabamos datos de
          menores de edad de forma intencional.
        </p>
      </>
    ),
  },
  {
    id: "finalidades",
    title: "Para qué usamos tus datos",
    content: (
      <>
        <h3>Finalidades necesarias</h3>
        <p>Son las que hacen posible la relación contigo:</p>
        <ul>
          <li>Responder tus mensajes y solicitudes de información.</li>
          <li>Preparar y enviarte cotizaciones.</li>
          <li>Agendar el diagnóstico y construir la demo de tu página.</li>
          <li>Prestar el servicio contratado, darte soporte y facturar.</li>
          <li>Cumplir obligaciones legales y atender requerimientos de autoridad.</li>
        </ul>
        <h3>Finalidades que requieren tu consentimiento</h3>
        <p>No son necesarias para darte el servicio:</p>
        <ul>
          <li>Enviarte promociones, novedades y contenido de {company.name}.</li>
          <li>Medir de forma estadística el uso del sitio para mejorarlo.</li>
        </ul>
        <p>
          <strong>Cómo negarte:</strong> las promociones solo se envían si marcas la casilla opcional en los
          formularios; puedes dejarla sin marcar. Si ya la marcaste y cambias de opinión, escribe a {mail} con el
          asunto «No promociones». Para la analítica, elige «Rechazar» en el banner de cookies o cambia tu elección
          en «Configurar cookies», al pie de cada página. Negarte no afecta el servicio que te damos.
        </p>
      </>
    ),
  },
  {
    id: "terceros",
    title: "Con quién compartimos tus datos",
    content: (
      <>
        <p>
          No vendemos ni rentamos tus datos. Para operar el sitio usamos proveedores que tratan datos por nuestra
          cuenta y bajo nuestras instrucciones (encargados):
        </p>
        <ul>
          <li>
            <strong>Google (Gemini):</strong> procesa los mensajes que escribes en el chat para generar las
            respuestas del Asistente Vantgard.
          </li>
          <li>
            <strong>Resend:</strong> envía los correos de los formularios y de las cotizaciones.
          </li>
          <li>
            <strong>Vercel:</strong> aloja el sitio y, si lo aceptas, genera la analítica y las medidas de
            velocidad.
          </li>
          <li>
            <strong>WhatsApp (Meta):</strong> si decides escribirnos o enviar tu cotización por WhatsApp, la
            conversación se rige también por las políticas de ese servicio.
          </li>
        </ul>
        <p>
          Estos proveedores pueden almacenar o procesar información en servidores fuera de México. Al usar el chat,
          los formularios o WhatsApp, aceptas que tus datos se remitan a ellos para las finalidades descritas.
        </p>
        <p>
          Fuera de estos casos, solo transferiremos tus datos cuando la ley lo exija o una autoridad competente lo
          requiera. Cualquier otra transferencia se hará con tu consentimiento.
        </p>
      </>
    ),
  },
  {
    id: "arco",
    title: "Tus derechos ARCO y cómo ejercerlos",
    content: (
      <>
        <p>Tienes derecho a:</p>
        <ul>
          <li>
            <strong>Acceder</strong> a tus datos y saber cómo los usamos.
          </li>
          <li>
            <strong>Rectificarlos</strong> si están incompletos o son inexactos.
          </li>
          <li>
            <strong>Cancelarlos</strong> cuando consideres que no se necesitan para las finalidades señaladas.
          </li>
          <li>
            <strong>Oponerte</strong> a su uso para fines específicos.
          </li>
        </ul>
        <p>Para ejercerlos, envía un correo a {mail} con:</p>
        <ol>
          <li>Tu nombre y un medio para comunicarte la respuesta.</li>
          <li>Un documento que acredite tu identidad o, en su caso, la de tu representante.</li>
          <li>La descripción clara de los datos y del derecho que quieres ejercer.</li>
          <li>Cualquier dato que nos ayude a localizar tu información.</li>
        </ol>
        <p>
          Te responderemos en un plazo máximo de <strong>{L.arcoResponseDays} días hábiles</strong> a partir de que
          recibamos tu solicitud completa. Si procede, la haremos efectiva dentro de los 15 días hábiles siguientes
          a la respuesta. El trámite es gratuito.
        </p>
      </>
    ),
  },
  {
    id: "revocacion",
    title: "Cómo revocar tu consentimiento o limitar el uso",
    content: (
      <>
        <p>
          Puedes revocar en cualquier momento el consentimiento que nos diste, o pedirnos que limitemos el uso o la
          divulgación de tus datos, escribiendo a {mail}. Seguimos el mismo procedimiento y los mismos plazos que
          para los derechos ARCO.
        </p>
        <p>
          Considera que no siempre podremos atender la solicitud de inmediato: es posible que por una obligación
          legal debamos conservar ciertos datos, por ejemplo los fiscales.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies y tecnologías similares",
    content: (
      <>
        <p>
          Este sitio usa almacenamiento local del navegador para recordar tu elección de cookies y el avance del
          cotizador. La analítica de Vercel solo se carga si la aceptas. Puedes cambiar tu elección cuando quieras
          en «Configurar cookies», al pie de la página, o desde la configuración de tu navegador.
        </p>
        <p>
          El detalle completo está en la <Link href="/politica-de-cookies">política de cookies</Link>.
        </p>
      </>
    ),
  },
  {
    id: "conservacion",
    title: "Cuánto tiempo conservamos tus datos",
    content: (
      <p>
        Conservamos tus datos mientras dure la relación contigo y el tiempo adicional que exijan las leyes
        aplicables. Si pediste informes y no contrataste, eliminamos tus datos a más tardar 12 meses después del
        último contacto. Los mensajes del chat se guardan en tu navegador solo mientras la pestaña esté abierta.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "Cambios a este aviso",
    content: (
      <p>
        Podemos actualizar este aviso por cambios en la ley o en nuestros servicios. Publicaremos la versión
        vigente en esta misma página con su fecha de última actualización. Si el cambio afecta de forma importante
        el uso de tus datos, te avisaremos por correo o con un aviso visible en el sitio.
      </p>
    ),
  },
  {
    id: "autoridad",
    title: "Autoridad",
    content: (
      <p>
        Si consideras que tu derecho a la protección de datos personales fue vulnerado, puedes acudir a la{" "}
        <strong>Secretaría Anticorrupción y Buen Gobierno</strong>, autoridad en la materia conforme a la Ley
        Federal de Protección de Datos Personales en Posesión de los Particulares, publicada en el Diario Oficial
        de la Federación el 20 de marzo de 2025.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Aviso de privacidad integral"
      path="/aviso-de-privacidad"
      sections={sections}
      intro={
        <p>
          En {company.name} cuidamos tus datos. Este aviso explica, conforme a la Ley Federal de Protección de Datos
          Personales en Posesión de los Particulares, qué datos recabamos, para qué los usamos y cómo puedes
          controlarlos.
        </p>
      }
    />
  );
}
