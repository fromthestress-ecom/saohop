import { IconArrowRight, IconCheck, IconAlertTriangle } from "@tabler/icons-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function Breadcrumb({ items }: { items: Array<{ href?: string; label: string }> }) {
  return (
    <nav aria-label="Đường dẫn" className="text-sm text-ink-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Hai cột ưu điểm / điểm cần lưu ý */
export function TraitColumns({
  good,
  watch,
  goodLabel = "Điểm mạnh",
  watchLabel = "Điểm cần lưu ý",
}: {
  good: string[];
  watch: string[];
  goodLabel?: string;
  watchLabel?: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="panel p-6">
        <h2 className="font-display text-xl font-semibold">{goodLabel}</h2>
        <ul className="mt-4 space-y-3">
          {good.map((t) => (
            <li key={t} className="flex gap-3">
              <IconCheck size={20} stroke={2} className="mt-0.5 shrink-0 text-accent" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </section>
      <section className="panel p-6">
        <h2 className="font-display text-xl font-semibold">{watchLabel}</h2>
        <ul className="mt-4 space-y-3">
          {watch.map((t) => (
            <li key={t} className="flex gap-3 text-ink-muted">
              <IconAlertTriangle size={20} stroke={1.5} className="mt-0.5 shrink-0 text-accent-3" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/** Đoạn văn nổi bật (khi yêu), có vạch gradient bên trái */
export function Highlight({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="relative pl-6">
      <span className="bg-gradient-brand absolute bottom-1 left-0 top-1 w-1 rounded-full" aria-hidden />
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-3 max-w-[65ch] text-lg leading-relaxed text-ink-muted">{children}</p>
    </section>
  );
}

export interface TocItem {
  id: string;
  label: string;
}

/** Mục lục cho bài viết dài */
export function Toc({ items }: { items: TocItem[] }) {
  return (
    <nav aria-labelledby="toc-title" className="panel p-6">
      <h2 id="toc-title" className="text-sm font-semibold uppercase tracking-wider text-ink-muted">
        Trong bài này
      </h2>
      <ol className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {items.map((item, i) => (
          <li key={item.id} className="flex gap-3">
            <span className="w-5 shrink-0 text-right text-sm tabular-nums text-ink-muted">{i + 1}</span>
            <a href={`#${item.id}`} className="hover:text-accent">
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Một mục của bài viết chuyên sâu: tiêu đề, các đoạn văn và gạch đầu dòng nếu có */
export function DeepSection({ id, heading, paragraphs, bullets }: { id: string; heading: string; paragraphs: string[]; bullets?: string[] }) {
  return (
    <section aria-labelledby={id} className="scroll-mt-24 space-y-4">
      <h2 id={id} className="font-display text-2xl font-semibold md:text-3xl">
        {heading}
      </h2>
      {paragraphs.map((p) => (
        <p key={p} className=" text-lg leading-relaxed text-ink-muted">
          {p}
        </p>
      ))}
      {bullets && (
        <ul className="max-w-[68ch] space-y-3 pt-1">
          {bullets.map((b) => (
            <li key={b} className="flex gap-3 text-lg leading-relaxed">
              <IconCheck size={20} stroke={2} className="mt-1.5 shrink-0 text-accent" aria-hidden />
              {b}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Hỏi đáp dạng gập mở */
export function Faq({ id, title, items }: { id: string; title: string; items: Array<{ q: string; a: string }> }) {
  return (
    <section aria-labelledby={id} className="scroll-mt-24 space-y-4">
      <h2 id={id} className="font-display text-2xl font-semibold md:text-3xl">
        {title}
      </h2>
      <div className="divide-y divide-line border-y border-line">
        {items.map((item) => (
          <details key={item.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
              {item.q}
              <IconArrowRight size={18} className="shrink-0 text-ink-muted transition-transform group-open:rotate-90" aria-hidden />
            </summary>
            <p className="mt-3 max-w-[68ch] leading-relaxed text-ink-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function CrushCta({ title }: { title: string }) {
  return (
    <section
      className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-line p-6 md:flex-row md:items-center md:p-8"
      style={{ background: "linear-gradient(120deg, var(--nebula-2), var(--nebula-1) 55%, var(--nebula-3))" }}
    >
      <h2 className="font-display max-w-[30ch] text-2xl font-semibold">{title}</h2>
      <Link href="/crush" className="btn-primary btn-halo">
        Check crush
        <IconArrowRight size={18} stroke={2} aria-hidden />
      </Link>
    </section>
  );
}
