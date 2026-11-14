import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Términos y condiciones";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Legal", title: "Términos y condiciones" });
}
