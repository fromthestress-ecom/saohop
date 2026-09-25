import { describe, expect, it } from "vitest";
import {
  birthChart,
  lifePathNumber,
  nameNumbers,
  normalizeName,
  personalYearNumber,
} from "./numerology";

const d = (day: number, month: number, year: number) => ({ day, month, year });

describe("số chủ đạo", () => {
  it.each([
    [d(1, 1, 2000), 4],
    [d(19, 10, 2000), 4],
    [d(29, 9, 1999), 3],
    [d(15, 8, 1995), 11],
    [d(1, 1, 2006), 10],
    [d(2, 1, 1981), 22],
    [d(4, 8, 1992), 33],
  ])("%o → %i", (date, expected) => {
    expect(lifePathNumber(date)).toBe(expected);
  });

  it("luôn nằm trong 2–11, 22, 33", () => {
    const allowed = new Set([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 33]);
    for (let year = 1950; year <= 2012; year += 3) {
      for (let month = 1; month <= 12; month++) {
        for (const day of [1, 9, 18, 28]) {
          expect(allowed.has(lifePathNumber(d(day, month, year)))).toBe(true);
        }
      }
    }
  });
});

describe("chỉ số theo tên", () => {
  it("bỏ dấu tiếng Việt", () => {
    expect(normalizeName("  Đặng Thị   Thuỷ ")).toBe("DANG THI THUY");
    expect(normalizeName("Nguyễn Văn An")).toBe("NGUYEN VAN AN");
  });

  it("Nguyễn Văn An: Y sau U là phụ âm", () => {
    expect(nameNumbers("Nguyễn Văn An")).toEqual({ expression: 3, soulUrge: 1, personality: 11 });
  });

  it("My: Y đứng một mình là nguyên âm", () => {
    expect(nameNumbers("My")).toEqual({ expression: 11, soulUrge: 7, personality: 4 });
  });

  it("tên rỗng trả về null", () => {
    expect(nameNumbers("123 !!")).toBeNull();
  });
});

describe("biểu đồ ngày sinh", () => {
  it("15/08/1995", () => {
    const chart = birthChart(d(15, 8, 1995));
    expect(chart.counts).toMatchObject({ 1: 2, 5: 2, 8: 1, 9: 2 });
    expect(chart.missingDigits).toEqual([2, 3, 4, 6, 7]);
    expect(chart.fullArrows).toContain("Mũi tên Quyết tâm");
  });
});

describe("năm cá nhân", () => {
  it("15/08 năm 2026 → 1+5+8+2+0+2+6 = 24 → 6", () => {
    expect(personalYearNumber(d(15, 8, 1995), 2026)).toBe(6);
  });
});
