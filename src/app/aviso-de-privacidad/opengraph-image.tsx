import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Aviso de privacidad integral";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Legal", title: "Aviso de privacidad integral" });
}
