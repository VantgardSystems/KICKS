import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "Esta página no existe o cambió de lugar.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[100svh] items-center gap-10 pt-28 pb-16 lg:grid-cols-2">
      <div>
        <p className="font-mono text-sm text-flame">Error 404</p>
        <h1 className="h-display mt-4">Aquí no hay conexión</h1>
        <p className="mt-6 max-w-md text-lg text-mute">
          Esta página no existe o cambió de lugar. Vuelve al inicio o cotiza tu página desde aquí.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/" size="lg">
            Volver al inicio
          </Button>
          <Button href="/cotizar" size="lg" variant="outline">
            Cotiza tu página
          </Button>
        </div>
      </div>
      <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[24px] border border-line">
        <Image
          src="/images/404.webp"
          alt="Cable desconectado que brilla en naranja sobre fondo negro"
          fill
          preload
          sizes="(min-width: 1024px) 448px, 90vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
