import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, CrushCta } from "@/components/kb-blocks";
import { NGU_HANH } from "@/lib/engines/can-chi";
import { colorsOfElement, ELEMENT_SLUGS, elementSlugsWithContent, napAmOfElement, nguHanhContent } from "@/lib/kb/con-giap";
import { pageSeo } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ngũ hành: 5 mệnh Kim, Thủy, Mộc, Hỏa, Thổ, tương sinh tương khắc",
  description: "Tra cứu mệnh theo năm sinh: mệnh Kim, Thủy, Mộc, Hỏa, Thổ sinh năm nào, hợp màu gì, tương sinh và tương khắc với mệnh nào.",
  ...pageSeo("/ngu-hanh"),
  robots: { index: nguHanhContent.meta.reviewed },
};

export default function NguHanhIndexPage() {
  const withContent = new Set(elementSlugsWithContent());

  return (
    <article className="space-y-14 pt-8 md:pt-12">
      <header className="space-y-5">
        <Breadcrumb items={[{ href: "/", label: "Trang chủ" }, { label: "Ngũ hành" }]} />
        <h1 className="font-display text-4xl font-bold tracking-tighter md:text-6xl">
          Ngũ hành: <span className="text-gradient-brand">5 mệnh</span>
        </h1>
        <p className="max-w-[65ch] text-xl leading-relaxed text-ink-muted">
          Kim, Thủy, Mộc, Hỏa, Thổ là năm hành nuôi dưỡng và kiềm chế lẫn nhau. Mệnh của bạn được tính theo nạp âm của năm sinh âm lịch.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {NGU_HANH.map((e) => {
          const slug = ELEMENT_SLUGS[e];
          const years = napAmOfElement(e)
            .flatMap((n) => n.years)
            .filter((y) => y >= 1990 && y <= 2010)
            .sort((a, b) => a - b);
          const inner = (
            <>
              <span className="font-display text-gradient-brand text-3xl font-bold">Mệnh {e}</span>
              <span className="text-sm text-ink-muted">Màu: {colorsOfElement(e).own.join(", ")}</span>
              <span className="text-xs text-ink-muted tabular-nums">Sinh năm: {years.join(", ")}...</span>
            </>
          );
          return (
            <li key={e}>
              {withContent.has(slug) ? (
                <Link href={`/ngu-hanh/${slug}`} className="panel flex h-full flex-col gap-2 p-5 transition-colors hover:border-accent">
                  {inner}
                </Link>
              ) : (
                <div className="panel flex h-full flex-col gap-2 p-5 opacity-80">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>

      <section aria-labelledby="sinh-khac" className="grid gap-4 md:grid-cols-2">
        <h2 id="sinh-khac" className="sr-only">
          Tương sinh và tương khắc
        </h2>
        <div className="panel p-6">
          <h3 className="font-display text-xl font-semibold">Tương sinh</h3>
          <p className="mt-2 leading-relaxed text-ink-muted">
            Kim sinh Thủy, Thủy sinh Mộc, Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim. Hai mệnh tương sinh thường nâng đỡ và bổ sung cho nhau.
          </p>
        </div>
        <div className="panel p-6">
          <h3 className="font-display text-xl font-semibold">Tương khắc</h3>
          <p className="mt-2 leading-relaxed text-ink-muted">
            Kim khắc Mộc, Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim. Hai mệnh tương khắc cần nhiều thấu hiểu để cân bằng.
          </p>
        </div>
      </section>

      <CrushCta title="Bạn mệnh gì, người ấy mệnh gì? Check xem hai bạn tương sinh hay tương khắc." />
    </article>
  );
}
