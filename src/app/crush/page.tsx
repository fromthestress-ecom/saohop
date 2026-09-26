import type { Metadata } from "next";
import { CrushClient } from "./crush-client";
import { pageSeo } from "@/lib/site";

export const metadata: Metadata = {
  ...pageSeo("/crush"),
  title: "Check crush: bạn và crush hợp nhau bao nhiêu phần trăm?",
  description:
    "So độ hợp giữa bạn và crush qua thần số học, cung hoàng đạo, con giáp và ngũ hành. Có điểm theo 5 chiều và luận giải AI.",
};

export default function CrushPage() {
  return (
    <div className="space-y-10 pt-8 md:pt-12">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tighter md:text-5xl">Check crush</h1>
        <p className="mt-3 text-lg text-ink-muted">Chỉ cần ngày sinh của hai người. Thêm họ tên để kết quả chi tiết hơn.</p>
      </div>
      <CrushClient />
    </div>
  );
}
