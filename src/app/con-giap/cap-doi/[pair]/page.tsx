import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConGiapIcon } from "@/components/con-giap-icon";
import { Breadcrumb, CrushCta, DeepSection, Faq, Toc } from "@/components/kb-blocks";
import { verdictOf } from "@/lib/engines/compatibility";
import { conGiapContent, conGiapPairSlugsWithContent, conGiapSlugsWithContent, getConGiapPair } from "@/lib/kb/con-giap";
import { pageSeo } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return conGiapPairSlugsWithContent().map((pair) => ({ pair }));
}

export async function generateMetadata({ params }: PageProps<"/con-giap/cap-doi/[pair]">): Promise<Metadata> {
  const data = getConGiapPair((await params).pair);
  if (!data) return {};
  const { a, b, score, article } = data;
  const names = a.slug === b.slug ? `Hai người tuổi ${a.name}` : `Tuổi ${a.name} và tuổi ${b.name}`;
  return {
    title: `${names} có hợp nhau không? Độ hợp ${score}/100`,
    description: article.summary,
    ...pageSeo(`/con-giap/cap-doi/${data.slug}`, { ownImage: true }),
    robots: { index: conGiapContent.meta.reviewed },
  };
}

function ChiBadge({ name, animal, slug, linked }: { name: string; animal: string; slug: string; linked: boolean }) {
  const badge = (
    <>
      <span
        className="flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg shadow-accent-2/30 md:h-24 md:w-24"
        style={{ backgroundImage: "linear-gradient(135deg, var(--btn-from), var(--btn-to))" }}
        aria-hidden
      >
        <ConGiapIcon slug={slug} className="h-3/5 w-3/5" />
      </span>
      <span className="font-display text-xl font-semibold">Tuổi {name}</span>
      <span className="text-xs text-ink-muted">Con {animal}</span>
    </>
  );
  return linked ? (
    <Link href={`/con-giap/${slug}`} className="flex flex-col items-center gap-2 text-center transition-transform hover:scale-105">
      {badge}
    </Link>
  ) : (
    <div className="flex flex-col items-center gap-2 text-center">{badge}</div>
  );
}

export default async function ConGiapPairPage({ params }: PageProps<"/con-giap/cap-doi/[pair]">) {
  const data = getConGiapPair((await params).pair);
  if (!data) notFound();
  const { a, b, relation, score, relationText, article } = data;
  const same = a.slug === b.slug;
  const pairName = same ? `hai người tuổi ${a.name}` : `tuổi ${a.name} và tuổi ${b.name}`;
  const animalPages = new Set(conGiapSlugsWithContent());

  const faq = [
    {
      q: same ? `Hai người tuổi ${a.name} có hợp nhau không?` : `Tuổi ${a.name} và tuổi ${b.name} có hợp nhau không?`,
      a: `Xét riêng con giáp, ${pairName} thuộc quan hệ ${relation.toLowerCase()}, đạt ${score}/100 điểm, xếp loại "${verdictOf(score)}". ${relationText.body}`,
    },
    ...article.deep.faq,
  ];
  const toc = [...article.deep.sections.map((s) => ({ id: s.id, label: s.heading })), { id: "hoi-dap", label: "Hỏi đáp" }];

  return (
    <article className="space-y-12 pt-8 md:pt-12">
      <header className="space-y-8">
        <Breadcrumb
          items={[
            { href: "/", label: "Trang chủ" },
            { href: "/con-giap", label: "Con giáp" },
            { href: "/con-giap/cap-doi", label: "Cặp tuổi" },
            { label: same ? `Hai tuổi ${a.name}` : `${a.name} và ${b.name}` },
          ]}
        />
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tighter md:text-5xl">
              {same ? `Hai người tuổi ${a.name}` : `Tuổi ${a.name} và tuổi ${b.name}`}
            </h1>
            <p className="font-display text-gradient-brand mt-2 text-2xl font-semibold md:text-3xl">{relationText.headline}</p>
            <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-ink-muted">{article.summary}</p>
          </div>
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <ChiBadge name={a.name} animal={a.animal} slug={a.slug} linked={animalPages.has(a.slug)} />
            <span className="font-display text-gradient-brand pb-10 text-3xl font-bold" aria-hidden>
              &
            </span>
            <ChiBadge name={b.name} animal={b.animal} slug={b.slug} linked={animalPages.has(b.slug)} />
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="panel p-5">
            <dt className="text-sm text-ink-muted">Độ hợp theo con giáp</dt>
            <dd className="font-display text-gradient-brand text-5xl font-bold tracking-tighter tabular-nums">{score}</dd>
          </div>
          <div className="panel p-5">
            <dt className="text-sm text-ink-muted">Quan hệ</dt>
            <dd className="font-display mt-1 text-2xl font-semibold">{relation}</dd>
          </div>
          <div className="panel col-span-2 p-5">
            <dt className="text-sm text-ink-muted">{relationText.headline}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-ink-muted">{relationText.body}</dd>
          </div>
        </dl>
      </header>

      <Toc items={toc} />
      {article.deep.sections.map((section) => (
        <DeepSection key={section.id} {...section} />
      ))}

      <Faq id="hoi-dap" title={`Hỏi đáp về ${pairName}`} items={faq} />

      <CrushCta title="Con giáp mới là một phần. Check thêm thần số học và cung hoàng đạo để biết hai bạn hợp bao nhiêu phần trăm." />
    </article>
  );
}
