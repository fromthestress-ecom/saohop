/**
 * Slug và khoá của kho kiến thức, tách riêng khỏi nội dung để phía trình duyệt (check crush)
 * dựng được đường dẫn tới bài viết mà không phải tải cả kho nội dung.
 */

import { DIA_CHI, type NguHanh } from "@/lib/engines/can-chi";
import type { ZodiacSign } from "@/lib/engines/zodiac";

/** Slug chuẩn của một cặp: cung đứng trước trên vòng hoàng đạo viết trước, vd. "bach-duong-va-su-tu". */
export function zodiacPairSlug(a: ZodiacSign, b: ZodiacSign): string {
  const [x, y] = a.index <= b.index ? [a, b] : [b, a];
  return `${x.slug}-va-${y.slug}`;
}

export const ELEMENT_ORDER = ["Lửa", "Đất", "Khí", "Nước"] as const;

/** Khoá không phân biệt thứ tự, theo thứ tự chuẩn: "Lửa+Nước", "Tiên phong+Linh hoạt". */
export function unorderedKey<T extends string>(order: readonly T[], a: T, b: T) {
  return [a, b].sort((x, y) => order.indexOf(x) - order.indexOf(y)).join("+");
}

export const lifePathSlug = (n: number) => `so-${n}`;

/** Slug chuẩn của 78 cặp tuổi (tuổi đứng trước trên vòng 12 con giáp viết trước), vd. "ty-va-suu". */
export const conGiapPairSlug = (i: number, j: number) => {
  const [a, b] = i <= j ? [i, j] : [j, i];
  return `${DIA_CHI[a].slug}-va-${DIA_CHI[b].slug}`;
};

export const ELEMENT_SLUGS: Record<NguHanh, string> = { Kim: "kim", Thủy: "thuy", Mộc: "moc", Hỏa: "hoa", Thổ: "tho" };

/** Các năm sinh có trang riêng /nam-sinh/[năm]. */
export const BIRTH_YEAR_RANGE = { from: 1950, to: 2015 } as const;
