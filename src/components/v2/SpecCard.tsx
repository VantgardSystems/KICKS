"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent, PointerEvent, ReactNode } from "react";
import { useLab } from "@/components/lab/LabContext";

export type SpecVariant = "glass" | "blackstone" | "whiteout" | "nitro";

export interface SpecRow {
  label: string;
  value: ReactNode;
}

interface SpecCardProps {
  title: ReactNode;
  /** Pares etiqueta / valor de la ficha. */
  rows?: SpecRow[];
  /** Píldora abajo a la derecha. */
  pill?: { label: string; href?: string; onClick?: (e: MouseEvent<HTMLElement>) => void; ariaLabel?: string };
  /** Texto corto bajo el título. */
  summary?: ReactNode;
  /** Contenido libre entre título y ficha (lista de incluidos, etc.). */
  children?: ReactNode;
  /** Foto de la tarjeta. */
  image?: { src: string; alt: string; sizes: string; temp?: boolean; aspect?: string };
  /** Variante fija. Si no se da, sale de la opción "Tarjetas" del tema. */
  variant?: SpecVariant;
  /** La tarjeta destacada (plan principal) va en nitro sólido. */
  featured?: boolean;
  /** Posición en la lista, para alternar muestras de color. */
  index?: number;
  size?: "lg" | "md";
  className?: string;
  as?: "article" | "li" | "div";
  titleAs?: "h2" | "h3" | "h4";
  interactive?: boolean;
}

// Muestras de color: el naranja aparece una sola vez por lista (≈5 % del área).
const swatchCycle: SpecVariant[] = ["whiteout", "blackstone", "nitro", "blackstone", "whiteout", "blackstone"];

export function useSpecVariant(featured?: boolean, index = 0, fixed?: SpecVariant): SpecVariant {
  const { state } = useLab();
  if (fixed) return fixed;
  if (featured) return "nitro";
  if (state.cards === "glass") return "glass";
  if (state.cards === "solid") return "blackstone";
  return swatchCycle[index % swatchCycle.length];
}

/** Componente firma: ficha técnica con título grande, pares etiqueta/valor y píldora. */
export function SpecCard({
  title,
  rows = [],
  pill,
  summary,
  children,
  image,
  variant,
  featured,
  index = 0,
  size = "lg",
  className = "",
  as: Tag = "article",
  titleAs: Title = "h3",
  interactive = true,
}: SpecCardProps) {
  const v = useSpecVariant(featured, index, variant);
  const radius = size === "lg" ? "rounded-[28px]" : "rounded-[16px]";
  const pad = size === "lg" ? "p-6 md:p-8" : "p-5 md:p-6";
  // En vidrio con foto, la ficha flota sobre la imagen; en sólidos la foto va arriba.
  const overlay = v === "glass" && image;

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const pillEl = pill ? (
    pill.href ? (
      <Link href={pill.href} onClick={pill.onClick} aria-label={pill.ariaLabel} className="spec-pill relative z-[4]">
        {pill.label}
      </Link>
    ) : (
      <button type="button" onClick={pill.onClick} aria-label={pill.ariaLabel} className="spec-pill relative z-[4]">
        {pill.label}
      </button>
    )
  ) : null;

  const body = (
    <>
      <div>
        <Title className="t-card">{title}</Title>
        {summary && <p className="spec-value mt-3 max-w-[38ch] text-[15px] leading-relaxed">{summary}</p>}
        {children}
      </div>
      {(rows.length > 0 || pillEl) && (
        <div className="mt-8 flex flex-wrap items-end justify-between gap-x-4 gap-y-5">
          {rows.length > 0 && (
            <dl className="grid w-full min-w-0 grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:w-auto sm:flex-1 sm:flex-wrap sm:gap-x-8">
              {rows.map((row) => (
                <div key={row.label} className="min-w-0">
                  <dt className="t-label spec-label">{row.label}</dt>
                  <dd className="spec-value mt-1 text-[15px] leading-snug">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {pillEl && <div className="ml-auto shrink-0">{pillEl}</div>}
        </div>
      )}
    </>
  );

  if (overlay) {
    return (
      <Tag
        onPointerMove={interactive ? onMove : undefined}
        className={`spec spec-glass ${interactive ? "spec-interactive" : ""} film ${radius} flex min-h-[520px] flex-col justify-end p-3 ${className}`}
      >
        <Image src={image.src} alt={image.alt} fill sizes={image.sizes} className={`-z-10 object-cover ${image.temp ? "photo-temp" : ""}`} />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className={`glass relative z-[3] flex flex-col justify-between rounded-[20px] ${pad}`}>{body}</div>
      </Tag>
    );
  }

  return (
    <Tag
      onPointerMove={interactive ? onMove : undefined}
      className={`spec spec-${v} ${v === "nitro" ? "on-nitro" : ""} ${v === "glass" ? "glass" : ""} ${interactive ? "spec-interactive" : ""} ${radius} flex flex-col ${image ? "p-3" : pad} ${className}`}
    >
      {image && (
        <div className={`film relative overflow-hidden rounded-[18px] ${image.aspect ?? "aspect-[4/3]"}`}>
          <Image src={image.src} alt={image.alt} fill sizes={image.sizes} className={`object-cover ${image.temp ? "photo-temp" : ""}`} />
        </div>
      )}
      <div className={`flex flex-1 flex-col justify-between ${image ? "px-3 pt-6 pb-3 md:px-5 md:pb-5" : ""}`}>{body}</div>
    </Tag>
  );
}
