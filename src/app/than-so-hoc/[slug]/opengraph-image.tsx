import { notFound } from "next/navigation";
import { getLifePath, parseLifePathSlug, lifePathSlug } from "@/lib/kb";
import { LIFE_PATH_NUMBERS } from "@/lib/engines/numerology";
import { pageCardImage } from "@/lib/og/page-card";

export const alt = "Số chủ đạo trong thần số học trên Sao Hợp";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Tạo sẵn ảnh cho mọi trang lúc build, giống generateStaticParams của page.
export function generateStaticParams() {
  return LIFE_PATH_NUMBERS.map((n) => ({ slug: lifePathSlug(n) }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const n = parseLifePathSlug((await params).slug);
  const entry = n === null ? null : getLifePath(n);
  if (n === null || !entry) notFound();
  return pageCardImage({
    eyebrow: `Thần số học · Số chủ đạo ${n}${[11, 22, 33].includes(n) ? " · số master" : ""}`,
    title: entry.title,
    subtitle: "Tính cách, tình yêu, sự nghiệp và số hợp",
    visual: { number: String(n) },
  });
}
