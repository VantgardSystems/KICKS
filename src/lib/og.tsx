import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontDir = join(process.cwd(), "src/fonts");

/** Imagen Open Graph 1200x630 con logo y titular. */
export async function renderOg({ eyebrow, title }: { eyebrow: string; title: string }) {
  const [display, body] = await Promise.all([
    readFile(join(fontDir, "og/InterTight-800.ttf")),
    readFile(join(fontDir, "og/Inter-400.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0B0C0E",
          color: "#E9ECEF",
          fontFamily: "Inter Tight",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -180,
            top: -220,
            width: 720,
            height: 720,
            borderRadius: 720,
            display: "flex",
            background: "radial-gradient(circle, rgba(251,86,7,0.5) 0%, rgba(251,86,7,0) 48%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="52" height="52" viewBox="0 0 32 32">
            <path d="M3 5h7.2L16 20.4 20.3 9h7.1L19.3 28h-6.6L3 5Z" fill="#E9ECEF" />
            <path d="M21.8 5H29l-1.6 4h-7.1l1.5-4Z" fill="#FB5607" />
          </svg>
          <div style={{ display: "flex", fontSize: 34, letterSpacing: 2 }}>VANTGARD</div>
          <div style={{ display: "flex", fontFamily: "Inter", fontSize: 18, letterSpacing: 6, color: "#ADB5BD" }}>
            SYSTEMS
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontFamily: "Inter", fontSize: 24, color: "#FB5607" }}>{eyebrow}</div>
          <div style={{ display: "flex", fontSize: title.length > 48 ? 64 : 80, lineHeight: 1.04, letterSpacing: -4, maxWidth: 980 }}>
            {title}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Inter", fontSize: 22, color: "#ADB5BD" }}>
          <div style={{ display: "flex" }}>Demo sin anticipo</div>
          <div style={{ display: "flex" }}>vantgardsystems.com</div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Inter Tight", data: display, weight: 800, style: "normal" },
        { name: "Inter", data: body, weight: 400, style: "normal" },
      ],
    },
  );
}
