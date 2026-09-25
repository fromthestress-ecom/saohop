import type { NextConfig } from "next";
import { ZODIAC_SIGNS } from "./src/lib/engines/zodiac";

// Mỗi cặp cung chỉ có một URL chuẩn (cung đứng trước viết trước). URL ngược thứ tự chuyển hướng 301 về URL chuẩn.
const zodiacPairRedirects = ZODIAC_SIGNS.flatMap((a) =>
  ZODIAC_SIGNS.filter((b) => b.index > a.index).map((b) => ({
    source: `/cung-hoang-dao/cap-doi/${b.slug}-va-${a.slug}`,
    destination: `/cung-hoang-dao/cap-doi/${a.slug}-va-${b.slug}`,
    permanent: true,
  })),
);

const nextConfig: NextConfig = {
  async redirects() {
    return zodiacPairRedirects;
  },
};

export default nextConfig;
