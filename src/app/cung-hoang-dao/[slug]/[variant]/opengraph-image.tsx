import { notFound } from "next/navigation";
import { getZodiacVariant, zodiacVariantLinks } from "@/lib/kb";
import { ZODIAC_SIGNS } from "@/lib/engines/zodiac";
import { pageCardImage } from "@/lib/og/page-card";

export const alt = "Cung hoàng đạo theo giới tính và tháng sinh trên Sao Hợp";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Tạo sẵn ảnh cho mọi trang lúc build, giống generateStaticParams của page.
export function generateStaticParams() {
  return ZODIAC_SIGNS.flatMap((s) => zodiacVariantLinks(s).map((l) => ({ slug: s.slug, variant: l.variant })));
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function Image({ params }: { params: Promise<{ slug: string; variant: string }> }) {
  const { slug, variant } = await params;
  const data = getZodiacVariant(slug, variant);
  if (!data) notFound();
  const { sign, kind, month, monthRange, label, dateRange } = data;
  const range = monthRange ? `${pad(monthRange.from)}/${pad(month!)} - ${pad(monthRange.to)}/${pad(month!)}` : dateRange;
  return pageCardImage({
    eyebrow: `Cung ${sign.name} · Nguyên tố ${sign.element}`,
    title: sign.name,
    accent: label.slice(sign.name.length + 1),
    subtitle: kind === "thang" ? "Tính cách, tình yêu và điểm khác biệt" : "Tính cách, khi yêu và cách chinh phục",
    visual: { signs: [sign.slug], caption: range },
  });
}
