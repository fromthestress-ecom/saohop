"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { AiReading } from "@/components/ai-reading";
import { draftToPerson, emptyDraft, PersonFields, type PersonDraft } from "@/components/person-fields";
import { CanChiCard, NumerologyCard, ZodiacCard } from "@/components/profile-cards";
import { buildProfile } from "@/lib/engines/profile";
import type { PersonInput } from "@/lib/engines/types";
import { track } from "@/lib/analytics";

export function BanDoClient() {
  const reduce = useReducedMotion();
  const [draft, setDraft] = useState<PersonDraft>(emptyDraft);
  const [submitted, setSubmitted] = useState<PersonInput | null>(null);
  const [invalid, setInvalid] = useState(false);

  const profile = useMemo(() => (submitted ? buildProfile(submitted) : null), [submitted]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const person = draftToPerson(draft);
    setInvalid(!person);
    if (person) {
      setSubmitted(person);
      track("ban_do_view", { with_name: Boolean(person.fullName) });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-start">
      <form onSubmit={onSubmit} noValidate className="space-y-4 lg:sticky lg:top-6">
        <PersonFields
          id="me"
          title="Thông tin của bạn"
          value={draft}
          onChange={setDraft}
          invalid={invalid}
          nameHint="Nhập họ tên đầy đủ để xem thêm số sứ mệnh, linh hồn và nhân cách."
        />
        {invalid && (
          <p role="alert" className="text-sm font-medium text-accent">
            Chọn đủ ngày, tháng, năm sinh nhé.
          </p>
        )}
        <button type="submit" className="btn-primary w-full">
          Xem bản đồ
        </button>
      </form>

      {profile && submitted ? (
        <motion.div
          key={JSON.stringify(submitted)}
          className="space-y-4"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <NumerologyCard profile={profile} />
          <div className="grid gap-4 md:grid-cols-2">
            <ZodiacCard profile={profile} />
            <CanChiCard profile={profile} />
          </div>
          <AiReading endpoint="/api/reading" payload={{ person: submitted }} />
        </motion.div>
      ) : (
        <div className="flex min-h-64 flex-col justify-center rounded-2xl border border-dashed border-line p-8">
          <p className="font-display text-xl font-semibold">Bản đồ của bạn sẽ hiện ở đây.</p>
          <p className="mt-2 max-w-[48ch] text-ink-muted">
            Chọn ngày sinh để xem số chủ đạo, cung hoàng đạo, con giáp và mệnh của bạn.
          </p>
        </div>
      )}
    </div>
  );
}
