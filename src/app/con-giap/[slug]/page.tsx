import { IconArrowRight } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConGiapIcon } from "@/components/con-giap-icon";
import { Breadcrumb, CrushCta, DeepSection, Faq, Highlight, Toc, TraitColumns } from "@/components/kb-blocks";
import {
  birthYearsWithContent,
  conGiapContent,
  conGiapPairSlug,
  conGiapPairSlugsWithContent,
  conGiapSlugsWithContent,
  ELEMENT_SLUGS,
  elementSlugsWithContent,
  getConGiap,
} from "@/lib/kb/con-giap";
import { pageSeo } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return conGiapSlugsWithContent().map((slug) => ({ slug }));
}

const pad = (n: number) => String(n).padStart(2, "0");

export async function generateMetadata({ params }: PageProps<"/con-giap/[slug]">): Promise<Metadata> {
  const data = getConGiap((await params).slug);
  if (!data) return {};
  const { chi, entry } = data;
  return {
    title: `Tuổi ${chi.name} (con ${chi.animal}): sinh năm nào, tính cách, hợp tuổi gì`,
    description: entry.summary,
    ...pageSeo(`/con-giap/${chi.slug}`, { ownImage: true }),
    robots: { index: conGiapContent.meta.reviewed },
  };
}

export default async function ConGiapPage({ params }: PageProps<"/con-giap/[slug]">) {
  const data = getConGiap((await params).slug);
  if (!data) notFound();
  const { chi, entry, years, relations } = data;
  const deep = entry.deep;
  const pairPages = new Set(conGiapPairSlugsWithContent());
  const yearPages = new Set(birthYearsWithContent());
  const elementPages = new Set(elementSlugsWithContent());
  const good = relations.filter((g) => g.relation === "Lục hợp" || g.relation === "Tam hợp");
  const hard = relations.filter((g) => g.relation === "Lục xung" || g.relation === "Lục hại" || g.relation === "Tứ hành xung");
  const names = (gs: typeof relations) => gs.map((g) => `${g.chis.map((c) => c.name).join(", ")} (${g.relation.toLowerCase()})`).join("; ");
  const recent = years.filter((y) => y.lunarYear >= 1960 && y.lunarYear <= 2020).map((y) => y.lunarYear);

  const faq = [
    {
      q: `Tuổi ${chi.name} sinh năm nào?`,
      a: `Tuổi ${chi.name} gồm những người sinh vào các năm âm lịch ${recent.join(", ")}... Lưu ý năm âm lịch bắt đầu từ Tết, nên người sinh tháng 1 hoặc đầu tháng 2 dương lịch có thể vẫn thuộc tuổi của năm trước.`,
    },
    { q: `Tuổi ${chi.name} hợp tuổi gì?`, a: `Tuổi ${chi.name} hợp nhất với ${names(good)}.` },
    {
      q: `Tuổi ${chi.name} kỵ tuổi gì?`,
      a: `Tuổi ${chi.name} dễ va chạm với ${names(hard)}. Đây chỉ là xu hướng tham khảo, hiểu và nhường nhịn nhau thì mọi cặp tuổi đều có thể hoà hợp.`,
    },
    ...(deep?.faq ?? []),
  ];
  const toc = [
    { id: "sinh-nam", label: `Tuổi ${chi.name} sinh năm nào` },
    ...(deep?.sections.map((s) => ({ id: s.id, label: s.heading })) ?? []),
    { id: "hop-tuoi", label: `Tuổi ${chi.name} hợp tuổi gì, kỵ tuổi gì` },
    { id: "hoi-dap", label: "Hỏi đáp" },
  ];

  return (
    <article className="space-y-12 pt-8 md:pt-12">
      <header className="space-y-6">
        <Breadcrumb items={[{ href: "/", label: "Trang chủ" }, { href: "/con-giap", label: "Con giáp" }, { label: `Tuổi ${chi.name}` }]} />
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <span
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-white shadow-lg shadow-accent-2/30"
            style={{ backgroundImage: "linear-gradient(135deg, var(--btn-from), var(--btn-to))" }}
            aria-hidden
          >
            <ConGiapIcon slug={chi.slug} size={60} />
          </span>
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tighter md:text-6xl">
              Tuổi <span className="text-gradient-brand">{chi.name}</span>
            </h1>
            <p className="mt-2 text-ink-muted">
              Con {chi.animal}, đứng thứ {chi.index + 1} trong 12 con giáp
            </p>
          </div>
        </div>
        <ul className="flex flex-wrap gap-2 text-sm">
          {[`Con ${chi.animal}`, `Địa chi hành ${chi.element}`, `Thứ ${chi.index + 1}/12`].map((chip) => (
            <li key={chip} className="rounded-full border border-line px-4 py-1.5">
              {chip}
            </li>
          ))}
        </ul>
        <p className="max-w-[65ch] text-xl leading-relaxed">{entry.summary}</p>
      </header>

      <TraitColumns good={entry.strengths} watch={entry.weaknesses} />

      {deep ? <Toc items={toc} /> : <Highlight title={`Tuổi ${chi.name} khi yêu`}>{entry.inLove}</Highlight>}

      <section aria-labelledby="sinh-nam" className="scroll-mt-24 space-y-4">
        <h2 id="sinh-nam" className="font-display text-2xl font-semibold md:text-3xl">
          Tuổi {chi.name} sinh năm nào
        </h2>
        <p className="max-w-[68ch] text-lg leading-relaxed text-ink-muted">
          Mỗi năm tuổi {chi.name} bắt đầu từ ngày Tết âm lịch. Người sinh từ 1/1 dương lịch đến trước ngày Tết vẫn thuộc tuổi của năm trước.
          Mệnh trong bảng là nạp âm của năm, cách tính mệnh phổ biến ở Việt Nam.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-surface-2 text-ink-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Năm</th>
                <th scope="col" className="px-4 py-3 font-semibold">Can chi</th>
                <th scope="col" className="px-4 py-3 font-semibold">Mệnh (nạp âm)</th>
                <th scope="col" className="px-4 py-3 font-semibold">Bắt đầu từ Tết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {years.map((y) => (
                <tr key={y.lunarYear}>
                  <td className="px-4 py-3 font-semibold tabular-nums">
                    {yearPages.has(y.lunarYear) ? (
                      <Link href={`/nam-sinh/${y.lunarYear}`} className="text-accent hover:underline">
                        {y.lunarYear}
                      </Link>
                    ) : (
                      y.lunarYear
                    )}
                  </td>
                  <td className="px-4 py-3">{y.label}</td>
                  <td className="px-4 py-3">
                    {y.napAm}{" "}
                    {elementPages.has(ELEMENT_SLUGS[y.element]) ? (
                      <Link href={`/ngu-hanh/${ELEMENT_SLUGS[y.element]}`} className="text-accent hover:underline">
                        ({y.element})
                      </Link>
                    ) : (
                      <span className="text-ink-muted">({y.element})</span>
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-ink-muted">
                    {pad(y.tet.day)}/{pad(y.tet.month)}/{y.tet.year}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {deep?.sections.map((section) => (
        <div key={section.id} className="space-y-12">
          <DeepSection {...section} />
          {section.id === "chinh-phuc" && <CrushCta title={`Crush của bạn tuổi gì? Thử xem hai bạn hợp nhau bao nhiêu phần trăm`} />}
        </div>
      ))}

      <section aria-labelledby="hop-tuoi" className="scroll-mt-24 space-y-4">
        <h2 id="hop-tuoi" className="font-display text-2xl font-semibold md:text-3xl">
          Tuổi {chi.name} hợp tuổi gì, kỵ tuổi gì
        </h2>
        <ul className="grid gap-3 md:grid-cols-2">
          {relations.map((g) => (
            <li key={g.relation} className="panel p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-semibold">{g.relation}</h3>
                <span className="font-display text-gradient-brand text-2xl font-bold tabular-nums">{g.score}</span>
              </div>
              <p className="mt-1 text-sm text-ink-muted">{conGiapContent.relations[g.relation].headline}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {g.chis.map((c) => {
                  const slug = conGiapPairSlug(chi.index, c.index);
                  return (
                    <li key={c.slug}>
                      {pairPages.has(slug) ? (
                        <Link
                          href={`/con-giap/cap-doi/${slug}`}
                          className="flex items-center gap-1 rounded-full border border-accent px-3 py-1 text-sm font-semibold text-accent hover:bg-accent/10"
                        >
                          {chi.name} và {c.name} <IconArrowRight size={14} aria-hidden />
                        </Link>
                      ) : (
                        <span className="block rounded-full border border-line px-3 py-1 text-sm">Tuổi {c.name}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
        <p className="text-sm text-ink-muted">
          Điểm chỉ xét riêng con giáp. Kết quả check crush còn cộng thêm thần số học, cung hoàng đạo và ngũ hành.
        </p>
      </section>

      <Faq id="hoi-dap" title={`Hỏi đáp về tuổi ${chi.name}`} items={faq} />

      <CrushCta title={`Người ấy có hợp với tuổi ${chi.name} không?`} />
    </article>
  );
}
