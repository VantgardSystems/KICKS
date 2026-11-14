"use client";

/** Último recurso: si falla el layout raíz. Sin dependencias del resto del sitio. */
export default function RootError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="es-MX">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#0A0A0A", color: "#FAFAFA", fontFamily: "system-ui, sans-serif", textAlign: "center", padding: 24 }}>
        <div>
          <h1 style={{ fontSize: 32, letterSpacing: "-0.03em" }}>No pudimos cargar el sitio</h1>
          <p style={{ color: "#A1A1AA", marginTop: 12 }}>Algo falló de nuestro lado. Intenta de nuevo.</p>
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: 24, minHeight: 48, padding: "0 24px", borderRadius: 999, border: 0, background: "#FF6B1A", color: "#0A0A0A", fontSize: 16, fontWeight: 500, cursor: "pointer" }}
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}
