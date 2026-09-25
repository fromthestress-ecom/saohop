import { IconArrowLeft, IconArrowRight, IconBriefcase, IconBulb } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, CrushCta, Highlight, TraitColumns } from "@/components/kb-blocks";
import { LIFE_PATH_NUMBERS } from "@/lib/engines/numerology";
import { getLifePath, lifePathContent, lifePathMatches, lifePathSlug, parseLifePathSlug } from "@/lib/kb";

export const dynamicParams = false;

export function generateStaticParams() {
  return LIFE_PATH_NUMBERS.map((n) => ({ slug: lifePathSlug(n) }));
}

function load(slug: string) {
  const n = parseLifePathSlug(slug);
  const entry = n === null ? null : getLifePath(n);
  return n === null || !entry ? null : { n, entry };
}

export async function generateMetadata({ params }: PageProps<"/than-so-hoc/[slug]">): Promise<Metadata> {
  const data = load((await params).slug);
  if (!data) return {};
  return {
    title: `Số chủ đạo ${data.n}: ${data.entry.title}, tình yêu, sự nghiệp, hợp số nào`,
    description: data.entry.summary,
    alternates: { canonical: `/than-so-hoc/${lifePathSlug(data.n)}` },
    robots: { index: lifePathContent.meta.reviewed },
  };
}

export default async function LifePathPage({ params }: PageProps<"/than-so-hoc/[slug]">) {
  const data = load((await params).slug);
  if (!data) notFound();
  const { n, entry } = data;
  const matches = lifePathMatches(n);
  const best = matches.filter((m) => m.relation === "Cùng nhóm");
  const i = LIFE_PATH_NUMBERS.indexOf(n as (typeof LIFE_PATH_NUMBERS)[number]);
  const prev = LIFE_PATH_NUMBERS[(i + LIFE_PATH_NUMBERS.length - 1) % LIFE_PATH_NUMBERS.length];
  const next = LIFE_PATH_NUMBERS[(i + 1) % LIFE_PATH_NUMBERS.length];

  return (
    <article className="space-y-12 pt-8 md:pt-12">
      <header className="space-y-6">
        <Breadcrumb items={[{ href: "/", label: "Trang chủ" }, { href: "/than-so-hoc", label: "Thần số học" }, { label: `Số ${n}` }]} />
        <div className="flex items-end gap-6">
          <span className="font-display text-gradient-brand text-8xl font-bold leading-none tracking-tighter tabular-nums md:text-9xl">
            {n}
          </span>
          <div className="pb-2">
            <p className="text-ink-muted">Số chủ đạo{[11, 22, 33].includes(n) ? ", số master" : ""}</p>
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-5xl">{entry.title}</h1>
          </div>
        </div>
        <p className="max-w-[65ch] text-xl leading-relaxed">{entry.summary}</p>
      </header>

      <TraitColumns good={entry.strengths} watch={entry.challenges} watchLabel="Thử thách" />

      <Highlight title={`Số ${n} khi yêu`}>{entry.inLove}</Highlight>

      <section aria-labelledby="hop" className="space-y-4">
        <h2 id="hop" className="font-display text-2xl font-semibold">
          Số {n} hợp với số nào?
        </h2>
        <ul className="flex flex-wrap gap-3">
          {best.map((m) => (
            <li key={m.number}>
              <Link
                href={`/than-so-hoc/${lifePathSlug(m.number)}`}
                className="panel flex items-center gap-3 px-5 py-3 transition-colors hover:border-accent"
              >
                <span className="font-display text-gradient-brand text-3xl font-bold tabular-nums">{m.number}</span>
                <span className="text-sm text-ink-muted">{m.score} điểm</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="max-w-[65ch] text-sm text-ink-muted">
          Theo nhóm tương hợp của thần số học Pythagoras (2-4-8, 3-6-9, 1-5-7), số master được xét theo số gốc: 11 là 2, 22 là 4, 33 là 6, còn
          10 là 1.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="panel p-6">
          <IconBriefcase size={28} stroke={1.5} className="text-accent" aria-hidden />
          <h2 className="font-display mt-3 text-xl font-semibold">Sự nghiệp phù hợp</h2>
          <p className="mt-2 text-ink-muted">{entry.career}</p>
        </section>
        <section className="panel p-6">
          <IconBulb size={28} stroke={1.5} className="text-accent-3" aria-hidden />
          <h2 className="font-display mt-3 text-xl font-semibold">Lời khuyên cho số {n}</h2>
          <p className="mt-2 text-ink-muted">{entry.advice}</p>
        </section>
      </div>

      <CrushCta title={`Số chủ đạo của crush có hợp với số ${n} không?`} />

      <nav aria-label="Số khác" className="flex justify-between gap-4 border-t border-line pt-6 text-sm">
        <Link href={`/than-so-hoc/${lifePathSlug(prev)}`} className="flex items-center gap-2 text-ink-muted hover:text-ink">
          <IconArrowLeft size={16} aria-hidden /> Số {prev}
        </Link>
        <Link href={`/than-so-hoc/${lifePathSlug(next)}`} className="flex items-center gap-2 text-ink-muted hover:text-ink">
          Số {next} <IconArrowRight size={16} aria-hidden />
        </Link>
      </nav>
    </article>
  );
}
