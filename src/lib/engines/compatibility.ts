/**
 * Tính độ hợp giữa hai người từ các hệ huyền học — hoàn toàn tất định.
 * Điểm ở đây là "dữ liệu" để AI diễn giải, không phải do AI tự nghĩ ra.
 */

import { NGU_HANH, type NguHanh } from "./can-chi";
import { baseNumber } from "./numerology";
import type { PersonProfile } from "./profile";
import type { ZodiacSign } from "./zodiac";

export type FactorSystem = "so-chu-dao" | "so-linh-hon" | "cung-hoang-dao" | "con-giap" | "ngu-hanh";

export interface CompatFactor {
  system: FactorSystem;
  /** Tên mối quan hệ, vd. "Tam hợp", "Tam hợp nguyên tố" */
  relation: string;
  /** Mô tả ngắn, trung tính, để UI hiển thị và AI mở rộng */
  detail: string;
  score: number;
}

export type DimensionKey = "tinhCam" | "giaoTiep" | "giaTri" | "damMe" | "lauDai";

export const DIMENSION_LABELS: Record<DimensionKey, string> = {
  tinhCam: "Tình cảm",
  giaoTiep: "Giao tiếp",
  giaTri: "Giá trị sống",
  damMe: "Đam mê",
  lauDai: "Lâu dài",
};

export interface CompatibilityResult {
  overall: number;
  verdict: string;
  dimensions: Record<DimensionKey, number>;
  factors: CompatFactor[];
}

// ---- Thần số học: nhóm tương hợp của Phillips ----

const NUMBER_GROUPS: Record<number, "tu-do" | "thuc-te" | "sang-tao"> = {
  1: "tu-do", 5: "tu-do", 7: "tu-do",
  2: "thuc-te", 4: "thuc-te", 8: "thuc-te",
  3: "sang-tao", 6: "sang-tao", 9: "sang-tao",
};

const GROUP_LABEL = { "tu-do": "tự do và độc lập", "thuc-te": "thực tế và vun đắp", "sang-tao": "sáng tạo và cảm xúc" };

export function numberCompat(a: number, b: number, system: "so-chu-dao" | "so-linh-hon" = "so-chu-dao"): CompatFactor {
  const x = baseNumber(a);
  const y = baseNumber(b);
  const gx = NUMBER_GROUPS[x];
  const gy = NUMBER_GROUPS[y];
  const pair = `${a} & ${b}`;
  if (x === y) {
    return { system, relation: "Cùng số", detail: `${pair}: rất hiểu nhau nhưng dễ thấy khuyết điểm của chính mình ở người kia`, score: 75 };
  }
  if (gx === gy) {
    return { system, relation: "Cùng nhóm", detail: `${pair}: cùng nhóm ${GROUP_LABEL[gx]}, nhịp sống tự nhiên ăn khớp`, score: 88 };
  }
  const key = [gx, gy].sort().join("|");
  const cross: Record<string, number> = {
    "sang-tao|tu-do": 68,
    "sang-tao|thuc-te": 62,
    "thuc-te|tu-do": 55,
  };
  return {
    system,
    relation: "Khác nhóm",
    detail: `${pair}: ${GROUP_LABEL[gx]} gặp ${GROUP_LABEL[gy]}, bù trừ cho nhau nếu chịu lắng nghe`,
    score: cross[key],
  };
}

// ---- Cung hoàng đạo: góc chiếu giữa hai cung ----

const ASPECTS: Record<number, { relation: string; score: number; passion: number }> = {
  0: { relation: "Cùng cung", score: 72, passion: 80 },
  1: { relation: "Bán lục hợp", score: 55, passion: 58 },
  2: { relation: "Lục hợp (sextile)", score: 82, passion: 78 },
  3: { relation: "Vuông góc (square)", score: 48, passion: 70 },
  4: { relation: "Tam hợp nguyên tố (trine)", score: 92, passion: 88 },
  5: { relation: "Lệch pha (quincunx)", score: 50, passion: 60 },
  6: { relation: "Đối xứng (opposition)", score: 76, passion: 90 },
};

/** Góc chiếu giữa hai cung (dùng cho cả check crush lẫn trang tra cứu "hợp với cung nào"). */
export function zodiacAspect(sa: ZodiacSign, sb: ZodiacSign) {
  const raw = Math.abs(sa.index - sb.index);
  return ASPECTS[Math.min(raw, 12 - raw)];
}

function zodiacCompat(a: PersonProfile, b: PersonProfile) {
  const sa = a.zodiac.sign;
  const sb = b.zodiac.sign;
  const aspect = zodiacAspect(sa, sb);
  const factor: CompatFactor = {
    system: "cung-hoang-dao",
    relation: aspect.relation,
    detail: `${sa.name} (${sa.element}) & ${sb.name} (${sb.element})`,
    score: aspect.score,
  };
  return { factor, passion: aspect.passion };
}

// ---- Con giáp: lục hợp, tam hợp, xung, hại ----

function conGiapCompat(a: PersonProfile, b: PersonProfile): CompatFactor {
  const i = a.canChi.chiIndex;
  const j = b.canChi.chiIndex;
  const detail = `Tuổi ${a.canChi.chi} (${a.canChi.animal}) & tuổi ${b.canChi.chi} (${b.canChi.animal})`;
  const make = (relation: string, score: number): CompatFactor => ({ system: "con-giap", relation, detail, score });
  if (i === j) return make("Cùng tuổi", 70);
  if ((i + j) % 12 === 1) return make("Lục hợp", 92);
  if (i % 4 === j % 4) return make("Tam hợp", 88);
  if (Math.abs(i - j) === 6) return make("Lục xung", 35);
  if ((i + j) % 12 === 7) return make("Lục hại", 45);
  if (i % 3 === j % 3) return make("Tứ hành xung", 52);
  return make("Bình hoà", 64);
}

// ---- Ngũ hành nạp âm: sinh – khắc ----

function nguHanhCompat(a: PersonProfile, b: PersonProfile): CompatFactor {
  const ea: NguHanh = a.canChi.element;
  const eb: NguHanh = b.canChi.element;
  const x = NGU_HANH.indexOf(ea);
  const y = NGU_HANH.indexOf(eb);
  const detail = `${a.canChi.napAm} (${ea}) & ${b.canChi.napAm} (${eb})`;
  const make = (relation: string, score: number): CompatFactor => ({ system: "ngu-hanh", relation, detail, score });
  if (x === y) return make(`Bình hoà (${ea} và ${eb})`, 74);
  if ((x + 1) % 5 === y) return make(`Tương sinh (${ea} sinh ${eb})`, 88);
  if ((y + 1) % 5 === x) return make(`Tương sinh (${eb} sinh ${ea})`, 88);
  if ((x + 2) % 5 === y) return make(`Tương khắc (${ea} khắc ${eb})`, 42);
  return make(`Tương khắc (${eb} khắc ${ea})`, 42);
}

// ---- Tổng hợp ----

/** Trung bình có trọng số, bỏ qua thành phần không có dữ liệu. */
function weighted(parts: Array<[number | undefined, number]>): number {
  let sum = 0;
  let w = 0;
  for (const [value, weight] of parts) {
    if (value === undefined) continue;
    sum += value * weight;
    w += weight;
  }
  return Math.round(sum / w);
}

export function verdictOf(score: number): string {
  if (score >= 85) return "Trời sinh một cặp";
  if (score >= 75) return "Rất hợp nhau";
  if (score >= 65) return "Khá hợp";
  if (score >= 55) return "Cần vun đắp";
  return "Thử thách lớn";
}

export function compatibility(a: PersonProfile, b: PersonProfile): CompatibilityResult {
  const lifePath = numberCompat(a.numerology.lifePath, b.numerology.lifePath, "so-chu-dao");
  const soulA = a.numerology.name?.soulUrge;
  const soulB = b.numerology.name?.soulUrge;
  const soul = soulA && soulB ? numberCompat(soulA, soulB, "so-linh-hon") : undefined;
  const { factor: zodiac, passion } = zodiacCompat(a, b);
  const conGiap = conGiapCompat(a, b);
  const nguHanh = nguHanhCompat(a, b);

  const dimensions: Record<DimensionKey, number> = {
    tinhCam: weighted([[zodiac.score, 0.5], [soul?.score, 0.3], [nguHanh.score, 0.2]]),
    giaoTiep: weighted([[zodiac.score, 0.5], [lifePath.score, 0.5]]),
    giaTri: weighted([[lifePath.score, 0.6], [conGiap.score, 0.4]]),
    damMe: weighted([[passion, 0.7], [conGiap.score, 0.3]]),
    lauDai: weighted([[conGiap.score, 0.4], [nguHanh.score, 0.35], [lifePath.score, 0.25]]),
  };
  const values = Object.values(dimensions);
  const overall = Math.round(values.reduce((s, v) => s + v, 0) / values.length);

  return {
    overall,
    verdict: verdictOf(overall),
    dimensions,
    factors: [lifePath, ...(soul ? [soul] : []), zodiac, conGiap, nguHanh],
  };
}
