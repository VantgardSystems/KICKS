import { Fragment } from "react";
import { PENDING } from "@/config/site";

/** Resalta los textos [PENDIENTE] para que no se te pase completarlos. */
export function WithPending({ text, tone = "dark" }: { text: string; tone?: "dark" | "light" }) {
  if (!text.includes(PENDING)) return <>{text}</>;
  const parts = text.split(PENDING);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <mark
              className={`rounded px-1 font-mono text-[0.875em] ${
                tone === "dark" ? "bg-flame/15 text-flame-hi" : "bg-orange-100 text-orange-800"
              }`}
            >
              {PENDING}
            </mark>
          )}
        </Fragment>
      ))}
    </>
  );
}
