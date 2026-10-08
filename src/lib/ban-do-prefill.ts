/**
 * Chuyển ngày sinh từ ô nhập ở trang chủ sang trang /ban-do.
 * Dùng sessionStorage thay vì query string để ngày sinh không nằm trên URL (log máy chủ, Analytics, lịch sử chia sẻ).
 * Chỉ đọc được một lần: đọc xong là xóa.
 */

import type { DateParts } from "@/components/birth-date-select";

const KEY = "saohop-ban-do-prefill";

export function writeBanDoPrefill(value: DateParts): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // Trình duyệt chặn lưu trữ: người dùng chỉ cần nhập lại ở trang sau.
  }
}

export function takeBanDoPrefill(): DateParts | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      const { day, month, year } = parsed as Record<string, unknown>;
      if (typeof day === "string" && typeof month === "string" && typeof year === "string") return { day, month, year };
    }
  } catch {
    // dữ liệu hỏng hoặc bị chặn: bỏ qua
  }
  return null;
}
