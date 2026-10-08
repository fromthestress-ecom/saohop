"use client";

import { IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { writeBanDoPrefill } from "@/lib/ban-do-prefill";
import { isValidSolarDate } from "@/lib/engines/types";
import { BirthDateSelect, type DateParts } from "./birth-date-select";

const EMPTY: DateParts = { day: "", month: "", year: "" };
const THIS_YEAR = new Date().getFullYear();

/** Ô nhập nhanh ở hero: một ngày sinh (của mình hoặc người khác), bấm là sang trang bản đồ và hiện kết quả luôn. */
export function HeroCheck() {
  const router = useRouter();
  const [date, setDate] = useState<DateParts>(EMPTY);
  const [invalid, setInvalid] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidSolarDate({ day: Number(date.day), month: Number(date.month), year: Number(date.year) })) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    writeBanDoPrefill(date);
    router.push("/ban-do");
  };

  return (
    <form onSubmit={onSubmit} noValidate className="panel mt-8 space-y-4 p-4 sm:p-5">
      <div role="group" aria-labelledby="hero-dob" className="flex flex-col gap-2">
        <span id="hero-dob" className="text-sm font-medium">
          Chiêm tinh của bạn
        </span>
        <BirthDateSelect
          id="hero-dob"
          value={date}
          onChange={(p) => setDate((d) => ({ ...d, ...p }))}
          latestYear={THIS_YEAR - 12}
          invalid={invalid}
          allowEmpty
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn-primary btn-halo">
          Xem ngay
          <IconArrowRight size={18} stroke={2} aria-hidden />
        </button>
        {invalid && (
          <p role="alert" className="text-sm font-medium text-accent">
            Chọn đủ ngày, tháng, năm sinh nhé.
          </p>
        )}
      </div>
    </form>
  );
}
