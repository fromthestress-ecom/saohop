/* eslint-disable @next/next/no-img-element -- Satori chỉ nhận thẻ img */
import { ImageResponse } from "next/og";
import type React from "react";
import { conGiapIconSvg } from "@/lib/con-giap-icons";
import { SITE_NAME } from "@/lib/site";
import { OG_BACKGROUND, OG_BRAND_FONT, OG_COLORS as C, OG_FONT, OG_GRADIENT_TEXT, OG_SIZE, OG_STARS, ogFonts, ogLogo, zodiacIconDataUrl } from "./assets";

export interface PageCardOptions {
  /** Dòng nhỏ phía trên tiêu đề, vd. "Cung hoàng đạo · 23/10 - 21/11". */
  eyebrow: string;
  /** Phần đầu tiêu đề (màu chữ thường). */
  title: string;
  /** Phần sau tiêu đề tô gradient, vd. "nữ", "tháng 1". */
  accent?: string;
  subtitle?: string;
  /** Hình bên phải: một hoặc hai biểu tượng cung, một hoặc hai chữ trong vòng tròn (tên tuổi, tên hành), hoặc một con số lớn. */
  visual:
    | { signs: string[]; caption?: string }
    | { animals: string[]; caption?: string }
    | { chars: string[]; caption?: string } | { number: string; caption?: string };
}

// Bỏ các chấm sao rơi vào vùng nhãn bên phải (ngày sinh, điểm hợp) để không đè lên chữ.
const STARS = OG_STARS.filter(([x, y]) => !(x > 65 && y > 55 && y < 80));

function Bubble({ size, children }: { size: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: 999,
        backgroundImage: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
        boxShadow: "0 20px 60px rgba(157,140,255,0.35)",
        color: "#ffffff",
        fontWeight: 800,
        fontSize: size * (size > 200 ? 0.3 : 0.28),
        letterSpacing: -1,
      }}
    >
      {children}
    </div>
  );
}

function SignBubble({ src, size }: { src: string; size: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: 999,
        backgroundImage: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
        boxShadow: "0 20px 60px rgba(157,140,255,0.35)",
      }}
    >
      <img src={src} alt="" width={size * 0.58} height={size * 0.58} />
    </div>
  );
}

const conGiapIconDataUrl = (slug: string) =>
  `data:image/svg+xml;base64,${Buffer.from(conGiapIconSvg(slug, "#ffffff") ?? "").toString("base64")}`;

/** Ảnh chia sẻ 1200x630 cho các trang tra cứu, cùng phong cách với thẻ kết quả check crush. */
export async function pageCardImage(o: PageCardOptions) {
  const [logo, fonts] = await Promise.all([ogLogo, ogFonts()]);
  const icons =
    "signs" in o.visual
      ? await Promise.all(o.visual.signs.map((s) => zodiacIconDataUrl(s)))
      : "animals" in o.visual
        ? o.visual.animals.map(conGiapIconDataUrl)
        : [];
  const chars = "chars" in o.visual ? o.visual.chars : [];
  const pair = icons.length === 2 || chars.length === 2;
  const titleSize = (o.title + (o.accent ?? "")).length > 16 ? 76 : 92;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
          color: C.ink,
          fontFamily: OG_FONT,
          background: C.bg,
          backgroundImage: OG_BACKGROUND,
        }}
      >
        {STARS.map(([x, y, r]) => (
          <div
            key={`${x}-${y}`}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: r * 2,
              height: r * 2,
              borderRadius: 999,
              background: "rgba(255,255,255,0.75)",
            }}
          />
        ))}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: OG_BRAND_FONT,
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: 5.7,
            textTransform: "uppercase",
          }}
        >
          <img src={logo} alt="" width={58} height={58} />
          {SITE_NAME}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: pair ? 600 : 680 }}>
            <div style={{ fontSize: 28, color: C.muted }}>{o.eyebrow}</div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                columnGap: 22,
                fontSize: titleSize,
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: -2,
                marginTop: 10,
              }}
            >
              <span>{o.title}</span>
              {o.accent && (
                <span style={{ backgroundImage: OG_GRADIENT_TEXT, backgroundClip: "text", color: "transparent" }}>{o.accent}</span>
              )}
            </div>
            {o.subtitle && <div style={{ fontSize: 30, color: C.muted, marginTop: 18, lineHeight: 1.35 }}>{o.subtitle}</div>}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            {"number" in o.visual ? (
              <div
                style={{
                  fontSize: o.visual.number.length > 3 ? 132 : o.visual.number.length > 2 ? 170 : o.visual.number.length > 1 ? 230 : 260,
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: -8,
                  backgroundImage: OG_GRADIENT_TEXT,
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {o.visual.number}
              </div>
            ) : chars.length > 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <Bubble size={pair ? 170 : 240}>{chars[0]}</Bubble>
                {pair && <div style={{ fontSize: 64, fontWeight: 800, color: C.accent }}>&</div>}
                {pair && <Bubble size={170}>{chars[1]}</Bubble>}
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <SignBubble src={icons[0]} size={pair ? 170 : 240} />
                {pair && <div style={{ fontSize: 64, fontWeight: 800, color: C.accent }}>&</div>}
                {pair && <SignBubble src={icons[1]} size={170} />}
              </div>
            )}
            {o.visual.caption && (
              <div
                style={{
                  display: "flex",
                  fontSize: 30,
                  fontWeight: 800,
                  padding: "8px 26px",
                  borderRadius: 999,
                  border: `2px solid ${C.line}`,
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                {o.visual.caption}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 22,
            borderTop: `2px solid ${C.line}`,
            fontSize: 24,
            color: C.muted,
          }}
        >
          <span>Thần số học · Cung hoàng đạo · Check crush</span>
          <span style={{ color: C.ink, fontWeight: 800 }}>saohop.com</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
