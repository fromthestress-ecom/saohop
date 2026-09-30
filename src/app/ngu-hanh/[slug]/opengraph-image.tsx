import { notFound } from "next/navigation";
import { elementSlugsWithContent, getElement } from "@/lib/kb/con-giap";
import { pageCardImage } from "@/lib/og/page-card";

export const alt = "Mệnh ngũ hành trên Sao Hợp";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return elementSlugsWithContent().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const data = getElement((await params).slug);
  if (!data) notFound();
  return pageCardImage({
    eyebrow: `Ngũ hành · ${data.generatedBy} sinh ${data.name}, ${data.name} sinh ${data.generates}`,
    title: "Mệnh",
    accent: data.name,
    subtitle: `Hợp màu ${data.colors.own.slice(0, 2).join(", ")}, hợp mệnh ${data.generatedBy} và ${data.generates}`,
    visual: { chars: [data.name] },
  });
}
