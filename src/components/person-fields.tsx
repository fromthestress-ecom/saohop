"use client";

import { isValidSolarDate, type PersonInput } from "@/lib/engines/types";
import { BirthDateSelect } from "./birth-date-select";

export interface PersonDraft {
  fullName: string;
  day: string;
  month: string;
  year: string;
}

export const emptyDraft: PersonDraft = { fullName: "", day: "", month: "", year: "" };

export function draftToPerson(draft: PersonDraft): PersonInput | null {
  const birthDate = { day: Number(draft.day), month: Number(draft.month), year: Number(draft.year) };
  if (!isValidSolarDate(birthDate)) return null;
  const fullName = draft.fullName.trim();
  return { fullName: fullName || undefined, birthDate };
}

const THIS_YEAR = new Date().getFullYear();

interface Props {
  id: string;
  title: string;
  value: PersonDraft;
  onChange: (next: PersonDraft) => void;
  nameHint?: string;
  /** Hiện viền lỗi cho phần ngày sinh */
  invalid?: boolean;
}

export function PersonFields({ id, title, value, onChange, nameHint, invalid }: Props) {
  const set = (patch: Partial<PersonDraft>) => onChange({ ...value, ...patch });
  return (
    <fieldset className="panel space-y-4 p-5 sm:p-6">
      <legend className="font-display float-left mb-1 w-full text-lg font-semibold">{title}</legend>
      <div className="clear-both flex flex-col gap-2">
        <label htmlFor={`${id}-name`} className="text-sm font-medium">
          Họ và tên <span className="font-normal text-ink-muted">(không bắt buộc)</span>
        </label>
        <input
          id={`${id}-name`}
          className="field"
          placeholder="Trần Minh Anh"
          autoComplete="off"
          maxLength={80}
          value={value.fullName}
          onChange={(e) => set({ fullName: e.target.value })}
          aria-describedby={nameHint ? `${id}-name-hint` : undefined}
        />
        {nameHint && (
          <p id={`${id}-name-hint`} className="text-xs text-ink-muted">
            {nameHint}
          </p>
        )}
      </div>
      <div role="group" aria-labelledby={`${id}-dob`} className="flex flex-col gap-2">
        <span id={`${id}-dob`} className="text-sm font-medium">
          Ngày sinh (dương lịch)
        </span>
        {/* Bắt đầu từ 12 tuổi để danh sách năm ngắn gọn hơn. */}
        <BirthDateSelect id={`${id}-dob`} value={value} onChange={set} latestYear={THIS_YEAR - 12} invalid={invalid} allowEmpty />
      </div>
    </fieldset>
  );
}
