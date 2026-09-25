"use client";

import { IconCookie } from "@tabler/icons-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { applyConsent, CONSENT_KEY, type ConsentChoice } from "@/lib/analytics";

/*
 * Banner xin đồng ý cookie cho Google Analytics (Consent Mode v2).
 * Trạng thái lưu ở localStorage; đọc qua useSyncExternalStore để server luôn render "ẩn"
 * và không lệch hydration.
 */

const OPEN_EVENT = "saohop:open-consent";
let forcedOpen = false;

function readChoice(): string | null {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(OPEN_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(OPEN_EVENT, onChange);
  };
}

const getSnapshot = () => forcedOpen || readChoice() === null;
const getServerSnapshot = () => false;

/** Mở lại banner (liên kết "Cài đặt cookie" ở chân trang). */
export function openConsentBanner() {
  forcedOpen = true;
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function ConsentBanner() {
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const choose = (choice: ConsentChoice) => {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // Trình duyệt chặn lưu trữ: vẫn áp dụng cho phiên hiện tại.
    }
    applyConsent(choice);
    forcedOpen = false;
    window.dispatchEvent(new Event(OPEN_EVENT));
  };

  if (!visible) return null;

  return (
    // z-40: nằm trên nội dung trang, dưới các lớp hệ thống của trình duyệt.
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Đồng ý sử dụng cookie"
      className="fixed inset-x-4 bottom-4 z-40 sm:inset-x-auto sm:left-4 sm:max-w-sm"
    >
      <div className="panel p-5 shadow-2xl shadow-black/30" style={{ background: "var(--surface)" }}>
        <div className="flex items-start gap-3">
          <IconCookie size={22} stroke={1.5} className="mt-0.5 shrink-0 text-accent" aria-hidden />
          <p className="text-sm text-ink-muted">
            Sao Hợp dùng cookie của Google Analytics để hiểu cách mọi người dùng trang và cải thiện trải nghiệm. Không có tên hay
            ngày sinh nào được gửi đi.{" "}
            <Link href="/chinh-sach-bao-mat" className="font-medium text-accent hover:underline">
              Chính sách bảo mật
            </Link>
          </p>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => choose("granted")} className="btn-primary flex-1 px-4! py-2! text-sm">
            Đồng ý
          </button>
          <button type="button" onClick={() => choose("denied")} className="btn-secondary flex-1 px-4! py-2! text-sm">
            Từ chối
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConsentSettingsLink() {
  return (
    <button type="button" onClick={openConsentBanner} className="hover:text-accent">
      Cài đặt cookie
    </button>
  );
}
