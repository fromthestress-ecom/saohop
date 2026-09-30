import { notFound } from "next/navigation";
import { birthYearsWithContent, getBirthYear } from "@/lib/kb/con-giap";
import { pageCardImage } from "@/lib/og/page-card";

export const alt = "Tuổi và mệnh theo năm sinh trên Sao Hợp";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return birthYearsWithContent().map((year) => ({ year: String(year) }));
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function Image({ params }: { params: Promise<{ year: string }> }) {
  const data = getBirthYear(Number((await params).year));
  if (!data) notFound();
  const { year, canChi, tet } = data;
  return pageCardImage({
    eyebrow: `Sinh năm ${year} mệnh gì, tuổi con gì`,
    title: `Tuổi ${canChi.label}`,
    accent: `mệnh ${canChi.element}`,
    subtitle: `${canChi.napAm} · con ${canChi.animal}`,
    visual: { number: String(year), caption: `Tết ${pad(tet.day)}/${pad(tet.month)}/${tet.year}` },
  });
}
