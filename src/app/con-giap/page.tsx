import type { Metadata } from "next";
import Link from "next/link";
import { ConGiapIcon } from "@/components/con-giap-icon";
import { Breadcrumb, CrushCta } from "@/components/kb-blocks";
import { CHI_ELEMENT, chiRelation, DIA_CHI } from "@/lib/engines/can-chi";
import { birthYearsWithContent, conGiapContent, conGiapSlugsWithContent, yearsOfChi } from "@/lib/kb/con-giap";
import { pageSeo } from "@/lib/site";

export const metadata: Metadata = {
  title: "12 con giáp: tuổi nào sinh năm nào, hợp tuổi gì, kỵ tuổi gì",
  description:
    "Tra cứu 12 con giáp theo năm sinh âm lịch: tính cách, tình yêu, tuổi hợp và tuổi kỵ, các nhóm tam hợp, lục hợp và tứ hành xung.",
  ...pageSeo("/con-giap"),
  robots: { index: conGiapContent.meta.reviewed },
};

const CHIS = DIA_CHI.map((d, index) => ({ ...d, index }));
// Các nhóm suy ra từ engine để luôn khớp với trang từng tuổi và kết quả check crush.
const TAM_HOP = [0, 1, 2, 3].map((r) => CHIS.filter((c) => c.index % 4 === r));
const TU_HANH_XUNG = [0, 1, 2].map((r) => CHIS.filter((c) => c.index % 3 === r));
const LUC_HOP = CHIS.flatMap((a) => CHIS.filter((b) => b.index > a.index && chiRelation(a.index, b.index) === "Lục hợp").map((b) => [a, b] as const));

export default function ConGiapIndexPage() {
  const withContent = new Set(conGiapSlugsWithContent());
  const years = birthYearsWithContent();
  const names = (cs: typeof CHIS) => cs.map((c) => c.name).join(" · ");

  return (
    <article className="space-y-14 pt-8 md:pt-12">
      <header className="space-y-5">
        <Breadcrumb items={[{ href: "/", label: "Trang chủ" }, { label: "Con giáp" }]} />
        <h1 className="font-display text-4xl font-bold tracking-tighter md:text-6xl">
          12 <span className="text-gradient-brand">con giáp</span>
        </h1>
        <p className="max-w-[65ch] text-xl leading-relaxed text-ink-muted">
          Mỗi năm âm lịch ứng với một con giáp, bắt đầu từ Tết. Xem mình tuổi gì, tính cách ra sao, hợp và kỵ với tuổi nào.
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {CHIS.map((c) => {
          const recent = yearsOfChi(c.index, 1984, 2031).map((y) => y.lunarYear);
          const inner = (
            <>
              <span className="flex items-center justify-between gap-2">
                <span className="font-display text-gradient-brand text-3xl font-bold">{c.name}</span>
                <ConGiapIcon slug={c.slug} size={36} className="text-accent" />
              </span>
              <span className="text-sm font-semibold">Con {c.animal}</span>
              <span className="text-xs text-ink-muted tabular-nums">{recent.join(" · ")}</span>
              <span className="text-xs text-ink-muted">Hành {CHI_ELEMENT[c.index]}</span>
            </>
          );
          return (
            <li key={c.slug}>
              {withContent.has(c.slug) ? (
                <Link href={`/con-giap/${c.slug}`} className="panel flex h-full flex-col gap-1 p-5 transition-colors hover:border-accent">
                  {inner}
                </Link>
              ) : (
                <div className="panel flex h-full flex-col gap-1 p-5 opacity-80">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>

      <section aria-labelledby="nhom" className="grid gap-4 md:grid-cols-3">
        <h2 id="nhom" className="sr-only">
          Các nhóm tuổi hợp và xung
        </h2>
        <div className="panel p-6">
          <h3 className="font-display text-xl font-semibold">Tam hợp</h3>
          <p className="mt-1 text-sm text-ink-muted">{conGiapContent.relations["Tam hợp"].headline}</p>
          <ul className="mt-3 space-y-1.5 font-semibold">
            {TAM_HOP.map((g) => (
              <li key={g[0].slug}>{names(g)}</li>
            ))}
          </ul>
        </div>
        <div className="panel p-6">
          <h3 className="font-display text-xl font-semibold">Lục hợp</h3>
          <p className="mt-1 text-sm text-ink-muted">{conGiapContent.relations["Lục hợp"].headline}</p>
          <ul className="mt-3 space-y-1.5 font-semibold">
            {LUC_HOP.map(([a, b]) => (
              <li key={a.slug}>
                {a.name} · {b.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="panel p-6">
          <h3 className="font-display text-xl font-semibold">Tứ hành xung</h3>
          <p className="mt-1 text-sm text-ink-muted">{conGiapContent.relations["Tứ hành xung"].headline}</p>
          <ul className="mt-3 space-y-1.5 font-semibold">
            {TU_HANH_XUNG.map((g) => (
              <li key={g[0].slug}>{names(g)}</li>
            ))}
          </ul>
        </div>
      </section>

      <p>
        <Link href="/con-giap/cap-doi" className="font-semibold text-accent hover:underline">
          Xem độ hợp của cả 78 cặp tuổi →
        </Link>
      </p>

      {years.length > 0 && (
        <section aria-labelledby="nam-sinh" className="space-y-4">
          <h2 id="nam-sinh" className="font-display text-2xl font-semibold md:text-3xl">
            Tra cứu theo <Link href="/nam-sinh" className="hover:text-accent">năm sinh</Link>
          </h2>
          <ul className="flex flex-wrap gap-2">
            {years.map((y) => (
              <li key={y}>
                <Link href={`/nam-sinh/${y}`} className="block rounded-full border border-line px-4 py-2 text-sm tabular-nums hover:border-accent">
                  {y}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <CrushCta title="Bạn tuổi gì, crush tuổi gì? Check xem hai bạn hợp nhau bao nhiêu phần trăm." />
    </article>
  );
}
