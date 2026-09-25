/**
 * Thần số học Pythagoras theo trường phái phổ biến ở Việt Nam (David A. Phillips):
 * - Số chủ đạo: cộng mọi chữ số ngày sinh, rút gọn tới khi nằm trong 2–11, giữ 22 và 33.
 * - Chỉ số theo tên: bảng chữ cái Pythagoras, bỏ dấu tiếng Việt, rút gọn về 1–9 (giữ 11/22/33).
 */

import type { PersonInput, SolarDate } from "./types";

export const MASTER_NUMBERS = [11, 22, 33] as const;

/** Mọi số chủ đạo có thể có theo cách rút gọn của trường phái này. */
export const LIFE_PATH_NUMBERS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 33] as const;

const digitSum = (n: number) =>
  String(n)
    .split("")
    .reduce((acc, d) => acc + Number(d), 0);

const digitsOfDate = ({ day, month, year }: SolarDate) =>
  `${day}${month}${year}`.split("").map(Number);

/** Rút gọn kiểu số chủ đạo: dừng ở 2–11, giữ 22/33. */
export function reduceLifePath(n: number): number {
  let x = n;
  while (x > 11 && x !== 22 && x !== 33) x = digitSum(x);
  return x;
}

/** Rút gọn về 1–9, giữ số master. */
export function reduceKeepMaster(n: number): number {
  let x = n;
  while (x > 9 && !(MASTER_NUMBERS as readonly number[]).includes(x)) x = digitSum(x);
  return x;
}

export const reduceToDigit = (n: number): number => {
  let x = n;
  while (x > 9) x = digitSum(x);
  return x;
};

/** Số gốc 1–9 dùng để so hợp (11→2, 22→4, 33→6, 10→1). */
export const baseNumber = (n: number) => reduceToDigit(n);

export function lifePathNumber(date: SolarDate): number {
  return reduceLifePath(digitsOfDate(date).reduce((a, b) => a + b, 0));
}

/** Số ngày sinh: ngày sinh rút gọn (giữ 11, 22). */
export function birthdayNumber({ day }: SolarDate): number {
  return reduceKeepMaster(day);
}

/** Số thái độ: ngày + tháng. */
export function attitudeNumber({ day, month }: SolarDate): number {
  return reduceToDigit(day + month);
}

/** Năm cá nhân: ngày + tháng sinh + năm hiện tại, rút về 1–9. */
export function personalYearNumber({ day, month }: SolarDate, currentYear: number): number {
  return reduceToDigit(digitSum(day) + digitSum(month) + digitSum(currentYear));
}

// ---- Chỉ số theo tên ----

const LETTER_VALUES: Record<string, number> = {};
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((ch, i) => {
  LETTER_VALUES[ch] = (i % 9) + 1;
});

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

/** Bỏ dấu tiếng Việt, chuẩn hoá chữ hoa, chỉ giữ chữ cái và khoảng trắng. */
export function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toUpperCase()
    .replace(/[^A-Z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Y được coi là nguyên âm khi không đứng cạnh nguyên âm khác trong cùng một từ
 * (vd. "MY", "LY" → nguyên âm; "HUY", "YEN", "THUY" → phụ âm).
 */
function isVowelAt(word: string, i: number): boolean {
  const ch = word[i];
  if (VOWELS.has(ch)) return true;
  if (ch !== "Y") return false;
  return !VOWELS.has(word[i - 1] ?? "") && !VOWELS.has(word[i + 1] ?? "");
}

interface NameSums {
  all: number;
  vowels: number;
  consonants: number;
}

function sumName(name: string): NameSums {
  const sums: NameSums = { all: 0, vowels: 0, consonants: 0 };
  for (const word of normalizeName(name).split(" ")) {
    for (let i = 0; i < word.length; i++) {
      const v = LETTER_VALUES[word[i]];
      if (!v) continue;
      sums.all += v;
      if (isVowelAt(word, i)) sums.vowels += v;
      else sums.consonants += v;
    }
  }
  return sums;
}

export interface NameNumbers {
  /** Số sứ mệnh (Expression / Destiny) — toàn bộ chữ cái. */
  expression: number;
  /** Số linh hồn (Soul Urge) — nguyên âm. */
  soulUrge: number;
  /** Số nhân cách (Personality) — phụ âm. */
  personality: number;
}

export function nameNumbers(fullName: string): NameNumbers | null {
  const sums = sumName(fullName);
  if (sums.all === 0) return null;
  return {
    expression: reduceKeepMaster(sums.all),
    soulUrge: reduceKeepMaster(sums.vowels),
    personality: reduceKeepMaster(sums.consonants),
  };
}

// ---- Biểu đồ ngày sinh & mũi tên ----

export interface Arrow {
  digits: readonly [number, number, number];
  /** Tên khi có đủ 3 số */
  fullName: string;
  /** Tên khi trống cả 3 số */
  emptyName: string;
}

export const ARROWS: readonly Arrow[] = [
  { digits: [1, 2, 3], fullName: "Mũi tên Kế hoạch", emptyName: "Mũi tên Thiếu kế hoạch" },
  { digits: [4, 5, 6], fullName: "Mũi tên Ý chí", emptyName: "Mũi tên Uất giận" },
  { digits: [7, 8, 9], fullName: "Mũi tên Hoạt động", emptyName: "Mũi tên Thụ động" },
  { digits: [1, 4, 7], fullName: "Mũi tên Thực tế", emptyName: "Mũi tên Thiếu thực tế" },
  { digits: [2, 5, 8], fullName: "Mũi tên Cân bằng cảm xúc", emptyName: "Mũi tên Nhạy cảm" },
  { digits: [3, 6, 9], fullName: "Mũi tên Trí tuệ", emptyName: "Mũi tên Trí nhớ ngắn hạn" },
  { digits: [1, 5, 9], fullName: "Mũi tên Quyết tâm", emptyName: "Mũi tên Trì hoãn" },
  { digits: [3, 5, 7], fullName: "Mũi tên Tâm linh", emptyName: "Mũi tên Hoài nghi" },
];

export interface BirthChart {
  /** counts[d] = số lần chữ số d (1–9) xuất hiện trong ngày sinh */
  counts: Record<number, number>;
  fullArrows: string[];
  emptyArrows: string[];
  missingDigits: number[];
}

export function birthChart(date: SolarDate): BirthChart {
  const counts: Record<number, number> = {};
  for (let d = 1; d <= 9; d++) counts[d] = 0;
  for (const d of digitsOfDate(date)) if (d > 0) counts[d]++;
  const fullArrows: string[] = [];
  const emptyArrows: string[] = [];
  for (const arrow of ARROWS) {
    if (arrow.digits.every((d) => counts[d] > 0)) fullArrows.push(arrow.fullName);
    else if (arrow.digits.every((d) => counts[d] === 0)) emptyArrows.push(arrow.emptyName);
  }
  const missingDigits = Object.keys(counts)
    .map(Number)
    .filter((d) => counts[d] === 0);
  return { counts, fullArrows, emptyArrows, missingDigits };
}

// ---- Tổng hợp ----

export interface NumerologyProfile {
  lifePath: number;
  birthday: number;
  attitude: number;
  personalYear: number;
  name: NameNumbers | null;
  chart: BirthChart;
}

export function numerologyProfile(person: PersonInput, currentYear: number): NumerologyProfile {
  const date = person.birthDate;
  return {
    lifePath: lifePathNumber(date),
    birthday: birthdayNumber(date),
    attitude: attitudeNumber(date),
    personalYear: personalYearNumber(date, currentYear),
    name: person.fullName ? nameNumbers(person.fullName) : null,
    chart: birthChart(date),
  };
}
