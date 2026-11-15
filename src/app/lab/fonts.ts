import localFont from "next/font/local";

// Fuentes candidatas del laboratorio (solo latín). Al elegir, se borran las demás.
export const interTight = localFont({
  src: [{ path: "../../fonts/lab/InterTight-800.woff2", weight: "800" }],
  variable: "--f-intertight",
  display: "swap",
  preload: false,
});
export const inter = localFont({
  src: [{ path: "../../fonts/lab/Inter-400.woff2", weight: "400" }],
  variable: "--f-inter",
  display: "swap",
  preload: false,
});
export const satoshi = localFont({
  src: [
    { path: "../../fonts/lab/Satoshi-400.woff2", weight: "400" },
    { path: "../../fonts/lab/Satoshi-900.woff2", weight: "900" },
  ],
  variable: "--f-satoshi",
  display: "swap",
  preload: false,
});
export const clash = localFont({
  src: [{ path: "../../fonts/lab/ClashDisplay-600.woff2", weight: "600" }],
  variable: "--f-clash",
  display: "swap",
  preload: false,
});
export const general = localFont({
  src: [{ path: "../../fonts/lab/GeneralSans-400.woff2", weight: "400" }],
  variable: "--f-general",
  display: "swap",
  preload: false,
});
export const instrumentSans = localFont({
  src: [
    { path: "../../fonts/lab/InstrumentSans-400.woff2", weight: "400" },
    { path: "../../fonts/lab/InstrumentSans-700.woff2", weight: "700" },
  ],
  variable: "--f-isans",
  display: "swap",
  preload: false,
});
export const instrumentSerif = localFont({
  src: [{ path: "../../fonts/lab/InstrumentSerif-400i.woff2", weight: "400", style: "italic" }],
  variable: "--f-iserif",
  display: "swap",
  preload: false,
});

export const labFontVars = [interTight, inter, satoshi, clash, general, instrumentSans, instrumentSerif]
  .map((f) => f.variable)
  .join(" ");
