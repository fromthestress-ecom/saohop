import { IconArrowLeft, IconArrowRight, IconBulb, IconHeartHandshake } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, CrushCta, Highlight, TraitColumns } from "@/components/kb-blocks";
import { ZodiacIcon } from "@/components/zodiac-icon";
import { ZODIAC_SIGNS } from "@/lib/engines/zodiac";
import { getZodiac, zodiacContent, zodiacMatches, zodiacPairSlug } from "@/lib/kb";

export const dynamicParams = false;

export function generateStaticParams() {
  return ZODIAC_SIGNS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cung-hoang-dao/[slug]">): Promise<Metadata> {
  const data = getZodiac((await params).slug);
  if (!data) return {};
  const { sign, entry, dateRange } = data;
  return {
    title: `Cung ${sign.name} (${dateRange}): tính cách, tình yêu, hợp với cung nào`,
    description: entry.summary,
    alternates: { canonical: `/cung-hoang-dao/${sign.slug}` },
    robots: { index: zodiacContent.meta.reviewed },
  };
}

export default async function ZodiacPage({ params }: PageProps<"/cung-hoang-dao/[slug]">) {
  const data = getZodiac((await params).slug);
  if (!data) notFound();
  const { sign, entry, dateRange } = data;
  const matches = zodiacMatches(sign);
  const best = matches.slice(0, 4);
  const hardest = matches.slice(-2);
  const prev = ZODIAC_SIGNS[(sign.index + 11) % 12];
  const next = ZODIAC_SIGNS[(sign.index + 1) % 12];

  return (
    <article className="space-y-12 pt-8 md:pt-12">
      <header className="space-y-6">
        <Breadcrumb items={[{ href: "/", label: "Trang chủ" }, { href: "/cung-hoang-dao", label: "Cung hoàng đạo" }, { label: sign.name }]} />
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <span
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-white shadow-lg shadow-accent-2/30"
            style={{ backgroundImage: "linear-gradient(135deg, var(--btn-from), var(--btn-to))" }}
          >
            <ZodiacIcon slug={sign.slug} size={52} />
          </span>
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tighter md:text-6xl">
              Cung <span className="text-gradient-brand">{sign.name}</span>
            </h1>
            <p className="mt-2 text-ink-muted tabular-nums">
              {dateRange}
              {sign.altName ? `, còn gọi là ${sign.altName}` : ""}
            </p>
          </div>
        </div>
        <ul className="flex flex-wrap gap-2 text-sm">
          {[`Nguyên tố ${sign.element}`, `Nhóm ${sign.modality.toLowerCase()}`, `Chủ quản: ${entry.ruler}`].map((chip) => (
            <li key={chip} className="rounded-full border border-line px-4 py-1.5">
              {chip}
            </li>
          ))}
        </ul>
        <p className="max-w-[65ch] text-xl leading-relaxed">{entry.summary}</p>
      </header>

      <TraitColumns good={entry.strengths} watch={entry.weaknesses} />

      <Highlight title={`${sign.name} khi yêu`}>{entry.inLove}</Highlight>

      <section aria-labelledby="hop" className="space-y-4">
        <h2 id="hop" className="font-display text-2xl font-semibold">
          {sign.name} hợp với cung nào?
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {best.map((m) => (
            <li key={m.sign.slug}>
              <Link
                href={`/cung-hoang-dao/cap-doi/${zodiacPairSlug(sign, m.sign)}`}
                className="panel flex items-center gap-3 p-4 transition-colors hover:border-accent"
              >
                <ZodiacIcon slug={m.sign.slug} size={26} className="shrink-0 text-accent" />
                <span className="flex-1">
                  <span className="block font-semibold">{m.sign.name}</span>
                  <span className="text-xs text-ink-muted">{m.relation}</span>
                </span>
                <span className="font-display text-gradient-brand text-2xl font-bold tabular-nums">{m.score}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-sm text-ink-muted">
          Dễ va chạm hơn với {hardest.map((m) => m.sign.name).join(" và ")} ({hardest[0].relation.toLowerCase()}), nhưng hiểu nhau thì vẫn
          vun đắp được. Điểm chỉ xét riêng cung hoàng đạo, kết quả check crush còn cộng thêm thần số học và con giáp.
        </p>
        <Link href={`/cung-hoang-dao/cap-doi#cd-${sign.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
          Xem {sign.name} với cả 12 cung <IconArrowRight size={16} aria-hidden />
        </Link>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="panel p-6">
          <IconHeartHandshake size={28} stroke={1.5} className="text-accent" aria-hidden />
          <h2 className="font-display mt-3 text-xl font-semibold">Buổi hẹn lý tưởng</h2>
          <p className="mt-2 text-ink-muted">{entry.dateIdea}</p>
        </section>
        <section className="panel p-6">
          <IconBulb size={28} stroke={1.5} className="text-accent-3" aria-hidden />
          <h2 className="font-display mt-3 text-xl font-semibold">Lời khuyên cho {sign.name}</h2>
          <p className="mt-2 text-ink-muted">{entry.advice}</p>
        </section>
      </div>

      <CrushCta title={`Crush của bạn có phải cung hợp với ${sign.name} không?`} />

      <nav aria-label="Cung khác" className="flex justify-between gap-4 border-t border-line pt-6 text-sm">
        <Link href={`/cung-hoang-dao/${prev.slug}`} className="flex items-center gap-2 text-ink-muted hover:text-ink">
          <IconArrowLeft size={16} aria-hidden /> {prev.name}
        </Link>
        <Link href={`/cung-hoang-dao/${next.slug}`} className="flex items-center gap-2 text-ink-muted hover:text-ink">
          {next.name} <IconArrowRight size={16} aria-hidden />
        </Link>
      </nav>
    </article>
  );
}
