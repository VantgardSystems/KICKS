import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  id?: string;
}

export function SectionHeading({ eyebrow, title, description, align = "left", tone = "dark", id }: Props) {
  return (
    <Reveal className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 id={id} className="h-section">
        {title}
      </h2>
      {description && (
        <p className={`mt-6 max-w-2xl text-lg ${align === "center" ? "mx-auto" : ""} ${tone === "dark" ? "text-mute" : "text-neutral-600"}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
