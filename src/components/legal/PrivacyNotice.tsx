import Link from "next/link";
import { company } from "@/config/site";

/** Aviso de privacidad simplificado. Va junto a cada formulario y en el chat. */
export function PrivacyNotice({ purpose, className = "" }: { purpose: string; className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-mute ${className}`}>
      <strong className="font-medium text-paper/90">Aviso de privacidad simplificado.</strong> {company.name} es
      responsable de tus datos y los usa para {purpose}. No pedimos datos sensibles. Puedes ejercer tus derechos ARCO
      en{" "}
      <a href={`mailto:${company.legal.privacyEmail}`} className="underline underline-offset-2 hover:text-paper">
        {company.legal.privacyEmail}
      </a>
      . Consulta el{" "}
      <Link href="/aviso-de-privacidad" className="text-paper underline underline-offset-2">
        aviso de privacidad integral
      </Link>
      .
    </p>
  );
}

/** Texto de la casilla obligatoria. */
export function PrivacyLabel() {
  return (
    <>
      Acepto el{" "}
      <Link href="/aviso-de-privacidad" target="_blank" className="text-paper underline underline-offset-2">
        aviso de privacidad
      </Link>
      .
    </>
  );
}
