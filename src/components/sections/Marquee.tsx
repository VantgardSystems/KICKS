import { industries } from "@/config/site";

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {industries.map((name) => (
        <li key={name} className="flex items-center whitespace-nowrap">
          <span className="px-6 text-2xl font-medium tracking-tight text-paper/80 md:px-8 md:text-3xl">{name}</span>
          <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-flame" />
        </li>
      ))}
    </ul>
  );
}

export function Marquee() {
  return (
    <section aria-label="Industrias con las que trabajamos" className="border-y border-line bg-coal py-6 md:py-8">
      <div className="marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee-track flex w-max">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
