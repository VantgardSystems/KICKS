"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { MouseEvent, PointerEvent, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  external?: boolean;
  variant?: Variant;
  size?: Size;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
  magnetic?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  "aria-label"?: string;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-flame text-ink hover:bg-flame-hi shadow-[0_0_0_1px_rgb(255_107_26/0.4),0_8px_32px_-8px_rgb(255_107_26/0.55)]",
  outline: "border border-line-strong text-paper hover:border-white/40 hover:bg-white/5",
  ghost: "text-paper hover:bg-white/5",
  light: "bg-ink text-paper hover:bg-neutral-800",
};

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-12 px-6 text-[0.9375rem]",
  lg: "min-h-14 px-8 text-base",
};

export function Button({
  children,
  href,
  external,
  variant = "primary",
  size = "md",
  type = "button",
  disabled,
  loading,
  className = "",
  fullWidth,
  magnetic = true,
  onClick,
  ...rest
}: ButtonProps) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (!magnetic || reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const cls = `group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-colors duration-200 select-none ${
    variants[variant]
  } ${sizes[size]} ${fullWidth ? "w-full" : ""} ${
    disabled || loading ? "pointer-events-none opacity-60" : ""
  } ${className}`;

  const inner = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[420%]"
      />
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  );

  let el: ReactNode;
  if (href && external) {
    el = (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onClick} {...rest}>
        {inner}
      </a>
    );
  } else if (href) {
    el = (
      <Link href={href} className={cls} onClick={onClick} {...rest}>
        {inner}
      </Link>
    );
  } else {
    el = (
      <button type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={cls} onClick={onClick} {...rest}>
        {inner}
      </button>
    );
  }

  return (
    <motion.span
      className={fullWidth ? "block w-full" : "inline-block"}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {el}
    </motion.span>
  );
}
