/**
 * Tử Vi Đẩu Số — an sao lá số theo cách của Việt Nam (Thiên Lương, "Tử vi dưới mắt khoa học").
 *
 * Hàm thuần, tất định, không phụ thuộc thư viện ngoài. Ngày sinh dương lịch được đổi sang
 * âm lịch Việt Nam (UTC+7) bằng `solarToLunar`, nên đúng ở những năm lịch VN lệch lịch Trung Quốc.
 *
 * Quy ước:
 * - Vị trí cung là chỉ số địa chi 0..11 (Tý = 0 ... Hợi = 11); `palaces[i]` là cung đóng tại chi i.
 * - Giờ sinh 0..11 (Tý..Hợi). Giờ Tý 23h–1h tính cả vào ngày âm lịch của ngày sinh (không có "Tý sớm/muộn").
 * - Tháng nhuận: tính theo tháng đó (không đổi sang tháng sau), như phần lớn lá số Việt Nam.
 * - Chỉ dùng để tra cứu / giải trí: các môn phái an sao có chỗ khác nhau (xem chú thích từng sao).
 */

import { CAN_INFO, DIA_CHI, NAP_AM, THIEN_CAN, canChiOfLunarYear, type NguHanh } from "./can-chi";
import { solarToLunar, type LunarDate } from "./lunar";
import { isValidSolarDate, type SolarDate } from "./types";

export type Gender = "nam" | "nu";

export interface TuViInput {
  birthDate: SolarDate;
  /** Chi của giờ sinh: 0 = Tý (23h–1h), 1 = Sửu (1h–3h) ... 11 = Hợi (21h–23h). */
  hourIndex: number;
  gender: Gender;
}

export type StarGroup = "chinh" | "cat" | "sat" | "phu";
export type Brightness = "Miếu" | "Vượng" | "Đắc" | "Bình" | "Hãm";
export type Hoa = "Lộc" | "Quyền" | "Khoa" | "Kỵ";

export interface TuViStar {
  name: string;
  group: StarGroup;
  /** Chỉ có với các sao có bảng miếu/vượng/đắc/hãm. */
  brightness?: Brightness;
  /** Tứ hóa theo can năm sinh. */
  hoa?: Hoa;
}

export interface TuViPalace {
  /** Chỉ số địa chi của cung (0 = Tý). */
  chiIndex: number;
  chi: string;
  /** Thiên can của cung (Ngũ Hổ Độn). */
  can: string;
  /** Tên cung chức: Mệnh, Phụ Mẫu, ... */
  name: PalaceName;
  isThan: boolean;
  /** Chính tinh trước, rồi cát tinh, sát tinh, phụ tinh. */
  stars: TuViStar[];
  tuan: boolean;
  triet: boolean;
  /** Đại hạn 10 năm của cung: tuổi âm từ `from` đến `to`. */
  daiHan: { from: number; to: number };
  /** Sao thuộc vòng Thái Tuế, Bác Sĩ (Lộc Tồn) và Tràng Sinh đóng ở cung này. */
  thaiTue: string;
  bacSi: string;
  trangSinh: string;
}

export const PALACE_NAMES = [
  "Mệnh",
  "Phụ Mẫu",
  "Phúc Đức",
  "Điền Trạch",
  "Quan Lộc",
  "Nô Bộc",
  "Thiên Di",
  "Tật Ách",
  "Tài Bạch",
  "Tử Tức",
  "Phu Thê",
  "Huynh Đệ",
] as const;
export type PalaceName = (typeof PALACE_NAMES)[number];

export interface TuViChart {
  gender: Gender;
  lunar: LunarDate;
  /** Can chi năm sinh (âm lịch). */
  year: ReturnType<typeof canChiOfLunarYear>;
  hourIndex: number;
  hourLabel: string;
  /** Cục: Thủy Nhị, Mộc Tam, Kim Tứ, Thổ Ngũ, Hỏa Lục. */
  cuc: { name: string; element: NguHanh; number: 2 | 3 | 4 | 5 | 6 };
  /** Dương nam / Âm nữ đi thuận, Âm nam / Dương nữ đi nghịch (chiều đại hạn, vòng Tràng Sinh...). */
  clockwise: boolean;
  /** Âm dương thuận lý: cung Mệnh cùng âm dương với giới tính. */
  thuanLy: boolean;
  menhChu: string;
  thanChu: string;
  menhIndex: number;
  thanIndex: number;
  /** 12 cung theo thứ tự địa chi Tý → Hợi. */
  palaces: TuViPalace[];
}

const mod = (n: number, m = 12) => ((n % m) + m) % m;
const BR = { M: "Miếu", V: "Vượng", Đ: "Đắc", B: "Bình", H: "Hãm" } as const;

const CUC_BY_ELEMENT: Record<NguHanh, { name: string; number: 2 | 3 | 4 | 5 | 6 }> = {
  Thủy: { name: "Thủy Nhị Cục", number: 2 },
  Mộc: { name: "Mộc Tam Cục", number: 3 },
  Kim: { name: "Kim Tứ Cục", number: 4 },
  Thổ: { name: "Thổ Ngũ Cục", number: 5 },
  Hỏa: { name: "Hỏa Lục Cục", number: 6 },
};

/** Cung khởi Tràng Sinh theo hành của cục (Thủy và Thổ cùng ở Thân). */
const TRANG_SINH_START: Record<NguHanh, number> = { Thủy: 8, Thổ: 8, Mộc: 11, Kim: 5, Hỏa: 2 };
const TRANG_SINH_RING = ["Tràng Sinh", "Mộc Dục", "Quan Đới", "Lâm Quan", "Đế Vượng", "Suy", "Bệnh", "Tử", "Mộ", "Tuyệt", "Thai", "Dưỡng"];
const BAC_SI_RING = ["Bác Sĩ", "Lực Sĩ", "Thanh Long", "Tiểu Hao", "Tướng Quân", "Tấu Thư", "Phi Liêm", "Hỷ Thần", "Bệnh Phù", "Đại Hao", "Phục Binh", "Quan Phủ"];
const THAI_TUE_RING = ["Thái Tuế", "Thiếu Dương", "Tang Môn", "Thiếu Âm", "Quan Phù", "Tử Phù", "Tuế Phá", "Long Đức", "Bạch Hổ", "Phúc Đức", "Điếu Khách", "Trực Phù"];

/** Mệnh chủ theo chi của cung Mệnh, Thân chủ theo chi năm sinh. */
const MENH_CHU = ["Tham Lang", "Cự Môn", "Lộc Tồn", "Văn Khúc", "Liêm Trinh", "Vũ Khúc", "Phá Quân", "Vũ Khúc", "Liêm Trinh", "Văn Khúc", "Lộc Tồn", "Cự Môn"];
const THAN_CHU = ["Linh Tinh", "Thiên Tướng", "Thiên Lương", "Thiên Đồng", "Văn Xương", "Thiên Cơ", "Hỏa Tinh", "Thiên Tướng", "Thiên Lương", "Thiên Đồng", "Văn Xương", "Thiên Cơ"];

// ---- Bảng theo can năm sinh (Giáp..Quý). Giá trị là chỉ số địa chi. ----
const LOC_TON = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
// Giáp Mậu Canh: Sửu Mùi · Ất Kỷ: Tý Thân · Bính Đinh: Hợi Dậu · Nhâm Quý: Mão Tỵ · Tân: Ngọ Dần.
const THIEN_KHOI = [1, 0, 11, 11, 1, 0, 1, 6, 3, 3];
const THIEN_VIET = [7, 8, 9, 9, 7, 8, 7, 2, 5, 5];
const THIEN_QUAN = [7, 4, 5, 2, 3, 9, 11, 9, 10, 6];
const THIEN_PHUC = [9, 8, 0, 11, 3, 2, 6, 5, 6, 5];
const LUU_HA = [9, 10, 7, 4, 5, 6, 8, 3, 11, 2];
const THIEN_TRU = [5, 6, 0, 5, 6, 8, 2, 6, 9, 10];
/** Thiên Mã theo chi năm: Dần Ngọ Tuất → Thân; Thân Tý Thìn → Dần; Tỵ Dậu Sửu → Hợi; Hợi Mão Mùi → Tỵ. */
const THIEN_MA = [2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5];
/** Cung khởi Hỏa Tinh và Linh Tinh theo chi năm (rồi đếm theo giờ sinh). */
const HOA_LINH_START: ReadonlyArray<readonly [number, number]> = [
  [2, 10], [3, 10], [1, 3], [9, 10], [2, 10], [3, 10], [1, 3], [9, 10], [2, 10], [3, 10], [1, 3], [9, 10],
];
/** Triệt đóng ở hai cung liền nhau, bắt đầu từ chi này (Giáp Kỷ: Thân Dậu ... Mậu Quý: Tý Sửu). */
const TRIET_START = [8, 6, 4, 2, 0];

/** Tứ hóa theo can năm sinh: [Lộc, Quyền, Khoa, Kỵ] (bảng phổ biến: Canh "Nhật Vũ Âm Đồng", Nhâm "Lương Tử Phụ Vũ"). */
const TU_HOA: ReadonlyArray<readonly [string, string, string, string]> = [
  ["Liêm Trinh", "Phá Quân", "Vũ Khúc", "Thái Dương"],
  ["Thiên Cơ", "Thiên Lương", "Tử Vi", "Thái Âm"],
  ["Thiên Đồng", "Thiên Cơ", "Văn Xương", "Liêm Trinh"],
  ["Thái Âm", "Thiên Đồng", "Thiên Cơ", "Cự Môn"],
  ["Tham Lang", "Thái Âm", "Hữu Bật", "Thiên Cơ"],
  ["Vũ Khúc", "Tham Lang", "Thiên Lương", "Văn Khúc"],
  ["Thái Dương", "Vũ Khúc", "Thái Âm", "Thiên Đồng"],
  ["Cự Môn", "Thái Dương", "Văn Khúc", "Văn Xương"],
  ["Thiên Lương", "Tử Vi", "Tả Phù", "Vũ Khúc"],
  ["Phá Quân", "Cự Môn", "Thái Âm", "Tham Lang"],
];
const HOA_NAMES: readonly Hoa[] = ["Lộc", "Quyền", "Khoa", "Kỵ"];

/**
 * Miếu (M) / Vượng (V) / Đắc (Đ) / Bình (B) / Hãm (H) của 14 chính tinh theo cung Tý → Hợi.
 * Bảng theo lasotuvi (MIT, doanguyen) vốn chép từ Thiên Lương; các sách còn khác nhau ở vài ô,
 * nên chỉ dùng làm gợi ý cho luận giải, không phải kết luận.
 */
const BRIGHTNESS: Record<string, string> = {
  "Tử Vi": "BĐMBVMMĐMBVB",
  "Liêm Trinh": "VĐVHMHVĐVHMH",
  "Thiên Đồng": "VHMĐHĐHHMHHĐ",
  "Vũ Khúc": "VMVĐMHVMVĐMH",
  "Thái Dương": "HĐVVVMMĐHHHH",
  "Thiên Cơ": "ĐĐHMMVĐĐVMMH",
  "Thiên Phủ": "MĐMBMĐMĐMBMĐ",
  "Thái Âm": "VĐHHHHHĐVMMM",
  "Tham Lang": "HMĐHVHHMĐHVH",
  "Cự Môn": "VHVMHHVHĐMHĐ",
  "Thiên Tướng": "VĐMHVĐVĐMHVĐ",
  "Thiên Lương": "VĐVVMHMĐVHMH",
  "Thất Sát": "MĐMHHVMĐMHHV",
  "Phá Quân": "MVHHĐHMVHHĐH",
};

function brightnessOf(star: string, chi: number): Brightness | undefined {
  const row = BRIGHTNESS[star];
  const code = row?.[chi];
  return code ? BR[code as keyof typeof BR] : undefined;
}

/** Nạp âm (hành) của một cặp can chi: tìm số thứ tự 0..59 trong vòng Lục thập hoa giáp. */
function napAmElementOfCanChi(canIndex: number, chiIndex: number): NguHanh {
  for (let n = canIndex; n < 60; n += 10) {
    if (n % 12 === chiIndex) return NAP_AM[Math.floor(n / 2)][1];
  }
  throw new Error(`Can chi không hợp lệ: ${canIndex}/${chiIndex}`);
}

/** Vị trí sao Tử Vi theo cục và ngày âm lịch. */
function tuViPosition(cuc: number, lunarDay: number): number {
  let reach = cuc;
  let step = 0;
  while (reach < lunarDay) {
    reach += cuc;
    step++;
  }
  const diff = reach - lunarDay;
  return mod(2 + step + (diff % 2 === 1 ? -diff : diff));
}

/** Giờ đồng hồ (0–23) → chi giờ 0..11. 23h–1h là giờ Tý. */
export function hourIndexFromClock(hour: number): number {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) throw new RangeError(`Giờ không hợp lệ: ${hour}`);
  return Math.floor(((hour + 1) % 24) / 2);
}

export function buildTuViChart(input: TuViInput): TuViChart {
  if (!isValidSolarDate(input.birthDate)) throw new RangeError("Ngày sinh không hợp lệ");
  return buildTuViChartFromLunar(solarToLunar(input.birthDate), input.hourIndex, input.gender);
}

/** An sao từ ngày âm lịch đã biết (dùng cho test và khi người dùng nhập âm lịch). */
export function buildTuViChartFromLunar(lunar: LunarDate, hourIndex: number, gender: Gender): TuViChart {
  if (!Number.isInteger(hourIndex) || hourIndex < 0 || hourIndex > 11) throw new RangeError(`Giờ sinh không hợp lệ: ${hourIndex}`);
  const year = canChiOfLunarYear(lunar.year);
  const canIdx = THIEN_CAN.indexOf(year.can as (typeof THIEN_CAN)[number]);
  const yearChi = year.chiIndex;
  const month = lunar.month;
  const day = lunar.day;
  const h = hourIndex;

  // ---- Cung Mệnh, Thân và 12 cung chức ----
  const menh = mod(2 + (month - 1) - h);
  const than = mod(2 + (month - 1) + h);
  const palaceNameAt = (chi: number): PalaceName => PALACE_NAMES[mod(chi - menh)];
  const chiOfPalace = (name: PalaceName) => mod(menh + PALACE_NAMES.indexOf(name));

  // ---- Thiên can các cung (Ngũ Hổ Độn) và Cục ----
  const canOfDan = mod(canIdx * 2 + 2, 10);
  const canAt = (chi: number) => mod(canOfDan + mod(chi - 2), 10);
  const cucElement = napAmElementOfCanChi(canAt(menh), menh);
  const cuc = CUC_BY_ELEMENT[cucElement];

  // ---- Chiều thuận/nghịch ----
  const yangYear = CAN_INFO[canIdx].yang;
  const clockwise = (gender === "nam") === yangYear;
  const dir = clockwise ? 1 : -1;
  const menhYang = menh % 2 === 0;
  const thuanLy = (gender === "nam") === menhYang;

  // ---- Khởi tạo cung ----
  const placed: TuViStar[][] = Array.from({ length: 12 }, () => []);
  const add = (chi: number, name: string, group: StarGroup, extra?: Partial<TuViStar>) => {
    const star: TuViStar = { name, group, ...extra };
    const br = brightnessOf(name, mod(chi));
    if (br) star.brightness = br;
    placed[mod(chi)].push(star);
  };

  // ---- Chính tinh ----
  const tuVi = tuViPosition(cuc.number, day);
  add(tuVi, "Tử Vi", "chinh");
  add(tuVi + 4, "Liêm Trinh", "chinh");
  add(tuVi + 7, "Thiên Đồng", "chinh");
  add(tuVi + 8, "Vũ Khúc", "chinh");
  add(tuVi + 9, "Thái Dương", "chinh");
  add(tuVi + 11, "Thiên Cơ", "chinh");
  const thienPhu = mod(4 - tuVi);
  add(thienPhu, "Thiên Phủ", "chinh");
  add(thienPhu + 1, "Thái Âm", "chinh");
  add(thienPhu + 2, "Tham Lang", "chinh");
  add(thienPhu + 3, "Cự Môn", "chinh");
  add(thienPhu + 4, "Thiên Tướng", "chinh");
  add(thienPhu + 5, "Thiên Lương", "chinh");
  add(thienPhu + 6, "Thất Sát", "chinh");
  add(thienPhu + 10, "Phá Quân", "chinh");

  // ---- Lục cát ----
  const taPhu = mod(4 + (month - 1));
  const huuBat = mod(10 - (month - 1));
  const vanKhuc = mod(4 + h);
  const vanXuong = mod(10 - h);
  add(taPhu, "Tả Phù", "cat");
  add(huuBat, "Hữu Bật", "cat");
  add(vanXuong, "Văn Xương", "cat");
  add(vanKhuc, "Văn Khúc", "cat");
  add(THIEN_KHOI[canIdx], "Thiên Khôi", "cat");
  add(THIEN_VIET[canIdx], "Thiên Việt", "cat");

  // ---- Lộc Tồn, Kình Dương, Đà La, Thiên Mã ----
  const locTon = LOC_TON[canIdx];
  add(locTon, "Lộc Tồn", "cat");
  add(locTon + 1, "Kình Dương", "sat");
  add(locTon - 1, "Đà La", "sat");
  const thienMa = THIEN_MA[yearChi];
  add(thienMa, "Thiên Mã", "cat");

  // ---- Địa Không, Địa Kiếp, Hỏa Tinh, Linh Tinh ----
  const diaKiep = mod(11 + h);
  add(diaKiep, "Địa Kiếp", "sat");
  add(10 - diaKiep, "Địa Không", "sat");
  const fireStart = HOA_LINH_START[yearChi];
  add(fireStart[0] + dir * h, "Hỏa Tinh", "sat");
  add(fireStart[1] - dir * h, "Linh Tinh", "sat");

  // ---- Phụ tinh khác ----
  const longTri = mod(4 + yearChi);
  const phuongCac = mod(10 - yearChi);
  add(longTri, "Long Trì", "phu");
  add(phuongCac, "Phượng Các", "phu");
  add(6 - yearChi, "Thiên Khốc", "phu");
  add(6 + yearChi, "Thiên Hư", "phu");
  const hongLoan = mod(3 - yearChi);
  add(hongLoan, "Hồng Loan", "phu");
  add(hongLoan + 6, "Thiên Hỷ", "phu");
  add(THIEN_QUAN[canIdx], "Thiên Quan", "phu");
  add(THIEN_PHUC[canIdx], "Thiên Phúc", "phu");
  const thienHinh = mod(9 + (month - 1));
  add(thienHinh, "Thiên Hình", "phu");
  add(thienHinh + 4, "Thiên Riêu", "phu");
  add(thienHinh + 4, "Thiên Y", "phu");
  const coThan = [2, 5, 8, 11][Math.floor(mod(yearChi + 1, 12) / 3)];
  add(coThan, "Cô Thần", "phu");
  add(coThan - 4, "Quả Tú", "phu");
  add(thienMa + 2, "Hoa Cái", "phu");
  add(thienMa + 3, "Kiếp Sát", "phu");
  add(thienMa + 7, "Đào Hoa", "phu");
  add(taPhu + (day - 1), "Tam Thai", "phu");
  add(huuBat - (day - 1), "Bát Tọa", "phu");
  const anQuang = mod(vanXuong + day - 2);
  add(anQuang, "Ân Quang", "phu");
  add(2 - anQuang, "Thiên Quý", "phu");
  add(vanKhuc + 2, "Thai Phụ", "phu");
  add(vanKhuc - 2, "Phong Cáo", "phu");
  add(locTon + 3, "Văn Tinh", "phu");
  add(locTon + 5, "Đường Phù", "phu");
  add(locTon + 8, "Quốc Ấn", "phu");
  add(LUU_HA[canIdx], "Lưu Hà", "phu");
  add(THIEN_TRU[canIdx], "Thiên Trù", "phu");
  add(chiOfPalace("Nô Bộc"), "Thiên Thương", "phu");
  add(chiOfPalace("Tật Ách"), "Thiên Sứ", "phu");
  add(menh + yearChi, "Thiên Tài", "phu");
  add(than + yearChi, "Thiên Thọ", "phu");
  add(yearChi + 1, "Thiên Không", "phu");
  add(4, "Thiên La", "phu");
  add(10, "Địa Võng", "phu");
  add(yearChi - month + 1 + h, "Đẩu Quân", "phu");

  // ---- Tứ hóa ----
  const hoaRow = TU_HOA[canIdx];
  const hoaOf = new Map<string, Hoa>();
  hoaRow.forEach((star, i) => hoaOf.set(star, HOA_NAMES[i]));
  for (const stars of placed) {
    for (const s of stars) {
      const hoa = hoaOf.get(s.name);
      if (hoa) s.hoa = hoa;
    }
  }

  // ---- Vòng Tràng Sinh, Bác Sĩ, Thái Tuế ----
  const trangSinhStart = TRANG_SINH_START[cucElement];
  const ringAt = (ring: string[], start: number, chi: number, d: number) => ring[mod((chi - start) * d)];

  // ---- Tuần, Triệt ----
  const tuanStart = mod(yearChi - canIdx + 10);
  const trietStart = TRIET_START[canIdx % 5];

  const palaces: TuViPalace[] = Array.from({ length: 12 }, (_, chi) => {
    const order = mod(dir * (chi - menh));
    const from = cuc.number + 10 * order;
    const groupRank: Record<StarGroup, number> = { chinh: 0, cat: 1, sat: 2, phu: 3 };
    return {
      chiIndex: chi,
      chi: DIA_CHI[chi].name,
      can: THIEN_CAN[canAt(chi)],
      name: palaceNameAt(chi),
      isThan: chi === than,
      stars: [...placed[chi]].sort((a, b) => groupRank[a.group] - groupRank[b.group]),
      tuan: chi === tuanStart || chi === mod(tuanStart + 1),
      triet: chi === trietStart || chi === trietStart + 1,
      daiHan: { from, to: from + 9 },
      thaiTue: THAI_TUE_RING[mod(chi - yearChi)],
      bacSi: ringAt(BAC_SI_RING, locTon, chi, dir),
      trangSinh: ringAt(TRANG_SINH_RING, trangSinhStart, chi, dir),
    };
  });

  return {
    gender,
    lunar,
    year,
    hourIndex: h,
    hourLabel: `Giờ ${DIA_CHI[h].name}`,
    cuc: { ...cuc, element: cucElement },
    clockwise,
    thuanLy,
    menhChu: MENH_CHU[menh],
    thanChu: THAN_CHU[yearChi],
    menhIndex: menh,
    thanIndex: than,
    palaces,
  };
}
