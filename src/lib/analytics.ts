import { sendGAEvent } from "@next/third-parties/google";

/**
 * Google Analytics 4. Chỉ bật khi có NEXT_PUBLIC_GA_ID (workflow chỉ truyền cho bản production).
 * Consent Mode v2: mặc định từ chối cookie; người dùng đồng ý qua banner (xem consent-banner.tsx).
 *
 * Quy tắc: KHÔNG gửi tên, ngày sinh hay bất kỳ dữ liệu nào đủ để nhận ra một người.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export const CONSENT_KEY = "saohop-consent";
export type ConsentChoice = "granted" | "denied";

type EventParams = Record<string, string | number | boolean>;

/** Sự kiện chuyển đổi. Tên theo snake_case để dễ đánh dấu "key event" trong GA4. */
export type AnalyticsEvent =
  | "crush_check" // gửi form check crush hợp lệ
  | "share_result" // bấm chia sẻ kết quả
  | "download_story" // tải ảnh story
  | "ban_do_view" // xem bản đồ bản thân
  | "zodiac_pair_pick" // chọn cặp cung ở trang cặp đôi
  | "numerology_try"; // thử ngày sinh ở ô thần số học trang chủ

export function track(event: AnalyticsEvent, params: EventParams = {}) {
  if (!GA_ID || typeof window === "undefined") return;
  sendGAEvent("event", event, params);
}

/** Cập nhật Consent Mode theo lựa chọn của người dùng. */
export function applyConsent(choice: ConsentChoice) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  gtag("consent", "update", { analytics_storage: choice });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- chữ ký cho người gọi; thân hàm dùng arguments
function gtag(..._args: unknown[]) {
  // gtag.js chỉ nhận lệnh dạng đối tượng arguments, không nhận mảng thường.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer?.push(arguments);
}

/** Script chạy trước khi trang tương tác: khai báo mặc định từ chối, dùng lại lựa chọn đã lưu nếu có. */
export const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
var saved = null;
try { saved = localStorage.getItem('${CONSENT_KEY}'); } catch (e) {}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: saved === 'granted' ? 'granted' : 'denied',
  wait_for_update: 500
});
`;
