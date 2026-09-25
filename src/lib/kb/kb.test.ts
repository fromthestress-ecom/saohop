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
  zodiacMatches,
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
});
