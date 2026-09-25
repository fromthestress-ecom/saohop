import type { Metadata } from "next";
import { Breadcrumb } from "@/components/kb-blocks";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description: `Cách ${SITE_NAME} xử lý ngày sinh, tên và dữ liệu truy cập của bạn.`,
  alternates: { canonical: "/chinh-sach-bao-mat" },
};

// Cập nhật ngày này mỗi khi sửa nội dung. Cần người phụ trách pháp lý rà soát trước khi mở tài khoản trả phí.
const UPDATED = "25/09/2026";

const SECTIONS: Array<{ title: string; items: string[] }> = [
  {
    title: "Dữ liệu bạn nhập",
    items: [
      "Ngày sinh (và họ tên nếu bạn nhập) của bạn và của crush, dùng để tính thần số học, cung hoàng đạo, con giáp và độ hợp.",
      "Ở chế độ xem nhanh hiện tại, chúng tôi không lưu các thông tin này vào cơ sở dữ liệu. Các con số được tính ngay khi bạn bấm xem.",
    ],
  },
  {
    title: "Phần luận giải bằng AI",
    items: [
      "Khi bạn xem luận giải, máy chủ gửi cho nhà cung cấp AI (Anthropic) các con số đã tính sẵn và tên gọi (chữ cuối trong họ tên, nếu có).",
      "Chúng tôi không gửi họ tên đầy đủ hay ngày sinh của bạn cho nhà cung cấp AI.",
    ],
  },
  {
    title: "Thẻ chia sẻ",
    items: ["Ảnh và đường dẫn chia sẻ kết quả chỉ chứa điểm số, cung hoàng đạo và con giáp, không chứa tên hay ngày sinh của ai."],
  },
  {
    title: "Cookie và phân tích truy cập",
    items: [
      "Chúng tôi dùng Google Analytics 4 để hiểu cách mọi người dùng trang (trang được xem, nút được bấm) và cải thiện trải nghiệm.",
      "Google Analytics chỉ đặt cookie sau khi bạn bấm Đồng ý. Nếu bạn từ chối, chỉ có tín hiệu ẩn danh không dùng cookie được gửi đi.",
      "Bạn có thể đổi lựa chọn bất cứ lúc nào qua mục Cài đặt cookie ở chân trang.",
      "Chúng tôi không dùng cookie quảng cáo và không bán dữ liệu cho bên thứ ba.",
    ],
  },
  {
    title: "Nhật ký kỹ thuật",
    items: [
      "Máy chủ ghi nhật ký truy cập (địa chỉ IP, thời điểm, trang được mở) trong thời gian ngắn để chống lạm dụng và xử lý sự cố.",
    ],
  },
  {
    title: "Quyền của bạn",
    items: [
      "Theo Nghị định 13/2023/NĐ-CP, bạn có quyền được biết, đồng ý, rút lại đồng ý, và yêu cầu xoá dữ liệu cá nhân của mình.",
      "Nội dung trên trang mang tính giải trí và tham khảo, không thay thế lời khuyên chuyên môn.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <article className="space-y-10 pt-8 md:pt-12">
      <header className="space-y-4">
        <Breadcrumb items={[{ href: "/", label: "Trang chủ" }, { label: "Chính sách bảo mật" }]} />
        <h1 className="font-display text-4xl font-bold tracking-tighter md:text-5xl">Chính sách bảo mật</h1>
        <p className="text-ink-muted">Cập nhật lần cuối: {UPDATED}</p>
      </header>
      {SECTIONS.map((s) => (
        <section key={s.title} className="space-y-3">
          <h2 className="font-display text-2xl font-semibold">{s.title}</h2>
          <ul className="ml-5 list-disc space-y-2 text-ink-muted marker:text-accent">
            {s.items.map((item) => (
              <li key={item} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
