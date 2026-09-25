import { ELEMENT_KEYWORDS, LIFE_PATH_KEYWORDS } from "@/lib/content/keywords";
import type { NumerologyProfile } from "@/lib/engines/numerology";
import type { PersonProfile } from "@/lib/engines/profile";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { ZodiacIcon } from "./zodiac-icon";

/** Lưới Pythagoras: cột trái 1-2-3 (dưới lên), giữa 4-5-6, phải 7-8-9. */
const GRID_ROWS = [3, 6, 9, 2, 5, 8, 1, 4, 7];

export function BirthChartGrid({ counts, size = "md" }: { counts: NumerologyProfile["chart"]["counts"]; size?: "sm" | "md" }) {
  const cell = size === "sm" ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm";
  return (
    <div className="grid shrink-0 grid-cols-3 gap-1.5" role="img" aria-label="Biểu đồ ngày sinh">
      {GRID_ROWS.map((d) => {
        const count = counts[d];
        return (
          <div
            key={d}
            className={`flex items-center justify-center rounded-xl font-semibold tabular-nums ${cell} ${
              count ? "bg-accent-soft text-ink" : "border border-dashed border-line text-ink-muted/50"
            }`}
          >
            {count ? String(d).repeat(count) : d}
          </div>
        );
      })}
    </div>
  );
}

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
      {children}
      <IconArrowRight size={16} aria-hidden />
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="font-display text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export function NumerologyCard({ profile }: { profile: PersonProfile }) {
  const n = profile.numerology;
  return (
    <section className="panel p-5 sm:p-6" aria-labelledby="tsh">
      <h2 id="tsh" className="text-sm font-medium text-ink-muted">Thần số học</h2>
      <div className="mt-3 flex items-end gap-4">
        <p className="font-display text-gradient-brand text-7xl font-bold leading-none tracking-tighter tabular-nums">{n.lifePath}</p>
        <div className="pb-1.5">
          <p className="font-medium">Số chủ đạo</p>
          <p className="text-sm text-ink-muted">{LIFE_PATH_KEYWORDS[n.lifePath]}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-3">
        <Stat label="Ngày sinh" value={n.birthday} />
        <Stat label="Thái độ" value={n.attitude} />
        <Stat label="Năm cá nhân" value={n.personalYear} />
        {n.name && (
          <>
            <Stat label="Sứ mệnh" value={n.name.expression} />
            <Stat label="Linh hồn" value={n.name.soulUrge} />
            <Stat label="Nhân cách" value={n.name.personality} />
          </>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row">
        <BirthChartGrid counts={n.chart.counts} />
        <div className="space-y-3 text-sm">
          {n.chart.fullArrows.length > 0 && (
            <div>
              <p className="text-xs text-ink-muted">Mũi tên nổi bật</p>
              <ul className="mt-1 space-y-0.5 font-medium text-accent">
                {n.chart.fullArrows.map((a) => (
                  <li key={a}>{a.replace("Mũi tên ", "")}</li>
                ))}
              </ul>
            </div>
          )}
          {n.chart.emptyArrows.length > 0 && (
            <div>
              <p className="text-xs text-ink-muted">Mũi tên trống, cần rèn thêm</p>
              <ul className="mt-1 space-y-0.5">
                {n.chart.emptyArrows.map((a) => (
                  <li key={a}>{a.replace("Mũi tên ", "")}</li>
                ))}
              </ul>
            </div>
          )}
          {!n.chart.fullArrows.length && !n.chart.emptyArrows.length && (
            <p className="text-ink-muted">Không có mũi tên đặc biệt. Biểu đồ khá cân bằng.</p>
          )}
        </div>
      </div>
      <MoreLink href={`/than-so-hoc/so-${n.lifePath}`}>Đọc thêm về số {n.lifePath}</MoreLink>
    </section>
  );
}

export function ZodiacCard({ profile }: { profile: PersonProfile }) {
  const { sign, isCusp } = profile.zodiac;
  return (
    <section className="panel p-5 sm:p-6" aria-labelledby="chd">
      <h2 id="chd" className="text-sm font-medium text-ink-muted">Cung hoàng đạo</h2>
      <div className="mt-3 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
          <ZodiacIcon slug={sign.slug} size={30} />
        </span>
        <div>
          <p className="font-display text-2xl font-semibold">
            {sign.name}
            {sign.altName && <span className="text-base font-normal text-ink-muted"> ({sign.altName})</span>}
          </p>
          <p className="text-sm text-ink-muted">
            Nguyên tố {sign.element}, nhóm {sign.modality.toLowerCase()}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm">{ELEMENT_KEYWORDS[sign.element]}</p>
      {isCusp && (
        <p className="mt-2 text-xs text-ink-muted">
          Bạn sinh sát ngày chuyển cung. Cần giờ và nơi sinh để xác định chính xác tuyệt đối.
        </p>
      )}
      <MoreLink href={`/cung-hoang-dao/${sign.slug}`}>Đọc thêm về {sign.name}</MoreLink>
    </section>
  );
}

export function CanChiCard({ profile }: { profile: PersonProfile }) {
  const { canChi, lunarBirthDate: l } = profile;
  return (
    <section className="panel p-5 sm:p-6" aria-labelledby="cg">
      <h2 id="cg" className="text-sm font-medium text-ink-muted">Con giáp và ngũ hành</h2>
      <div className="mt-3 flex items-center gap-4">
        <span className="font-display flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-soft text-base font-bold text-accent">
          {canChi.chi}
        </span>
        <div>
          <p className="font-display text-2xl font-semibold">{canChi.label}</p>
          <p className="text-sm text-ink-muted">Tuổi {canChi.animal}, mệnh {canChi.napAm}</p>
        </div>
      </div>
      <p className="mt-4 text-sm">
        Âm lịch: ngày {l.day} tháng {l.month}
        {l.isLeapMonth ? " (nhuận)" : ""} năm {canChi.label}
      </p>
    </section>
  );
}
