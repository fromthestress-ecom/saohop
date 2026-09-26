import { notFound } from "next/navigation";
import { verdictOf } from "@/lib/engines/compatibility";
import { getZodiacPair, ZODIAC_PAIRS, zodiacPairSlug } from "@/lib/kb";
import { pageCardImage } from "@/lib/og/page-card";

export const alt = "Độ hợp cặp đôi cung hoàng đạo trên Sao Hợp";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Tạo sẵn ảnh cho mọi trang lúc build, giống generateStaticParams của page.
export function generateStaticParams() {
  return ZODIAC_PAIRS.map(([a, b]) => ({ pair: zodiacPairSlug(a, b) }));
}

export default async function Image({ params }: { params: Promise<{ pair: string }> }) {
  const data = getZodiacPair((await params).pair);
  if (!data) notFound();
  const { a, b } = data;
  const same = a.sign.slug === b.sign.slug;
  return pageCardImage({
    eyebrow: "Cặp đôi cung hoàng đạo",
    title: same ? `Hai ${a.sign.name}` : `${a.sign.name} và ${b.sign.name}`,
    subtitle: `${data.relation.replace(/\s*\(.*\)$/, "")} · ${verdictOf(data.score)}`,
    visual: { signs: [a.sign.slug, b.sign.slug], caption: `Độ hợp ${data.score}/100` },
  });
}
