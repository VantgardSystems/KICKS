"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { company, nav, whatsappUrl } from "@/config/site";
import { Logo } from "@/components/ui/Logo";
import { Btn } from "./Btn";

/** Navbar como píldora de vidrio flotante y centrada. */
export function NavbarV2() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !menuRef.current) return;
      const items = [toggleRef.current, ...menuRef.current.querySelectorAll<HTMLElement>("a, button")].filter(Boolean) as HTMLElement[];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-3 z-50 px-3 md:top-4">
        <div
          className={`glass pointer-events-auto mx-auto flex h-14 max-w-[1120px] items-center justify-between gap-4 rounded-full pr-2 pl-5 transition-[background-color] duration-300 md:h-16 md:pl-6 ${
            scrolled || open ? "bg-[#0B0C0E]/60" : ""
          }`}
        >
          <Link href="/" aria-label="VANTGARD SYSTEMS, ir al inicio" className="rounded-md py-1 text-[#E9ECEF]" onClick={() => setOpen(false)}>
            <Logo />
          </Link>
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex min-h-11 items-center rounded-full px-4 text-[15px] text-[#ADB5BD] transition-colors hover:text-[#E9ECEF]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-1">
            <div className="hidden sm:block">
              <Btn href="/#cotizar" className="!min-h-10 !px-5 !text-[15px]">
                Cotiza gratis
              </Btn>
            </div>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="menu-movil-v2"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center rounded-full text-[#E9ECEF] lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-[1.5px] w-5 bg-current transition-transform duration-300 ${open ? "top-1/2 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-[1.5px] w-5 bg-current transition-transform duration-300 ${open ? "top-1/2 -rotate-45" : "bottom-0"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil-v2"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[45] overflow-y-auto bg-[#0B0C0E] lg:hidden"
          >
            <div className="container-x flex min-h-full flex-col justify-between gap-12 pt-28 pb-24">
              <ul>
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.045, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-white/10"
                  >
                    <Link href={item.href} onClick={() => setOpen(false)} className="f-display block py-4 text-[40px] leading-none text-[#E9ECEF]">
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="space-y-4">
                <Btn href="/#cotizar" size="lg" className="w-full" onClick={() => setOpen(false)}>
                  Cotiza gratis
                </Btn>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-[#ADB5BD]">
                  <a href={whatsappUrl("Hola, quiero información sobre una página web.")} target="_blank" rel="noopener noreferrer" className="py-2 hover:text-[#E9ECEF]">
                    WhatsApp
                  </a>
                  <a href={`mailto:${company.email}`} className="py-2 break-all hover:text-[#E9ECEF]">
                    {company.email}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
