"use client";

import dynamic from "next/dynamic";
import { BackToTop } from "./BackToTop";
import { CookieBanner } from "./CookieBanner";

// El chat se carga aparte para no pesar en la primera pintura.
const ChatWidget = dynamic(() => import("@/components/chat/ChatWidget").then((m) => m.ChatWidget), {
  ssr: false,
});

export function SiteExtras() {
  return (
    <>
      <BackToTop />
      <ChatWidget />
      <CookieBanner />
    </>
  );
}
