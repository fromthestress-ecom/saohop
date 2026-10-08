import type { MetadataRoute } from "next";
import { LIFE_PATH_NUMBERS } from "@/lib/engines/numerology";
import { ZODIAC_SIGNS } from "@/lib/engines/zodiac";
import {
  lifePathContent,
  lifePathSlug,
  ZODIAC_PAIRS,
  zodiacContent,
  zodiacPairSlug,
  zodiacPairsContent,
  zodiacVariantLinks,
  zodiacVariantsContent,
} from "@/lib/kb";
import {
  birthYearsWithContent,
  conGiapContent,
  conGiapPairSlugsWithContent,
  conGiapSlugsWithContent,
  elementSlugsWithContent,
  nguHanhContent,
} from "@/lib/kb/con-giap";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Trang dùng chung dữ liệu của nhiều hệ thì lấy ngày mới nhất. */
const latest = (...days: string[]) => days.reduce((a, b) => (a > b ? a : b));

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/crush`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/ban-do`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/tu-vi`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/gioi-thieu`, changeFrequency: "monthly", priority: 0.5 },
  ];
  // Chỉ đưa trang tra cứu vào sitemap khi nội dung đã được duyệt (reviewed: true).
  // lastModified lấy từ meta.updated của file nội dung tương ứng.
  if (zodiacContent.meta.reviewed) {
    const lastModified = zodiacContent.meta.updated;
    pages.push({ url: `${SITE}/cung-hoang-dao`, lastModified, priority: 0.8 });
    for (const s of ZODIAC_SIGNS) pages.push({ url: `${SITE}/cung-hoang-dao/${s.slug}`, lastModified, priority: 0.7 });
    if (zodiacVariantsContent.meta.reviewed) {
      const lastModified = latest(zodiacContent.meta.updated, zodiacVariantsContent.meta.updated);
      for (const s of ZODIAC_SIGNS) for (const v of zodiacVariantLinks(s)) pages.push({ url: `${SITE}${v.href}`, lastModified, priority: 0.6 });
    }
    if (zodiacPairsContent.meta.reviewed) {
      const lastModified = zodiacPairsContent.meta.updated;
      pages.push({ url: `${SITE}/cung-hoang-dao/cap-doi`, lastModified, priority: 0.8 });
      for (const [a, b] of ZODIAC_PAIRS) pages.push({ url: `${SITE}/cung-hoang-dao/cap-doi/${zodiacPairSlug(a, b)}`, lastModified, priority: 0.6 });
    }
  }
  if (lifePathContent.meta.reviewed) {
    const lastModified = lifePathContent.meta.updated;
    pages.push({ url: `${SITE}/than-so-hoc`, lastModified, priority: 0.8 });
    for (const n of LIFE_PATH_NUMBERS) pages.push({ url: `${SITE}/than-so-hoc/${lifePathSlug(n)}`, lastModified, priority: 0.7 });
  }
  if (conGiapContent.meta.reviewed) {
    const lastModified = conGiapContent.meta.updated;
    pages.push({ url: `${SITE}/con-giap`, lastModified, priority: 0.8 });
    for (const s of conGiapSlugsWithContent()) pages.push({ url: `${SITE}/con-giap/${s}`, lastModified, priority: 0.7 });
    pages.push({ url: `${SITE}/con-giap/cap-doi`, lastModified, priority: 0.8 });
    for (const s of conGiapPairSlugsWithContent()) pages.push({ url: `${SITE}/con-giap/cap-doi/${s}`, lastModified, priority: 0.6 });
  }
  if (nguHanhContent.meta.reviewed) {
    const lastModified = nguHanhContent.meta.updated;
    pages.push({ url: `${SITE}/ngu-hanh`, lastModified, priority: 0.8 });
    for (const s of elementSlugsWithContent()) pages.push({ url: `${SITE}/ngu-hanh/${s}`, lastModified, priority: 0.7 });
    // Trang năm sinh dùng cả nội dung con giáp lẫn ngũ hành.
    const yearModified = latest(conGiapContent.meta.updated, nguHanhContent.meta.updated);
    pages.push({ url: `${SITE}/nam-sinh`, lastModified: yearModified, priority: 0.8 });
    for (const y of birthYearsWithContent()) pages.push({ url: `${SITE}/nam-sinh/${y}`, lastModified: yearModified, priority: 0.6 });
  }
  return pages;
}
