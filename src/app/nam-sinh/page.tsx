import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, CrushCta } from "@/components/kb-blocks";
import { canChiOfLunarYear } from "@/lib/engines/can-chi";
import { BIRTH_YEAR_RANGE, birthYearsWithContent, nguHanhContent } from "@/lib/kb/con-giap";
import { pageSeo } from "@/lib/site";

export const metadata: Metadata = {
  title: `Sinh năm bao nhiêu mệnh gì, tuổi con gì? Tra cứu từ ${BIRTH_YEAR_RANGE.from} đến ${BIRTH_YEAR_RANGE.to}`,
  description:
    "Tra cứu tuổi can chi, con giáp, mệnh ngũ hành (nạp âm) và ngày Tết của từng năm sinh, kèm màu hợp và tuổi hợp.",
  ...pageSeo("/nam-sinh"),
  robots: { index: nguHanhContent.meta.reviewed },
};

export default function BirthYearsIndexPage() {
  const years = birthYearsWithContent();
  const decades = [...new Set(years.map((y) => Math.floor(y / 10) * 10))];
  return (
    <div className="space-y-12 pt-8 md:pt-12">
      <div className="max-w-2xl space-y-4">
        <Breadcrumb items={[{ href: "/", label: "Trang chủ" }, { label: "Năm sinh" }]} />
        <h1 className="font-display text-4xl font-bold tracking-tighter md:text-5xl">
          Sinh năm <span className="text-gradient-brand">mệnh gì?</span>
        </h1>
        <p className="text-lg text-ink-muted">
          Chọn năm sinh để xem tuổi can chi, con giáp, mệnh ngũ hành và ngày Tết năm đó. Nếu bạn sinh trước Tết, hãy xem năm liền trước.
        </p>
      </div>

      {decades.map((d) => (
        <section key={d} aria-labelledby={`thap-nien-${d}`} className="space-y-4">
          <h2 id={`thap-nien-${d}`} className="font-display text-2xl font-semibold">
            Thập niên {d}
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {years
              .filter((y) => Math.floor(y / 10) * 10 === d)
              .map((y) => {
                const cc = canChiOfLunarYear(y);
                return (
                  <li key={y}>
                    <Link href={`/nam-sinh/${y}`} className="panel flex h-full flex-col gap-0.5 p-4 transition-colors hover:border-accent">
                      <span className="font-display text-2xl font-bold tabular-nums">{y}</span>
                      <span className="text-sm font-semibold">{cc.label}</span>
                      <span className="text-xs text-ink-muted">
                        Con {cc.animal} · Mệnh {cc.element}
                      </span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}

      <CrushCta title="Biết tuổi mình rồi, còn crush thì sao? Check xem hai bạn hợp nhau bao nhiêu." />
    </div>
  );
}
