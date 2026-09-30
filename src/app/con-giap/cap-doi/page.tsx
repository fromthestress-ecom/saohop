import type { Metadata } from "next";
import Link from "next/link";
import { ConGiapIcon } from "@/components/con-giap-icon";
import { Breadcrumb, CrushCta } from "@/components/kb-blocks";
import { DIA_CHI } from "@/lib/engines/can-chi";
import { conGiapContent, conGiapPairSlug, relationsOfChi } from "@/lib/kb/con-giap";
import { pageSeo } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hợp tuổi con giáp: 78 cặp tuổi, tuổi nào hợp tuổi nào",
  description:
    "Xem độ hợp của mọi cặp tuổi trong 12 con giáp: lục hợp, tam hợp, lục xung, lục hại, tứ hành xung, điểm hút nhau và chỗ dễ va chạm khi yêu.",
  ...pageSeo("/con-giap/cap-doi"),
  robots: { index: conGiapContent.meta.reviewed },
};

export default function ConGiapPairsIndexPage() {
  const pairs = conGiapContent.pairs;
  return (
    <div className="space-y-12 pt-8 md:pt-12">
      <div className="max-w-2xl space-y-4">
        <Breadcrumb items={[{ href: "/", label: "Trang chủ" }, { href: "/con-giap", label: "Con giáp" }, { label: "Cặp tuổi" }]} />
        <h1 className="font-display text-4xl font-bold tracking-tighter md:text-5xl">
          Tuổi nào <span className="text-gradient-brand">hợp tuổi nào?</span>
        </h1>
        <p className="text-lg text-ink-muted">
          Chọn tuổi của bạn rồi chọn tuổi của người ấy. Con số cạnh mỗi tuổi là điểm hợp theo quan hệ giữa hai con giáp.
        </p>
      </div>

      <section aria-labelledby="tat-ca" className="space-y-6">
        <h2 id="tat-ca" className="font-display text-2xl font-semibold">
          Tất cả cặp tuổi theo con giáp
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {DIA_CHI.map((chi, i) => {
            const partners = [
              { chi, index: i, score: null as number | null, relation: "Cùng tuổi" },
              ...relationsOfChi(i).flatMap((g) => g.chis.map((c) => ({ chi: c, index: c.index, score: g.score as number | null, relation: g.relation }))),
            ];
            return (
              <section key={chi.slug} className="panel p-5" aria-labelledby={`cd-${chi.slug}`}>
                <h3 id={`cd-${chi.slug}`} className="font-display flex items-center gap-2 text-lg font-semibold">
                  <ConGiapIcon slug={chi.slug} size={24} className="text-accent" />
                  Tuổi {chi.name} <span className="text-ink-muted">(con {chi.animal})</span> và...
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {partners.map((p) => {
                    const slug = conGiapPairSlug(i, p.index);
                    if (!pairs[slug]) return null;
                    return (
                      <li key={p.chi.slug}>
                        <Link
                          href={`/con-giap/cap-doi/${slug}`}
                          title={p.relation}
                          className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm transition-colors hover:border-accent"
                        >
                          {p.chi.name}
                          {p.score !== null && <span className="font-semibold text-accent tabular-nums">{p.score}</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </section>

      <CrushCta title="Muốn biết chính xác hơn? Check crush xét cả con giáp, cung hoàng đạo và thần số học của hai bạn." />
    </div>
  );
}
