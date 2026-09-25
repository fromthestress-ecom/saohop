import { describe, expect, it } from "vitest";
import { compatibility } from "./compatibility";
import { buildProfile } from "./profile";
import { sunSignOf } from "./zodiac";

const d = (day: number, month: number, year: number) => ({ day, month, year });
const person = (day: number, month: number, year: number, fullName?: string) =>
  buildProfile({ fullName, birthDate: d(day, month, year) }, 2026);

describe("cung hoàng đạo", () => {
  it.each([
    [d(23, 10, 2000), "Bọ Cạp", true],
    [d(14, 2, 2000), "Bảo Bình", false],
    [d(1, 1, 2000), "Ma Kết", false],
    [d(21, 3, 2000), "Bạch Dương", true],
    [d(20, 3, 2000), "Song Ngư", true],
    [d(15, 7, 2000), "Cự Giải", false],
  ])("%o → %s (giáp ranh: %s)", (date, name, cusp) => {
    const { sign, isCusp } = sunSignOf(date);
    expect(sign.name).toBe(name);
    expect(isCusp).toBe(cusp);
  });
});

describe("compatibility", () => {
  const relationOf = (a: ReturnType<typeof person>, b: ReturnType<typeof person>, system: string) =>
    compatibility(a, b).factors.find((f) => f.system === system)?.relation;

  it("con giáp: lục hợp, tam hợp, lục xung, lục hại, tứ hành xung", () => {
    const ty = person(1, 6, 1996); // Bính Tý
    expect(relationOf(ty, person(1, 6, 1997), "con-giap")).toBe("Lục hợp"); // Sửu
    expect(relationOf(ty, person(1, 6, 1992), "con-giap")).toBe("Tam hợp"); // Thân
    expect(relationOf(ty, person(1, 6, 1990), "con-giap")).toBe("Lục xung"); // Ngọ
    expect(relationOf(ty, person(1, 6, 1991), "con-giap")).toBe("Lục hại"); // Mùi
    expect(relationOf(ty, person(1, 6, 1999), "con-giap")).toBe("Tứ hành xung"); // Mão
  });

  it("ngũ hành: Kim sinh Thủy", () => {
    // 2000 Bạch Lạp Kim, 1996 Giản Hạ Thủy
    expect(relationOf(person(1, 6, 2000), person(1, 6, 1996), "ngu-hanh")).toBe("Tương sinh (Kim sinh Thủy)");
  });

  it("đối xứng: kết quả không phụ thuộc thứ tự hai người", () => {
    const a = person(15, 8, 1995, "Nguyễn Văn An");
    const b = person(2, 3, 1998, "Trần Thị My");
    const ab = compatibility(a, b);
    const ba = compatibility(b, a);
    expect(ab.overall).toBe(ba.overall);
    expect(ab.dimensions).toEqual(ba.dimensions);
  });

  it("điểm nằm trong 0–100 và có đủ 5 chiều; thiếu tên thì bỏ qua số linh hồn", () => {
    const r = compatibility(person(15, 8, 1995), person(2, 3, 1998));
    expect(r.overall).toBeGreaterThanOrEqual(0);
    expect(r.overall).toBeLessThanOrEqual(100);
    expect(Object.keys(r.dimensions)).toHaveLength(5);
    expect(r.factors.some((f) => f.system === "so-linh-hon")).toBe(false);
  });
});
