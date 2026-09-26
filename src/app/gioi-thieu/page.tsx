import {
  IconArrowRight,
  IconCards,
  IconCircleCheck,
  IconHeartHandshake,
  IconHearts,
  IconLock,
  IconMapPin,
  IconMessageCircle2,
  IconMoonStars,
  IconScale,
  IconSparkles,
  IconStars,
  IconSunMoon,
  IconUsersGroup,
  IconYinYang,
  type Icon,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, CrushCta } from "@/components/kb-blocks";
import { Reveal } from "@/components/reveal";
import { LIFE_PATH_NUMBERS } from "@/lib/engines/numerology";
import { ZODIAC_SIGNS } from "@/lib/engines/zodiac";
import { ZODIAC_PAIRS, zodiacVariantLinks } from "@/lib/kb";
import { pageSeo, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Giới thiệu: xem độ hợp tình yêu qua thần số học và cung hoàng đạo",
  description: `${SITE_NAME} giúp bạn thấu hiểu bản thân và xem độ hợp với crush qua thần số học, cung hoàng đạo, con giáp và ngũ hành. Miễn phí, không cần tài khoản.`,
  ...pageSeo("/gioi-thieu"),
};

// Số liệu lấy thẳng từ kho kiến thức để không bao giờ lệch với nội dung thật.
const VARIANT_PAGES = ZODIAC_SIGNS.reduce((n, s) => n + zodiacVariantLinks(s).length, 0);
const STATS = [
  { value: ZODIAC_SIGNS.length, label: "cung hoàng đạo" },
  { value: VARIANT_PAGES, label: "bài theo giới tính và tháng sinh" },
  { value: ZODIAC_PAIRS.length, label: "cặp đôi hoàng đạo" },
  { value: LIFE_PATH_NUMBERS.length, label: "số chủ đạo" },
];
const TOTAL_PAGES = STATS.reduce((n, s) => n + s.value, 0);

const PRINCIPLES: Array<{ icon: Icon; title: string; body: string }> = [
  {
    icon: IconStars,
    title: "Chuẩn xác từ gốc rễ",
    body: "Ngày âm lịch, can chi, số chủ đạo, cung hoàng đạo và độ hợp giữa hai cung đều được tính đúng theo nguyên tắc của âm lịch Việt Nam, chiêm tinh phương Tây và thần số học Pythagoras. Cùng một ngày sinh, bạn luôn nhận được cùng một thông điệp.",
  },
  {
    icon: IconMessageCircle2,
    title: "Người bạn tâm giao thấu hiểu",
    body: "Không khô khan như một cỗ máy, cũng không mơ hồ như lời đồn đoán. Sao Hợp chuyển những con số phức tạp thành câu chuyện dễ hiểu, chân thành và dành riêng cho bạn.",
  },
  {
    icon: IconLock,
    title: "Bí mật của riêng bạn",
    body: "Ngày sinh của crush chỉ là chiếc chìa khoá mở ra sự thấu hiểu: được dùng một lần để tính rồi bỏ, không lưu lại. Thẻ kết quả bạn chia sẻ không hiện tên hay ngày sinh của bất kỳ ai.",
  },
  {
    icon: IconScale,
    title: "Chỉ lối, không phán xét",
    body: "Chúng tôi tin mọi mối quan hệ đều có thể nở hoa khi hai người hiểu nhau. Sao Hợp không tiên đoán chia ly hay điều xui rủi, mỗi khác biệt đều đi kèm gợi ý để cả hai cùng dung hoà và trưởng thành.",
  },
];

type Status = "co" | "sap" | "ap";
const STATUS_LABEL: Record<Status, string> = { co: "Đã có", sap: "Sắp có", ap: "Đang ấp ủ" };

const ROADMAP: Array<{ status: Status; icon: Icon; title: string; body: string; href?: string }> = [
  { status: "co", icon: IconHeartHandshake, title: "Check crush: bạn và người ấy hợp bao nhiêu?", body: "Hai ngày sinh, một con số và lý do vì sao hai bạn hút nhau hay cần dung hoà.", href: "/crush" },
  { status: "co", icon: IconSparkles, title: "Bản đồ bản thân: hiểu mình trước khi hiểu người", body: "Số chủ đạo, biểu đồ ngày sinh, cung hoàng đạo, con giáp và mệnh ngũ hành.", href: "/ban-do" },
  {
    status: "co",
    icon: IconCircleCheck,
    title: "Kho tra cứu huyền học",
    body: `${TOTAL_PAGES} trang về cung hoàng đạo, cặp đôi và thần số học, viết riêng từng trang.`,
    href: "/cung-hoang-dao",
  },
  { status: "sap", icon: IconUsersGroup, title: "Secret Crush: khi hai trái tim cùng hướng về nhau", body: "Gửi lời mời để crush tự nhập ngày sinh. Nếu cả hai cùng check nhau, Sao Hợp sẽ báo cho hai bạn biết." },
  { status: "sap", icon: IconMoonStars, title: "Tử vi Đông phương: lá số 12 cung", body: "Lá số 12 cung theo giờ sinh âm lịch, luận giải từng cung." },
  { status: "sap", icon: IconYinYang, title: "Bát Tự và ngũ hành: vận mệnh qua tứ trụ", body: "Tứ trụ năm, tháng, ngày, giờ và ngũ hành vượng suy ở mức dễ hiểu." },
  { status: "sap", icon: IconCards, title: "Tarot tình yêu: một lá bài cho trái tim", body: "Rút một lá mỗi ngày và trải bài ba lá cho chuyện tình cảm." },
  { status: "sap", icon: IconSunMoon, title: "Hôm nay: năng lượng mỗi ngày của bạn", body: "Tử vi ngày theo cung, con giáp và số, kèm lịch âm." },
  { status: "ap", icon: IconMapPin, title: "Gợi ý chỗ hẹn hò hợp cả hai", body: "Quán và hoạt động hợp với cả hai người, bắt đầu từ Hà Nội và TP.HCM." },
  { status: "ap", icon: IconHearts, title: "Gặp người hợp với mình", body: "Gợi ý vài người hợp nhất mỗi ngày, có xác thực và chỉ dành cho người đủ 18 tuổi." },
];

const TODAY_LINKS = [
  { href: "/crush", label: "Check độ hợp với crush" },
  { href: "/ban-do", label: "Xem bản đồ cá nhân" },
  { href: "/cung-hoang-dao", label: "Giải mã 12 cung hoàng đạo" },
  { href: "/cung-hoang-dao/cap-doi", label: `Độ hợp của ${ZODIAC_PAIRS.length} cặp đôi hoàng đạo` },
  { href: "/than-so-hoc", label: "Tra cứu thần số học" },
];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://saohop.com";
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `Giới thiệu ${SITE_NAME}`,
  url: `${SITE_URL}/gioi-thieu`,
  inLanguage: "vi",
  about: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-mark.svg`,
  },
};

export default function AboutPage() {
  return (
    <article className="space-y-20 pt-8 md:space-y-28 md:pt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }} />

      <header className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div className="space-y-6">
          <Breadcrumb items={[{ href: "/", label: "Trang chủ" }, { label: "Giới thiệu" }]} />
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tighter md:text-5xl">
            {SITE_NAME}: giải mã <span className="text-gradient-brand">thông điệp vũ trụ</span> và chuyện tình cảm qua thần số học, cung hoàng đạo
          </h1>
          <div className="max-w-[60ch] space-y-4 text-lg leading-relaxed text-ink-muted">
            <p>
              Giữa hàng tỉ người, việc gặp được nhau đã là một sự sắp đặt của vũ trụ. Bạn và người ấy liệu có phải một nửa của nhau?{" "}
              {SITE_NAME} ra đời để giúp bạn thấu hiểu bản thân và kết nối sâu sắc hơn với những người xung quanh qua thần số học, cung hoàng
              đạo, con giáp và ngũ hành.
            </p>
            <p>
              Thay vì những lời phán chung chung, {SITE_NAME} kết hợp kho tàng tri thức huyền học với công nghệ hiện đại. Mọi chỉ số được tính
              cẩn thận và nhất quán, rồi kể lại bằng ngôn ngữ gần gũi, ấm áp như một người bạn tâm giao đang lắng nghe câu chuyện của riêng bạn.
            </p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3">
          {STATS.map((s) => (
            <div key={s.label} className="panel flex flex-col-reverse p-5">
              <dt className="mt-1 text-sm text-ink-muted">{s.label}</dt>
              <dd className="font-display text-gradient-brand text-4xl font-bold tracking-tighter tabular-nums md:text-5xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section aria-labelledby="nguyen-tac" className="space-y-8">
        <h2 id="nguyen-tac" className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Bốn lời hứa từ {SITE_NAME}
        </h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {PRINCIPLES.map(({ icon: Icon, title, body }, i) => (
            <li key={title}>
              <Reveal delay={i * 0.05} className="panel h-full p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Icon size={24} stroke={1.5} aria-hidden />
                </span>
                <h3 className="font-display mt-4 text-xl font-semibold">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink-muted">{body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="hom-nay" className="space-y-5">
        <h2 id="hom-nay" className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Khám phá ngay bản đồ của bạn
        </h2>
        <p className="max-w-[60ch] text-lg text-ink-muted">Miễn phí, không cần tài khoản, chỉ cần ngày sinh của bạn và người ấy.</p>
        <ul className="flex flex-wrap gap-3">
          {TODAY_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-semibold transition-colors hover:border-accent hover:text-accent"
              >
                {l.label}
                <IconArrowRight size={16} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="lo-trinh" className="space-y-8">
        <div className="max-w-[60ch] space-y-3">
          <h2 id="lo-trinh" className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Lộ trình kết nối vũ trụ
          </h2>
          <p className="text-lg text-ink-muted">
            {SITE_NAME} lớn lên từng ngày. Những tính năng sắp có sẽ lần lượt ra mắt trước Tết Đinh Mùi 2027.
          </p>
        </div>
        <ol className="grid gap-3 md:grid-cols-2">
          {ROADMAP.map(({ status, icon: Icon, title, body, href }) => {
            const inner = (
              <>
                <Icon size={26} stroke={1.5} className={`mt-0.5 shrink-0 ${status === "co" ? "text-accent" : "text-ink-muted"}`} aria-hidden />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{title}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        status === "co" ? "bg-accent-soft text-accent" : "border border-line text-ink-muted"
                      }`}
                    >
                      {STATUS_LABEL[status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{body}</p>
                </div>
              </>
            );
            return (
              <li key={title}>
                {href ? (
                  <Link href={href} className="panel flex h-full gap-4 p-5 transition-colors hover:border-accent">
                    {inner}
                  </Link>
                ) : (
                  <div className={`panel flex h-full gap-4 p-5 ${status === "ap" ? "opacity-75" : ""}`}>{inner}</div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="luu-y" className="max-w-3xl space-y-4">
        <h2 id="luu-y" className="font-display text-2xl font-semibold">
          Một lời nhắn gửi nhỏ
        </h2>
        <p className="leading-relaxed text-ink-muted">
          Vũ trụ cho ta những chỉ dẫn, nhưng chính bạn mới là người viết nên câu chuyện của mình. Nội dung trên {SITE_NAME} mang tính giải trí
          và tham khảo, giúp bạn có thêm một góc nhìn mới, không thay thế lời khuyên của chuyên gia tâm lý, y tế, pháp lý hay tài chính. Sự hoà
          hợp cuối cùng vẫn đến từ cách hai bạn trân trọng và đối xử với nhau mỗi ngày. Tìm hiểu cách chúng tôi bảo vệ thông tin của bạn tại{" "}
          <Link href="/chinh-sach-bao-mat" className="font-semibold text-accent hover:underline">
            Chính sách bảo mật
          </Link>
          .
        </p>
      </section>

      <CrushCta title="Bắt đầu bằng câu hỏi ai cũng tò mò: bạn và crush hợp nhau bao nhiêu phần trăm?" />
    </article>
  );
}
