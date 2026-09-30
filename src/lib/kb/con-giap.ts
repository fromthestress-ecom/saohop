/**
 * Kho kiến thức con giáp, ngũ hành và năm sinh.
 * - Nội dung văn bản: src/content/con-giap.json và src/content/ngu-hanh.json.
 * - Năm sinh, ngày Tết, can chi, nạp âm, quan hệ giữa các tuổi và sinh khắc giữa các hành đều lấy từ engine.
 */

import { z } from "zod";
import conGiapJson from "@/content/con-giap.json";
import nguHanhJson from "@/content/ngu-hanh.json";
import {
  CAN_INFO,
  canChiOfLunarYear,
  CHI_ELEMENT,
  CHI_RELATION_SCORE,
  chiRelation,
  DIA_CHI,
  elementRelation,
  NAP_AM,
  NGU_HANH,
  THIEN_CAN,
  type ChiRelation,
  type NguHanh,
} from "@/lib/engines/can-chi";
import { lunarNewYear } from "@/lib/engines/lunar";
import type { SolarDate } from "@/lib/engines/types";
import { deepSchema, list, metaSchema, text } from "./schema";
import { BIRTH_YEAR_RANGE, conGiapPairSlug, ELEMENT_SLUGS } from "./slugs";

// ---- Ngũ hành ----

export { BIRTH_YEAR_RANGE, conGiapPairSlug, ELEMENT_SLUGS };
export const elementBySlug = (slug: string) => NGU_HANH.find((e) => ELEMENT_SLUGS[e] === slug) ?? null;

const elementEntrySchema = z.object({
  summary: text,
  strengths: list,
  weaknesses: list,
  deep: deepSchema.optional(),
});

export const nguHanhContent = z
  .object({
    meta: metaSchema,
    elements: z.record(z.string(), elementEntrySchema),
    /** Màu bản mệnh của cả 5 hành (theo tên hành), dùng để suy ra màu hợp và màu nên hạn chế. */
    colors: z.record(z.enum(NGU_HANH), list).refine((c) => NGU_HANH.every((e) => c[e]), "Cần màu của đủ 5 hành"),
    /** Đoạn ngắn về từng thiên can (khoá là tên can, vd. "Nhâm"). */
    thienCan: z.record(z.string(), text),
    /** Đoạn ngắn về từng nạp âm (khoá là tên nạp âm, vd. "Dương Liễu Mộc"). */
    napAm: z.record(z.string(), text),
  })
  .superRefine((c, ctx) => {
    for (const k of Object.keys(c.elements)) if (!elementBySlug(k)) ctx.addIssue({ code: "custom", message: `Không có hành ${k}` });
    for (const k of Object.keys(c.thienCan))
      if (!(THIEN_CAN as readonly string[]).includes(k)) ctx.addIssue({ code: "custom", message: `Không có can ${k}` });
    for (const k of Object.keys(c.napAm)) if (!NAP_AM.some(([n]) => n === k)) ctx.addIssue({ code: "custom", message: `Không có nạp âm ${k}` });
  })
  .parse(nguHanhJson);

/** Sáu nạp âm của một hành, mỗi nạp âm ứng với hai năm liền nhau trong vòng 60 năm. */
export function napAmOfElement(element: NguHanh, from = 1924, to = 2043) {
  return NAP_AM.map(([name, e], k) => ({ name, element: e, k }))
    .filter((n) => n.element === element)
    .map((n) => {
      const years: number[] = [];
      for (let y = from; y <= to; y++) if (Math.floor((((y - 4) % 60) + 60) % 60 / 2) === n.k) years.push(y);
      return { name: n.name, years, labels: [...new Set(years.map((y) => canChiOfLunarYear(y).label))] };
    });
}

/** Màu hợp và màu nên hạn chế của một hành: màu bản mệnh, màu của hành sinh ra nó, màu của hành khắc nó. */
export function colorsOfElement(name: NguHanh) {
  const rel = (r: string) => NGU_HANH.find((e) => e !== name && elementRelation(name, e) === r)!;
  return { own: nguHanhContent.colors[name], supportive: nguHanhContent.colors[rel("Được sinh")], avoid: nguHanhContent.colors[rel("Bị khắc")] };
}

export function getElement(slug: string) {
  const name = elementBySlug(slug);
  const entry = nguHanhContent.elements[slug];
  if (!name || !entry) return null;
  const others = NGU_HANH.filter((e) => e !== name);
  const find = (rel: string) => others.find((e) => elementRelation(name, e) === rel)!;
  const generatedBy = find("Được sinh");
  const controlledBy = find("Bị khắc");
  return {
    name,
    slug,
    entry,
    generates: find("Sinh ra"),
    generatedBy,
    controls: find("Khắc"),
    controlledBy,
    /** Màu hợp: màu bản mệnh và màu của hành sinh ra mình. Màu nên hạn chế: màu của hành khắc mình. */
    colors: colorsOfElement(name),
    napAm: napAmOfElement(name),
  };
}

export const elementSlugsWithContent = () => NGU_HANH.map((e) => ELEMENT_SLUGS[e]).filter((s) => nguHanhContent.elements[s]);

// ---- Con giáp ----

const animalEntrySchema = z.object({
  summary: text,
  strengths: list,
  weaknesses: list,
  inLove: text,
  deep: deepSchema.optional(),
});

// 78 cặp tuổi, khai báo trước schema vì schema kiểm tra khoá cặp.
export const CON_GIAP_PAIRS: ReadonlyArray<readonly [number, number]> = DIA_CHI.flatMap((_, i) =>
  DIA_CHI.map((__, j) => [i, j] as const).filter(([, j]) => j >= i),
);

export function parseConGiapPairSlug(slug: string): readonly [number, number] | null {
  return CON_GIAP_PAIRS.find(([i, j]) => conGiapPairSlug(i, j) === slug) ?? null;
}

const RELATIONS = ["Cùng tuổi", "Lục hợp", "Tam hợp", "Lục xung", "Lục hại", "Tứ hành xung", "Bình hoà"] as const;

export const conGiapContent = z
  .object({
    meta: metaSchema,
    animals: z.record(z.string(), animalEntrySchema),
    /** Giải thích chung cho từng quan hệ giữa hai tuổi. */
    relations: z.record(z.enum(RELATIONS), z.object({ headline: text, body: text })),
    /** Bài viết riêng cho từng cặp tuổi, khoá là slug cặp chuẩn (vd. "ty-va-suu"). */
    pairs: z.record(z.string(), z.object({ summary: text, deep: deepSchema })),
  })
  .superRefine((c, ctx) => {
    for (const k of Object.keys(c.animals)) if (!DIA_CHI.some((d) => d.slug === k)) ctx.addIssue({ code: "custom", message: `Không có tuổi ${k}` });
    for (const k of Object.keys(c.pairs)) if (!parseConGiapPairSlug(k)) ctx.addIssue({ code: "custom", message: `Slug cặp sai: ${k}` });
  })
  .parse(conGiapJson);

export const chiBySlug = (slug: string) => {
  const index = DIA_CHI.findIndex((d) => d.slug === slug);
  return index < 0 ? null : { ...DIA_CHI[index], index, element: CHI_ELEMENT[index] };
};
export type Chi = NonNullable<ReturnType<typeof chiBySlug>>;

export const conGiapSlugsWithContent = () => DIA_CHI.map((d) => d.slug).filter((s) => conGiapContent.animals[s]);

/** Các năm âm lịch của một tuổi trong khoảng [from, to], kèm can chi, nạp âm và ngày Tết mở đầu năm đó. */
export function yearsOfChi(index: number, from = 1936, to = 2032) {
  const years: Array<ReturnType<typeof canChiOfLunarYear> & { tet: SolarDate }> = [];
  for (let y = from; y <= to; y++) {
    const cc = canChiOfLunarYear(y);
    if (cc.chiIndex === index) years.push({ ...cc, tet: lunarNewYear(y) });
  }
  return years;
}

/** 11 tuổi còn lại, nhóm theo quan hệ, theo thứ tự từ hợp nhất tới khó nhất. */
export function relationsOfChi(index: number) {
  const order: ChiRelation[] = ["Lục hợp", "Tam hợp", "Bình hoà", "Tứ hành xung", "Lục hại", "Lục xung"];
  return order
    .map((relation) => ({
      relation,
      score: CHI_RELATION_SCORE[relation],
      chis: DIA_CHI.map((d, j) => ({ ...d, index: j })).filter((d) => d.index !== index && chiRelation(index, d.index) === relation),
    }))
    .filter((g) => g.chis.length > 0);
}

export function getConGiap(slug: string) {
  const chi = chiBySlug(slug);
  const entry = conGiapContent.animals[slug];
  if (!chi || !entry) return null;
  return { chi, entry, years: yearsOfChi(chi.index), relations: relationsOfChi(chi.index) };
}

// ---- Cặp con giáp (78 cặp) ----

export function getConGiapPair(slug: string) {
  const pair = parseConGiapPairSlug(slug);
  const article = conGiapContent.pairs[slug];
  if (!pair || !article) return null;
  const [i, j] = pair;
  const relation = chiRelation(i, j);
  return {
    slug,
    a: chiBySlug(DIA_CHI[i].slug)!,
    b: chiBySlug(DIA_CHI[j].slug)!,
    relation,
    score: CHI_RELATION_SCORE[relation],
    relationText: conGiapContent.relations[relation],
    article,
  };
}

export const conGiapPairSlugsWithContent = () => Object.keys(conGiapContent.pairs);

// ---- Năm sinh ----


/** Năm sinh có đủ nội dung (đoạn về thiên can và nạp âm) để dựng trang. */
export function birthYearsWithContent() {
  const years: number[] = [];
  for (let y = BIRTH_YEAR_RANGE.from; y <= BIRTH_YEAR_RANGE.to; y++) {
    const cc = canChiOfLunarYear(y);
    if (nguHanhContent.thienCan[cc.can] && nguHanhContent.napAm[cc.napAm]) years.push(y);
  }
  return years;
}

export function getBirthYear(year: number) {
  if (!Number.isInteger(year) || year < BIRTH_YEAR_RANGE.from || year > BIRTH_YEAR_RANGE.to) return null;
  const cc = canChiOfLunarYear(year);
  const canText = nguHanhContent.thienCan[cc.can];
  const napAmText = nguHanhContent.napAm[cc.napAm];
  if (!canText || !napAmText) return null;
  const can = CAN_INFO[THIEN_CAN.indexOf(cc.can as (typeof THIEN_CAN)[number])];
  return {
    year,
    canChi: cc,
    can,
    chi: chiBySlug(cc.animalSlug)!,
    tet: lunarNewYear(year),
    nextTet: lunarNewYear(year + 1),
    previous: canChiOfLunarYear(year - 1),
    canText,
    napAmText,
    elementSlug: ELEMENT_SLUGS[cc.element],
    hasConGiapPage: Boolean(conGiapContent.animals[cc.animalSlug]),
    hasElementPage: Boolean(nguHanhContent.elements[ELEMENT_SLUGS[cc.element]]),
  };
}
