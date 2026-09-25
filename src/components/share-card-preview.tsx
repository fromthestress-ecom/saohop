import { DIA_CHI } from "@/lib/engines/can-chi";
import { verdictOf } from "@/lib/engines/compatibility";
import { zodiacBySlug } from "@/lib/engines/zodiac";
import { SITE_NAME } from "@/lib/site";

interface Props {
  score: number;
  zodiacA: string;
  zodiacB: string;
  chiA: string;
  chiB: string;
}

// Vị trí sao cố định (%), giống thẻ PNG ở /api/og/crush.
const STARS: Array<[number, number, number]> = [
  [4, 16, 1.5], [50, 4, 1], [58, 10, 2.5], [71, 15, 1.5], [88, 7, 2], [93, 28, 1],
  [90, 46, 1.5], [96, 58, 1], [3, 67, 2], [82, 64, 1], [90, 72, 2.5], [96, 90, 1.5], [74, 95, 1],
];

const chiName = (slug: string) => DIA_CHI.find((c) => c.slug === slug)?.name ?? "";

/**
 * Bản HTML của thẻ chia sẻ, dùng để hiển thị trên trang (chữ thật, sắc nét ở mọi kích thước).
 * Kích thước chữ tính theo chiều rộng thẻ (đơn vị cqw), nên thẻ co giãn tự do.
 * Thẻ luôn dùng nền tối như ảnh PNG chia sẻ.
 */
export function ShareCardPreview({ score, zodiacA, zodiacB, chiA, chiB }: Props) {
  const za = zodiacBySlug(zodiacA);
  const zb = zodiacBySlug(zodiacB);
  if (!za || !zb) return null;

  return (
    <div
      className="@container relative aspect-[9/16] w-full overflow-hidden text-[#f3f1f8]"
      style={{
        background: "#08070f",
        backgroundImage: [
          "radial-gradient(circle at 90% 5%, rgba(157,140,255,0.45) 0%, rgba(8,7,15,0) 45%)",
          "radial-gradient(circle at 5% 60%, rgba(240,106,148,0.35) 0%, rgba(8,7,15,0) 45%)",
          "radial-gradient(circle at 70% 100%, rgba(247,178,103,0.18) 0%, rgba(8,7,15,0) 40%)",
        ].join(", "),
      }}
    >
      {STARS.map(([x, y, r]) => (
        <span
          key={`${x}-${y}`}
          className="absolute rounded-full bg-white/75"
          style={{ left: `${x}%`, top: `${y}%`, width: `${r * 0.35}cqw`, height: `${r * 0.35}cqw` }}
          aria-hidden
        />
      ))}

      <div className="relative flex h-full flex-col justify-between p-[10cqw]">
        <div className="font-brand flex items-center gap-[2.5cqw] text-[4cqw] font-semibold uppercase tracking-[0.22em]">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG tĩnh */}
          <img src="/brand/logo-mark.svg" alt="" className="h-[8.4cqw] w-[8.4cqw]" />
          {SITE_NAME}
        </div>

        <div>
          <p className="text-[4.4cqw] text-[#a7a4ba]">Độ hợp của hai bạn</p>
          <p
            className="font-display bg-clip-text pb-[1cqw] text-[30cqw] font-bold leading-[1.05] tracking-tighter text-transparent tabular-nums"
            style={{ backgroundImage: "linear-gradient(100deg, #f06a94, #9d8cff 60%, #f7b267)" }}
          >
            {score}%
          </p>
          <p className="font-display text-[7.5cqw] font-bold leading-tight">{verdictOf(score)}</p>
        </div>

        <dl className="space-y-[4cqw] border-t border-[#2c2a3b] pt-[4cqw]">
          {[
            { label: "Cung hoàng đạo", a: za.name, b: zb.name },
            { label: "Con giáp", a: `Tuổi ${chiName(chiA)}`, b: `Tuổi ${chiName(chiB)}` },
          ].map((row) => (
            <div key={row.label}>
              <dt className="text-[3.4cqw] text-[#a7a4ba]">{row.label}</dt>
              <dd className="font-display text-[5.6cqw] font-bold leading-snug">
                {row.a} <span className="text-[#f06a94]">&amp;</span> {row.b}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
