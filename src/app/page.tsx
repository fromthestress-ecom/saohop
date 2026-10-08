import {
  IconArrowRight,
  IconCalculator,
  IconCards,
  IconLock,
  IconMessageCircle2,
  IconMoonStars,
  IconUserHeart,
  IconUsersGroup,
  IconYinYang,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { HeroCards } from "@/components/hero-cards";
import { HeroCheck } from "@/components/hero-check";
import { NumerologyPlayground } from "@/components/numerology-playground";
import { Reveal } from "@/components/reveal";
import { ZodiacIcon } from "@/components/zodiac-icon";
import { DIA_CHI } from "@/lib/engines/can-chi";
import { LIFE_PATH_NUMBERS } from "@/lib/engines/numerology";
import { ZODIAC_SIGNS } from "@/lib/engines/zodiac";
import { ZODIAC_PAIRS } from "@/lib/kb";
import { conGiapPairSlugsWithContent, conGiapSlugsWithContent } from "@/lib/kb/con-giap";
import { pageSeo } from "@/lib/site";

export const metadata: Metadata = pageSeo("/");

const CON_GIAP_WITH_CONTENT = new Set(conGiapSlugsWithContent());

const FLOW = [
  { icon: IconUserHeart, title: "Nhập", body: "Ngày sinh của bạn, hoặc của bạn và crush. Thêm họ tên hay giờ sinh nếu muốn xem sâu hơn." },
  { icon: IconCalculator, title: "Tính", body: "Âm lịch, can chi, số chủ đạo và lá số tử vi được tính bằng thuật toán. Không đoán, không bịa." },
  { icon: IconMessageCircle2, title: "Kể", body: "AI đọc đúng những con số đó và kể câu chuyện riêng của bạn, hoặc của hai bạn." },
];

const COMING = [
  { icon: IconUsersGroup, name: "Secret Crush" },
  { icon: IconYinYang, name: "Bát Tự" },
  { icon: IconCards, name: "Tarot tình yêu" },
  { icon: IconMoonStars, name: "Tử vi 2027 Đinh Mùi" },
];

/** Mười hai cung của lá số theo vị trí truyền thống (chỉ số địa chi); null là ô giữa. */
const TU_VI_PREVIEW_ROWS: Array<Array<number | null>> = [
  [5, 6, 7, 8],
  [4, null, null, 9],
  [3, null, null, 10],
  [2, 1, 0, 11],
];

const LOOKUPS = [
  { href: "/cung-hoang-dao", title: "Cung hoàng đạo", body: `${ZODIAC_SIGNS.length} cung, kèm bài riêng theo giới tính và tháng sinh.` },
  { href: "/cung-hoang-dao/cap-doi", title: "Cặp đôi hoàng đạo", body: `${ZODIAC_PAIRS.length} cặp, mỗi cặp một bài về điểm hợp và điểm cần dung hoà.` },
  { href: "/than-so-hoc", title: "Thần số học", body: `${LIFE_PATH_NUMBERS.length} số chủ đạo, kể cả các số bậc thầy 11, 22, 33.` },
  { href: "/con-giap", title: "Con giáp", body: "12 con giáp, tam hợp, lục hợp và tứ hành xung." },
  { href: "/con-giap/cap-doi", title: "Cặp đôi con giáp", body: `${conGiapPairSlugsWithContent().length} cặp tuổi, xem hai tuổi hợp hay xung và vì sao.` },
  { href: "/ngu-hanh", title: "Ngũ hành", body: "Kim, Mộc, Thủy, Hỏa, Thổ và mệnh nạp âm của từng năm." },
  { href: "/nam-sinh", title: "Năm sinh", body: "Tra can chi, con giáp và mệnh theo năm sinh âm lịch." },
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
            Thần số học, cung hoàng đạo, con giáp và lá số tử vi cho bạn con số, kèm lý do. Bắt đầu bằng ngày sinh của bạn, rồi check crush khi sẵn sàng.
          </p>
          <HeroCheck />
          <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold">
            <Link href="/crush" className="inline-flex items-center gap-1.5 text-accent hover:underline">
              Check độ hợp với crush
              <IconArrowRight size={16} stroke={2} aria-hidden />
            </Link>
            <Link href="/tu-vi" className="inline-flex items-center gap-1.5 text-accent hover:underline">
              Lập lá số tử vi
              <IconArrowRight size={16} stroke={2} aria-hidden />
            </Link>
          </p>
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
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Bốn hệ huyền học trong một lần xem.</h2>
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
            <ul className="mt-6 grid grid-cols-6 gap-1 text-ink-muted" aria-label="12 cung hoàng đạo">
              {ZODIAC_SIGNS.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/cung-hoang-dao/${s.slug}`}
                    title={s.name}
                    className="flex justify-center rounded-xl py-2 transition-colors duration-300 hover:bg-accent/10 hover:text-accent focus-visible:text-accent active:scale-95"
                  >
                    <ZodiacIcon slug={s.slug} size={28} />
                    <span className="sr-only">Cung {s.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.12} className="rounded-2xl p-6 md:col-span-3" style={{ background: "linear-gradient(135deg, var(--nebula-1), var(--nebula-2))" }}>
            <h3 className="font-display text-2xl font-semibold">
              <Link href="/con-giap" className="hover:text-accent">
                Con giáp
              </Link>{" "}
              và{" "}
              <Link href="/ngu-hanh" className="hover:text-accent">
                ngũ hành
              </Link>
            </h3>
            <p className="mt-2 text-ink-muted">Can chi theo âm lịch Việt Nam, mệnh nạp âm, tam hợp và tứ hành xung.</p>
            <ul className="font-display mt-6 grid grid-cols-6 gap-y-2 text-center text-lg font-semibold text-accent" aria-label="12 con giáp">
              {DIA_CHI.map((c) => (
                <li key={c.slug}>
                  {CON_GIAP_WITH_CONTENT.has(c.slug) ? (
                    <Link href={`/con-giap/${c.slug}`} title={`Tuổi ${c.name}`} className="block rounded-xl py-1 transition-colors hover:bg-accent/10 active:scale-95">
                      {c.name}
                    </Link>
                  ) : (
                    <span className="block py-1">{c.name}</span>
                  )}
                </li>
              ))}
            </ul>
            <Link href="/con-giap/cap-doi" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
              Xem độ hợp của {conGiapPairSlugsWithContent().length} cặp tuổi
              <IconArrowRight size={16} stroke={2} aria-hidden />
            </Link>
          </Reveal>

          <Reveal className="panel relative isolate grid gap-8 overflow-hidden p-6 md:col-span-6 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div className="pointer-events-none absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full" style={{ background: "radial-gradient(closest-side, var(--nebula-1), transparent)" }} aria-hidden />
            <div>
              <h3 className="font-display text-2xl font-semibold">Lá số tử vi</h3>
              <p className="mt-2 max-w-[52ch] text-ink-muted">
                An 12 cung theo giờ sinh âm lịch Việt Nam: chính tinh, tứ hóa, cục và đại hạn. Mỗi sao đều có lời giải nghĩa dễ hiểu, bấm vào
                cung nào là đọc được cung đó. Lá số tính ngay trên máy bạn.
              </p>
              <Link href="/tu-vi" className="btn-primary btn-halo mt-6">
                Lập lá số
                <IconArrowRight size={18} stroke={2} aria-hidden />
              </Link>
            </div>
            <div className="mx-auto grid w-full max-w-sm grid-cols-4 gap-1.5" aria-hidden>
              {TU_VI_PREVIEW_ROWS.flatMap((row, r) =>
                row.map((chi, c) =>
                  chi === null ? (
                    r === 1 && c === 1 ? (
                      <div key="centre" className="font-display text-gradient-brand col-span-2 row-span-2 flex items-center justify-center rounded-xl border border-line text-lg font-bold">
                        Lá số
                      </div>
                    ) : null
                  ) : (
                    <div key={chi} className="flex aspect-[4/3] items-center justify-center rounded-xl border border-line text-sm font-medium text-ink-muted">
                      {DIA_CHI[chi].name}
                    </div>
                  ),
                ),
              )}
            </div>
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

      {/* Kho tra cứu: các trang đọc miễn phí, không cần nhập gì */}
      <section>
        <Reveal>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Chỉ muốn đọc? Có sẵn, miễn phí.</h2>
          <p className="mt-4 max-w-[56ch] text-ink-muted">Mỗi trang được viết riêng, không cần nhập ngày sinh hay tạo tài khoản.</p>
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LOOKUPS.map(({ href, title, body }, i) => (
            <li key={href} className={i === LOOKUPS.length - 1 && LOOKUPS.length % 2 === 1 ? "sm:col-span-2 lg:col-span-3" : undefined}>
              <Reveal delay={(i % 3) * 0.06} className="h-full">
                <Link href={href} className="panel group flex h-full flex-col justify-between gap-6 p-6 transition-colors hover:border-accent">
                  <div>
                    <h3 className="font-display text-xl font-semibold">{title}</h3>
                    <p className="mt-2 text-ink-muted">{body}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    Xem
                    <IconArrowRight size={16} stroke={2} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Quyền riêng tư: một tuyên bố lớn */}
      <section className="max-w-3xl">
        <Reveal>
          <IconLock size={32} stroke={1.5} className="text-accent" aria-hidden />
          <h2 className="font-display mt-5 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            Crush không cần biết bạn đã check.
          </h2>
          <p className="mt-5 max-w-[60ch] text-lg text-ink-muted">
            Ngày sinh của crush chỉ dùng để tính rồi bỏ. Thẻ chia sẻ chỉ có điểm, cung và con giáp, không có tên hay ngày sinh. Lá số tử vi được tính ngay trên máy bạn, ngày giờ sinh không rời khỏi trình duyệt.
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
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/crush" className="btn-primary btn-halo">
              Check crush
              <IconArrowRight size={18} stroke={2} aria-hidden />
            </Link>
            <Link href="/tu-vi" className="btn-secondary">
              Lập lá số tử vi
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
