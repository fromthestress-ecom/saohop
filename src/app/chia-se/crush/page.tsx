import { IconArrowRight } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { verdictOf } from "@/lib/engines/compatibility";
import { zodiacBySlug } from "@/lib/engines/zodiac";
import { parseShareCard, shareQuery } from "@/lib/share";

export async function generateMetadata({ searchParams }: PageProps<"/chia-se/crush">): Promise<Metadata> {
  const card = parseShareCard(await searchParams);
  if (!card) return { title: "Check crush" };
  const title = `Hợp nhau ${card.score}%: ${verdictOf(card.score)}`;
  const description = `${zodiacBySlug(card.zodiacA)!.name} và ${zodiacBySlug(card.zodiacB)!.name}. Đến lượt bạn check crush bằng thần số học, cung hoàng đạo và con giáp.`;
  const image = `/api/og/crush?${shareQuery(card)}`;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    robots: { index: false },
  };
}

export default async function SharedCrushPage({ searchParams }: PageProps<"/chia-se/crush">) {
  const card = parseShareCard(await searchParams);
  return (
    <div className="grid items-center gap-10 pt-8 md:grid-cols-[1.3fr_1fr] md:pt-16">
      {card ? (
        // eslint-disable-next-line @next/next/no-img-element -- ảnh động từ route OG
        <img
          src={`/api/og/crush?${shareQuery(card)}`}
          alt={`Kết quả check crush: hợp nhau ${card.score}%`}
          width={1200}
          height={630}
          className="w-full rounded-2xl border border-line"
        />
      ) : (
        <div className="flex aspect-[1200/630] items-center justify-center rounded-2xl border border-dashed border-line p-8 text-center text-ink-muted">
          Liên kết này không còn hợp lệ.
        </div>
      )}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          {card ? "Bạn bè bạn vừa check crush." : "Tự check crush của bạn."}
        </h1>
        <p className="mt-3 text-ink-muted">Còn bạn và người ấy thì sao? Chỉ cần hai ngày sinh.</p>
        <Link href="/crush" className="btn-primary mt-6">
          Check crush
          <IconArrowRight size={18} stroke={2} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
