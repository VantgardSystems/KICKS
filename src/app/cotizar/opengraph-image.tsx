import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Cotiza tu página web en un minuto";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Cotizador en línea", title: "Cotiza tu página web en un minuto" });
}
