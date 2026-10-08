"use client";

import { IconChevronDown } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { BirthDateSelect } from "@/components/birth-date-select";
import { TuViChartView } from "@/components/tuvi-chart";
import { track } from "@/lib/analytics";
import { DIA_CHI } from "@/lib/engines/can-chi";
import { buildTuViChart, type Gender, type TuViInput } from "@/lib/engines/tuvi";
import { isValidSolarDate } from "@/lib/engines/types";

const THIS_YEAR = new Date().getFullYear();

const HOURS = DIA_CHI.map((chi, i) => {
  const start = (23 + i * 2) % 24;
  return { value: String(i), label: `${chi.name} (${start}h–${(start + 2) % 24}h)` };
});

interface Draft {
  day: string;
  month: string;
  year: string;
  hour: string;
  gender: Gender | "";
}

const emptyDraft: Draft = { day: "", month: "", year: "", hour: "", gender: "" };

function draftDate(d: Draft) {
  return { day: Number(d.day), month: Number(d.month), year: Number(d.year) };
}

function draftToInput(d: Draft): TuViInput | null {
  const birthDate = draftDate(d);
  if (!isValidSolarDate(birthDate) || d.hour === "" || d.gender === "") return null;
  return { birthDate, hourIndex: Number(d.hour), gender: d.gender };
}

export function TuViClient() {
  const reduce = useReducedMotion();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [submitted, setSubmitted] = useState<TuViInput | null>(null);
  const [invalid, setInvalid] = useState(false);

  const chart = useMemo(() => (submitted ? buildTuViChart(submitted) : null), [submitted]);
  const patch = (p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = draftToInput(draft);
    setInvalid(!input);
    if (input) {
      setSubmitted(input);
      track("tu_vi_view");
    }
  };

  const solarLabel = submitted ? `${submitted.birthDate.day}/${submitted.birthDate.month}/${submitted.birthDate.year}` : "";
  const dateInvalid = invalid && !isValidSolarDate(draftDate(draft));

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} noValidate className="panel space-y-5 p-5 sm:p-6 lg:max-w-4xl">
        <div className="grid gap-5 md:grid-cols-[1.4fr_1fr_1fr]">
          <div role="group" aria-labelledby="tv-dob" className="flex flex-col gap-2">
            <span id="tv-dob" className="text-sm font-medium">
              Ngày sinh (dương lịch)
            </span>
            <BirthDateSelect id="tv-dob" value={draft} onChange={patch} latestYear={THIS_YEAR} invalid={dateInvalid} allowEmpty />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tv-hour" className="text-sm font-medium">
              Giờ sinh
            </label>
            <div className="relative mt-auto">
              <select
                id="tv-hour"
                className={`field appearance-none pr-8 ${draft.hour === "" ? "text-ink-muted" : ""} ${invalid && draft.hour === "" ? "border-accent!" : ""}`}
                value={draft.hour}
                onChange={(e) => patch({ hour: e.target.value })}
                aria-invalid={(invalid && draft.hour === "") || undefined}
              >
                <option value="">Chọn giờ</option>
                {HOURS.map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </select>
              <IconChevronDown size={16} stroke={2} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden />
            </div>
          </div>

          <fieldset className="flex min-w-0 flex-col gap-2">
            <legend className="mb-2 text-sm font-medium">Giới tính</legend>
            <div className="mt-auto grid grid-cols-2 gap-2">
              {(["nam", "nu"] as const).map((g) => (
                <label
                  key={g}
                  className={`field flex cursor-pointer items-center justify-center text-center has-focus-visible:border-accent ${
                    draft.gender === g ? "border-accent! bg-accent-soft/60!" : invalid && draft.gender === "" ? "border-accent!" : ""
                  }`}
                >
                  <input type="radio" name="tv-gender" value={g} checked={draft.gender === g} onChange={() => patch({ gender: g })} className="sr-only" />
                  {g === "nam" ? "Nam" : "Nữ"}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <p className="text-xs text-ink-muted">
          Cần giờ sinh để an cung Mệnh. Nếu không rõ giờ, hãy hỏi gia đình (giấy khai sinh thường có); lá số sai giờ sẽ khác hẳn.
        </p>
        {invalid && (
          <p role="alert" className="text-sm font-medium text-accent">
            Chọn đủ ngày sinh, giờ sinh và giới tính nhé.
          </p>
        )}
        <button type="submit" className="btn-primary w-full sm:w-auto sm:px-10">
          Lập lá số
        </button>
      </form>

      {chart ? (
        <motion.div
          key={JSON.stringify(submitted)}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <TuViChartView chart={chart} solarLabel={solarLabel} />
        </motion.div>
      ) : (
        <div className="flex min-h-48 flex-col justify-center rounded-2xl border border-dashed border-line p-8">
          <p className="font-display text-xl font-semibold">Lá số của bạn sẽ hiện ở đây.</p>
          <p className="mt-2 max-w-[52ch] text-ink-muted">Chọn ngày, giờ sinh và giới tính để xem 12 cung, các chính tinh và ý nghĩa của từng sao.</p>
        </div>
      )}
    </div>
  );
}
