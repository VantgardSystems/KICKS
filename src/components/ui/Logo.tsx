interface LogoProps {
  className?: string;
  /** "full" = VANTGARD + SYSTEMS, "mark" = solo la V. */
  variant?: "full" | "mark";
  /** Color del texto: claro (sobre negro) u oscuro (sobre blanco). */
  tone?: "light" | "dark";
}

export function LogoMark({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const fill = tone === "light" ? "#FAFAFA" : "#0A0A0A";
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <path d="M3 5h7.2L16 20.4 20.3 9h7.1L19.3 28h-6.6L3 5Z" fill={fill} />
      <path d="M21.8 5H29l-1.6 4h-7.1l1.5-4Z" fill="#FF6B1A" />
    </svg>
  );
}

export function Logo({ className = "", variant = "full", tone = "light" }: LogoProps) {
  if (variant === "mark") return <LogoMark className={className} tone={tone} />;
  return (
    <span className={`inline-flex items-baseline gap-2 leading-none ${className}`}>
      <span className="inline-flex items-baseline text-[1.125rem] font-bold tracking-[0.04em]">
        <LogoMark tone={tone} className="-mx-[0.09em] h-[1em] w-[1em] translate-y-[0.125em]" />
        <span>ANTGARD</span>
      </span>
      <span className="font-mono text-[0.625rem] font-medium tracking-[0.22em] opacity-70">SYSTEMS</span>
    </span>
  );
}
