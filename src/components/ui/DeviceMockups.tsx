import type { ReactNode } from "react";

/** Mockups hechos con CSS. El contenido (captura) va como children. */

export function LaptopMockup({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="rounded-t-[14px] border border-white/15 bg-[#0d0d0d] p-[1.6%] pb-[1.2%] shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_40px_80px_-30px_rgb(0_0_0/0.9)]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-black">{children}</div>
      </div>
      <div className="relative mx-[-6%] h-[10px] rounded-b-[14px] bg-gradient-to-b from-[#2a2a2a] to-[#111] shadow-[inset_0_1px_0_rgb(255_255_255/0.15)] sm:h-[14px]">
        <div className="absolute top-0 left-1/2 h-[4px] w-[14%] -translate-x-1/2 rounded-b-md bg-[#0a0a0a]" />
      </div>
    </div>
  );
}

export function PhoneMockup({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[13%/6%] border border-white/20 bg-[#0d0d0d] p-[3.5%] shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_30px_60px_-20px_rgb(0_0_0/0.9)] ${className}`}
    >
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[11%/5%] bg-black">
        {children}
        <div className="absolute top-[1.6%] left-1/2 z-10 h-[2.6%] w-[28%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}
