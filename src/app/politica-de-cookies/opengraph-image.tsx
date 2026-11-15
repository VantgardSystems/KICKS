import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Política de cookies";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Legal", title: "Política de cookies" });
}
