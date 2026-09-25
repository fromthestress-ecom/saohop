"use client";

import { useEffect, useRef } from "react";

/**
 * Nền vũ trụ cố định sau toàn bộ trang:
 * - Tinh vân: 3 đốm gradient trôi chậm (CSS, chỉ animate transform).
 * - Sao: canvas 3 lớp chiều sâu, nhấp nháy, trôi chậm, lệch nhẹ khi cuộn (parallax).
 * - Sao băng thỉnh thoảng lướt qua (chỉ chế độ tối).
 *
 * Vòng lặp chạy ngoài React (không setState), dừng khi tab ẩn,
 * và chỉ vẽ một khung tĩnh khi người dùng bật giảm chuyển động.
 */

interface Star {
  x: number;
  y: number;
  r: number;
  depth: number; // 0.2 (xa) .. 1 (gần)
  base: number; // độ sáng gốc
  speed: number; // tốc độ nhấp nháy
  phase: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0..1
}

const DRIFT_PX_PER_SEC = 6;
const PARALLAX = 0.08;

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let starRgb = "255 255 255";
    let starAlpha = 0.9;
    let isDark = darkQuery.matches;
    let frame = 0;
    let last = performance.now();
    let nextMeteorAt = last + 3000;

    const readTheme = () => {
      const styles = getComputedStyle(document.documentElement);
      starRgb = styles.getPropertyValue("--star-rgb").trim() || "255 255 255";
      starAlpha = Number(styles.getPropertyValue("--star-alpha")) || 0.9;
      isDark = darkQuery.matches;
    };

    const seed = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(Math.round((width * height) / (isDark ? 5500 : 11000)), 380);
      stars = Array.from({ length: count }, () => {
        const depth = [0.25, 0.55, 1][Math.floor(Math.random() * 3)];
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: (Math.random() * 0.8 + 0.4) * (0.6 + depth * 0.8),
          depth,
          base: Math.random() * 0.5 + 0.35,
          speed: Math.random() * 1.6 + 0.4,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const draw = (now: number, animate: boolean) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const t = now / 1000;
      const scroll = window.scrollY;

      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        if (animate) {
          s.x -= DRIFT_PX_PER_SEC * s.depth * dt;
          if (s.x < -2) s.x = width + 2;
        }
        // Parallax theo cuộn: sao gần trôi nhiều hơn sao xa.
        let y = (s.y - scroll * PARALLAX * s.depth) % height;
        if (y < 0) y += height;

        const twinkle = animate ? 0.55 + 0.45 * Math.sin(t * s.speed + s.phase) : 0.8;
        const alpha = s.base * twinkle * starAlpha;
        ctx.fillStyle = `rgb(${starRgb} / ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // Sao gần và sáng có thêm quầng + tia chữ thập khi đang lấp lánh.
        if (s.depth === 1 && s.r > 1.1 && twinkle > 0.85) {
          const glow = alpha * 0.35;
          ctx.fillStyle = `rgb(${starRgb} / ${glow})`;
          ctx.beginPath();
          ctx.arc(s.x, y, s.r * 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = `rgb(${starRgb} / ${glow})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(s.x - s.r * 5, y);
          ctx.lineTo(s.x + s.r * 5, y);
          ctx.moveTo(s.x, y - s.r * 5);
          ctx.lineTo(s.x, y + s.r * 5);
          ctx.stroke();
        }
      }

      if (!animate || !isDark) return;

      if (now > nextMeteorAt) {
        const speed = 700 + Math.random() * 400;
        const angle = (Math.PI / 180) * (20 + Math.random() * 20);
        meteors.push({
          x: Math.random() * width * 0.8 + width * 0.2,
          y: Math.random() * height * 0.4,
          vx: -Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
        });
        nextMeteorAt = now + 4000 + Math.random() * 7000;
      }

      meteors = meteors.filter((m) => m.life > 0);
      for (const m of meteors) {
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.life -= dt * 1.1;
        const tailX = m.x - m.vx * 0.12;
        const tailY = m.y - m.vy * 0.12;
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgb(255 255 255 / ${Math.max(m.life, 0)})`);
        grad.addColorStop(1, "rgb(255 255 255 / 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }
    };

    const loop = (now: number) => {
      draw(now, true);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      last = performance.now();
      if (motionQuery.matches || document.hidden) {
        draw(last, false);
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    const onResize = () => {
      seed();
      start();
    };
    const onTheme = () => {
      readTheme();
      seed();
      start();
    };

    readTheme();
    seed();
    start();

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", start);
    motionQuery.addEventListener("change", start);
    darkQuery.addEventListener("change", onTheme);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", start);
      motionQuery.removeEventListener("change", start);
      darkQuery.removeEventListener("change", onTheme);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div
        className="nebula-a absolute -left-[15vw] -top-[20vh] h-[70vh] w-[70vw] rounded-full"
        style={{ background: "radial-gradient(closest-side, var(--nebula-2), transparent)" }}
      />
      <div
        className="nebula-b absolute -right-[20vw] top-[10vh] h-[80vh] w-[65vw] rounded-full"
        style={{ background: "radial-gradient(closest-side, var(--nebula-1), transparent)" }}
      />
      <div
        className="nebula-c absolute -bottom-[25vh] left-[20vw] h-[70vh] w-[60vw] rounded-full"
        style={{ background: "radial-gradient(closest-side, var(--nebula-3), transparent)" }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
