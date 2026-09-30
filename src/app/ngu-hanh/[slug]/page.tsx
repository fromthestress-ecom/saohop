import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, CrushCta, DeepSection, Faq, Toc, TraitColumns } from "@/components/kb-blocks";
import type { NguHanh } from "@/lib/engines/can-chi";
import { birthYearsWithContent, ELEMENT_SLUGS, elementSlugsWithContent, getElement, nguHanhContent } from "@/lib/kb/con-giap";
import { pageSeo } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return elementSlugsWithContent().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/ngu-hanh/[slug]">): Promise<Metadata> {
  const data = getElement((await params).slug);
  if (!data) return {};
  return {
    title: `Mệnh ${data.name}: sinh năm nào, hợp màu gì, hợp mệnh nào`,
    description: data.entry.summary,
    ...pageSeo(`/ngu-hanh/${data.slug}`, { ownImage: true }),
    robots: { index: nguHanhContent.meta.reviewed },
  };
}

const list = (xs: string[]) => xs.join(", ");

export default async function ElementPage({ params }: PageProps<"/ngu-hanh/[slug]">) {
  const data = getElement((await params).slug);
  if (!data) notFound();
  const { name, entry, colors, napAm } = data;
  const deep = entry.deep;
  const elementPages = new Set(elementSlugsWithContent());
  const yearPages = new Set(birthYearsWithContent());
  const recentYears = napAm.flatMap((n) => n.years).filter((y) => y >= 1960 && y <= 2020).sort((x, y) => x - y);

  const elementLink = (e: NguHanh) =>
    elementPages.has(ELEMENT_SLUGS[e]) ? (
      <Link href={`/ngu-hanh/${ELEMENT_SLUGS[e]}`} className="font-semibold text-accent hover:underline">
        {e}
      </Link>
    ) : (
      <span className="font-semibold">{e}</span>
    );

  const cycle = [
    { label: "Được sinh bởi", el: data.generatedBy, note: `${data.generatedBy} sinh ${name}: nguồn nuôi dưỡng, hỗ trợ người mệnh ${name}.` },
    { label: "Sinh ra", el: data.generates, note: `${name} sinh ${data.generates}: người mệnh ${name} thường là chỗ dựa cho người mệnh ${data.generates}.` },
    { label: "Khắc", el: data.controls, note: `${name} khắc ${data.controls}: dễ lấn át, cần mềm mỏng khi làm việc cùng nhau.` },
    { label: "Bị khắc bởi", el: data.controlledBy, note: `${data.controlledBy} khắc ${name}: dễ bị áp lực, nên hiểu và giữ cân bằng.` },
  ];

  const faq = [
    {
      q: `Mệnh ${name} sinh năm nào?`,
      a: `Người mệnh ${name} sinh vào các năm âm lịch ${list(recentYears.map(String))} (trong khoảng 1960 đến 2020), ứng với 6 nạp âm: ${list(napAm.map((n) => n.name))}.`,
    },
    {
      q: `Mệnh ${name} hợp màu gì?`,
      a: `Màu bản mệnh là ${list(colors.own)}. Màu tương sinh (hành ${data.generatedBy} sinh ${name}) là ${list(colors.supportive)}. Nên hạn chế ${list(colors.avoid)}, màu của hành ${data.controlledBy} khắc ${name}.`,
    },
    {
      q: `Mệnh ${name} hợp mệnh nào?`,
      a: `Theo ngũ hành tương sinh, mệnh ${name} hợp với mệnh ${data.generatedBy} (sinh ra ${name}) và mệnh ${data.generates} (được ${name} sinh ra), cùng mệnh ${name} thì bình hoà. Mệnh ${data.controlledBy} và mệnh ${data.controls} là hai hành tương khắc với ${name}.`,
    },
    ...(deep?.faq ?? []),
  ];
  const toc = [
    { id: "sinh-khac", label: `Mệnh ${name} hợp mệnh nào` },
    { id: "mau-hop", label: `Mệnh ${name} hợp màu gì` },
    { id: "nap-am", label: `Mệnh ${name} sinh năm nào` },
    ...(deep?.sections.map((s) => ({ id: s.id, label: s.heading })) ?? []),
    { id: "hoi-dap", label: "Hỏi đáp" },
  ];

  return (
    <article className="space-y-12 pt-8 md:pt-12">
      <header className="space-y-6">
        <Breadcrumb items={[{ href: "/", label: "Trang chủ" }, { href: "/ngu-hanh", label: "Ngũ hành" }, { label: `Mệnh ${name}` }]} />
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <span
            className="font-display flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-3xl font-bold text-white shadow-lg shadow-accent-2/30"
            style={{ backgroundImage: "linear-gradient(135deg, var(--btn-from), var(--btn-to))" }}
            aria-hidden
          >
            {name}
          </span>
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tighter md:text-6xl">
              Mệnh <span className="text-gradient-brand">{name}</span>
            </h1>
            <p className="mt-2 text-ink-muted">
              {data.generatedBy} sinh {name}, {name} sinh {data.generates}
            </p>
          </div>
        </div>
        <p className="max-w-[65ch] text-xl leading-relaxed">{entry.summary}</p>
      </header>

      <TraitColumns good={entry.strengths} watch={entry.weaknesses} />
      <Toc items={toc} />

      <section aria-labelledby="sinh-khac" className="scroll-mt-24 space-y-4">
        <h2 id="sinh-khac" className="font-display text-2xl font-semibold md:text-3xl">
          Mệnh {name} hợp mệnh nào
        </h2>
        <p className="max-w-[68ch] text-lg leading-relaxed text-ink-muted">
          Ngũ hành vận hành theo hai vòng: tương sinh (Kim sinh Thủy, Thủy sinh Mộc, Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim) và tương khắc
          (Kim khắc Mộc, Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim).
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {cycle.map((c) => (
            <li key={c.label} className="panel p-5">
              <p className="text-sm text-ink-muted">{c.label}</p>
              <p className="font-display mt-1 text-2xl">{elementLink(c.el)}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{c.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="mau-hop" className="scroll-mt-24 space-y-4">
        <h2 id="mau-hop" className="font-display text-2xl font-semibold md:text-3xl">
          Mệnh {name} hợp màu gì
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="panel p-5">
            <p className="text-sm text-ink-muted">Màu bản mệnh</p>
            <p className="mt-1 font-semibold">{list(colors.own)}</p>
          </div>
          <div className="panel p-5">
            <p className="text-sm text-ink-muted">Màu tương sinh ({data.generatedBy} sinh {name})</p>
            <p className="mt-1 font-semibold">{list(colors.supportive)}</p>
          </div>
          <div className="panel p-5">
            <p className="text-sm text-ink-muted">Nên hạn chế ({data.controlledBy} khắc {name})</p>
            <p className="mt-1 font-semibold">{list(colors.avoid)}</p>
          </div>
        </div>
        <p className="text-sm text-ink-muted">Màu sắc theo ngũ hành mang tính tham khảo, hãy chọn những gì khiến bạn thấy thoải mái và tự tin.</p>
      </section>

      <section aria-labelledby="nap-am" className="scroll-mt-24 space-y-4">
        <h2 id="nap-am" className="font-display text-2xl font-semibold md:text-3xl">
          Mệnh {name} sinh năm nào
        </h2>
        <p className="max-w-[68ch] text-lg leading-relaxed text-ink-muted">
          Ở Việt Nam, mệnh thường được tính theo nạp âm của năm sinh âm lịch. Hành {name} có 6 nạp âm, mỗi nạp âm ứng với hai năm liền nhau và
          lặp lại sau 60 năm.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-surface-2 text-ink-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Nạp âm</th>
                <th scope="col" className="px-4 py-3 font-semibold">Can chi</th>
                <th scope="col" className="px-4 py-3 font-semibold">Năm sinh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {napAm.map((n) => (
                <tr key={n.name}>
                  <td className="px-4 py-3 font-semibold">{n.name}</td>
                  <td className="px-4 py-3">{n.labels.join(", ")}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {n.years.map((y, i) => (
                      <span key={y}>
                        {i > 0 && ", "}
                        {yearPages.has(y) ? (
                          <Link href={`/nam-sinh/${y}`} className="text-accent hover:underline">
                            {y}
                          </Link>
                        ) : (
                          y
                        )}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-ink-muted">Người sinh trước Tết âm lịch thuộc năm trước, nên mệnh cũng tính theo năm trước.</p>
      </section>

      {deep?.sections.map((section) => (
        <DeepSection key={section.id} {...section} />
      ))}

      <Faq id="hoi-dap" title={`Hỏi đáp về mệnh ${name}`} items={faq} />

      <CrushCta title={`Người ấy mệnh gì? Check xem hai bạn tương sinh hay tương khắc`} />
    </article>
  );
}
