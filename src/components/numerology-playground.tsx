"use client";

import { IconArrowRight, IconPencil } from "@tabler/icons-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { LIFE_PATH_KEYWORDS } from "@/lib/content/keywords";
import { birthChart, lifePathNumber } from "@/lib/engines/numerology";
import { isValidSolarDate, type SolarDate } from "@/lib/engines/types";
import { BirthDateSelect } from "./birth-date-select";
import { BirthChartGrid } from "./profile-cards";

const DEFAULT_DATE: SolarDate = { day: 16, month: 11, year: 2002 };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Ô thử thần số học ở trang chủ: mặc định 16/11/2002, bấm vào để nhập ngày sinh của mình,
 * biểu đồ và số chủ đạo cập nhật ngay (tính trên máy, không gửi đi đâu).
 */
export function NumerologyPlayground() {
  const reduce = useReducedMotion();
  const id = useId();
  const [date, setDate] = useState<SolarDate>(DEFAULT_DATE);
  const [editing, setEditing] = useState(false);

  const valid = isValidSolarDate(date);
  // Ngày không hợp lệ (vd. 31/2) thì giữ nguyên kết quả của ngày gần nhất hợp lệ.
  const [lastValid, setLastValid] = useState<SolarDate>(DEFAULT_DATE);
  const shown = valid ? date : lastValid;
  const lifePath = lifePathNumber(shown);
  const chart = birthChart(shown);

  // Chỉ ghi sự kiện một lần mỗi lượt xem trang.
  const tracked = useRef(false);

  const update = (patch: Partial<SolarDate>) => {
    if (!tracked.current) {
      tracked.current = true;
      track("numerology_try");
    }
    const next = { ...date, ...patch };
    setDate(next);
    if (isValidSolarDate(next)) setLastValid(next);
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-expanded={editing}
        aria-controls={`${id}-editor`}
        className="group flex w-full items-end gap-6 rounded-2xl text-left outline-offset-4"
      >
        <BirthChartGrid counts={chart.counts} />
        <span className="min-w-0">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={lifePath}
              className="font-display text-gradient-brand block text-7xl font-bold leading-none tracking-tighter tabular-nums"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {lifePath}
            </motion.span>
          </AnimatePresence>
          <span className="mt-1 block text-sm text-ink-muted">
            Số chủ đạo của người sinh{" "}
            <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-line px-2 py-0.5 font-semibold text-ink tabular-nums transition-colors group-hover:border-accent">
              {pad(shown.day)}/{pad(shown.month)}/{shown.year}
              <IconPencil size={13} stroke={1.75} className="text-accent" aria-hidden />
            </span>
          </span>
          {!editing && <span className="mt-1 block text-xs text-ink-muted/80">Bấm để thử ngày sinh của bạn</span>}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {editing && (
          <motion.div
            id={`${id}-editor`}
            className="overflow-hidden"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-3 border-t border-line pt-4">
              <BirthDateSelect
                id={`${id}-date`}
                value={{ day: String(date.day), month: String(date.month), year: String(date.year) }}
                onChange={(patch) =>
                  update(Object.fromEntries(Object.entries(patch).map(([k, v]) => [k, Number(v)])) as Partial<SolarDate>)
                }
                invalid={!valid}
              />
              {!valid && (
                <p role="alert" className="text-xs font-medium text-accent">
                  Ngày {date.day}/{date.month}/{date.year} không tồn tại, bạn chọn lại ngày nhé.
                </p>
              )}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm">
                  <span className="font-semibold">Số {lifePath}:</span>{" "}
                  <span className="text-ink-muted">{LIFE_PATH_KEYWORDS[lifePath]}</span>
                </p>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/than-so-hoc/so-${lifePath}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
                  >
                    Đọc về số {lifePath} <IconArrowRight size={15} aria-hidden />
                  </Link>
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary px-3! py-1.5! text-sm">
                    Xong
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
