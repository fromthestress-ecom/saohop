import { describe, expect, it } from "vitest";
import { canChiOfLunarYear, chiRelation, DIA_CHI, elementRelation } from "./can-chi";
import { lunarNewYear } from "./lunar";

const idx = (slug: string) => DIA_CHI.findIndex((c) => c.slug === slug);

describe("can chi và nạp âm theo năm", () => {
  it("khớp các năm đã biết", () => {
    expect(canChiOfLunarYear(2002)).toMatchObject({ label: "Nhâm Ngọ", napAm: "Dương Liễu Mộc", element: "Mộc" });
    expect(canChiOfLunarYear(1984)).toMatchObject({ label: "Giáp Tý", napAm: "Hải Trung Kim", element: "Kim" });
    expect(canChiOfLunarYear(1990)).toMatchObject({ label: "Canh Ngọ", napAm: "Lộ Bàng Thổ", element: "Thổ" });
    expect(canChiOfLunarYear(2000)).toMatchObject({ label: "Canh Thìn", napAm: "Bạch Lạp Kim", element: "Kim" });
    expect(canChiOfLunarYear(2027)).toMatchObject({ label: "Đinh Mùi", napAm: "Thiên Hà Thủy", element: "Thủy" });
  });
});

describe("ngày Tết Nguyên đán", () => {
  it("khớp lịch Tết đã biết", () => {
    const tet = (y: number) => {
      const d = lunarNewYear(y);
      return `${d.day}/${d.month}/${d.year}`;
    };
    // Lịch Việt Nam (UTC+7) khác Trung Quốc (UTC+8) ở một số năm:
    // Tết Ất Sửu 1985 ở Việt Nam là 21/01, sớm hơn Trung Quốc (20/02) một tháng; năm 2007 sớm hơn một ngày.
    expect(tet(1985)).toBe("21/1/1985");
    expect(tet(2007)).toBe("17/2/2007");
    expect(tet(2002)).toBe("12/2/2002");
    expect(tet(2023)).toBe("22/1/2023");
    expect(tet(2024)).toBe("10/2/2024");
    expect(tet(2025)).toBe("29/1/2025");
    expect(tet(2026)).toBe("17/2/2026");
    expect(tet(2027)).toBe("6/2/2027");
  });
});

describe("quan hệ con giáp", () => {
  it("lục hợp, tam hợp, xung, hại, tứ hành xung", () => {
    expect(chiRelation(idx("ty"), idx("suu"))).toBe("Lục hợp");
    expect(chiRelation(idx("dan"), idx("hoi"))).toBe("Lục hợp");
    expect(chiRelation(idx("than"), idx("thin"))).toBe("Tam hợp");
    expect(chiRelation(idx("ty"), idx("ngo"))).toBe("Lục xung");
    expect(chiRelation(idx("ty"), idx("mui"))).toBe("Lục hại");
    expect(chiRelation(idx("ty"), idx("mao"))).toBe("Tứ hành xung");
    expect(chiRelation(idx("ty"), idx("dan"))).toBe("Bình hoà");
    expect(chiRelation(idx("ngo"), idx("ngo"))).toBe("Cùng tuổi");
  });

  it("quan hệ đối xứng", () => {
    for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) expect(chiRelation(i, j)).toBe(chiRelation(j, i));
  });
});

describe("ngũ hành sinh khắc", () => {
  it("tương sinh và tương khắc", () => {
    expect(elementRelation("Mộc", "Hỏa")).toBe("Sinh ra");
    expect(elementRelation("Mộc", "Thủy")).toBe("Được sinh");
    expect(elementRelation("Mộc", "Thổ")).toBe("Khắc");
    expect(elementRelation("Mộc", "Kim")).toBe("Bị khắc");
    expect(elementRelation("Mộc", "Mộc")).toBe("Bình hoà");
    expect(elementRelation("Thổ", "Thủy")).toBe("Khắc");
    expect(elementRelation("Hỏa", "Kim")).toBe("Khắc");
  });
});

describe("hành của can và chi", () => {
  it("khớp bảng phổ biến", async () => {
    const { CHI_ELEMENT, CAN_INFO, THIEN_CAN } = await import("./can-chi");
    expect(CHI_ELEMENT[idx("ty")]).toBe("Thủy");
    expect(CHI_ELEMENT[idx("ngo")]).toBe("Hỏa");
    expect(CHI_ELEMENT[idx("than")]).toBe("Kim");
    expect(CAN_INFO[THIEN_CAN.indexOf("Nhâm")]).toEqual({ element: "Thủy", yang: true });
    expect(CAN_INFO[THIEN_CAN.indexOf("Ất")]).toEqual({ element: "Mộc", yang: false });
  });
});
