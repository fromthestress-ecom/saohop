import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DIA_CHI } from "@/lib/engines/can-chi";
import { verdictOf } from "@/lib/engines/compatibility";
import { zodiacBySlug } from "@/lib/engines/zodiac";
import { parseShareCard } from "@/lib/share";
import { SITE_NAME } from "@/lib/site";

// Be Vietnam Pro (OFL). Cần cả subset latin và vietnamese để hiển thị đủ dấu.
const fontFiles = ["latin-400", "vietnamese-400", "latin-800", "vietnamese-800"];
const fontsPromise = Promise.all(
  fontFiles.map(async (f) => ({
    name: "Be Vietnam Pro",
    data: await readFile(join(process.cwd(), `assets/fonts/be-vietnam-pro-${f}-normal.woff`)),
    weight: (f.endsWith("800") ? 800 : 400) as 400 | 800,
    style: "normal" as const,
  })),
);

// Josefin Sans 600 cho chữ thương hiệu "SAO HỢP".
const brandFontsPromise = Promise.all(
  ["latin", "vietnamese"].map(async (subset) => ({
    name: "Josefin Sans",
    data: await readFile(join(process.cwd(), `assets/fonts/josefin-sans-${subset}-600-normal.woff`)),
    weight: 600 as const,
    style: "normal" as const,
  })),
);

// Logo dạng data URL (Satori vẽ được SVG không có filter, nên dùng bản gọn logo-mark).
const logoPromise = readFile(join(process.cwd(), "public/brand/logo-mark.svg")).then(
  (buf) => `data:image/svg+xml;base64,${buf.toString("base64")}`,
);

// Cùng token với chế độ tối của site.
const C = {
  bg: "#08070f",
  line: "#2c2a3b",
  ink: "#f3f1f8",
  muted: "#a7a4ba",
  accent: "#f06a94",
  accent2: "#9d8cff",
  accent3: "#f7b267",
};

// Sao cố định (toạ độ %, bán kính px) để ảnh luôn giống nhau với cùng tham số.
const STARS: Array<[number, number, number]> = [
  // Tránh vùng logo (góc trên trái), con số và các dòng chữ bên trái.
  [4, 16, 1.5], [50, 4, 1], [58, 10, 2.5], [71, 15, 1.5], [88, 7, 2], [93, 28, 1],
  [90, 46, 1.5], [96, 58, 1], [3, 67, 2], [82, 64, 1], [90, 72, 2.5], [96, 90, 1.5], [74, 95, 1],
];

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
          fontFamily: "Be Vietnam Pro",
          background: C.bg,
          backgroundImage: [
            "radial-gradient(circle at 90% 5%, rgba(157,140,255,0.45) 0%, rgba(8,7,15,0) 45%)",
            "radial-gradient(circle at 5% 60%, rgba(240,106,148,0.35) 0%, rgba(8,7,15,0) 45%)",
            "radial-gradient(circle at 70% 100%, rgba(247,178,103,0.18) 0%, rgba(8,7,15,0) 40%)",
          ].join(", "),
        }}
      >
        {STARS.map(([x, y, r]) => (
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
            fontFamily: "Josefin Sans",
            fontSize: 26 * s,
            fontWeight: 600,
            letterSpacing: 0.22 * 26 * s,
            textTransform: "uppercase",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori chỉ nhận thẻ img */}
          <img src={await logoPromise} alt="" width={58 * s} height={58 * s} />
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
              backgroundImage: `linear-gradient(100deg, ${C.accent}, ${C.accent2} 60%, ${C.accent3})`,
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
      fonts: [...(await fontsPromise), ...(await brandFontsPromise)],
      headers: { "Cache-Control": "public, max-age=86400, immutable" },
    },
  );
}
