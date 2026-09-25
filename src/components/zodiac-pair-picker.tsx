"use client";

import { IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { track } from "@/lib/analytics";
import { ZODIAC_SIGNS } from "@/lib/engines/zodiac";

/** Chọn 2 cung rồi chuyển tới trang cặp đôi theo slug chuẩn (cung đứng trước viết trước). */
export function ZodiacPairPicker() {
  const router = useRouter();
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const sa = ZODIAC_SIGNS.find((s) => s.slug === a);
    const sb = ZODIAC_SIGNS.find((s) => s.slug === b);
    if (!sa || !sb) return;
    const [x, y] = sa.index <= sb.index ? [sa, sb] : [sb, sa];
    track("zodiac_pair_pick", { pair: `${x.slug}-va-${y.slug}` });
    router.push(`/cung-hoang-dao/cap-doi/${x.slug}-va-${y.slug}`);
  };

  const select = (id: string, label: string, value: string, onChange: (v: string) => void) => (
    <div className="flex flex-1 flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select id={id} className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Chọn cung</option>
        {ZODIAC_SIGNS.map((s) => (
          <option key={s.slug} value={s.slug}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <form onSubmit={go} className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:p-6">
      {select("cung-a", "Cung của bạn", a, setA)}
      {select("cung-b", "Cung của crush", b, setB)}
      <button type="submit" className="btn-primary disabled:cursor-not-allowed disabled:opacity-50" disabled={!a || !b}>
        Xem cặp đôi
        <IconArrowRight size={18} stroke={2} aria-hidden />
      </button>
    </form>
  );
}
