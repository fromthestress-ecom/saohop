import { IconArrowRight } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/kb-blocks";
import { lifePathContent, lifePathSlug } from "@/lib/kb";

export const metadata: Metadata = {
  title: "Thần số học: ý nghĩa 12 số chủ đạo và cách tính",
  description:
    "Cách tính số chủ đạo theo ngày sinh và ý nghĩa từng số từ 2 đến 11, 22, 33: tính cách, tình yêu, sự nghiệp và số hợp nhau.",
  alternates: { canonical: "/than-so-hoc" },
  robots: { index: lifePathContent.meta.reviewed },
};

export default function NumerologyIndexPage() {
  return (
    <div className="space-y-12 pt-8 md:pt-12">
      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
        <div className="space-y-4">
          <Breadcrumb items={[{ href: "/", label: "Trang chủ" }, { label: "Thần số học" }]} />
          <h1 className="font-display text-4xl font-bold tracking-tighter md:text-5xl">
            Ý nghĩa <span className="text-gradient-brand">số chủ đạo</span>
          </h1>
          <p className="max-w-[60ch] text-lg text-ink-muted">
            Số chủ đạo là con số quan trọng nhất trong thần số học Pythagoras, cho biết xu hướng tính cách và bài học lớn của mỗi người.
          </p>
        </div>
        <section className="panel p-6" aria-labelledby="cach-tinh">
          <h2 id="cach-tinh" className="font-display text-lg font-semibold">
            Cách tính
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Cộng mọi chữ số của ngày sinh, rút gọn đến khi còn từ 2 đến 11. Giữ nguyên 22 và 33.
          </p>
          <p className="mt-3 font-mono text-sm tabular-nums">
            14/11/2003: 1+4+1+1+2+0+0+3 = 12, 1+2 = <span className="font-bold text-accent">3</span>
          </p>
          <Link href="/ban-do" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
            Tính tự động cho bạn <IconArrowRight size={16} aria-hidden />
          </Link>
        </section>
      </div>

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {lifePathContent.entries.map((e) => (
          <li key={e.number}>
            <Link
              href={`/than-so-hoc/${lifePathSlug(e.number)}`}
              className="panel group flex h-full flex-col justify-between gap-6 p-5 transition-colors hover:border-accent"
            >
              <span className="font-display text-gradient-brand text-5xl font-bold tracking-tighter tabular-nums transition-transform duration-300 group-hover:translate-x-1">
                {e.number}
              </span>
              <span>
                <span className="block font-semibold">{e.title}</span>
                {[11, 22, 33].includes(e.number) && <span className="text-xs text-ink-muted">Số master</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
