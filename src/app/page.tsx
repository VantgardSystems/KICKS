import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Services } from "@/components/sections/Services";
import { Portfolio } from "@/components/sections/Portfolio";
import { Process } from "@/components/sections/Process";
import { Story } from "@/components/sections/Story";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Services />
      <Portfolio />
      <Process />
      <Story />
    </>
  );
}
