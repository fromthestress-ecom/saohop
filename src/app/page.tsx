import {
  IconArrowRight,
  IconCalculator,
  IconCards,
  IconLock,
  IconMessageCircle2,
  IconMoonStars,
  IconUserHeart,
  IconYinYang,
} from "@tabler/icons-react";
import Link from "next/link";
import { HeroCards } from "@/components/hero-cards";
import { NumerologyPlayground } from "@/components/numerology-playground";
import { Reveal } from "@/components/reveal";
import { ZodiacIcon } from "@/components/zodiac-icon";
import { DIA_CHI } from "@/lib/engines/can-chi";
import { ZODIAC_SIGNS } from "@/lib/engines/zodiac";

const FLOW = [
  { icon: IconUserHeart, title: "Nhập", body: "Ngày sinh của bạn và crush. Thêm họ tên nếu muốn xem sâu hơn." },
  { icon: IconCalculator, title: "Tính", body: "Âm lịch, can chi, số chủ đạo được tính bằng thuật toán. Không đoán, không bịa." },
  { icon: IconMessageCircle2, title: "Kể", body: "AI đọc đúng những con số đó và kể câu chuyện riêng của hai bạn." },
];

const COMING = [
  { icon: IconMoonStars, name: "Tử vi Đông phương" },
  { icon: IconYinYang, name: "Bát Tự" },
  { icon: IconCards, name: "Tarot tình yêu" },
];

export default function Home() {
  return (
    <div className="space-y-24 md:space-y-32">
      {/* Hero: chia đôi bất đối xứng */}
      <section className="grid items-center gap-8 pt-8 md:grid-cols-[1.1fr_1fr] md:pt-16">
        <div className="enter-up">
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tighter md:text-5xl lg:text-6xl">
            Bạn và crush hợp nhau bao nhiêu <span className="text-gradient-brand whitespace-nowrap">phần trăm?</span>
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-muted">
            Nhập hai ngày sinh. Thần số học, cung hoàng đạo và con giáp cho bạn con số, kèm lý do.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/crush" className="btn-primary btn-halo">
              Check crush
              <IconArrowRight size={18} stroke={2} aria-hidden />
            </Link>
            <Link href="/ban-do" className="btn-secondary">
              Xem bản đồ bản thân
            </Link>
          </div>
        </div>
        <HeroCards />
      </section>

      {/* Cách hoạt động: tiêu đề dính bên trái, các bước xếp dọc bên phải */}
      <section className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <div className="md:sticky md:top-24 md:self-start">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Máy tính trước, AI kể sau.</h2>
          <p className="mt-4 max-w-[40ch] text-ink-muted">
            Con số đến từ thuật toán có kiểm thử. AI chỉ được phép diễn giải, không được tự tính.
          </p>
        </div>
        <ol className="space-y-10">
          {FLOW.map(({ icon: Icon, title, body }, i) => (
            <li key={title}>
              <Reveal delay={i * 0.06} className="flex gap-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Icon size={24} stroke={1.5} aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold">{title}</h3>
                  <p className="mt-1 max-w-[50ch] text-ink-muted">{body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Các hệ huyền học: bento 4 ô */}
      <section>
        <Reveal>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Ba hệ huyền học trong một lần xem.</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-6 md:grid-rows-[auto_auto_auto]">
          <Reveal className="panel relative isolate flex flex-col justify-between gap-8 overflow-hidden p-6 md:col-span-3 md:row-span-2">
            <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full" style={{ background: "radial-gradient(closest-side, var(--nebula-2), transparent)" }} aria-hidden />
            <div>
              <h3 className="font-display text-2xl font-semibold">Thần số học</h3>
              <p className="mt-2 max-w-[40ch] text-ink-muted">
                Số chủ đạo, biểu đồ ngày sinh, các mũi tên và chỉ số theo tên theo trường phái Pythagoras.
              </p>
            </div>
            <NumerologyPlayground />
          </Reveal>

          <Reveal delay={0.06} className="panel p-6 md:col-span-3">
            <h3 className="font-display text-2xl font-semibold">Cung hoàng đạo</h3>
            <p className="mt-2 text-ink-muted">Nguyên tố, tính chất và góc hợp giữa hai cung.</p>
            <ul className="mt-6 grid grid-cols-6 gap-3 text-ink-muted" aria-label="12 cung hoàng đạo">
              {ZODIAC_SIGNS.map((s) => (
                <li key={s.slug} title={s.name} className="flex justify-center transition-colors duration-300 hover:text-accent">
                  <ZodiacIcon slug={s.slug} size={28} />
                  <span className="sr-only">{s.name}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.12} className="rounded-2xl p-6 md:col-span-3" style={{ background: "linear-gradient(135deg, var(--nebula-1), var(--nebula-2))" }}>
            <h3 className="font-display text-2xl font-semibold">Con giáp và ngũ hành</h3>
            <p className="mt-2 text-ink-muted">Can chi theo âm lịch Việt Nam, mệnh nạp âm, tam hợp và tứ hành xung.</p>
            <ul className="font-display mt-6 grid grid-cols-6 gap-y-2 text-center text-lg font-semibold text-accent">
              {DIA_CHI.map((c) => (
                <li key={c.slug}>{c.name}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.06} className="panel flex flex-col gap-5 p-6 md:col-span-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-display text-2xl font-semibold">Sắp có thêm</h3>
              <p className="mt-1 text-ink-muted">Ra mắt dần trước Tết Đinh Mùi 2027.</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {COMING.map(({ icon: Icon, name }) => (
                <li key={name} className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm">
                  <Icon size={18} stroke={1.5} className="text-accent" aria-hidden />
                  {name}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Quyền riêng tư: một tuyên bố lớn */}
      <section className="max-w-3xl">
        <Reveal>
          <IconLock size={32} stroke={1.5} className="text-accent" aria-hidden />
          <h2 className="font-display mt-5 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            Crush không cần biết bạn đã check.
          </h2>
          <p className="mt-5 max-w-[60ch] text-lg text-ink-muted">
            Ngày sinh của crush chỉ dùng để tính rồi bỏ. Thẻ chia sẻ chỉ có điểm, cung và con giáp, không có tên hay ngày sinh.
          </p>
        </Reveal>
      </section>

      {/* Lời mời cuối trang */}
      <section>
        <Reveal
          className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl border border-line p-8 md:flex-row md:items-center md:p-12"
          style={{ background: "linear-gradient(120deg, var(--nebula-2), var(--nebula-1) 50%, var(--nebula-3))" }}
        >
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
            Đến lượt <span className="text-gradient-brand">bạn.</span>
          </h2>
          <Link href="/crush" className="btn-primary btn-halo">
            Check crush
            <IconArrowRight size={18} stroke={2} aria-hidden />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
