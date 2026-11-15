import type { Metadata } from "next";
import Link from "next/link";
import { company, delivery, pricing } from "@/config/site";
import { LegalLayout, type LegalSection } from "@/components/legal/LegalLayout";
import { WithPending } from "@/components/ui/Pending";

const title = "Términos y condiciones";
const description =
  "Términos y condiciones de Vantgard Systems: alcance del servicio, demo en Sandbox sin anticipo, cotizaciones, pagos, tiempos, cambios y propiedad del sitio.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terminos-y-condiciones" },
  openGraph: { title, description, url: "/terminos-y-condiciones" },
};

const L = company.legal;
const normal = delivery.find((d) => d.id === "normal")!;
const express = delivery.find((d) => d.id === "express")!;

const sections: LegalSection[] = [
  {
    id: "alcance",
    title: "Alcance del servicio",
    content: (
      <>
        <p>
          {company.name} diseña y desarrolla páginas web, tiendas en línea, sistemas de citas y agentes de
          inteligencia artificial para negocios, y ofrece mantenimiento mensual opcional.
        </p>
        <p>
          El alcance exacto de cada proyecto (páginas, funciones, extras y entregables) es el que aparece en la
          propuesta que aceptas por escrito, ya sea por correo o por WhatsApp. Lo que no esté en la propuesta se
          cotiza por separado.
        </p>
      </>
    ),
  },
  {
    id: "demo",
    title: "Demo en Sandbox sin anticipo",
    content: (
      <>
        <p>
          Antes de cobrarte, construimos una demo de tu página en un servidor de prueba (Sandbox). La demo no
          modifica ni reemplaza tu sitio actual y no te obliga a contratar.
        </p>
        <ul>
          <li>La demo es una muestra del diseño y de las funciones principales, no el sitio terminado.</li>
          <li>Permanece disponible por un tiempo limitado, que te indicamos al entregarla.</li>
          <li>
            Mientras no se liquide el proyecto, la demo, su diseño y su código son propiedad de {company.name} y no
            pueden copiarse ni publicarse.
          </li>
          <li>Podemos declinar una demo si el proyecto no es viable o está fuera de nuestros servicios.</li>
        </ul>
      </>
    ),
  },
  {
    id: "cotizaciones",
    title: "Cotizaciones y precios",
    content: (
      <>
        <p>
          Los precios publicados en el sitio, los que da el cotizador y los que menciona el Asistente Vantgard son{" "}
          <strong>estimados</strong>. No son una oferta definitiva ni el precio final.
        </p>
        <p>
          El precio final se confirma por escrito después del diagnóstico. Los precios están en pesos mexicanos (
          {pricing.currency}) y se expresan <strong>{pricing.taxLabel}</strong>. Una propuesta formal tiene vigencia
          de 15 días naturales, salvo que indique otra cosa.
        </p>
      </>
    ),
  },
  {
    id: "pagos",
    title: "Formas de pago",
    content: (
      <>
        <p>Aceptamos transferencia bancaria (SPEI) y tarjeta de crédito o débito. Salvo acuerdo distinto:</p>
        <ul>
          <li>50 % al aprobar la demo, para iniciar el desarrollo.</li>
          <li>50 % antes de publicar el sitio en tu dominio.</li>
        </ul>
        <p>
          El mantenimiento mensual se paga por adelantado cada mes. Emitimos factura (CFDI) cuando la solicitas y
          nos das tus datos fiscales.
        </p>
      </>
    ),
  },
  {
    id: "tiempos",
    title: "Tiempos de entrega",
    content: (
      <>
        <p>
          La entrega {normal.label.toLowerCase()} es de {normal.time} y la {express.label} de {express.time}, con
          un cargo adicional de {Math.round(express.surcharge * 100)} %. Los plazos cuentan desde que apruebas la
          demo, cubres el primer pago y nos entregas el material necesario (textos, fotos, logotipo y accesos).
        </p>
        <p>
          Los plazos son estimados. Si el material o tus respuestas se retrasan, la fecha de entrega se recorre el
          mismo número de días.
        </p>
      </>
    ),
  },
  {
    id: "cambios",
    title: "Rondas de cambios",
    content: (
      <>
        <p>
          Cada plan incluye las rondas de cambios que se indican en su descripción (2 o 3). Una ronda es una lista
          de ajustes que nos envías en un solo mensaje sobre lo ya entregado.
        </p>
        <p>
          Los cambios que modifican el alcance aprobado (nuevas páginas, funciones o un rediseño completo) y las
          rondas adicionales se cotizan aparte.
        </p>
      </>
    ),
  },
  {
    id: "propiedad",
    title: "Propiedad del diseño y del código",
    content: (
      <>
        <p>
          Al liquidar el proyecto, el diseño y el código hechos para tu sitio son tuyos. Te entregamos los accesos
          y los archivos.
        </p>
        <ul>
          <li>
            Las herramientas de terceros (librerías, tipografías, plataformas de pago o de hosting) conservan sus
            propias licencias.
          </li>
          <li>
            Tú garantizas que tienes derecho a usar los textos, imágenes y marcas que nos entregas, y respondes
            por ellos.
          </li>
          <li>
            Podemos mostrar el proyecto en nuestro portafolio. Si prefieres que no, avísanos por escrito y lo
            retiramos.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "hosting",
    title: "Hosting, dominio y mantenimiento",
    content: (
      <>
        <p>
          Puedes usar tu propio dominio y hosting o contratarlos con nosotros. El dominio se registra a tu nombre
          siempre que sea posible. Los servicios de terceros se renuevan cada año y sus precios pueden cambiar.
        </p>
        <p>
          Sin un plan de mantenimiento, después de la entrega el cuidado del sitio (actualizaciones, respaldos y
          seguridad) es tu responsabilidad. Los planes de mantenimiento cubren lo que se describe en la sección de
          precios y puedes cancelarlos con 15 días de anticipación al siguiente cobro.
        </p>
      </>
    ),
  },
  {
    id: "agente",
    title: "Agentes de inteligencia artificial",
    content: (
      <p>
        Los agentes de IA responden con base en la información que tú autorizas. Aun así, pueden cometer errores.
        Lo que el agente diga no sustituye una confirmación de una persona de tu equipo, y te recomendamos revisar
        sus respuestas de forma periódica. El servicio depende de proveedores externos y puede tener límites de
        uso.
      </p>
    ),
  },
  {
    id: "cancelaciones",
    title: "Cancelaciones",
    content: (
      <>
        <ul>
          <li>Antes de aprobar la demo puedes cancelar sin costo.</li>
          <li>
            Después del primer pago, si cancelas, ese pago cubre el trabajo realizado y no es reembolsable. Te
            entregamos el avance correspondiente.
          </li>
          <li>
            Si pasan 30 días naturales sin respuesta de tu parte, podemos pausar el proyecto y reprogramarlo según
            nuestra agenda.
          </li>
        </ul>
        <p>
          Si somos nosotros quienes no podemos terminar el proyecto, te devolvemos lo pagado por el trabajo no
          entregado.
        </p>
      </>
    ),
  },
  {
    id: "responsabilidad",
    title: "Limitación de responsabilidad",
    content: (
      <>
        <p>
          Trabajamos para que tu sitio funcione bien, pero no garantizamos resultados de ventas, posiciones en
          buscadores ni disponibilidad ininterrumpida de servicios de terceros (hosting, pasarelas de pago,
          WhatsApp, proveedores de IA).
        </p>
        <p>
          Nuestra responsabilidad total por cualquier reclamación se limita al monto que nos hayas pagado por el
          proyecto en cuestión. No respondemos por daños indirectos ni por pérdida de ingresos.
        </p>
      </>
    ),
  },
  {
    id: "privacidad",
    title: "Datos personales",
    content: (
      <p>
        El tratamiento de tus datos se rige por nuestro{" "}
        <Link href="/aviso-de-privacidad">aviso de privacidad integral</Link>. Tú eres responsable de los datos de
        tus propios clientes que se recaben a través del sitio que te entregamos.
      </p>
    ),
  },
  {
    id: "jurisdiccion",
    title: "Legislación y jurisdicción",
    content: (
      <>
        <p>
          Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Para cualquier controversia, las
          partes se someten a los tribunales competentes de <WithPending text={L.jurisdiction} />, y renuncian a
          cualquier otro fuero que pudiera corresponderles.
        </p>
        <p>
          Antes de llegar a eso, escríbenos a <a href={`mailto:${company.email}`}>{company.email}</a>: casi todo se
          resuelve platicando.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Términos y condiciones"
      path="/terminos-y-condiciones"
      sections={sections}
      intro={
        <p>
          Estos términos regulan el uso de este sitio y la contratación de los servicios de {company.name}, operado
          por <WithPending text={L.businessName} />. Al solicitar una demo o contratar un servicio, los aceptas.
        </p>
      }
    />
  );
}
