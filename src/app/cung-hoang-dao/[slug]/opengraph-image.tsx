import { notFound } from "next/navigation";
import { getZodiac } from "@/lib/kb";
import { ZODIAC_SIGNS } from "@/lib/engines/zodiac";
import { pageCardImage } from "@/lib/og/page-card";

export const alt = "Cung hoàng đạo trên Sao Hợp";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Tạo sẵn ảnh cho mọi trang lúc build, giống generateStaticParams của page.
export function generateStaticParams() {
  return ZODIAC_SIGNS.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const data = getZodiac((await params).slug);
  if (!data) notFound();
  const { sign, dateRange } = data;
  return pageCardImage({
    eyebrow: `Cung hoàng đạo · Nguyên tố ${sign.element}`,
    title: "Cung",
    accent: sign.name,
    subtitle: "Tính cách, tình yêu và cung hợp nhau",
    visual: { signs: [sign.slug], caption: dateRange },
  });
}
