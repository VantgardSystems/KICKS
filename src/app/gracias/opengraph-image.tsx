import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Gracias, recibimos tu mensaje";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Vantgard Systems", title: "Gracias, recibimos tu mensaje" });
}
