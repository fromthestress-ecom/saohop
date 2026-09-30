import { notFound } from "next/navigation";
import { verdictOf } from "@/lib/engines/compatibility";
import { conGiapPairSlugsWithContent, getConGiapPair } from "@/lib/kb/con-giap";
import { pageCardImage } from "@/lib/og/page-card";

export const alt = "Độ hợp hai tuổi con giáp trên Sao Hợp";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return conGiapPairSlugsWithContent().map((pair) => ({ pair }));
}

export default async function Image({ params }: { params: Promise<{ pair: string }> }) {
  const data = getConGiapPair((await params).pair);
  if (!data) notFound();
  const { a, b, relation, score } = data;
  return pageCardImage({
    eyebrow: "Hợp tuổi con giáp",
    title: a.slug === b.slug ? `Hai người tuổi ${a.name}` : `Tuổi ${a.name} và tuổi ${b.name}`,
    subtitle: `${relation} · ${verdictOf(score)}`,
    visual: { animals: [a.slug, b.slug], caption: `Độ hợp ${score}/100` },
  });
}
