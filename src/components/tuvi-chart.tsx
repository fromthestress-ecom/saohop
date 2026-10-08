"use client";

import { useState } from "react";
import type { Brightness, Hoa, TuViChart, TuViPalace, TuViStar } from "@/lib/engines/tuvi";
import { BRIGHTNESS_INFO, CUC_INFO, HOA_INFO, PALACE_INFO, RING_INFO, STAR_INFO, TUAN_TRIET_INFO } from "@/lib/kb/tuvi-glossary";

/** Vị trí từng cung trên lưới 4×4 truyền thống (chỉ số địa chi → hàng, cột). Hai ô giữa dành cho phần tóm tắt. */
const GRID_POS: Record<number, [row: number, col: number]> = {
  5: [1, 1], 6: [1, 2], 7: [1, 3], 8: [1, 4],
  4: [2, 1], 9: [2, 4],
  3: [3, 1], 10: [3, 4],
  2: [4, 1], 1: [4, 2], 0: [4, 3], 11: [4, 4],
};

const HOA_STYLE: Record<Hoa, string> = {
  Lộc: "bg-accent-3/30",
  Quyền: "bg-accent-2/25",
  Khoa: "border border-accent-2/50",
  Kỵ: "bg-accent/25",
};

const BRIGHTNESS_STYLE: Record<Brightness, string> = {
  Miếu: "bg-accent-3/30",
  Vượng: "bg-accent-3/20",
  Đắc: "bg-accent-2/20",
  Bình: "bg-surface-2",
  Hãm: "bg-accent/25",
};

const GROUP_TITLE = { chinh: "Chính tinh", cat: "Cát tinh", sat: "Sát tinh", phu: "Phụ tinh" } as const;

function starColor(star: TuViStar) {
  if (star.group === "chinh") return "text-ink font-semibold";
  if (star.group === "cat") return "text-accent-2";
  if (star.group === "sat") return "text-accent";
  return STAR_INFO[star.name]?.tone === "xau" ? "text-accent/80" : "text-ink-muted";
}

function HoaBadge({ hoa }: { hoa: Hoa }) {
  return (
    <span className={`rounded px-1 text-[10px] font-semibold leading-4 ${HOA_STYLE[hoa]}`} title={HOA_INFO[hoa].meaning}>
      {hoa}
    </span>
  );
}

function BrightnessBadge({ value }: { value: Brightness }) {
  return (
    <span className={`rounded px-1 text-[10px] font-semibold leading-4 ${BRIGHTNESS_STYLE[value]}`} title={BRIGHTNESS_INFO[value].meaning}>
      {BRIGHTNESS_INFO[value].short}
    </span>
  );
}

const MAX_MINOR_IN_CELL = 5;

/** Nội dung một cung rút gọn: dùng trong ô lưới và thẻ trên điện thoại. */
function PalaceSummary({ palace }: { palace: TuViPalace }) {
  const main = palace.stars.filter((s) => s.group === "chinh");
  const rest = palace.stars.filter((s) => s.group !== "chinh");
  const shown = rest.slice(0, MAX_MINOR_IN_CELL);
  return (
    <>
      <div className="flex items-start justify-between gap-1">
        <p className="font-display text-sm font-semibold leading-tight">
          {palace.name}
          {palace.isThan && <span className="ml-1 rounded-full bg-accent-soft px-1.5 py-px align-middle text-[10px] font-medium">Thân</span>}
        </p>
        <p className="shrink-0 text-right text-[11px] leading-tight text-ink-muted">
          {palace.can} {palace.chi}
        </p>
      </div>
      <ul className="mt-1.5 space-y-0.5">
        {main.map((s) => (
          <li key={s.name} className="flex flex-wrap items-center gap-1 text-[13px] leading-5">
            <span className={starColor(s)}>{s.name}</span>
            {s.brightness && <BrightnessBadge value={s.brightness} />}
            {s.hoa && <HoaBadge hoa={s.hoa} />}
          </li>
        ))}
        {main.length === 0 && <li className="text-[11px] italic text-ink-muted">Vô chính diệu</li>}
      </ul>
      {shown.length > 0 && (
        <p className="mt-1.5 text-[11px] leading-[1.35]">
          {shown.map((s, i) => (
            <span key={s.name}>
              {i > 0 && <span className="text-ink-muted/60"> · </span>}
              <span className={starColor(s)}>{s.name}</span>
              {s.hoa && <span className="text-ink-muted"> ({s.hoa})</span>}
            </span>
          ))}
          {rest.length > shown.length && <span className="text-ink-muted"> +{rest.length - shown.length}</span>}
        </p>
      )}
      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10.5px] text-ink-muted">
        <span>
          {palace.daiHan.from}–{palace.daiHan.to} tuổi
        </span>
        <span>{palace.trangSinh}</span>
        {palace.tuan && <span className="font-medium text-ink">Tuần</span>}
        {palace.triet && <span className="font-medium text-ink">Triệt</span>}
      </p>
    </>
  );
}

function StarRow({ star }: { star: TuViStar }) {
  const info = STAR_INFO[star.name];
  return (
    <li className="border-t border-line py-2.5 first:border-t-0 first:pt-0">
      <p className="flex flex-wrap items-center gap-1.5">
        <span className={`text-sm ${starColor(star)}`}>{star.name}</span>
        {star.brightness && <BrightnessBadge value={star.brightness} />}
        {star.hoa && <HoaBadge hoa={star.hoa} />}
        {info && <span className="text-xs text-ink-muted">{info.kind}</span>}
      </p>
      {info && <p className="mt-0.5 text-sm text-ink-muted">{info.meaning}</p>}
      {star.hoa && <p className="mt-0.5 text-xs text-ink-muted">{HOA_INFO[star.hoa].name}: {HOA_INFO[star.hoa].meaning}</p>}
    </li>
  );
}

function PalaceDetail({ chart, palace }: { chart: TuViChart; palace: TuViPalace }) {
  const info = PALACE_INFO[palace.name];
  const opposite = chart.palaces[(palace.chiIndex + 6) % 12];
  const oppositeMain = opposite.stars.filter((s) => s.group === "chinh").map((s) => s.name);
  const groups = (["chinh", "cat", "sat", "phu"] as const).map((g) => ({ g, stars: palace.stars.filter((s) => s.group === g) }));
  const hasMain = groups[0].stars.length > 0;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium text-ink-muted">
          {palace.can} {palace.chi} · đại hạn {palace.daiHan.from}–{palace.daiHan.to} tuổi
        </p>
        <h3 className="font-display text-xl font-semibold">
          Cung {palace.name}
          {palace.isThan && <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 align-middle text-xs font-medium">Thân cư</span>}
        </h3>
        <p className="mt-1 text-sm text-ink-muted">
          <span className="font-medium text-ink">{info.asks}.</span> {info.meaning}
        </p>
      </div>

      {!hasMain && (
        <p className="rounded-xl bg-surface-2 p-3 text-sm text-ink-muted">
          Cung này không có chính tinh (vô chính diệu). Theo truyền thống, xem thêm các chính tinh ở cung đối diện ({opposite.name}):{" "}
          <span className="font-medium text-ink">{oppositeMain.length ? oppositeMain.join(", ") : "cũng không có"}</span>.
        </p>
      )}

      {groups.map(
        ({ g, stars }) =>
          stars.length > 0 && (
            <section key={g}>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">{GROUP_TITLE[g]}</h4>
              <ul>
                {stars.map((s) => (
                  <StarRow key={s.name} star={s} />
                ))}
              </ul>
            </section>
          ),
      )}

      {(palace.tuan || palace.triet) && (
        <section className="space-y-1 rounded-xl bg-surface-2 p-3 text-sm text-ink-muted">
          {palace.tuan && <p><span className="font-medium text-ink">{TUAN_TRIET_INFO.tuan.name}:</span> {TUAN_TRIET_INFO.tuan.meaning}</p>}
          {palace.triet && <p><span className="font-medium text-ink">{TUAN_TRIET_INFO.triet.name}:</span> {TUAN_TRIET_INFO.triet.meaning}</p>}
        </section>
      )}

      <section>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Các vòng sao đi qua cung này</h4>
        <dl className="grid gap-2 text-sm sm:grid-cols-3">
          {([
            ["thaiTue", palace.thaiTue],
            ["bacSi", palace.bacSi],
            ["trangSinh", palace.trangSinh],
          ] as const).map(([key, value]) => (
            <div key={key} className="rounded-xl border border-line p-2.5">
              <dt className="text-xs text-ink-muted">{RING_INFO[key].title}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function fmtLunar(chart: TuViChart) {
  const { day, month, year, isLeapMonth } = chart.lunar;
  return `${day}/${month}${isLeapMonth ? " nhuận" : ""}/${year}`;
}

function CenterSummary({ chart, solar }: { chart: TuViChart; solar: string }) {
  const menh = chart.palaces[chart.menhIndex];
  const than = chart.palaces[chart.thanIndex];
  const rows: [string, string][] = [
    ["Dương lịch", solar],
    ["Âm lịch", fmtLunar(chart)],
    ["Năm sinh", `${chart.year.label} (${chart.year.animal})`],
    ["Giờ sinh", chart.hourLabel],
    ["Bản mệnh", `${chart.year.napAm}`],
    ["Cục", chart.cuc.name],
    ["Mệnh tại", `${menh.chi}${menh.stars.some((s) => s.group === "chinh") ? ` · ${menh.stars.filter((s) => s.group === "chinh").map((s) => s.name).join(", ")}` : " · vô chính diệu"}`],
    ["Thân cư", `${than.name} (${than.chi})`],
    ["Mệnh chủ / Thân chủ", `${chart.menhChu} / ${chart.thanChu}`],
    ["Âm dương", `${chart.gender === "nam" ? "Nam" : "Nữ"} ${chart.clockwise ? "đi thuận" : "đi nghịch"} · ${chart.thuanLy ? "thuận lý" : "nghịch lý"}`],
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-4 lg:p-6">
      <p className="font-display text-gradient-brand text-center text-2xl font-bold tracking-tight">Lá số tử vi</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13px] leading-5">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-ink-muted">{k}</dt>
            <dd className="text-right font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="text-center text-xs text-ink-muted">{CUC_INFO[chart.cuc.name]}</p>
    </div>
  );
}

function Legend() {
  return (
    <p className="text-xs leading-5 text-ink-muted">
      <span className="font-medium text-ink">Cách đọc:</span> chữ đậm là chính tinh; <span className="text-accent-2">cát tinh</span>,{" "}
      <span className="text-accent">sát tinh</span> và phụ tinh xếp bên dưới. Ký hiệu cạnh sao:{" "}
      {(Object.keys(BRIGHTNESS_INFO) as Brightness[]).map((b) => `${BRIGHTNESS_INFO[b].short} = ${b}`).join(", ")}. Bấm vào một cung để xem
      ý nghĩa từng sao; các cung xung chiếu và tam hợp với nó được viền nhạt.
    </p>
  );
}

export function TuViChartView({ chart, solarLabel }: { chart: TuViChart; solarLabel: string }) {
  const [selected, setSelected] = useState(chart.menhIndex);
  const palace = chart.palaces[selected];
  const related = new Set([(selected + 6) % 12, (selected + 4) % 12, (selected + 8) % 12]);

  // Thứ tự cung chức (Mệnh, Phụ Mẫu...) cho danh sách trên điện thoại.
  const byFunction = [...chart.palaces].sort(
    (a, b) => (a.chiIndex - chart.menhIndex + 12) % 12 - (b.chiIndex - chart.menhIndex + 12) % 12,
  );

  const cellClass = (p: TuViPalace) =>
    `panel w-full p-2.5 text-left transition-colors ${
      p.chiIndex === selected
        ? "border-accent! bg-accent-soft/60!"
        : related.has(p.chiIndex)
          ? "border-accent-2/50!"
          : "hover:border-ink-muted/50!"
    }`;

  return (
    <div className="space-y-5">
      <Legend />

      {/* Điện thoại: danh sách theo thứ tự cung chức, cung đang chọn mở rộng tại chỗ. */}
      <div className="space-y-2 md:hidden">
        <div className="panel">
          <CenterSummary chart={chart} solar={solarLabel} />
        </div>
        {byFunction.map((p) => (
          <div key={p.chiIndex}>
            <button type="button" className={cellClass(p)} aria-pressed={p.chiIndex === selected} onClick={() => setSelected(p.chiIndex)}>
              <PalaceSummary palace={p} />
            </button>
            {p.chiIndex === selected && (
              <div className="panel mt-2 p-4">
                <PalaceDetail chart={chart} palace={p} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Máy tính: lưới 4×4 truyền thống, chi tiết cung bên dưới. */}
      <div className="hidden space-y-5 md:block">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gridTemplateRows: "repeat(4, minmax(11rem, auto))" }}
        >
          {chart.palaces.map((p) => {
            const [row, col] = GRID_POS[p.chiIndex];
            return (
              <button
                key={p.chiIndex}
                type="button"
                className={cellClass(p)}
                style={{ gridRow: row, gridColumn: col }}
                aria-pressed={p.chiIndex === selected}
                onClick={() => setSelected(p.chiIndex)}
              >
                <PalaceSummary palace={p} />
              </button>
            );
          })}
          <div className="panel" style={{ gridRow: "2 / span 2", gridColumn: "2 / span 2" }}>
            <CenterSummary chart={chart} solar={solarLabel} />
          </div>
        </div>
        <div className="panel p-5 sm:p-6">
          <PalaceDetail chart={chart} palace={palace} />
        </div>
      </div>
    </div>
  );
}
