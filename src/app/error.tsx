"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  const copy = async () => {
    const details = JSON.stringify({ ref: error.digest ?? "sin-referencia", route: window.location.pathname, time: new Date().toISOString() });
    try {
      await navigator.clipboard.writeText(details);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="container-x grid min-h-[100svh] place-items-center pt-28 pb-16">
      <div className="max-w-xl text-center">
        <p className="font-mono text-sm text-flame">Algo falló de nuestro lado</p>
        <h1 className="h-section mt-4">No pudimos cargar esta página</h1>
        <p className="mt-6 text-lg text-mute">
          Tu información no se perdió. Intenta de nuevo; si sigue fallando, copia los detalles y envíanoslos.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={reset}>
            Intentar de nuevo
          </Button>
          <Button size="lg" variant="outline" onClick={copy}>
            {copied ? "Detalles copiados" : "Copiar detalles del error"}
          </Button>
        </div>
        <p className="mt-6">
          <a href="/" className="text-sm text-mute underline underline-offset-4 hover:text-paper">
            Volver al inicio
          </a>
        </p>
      </div>
    </div>
  );
}
