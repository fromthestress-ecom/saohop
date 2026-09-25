/**
 * Can chi, con giáp và ngũ hành nạp âm theo năm âm lịch.
 * Con giáp phải tính theo năm âm lịch (ranh giới là Tết), không phải 1/1 dương lịch.
 */

import { solarToLunar } from "./lunar";
import type { SolarDate } from "./types";

export const THIEN_CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"] as const;

export const DIA_CHI = [
  { name: "Tý", animal: "Chuột", slug: "ty" },
  { name: "Sửu", animal: "Trâu", slug: "suu" },
  { name: "Dần", animal: "Hổ", slug: "dan" },
  { name: "Mão", animal: "Mèo", slug: "mao" },
  { name: "Thìn", animal: "Rồng", slug: "thin" },
  { name: "Tỵ", animal: "Rắn", slug: "ty-ran" },
  { name: "Ngọ", animal: "Ngựa", slug: "ngo" },
  { name: "Mùi", animal: "Dê", slug: "mui" },
  { name: "Thân", animal: "Khỉ", slug: "than" },
  { name: "Dậu", animal: "Gà", slug: "dau" },
  { name: "Tuất", animal: "Chó", slug: "tuat" },
  { name: "Hợi", animal: "Lợn", slug: "hoi" },
] as const;

/** Thứ tự tương sinh: Kim → Thủy → Mộc → Hỏa → Thổ → Kim. */
export const NGU_HANH = ["Kim", "Thủy", "Mộc", "Hỏa", "Thổ"] as const;
export type NguHanh = (typeof NGU_HANH)[number];

/** 30 nạp âm, mỗi cái ứng với một cặp năm trong vòng Lục thập hoa giáp (bắt đầu Giáp Tý). */
const NAP_AM: ReadonlyArray<readonly [string, NguHanh]> = [
  ["Hải Trung Kim", "Kim"],
  ["Lư Trung Hỏa", "Hỏa"],
  ["Đại Lâm Mộc", "Mộc"],
  ["Lộ Bàng Thổ", "Thổ"],
  ["Kiếm Phong Kim", "Kim"],
  ["Sơn Đầu Hỏa", "Hỏa"],
  ["Giản Hạ Thủy", "Thủy"],
  ["Thành Đầu Thổ", "Thổ"],
  ["Bạch Lạp Kim", "Kim"],
  ["Dương Liễu Mộc", "Mộc"],
  ["Tuyền Trung Thủy", "Thủy"],
  ["Ốc Thượng Thổ", "Thổ"],
  ["Tích Lịch Hỏa", "Hỏa"],
  ["Tùng Bách Mộc", "Mộc"],
  ["Trường Lưu Thủy", "Thủy"],
  ["Sa Trung Kim", "Kim"],
  ["Sơn Hạ Hỏa", "Hỏa"],
  ["Bình Địa Mộc", "Mộc"],
  ["Bích Thượng Thổ", "Thổ"],
  ["Kim Bạch Kim", "Kim"],
  ["Phú Đăng Hỏa", "Hỏa"],
  ["Thiên Hà Thủy", "Thủy"],
  ["Đại Trạch Thổ", "Thổ"],
  ["Thoa Xuyến Kim", "Kim"],
  ["Tang Đố Mộc", "Mộc"],
  ["Đại Khê Thủy", "Thủy"],
  ["Sa Trung Thổ", "Thổ"],
  ["Thiên Thượng Hỏa", "Hỏa"],
  ["Thạch Lựu Mộc", "Mộc"],
  ["Đại Hải Thủy", "Thủy"],
];

const mod = (n: number, m: number) => ((n % m) + m) % m;

export interface YearCanChi {
  lunarYear: number;
  can: string;
  chiIndex: number;
  chi: string;
  animal: string;
  animalSlug: string;
  /** Vd. "Bính Ngọ" */
  label: string;
  napAm: string;
  element: NguHanh;
}

export function canChiOfLunarYear(lunarYear: number): YearCanChi {
  const chiIndex = mod(lunarYear + 8, 12);
  const can = THIEN_CAN[mod(lunarYear + 6, 10)];
  const chi = DIA_CHI[chiIndex];
  const [napAm, element] = NAP_AM[Math.floor(mod(lunarYear - 4, 60) / 2)];
  return {
    lunarYear,
    can,
    chiIndex,
    chi: chi.name,
    animal: chi.animal,
    animalSlug: chi.slug,
    label: `${can} ${chi.name}`,
    napAm,
    element,
  };
}

export function canChiOfBirthDate(date: SolarDate): YearCanChi {
  return canChiOfLunarYear(solarToLunar(date).year);
}
