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
