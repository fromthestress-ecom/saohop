/**
 * Kho kiến thức (knowledge base): nội dung tra cứu cố định, đã biên tập, không cần AI khi hiển thị.
 * - Nội dung văn bản nằm ở src/content/*.json và được kiểm tra schema khi build.
 * - Dữ liệu tính được (ngày, nguyên tố, cung/số hợp nhau) lấy từ engine để không bao giờ lệch với kết quả check crush.
 * - AI dùng các mục này làm căn cứ khi luận giải (xem src/lib/ai/prompts.ts).
 */

import { z } from "zod";
import lifePathJson from "@/content/life-path.json";
import zodiacPairsJson from "@/content/zodiac-pairs.json";
import zodiacVariantsJson from "@/content/zodiac-variants.json";
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

// ---- Biến thể của cung: theo giới tính và theo tháng sinh ----

export interface DayMonth {
  day: number;
  month: number;
}

export interface SignMonthRange {
  month: number;
  from: number;
  to: number;
}

const daysInMonth = (month: number, year: number) => new Date(Date.UTC(year, month, 0)).getUTCDate();

/** Hai tháng mà một cung trải qua, kèm khoảng ngày trong từng tháng (tính cả 29/02). */
export function zodiacMonths(sign: ZodiacSign): [SignMonthRange, SignMonthRange] {
  const next = ZODIAC_SIGNS[(sign.index + 1) % 12];
  const [m1, d1] = sign.start;
  const [m2, d2] = next.start;
  return [
    { month: m1, from: d1, to: daysInMonth(m1, 2000) },
    { month: m2, from: 1, to: d2 - 1 },
  ];
}

export interface ZodiacDecan {
  index: 1 | 2 | 3;
  /** Cung cùng nguyên tố đồng chủ quản thập độ này (thập độ 1 là chính cung đó). */
  coSign: ZodiacSign;
  from: DayMonth;
  to: DayMonth;
}

/**
 * Ba thập độ (decan) của cung, mỗi thập độ khoảng 10 ngày (10 độ hoàng đạo), theo hệ tam hợp:
 * thập độ 1 thuộc chính cung, thập độ 2 và 3 thuộc hai cung cùng nguyên tố kế tiếp.
 */
export function zodiacDecans(sign: ZodiacSign): ZodiacDecan[] {
  const next = ZODIAC_SIGNS[(sign.index + 1) % 12];
  const start = Date.UTC(2001, sign.start[0] - 1, sign.start[1]);
  const endYear = next.start[0] < sign.start[0] ? 2002 : 2001;
  const end = Date.UTC(endYear, next.start[0] - 1, next.start[1] - 1);
  const DAY = 86_400_000;
  const dm = (t: number): DayMonth => {
    const d = new Date(t);
    return { day: d.getUTCDate(), month: d.getUTCMonth() + 1 };
  };
  return ([1, 2, 3] as const).map((index) => ({
    index,
    coSign: ZODIAC_SIGNS[(sign.index + 4 * (index - 1)) % 12],
    from: dm(start + 10 * (index - 1) * DAY),
    to: dm(index === 3 ? end : start + (10 * index - 1) * DAY),
  }));
}

/** Các thập độ rơi vào một tháng, với ngày đã cắt theo tháng đó (29/02 thuộc thập độ cuối tháng 2). */
export function zodiacDecansInMonth(sign: ZodiacSign, month: number) {
  const range = zodiacMonths(sign).find((r) => r.month === month);
  if (!range) return [];
  return zodiacDecans(sign)
    .filter((d) => d.from.month === month || d.to.month === month)
    .map((d) => ({
      ...d,
      from: d.from.month === month ? d.from.day : 1,
      to: d.to.month === month ? (d.to.day === daysInMonth(month, 2001) ? range.to : d.to.day) : range.to,
    }));
}

export type ZodiacVariantKind = "nam" | "nu" | "thang";

const variantArticleSchema = z.object({ summary: text, deep: deepSchema });

export const zodiacVariantsContent = z
  .object({
    meta: metaSchema,
    signs: z.record(
      z.string(),
      z.object({
        nam: variantArticleSchema,
        nu: variantArticleSchema,
        thang: z.record(z.string(), variantArticleSchema),
      }),
    ),
  })
  .superRefine((c, ctx) => {
    for (const [slug, v] of Object.entries(c.signs)) {
      const sign = zodiacBySlug(slug);
      if (!sign) {
        ctx.addIssue({ code: "custom", message: `Không có cung ${slug}` });
        continue;
      }
      const months = zodiacMonths(sign).map((r) => String(r.month)).sort();
      if (Object.keys(v.thang).sort().join() !== months.join()) {
        ctx.addIssue({ code: "custom", message: `${slug} cần đúng các tháng ${months.join(", ")}` });
      }
    }
  })
  .parse(zodiacVariantsJson);

/** Nhãn hiển thị của một biến thể: "Song Ngư nam", "Song Ngư nữ", "Song Ngư tháng 3". */
export function zodiacVariantLabel(sign: ZodiacSign, kind: ZodiacVariantKind, month?: number) {
  return kind === "thang" ? `${sign.name} tháng ${month}` : `${sign.name} ${kind === "nam" ? "nam" : "nữ"}`;
}

export function parseZodiacVariant(variant: string): { kind: ZodiacVariantKind; month?: number } | null {
  if (variant === "nam" || variant === "nu") return { kind: variant };
  const m = /^thang-(\d{1,2})$/.exec(variant);
  return m ? { kind: "thang", month: Number(m[1]) } : null;
}

/** Các trang biến thể đã có nội dung của một cung, theo thứ tự nam, nữ, tháng đầu, tháng sau. */
export function zodiacVariantLinks(sign: ZodiacSign) {
  const v = zodiacVariantsContent.signs[sign.slug];
  if (!v) return [];
  return [
    { variant: "nam", kind: "nam" as const, label: zodiacVariantLabel(sign, "nam") },
    { variant: "nu", kind: "nu" as const, label: zodiacVariantLabel(sign, "nu") },
    ...zodiacMonths(sign).map((r) => ({ variant: `thang-${r.month}`, kind: "thang" as const, month: r.month, label: zodiacVariantLabel(sign, "thang", r.month) })),
  ].map((l) => ({ ...l, href: `/cung-hoang-dao/${sign.slug}/${l.variant}` }));
}

export function getZodiacVariant(slug: string, variant: string) {
  const base = getZodiac(slug);
  const parsed = parseZodiacVariant(variant);
  const v = zodiacVariantsContent.signs[slug];
  if (!base || !parsed || !v) return null;
  const article = parsed.kind === "thang" ? v.thang[String(parsed.month)] : v[parsed.kind];
  if (!article) return null;
  const monthRange = parsed.kind === "thang" ? zodiacMonths(base.sign).find((r) => r.month === parsed.month) ?? null : null;
  return {
    ...base,
    ...parsed,
    variant,
    label: zodiacVariantLabel(base.sign, parsed.kind, parsed.month),
    article,
    monthRange,
    /** Thập độ rơi vào tháng sinh (chỉ có ở trang theo tháng). */
    decans: parsed.kind === "thang" ? zodiacDecansInMonth(base.sign, parsed.month!) : [],
  };
}
