import { CON_GIAP_ICONS } from "@/lib/con-giap-icons";

/** Biểu tượng con giáp theo slug (vd. "thin"), cùng nét với ZodiacIcon. */
export function ConGiapIcon({ slug, size = 24, className }: { slug: string; size?: number; className?: string }) {
  const inner = CON_GIAP_ICONS[slug];
  if (!inner) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      // Nội dung là hằng số tĩnh trong mã nguồn, không có dữ liệu người dùng.
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}
