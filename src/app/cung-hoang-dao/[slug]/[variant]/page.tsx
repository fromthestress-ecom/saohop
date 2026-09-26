import { IconArrowRight, IconCalendarEvent, IconInfoCircle } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, CrushCta, DeepSection, Faq, Toc } from "@/components/kb-blocks";
import { ZodiacIcon } from "@/components/zodiac-icon";
import { ZODIAC_SIGNS } from "@/lib/engines/zodiac";
import { getZodiacVariant, zodiacContent, zodiacMatches, zodiacPairSlug, zodiacVariantLinks, zodiacVariantsContent } from "@/lib/kb";
import { pageSeo } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return ZODIAC_SIGNS.flatMap((s) => zodiacVariantLinks(s).map((l) => ({ slug: s.slug, variant: l.variant })));
}

const pad = (n: number) => String(n).padStart(2, "0");

export async function generateMetadata({ params }: PageProps<"/cung-hoang-dao/[slug]/[variant]">): Promise<Metadata> {
  const { slug, variant } = await params;
  const data = getZodiacVariant(slug, variant);
  if (!data) return {};
  const title =
    data.kind === "thang" && data.monthRange
      ? `${data.label} (${pad(data.monthRange.from)}/${pad(data.month!)} - ${pad(data.monthRange.to)}/${pad(data.month!)}): tính cách, tình yêu và điểm khác biệt`
      : `${data.label}: tính cách, khi yêu, dấu hiệu thích bạn và cách chinh phục`;
  return {
    title,
    description: data.article.summary,
    ...pageSeo(`/cung-hoang-dao/${slug}/${variant}`, { ownImage: true }),
    robots: { index: zodiacContent.meta.reviewed && zodiacVariantsContent.meta.reviewed },
  };
}

export default async function ZodiacVariantPage({ params }: PageProps<"/cung-hoang-dao/[slug]/[variant]">) {
  const { slug, variant } = await params;
  const data = getZodiacVariant(slug, variant);
  if (!data) notFound();
  const { sign, entry, article, kind, month, monthRange, label } = data;
  const deep = article.deep;

  const best = zodiacMatches(sign).slice(0, 4);
  const siblings = zodiacVariantLinks(sign).filter((l) => l.variant !== variant);
  const otherMonth = siblings.find((l) => l.kind === "thang");

  const faq = [
    ...(kind === "thang" && monthRange
      ? [
          {
            q: `${label} là những ngày nào?`,
            a: `${label} gồm những người sinh từ ngày ${pad(monthRange.from)}/${pad(month!)} đến ngày ${pad(monthRange.to)}/${pad(month!)}. Cả cung ${sign.name} kéo dài từ ${data.dateRange.replace(" - ", " đến ")}${otherMonth ? `, phần còn lại thuộc ${otherMonth.label}` : ""}.`,
          },
        ]
      : []),
    {
      q: `${label} hợp với cung nào?`,
      a: `Xét theo góc chiếu của cung ${sign.name}, ${label} hợp nhất với ${best
        .slice(0, 2)
        .map((m) => m.sign.name)
        .join(" và ")}, tiếp theo là ${best
        .slice(2)
        .map((m) => m.sign.name)
        .join(" và ")}. Độ hợp thật sự còn tuỳ vào thần số học và con giáp của hai người, bạn có thể check crush để xem đầy đủ.`,
    },
    ...deep.faq,
  ];

  const toc = [
    ...(kind === "thang" ? [{ id: "thap-do", label: `Thập độ của ${label}` }] : []),
    ...deep.sections.map((s) => ({ id: s.id, label: s.heading })),
    { id: "hop", label: `${label} hợp với cung nào` },
    { id: "hoi-dap", label: "Hỏi đáp" },
  ];
  const ctaAfter = kind === "thang" ? "khi-yeu" : "chinh-phuc";

  return (
    <article className="space-y-12 pt-8 md:pt-12">
      <header className="space-y-6">
        <Breadcrumb
          items={[
            { href: "/", label: "Trang chủ" },
            { href: "/cung-hoang-dao", label: "Cung hoàng đạo" },
            { href: `/cung-hoang-dao/${sign.slug}`, label: sign.name },
            { label },
          ]}
        />
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <Link
            href={`/cung-hoang-dao/${sign.slug}`}
            aria-label={`Cung ${sign.name}`}
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-white shadow-lg shadow-accent-2/30 transition-transform duration-300 hover:scale-105"
            style={{ backgroundImage: "linear-gradient(135deg, var(--btn-from), var(--btn-to))" }}
          >
            <ZodiacIcon slug={sign.slug} size={52} />
          </Link>
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tighter md:text-6xl">
              {sign.name} <span className="text-gradient-brand">{label.slice(sign.name.length + 1)}</span>
            </h1>
            <p className="mt-2 text-ink-muted tabular-nums">
              {kind === "thang" && monthRange
                ? `Sinh từ ${pad(monthRange.from)}/${pad(month!)} đến ${pad(monthRange.to)}/${pad(month!)}`
                : `${data.dateRange} · Nguyên tố ${sign.element} · Chủ quản: ${entry.ruler}`}
            </p>
          </div>
        </div>
        <p className="max-w-[65ch] text-xl leading-relaxed">{article.summary}</p>
        {kind !== "thang" && (
          <p className="flex max-w-[65ch] gap-2 text-sm text-ink-muted">
            <IconInfoCircle size={18} stroke={1.5} className="mt-0.5 shrink-0 text-accent" aria-hidden />
            Giới tính không quyết định tính cách. Bài viết mô tả những nét của cung {sign.name} thường được nhắc tới ở {kind === "nam" ? "nam" : "nữ"}
            , mỗi người vẫn có cách thể hiện riêng.
          </p>
        )}
      </header>

      <Toc items={toc} />

      {kind === "thang" && (
        <section aria-labelledby="thap-do" className="scroll-mt-24 space-y-4">
          <h2 id="thap-do" className="font-display text-2xl font-semibold md:text-3xl">
            Thập độ của {label}
          </h2>
          <p className="max-w-[68ch] text-lg leading-relaxed text-ink-muted">
            Mỗi cung hoàng đạo được chia thành ba thập độ, mỗi thập độ khoảng 10 ngày. Thập độ đầu mang đậm chất của chính cung, hai thập độ sau
            pha thêm màu sắc của hai cung cùng nguyên tố {sign.element}. Đây là lý do người sinh đầu cung và cuối cung thường có những nét khác nhau.
          </p>
          <ul className="grid gap-3 md:grid-cols-2">
            {data.decans.map((d) => (
              <li key={d.index} className="panel flex items-center gap-4 p-5">
                <IconCalendarEvent size={28} stroke={1.5} className="shrink-0 text-accent" aria-hidden />
                <div>
                  <p className="font-semibold tabular-nums">
                    {d.from === d.to ? `${pad(d.from)}/${pad(month!)}` : `${pad(d.from)}/${pad(month!)} - ${pad(d.to)}/${pad(month!)}`}
                  </p>
                  <p className="text-sm text-ink-muted">
                    Thập độ {d.index}
                    {d.coSign.slug === sign.slug ? (
                      <>, thuần {sign.name}</>
                    ) : (
                      <>
                        , pha thêm nét của{" "}
                        <Link href={`/cung-hoang-dao/${d.coSign.slug}`} className="text-accent hover:underline">
                          {d.coSign.name}
                        </Link>
                      </>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {deep.sections.map((section) => (
        <div key={section.id} className="space-y-12">
          <DeepSection {...section} />
          {section.id === ctaAfter && <CrushCta title={`Crush của bạn có hợp với ${label} không?`} />}
        </div>
      ))}

      <section aria-labelledby="hop" className="scroll-mt-24 space-y-4">
        <h2 id="hop" className="font-display text-2xl font-semibold md:text-3xl">
          {label} hợp với cung nào?
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
      </section>

      <Faq id="hoi-dap" title={`Hỏi đáp về ${label}`} items={faq} />

      <nav aria-labelledby="xem-them" className="space-y-4 border-t border-line pt-8">
        <h2 id="xem-them" className="font-display text-xl font-semibold">
          Xem thêm về cung {sign.name}
        </h2>
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href={`/cung-hoang-dao/${sign.slug}`}
              className="flex items-center gap-1.5 rounded-full border border-accent px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
            >
              Tất cả về {sign.name} <IconArrowRight size={16} aria-hidden />
            </Link>
          </li>
          {siblings.map((l) => (
            <li key={l.variant}>
              <Link href={l.href} className="block rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-accent">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
