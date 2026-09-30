/**
 * Đoạn giải thích ngắn cho phần "Vì sao ra con số này?" ở check crush.
 * Dựng trên server từ kho kiến thức rồi truyền xuống trình duyệt, chỉ gồm tóm tắt (không kèm bài dài)
 * để trang check crush vẫn nhẹ. Bài đầy đủ nằm ở các trang tra cứu được liên kết.
 */

import { lifePathContent, zodiacContent, zodiacPairsContent } from "./index";
import { conGiapContent, nguHanhContent } from "./con-giap";

export function crushGlossary() {
  return {
    lifePath: Object.fromEntries(lifePathContent.entries.map((e) => [e.number, { title: e.title, summary: e.summary }])),
    zodiac: Object.fromEntries(zodiacContent.entries.map((e) => [e.slug, e.summary])),
    aspects: zodiacPairsContent.aspects,
    zodiacElements: zodiacPairsContent.elements,
    animals: Object.fromEntries(Object.entries(conGiapContent.animals).map(([slug, a]) => [slug, a.summary])),
    chiRelations: conGiapContent.relations as Record<string, { headline: string; body: string }>,
    elements: Object.fromEntries(Object.entries(nguHanhContent.elements).map(([slug, e]) => [slug, e.summary])),
    napAm: nguHanhContent.napAm,
  };
}

export type CrushGlossary = ReturnType<typeof crushGlossary>;
