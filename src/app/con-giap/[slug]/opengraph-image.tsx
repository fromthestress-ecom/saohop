import { notFound } from "next/navigation";
import { conGiapSlugsWithContent, getConGiap } from "@/lib/kb/con-giap";
import { pageCardImage } from "@/lib/og/page-card";

export const alt = "Tuổi con giáp trên Sao Hợp";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return conGiapSlugsWithContent().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const data = getConGiap((await params).slug);
  if (!data) notFound();
  const { chi, years } = data;
  const recent = years.filter((y) => y.lunarYear >= 1984 && y.lunarYear <= 2020).map((y) => y.lunarYear);
  return pageCardImage({
    eyebrow: `12 con giáp · Con ${chi.animal} · Hành ${chi.element}`,
    title: "Tuổi",
    accent: chi.name,
    subtitle: "Sinh năm nào, tính cách, hợp tuổi gì",
    visual: { animals: [chi.slug], caption: recent.join(" · ") },
  });
}
