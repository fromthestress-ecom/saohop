// Sinh logo SVG "SH" (Sao Hợp): chữ S, nét trái tim, chữ H và ngôi sao 8 cánh.
// Chạy: node scripts/make-logo.mjs .   (ghi ra public/brand/logo.svg, public/brand/logo-mark.svg và src/app/icon.svg)
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const out = process.argv[2];

// ---- Hình học (viewBox 512 x 512) ----
const S =
  "M 232 104 C 196 70 104 70 80 122 C 58 172 104 204 158 226 C 216 250 250 288 234 336 C 218 384 140 402 88 380 C 60 368 46 336 48 298";
const HEART =
  "M 172 226 C 140 206 126 166 152 142 C 184 114 238 128 256 172 C 274 128 326 114 360 142 C 396 172 386 222 350 256 L 262 338 C 226 370 172 386 116 374";
const H_TOP = "M 304 78 L 304 110";
const H_LOW = "M 304 322 L 304 416";
const H_RIGHT = "M 440 78 L 440 416";
const H_BAR = "M 440 196 C 440 246 410 270 366 276";
const PATHS = [S, HEART, H_TOP, H_LOW, H_RIGHT, H_BAR];

// Ngôi sao 8 cánh: 4 cánh dài (dọc, ngang) xen 4 cánh ngắn (chéo).
function star(cx, cy, long, short, inner) {
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const angle = (Math.PI / 8) * i - Math.PI / 2;
    const r = i % 2 === 1 ? inner : i % 4 === 0 ? long : short;
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(1)} ${(cy + r * Math.sin(angle)).toFixed(1)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}
const STAR = star(256, 222, 52, 24, 6);

const gradients = `
    <linearGradient id="sh-body" x1="40" y1="80" x2="470" y2="420" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#8b5cf6"/>
      <stop offset="0.45" stop-color="#d946ef"/>
      <stop offset="0.75" stop-color="#a855f7"/>
      <stop offset="1" stop-color="#f0abfc"/>
    </linearGradient>
    <linearGradient id="sh-shine" x1="60" y1="420" x2="460" y2="80" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#67e8f9"/>
      <stop offset="0.5" stop-color="#fbcfe8"/>
      <stop offset="1" stop-color="#a5f3fc"/>
    </linearGradient>
    <radialGradient id="sh-star" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.35" stop-color="#f5d0fe"/>
      <stop offset="1" stop-color="#c084fc"/>
    </radialGradient>`;

const strokes = (width, stroke, extra = "") =>
  PATHS.map((d) => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="butt" stroke-linejoin="round"${extra}/>`).join("\n    ");

// Bản đầy đủ: glow neon + thân gradient + vệt sáng.
const full = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="sh-title">
  <title id="sh-title">Sao Hợp</title>
  <defs>${gradients}
    <filter id="sh-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12"/>
    </filter>
    <filter id="sh-star-glow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="6"/>
    </filter>
  </defs>
  <g opacity="0.75" filter="url(#sh-glow)">
    ${strokes(38, "#c026d3")}
  </g>
  <g>
    ${strokes(34, "url(#sh-body)")}
  </g>
  <g opacity="0.85">
    ${strokes(8, "url(#sh-shine)")}
  </g>
  <circle cx="256" cy="222" r="28" fill="#e879f9" opacity="0.6" filter="url(#sh-star-glow)"/>
  <path d="${STAR}" fill="url(#sh-star)" stroke="#a855f7" stroke-width="2" stroke-linejoin="round"/>
</svg>
`;

// Bản gọn cho favicon / kích thước nhỏ: không glow, nét dày hơn.
const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>${gradients}
  </defs>
  <g>
    ${strokes(40, "url(#sh-body)")}
  </g>
  <g opacity="0.8">
    ${strokes(10, "url(#sh-shine)")}
  </g>
  <path d="${star(256, 222, 56, 26, 8)}" fill="url(#sh-star)" stroke="#a855f7" stroke-width="2" stroke-linejoin="round"/>
</svg>
`;

mkdirSync(join(out, "public/brand"), { recursive: true });
writeFileSync(join(out, "public/brand/logo.svg"), full);
writeFileSync(join(out, "public/brand/logo-mark.svg"), mark);
writeFileSync(join(out, "src/app/icon.svg"), mark);
console.log("ok");
