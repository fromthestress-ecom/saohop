"use client";

import { IconDownload, IconHeart, IconShare } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { AiReading } from "@/components/ai-reading";
import { RadarChart, ScoreRing } from "@/components/compat-visuals";
import { draftToPerson, emptyDraft, PersonFields, type PersonDraft } from "@/components/person-fields";
import { compatibility, type FactorSystem } from "@/lib/engines/compatibility";
import { buildProfile } from "@/lib/engines/profile";
import type { PersonInput } from "@/lib/engines/types";
import { track } from "@/lib/analytics";
import { shareCardOf, shareQuery } from "@/lib/share";

const SYSTEM_LABELS: Record<FactorSystem, string> = {
  "so-chu-dao": "Số chủ đạo",
  "so-linh-hon": "Số linh hồn",
  "cung-hoang-dao": "Cung hoàng đạo",
  "con-giap": "Con giáp",
  "ngu-hanh": "Ngũ hành",
};

export function CrushClient() {
  const reduce = useReducedMotion();
  const [me, setMe] = useState<PersonDraft>(emptyDraft);
  const [crush, setCrush] = useState<PersonDraft>(emptyDraft);
  const [pair, setPair] = useState<{ a: PersonInput; b: PersonInput } | null>(null);
  const [invalid, setInvalid] = useState<{ a: boolean; b: boolean } | null>(null);
  const [copied, setCopied] = useState(false);

  const view = useMemo(() => {
    if (!pair) return null;
    const pa = buildProfile(pair.a);
    const pb = buildProfile(pair.b);
    const result = compatibility(pa, pb);
    return { result, query: shareQuery(shareCardOf(pa, pb, result)) };
  }, [pair]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const a = draftToPerson(me);
    const b = draftToPerson(crush);
    if (!a || !b) {
      setInvalid({ a: !a, b: !b });
      return;
    }
    setInvalid(null);
    setCopied(false);
    setPair({ a, b });
    track("crush_check", { score: compatibility(buildProfile(a), buildProfile(b)).overall, with_names: Boolean(a.fullName || b.fullName) });
    requestAnimationFrame(() => document.getElementById("ket-qua")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }));
  };

  const share = async () => {
    if (!view) return;
    const url = `${window.location.origin}/chia-se/crush?${view.query}`;
    const text = `Mình với crush hợp nhau ${view.result.overall}%, "${view.result.verdict}". Thử check của bạn đi!`;
    if (navigator.share) {
      track("share_result", { method: "native", score: view.result.overall });
      await navigator.share({ title: "Check crush", text, url }).catch(() => undefined);
      return;
    }
    track("share_result", { method: "copy_link", score: view.result.overall });
    await navigator.clipboard.writeText(`${text} ${url}`);
    setCopied(true);
  };

  const nameA = pair?.a.fullName?.split(/\s+/).pop() ?? "Bạn";
  const nameB = pair?.b.fullName?.split(/\s+/).pop() ?? "Crush";

  return (
    <div className="space-y-14">
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <PersonFields id="me" title="Bạn" value={me} onChange={setMe} invalid={invalid?.a} />
          <PersonFields id="crush" title="Crush" value={crush} onChange={setCrush} invalid={invalid?.b} />
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <button type="submit" className="btn-primary w-full sm:w-auto">
            Xem độ hợp
          </button>
          {invalid && (
            <p role="alert" className="text-sm font-medium text-accent">
              Chọn đủ ngày, tháng, năm sinh cho {invalid.a && invalid.b ? "cả hai người" : invalid.a ? "bạn" : "crush"} nhé.
            </p>
          )}
        </div>
      </form>

      {view && pair && (
        <motion.div
          id="ket-qua"
          key={view.query}
          className="scroll-mt-6 space-y-6"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <section className="panel grid items-center gap-8 p-6 md:grid-cols-[1fr_1.2fr] md:p-10">
            <div className="text-center">
              <p className="font-display mb-5 flex items-center justify-center gap-2 text-xl font-semibold">
                {nameA}
                <IconHeart size={20} stroke={1.5} fill="currentColor" className="text-accent" aria-label="và" />
                {nameB}
              </p>
              <ScoreRing score={view.result.overall} verdict={view.result.verdict} />
            </div>
            <RadarChart dimensions={view.result.dimensions} />
          </section>

          <section aria-labelledby="vi-sao">
            <h2 id="vi-sao" className="font-display mb-4 text-2xl font-semibold">
              Vì sao ra con số này?
            </h2>
            <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2">
              {view.result.factors.map((f) => (
                <li key={f.system} className="flex items-start justify-between gap-4 border-t border-line pt-4">
                  <div>
                    <p className="text-sm text-ink-muted">{SYSTEM_LABELS[f.system]}</p>
                    <p className="font-semibold">{f.relation}</p>
                    <p className="mt-0.5 text-sm text-ink-muted">{f.detail}</p>
                  </div>
                  <p className={`font-display shrink-0 text-3xl font-bold tabular-nums ${f.score >= 75 ? "text-accent" : ""}`}>
                    {f.score}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <AiReading endpoint="/api/compat" payload={pair} title="Sao nói gì về hai bạn" />

          <section
            className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-line p-6 md:flex-row md:items-center md:p-8"
            style={{ background: "linear-gradient(120deg, var(--nebula-2), var(--nebula-1) 55%, var(--nebula-3))" }}
          >
            <div>
              <h2 className="font-display text-2xl font-semibold">Khoe kết quả</h2>
              <p className="mt-1 text-sm text-ink-muted">Thẻ chia sẻ không có tên hay ngày sinh của ai cả.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={share} className="btn-primary btn-halo">
                <IconShare size={18} stroke={1.5} aria-hidden />
                {copied ? "Đã copy link" : "Chia sẻ"}
              </button>
              <a
                href={`/api/og/crush?${view.query}&format=story`}
                download="check-crush.png"
                className="btn-secondary"
                onClick={() => track("download_story", { score: view.result.overall })}
              >
                <IconDownload size={18} stroke={1.5} aria-hidden />
                Tải ảnh story
              </a>
            </div>
          </section>
        </motion.div>
      )}
    </div>
  );
}
