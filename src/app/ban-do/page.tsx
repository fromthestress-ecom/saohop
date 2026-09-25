import type { Metadata } from "next";
import { BanDoClient } from "./ban-do-client";

export const metadata: Metadata = {
  title: "Bản đồ bản thân: thần số học, cung hoàng đạo, con giáp",
  description:
    "Nhập tên và ngày sinh để xem số chủ đạo, biểu đồ ngày sinh, cung hoàng đạo, con giáp, mệnh ngũ hành và luận giải AI dành riêng cho bạn.",
};

export default function BanDoPage() {
  return (
    <div className="space-y-10 pt-8 md:pt-12">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tighter md:text-5xl">Bản đồ bản thân</h1>
        <p className="mt-3 text-lg text-ink-muted">Thần số học, cung hoàng đạo và ngũ hành của bạn, gói gọn trong một trang.</p>
      </div>
      <BanDoClient />
    </div>
  );
}
