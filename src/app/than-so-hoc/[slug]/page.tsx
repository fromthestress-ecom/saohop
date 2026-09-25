import { IconArrowLeft, IconArrowRight, IconBriefcase, IconBulb, IconCalculator } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, CrushCta, DeepSection, Faq, Highlight, Toc, TraitColumns } from "@/components/kb-blocks";
import { LIFE_PATH_NUMBERS } from "@/lib/engines/numerology";
import { getLifePath, lifePathContent, lifePathExample, lifePathMatches, lifePathSlug, parseLifePathSlug, type LifePathExample } from "@/lib/kb";

const pad = (x: number) => String(x).padStart(2, "0");
const formatDate = ({ day, month, year }: LifePathExample["date"]) => `${pad(day)}/${pad(month)}/${year}`;
const digitsOf = (x: number) => String(x).split("").join(" + ");

/** Các dòng phép tính: tổng các chữ số ngày sinh, rồi từng lần rút gọn. */
function calcLines(ex: LifePathExample) {
  const lines = [`${ex.digits.join(" + ")} = ${ex.total}`];
  let prev = ex.total;
  for (const step of ex.steps) {
    lines.push(`${digitsOf(prev)} = ${step}`);
    prev = step;
  }
  return lines;
}

function calcNote(n: number, ex: LifePathExample) {
  if (n === 22 || n === 33) return `Tổng bằng ${n} là số master nên được giữ nguyên, không cộng tiếp thành ${digitsOf(n)} = ${n === 22 ? 4 : 6}.`;
  if (n === 10) return "Trường phái Pythagoras phổ biến ở Việt Nam dừng lại ở 10, không cộng tiếp thành 1.";
  if (n === 11) return "11 là số master nên được giữ nguyên, không cộng tiếp thành 2.";
  return ex.steps.length > 1 ? "Cộng tiếp cho đến khi kết quả nằm trong khoảng 2 đến 11." : null;
}

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
  const deep = entry.deep;
  const example = lifePathExample(n);
  const note = example ? calcNote(n, example) : null;
  const bestList = best.map((m) => m.number).join(", ");
  const faq = [
    ...(example
      ? [
          {
            q: `Làm sao biết mình có số chủ đạo ${n}?`,
            a: `Cộng tất cả chữ số trong ngày, tháng, năm sinh dương lịch rồi rút gọn. Ví dụ người sinh ngày ${formatDate(example.date)} có tổng các chữ số là ${example.total}${example.steps.length ? `, rút gọn thành ${example.steps.join(" rồi ")}` : ""}, nên có số chủ đạo ${n}. Bạn có thể nhập ngày sinh ở trang Bản đồ bản thân để Sao Hợp tính tự động.`,
          },
        ]
      : []),
    ...(best.length
      ? [
          {
            q: `Số chủ đạo ${n} hợp với số nào?`,
            a: `Theo nhóm tương hợp của thần số học Pythagoras, số ${n} hợp nhất với ${best.length > 1 ? "các số" : "số"} ${bestList} vì cùng nhóm, nhịp sống và cách nghĩ dễ ăn khớp. Độ hợp thật sự còn tuỳ vào nhiều yếu tố khác, khi check crush Sao Hợp tính thêm cung hoàng đạo và con giáp.`,
          },
        ]
      : []),
    ...(deep?.faq ?? []),
  ];
  const toc = deep
    ? [
        ...(example ? [{ id: "cach-tinh", label: `Cách tính số chủ đạo ${n}` }] : []),
        ...deep.sections.map((s) => ({ id: s.id, label: s.heading })),
        { id: "hop", label: `Số ${n} hợp với số nào` },
        { id: "hoi-dap", label: "Hỏi đáp" },
      ]
    : [];

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

      {deep && <Toc items={toc} />}

      {example && (
        <section aria-labelledby="cach-tinh" className="scroll-mt-24 space-y-4">
          <h2 id="cach-tinh" className="font-display text-2xl font-semibold md:text-3xl">
            Cách tính số chủ đạo {n}
          </h2>
          <p className="max-w-[68ch] text-lg leading-relaxed text-ink-muted">
            Cộng tất cả chữ số trong ngày, tháng, năm sinh dương lịch, rồi cộng tiếp các chữ số của tổng cho đến khi còn một số từ 2 đến 11.
            Riêng tổng bằng 22 hoặc 33 được giữ nguyên vì đây là số master.
          </p>
          <div className="panel p-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink-muted">
              <IconCalculator size={18} stroke={1.5} className="text-accent" aria-hidden />
              Ví dụ: sinh ngày <span className="tabular-nums text-ink">{formatDate(example.date)}</span>
            </p>
            <ol className="mt-4 space-y-2 font-display text-xl tabular-nums md:text-2xl">
              {calcLines(example).map((line, idx, all) => (
                <li key={line} className={idx === all.length - 1 ? "font-bold" : "text-ink-muted"}>
                  {line}
                  {idx === all.length - 1 && <span className="text-gradient-brand"> → số {n}</span>}
                </li>
              ))}
            </ol>
            {note && <p className="mt-4 text-sm text-ink-muted">{note}</p>}
          </div>
          <Link href="/ban-do" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
            Tính số chủ đạo của bạn <IconArrowRight size={16} aria-hidden />
          </Link>
        </section>
      )}

      {deep ? (
        deep.sections.map((section) => (
          <div key={section.id} className="space-y-12">
            <DeepSection {...section} />
            {section.id === "chinh-phuc" && <CrushCta title={`Thử xem số chủ đạo của crush có hợp với số ${n} không`} />}
          </div>
        ))
      ) : (
        <Highlight title={`Số ${n} khi yêu`}>{entry.inLove}</Highlight>
      )}

      <section aria-labelledby="hop" className="scroll-mt-24 space-y-4">
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

      <Faq id="hoi-dap" title={`Hỏi đáp về số chủ đạo ${n}`} items={faq} />

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
