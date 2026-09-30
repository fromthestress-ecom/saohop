import { describe, expect, it } from "vitest";
import { CAN_INFO, CHI_ELEMENT, chiRelation, DIA_CHI, elementRelation, NAP_AM, NGU_HANH, THIEN_CAN, type NguHanh } from "@/lib/engines/can-chi";
import {
  BIRTH_YEAR_RANGE,
  birthYearsWithContent,
  CON_GIAP_PAIRS,
  conGiapContent,
  conGiapPairSlug,
  getConGiapPair,
  nguHanhContent,
} from "./con-giap";

const allStrings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : Array.isArray(value) ? value.flatMap(allStrings) : value && typeof value === "object" ? Object.values(value).flatMap(allStrings) : [];

describe("kho nội dung con giáp và ngũ hành đầy đủ", () => {
  it("đủ 12 con giáp, 78 cặp, 5 hành, 10 can, 30 nạp âm", () => {
    expect(Object.keys(conGiapContent.animals).sort()).toEqual(DIA_CHI.map((d) => d.slug).sort());
    for (const [i, j] of CON_GIAP_PAIRS) expect(conGiapContent.pairs[conGiapPairSlug(i, j)], conGiapPairSlug(i, j)).toBeDefined();
    expect(Object.keys(nguHanhContent.elements)).toHaveLength(5);
    expect(Object.keys(nguHanhContent.thienCan).sort()).toEqual([...THIEN_CAN].sort());
    expect(Object.keys(nguHanhContent.napAm).sort()).toEqual(NAP_AM.map(([n]) => n).sort());
    expect(birthYearsWithContent()).toHaveLength(BIRTH_YEAR_RANGE.to - BIRTH_YEAR_RANGE.from + 1);
  });

  it("không có dấu gạch dài", () => {
    for (const s of [...allStrings(conGiapContent), ...allStrings(nguHanhContent)]) expect(s).not.toMatch(/[–—]/);
  });
});

describe("nội dung khớp với engine", () => {
  it("bài cặp tuổi chỉ nhắc đúng quan hệ engine tính", () => {
    const WORDS: Array<[RegExp, string]> = [
      [/lục hợp|nhị hợp/i, "Lục hợp"],
      [/tam hợp/i, "Tam hợp"],
      [/lục xung|đối diện nhau/i, "Lục xung"],
      [/lục hại/i, "Lục hại"],
      [/tứ hành xung/i, "Tứ hành xung"],
      [/bình hoà/i, "Bình hoà"],
    ];
    for (const [i, j] of CON_GIAP_PAIRS) {
      const pair = getConGiapPair(conGiapPairSlug(i, j))!;
      const text = allStrings(pair.article).join(" ");
      for (const [re, relation] of WORDS) if (re.test(text)) expect(pair.relation, `${pair.slug} nhắc "${re.source}"`).toBe(relation);
    }
  });

  it("mọi câu 'X sinh Y' và 'X khắc Y' đúng vòng sinh khắc", () => {
    const re = /(Kim|Thủy|Mộc|Hỏa|Thổ) (sinh|khắc) (Kim|Thủy|Mộc|Hỏa|Thổ)/g;
    let checked = 0;
    for (const s of [...allStrings(nguHanhContent), ...allStrings(conGiapContent)]) {
      for (const [, a, verb, b] of s.matchAll(re)) {
        checked++;
        expect(elementRelation(a as NguHanh, b as NguHanh), `"${a} ${verb} ${b}"`).toBe(verb === "sinh" ? "Sinh ra" : "Khắc");
      }
    }
    expect(checked).toBeGreaterThan(10);
  });

  it("thiên can nói đúng hành và âm dương", () => {
    for (const [can, text] of Object.entries(nguHanhContent.thienCan)) {
      const info = CAN_INFO[THIEN_CAN.indexOf(can as (typeof THIEN_CAN)[number])];
      expect(text, can).toContain(`mang tính ${info.yang ? "dương" : "âm"} và thuộc hành ${info.element}`);
    }
  });

  it("nạp âm mở đầu bằng đúng tên và thuộc đúng hành", () => {
    for (const [name, element] of NAP_AM) {
      expect(nguHanhContent.napAm[name].startsWith(name), name).toBe(true);
      expect(name.endsWith(element), name).toBe(true);
    }
  });

  it("bài con giáp nói đúng hành, âm dương và tuổi đối xung", () => {
    DIA_CHI.forEach((d, i) => {
      const text = allStrings(conGiapContent.animals[d.slug]).join(" ");
      const m = text.match(new RegExp(`${d.name} thuộc hành (Kim|Thủy|Mộc|Hỏa|Thổ) và mang tính (dương|âm)`));
      expect(m, d.slug).not.toBeNull();
      expect(m![1], `${d.slug} hành`).toBe(CHI_ELEMENT[i]);
      expect(m![2], `${d.slug} âm dương`).toBe(i % 2 === 0 ? "dương" : "âm");
      const opposite = DIA_CHI[(i + 6) % 12].name;
      if (/đối diện nhau/.test(text)) expect(text, `${d.slug} đối diện`).toContain(`${d.name} và ${opposite} đứng đối diện nhau`);
      expect(chiRelation(i, (i + 6) % 12)).toBe("Lục xung");
    });
  });

  it("bài cặp tuổi nhắc 'cùng thuộc hành' thì hai tuổi phải cùng hành", () => {
    for (const [i, j] of CON_GIAP_PAIRS) {
      const text = allStrings(conGiapContent.pairs[conGiapPairSlug(i, j)]).join(" ");
      const m = text.match(/cùng thuộc hành (Kim|Thủy|Mộc|Hỏa|Thổ)/);
      if (m) {
        expect(CHI_ELEMENT[i], conGiapPairSlug(i, j)).toBe(m[1]);
        expect(CHI_ELEMENT[j], conGiapPairSlug(i, j)).toBe(m[1]);
      }
    }
  });

  it("bảng màu đủ 5 hành", () => {
    for (const e of NGU_HANH) expect(nguHanhContent.colors[e].length).toBeGreaterThan(0);
  });
});
