import type { Metadata } from "next";
import "./lab.css";
import { labFontVars } from "./fonts";
import { LabHome } from "./LabHome";

export const metadata: Metadata = {
  title: "Laboratorio de diseño",
  description: "Pruebas internas del rediseño.",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: null },
};

export default function LabPage() {
  return <LabHome fontVars={labFontVars} />;
}
