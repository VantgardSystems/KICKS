import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

interface BtnProps {
  children: ReactNode;
  href?: string;
  external?: boolean;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  className?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  type?: "button" | "submit";
  "aria-label"?: string;
}

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h9M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Botón del rediseño. La forma (píldora, flecha o rectangular) la decide el CSS del tema. */
export function Btn({ children, href, external, variant = "primary", size = "md", className = "", onClick, type = "button", ...rest }: BtnProps) {
  const cls = `btn btn-${variant} ${size === "lg" ? "btn-lg" : ""} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      <span className="btn-arrow">
        <Arrow />
        <Arrow />
      </span>
    </>
  );
  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onClick} {...rest}>
        {inner}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick} {...rest}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} {...rest}>
      {inner}
    </button>
  );
}
