import { IconBulb, IconHeartHandshake } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, CrushCta, DeepSection, Faq, Highlight, Toc } from "@/components/kb-blocks";
import { ZodiacIcon } from "@/components/zodiac-icon";
import { verdictOf } from "@/lib/engines/compatibility";
import { getZodiacPair, ZODIAC_PAIRS, zodiacContent, zodiacMatches, zodiacPairSlug, zodiacPairsContent } from "@/lib/kb";
import { pageSeo } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return ZODIAC_PAIRS.map(([a, b]) => ({ pair: zodiacPairSlug(a, b) }));
}

export async function generateMetadata({ params }: PageProps<"/cung-hoang-dao/cap-doi/[pair]">): Promise<Metadata> {
  const data = getZodiacPair((await params).pair);
  if (!data) return {};
  const { a, b, score } = data;
  const same = a.sign.slug === b.sign.slug;
  const names = same ? `${a.sign.name} và ${a.sign.name}` : `${a.sign.name} và ${b.sign.name}`;
  return {
    title: `${names} có hợp nhau không? Độ hợp ${score}/100`,
    description:
      data.override?.summary ??
      `${data.aspectText.headline}. ${data.elementText}${same ? "" : ` Xem thêm ${b.sign.name} và ${a.sign.name} khi yêu, điểm dễ va chạm và gợi ý hẹn hò.`}`,
    ...pageSeo(`/cung-hoang-dao/cap-doi/${data.slug}`, { ownImage: true }),
    robots: { index: zodiacContent.meta.reviewed && zodiacPairsContent.meta.reviewed },
  };
}

function SignBadge({ slug, name, dateRange }: { slug: string; name: string; dateRange: string }) {
  return (
    <Link href={`/cung-hoang-dao/${slug}`} className="group flex flex-col items-center gap-2 text-center">
      <span
        className="flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg shadow-accent-2/30 transition-transform duration-300 group-hover:scale-105 md:h-24 md:w-24"
        style={{ backgroundImage: "linear-gradient(135deg, var(--btn-from), var(--btn-to))" }}
      >
        <ZodiacIcon slug={slug} size={44} />
      </span>
      <span className="font-display text-xl font-semibold">{name}</span>
      <span className="text-xs text-ink-muted tabular-nums">{dateRange}</span>
    </Link>
  );
}

export default async function ZodiacPairPage({ params }: PageProps<"/cung-hoang-dao/cap-doi/[pair]">) {
  const data = getZodiacPair((await params).pair);
  if (!data) notFound();
  const { a, b } = data;
  const same = a.sign.slug === b.sign.slug;
  const deep = data.override?.deep;
  const pairName = same ? `hai ${a.sign.name}` : `${a.sign.name} và ${b.sign.name}`;
  const relationName = data.relation.replace(/\s*\(.*\)$/, "").toLowerCase();
  const faq = [
    {
      q: same ? `Hai ${a.sign.name} hợp nhau bao nhiêu phần trăm?` : `${a.sign.name} và ${b.sign.name} hợp nhau bao nhiêu phần trăm?`,
      a: `Xét riêng cung hoàng đạo, ${pairName} đạt ${data.score}/100 điểm hợp, xếp loại "${verdictOf(data.score)}", với sức hút ${data.passion}/100. Đây là góc ${relationName}: ${data.aspectText.headline.toLowerCase()}. Kết quả check crush trên Sao Hợp còn cộng thêm thần số học và con giáp nên có thể cao hoặc thấp hơn.`,
    },
    ...(deep?.faq ?? []),
  ];
  const toc = deep
    ? [...deep.sections.map((s) => ({ id: s.id, label: s.heading })), { id: "hoi-dap", label: "Hỏi đáp" }]
    : [];

  // Liên kết nội bộ: các cặp khác của hai cung này, xếp theo độ hợp.
  const related = [a.sign, ...(same ? [] : [b.sign])].map((sign) => ({
    sign,
    others: zodiacMatches(sign)
      .filter((m) => m.sign.slug !== (sign.slug === a.sign.slug ? b.sign.slug : a.sign.slug))
      .slice(0, 5),
  }));

  return (
    <article className="space-y-12 pt-8 md:pt-12">
      <header className="space-y-8">
        <Breadcrumb
          items={[
            { href: "/", label: "Trang chủ" },
            { href: "/cung-hoang-dao", label: "Cung hoàng đạo" },
            { href: "/cung-hoang-dao/cap-doi", label: "Cặp đôi" },
            { label: `${a.sign.name} và ${b.sign.name}` },
          ]}
        />
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tighter md:text-5xl">
              {a.sign.name} và {b.sign.name}
            </h1>
            <p className="font-display text-gradient-brand mt-2 text-2xl font-semibold md:text-3xl">{data.aspectText.headline}</p>
            <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-ink-muted">{data.override?.summary ?? data.aspectText.body}</p>
          </div>
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <SignBadge slug={a.sign.slug} name={a.sign.name} dateRange={a.dateRange} />
            <span className="font-display text-gradient-brand pb-10 text-3xl font-bold" aria-hidden>
              &
            </span>
            <SignBadge slug={b.sign.slug} name={b.sign.name} dateRange={b.dateRange} />
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="panel p-5">
            <dt className="text-sm text-ink-muted">Độ hợp theo cung</dt>
            <dd className="font-display text-gradient-brand text-5xl font-bold tracking-tighter tabular-nums">{data.score}</dd>
          </div>
          <div className="panel p-5">
            <dt className="text-sm text-ink-muted">Sức hút</dt>
            <dd className="font-display text-gradient-brand text-5xl font-bold tracking-tighter tabular-nums">{data.passion}</dd>
          </div>
          <div className="panel col-span-2 p-5">
            <dt className="text-sm text-ink-muted">Góc chiếu</dt>
            <dd className="font-display mt-1 text-2xl font-semibold">{data.relation}</dd>
            <dd className="mt-1 text-sm text-ink-muted">Xếp loại: {verdictOf(data.score)}</dd>
          </div>
        </dl>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="panel p-6">
          <h2 className="font-display text-xl font-semibold">
            Nguyên tố: {a.sign.element} gặp {b.sign.element}
          </h2>
          <p className="mt-3 text-ink-muted">{data.elementText}</p>
        </section>
        <section className="panel p-6">
          <h2 className="font-display text-xl font-semibold">
            Nhịp phối hợp: {a.sign.modality.toLowerCase()} và {b.sign.modality.toLowerCase()}
          </h2>
          <p className="mt-3 text-ink-muted">{data.modalityText}</p>
        </section>
      </div>

      {deep ? (
        <>
          <Toc items={toc} />
          {deep.sections.map((section) => (
            <DeepSection key={section.id} {...section} />
          ))}
        </>
      ) : same ? (
        <Highlight title={`${a.sign.name} khi yêu`}>{a.entry.inLove}</Highlight>
      ) : (
        <section aria-labelledby="khi-yeu" className="space-y-6">
          <h2 id="khi-yeu" className="font-display text-2xl font-semibold">
            Mỗi người yêu theo cách riêng
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <Highlight title={a.sign.name}>{a.entry.inLove}</Highlight>
            <Highlight title={b.sign.name}>{b.entry.inLove}</Highlight>
          </div>
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <section className="panel p-6">
          <IconHeartHandshake size={28} stroke={1.5} className="text-accent" aria-hidden />
          <h2 className="font-display mt-3 text-xl font-semibold">Gợi ý buổi hẹn</h2>
          {same ? (
            <p className="mt-2 text-ink-muted">{a.entry.dateIdea}</p>
          ) : (
            <ul className="mt-2 space-y-2 text-ink-muted">
              <li>
                <span className="font-semibold text-ink">{a.sign.name} thích: </span>
                {a.entry.dateIdea}
              </li>
              <li>
                <span className="font-semibold text-ink">{b.sign.name} thích: </span>
                {b.entry.dateIdea}
              </li>
              <li className="text-sm">Thay phiên nhau chọn kiểu hẹn là cách đơn giản để cả hai cùng vui.</li>
            </ul>
          )}
        </section>
        <section className="panel p-6">
          <IconBulb size={28} stroke={1.5} className="text-accent-3" aria-hidden />
          <h2 className="font-display mt-3 text-xl font-semibold">Để hai bạn gần nhau hơn</h2>
          <p className="mt-2 text-ink-muted">{data.aspectText.tip}</p>
        </section>
      </div>

      <Faq id="hoi-dap" title={`Hỏi đáp về cặp ${same ? `${a.sign.name} và ${a.sign.name}` : `${a.sign.name} và ${b.sign.name}`}`} items={faq} />

      <CrushCta title="Cung hoàng đạo mới là một phần. Check thêm thần số học và con giáp để biết hai bạn hợp bao nhiêu phần trăm." />

      <section aria-labelledby="cap-khac" className="space-y-4 border-t border-line pt-8">
        <h2 id="cap-khac" className="font-display text-xl font-semibold">
          Cặp đôi khác
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {related.map(({ sign, others }) => (
            <div key={sign.slug}>
              <p className="text-sm text-ink-muted">{sign.name} và...</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {others.map((m) => (
                  <li key={m.sign.slug}>
                    <Link
                      href={`/cung-hoang-dao/cap-doi/${zodiacPairSlug(sign, m.sign)}`}
                      className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm transition-colors hover:border-accent"
                    >
                      {m.sign.name}
                      <span className="font-semibold text-accent tabular-nums">{m.score}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
