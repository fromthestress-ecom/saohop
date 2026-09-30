import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, CrushCta, Faq } from "@/components/kb-blocks";
import type { SolarDate } from "@/lib/engines/types";
import { birthYearsWithContent, colorsOfElement, getBirthYear, nguHanhContent, relationsOfChi } from "@/lib/kb/con-giap";
import { pageSeo } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return birthYearsWithContent().map((year) => ({ year: String(year) }));
}

const pad = (n: number) => String(n).padStart(2, "0");
const fmt = (d: SolarDate) => `${pad(d.day)}/${pad(d.month)}/${d.year}`;
/** Ngày liền trước một ngày dương lịch. */
const dayBefore = (d: SolarDate): SolarDate => {
  const t = new Date(Date.UTC(d.year, d.month - 1, d.day - 1));
  return { day: t.getUTCDate(), month: t.getUTCMonth() + 1, year: t.getUTCFullYear() };
};

export async function generateMetadata({ params }: PageProps<"/nam-sinh/[year]">): Promise<Metadata> {
  const data = getBirthYear(Number((await params).year));
  if (!data) return {};
  const { year, canChi } = data;
  return {
    title: `Sinh năm ${year} mệnh gì, tuổi con gì? Tuổi ${canChi.label}, mệnh ${canChi.element}`,
    description: `Người sinh năm ${year} tuổi ${canChi.label} (con ${canChi.animal}), mệnh ${canChi.element} (${canChi.napAm}). Tết năm ${year} là ngày ${fmt(data.tet)}, xem hợp màu gì, hợp tuổi gì.`,
    ...pageSeo(`/nam-sinh/${year}`, { ownImage: true }),
    robots: { index: nguHanhContent.meta.reviewed },
  };
}

export default async function BirthYearPage({ params }: PageProps<"/nam-sinh/[year]">) {
  const data = getBirthYear(Number((await params).year));
  if (!data) notFound();
  const { year, canChi, can, chi, tet, nextTet, previous } = data;
  const colors = colorsOfElement(canChi.element);
  const relations = relationsOfChi(chi.index);
  // "Mùi (lục hợp), Dần, Tuất (tam hợp)": mỗi nhóm tuổi đi kèm đúng quan hệ của nó.
  const describe = (rels: string[]) =>
    relations
      .filter((g) => rels.includes(g.relation))
      .map((g) => `${g.chis.map((c) => c.name).join(", ")} (${g.relation.toLowerCase()})`)
      .join(", ");
  const good = describe(["Lục hợp", "Tam hợp"]);
  const hard = describe(["Lục xung", "Lục hại"]);
  const years = new Set(birthYearsWithContent());

  const facts = [
    { label: "Tuổi (can chi)", value: canChi.label },
    { label: "Con giáp", value: `Con ${canChi.animal}`, href: data.hasConGiapPage ? `/con-giap/${chi.slug}` : undefined },
    { label: "Mệnh (nạp âm)", value: `${canChi.element} · ${canChi.napAm}`, href: data.hasElementPage ? `/ngu-hanh/${data.elementSlug}` : undefined },
    { label: "Tết năm " + year, value: fmt(tet) },
  ];

  const faq = [
    {
      q: `Sinh năm ${year} mệnh gì?`,
      a: `Người sinh năm ${year} (tính theo năm âm lịch) mệnh ${canChi.element}, nạp âm ${canChi.napAm}.`,
    },
    { q: `Sinh năm ${year} tuổi con gì?`, a: `Sinh năm ${year} là tuổi ${canChi.label}, con ${canChi.animal}.` },
    {
      q: `Sinh tháng 1 năm ${year} thuộc tuổi gì?`,
      a: `Tết năm ${year} rơi vào ngày ${fmt(tet)}. Người sinh từ 01/01/${year} đến ${fmt(dayBefore(tet))} vẫn thuộc năm ${previous.label} (${year - 1}), mệnh ${previous.element} (${previous.napAm}). Người sinh từ ${fmt(tet)} trở đi mới thuộc tuổi ${canChi.label}.`,
    },
    ...(colors
      ? [
          {
            q: `Sinh năm ${year} hợp màu gì?`,
            a: `Người mệnh ${canChi.element} hợp màu bản mệnh ${colors.own.join(", ")} và màu tương sinh ${colors.supportive.join(", ")}. Nên hạn chế ${colors.avoid.join(", ")}.`,
          },
        ]
      : []),
    {
      q: `Sinh năm ${year} hợp tuổi gì?`,
      a: `Theo con giáp, tuổi ${chi.name} hợp với tuổi ${good} và dễ va chạm với tuổi ${hard}.`,
    },
  ];

  return (
    <article className="space-y-12 pt-8 md:pt-12">
      <header className="space-y-6">
        <Breadcrumb items={[{ href: "/", label: "Trang chủ" }, { href: "/nam-sinh", label: "Năm sinh" }, { label: `Sinh năm ${year}` }]} />
        <h1 className="font-display text-4xl font-bold tracking-tighter md:text-6xl">
          Sinh năm {year}: tuổi <span className="text-gradient-brand">{canChi.label}</span>, mệnh {canChi.element}
        </h1>
        <p className="max-w-[65ch] text-xl leading-relaxed">
          Người sinh năm {year} âm lịch là tuổi {canChi.label}, con {canChi.animal}, mang mệnh {canChi.element} với nạp âm {canChi.napAm}. Năm{" "}
          {canChi.label} bắt đầu từ Tết ngày {fmt(tet)} và kéo dài đến hết ngày {fmt(dayBefore(nextTet))}.
        </p>
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="panel flex flex-col gap-1 p-5">
              <dt className="text-sm text-ink-muted">{f.label}</dt>
              <dd className="font-display text-xl font-semibold">
                {f.href ? (
                  <Link href={f.href} className="text-accent hover:underline">
                    {f.value}
                  </Link>
                ) : (
                  f.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <section aria-labelledby="truoc-tet" className="panel space-y-2 p-6">
        <h2 id="truoc-tet" className="font-display text-xl font-semibold">
          Sinh đầu năm {year} trước Tết thì sao?
        </h2>
        <p className="leading-relaxed text-ink-muted">
          Tuổi và mệnh tính theo năm âm lịch, bắt đầu từ Tết. Người sinh từ 01/01/{year} đến {fmt(dayBefore(tet))} vẫn thuộc năm{" "}
          <span className="font-semibold text-ink">{previous.label}</span>
          {years.has(year - 1) && (
            <>
              {" "}
              (
              <Link href={`/nam-sinh/${year - 1}`} className="text-accent hover:underline">
                xem năm {year - 1}
              </Link>
              )
            </>
          )}
          , mệnh {previous.element} ({previous.napAm}).
        </p>
      </section>

      <section aria-labelledby="ba-hanh" className="space-y-4">
        <h2 id="ba-hanh" className="font-display text-2xl font-semibold md:text-3xl">
          Can {canChi.can}, chi {chi.name} và nạp âm {canChi.napAm}
        </h2>
        <p className="max-w-[68ch] text-lg leading-relaxed text-ink-muted">
          Một năm can chi có ba lớp ngũ hành: thiên can {canChi.can} thuộc hành {can.element} ({can.yang ? "dương" : "âm"}), địa chi {chi.name} thuộc
          hành {chi.element}, và nạp âm {canChi.napAm} thuộc hành {canChi.element}. Khi nói &quot;sinh năm {year} mệnh gì&quot;, người Việt thường
          dùng hành của nạp âm, tức mệnh {canChi.element}.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="panel p-6">
            <h3 className="font-display text-xl font-semibold">Thiên can {canChi.can}</h3>
            <p className="mt-2 leading-relaxed text-ink-muted">{data.canText}</p>
          </div>
          <div className="panel p-6">
            <h3 className="font-display text-xl font-semibold">Nạp âm {canChi.napAm}</h3>
            <p className="mt-2 leading-relaxed text-ink-muted">{data.napAmText}</p>
          </div>
        </div>
      </section>

      {colors && (
        <section aria-labelledby="mau-hop" className="space-y-4">
          <h2 id="mau-hop" className="font-display text-2xl font-semibold md:text-3xl">
            Sinh năm {year} hợp màu gì
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="panel p-5">
              <p className="text-sm text-ink-muted">Màu bản mệnh {canChi.element}</p>
              <p className="mt-1 font-semibold">{colors.own.join(", ")}</p>
            </div>
            <div className="panel p-5">
              <p className="text-sm text-ink-muted">Màu tương sinh</p>
              <p className="mt-1 font-semibold">{colors.supportive.join(", ")}</p>
            </div>
            <div className="panel p-5">
              <p className="text-sm text-ink-muted">Nên hạn chế</p>
              <p className="mt-1 font-semibold">{colors.avoid.join(", ")}</p>
            </div>
          </div>
        </section>
      )}

      <Faq id="hoi-dap" title={`Hỏi đáp về người sinh năm ${year}`} items={faq} />

      <CrushCta title={`Sinh năm ${year} và crush có hợp nhau không? Check ngay bằng ngày sinh của hai bạn`} />
    </article>
  );
}
