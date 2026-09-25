import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME}: huyền học và check crush`,
    short_name: SITE_NAME,
    description: "Thần số học, cung hoàng đạo, con giáp và check độ hợp với crush bằng AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#08070f",
    theme_color: "#08070f",
    lang: "vi",
    icons: [{ src: "/brand/logo-mark.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
