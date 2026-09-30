import Image, { generateStaticParams as ogParams } from "./opengraph-image";

// Twitter/X dùng lại đúng ảnh OG của trang (không rơi về ảnh mặc định ở thư mục gốc).
export const alt = "Mệnh ngũ hành trên Sao Hợp";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const generateStaticParams = ogParams;

export default Image;
