import { ShareCardPreview } from "./share-card-preview";

// Hai thẻ minh hoạ, dựng bằng HTML thật (không dùng ảnh PNG thu nhỏ) để chữ tiếng Việt luôn sắc nét.
// 69% là kết quả engine thật; 99% là con số minh hoạ trên cặp hợp nhất engine tìm được (điểm thật 90%).
const CARDS = [
  {
    card: { score: 69, zodiacA: "ma-ket", zodiacB: "bach-duong", chiA: "dan", chiB: "mao" },
    label: "Thẻ kết quả: Ma Kết và Bạch Dương hợp nhau 69%",
    transform: "translateX(-30%) translateY(18px) rotate(-7deg)",
  },
  {
    card: { score: 99, zodiacA: "bao-binh", zodiacB: "song-tu", chiA: "thin", chiB: "dau" },
    label: "Thẻ kết quả: Bảo Bình và Song Tử hợp nhau 99%",
    transform: "translateX(24%) translateY(-10px) rotate(5deg)",
  },
];

// Quỹ đạo: vòng tròn viền mảnh xoay chậm, mỗi vòng mang một "hành tinh" nhỏ.
const ORBITS = [
  { size: "92%", duration: "70s", planet: "h-3 w-3 bg-accent", reverse: false },
  { size: "128%", duration: "110s", planet: "h-2 w-2 bg-accent-2", reverse: true },
];

export function HeroCards() {
  return (
    <div className="relative mx-auto flex h-[420px] w-full max-w-md items-center justify-center sm:h-[540px]">
      {/* Quầng tinh vân phía sau thẻ */}
      <div
        className="glow-pulse absolute h-[80%] w-[80%] rounded-full"
        style={{ background: "radial-gradient(closest-side, var(--nebula-1), var(--nebula-2) 55%, transparent)" }}
        aria-hidden
      />
      {ORBITS.map((o) => (
        <div
          key={o.size}
          className={`orbit absolute aspect-square rounded-full border border-dashed border-line ${o.reverse ? "orbit-reverse" : ""}`}
          style={{ width: o.size, "--orbit-duration": o.duration } as React.CSSProperties}
          aria-hidden
        >
          <span className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_12px_currentColor] ${o.planet}`} />
        </div>
      ))}
      {CARDS.map(({ card, label, transform }, i) => (
        <div key={card.score} className="absolute w-[50%]" style={{ transform, zIndex: i + 1 }}>
          <div className="float" style={{ "--float-delay": `${i * -3.5}s` } as React.CSSProperties}>
            <div
              role="img"
              aria-label={label}
              className="enter-up overflow-hidden rounded-2xl border border-line shadow-2xl shadow-accent-2/20"
              style={{ "--delay": `${0.15 + i * 0.12}s` } as React.CSSProperties}
            >
              <ShareCardPreview {...card} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
