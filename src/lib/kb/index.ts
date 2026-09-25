/**
 * Kho kiến thức (knowledge base): nội dung tra cứu cố định, đã biên tập, không cần AI khi hiển thị.
 * - Nội dung văn bản nằm ở src/content/*.json và được kiểm tra schema khi build.
 * - Dữ liệu tính được (ngày, nguyên tố, cung/số hợp nhau) lấy từ engine để không bao giờ lệch với kết quả check crush.
 * - AI dùng các mục này làm căn cứ khi luận giải (xem src/lib/ai/prompts.ts).
 */

import { z } from "zod";
import lifePathJson from "@/content/life-path.json";
import zodiacPairsJson from "@/content/zodiac-pairs.json";
import zodiacJson from "@/content/zodiac.json";
import { numberCompat, zodiacAspect } from "@/lib/engines/compatibility";
import { LIFE_PATH_NUMBERS, lifePathNumber } from "@/lib/engines/numerology";
import type { SolarDate } from "@/lib/engines/types";
import { ZODIAC_SIGNS, zodiacBySlug, type ZodiacSign } from "@/lib/engines/zodiac";

const text = z.string().trim().min(1);
const list = z.array(text).min(2);

const metaSchema = z.object({
  system: z.string(),
  version: z.number().int(),
  reviewed: z.boolean(),
  note: z.string(),
});

/** Bài viết chuyên sâu: các mục có tiêu đề (đoạn văn, có thể kèm gạch đầu dòng) và hỏi đáp. */
const deepSchema = z.object({
  sections: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/),
        heading: text,
        paragraphs: z.array(text).min(1),
        bullets: z.array(text).min(2).optional(),
      }),
    )
    .min(3)
    .refine((s) => new Set(s.map((x) => x.id)).size === s.length, "id các mục phải khác nhau"),
  faq: z.array(z.object({ q: text, a: text })).default([]),
});

const zodiacEntrySchema = z.object({
  slug: z.string(),
  ruler: text,
  summary: text,
  strengths: list,
  weaknesses: list,
  inLove: text,
  dateIdea: text,
  advice: text,
  deep: deepSchema.optional(),
});

const lifePathEntrySchema = z.object({
  number: z.number().int(),
  title: text,
  summary: text,
  strengths: list,
  challenges: list,
  inLove: text,
  career: text,
  advice: text,
  deep: deepSchema.optional(),
});

export const zodiacContent = z.object({ meta: metaSchema, entries: z.array(zodiacEntrySchema) }).parse(zodiacJson);
export const lifePathContent = z.object({ meta: metaSchema, entries: z.array(lifePathEntrySchema) }).parse(lifePathJson);

export type ZodiacEntry = z.infer<typeof zodiacEntrySchema>;
export type DeepContent = z.infer<typeof deepSchema>;
export type LifePathEntry = z.infer<typeof lifePathEntrySchema>;

// ---- Cung hoàng đạo ----

const pad = (n: number) => String(n).padStart(2, "0");

/** "21/03 - 19/04", suy ra từ ngày bắt đầu của cung này và cung kế tiếp trong engine. */
export function zodiacDateRange(sign: ZodiacSign): string {
  const next = ZODIAC_SIGNS[(sign.index + 1) % 12];
  const end = new Date(Date.UTC(2001, next.start[0] - 1, next.start[1] - 1));
  return `${pad(sign.start[1])}/${pad(sign.start[0])} - ${pad(end.getUTCDate())}/${pad(end.getUTCMonth() + 1)}`;
}

export interface ZodiacMatch {
  sign: ZodiacSign;
  relation: string;
  score: number;
}

/** Xếp hạng độ hợp của một cung với 11 cung còn lại, dùng đúng bảng điểm của engine. */
export function zodiacMatches(sign: ZodiacSign): ZodiacMatch[] {
  return ZODIAC_SIGNS.filter((s) => s.slug !== sign.slug)
    .map((s) => {
      const aspect = zodiacAspect(sign, s);
      return { sign: s, relation: aspect.relation, score: aspect.score };
    })
    .sort((a, b) => b.score - a.score || a.sign.index - b.sign.index);
}

export function getZodiac(slug: string) {
  const sign = zodiacBySlug(slug);
  const entry = zodiacContent.entries.find((e) => e.slug === slug);
  if (!sign || !entry) return null;
  return { sign, entry, dateRange: zodiacDateRange(sign) };
}

// ---- Cặp đôi cung hoàng đạo (78 cặp) ----

const ELEMENT_ORDER = ["Lửa", "Đất", "Khí", "Nước"] as const;
const MODALITY_ORDER = ["Tiên phong", "Kiên định", "Linh hoạt"] as const;

/** Khoá không phân biệt thứ tự, theo thứ tự chuẩn: "Lửa+Nước", "Tiên phong+Linh hoạt". */
function unorderedKey<T extends string>(order: readonly T[], a: T, b: T) {
  return [a, b].sort((x, y) => order.indexOf(x) - order.indexOf(y)).join("+");
}

const ELEMENT_KEYS = ELEMENT_ORDER.flatMap((a, i) => ELEMENT_ORDER.slice(i).map((b) => `${a}+${b}`));
const MODALITY_KEYS = MODALITY_ORDER.flatMap((a, i) => MODALITY_ORDER.slice(i).map((b) => `${a}+${b}`));

const aspectBlockSchema = z.object({ headline: text, body: text, tip: text });
const exactKeys = (keys: string[]) => (o: Record<string, unknown>) =>
  Object.keys(o).length === keys.length && keys.every((k) => k in o);

/** Slug chuẩn của một cặp: cung đứng trước trên vòng hoàng đạo viết trước, vd. "bach-duong-va-su-tu". */
export function zodiacPairSlug(a: ZodiacSign, b: ZodiacSign): string {
  const [x, y] = a.index <= b.index ? [a, b] : [b, a];
  return `${x.slug}-va-${y.slug}`;
}

/** Mọi cặp theo thứ tự chuẩn: 66 cặp khác cung + 12 cặp cùng cung = 78. */
export const ZODIAC_PAIRS: ReadonlyArray<readonly [ZodiacSign, ZodiacSign]> = ZODIAC_SIGNS.flatMap((a) =>
  ZODIAC_SIGNS.filter((b) => b.index >= a.index).map((b) => [a, b] as const),
);

export const zodiacPairsContent = z
  .object({
    meta: metaSchema,
    aspects: z.record(z.string(), aspectBlockSchema).refine(exactKeys(["0", "1", "2", "3", "4", "5", "6"]), "Cần đủ 7 góc chiếu 0..6"),
    elements: z.record(z.string(), text).refine(exactKeys(ELEMENT_KEYS), "Cần đủ 10 cặp nguyên tố"),
    modalities: z.record(z.string(), text).refine(exactKeys(MODALITY_KEYS), "Cần đủ 6 cặp tính chất"),
    /** Bài viết riêng cho từng cặp, khoá là slug chuẩn của cặp. */
    overrides: z
      .record(z.string(), z.object({ summary: text, deep: deepSchema.optional() }))
      .refine((o) => Object.keys(o).every((slug) => ZODIAC_PAIRS.some(([a, b]) => zodiacPairSlug(a, b) === slug)), "Khoá overrides phải là slug cặp chuẩn"),
  })
  .parse(zodiacPairsJson);

/** Chỉ nhận slug theo thứ tự chuẩn để mỗi cặp có đúng một URL. */
export function parseZodiacPairSlug(slug: string): readonly [ZodiacSign, ZodiacSign] | null {
  return ZODIAC_PAIRS.find(([a, b]) => zodiacPairSlug(a, b) === slug) ?? null;
}

export function getZodiacPair(slug: string) {
  const pair = parseZodiacPairSlug(slug);
  if (!pair) return null;
  const [a, b] = pair;
  const entryA = getZodiac(a.slug);
  const entryB = getZodiac(b.slug);
  if (!entryA || !entryB) return null;
  const raw = Math.abs(a.index - b.index);
  const distance = Math.min(raw, 12 - raw);
  const aspect = zodiacAspect(a, b);
  return {
    slug,
    a: entryA,
    b: entryB,
    relation: aspect.relation,
    score: aspect.score,
    passion: aspect.passion,
    aspectText: zodiacPairsContent.aspects[String(distance)],
    elementText: zodiacPairsContent.elements[unorderedKey(ELEMENT_ORDER, a.element, b.element)],
    modalityText: zodiacPairsContent.modalities[unorderedKey(MODALITY_ORDER, a.modality, b.modality)],
    override: zodiacPairsContent.overrides[slug] ?? null,
  };
}

// ---- Số chủ đạo ----

export const lifePathSlug = (n: number) => `so-${n}`;

export function parseLifePathSlug(slug: string): number | null {
  const match = /^so-(\d+)$/.exec(slug);
  const n = match ? Number(match[1]) : NaN;
  return (LIFE_PATH_NUMBERS as readonly number[]).includes(n) ? n : null;
}

export interface LifePathMatch {
  number: number;
  relation: string;
  score: number;
}

export function lifePathMatches(n: number): LifePathMatch[] {
  return LIFE_PATH_NUMBERS.filter((m) => m !== n)
    .map((m) => {
      const f = numberCompat(n, m);
      return { number: m, relation: f.relation, score: f.score };
    })
    .sort((a, b) => b.score - a.score || a.number - b.number);
}

export interface LifePathExample {
  date: SolarDate;
  /** Các chữ số của ngày sinh, theo thứ tự ngày, tháng, năm. */
  digits: number[];
  total: number;
  /** Các lần rút gọn sau tổng, rỗng nếu tổng đã là số chủ đạo. */
  steps: number[];
}

const sumDigits = (n: number) => String(n).split("").reduce((a, d) => a + Number(d), 0);

/**
 * Một ngày sinh ví dụ ra đúng số chủ đạo n, dùng engine để tính nên luôn khớp với trang ban-do.
 * Ưu tiên người sinh quanh năm 2000 và ví dụ có ít nhất một bước rút gọn (trừ 22 và 33, vốn phải là tổng giữ nguyên).
 */
export function lifePathExample(n: number): LifePathExample | null {
  const years = [2000, 2001, 2002, 2003, 2004, 2005, 1999, 1998, 1997, 1996, 1995];
  for (const year of years) {
    for (let month = 1; month <= 12; month++) {
      for (let day = 1; day <= 28; day++) {
        const date = { day, month, year };
        if (lifePathNumber(date) !== n) continue;
        const digits = `${day}${month}${year}`.split("").map(Number);
        const total = digits.reduce((a, b) => a + b, 0);
        if (total === n && n !== 22 && n !== 33) continue;
        const steps: number[] = [];
        for (let x = total; x !== n; ) steps.push((x = sumDigits(x)));
        return { date, digits, total, steps };
      }
    }
  }
  return null;
}

export function getLifePath(n: number) {
  return lifePathContent.entries.find((e) => e.number === n) ?? null;
}
