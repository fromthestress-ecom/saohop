import Link from "next/link";
import { GA_ID } from "@/lib/analytics";
import { CONTACT_EMAIL, SITE_NAME, SOCIAL_LINKS } from "@/lib/site";
import { ConsentSettingsLink } from "./consent-banner";
import { SocialLinks } from "./social-links";

const EXPLORE = [
  { href: "/crush", label: "Check crush" },
  { href: "/ban-do", label: "Bản đồ bản thân" },
  { href: "/tu-vi", label: "Lá số tử vi" },
];

const LOOKUPS = [
  { href: "/cung-hoang-dao", label: "Cung hoàng đạo" },
  { href: "/cung-hoang-dao/cap-doi", label: "Cặp đôi hoàng đạo" },
  { href: "/than-so-hoc", label: "Thần số học" },
  { href: "/con-giap", label: "Con giáp" },
  { href: "/con-giap/cap-doi", label: "Cặp đôi con giáp" },
  { href: "/ngu-hanh", label: "Ngũ hành" },
  { href: "/nam-sinh", label: "Năm sinh" },
];

const linkClass = "text-ink transition-colors hover:text-accent";

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <nav aria-label={title}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-8 w-full max-w-7xl border-t border-line px-4 pb-10 pt-12 sm:px-6">
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-x-10">
        <div className="col-span-2 max-w-sm space-y-4 md:col-span-1">
          <Link href="/" className="inline-flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG tĩnh, không cần tối ưu ảnh */}
            <img src="/brand/logo-mark.svg" alt="" width={32} height={32} className="h-8 w-8" />
            <span className="font-brand pt-[2px] text-base font-semibold uppercase tracking-[0.2em]">{SITE_NAME}</span>
          </Link>
          <p className="text-sm leading-relaxed text-ink-muted">
            Thần số học, cung hoàng đạo, con giáp và lá số tử vi. Con số do thuật toán tính, AI chỉ kể lại.
          </p>
          <SocialLinks links={SOCIAL_LINKS} variant="icon" />
        </div>

        <FooterColumn title="Khám phá">
          {EXPLORE.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={linkClass}>
                {l.label}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Tra cứu">
          {LOOKUPS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={linkClass}>
                {l.label}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title={SITE_NAME}>
          <li>
            <Link href="/gioi-thieu" className={linkClass}>
              Giới thiệu
            </Link>
          </li>
          <li>
            <Link href="/chinh-sach-bao-mat" className={linkClass}>
              Chính sách bảo mật
            </Link>
          </li>
          {CONTACT_EMAIL && (
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                Liên hệ
              </a>
            </li>
          )}
          {GA_ID && (
            <li className="[&_button]:text-ink">
              <ConsentSettingsLink />
            </li>
          )}
        </FooterColumn>
      </div>

      <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs leading-relaxed text-ink-muted sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <p className="max-w-2xl">
          Nội dung mang tính giải trí và tham khảo, không thay thế lời khuyên chuyên môn. Ngày sinh của crush ở chế độ xem nhanh không được lưu lại.
        </p>
        <p className="shrink-0">
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
