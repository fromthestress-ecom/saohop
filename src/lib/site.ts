export const SITE_NAME = "Sao Hợp";

/** URL gốc của site (dùng cho dữ liệu có cấu trúc và ảnh OG). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://saohop.com";

export type SocialKind = "facebook" | "tiktok" | "instagram" | "linkedin";
export interface SocialLink {
  kind: SocialKind;
  label: string;
  href: string;
}

/** Kênh chính thức của Sao Hợp. */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  { kind: "facebook", label: "Facebook", href: "https://www.facebook.com/saohop.webapp/" },
  { kind: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@saohop" },
];

/** Người sáng lập, phụ trách sản phẩm và duyệt nội dung. */
export const FOUNDER = { name: "Nghĩa Đặng", role: "Người sáng lập" } as const;

/** Kênh liên hệ trực tiếp với người sáng lập. */
export const FOUNDER_LINKS: readonly SocialLink[] = [
  { kind: "facebook", label: "Facebook", href: "https://www.facebook.com/tsmnonames/" },
  { kind: "instagram", label: "Instagram", href: "https://www.instagram.com/big_meanz/" },
  { kind: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/danghoangdainghia/" },
];

/**
 * Email liên hệ công khai (góp ý, báo lỗi, yêu cầu xoá dữ liệu).
 * Đặt qua biến NEXT_PUBLIC_CONTACT_EMAIL (GitHub Variable CONTACT_EMAIL); để trống thì các mục liên hệ tự ẩn.
 */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";

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
