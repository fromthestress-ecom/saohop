"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useId } from "react";
import { DIMENSION_LABELS, type DimensionKey } from "@/lib/engines/compatibility";

/** Vòng điểm: vẽ dần tới điểm số để người xem cảm nhận kết quả vừa được tính. */
export function ScoreRing({ score, verdict }: { score: number; verdict: string }) {
  const reduce = useReducedMotion();
  const gradientId = useId();
  const r = 72;
  const c = 2 * Math.PI * r;
  const progress = useMotionValue(reduce ? score : 0);
  const offset = useTransform(progress, (v) => c * (1 - v / 100));
  const label = useTransform(progress, (v) => Math.round(v).toString());

  useEffect(() => {
    if (reduce) {
      progress.set(score);
      return;
    }
    const controls = animate(progress, score, { duration: 1.2, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [score, reduce, progress]);

  return (
    <div className="relative mx-auto h-52 w-52">
      <div
        className="glow-pulse absolute inset-2 rounded-full"
        style={{ background: "radial-gradient(closest-side, var(--nebula-1), var(--nebula-2) 60%, transparent)" }}
        aria-hidden
      />
      <svg viewBox="0 0 180 180" className="relative h-full w-full -rotate-90" aria-hidden>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--accent)" }} />
            <stop offset="60%" style={{ stopColor: "var(--accent-2)" }} />
            <stop offset="100%" style={{ stopColor: "var(--accent-3)" }} />
          </linearGradient>
        </defs>
        <circle cx="90" cy="90" r={r} fill="none" strokeWidth="12" className="stroke-surface-2" />
        <motion.circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          style={{ strokeDashoffset: offset }}
          stroke={`url(#${gradientId})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" aria-label={`${score}%, ${verdict}`}>
        <p className="font-display text-6xl font-bold tracking-tighter tabular-nums">
          <motion.span>{label}</motion.span>
          <span className="text-2xl text-ink-muted">%</span>
        </p>
        <p className="text-gradient-brand mt-1 text-sm font-semibold">{verdict}</p>
      </div>
    </div>
  );
}

export function RadarChart({ dimensions }: { dimensions: Record<DimensionKey, number> }) {
  const gradientId = useId();
  const keys = Object.keys(DIMENSION_LABELS) as DimensionKey[];
  const size = 280;
  const center = size / 2;
  const radius = 90;
  const point = (i: number, value: number) => {
    const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
    const r = (radius * value) / 100;
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)] as const;
  };
  const polygon = (value: (i: number) => number) => keys.map((_, i) => point(i, value(i)).join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-80" role="img" aria-label="Độ hợp theo 5 chiều">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--accent)", stopOpacity: 0.35 }} />
          <stop offset="100%" style={{ stopColor: "var(--accent-2)", stopOpacity: 0.35 }} />
        </linearGradient>
      </defs>
      {[25, 50, 75, 100].map((level) => (
        <polygon key={level} points={polygon(() => level)} fill="none" strokeWidth="1" className="stroke-line" />
      ))}
      {keys.map((_, i) => {
        const [x, y] = point(i, 100);
        return <line key={i} x1={center} y1={center} x2={x} y2={y} strokeWidth="1" className="stroke-line" />;
      })}
      <polygon
        points={polygon((i) => dimensions[keys[i]])}
        strokeWidth="2"
        strokeLinejoin="round"
        fill={`url(#${gradientId})`}
        className="stroke-accent"
      />
      {keys.map((k, i) => {
        const [x, y] = point(i, 126);
        return (
          <text key={k} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="11" className="fill-ink-muted">
            <tspan x={x} dy="-0.45em">{DIMENSION_LABELS[k]}</tspan>
            <tspan x={x} dy="1.25em" fontWeight="700" fontSize="13" className="fill-ink">
              {dimensions[k]}
            </tspan>
          </text>
        );
      })}
    </svg>
  );
}
