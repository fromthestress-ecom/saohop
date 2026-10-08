/** Schema dùng chung cho mọi file nội dung của kho kiến thức (src/content/*.json). */

import { z } from "zod";

export const text = z.string().trim().min(1);
export const list = z.array(text).min(2);

export const metaSchema = z.object({
  system: z.string(),
  version: z.number().int(),
  reviewed: z.boolean(),
  /** Ngày nội dung đổi lần cuối (YYYY-MM-DD). Dùng làm lastmod trong sơ đồ trang; chỉ đổi khi nội dung thật sự đổi. */
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "dạng YYYY-MM-DD"),
  note: z.string(),
});

/** Bài viết chuyên sâu: các mục có tiêu đề (đoạn văn, có thể kèm gạch đầu dòng) và hỏi đáp. */
export const deepSchema = z.object({
  sections: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/),
        heading: text,
        paragraphs: z.array(text).min(1),
        bullets: z.array(text).min(2).optional(),
      }),
    )
    .min(3)
    .refine((s) => new Set(s.map((x) => x.id)).size === s.length, "id các mục phải khác nhau"),
  faq: z.array(z.object({ q: text, a: text })).default([]),
});

export type DeepContent = z.infer<typeof deepSchema>;
