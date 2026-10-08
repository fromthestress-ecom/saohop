/**
 * Dữ liệu có cấu trúc (schema.org JSON-LD) cho tổ chức, người sáng lập và website.
 * Giúp công cụ tìm kiếm hiểu Sao Hợp là ai và liên kết các hồ sơ mạng xã hội đúng chủ.
 */

import { CONTACT_EMAIL, FOUNDER, FOUNDER_LINKS, SITE_NAME, SITE_URL, SOCIAL_LINKS } from "./site";

const ORG_ID = `${SITE_URL}/#organization`;
const FOUNDER_ID = `${SITE_URL}/#founder`;

export function organizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-mark.svg`,
    sameAs: SOCIAL_LINKS.map((l) => l.href),
    founder: { "@id": FOUNDER_ID },
    ...(CONTACT_EMAIL ? { email: CONTACT_EMAIL } : {}),
  };
}

export function founderJsonLd() {
  return {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: FOUNDER.name,
    jobTitle: FOUNDER.role,
    worksFor: { "@id": ORG_ID },
    sameAs: FOUNDER_LINKS.map((l) => l.href),
  };
}

/** Đồ thị cho trang chủ: tổ chức, người sáng lập và website. */
export function siteGraphJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(),
      founderJsonLd(),
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "vi",
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

/** Chuỗi JSON an toàn để nhúng vào thẻ <script type="application/ld+json">. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
