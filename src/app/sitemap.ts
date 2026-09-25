import type { MetadataRoute } from "next";
import { LIFE_PATH_NUMBERS } from "@/lib/engines/numerology";
import { ZODIAC_SIGNS } from "@/lib/engines/zodiac";
import { lifePathContent, lifePathSlug, ZODIAC_PAIRS, zodiacContent, zodiacPairSlug, zodiacPairsContent } from "@/lib/kb";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/crush`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/ban-do`, changeFrequency: "monthly", priority: 0.8 },
  ];
  // Chỉ đưa trang tra cứu vào sitemap khi nội dung đã được duyệt (reviewed: true).
  if (zodiacContent.meta.reviewed) {
    pages.push({ url: `${SITE}/cung-hoang-dao`, priority: 0.8 });
    for (const s of ZODIAC_SIGNS) pages.push({ url: `${SITE}/cung-hoang-dao/${s.slug}`, priority: 0.7 });
    if (zodiacPairsContent.meta.reviewed) {
      pages.push({ url: `${SITE}/cung-hoang-dao/cap-doi`, priority: 0.8 });
      for (const [a, b] of ZODIAC_PAIRS) pages.push({ url: `${SITE}/cung-hoang-dao/cap-doi/${zodiacPairSlug(a, b)}`, priority: 0.6 });
    }
  }
  if (lifePathContent.meta.reviewed) {
    pages.push({ url: `${SITE}/than-so-hoc`, priority: 0.8 });
    for (const n of LIFE_PATH_NUMBERS) pages.push({ url: `${SITE}/than-so-hoc/${lifePathSlug(n)}`, priority: 0.7 });
  }
  return pages;
}
