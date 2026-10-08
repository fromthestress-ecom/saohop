import { IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandTiktok } from "@tabler/icons-react";
import type { SocialLink } from "@/lib/site";

const ICONS = {
  facebook: IconBrandFacebook,
  tiktok: IconBrandTiktok,
  instagram: IconBrandInstagram,
  linkedin: IconBrandLinkedin,
} as const;

interface Props {
  links: readonly SocialLink[];
  /**
   * "pill": nút viền tròn có chữ (trang giới thiệu).
   * "icon": nút tròn chỉ có icon (chân trang), tên kênh nằm trong chữ ẩn cho người đọc màn hình.
   */
  variant?: "pill" | "icon";
}

const LINK_CLASS = {
  pill: "inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-accent hover:text-accent",
  icon: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-accent hover:text-accent",
} as const;

/** Danh sách link mạng xã hội. Mở tab mới, có chữ báo cho người đọc màn hình. */
export function SocialLinks({ links, variant = "pill" }: Props) {
  return (
    <ul className="flex flex-wrap gap-2">
      {links.map((l) => {
        const Icon = ICONS[l.kind];
        const label = variant === "pill" ? l.label : <span className="sr-only">{l.label}</span>;
        return (
          <li key={l.href}>
            <a href={l.href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS[variant]}>
              <Icon size={variant === "pill" ? 18 : 17} stroke={1.5} aria-hidden />
              {label}
              <span className="sr-only"> (mở trong tab mới)</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
