/**
 * Tài nguyên dùng chung cho mọi ảnh chia sẻ (OG) vẽ bằng Satori: font, logo, bảng màu, nền sao.
 * Chỉ dùng phía server (đọc file bằng fs), các file được khai báo trong outputFileTracingIncludes.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Các file cần dùng đã khai báo trong outputFileTracingIncludes (next.config.ts), nên bỏ qua dò tìm tự động
// để Turbopack không kéo cả dự án vào bản standalone.
const asset = (path: string) => readFile(join(/*turbopackIgnore: true*/ process.cwd(), path));

export const OG_SIZE = { width: 1200, height: 630 };

// Cùng token với chế độ tối của site.
export const OG_COLORS = {
  bg: "#08070f",
  line: "#2c2a3b",
  ink: "#f3f1f8",
  muted: "#a7a4ba",
  accent: "#f06a94",
  accent2: "#9d8cff",
  accent3: "#f7b267",
};

export const OG_GRADIENT_TEXT = `linear-gradient(100deg, ${OG_COLORS.accent}, ${OG_COLORS.accent2} 60%, ${OG_COLORS.accent3})`;

export const OG_BACKGROUND = [
  "radial-gradient(circle at 90% 5%, rgba(157,140,255,0.45) 0%, rgba(8,7,15,0) 45%)",
  "radial-gradient(circle at 5% 60%, rgba(240,106,148,0.35) 0%, rgba(8,7,15,0) 45%)",
  "radial-gradient(circle at 70% 100%, rgba(247,178,103,0.18) 0%, rgba(8,7,15,0) 40%)",
].join(", ");

// Sao cố định (toạ độ %, bán kính px) để ảnh luôn giống nhau với cùng tham số.
export const OG_STARS: Array<[number, number, number]> = [
  [4, 16, 1.5], [50, 4, 1], [58, 10, 2.5], [71, 15, 1.5], [88, 7, 2], [93, 28, 1],
  [90, 46, 1.5], [96, 58, 1], [3, 67, 2], [82, 64, 1], [90, 72, 2.5], [96, 90, 1.5], [74, 95, 1],
];

/*
 * Font được tách thành subset latin và vietnamese. Satori chỉ chọn MỘT file cho mỗi tên font (theo độ đậm),
 * ký tự thiếu thì lấy file đầu tiên có ký tự đó trong danh sách, bất kể độ đậm. Nếu hai subset chung một tên,
 * chữ có dấu ("ư", "ờ", "Đ") sẽ bị vẽ bằng subset của độ đậm khác. Vì vậy mỗi subset mang một tên riêng,
 * và fontFamily liệt kê cả hai để mỗi subset đều được chọn đúng độ đậm.
 */
export const OG_FONT = '"SH Sans Latin", "SH Sans Viet"';
export const OG_BRAND_FONT = '"SH Brand Latin", "SH Brand Viet"';

const SUBSETS = [
  ["latin", "Latin"],
  ["vietnamese", "Viet"],
] as const;

// Be Vietnam Pro (OFL), độ đậm 400 và 800.
const fontsPromise = Promise.all(
  SUBSETS.flatMap(([subset, suffix]) =>
    ([400, 800] as const).map(async (weight) => ({
      name: `SH Sans ${suffix}`,
      data: await asset(`assets/fonts/be-vietnam-pro-${subset}-${weight}-normal.woff`),
      weight,
      style: "normal" as const,
    })),
  ),
);

// Josefin Sans 600 cho chữ thương hiệu "SAO HỢP".
const brandFontsPromise = Promise.all(
  SUBSETS.map(async ([subset, suffix]) => ({
    name: `SH Brand ${suffix}`,
    data: await asset(`assets/fonts/josefin-sans-${subset}-600-normal.woff`),
    weight: 600 as const,
    style: "normal" as const,
  })),
);

export async function ogFonts() {
  return [...(await fontsPromise), ...(await brandFontsPromise)];
}

// Logo dạng data URL (Satori vẽ được SVG không có filter, nên dùng bản gọn logo-mark).
export const ogLogo = asset("public/brand/logo-mark.svg").then((buf) => `data:image/svg+xml;base64,${buf.toString("base64")}`);

/** Biểu tượng cung (Tabler Icons, MIT) dạng data URL, tô màu và nét theo yêu cầu. */
export async function zodiacIconDataUrl(slug: string, color = "#ffffff", strokeWidth = 1.5) {
  const svg = (await asset(`assets/zodiac/${slug}.svg`))
    .toString("utf8")
    .replace(/currentColor/g, color)
    .replace(/stroke-width="[^"]*"/, `stroke-width="${strokeWidth}"`);
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
