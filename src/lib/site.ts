export const SITE_NAME = "Sao Hợp";

/** Ảnh chia sẻ mặc định (src/app/opengraph-image.jpg) cho các trang không có opengraph-image riêng. */
const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "Sao Hợp: bạn và crush hợp nhau bao nhiêu phần trăm? Thần số học, cung hoàng đạo và con giáp",
};

/**
 * Canonical và og:url của một trang. Khai báo openGraph ở trang sẽ thay cả khối openGraph của layout
 * (kể cả ảnh mặc định), nên nhắc lại type, siteName, locale và ảnh mặc định.
 * Route có file opengraph-image riêng phải truyền `ownImage: true`: nếu khai báo images ở đây,
 * ảnh này sẽ đè lên ảnh riêng của route.
 */
export function pageSeo(path: string, { ownImage = false }: { ownImage?: boolean } = {}) {
  return {
    alternates: { canonical: path },
    openGraph: {
      type: "website" as const,
      siteName: SITE_NAME,
      locale: "vi_VN",
      url: path,
      ...(ownImage ? {} : { images: [DEFAULT_OG_IMAGE] }),
    },
  };
}
