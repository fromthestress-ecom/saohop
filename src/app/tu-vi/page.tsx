import type { Metadata } from "next";
import { TuViClient } from "./tu-vi-client";
import { pageSeo } from "@/lib/site";

export const metadata: Metadata = {
  ...pageSeo("/tu-vi"),
  title: "Lá số tử vi miễn phí: an sao 12 cung theo giờ sinh",
  description:
    "Lập lá số tử vi đẩu số miễn phí: nhập ngày, giờ sinh và giới tính để xem 12 cung, chính tinh, tứ hóa, cục, đại hạn kèm giải nghĩa từng sao bằng tiếng Việt dễ hiểu.",
};

export default function TuViPage() {
  return (
    <div className="space-y-10 pt-8 md:pt-12">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tighter md:text-5xl">Lá số tử vi</h1>
        <p className="mt-3 text-lg text-ink-muted">
          An sao 12 cung theo ngày giờ sinh, kèm giải nghĩa từng sao bằng lời dễ hiểu. Tính ngay trên máy bạn, không lưu thông tin.
        </p>
      </div>
      <TuViClient />
      <p className="max-w-2xl text-sm text-ink-muted">
        Lá số được an theo cách phổ biến ở Việt Nam, dùng âm lịch Việt Nam (múi giờ UTC+7). Các sách và phần mềm tử vi có thể khác nhau ở một
        vài sao phụ và bảng miếu hãm. Nội dung chỉ mang tính tham khảo và giải trí.
      </p>
    </div>
  );
}
