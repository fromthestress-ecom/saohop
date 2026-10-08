import { astro } from "iztro";
import { describe, expect, it } from "vitest";
import { DIA_CHI } from "./can-chi";
import { buildTuViChart, buildTuViChartFromLunar, hourIndexFromClock, type Gender, type TuViChart } from "./tuvi";

const CHI: string[] = DIA_CHI.map((c) => c.name);

function starAt(chart: TuViChart, name: string) {
  const hits = chart.palaces.filter((p) => p.stars.some((s) => s.name === name));
  expect(hits, `${name} phải có đúng một cung`).toHaveLength(1);
  return hits[0];
}

describe("giờ sinh", () => {
  it.each([
    [23, 0],
    [0, 0],
    [1, 1],
    [2, 1],
    [9, 5],
    [10, 5],
    [11, 6],
    [12, 6],
    [21, 11],
    [22, 11],
  ])("%ih → chi giờ %i", (clock, index) => {
    expect(hourIndexFromClock(clock)).toBe(index);
  });

  it("từ chối giờ ngoài 0–23", () => {
    expect(() => hourIndexFromClock(24)).toThrow(RangeError);
    expect(() => hourIndexFromClock(-1)).toThrow(RangeError);
  });
});

describe("buildTuViChart — ca tính tay", () => {
  // 15/08/1995 = 20/07 Ất Hợi, giờ Thìn, nữ.
  // Mệnh: Dần tính tháng 1 → tháng 7 ở Thân, lùi 4 giờ → Thìn. Thân: tiến 4 → Tý.
  // Mệnh Thìn có Canh (Ngũ Hổ Độn năm Ất: Dần = Mậu) → Canh Thìn = Bạch Lạp Kim → Kim Tứ Cục.
  const chart = buildTuViChart({ birthDate: { day: 15, month: 8, year: 1995 }, hourIndex: 4, gender: "nu" });

  it("đổi đúng sang âm lịch và can chi năm", () => {
    expect(chart.lunar).toEqual({ day: 20, month: 7, year: 1995, isLeapMonth: false });
    expect(chart.year.label).toBe("Ất Hợi");
  });

  it("cung Mệnh, cung Thân, cục", () => {
    expect(CHI[chart.menhIndex]).toBe("Thìn");
    expect(CHI[chart.thanIndex]).toBe("Tý");
    expect(chart.palaces[chart.menhIndex].can).toBe("Canh");
    expect(chart.cuc).toMatchObject({ name: "Kim Tứ Cục", element: "Kim", number: 4 });
  });

  it("Âm nữ đi thuận, đại hạn đầu bắt đầu từ tuổi 4 ở cung Mệnh", () => {
    expect(chart.clockwise).toBe(true);
    expect(chart.palaces[chart.menhIndex].daiHan).toEqual({ from: 4, to: 13 });
    expect(chart.palaces[(chart.menhIndex + 1) % 12].daiHan).toEqual({ from: 14, to: 23 });
  });

  it("an Tử Vi ở Ngọ, Thất Sát ở Mệnh, Phá Quân ở Thân", () => {
    // Kim Tứ Cục, ngày 20: 4×5 = 20 → Dần tiến 5 cung = Ngọ.
    expect(CHI[starAt(chart, "Tử Vi").chiIndex]).toBe("Ngọ");
    expect(starAt(chart, "Thất Sát").name).toBe("Mệnh");
    expect(CHI[starAt(chart, "Phá Quân").chiIndex]).toBe("Thân");
    expect(CHI[starAt(chart, "Thiên Phủ").chiIndex]).toBe("Tuất");
  });

  it("tứ hóa năm Ất: Cơ Lộc, Lương Quyền, Tử Vi Khoa, Thái Âm Kỵ", () => {
    const hoa = chart.palaces.flatMap((p) => p.stars.filter((s) => s.hoa).map((s) => `${s.name}:${s.hoa}`)).sort();
    expect(hoa).toEqual(["Thiên Cơ:Lộc", "Thiên Lương:Quyền", "Thái Âm:Kỵ", "Tử Vi:Khoa"].sort());
  });

  it("Mệnh chủ theo cung Mệnh, Thân chủ theo năm sinh", () => {
    expect(chart.menhChu).toBe("Liêm Trinh"); // Mệnh ở Thìn
    expect(chart.thanChu).toBe("Thiên Cơ"); // tuổi Hợi
  });

  it("Tuần và Triệt theo can chi năm", () => {
    // Ất Hợi thuộc tuần Giáp Tuất (Tuất → Mùi), thiếu Thân Dậu nên Tuần đóng Thân Dậu. Triệt năm Ất: Ngọ Mùi.
    const tuan = chart.palaces.filter((p) => p.tuan).map((p) => p.chi);
    const triet = chart.palaces.filter((p) => p.triet).map((p) => p.chi);
    expect(tuan).toEqual(["Thân", "Dậu"]);
    expect(triet).toEqual(["Ngọ", "Mùi"]);
  });
});

describe("buildTuViChart — quy ước", () => {
  const base = { birthDate: { day: 15, month: 8, year: 1995 }, hourIndex: 4 };

  it("Dương nam đi thuận, Âm nam đi nghịch", () => {
    // 1990 Canh Ngọ (dương), 1995 Ất Hợi (âm).
    const yangMale = buildTuViChart({ birthDate: { day: 10, month: 6, year: 1990 }, hourIndex: 4, gender: "nam" });
    const yinMale = buildTuViChart({ ...base, gender: "nam" });
    expect(yangMale.clockwise).toBe(true);
    expect(yinMale.clockwise).toBe(false);
    // Nghịch: cung kế Mệnh theo thứ tự chi (Tỵ) là đại hạn xa nhất; cung trước Mệnh (Mão) là đại hạn thứ hai.
    expect(yinMale.palaces[(yinMale.menhIndex - 1 + 12) % 12].daiHan.from).toBe(yinMale.cuc.number + 10);
  });

  it("Hỏa Tinh và Linh Tinh đi ngược chiều nhau theo giới tính và âm dương năm sinh", () => {
    const m = buildTuViChart({ ...base, gender: "nam" });
    const f = buildTuViChart({ ...base, gender: "nu" });
    const hoa = (c: TuViChart) => starAt(c, "Hỏa Tinh").chiIndex;
    const linh = (c: TuViChart) => starAt(c, "Linh Tinh").chiIndex;
    // Tuổi Hợi: Hỏa khởi Dậu (9), Linh khởi Tuất (10); giờ Thìn (4).
    expect(hoa(f)).toBe((9 + 4) % 12); // Âm nữ: Hỏa thuận
    expect(linh(f)).toBe((10 - 4 + 12) % 12); // Linh nghịch
    expect(hoa(m)).toBe((9 - 4 + 12) % 12);
    expect(linh(m)).toBe((10 + 4) % 12);
  });

  it("giờ Tý: Địa Không và Địa Kiếp đồng cung Hợi", () => {
    const c = buildTuViChart({ ...base, hourIndex: 0, gender: "nam" });
    expect(CHI[starAt(c, "Địa Kiếp").chiIndex]).toBe("Hợi");
    expect(CHI[starAt(c, "Địa Không").chiIndex]).toBe("Hợi");
  });

  it("tháng nhuận dùng chính tháng đó", () => {
    // 22/3/2023 là mùng 1 tháng 2 nhuận.
    const c = buildTuViChart({ birthDate: { day: 22, month: 3, year: 2023 }, hourIndex: 0, gender: "nam" });
    expect(c.lunar).toMatchObject({ month: 2, isLeapMonth: true });
    const normal = buildTuViChartFromLunar({ day: 1, month: 2, year: 2023, isLeapMonth: false }, 0, "nam");
    expect(c.palaces.map((p) => p.stars.map((s) => s.name))).toEqual(normal.palaces.map((p) => p.stars.map((s) => s.name)));
  });

  it("từ chối đầu vào sai", () => {
    expect(() => buildTuViChart({ ...base, birthDate: { day: 31, month: 2, year: 2000 }, gender: "nam" })).toThrow(RangeError);
    expect(() => buildTuViChart({ ...base, hourIndex: 12, gender: "nam" })).toThrow(RangeError);
    expect(() => buildTuViChart({ ...base, hourIndex: 1.5, gender: "nam" })).toThrow(RangeError);
  });

  it("kết quả là dữ liệu thuần, serialize được", () => {
    const c = buildTuViChart({ ...base, gender: "nu" });
    expect(JSON.parse(JSON.stringify(c))).toEqual(c);
  });
});

describe("buildTuViChart — cấu trúc nhiều ngày sinh", () => {
  const rng = mulberry32(2027);
  const cases = Array.from({ length: 300 }, () => ({
    lunar: { year: 1930 + Math.floor(rng() * 110), month: 1 + Math.floor(rng() * 12), day: 1 + Math.floor(rng() * 29), isLeapMonth: false },
    hour: Math.floor(rng() * 12),
    gender: (rng() < 0.5 ? "nam" : "nu") as Gender,
  }));

  it("mỗi chính tinh xuất hiện đúng một lần, 12 cung chức đủ, 4 hóa đủ", () => {
    const main = ["Tử Vi", "Liêm Trinh", "Thiên Đồng", "Vũ Khúc", "Thái Dương", "Thiên Cơ", "Thiên Phủ", "Thái Âm", "Tham Lang", "Cự Môn", "Thiên Tướng", "Thiên Lương", "Thất Sát", "Phá Quân"];
    for (const { lunar, hour, gender } of cases) {
      const c = buildTuViChartFromLunar(lunar, hour, gender);
      const names = c.palaces.flatMap((p) => p.stars.filter((s) => s.group === "chinh").map((s) => s.name));
      expect(names.sort()).toEqual([...main].sort());
      expect(new Set(c.palaces.map((p) => p.name)).size).toBe(12);
      expect(c.palaces.flatMap((p) => p.stars).filter((s) => s.hoa)).toHaveLength(4);
      expect(c.palaces.filter((p) => p.tuan)).toHaveLength(2);
      expect(c.palaces.filter((p) => p.triet)).toHaveLength(2);
      expect(c.palaces.filter((p) => p.isThan)).toHaveLength(1);
      // 12 đại hạn liền nhau, mỗi cung đúng một.
      const starts = c.palaces.map((p) => p.daiHan.from).sort((a, b) => a - b);
      expect(starts.map((s, i) => s - starts[0] - i * 10)).toEqual(Array(12).fill(0));
      for (const key of ["thaiTue", "bacSi", "trangSinh"] as const) {
        expect(new Set(c.palaces.map((p) => p[key])).size).toBe(12);
      }
    }
  });
});

/**
 * Đối chiếu độc lập với `iztro` (Tử Vi Trung Hoa) ở các phần hai trường phái dùng chung.
 * Không so: Hỏa/Linh (iztro đếm cả hai theo chiều thuận, ta theo giới tính như lá số Việt Nam),
 * bảng miếu/hãm, và các sao phụ chỉ có ở một bên.
 */
describe("đối chiếu với iztro", () => {
  astro.config({ dayDivide: "current" });
  const rng = mulberry32(99);
  const cases = Array.from({ length: 120 }, () => ({
    year: 1950 + Math.floor(rng() * 80),
    month: 1 + Math.floor(rng() * 12),
    day: 1 + Math.floor(rng() * 29),
    hour: Math.floor(rng() * 12),
    gender: (rng() < 0.5 ? "nam" : "nu") as Gender,
  }));

  const shared = [
    "Tử Vi", "Liêm Trinh", "Thiên Đồng", "Vũ Khúc", "Thái Dương", "Thiên Cơ", "Thiên Phủ", "Thái Âm", "Tham Lang", "Cự Môn", "Thiên Tướng", "Thiên Lương", "Thất Sát", "Phá Quân",
    "Tả Phù", "Hữu Bật", "Văn Xương", "Văn Khúc", "Thiên Khôi", "Thiên Việt", "Lộc Tồn", "Kình Dương", "Đà La", "Địa Không", "Địa Kiếp", "Thiên Mã",
    "Hồng Loan", "Thiên Hỷ", "Long Trì", "Thiên Khốc", "Thiên Hư", "Thiên Quan", "Thiên Phúc", "Cô Thần", "Quả Tú", "Thiên Tài", "Thiên Thọ", "Thiên Không", "Thiên Thương", "Thiên Sứ", "Thiên Hình",
  ];

  it("cùng Mệnh, Thân, cục, đại hạn, vị trí sao, tứ hóa và vòng Tràng Sinh", () => {
    for (const k of cases) {
      const ours = buildTuViChartFromLunar({ year: k.year, month: k.month, day: k.day, isLeapMonth: false }, k.hour, k.gender);
      const iz = astro.byLunar(`${k.year}-${k.month}-${k.day}`, k.hour, k.gender === "nam" ? "男" : "女", false, true, "vi-VN");
      const tag = JSON.stringify(k);
      expect(CHI.indexOf(iz.earthlyBranchOfSoulPalace), `Mệnh ${tag}`).toBe(ours.menhIndex);
      expect(CHI.indexOf(iz.earthlyBranchOfBodyPalace), `Thân ${tag}`).toBe(ours.thanIndex);
      expect(iz.fiveElementsClass, `cục ${tag}`).toBe(ours.cuc.name);
      for (const p of iz.palaces) {
        const mine = ours.palaces[CHI.indexOf(p.earthlyBranch)];
        const theirs = [...p.majorStars, ...p.minorStars, ...p.adjectiveStars];
        for (const name of shared) {
          const t = theirs.find((s) => s.name === name);
          const m = mine.stars.find((s) => s.name === name);
          expect(Boolean(t), `${name} tại ${p.earthlyBranch} ${tag}`).toBe(Boolean(m));
          if (t && m) {
            const hoa = ({ Lộc: "Lộc", Quyền: "Quyền", Khoa: "Khoa", Kỵ: "Kỵ" } as Record<string, string>)[t.mutagen ?? ""];
            expect(m.hoa, `hóa ${name} ${tag}`).toBe(hoa);
          }
        }
        expect(p.decadal.range[0], `đại hạn ${p.earthlyBranch} ${tag}`).toBe(mine.daiHan.from);
        expect(p.changsheng12 === "Trường Sinh", `Tràng Sinh ${tag}`).toBe(mine.trangSinh === "Tràng Sinh");
        expect(norm(p.changsheng12), `vòng Tràng Sinh ${tag}`).toBe(norm(mine.trangSinh));
      }
    }
  }, 60_000);
});

const norm = (s: string) => s.replace("Trường", "Tràng").replace("Mục", "Mộc");

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
