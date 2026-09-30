import { IconArrowUpRight } from "@tabler/icons-react";
import { elementRelation } from "@/lib/engines/can-chi";
import { GROUP_LABEL, NUMBER_GROUPS, type CompatFactor } from "@/lib/engines/compatibility";
import { baseNumber } from "@/lib/engines/numerology";
import type { PersonProfile } from "@/lib/engines/profile";
import type { CrushGlossary } from "@/lib/kb/crush-glossary";
import { BIRTH_YEAR_RANGE, conGiapPairSlug, ELEMENT_ORDER, ELEMENT_SLUGS, lifePathSlug, unorderedKey, zodiacPairSlug } from "@/lib/kb/slugs";

interface Person {
  /** Khoá để gộp khi hai người giống nhau (cùng số, cùng cung...). */
  key: string;
  heading: string;
  text?: string;
}

interface Details {
  explain: string[];
  people: [Person, Person];
  tip?: string;
  links: Array<{ href: string; label: string }>;
}

const GROUPS_TEXT =
  "Thần số học chia các số thành ba nhóm: tự do và độc lập (1, 5, 7), thực tế và vun đắp (2, 4, 8), sáng tạo và cảm xúc (3, 6, 9). Số 10, 11, 22, 33 xét theo số gốc 1, 2, 4, 6.";

function numberGroupText(x: number, y: number, score: number) {
  const gx = GROUP_LABEL[NUMBER_GROUPS[baseNumber(x)]];
  const gy = GROUP_LABEL[NUMBER_GROUPS[baseNumber(y)]];
  if (x === y) return `Hai bạn cùng số ${x}. Cùng số thì hiểu nhau rất nhanh, nhưng cũng dễ thấy khuyết điểm của chính mình ở người kia, nên được ${score} điểm.`;
  if (gx === gy) return `Số ${x} và số ${y} cùng nhóm ${gx}, nhịp sống tự nhiên ăn khớp nên được ${score} điểm, mức cao nhất của thần số học.`;
  return `Số ${x} thuộc nhóm ${gx}, số ${y} thuộc nhóm ${gy}. Khác nhóm thì cần thời gian để hiểu nhau và bù trừ cho nhau, nên được ${score} điểm.`;
}

function describe(f: CompatFactor, a: PersonProfile, b: PersonProfile, nameA: string, nameB: string, g: CrushGlossary): Details {
  switch (f.system) {
    case "so-chu-dao": {
      const [x, y] = [a.numerology.lifePath, b.numerology.lifePath];
      const person = (n: number): Person => ({ key: String(n), heading: `Số ${n}${g.lifePath[n] ? `: ${g.lifePath[n].title}` : ""}`, text: g.lifePath[n]?.summary });
      return {
        explain: ["Số chủ đạo tính từ ngày sinh dương lịch, cho biết con đường và cách sống của mỗi người.", GROUPS_TEXT, numberGroupText(x, y, f.score)],
        people: [person(x), person(y)],
        links: [...new Set([x, y])].filter((n) => g.lifePath[n]).map((n) => ({ href: `/than-so-hoc/${lifePathSlug(n)}`, label: `Số chủ đạo ${n}` })),
      };
    }
    case "so-linh-hon": {
      const [x, y] = [a.numerology.name!.soulUrge, b.numerology.name!.soulUrge];
      const person = (n: number): Person => ({ key: String(n), heading: `Số ${n}`, text: `Thuộc nhóm ${GROUP_LABEL[NUMBER_GROUPS[baseNumber(n)]]}.` });
      return {
        explain: [
          "Số linh hồn tính từ các nguyên âm trong họ tên, cho biết điều mỗi người thật sự khao khát bên trong. Cách so giống số chủ đạo.",
          GROUPS_TEXT,
          numberGroupText(x, y, f.score),
        ],
        people: [person(x), person(y)],
        links: [{ href: "/than-so-hoc", label: "Tìm hiểu thần số học" }],
      };
    }
    case "cung-hoang-dao": {
      const [sa, sb] = [a.zodiac.sign, b.zodiac.sign];
      const raw = Math.abs(sa.index - sb.index);
      const aspect = g.aspects[String(Math.min(raw, 12 - raw))];
      const elementText = g.zodiacElements[unorderedKey(ELEMENT_ORDER, sa.element, sb.element)];
      const person = (s: typeof sa): Person => ({ key: s.slug, heading: `${s.name} (${s.element})`, text: g.zodiac[s.slug] });
      return {
        explain: [`${aspect.headline}. ${aspect.body}`, elementText].filter(Boolean),
        people: [person(sa), person(sb)],
        tip: aspect.tip,
        links: [
          { href: `/cung-hoang-dao/cap-doi/${zodiacPairSlug(sa, sb)}`, label: sa.slug === sb.slug ? `Hai người ${sa.name}` : `${sa.name} và ${sb.name}` },
          ...[...new Set([sa, sb])].map((s) => ({ href: `/cung-hoang-dao/${s.slug}`, label: `Cung ${s.name}` })),
        ],
      };
    }
    case "con-giap": {
      const [ca, cb] = [a.canChi, b.canChi];
      const rel = g.chiRelations[f.relation];
      const person = (c: typeof ca): Person => ({ key: c.animalSlug, heading: `Tuổi ${c.chi} (con ${c.animal})`, text: g.animals[c.animalSlug] });
      return {
        explain: [
          "Con giáp tính theo năm âm lịch, tức là bắt đầu từ Tết chứ không phải từ 1/1. Mỗi cặp tuổi thuộc một quan hệ: lục hợp, tam hợp, bình hoà, tứ hành xung, lục hại hoặc lục xung.",
          ...(rel ? [`${rel.headline}. ${rel.body}`] : []),
        ],
        people: [person(ca), person(cb)],
        links: [
          { href: `/con-giap/cap-doi/${conGiapPairSlug(ca.chiIndex, cb.chiIndex)}`, label: ca.chiIndex === cb.chiIndex ? `Hai tuổi ${ca.chi}` : `Tuổi ${ca.chi} và tuổi ${cb.chi}` },
          ...[...new Set([ca.animalSlug, cb.animalSlug])].map((slug) => ({
            href: `/con-giap/${slug}`,
            label: `Tuổi ${slug === ca.animalSlug ? ca.chi : cb.chi}`,
          })),
        ],
      };
    }
    case "ngu-hanh": {
      const [ca, cb] = [a.canChi, b.canChi];
      // Tên mặc định "Bạn"/"Crush" viết thường khi nằm giữa câu.
      const [inA, inB] = [nameA === "Bạn" ? "bạn" : nameA, nameB === "Crush" ? "crush" : nameB];
      const [ea, eb] = [ca.element, cb.element];
      const rel = elementRelation(ea, eb);
      const why =
        rel === "Bình hoà"
          ? `Hai bạn cùng mệnh ${ea}: dễ đồng cảm và cùng nhịp, nhưng cũng dễ thiếu điều mới lạ để bổ sung cho nhau.`
          : rel === "Sinh ra" || rel === "Được sinh"
            ? `Theo vòng tương sinh: Kim sinh Thủy, Thủy sinh Mộc, Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim. ${rel === "Sinh ra" ? `${ea} sinh ${eb}, nên ${inA} (${ea}) như nguồn nâng đỡ cho ${inB} (${eb})` : `${eb} sinh ${ea}, nên ${inB} (${eb}) như nguồn nâng đỡ cho ${inA} (${ea})`}.`
            : `Theo vòng tương khắc: Kim khắc Mộc, Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim. ${rel === "Khắc" ? `${ea} khắc ${eb}, nên ${inA} (${ea}) dễ vô tình lấn át ${inB} (${eb})` : `${eb} khắc ${ea}, nên ${inB} (${eb}) dễ vô tình lấn át ${inA} (${ea})`}. Hai bạn cần nhường nhịn và giữ khoảng riêng cho nhau.`;
      const person = (c: typeof ca): Person => ({ key: c.napAm, heading: `Mệnh ${c.element}: ${c.napAm}`, text: g.napAm[c.napAm] });
      const years = [ca, cb].filter((c, i, all) => all.findIndex((o) => o.lunarYear === c.lunarYear) === i && c.lunarYear >= BIRTH_YEAR_RANGE.from && c.lunarYear <= BIRTH_YEAR_RANGE.to);
      return {
        explain: [`Mệnh tính theo nạp âm của năm sinh âm lịch: ${ca.label} là ${ca.napAm}, ${cb.label} là ${cb.napAm}.`, why],
        people: [person(ca), person(cb)],
        links: [
          ...[...new Set([ea, eb])].map((e) => ({ href: `/ngu-hanh/${ELEMENT_SLUGS[e]}`, label: `Mệnh ${e}` })),
          ...years.map((c) => ({ href: `/nam-sinh/${c.lunarYear}`, label: `Năm ${c.label} ${c.lunarYear}` })),
        ],
      };
    }
  }
}

/** Phần mở rộng của một ô trong "Vì sao ra con số này?": giải thích cách tính, ý nghĩa với từng người và bài đọc thêm. */
export function FactorDetails({
  factor,
  a,
  b,
  nameA,
  nameB,
  glossary,
}: {
  factor: CompatFactor;
  a: PersonProfile;
  b: PersonProfile;
  nameA: string;
  nameB: string;
  glossary: CrushGlossary;
}) {
  const d = describe(factor, a, b, nameA, nameB, glossary);
  const [pa, pb] = d.people;
  const people = pa.key === pb.key ? [{ who: "Cả hai bạn", ...pa }] : [{ who: nameA, ...pa }, { who: nameB, ...pb }];

  return (
    <div className="space-y-4 pt-4 text-sm leading-relaxed">
      {d.explain.map((t) => (
        <p key={t} className="text-ink-muted">
          {t}
        </p>
      ))}
      <div className={`grid gap-3 ${people.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {people.map((p) => (
          <div key={p.who} className="rounded-xl border border-line p-4">
            <p className="text-xs text-ink-muted">{p.who}</p>
            <p className="font-semibold">{p.heading}</p>
            {p.text && <p className="mt-1 text-ink-muted">{p.text}</p>}
          </div>
        ))}
      </div>
      {d.tip && (
        <p>
          <span className="font-semibold">Gợi ý cho hai bạn:</span> <span className="text-ink-muted">{d.tip}</span>
        </p>
      )}
      {d.links.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-muted">Đọc thêm:</span>
          {d.links.map((l) => (
            // Mở tab mới để không mất kết quả check crush đang xem.
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              {l.label}
              <IconArrowUpRight size={14} stroke={1.5} aria-hidden />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
