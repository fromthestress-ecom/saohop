import { describe, expect, it } from "vitest";
import { buildTuViChartFromLunar, PALACE_NAMES } from "@/lib/engines/tuvi";
import { BRIGHTNESS_INFO, CUC_INFO, HOA_INFO, PALACE_INFO, STAR_INFO } from "./tuvi-glossary";

describe("bảng giải nghĩa tử vi", () => {
  it("có mô tả cho mọi sao mà engine có thể an ra", () => {
    const seen = new Set<string>();
    const cucs = new Set<string>();
    // Quét mọi tháng, ngày, giờ, giới tính và nhiều can chi để gặp đủ sao.
    for (let year = 1990; year < 2000; year++) {
      for (let month = 1; month <= 12; month++) {
        for (let h = 0; h < 12; h++) {
          for (const gender of ["nam", "nu"] as const) {
            const chart = buildTuViChartFromLunar({ year, month, day: 1 + ((month * 7 + h * 3) % 29), isLeapMonth: false }, h, gender);
            cucs.add(chart.cuc.name);
            for (const p of chart.palaces) for (const s of p.stars) seen.add(s.name);
          }
        }
      }
    }
    const missing = [...seen].filter((name) => !STAR_INFO[name]);
    expect(missing).toEqual([]);
    for (const name of cucs) expect(CUC_INFO[name], name).toBeTruthy();
  });

  it("mọi cung chức, tứ hóa và độ sáng đều có mô tả", () => {
    for (const name of PALACE_NAMES) expect(PALACE_INFO[name].meaning).toBeTruthy();
    for (const hoa of ["Lộc", "Quyền", "Khoa", "Kỵ"] as const) expect(HOA_INFO[hoa].meaning).toBeTruthy();
    for (const b of ["Miếu", "Vượng", "Đắc", "Bình", "Hãm"] as const) expect(BRIGHTNESS_INFO[b].short).toHaveLength(1);
  });

  it("mô tả không để trống hay trùng khóa với tên sao khác loại", () => {
    for (const [name, info] of Object.entries(STAR_INFO)) {
      expect(info.meaning.length, name).toBeGreaterThan(20);
      expect(info.kind, name).toBeTruthy();
    }
  });
});
