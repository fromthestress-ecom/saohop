/**
 * Cung hoàng đạo (chiêm tinh phương Tây, cung Mặt Trời) theo bảng ngày phổ biến.
 * Ngày giáp ranh lệch ±1 ngày theo năm; khi có giờ + nơi sinh sẽ tính chính xác bằng ephemeris.
 */

import type { SolarDate } from "./types";

export type ZodiacElement = "Lửa" | "Đất" | "Khí" | "Nước";
export type ZodiacModality = "Tiên phong" | "Kiên định" | "Linh hoạt";

export interface ZodiacSign {
  index: number;
  slug: string;
  name: string;
  altName?: string;
  symbol: string;
  element: ZodiacElement;
  modality: ZodiacModality;
  /** [tháng, ngày] bắt đầu */
  start: readonly [number, number];
}

const ELEMENTS: ZodiacElement[] = ["Lửa", "Đất", "Khí", "Nước"];
const MODALITIES: ZodiacModality[] = ["Tiên phong", "Kiên định", "Linh hoạt"];

const RAW = [
  ["bach-duong", "Bạch Dương", undefined, "♈", [3, 21]],
  ["kim-nguu", "Kim Ngưu", undefined, "♉", [4, 20]],
  ["song-tu", "Song Tử", undefined, "♊", [5, 21]],
  ["cu-giai", "Cự Giải", undefined, "♋", [6, 21]],
  ["su-tu", "Sư Tử", undefined, "♌", [7, 23]],
  ["xu-nu", "Xử Nữ", undefined, "♍", [8, 23]],
  ["thien-binh", "Thiên Bình", undefined, "♎", [9, 23]],
  ["bo-cap", "Bọ Cạp", "Thiên Yết", "♏", [10, 23]],
  ["nhan-ma", "Nhân Mã", undefined, "♐", [11, 22]],
  ["ma-ket", "Ma Kết", undefined, "♑", [12, 22]],
  ["bao-binh", "Bảo Bình", undefined, "♒", [1, 20]],
  ["song-ngu", "Song Ngư", undefined, "♓", [2, 19]],
] as const;

export const ZODIAC_SIGNS: readonly ZodiacSign[] = RAW.map(([slug, name, altName, symbol, start], index) => ({
  index,
  slug,
  name,
  altName,
  symbol,
  element: ELEMENTS[index % 4],
  modality: MODALITIES[index % 3],
  start,
}));

export interface ZodiacResult {
  sign: ZodiacSign;
  /** Sinh sát ngày chuyển cung — cung thật có thể là cung kề bên tuỳ năm/giờ sinh. */
  isCusp: boolean;
}

const dayOfYear = (month: number, day: number) => month * 100 + day;

export function sunSignOf({ day, month }: SolarDate): ZodiacResult {
  const key = dayOfYear(month, day);
  // Tìm cung có ngày bắt đầu lớn nhất mà ≤ ngày sinh; trước 20/1 là Ma Kết.
  let found: ZodiacSign = ZODIAC_SIGNS[9];
  let best = -1;
  for (const sign of ZODIAC_SIGNS) {
    const start = dayOfYear(sign.start[0], sign.start[1]);
    if (start <= key && start > best) {
      best = start;
      found = sign;
    }
  }
  const isCusp = ZODIAC_SIGNS.some((s) => {
    const startKey = dayOfYear(s.start[0], s.start[1]);
    return key === startKey || (s.start[0] === month && s.start[1] - 1 === day);
  });
  return { sign: found, isCusp };
}

export function zodiacBySlug(slug: string): ZodiacSign | undefined {
  return ZODIAC_SIGNS.find((s) => s.slug === slug);
}
