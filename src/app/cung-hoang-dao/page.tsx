import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/kb-blocks";
import { ZodiacIcon } from "@/components/zodiac-icon";
import { ELEMENT_KEYWORDS } from "@/lib/content/keywords";
import { ZODIAC_SIGNS } from "@/lib/engines/zodiac";
import { zodiacContent, zodiacDateRange } from "@/lib/kb";

export const metadata: Metadata = {
  title: "12 cung hoàng đạo: tính cách, tình yêu và cung hợp nhau",
  description:
    "Tra cứu 12 cung hoàng đạo theo ngày sinh: tính cách, điểm mạnh, cách yêu, cung hợp nhất và gợi ý hẹn hò cho từng cung.",
  alternates: { canonical: "/cung-hoang-dao" },
  robots: { index: zodiacContent.meta.reviewed },
};

const ELEMENTS = ["Lửa", "Đất", "Khí", "Nước"] as const;

export default function ZodiacIndexPage() {
  return (
    <div className="space-y-12 pt-8 md:pt-12">
      <div className="max-w-2xl space-y-4">
        <Breadcrumb items={[{ href: "/", label: "Trang chủ" }, { label: "Cung hoàng đạo" }]} />
        <h1 className="font-display text-4xl font-bold tracking-tighter md:text-5xl">
          12 <span className="text-gradient-brand">cung hoàng đạo</span>
        </h1>
        <Link href="/cung-hoang-dao/cap-doi" className="btn-secondary w-fit">
          Xem cung nào hợp cung nào
        </Link>
        <p className="text-lg text-ink-muted">
          Cung hoàng đạo được xác định theo ngày sinh dương lịch. Chọn cung của bạn hoặc của crush để xem tính cách, cách yêu và
          cung hợp nhất.
        </p>
      </div>

      {ELEMENTS.map((element) => (
        <section key={element} aria-labelledby={`nt-${element}`}>
          <div className="mb-4 flex flex-wrap items-baseline gap-x-3">
            <h2 id={`nt-${element}`} className="font-display text-2xl font-semibold">
              Nhóm {element}
            </h2>
            <p className="text-ink-muted">{ELEMENT_KEYWORDS[element]}</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {ZODIAC_SIGNS.filter((s) => s.element === element).map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/cung-hoang-dao/${s.slug}`}
                  className="panel group flex items-center gap-4 p-5 transition-colors hover:border-accent"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-110">
                    <ZodiacIcon slug={s.slug} size={26} />
                  </span>
                  <span>
                    <span className="font-display block text-lg font-semibold">{s.name}</span>
                    <span className="text-sm text-ink-muted tabular-nums">{zodiacDateRange(s)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
