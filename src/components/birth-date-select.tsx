"use client";

import { IconChevronDown } from "@tabler/icons-react";

export interface DateParts {
  day: string;
  month: string;
  year: string;
}

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const THIS_YEAR = new Date().getFullYear();

interface Props {
  id: string;
  value: DateParts;
  onChange: (patch: Partial<DateParts>) => void;
  /** Năm mới nhất trong danh sách (mặc định: năm nay). */
  latestYear?: number;
  invalid?: boolean;
  /** Cho phép ô trống, hiện gợi ý định dạng dd / mm / yyyy (form chưa nhập). */
  allowEmpty?: boolean;
}

/**
 * Chọn ngày sinh bằng 3 ô Ngày / Tháng / Năm.
 * Nhãn nằm phía trên, trong ô chỉ hiện số nên không bị cắt chữ ở cột hẹp.
 */
export function BirthDateSelect({ id, value, onChange, latestYear = THIS_YEAR, invalid, allowEmpty }: Props) {
  const years = Array.from({ length: latestYear - 1939 }, (_, i) => latestYear - i);

  const column = (key: keyof DateParts, label: string, placeholder: string, options: number[]) => (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={`${id}-${key}`} className="text-xs font-medium text-ink-muted">
        {label}
      </label>
      <div className="relative">
        <select
          id={`${id}-${key}`}
          className={`field appearance-none pr-8 tabular-nums ${value[key] === "" ? "text-ink-muted" : ""} ${invalid ? "border-accent!" : ""}`}
          value={value[key]}
          onChange={(e) => onChange({ [key]: e.target.value })}
          aria-invalid={invalid || undefined}
        >
          {allowEmpty && <option value="">{placeholder}</option>}
          {options.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <IconChevronDown
          size={16}
          stroke={2}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted"
          aria-hidden
        />
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-[1fr_1fr_1.3fr] gap-2">
      {column("day", "Ngày", "dd", DAYS)}
      {column("month", "Tháng", "mm", MONTHS)}
      {column("year", "Năm", "yyyy", years)}
    </div>
  );
}
