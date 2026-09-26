import { describe, expect, it } from "vitest";
import { LIFE_PATH_NUMBERS } from "@/lib/engines/numerology";
import { ZODIAC_SIGNS, zodiacBySlug } from "@/lib/engines/zodiac";
import {
  getLifePath,
  getZodiac,
  lifePathContent,
  lifePathExample,
  lifePathMatches,
  parseLifePathSlug,
  parseZodiacPairSlug,
  getZodiacPair,
  ZODIAC_PAIRS,
  zodiacContent,
  zodiacPairSlug,
  zodiacPairsContent,
  zodiacDateRange,
  zodiacDecans,
  zodiacDecansInMonth,
  zodiacMatches,
  zodiacMonths,
  parseZodiacVariant,
  zodiacVariantLinks,
  zodiacVariantsContent,
} from "./index";

const allStrings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : Array.isArray(value) ? value.flatMap(allStrings) : value && typeof value === "object" ? Object.values(value).flatMap(allStrings) : [];

describe("kho kiến thức", () => {
  it("có đúng 12 cung, khớp slug với engine", () => {
    const slugs = zodiacContent.entries.map((e) => e.slug).sort();
    expect(slugs).toEqual(ZODIAC_SIGNS.map((s) => s.slug).sort());
  });

  it("có đủ mọi số chủ đạo engine có thể trả về", () => {
    expect(lifePathContent.entries.map((e) => e.number)).toEqual([...LIFE_PATH_NUMBERS]);
  });

  it("không có dấu gạch dài trong nội dung hiển thị", () => {
    for (const s of [...allStrings(zodiacContent.entries), ...allStrings(lifePathContent.entries)]) {
      expect(s).not.toMatch(/[–—]/);
    }
  });

  it("khoảng ngày của cung suy ra đúng từ engine", () => {
    expect(zodiacDateRange(zodiacBySlug("bach-duong")!)).toBe("21/03 - 19/04");
    expect(zodiacDateRange(zodiacBySlug("ma-ket")!)).toBe("22/12 - 19/01");
    expect(zodiacDateRange(zodiacBySlug("song-ngu")!)).toBe("19/02 - 20/03");
  });

  it("cung hợp nhất là tam hợp cùng nguyên tố", () => {
    const top = zodiacMatches(zodiacBySlug("bach-duong")!).slice(0, 2).map((m) => m.sign.slug);
    expect(top.sort()).toEqual(["nhan-ma", "su-tu"]);
  });

  it("số hợp nhất cùng nhóm Phillips", () => {
    const top = lifePathMatches(3)[0];
    expect([6, 9, 33]).toContain(top.number);
    expect(top.relation).toBe("Cùng nhóm");
  });

  it("mỗi số chủ đạo có một ngày sinh ví dụ tính ra đúng số đó", () => {
    for (const n of LIFE_PATH_NUMBERS) {
      const ex = lifePathExample(n);
      expect(ex, `số ${n}`).not.toBeNull();
      expect(ex!.steps.at(-1) ?? ex!.total).toBe(n);
    }
    expect(lifePathExample(22)!.total).toBe(22);
    expect(lifePathExample(33)!.total).toBe(33);
    expect(lifePathExample(4)!.steps.length).toBeGreaterThan(0);
  });

  it("đọc slug số chủ đạo", () => {
    expect(parseLifePathSlug("so-7")).toBe(7);
    expect(parseLifePathSlug("so-1")).toBeNull();
    expect(parseLifePathSlug("abc")).toBeNull();
    expect(getLifePath(22)?.title).toBe("Người kiến tạo");
    expect(getZodiac("khong-co")).toBeNull();
  });
});

describe("cặp đôi cung hoàng đạo", () => {
  it("có đúng 78 cặp, slug không trùng", () => {
    expect(ZODIAC_PAIRS).toHaveLength(78);
    const slugs = ZODIAC_PAIRS.map(([a, b]) => zodiacPairSlug(a, b));
    expect(new Set(slugs).size).toBe(78);
  });

  it("mọi cặp đều ghép được đủ nội dung", () => {
    for (const [a, b] of ZODIAC_PAIRS) {
      const pair = getZodiacPair(zodiacPairSlug(a, b));
      expect(pair?.aspectText.body).toBeTruthy();
      expect(pair?.elementText).toBeTruthy();
      expect(pair?.modalityText).toBeTruthy();
    }
  });

  it("slug không phụ thuộc thứ tự, URL ngược thứ tự không hợp lệ", () => {
    const aries = zodiacBySlug("bach-duong")!;
    const leo = zodiacBySlug("su-tu")!;
    expect(zodiacPairSlug(leo, aries)).toBe("bach-duong-va-su-tu");
    expect(parseZodiacPairSlug("su-tu-va-bach-duong")).toBeNull();
    expect(parseZodiacPairSlug("bach-duong-va-bach-duong")?.[0].slug).toBe("bach-duong");
  });

  it("nội dung ghép khớp với góc chiếu của engine", () => {
    const pair = getZodiacPair("bach-duong-va-su-tu")!;
    expect(pair.relation).toBe("Tam hợp nguyên tố (trine)");
    expect(pair.score).toBe(92);
    expect(pair.aspectText.headline).toBe("Cùng một ngôn ngữ cảm xúc");
    expect(pair.elementText).toMatch(/^Hai ngọn lửa/);
    const opposite = getZodiacPair("bach-duong-va-thien-binh")!;
    expect(opposite.relation).toBe("Đối xứng (opposition)");
    expect(opposite.elementText).toMatch(/^Khí thổi bùng/);
  });

  it("không có dấu gạch dài trong khối nội dung", () => {
    for (const s of allStrings(zodiacPairsContent)) expect(s).not.toMatch(/[–—]/);
  });

  it("cả 78 cặp đều có bài viết riêng", () => {
    for (const [a, b] of ZODIAC_PAIRS) {
      const pair = getZodiacPair(zodiacPairSlug(a, b))!;
      expect(pair.override?.deep?.sections.length, pair.slug).toBeGreaterThanOrEqual(3);
    }
  });

  it("bài viết cặp đôi nhắc đúng góc chiếu và nguyên tố mà engine tính", () => {
    // Từ khoá trong bài -> quan hệ engine phải có
    const ASPECT_WORDS: Array<[RegExp, string]> = [
      [/tam hợp/i, "Tam hợp"],
      [/(?<!bán )lục hợp/i, "Lục hợp"],
      [/bán lục hợp/i, "Bán lục hợp"],
      [/góc vuông/i, "Vuông góc"],
      [/lệch pha/i, "Lệch pha"],
      [/đối xứng|cung đối diện/i, "Đối xứng"],
    ];
    for (const [a, b] of ZODIAC_PAIRS) {
      const pair = getZodiacPair(zodiacPairSlug(a, b))!;
      const text = allStrings(pair.override).join(" ");
      for (const [re, relation] of ASPECT_WORDS) {
        if (re.test(text)) expect(pair.relation, `${pair.slug} nhắc "${re.source}"`).toContain(relation);
      }
      if (/cùng nguyên tố/i.test(text)) expect(a.element, `${pair.slug} nói cùng nguyên tố`).toBe(b.element);
    }
  });
});

describe("cung theo tháng sinh và thập độ", () => {
  const fmt = (d: { day: number; month: number }) => `${d.day}/${d.month}`;

  it("khoảng ngày trong hai tháng của cung, tính cả 29/02", () => {
    expect(zodiacMonths(zodiacBySlug("song-ngu")!)).toEqual([
      { month: 2, from: 19, to: 29 },
      { month: 3, from: 1, to: 20 },
    ]);
    expect(zodiacMonths(zodiacBySlug("ma-ket")!)).toEqual([
      { month: 12, from: 22, to: 31 },
      { month: 1, from: 1, to: 19 },
    ]);
  });

  it("ba thập độ theo hệ tam hợp, đúng ngày", () => {
    const pisces = zodiacDecans(zodiacBySlug("song-ngu")!);
    expect(pisces.map((d) => `${d.coSign.slug} ${fmt(d.from)}-${fmt(d.to)}`)).toEqual([
      "song-ngu 19/2-28/2",
      "cu-giai 1/3-10/3",
      "bo-cap 11/3-20/3",
    ]);
    const cap = zodiacDecans(zodiacBySlug("ma-ket")!);
    expect(cap.map((d) => `${d.coSign.slug} ${fmt(d.from)}-${fmt(d.to)}`)).toEqual([
      "ma-ket 22/12-31/12",
      "kim-nguu 1/1-10/1",
      "xu-nu 11/1-19/1",
    ]);
  });

  it("thập độ trong một tháng được cắt theo tháng, 29/02 thuộc cuối tháng 2", () => {
    const feb = zodiacDecansInMonth(zodiacBySlug("song-ngu")!, 2);
    expect(feb.map((d) => [d.index, d.from, d.to])).toEqual([[1, 19, 29]]);
    const mar = zodiacDecansInMonth(zodiacBySlug("song-ngu")!, 3);
    expect(mar.map((d) => [d.index, d.from, d.to])).toEqual([
      [2, 1, 10],
      [3, 11, 20],
    ]);
    // Mọi ngày của cung thuộc đúng một thập độ ở đúng một tháng
    for (const sign of ZODIAC_SIGNS) {
      const days = zodiacMonths(sign).flatMap((r) => zodiacDecansInMonth(sign, r.month).map((d) => d.to - d.from + 1));
      const total = zodiacMonths(sign).reduce((n, r) => n + r.to - r.from + 1, 0);
      expect(days.reduce((a, b) => a + b, 0), sign.slug).toBe(total);
    }
  });

  it("đọc slug biến thể", () => {
    expect(parseZodiacVariant("nam")).toEqual({ kind: "nam" });
    expect(parseZodiacVariant("thang-3")).toEqual({ kind: "thang", month: 3 });
    expect(parseZodiacVariant("abc")).toBeNull();
  });
});

describe("trang cung theo giới tính và tháng sinh", () => {
  const pad = (n: number) => String(n).padStart(2, "0");

  it("cả 12 cung đều có đủ 4 trang biến thể", () => {
    for (const sign of ZODIAC_SIGNS) expect(zodiacVariantLinks(sign).length, sign.slug).toBe(4);
  });

  it("bài theo tháng nhắc đúng ngày, cung đồng chủ quản và cung sát ranh giới", () => {
    for (const sign of ZODIAC_SIGNS) {
      const [first, second] = zodiacMonths(sign);
      const prev = ZODIAC_SIGNS[(sign.index + 11) % 12];
      const next = ZODIAC_SIGNS[(sign.index + 1) % 12];
      for (const range of [first, second]) {
        const article = zodiacVariantsContent.signs[sign.slug].thang[String(range.month)];
        const where = `${sign.slug} tháng ${range.month}`;
        // Ngày trong tóm tắt khớp engine (tháng 2 có thể viết "đến hết tháng 2")
        expect(article.summary, where).toContain(`từ ${pad(range.from)}/${pad(range.month)}`);
        if (range.month !== 2) expect(article.summary, where).toContain(`đến ${pad(range.to)}/${pad(range.month)}`);
        const text = allStrings(article).join(" ");
        const coSigns = zodiacDecansInMonth(sign, range.month).map((d) => d.coSign.name);
        for (const m of text.matchAll(/ảnh hưởng của ([^\s,.]+ [^\s,.]+)/g)) {
          expect(coSigns, `${where} nhắc ảnh hưởng của ${m[1]}`).toContain(m[1]);
        }
        const neighbour = range === first ? prev.name : next.name;
        for (const m of text.matchAll(/sát ranh giới với ([^\s,.]+ [^\s,.]+)/g)) {
          expect(m[1], `${where} nhắc ranh giới`).toBe(neighbour);
        }
      }
    }
  });
});
