import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    // Không chặn /chia-se/ và /api/og: bot xem trước link (Facebook, Zalo, X) cần đọc được thẻ và ảnh OG.
    // Trang chia sẻ đã tự đặt noindex.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/reading", "/api/compat"] },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
