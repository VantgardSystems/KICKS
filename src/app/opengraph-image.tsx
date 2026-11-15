import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Páginas web que trabajan por tu negocio 24/7";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Páginas web para negocios en México", title: "Páginas web que trabajan por tu negocio 24/7" });
}
