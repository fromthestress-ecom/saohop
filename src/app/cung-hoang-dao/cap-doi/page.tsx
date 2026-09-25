import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/kb-blocks";
import { ZodiacIcon } from "@/components/zodiac-icon";
import { ZodiacPairPicker } from "@/components/zodiac-pair-picker";
import { ZODIAC_SIGNS } from "@/lib/engines/zodiac";
import { zodiacContent, zodiacMatches, zodiacPairSlug, zodiacPairsContent } from "@/lib/kb";

export const metadata: Metadata = {
  title: "Cặp đôi cung hoàng đạo: 78 cặp, cung nào hợp cung nào",
  description:
    "Xem độ hợp của mọi cặp cung hoàng đạo: góc chiếu, nguyên tố, điểm mạnh yếu khi yêu và gợi ý hẹn hò cho từng cặp.",
  alternates: { canonical: "/cung-hoang-dao/cap-doi" },
  robots: { index: zodiacContent.meta.reviewed && zodiacPairsContent.meta.reviewed },
};

export default function ZodiacPairsIndexPage() {
  return (
    <div className="space-y-12 pt-8 md:pt-12">
      <div className="max-w-2xl space-y-4">
        <Breadcrumb items={[{ href: "/", label: "Trang chủ" }, { href: "/cung-hoang-dao", label: "Cung hoàng đạo" }, { label: "Cặp đôi" }]} />
        <h1 className="font-display text-4xl font-bold tracking-tighter md:text-5xl">
          Cung nào <span className="text-gradient-brand">hợp cung nào?</span>
        </h1>
        <p className="text-lg text-ink-muted">Chọn hai cung để xem hai bạn hút nhau ở đâu, dễ va chạm ở đâu và nên hẹn hò thế nào.</p>
      </div>

      <ZodiacPairPicker />

      <section aria-labelledby="tat-ca" className="space-y-6">
        <h2 id="tat-ca" className="font-display text-2xl font-semibold">
          Tất cả cặp đôi theo cung
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {ZODIAC_SIGNS.map((sign) => {
            const partners = [
              { sign, score: null as number | null },
              ...zodiacMatches(sign).map((m) => ({ sign: m.sign, score: m.score as number | null })),
            ];
            return (
              <section key={sign.slug} className="panel p-5" aria-labelledby={`cd-${sign.slug}`}>
                <h3 id={`cd-${sign.slug}`} className="font-display flex items-center gap-2 text-lg font-semibold">
                  <ZodiacIcon slug={sign.slug} size={22} className="text-accent" />
                  {sign.name} và...
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {partners.map((p) => (
                    <li key={p.sign.slug}>
                      <Link
                        href={`/cung-hoang-dao/cap-doi/${zodiacPairSlug(sign, p.sign)}`}
                        className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm transition-colors hover:border-accent"
                      >
                        {p.sign.name}
                        {p.score !== null && <span className="font-semibold text-accent tabular-nums">{p.score}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
