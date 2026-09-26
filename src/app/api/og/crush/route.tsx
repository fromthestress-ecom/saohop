import { ImageResponse } from "next/og";
import { DIA_CHI } from "@/lib/engines/can-chi";
import { verdictOf } from "@/lib/engines/compatibility";
import { zodiacBySlug } from "@/lib/engines/zodiac";
import { parseShareCard } from "@/lib/share";
import { OG_BACKGROUND, OG_BRAND_FONT, OG_COLORS as C, OG_FONT, OG_GRADIENT_TEXT, OG_STARS, ogFonts, ogLogo } from "@/lib/og/assets";
import { SITE_NAME } from "@/lib/site";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const card = parseShareCard(params);
  if (!card) return new Response("Thẻ không hợp lệ", { status: 400 });

  const story = params.get("format") === "story";
  const [width, height] = story ? [1080, 1920] : [1200, 630];
  const s = story ? 1.6 : 1;
  const za = zodiacBySlug(card.zodiacA)!;
  const zb = zodiacBySlug(card.zodiacB)!;
  const chiName = (slug: string) => DIA_CHI.find((c) => c.slug === slug)!.name;

  const Pair = ({ label, a, b }: { label: string; a: string; b: string }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 * s }}>
      <div style={{ fontSize: 22 * s, color: C.muted }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 * s, fontSize: 38 * s, fontWeight: 800 }}>
        <span>{a}</span>
        <span style={{ color: C.accent }}>&</span>
        <span>{b}</span>
      </div>
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: `${64 * s}px ${72 * s}px`,
          color: C.ink,
          fontFamily: OG_FONT,
          background: C.bg,
          backgroundImage: OG_BACKGROUND,
        }}
      >
        {OG_STARS.map(([x, y, r]) => (
          <div
            key={`${x}-${y}`}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: r * 2 * s,
              height: r * 2 * s,
              borderRadius: 999,
              background: "rgba(255,255,255,0.75)",
            }}
          />
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16 * s,
            fontFamily: OG_BRAND_FONT,
            fontSize: 26 * s,
            fontWeight: 600,
            letterSpacing: 0.22 * 26 * s,
            textTransform: "uppercase",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori chỉ nhận thẻ img */}
          <img src={await ogLogo} alt="" width={58 * s} height={58 * s} />
          {SITE_NAME}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30 * s, color: C.muted }}>Độ hợp của hai bạn</div>
          <div
            style={{
              fontSize: (story ? 220 : 190) * s,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -6 * s,
              backgroundImage: OG_GRADIENT_TEXT,
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {`${card.score}%`}
          </div>
          <div style={{ fontSize: 52 * s, fontWeight: 800, marginTop: 8 * s }}>{verdictOf(card.score)}</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: story ? "column" : "row",
            gap: (story ? 40 : 72) * s,
            paddingTop: 28 * s,
            borderTop: `2px solid ${C.line}`,
          }}
        >
          <Pair label="Cung hoàng đạo" a={za.name} b={zb.name} />
          <Pair label="Con giáp" a={`Tuổi ${chiName(card.chiA)}`} b={`Tuổi ${chiName(card.chiB)}`} />
        </div>
      </div>
    ),
    {
      width,
      height,
      fonts: await ogFonts(),
      headers: { "Cache-Control": "public, max-age=86400, immutable" },
    },
  );
}
