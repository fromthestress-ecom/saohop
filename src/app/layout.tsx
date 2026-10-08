import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Bricolage_Grotesque, Josefin_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Link from "next/link";
import Script from "next/script";
import { ConsentBanner } from "@/components/consent-banner";
import { CosmicBackground } from "@/components/cosmic-background";
import { SiteFooter } from "@/components/site-footer";
import { CONSENT_DEFAULT_SCRIPT, GA_ID } from "@/lib/analytics";
import { SITE_NAME } from "@/lib/site";
import "./globals.css";

const body = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

// Chữ thương hiệu "SAO HỢP" (in hoa, giãn chữ).
const brand = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin", "vietnamese"],
  weight: ["600"],
});

const heading = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${SITE_NAME}: check crush, thần số học, cung hoàng đạo, tử vi`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Khám phá bản thân qua thần số học, cung hoàng đạo, con giáp, ngũ hành và lá số tử vi. Xem bạn với crush hợp nhau bao nhiêu phần trăm. Miễn phí, luận giải bằng AI.",
  applicationName: SITE_NAME,
  // Ảnh chia sẻ mặc định: src/app/opengraph-image.jpg và twitter-image.jpg (1200x630).
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "vi_VN",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f3f8" },
    { media: "(prefers-color-scheme: dark)", color: "#08070f" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${body.variable} ${heading.variable} ${brand.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        {GA_ID && (
          // Consent Mode v2: khai báo mặc định trước khi Google Analytics khởi tạo.
          <Script id="ga-consent-default" strategy="beforeInteractive">
            {CONSENT_DEFAULT_SCRIPT}
          </Script>
        )}
        <CosmicBackground />
        <header className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap sm:gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG tĩnh, không cần tối ưu ảnh */}
            <img src="/brand/logo-mark.svg" alt="" width={38} height={38} className="h-[38px] w-[38px]" />
            <span className="font-brand pt-[3px] text-[14px] font-semibold uppercase tracking-[0.1em] sm:text-[17px] sm:tracking-[0.22em]">
              {SITE_NAME}
            </span>
          </Link>
          <nav className="flex items-center gap-0.5 whitespace-nowrap text-sm sm:gap-2">
            <Link href="/ban-do" className="rounded-full px-1.5 py-2 text-ink-muted transition-colors hover:text-ink sm:px-3">
              Bản đồ<span className="hidden sm:inline"> bản thân</span>
            </Link>
            <Link href="/tu-vi" className="rounded-full px-1.5 py-2 text-ink-muted transition-colors hover:text-ink sm:px-3">
              Lá số<span className="hidden sm:inline"> tử vi</span>
            </Link>
            <Link href="/crush" className="btn-primary px-3! py-2! text-sm sm:px-4!">
              Check crush
            </Link>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-20 sm:px-6">{children}</main>
        <SiteFooter />
        {GA_ID && <ConsentBanner />}
      </body>
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
