/**
 * Thẻ chia sẻ kết quả crush. URL chỉ chứa dữ liệu đã suy ra (điểm, cung, con giáp) —
 * không bao giờ chứa tên hay ngày sinh.
 */

import { DIA_CHI } from "./engines/can-chi";
import type { CompatibilityResult } from "./engines/compatibility";
import type { PersonProfile } from "./engines/profile";
import { ZODIAC_SIGNS } from "./engines/zodiac";

export interface ShareCard {
  score: number;
  zodiacA: string;
  zodiacB: string;
  chiA: string;
  chiB: string;
}

export function shareCardOf(a: PersonProfile, b: PersonProfile, result: CompatibilityResult): ShareCard {
  return {
    score: result.overall,
    zodiacA: a.zodiac.sign.slug,
    zodiacB: b.zodiac.sign.slug,
    chiA: a.canChi.animalSlug,
    chiB: b.canChi.animalSlug,
  };
}

export function shareQuery(card: ShareCard): string {
  return new URLSearchParams({
    s: String(card.score),
    za: card.zodiacA,
    zb: card.zodiacB,
    ca: card.chiA,
    cb: card.chiB,
  }).toString();
}

const zodiacSlugs = new Set(ZODIAC_SIGNS.map((z) => z.slug));
const chiSlugs = new Set<string>(DIA_CHI.map((c) => c.slug));

type Params = Record<string, string | string[] | undefined> | URLSearchParams;

export function parseShareCard(params: Params): ShareCard | null {
  const get = (k: string) => {
    const v = params instanceof URLSearchParams ? params.get(k) : params[k];
    return typeof v === "string" ? v : undefined;
  };
  const score = Number(get("s"));
  const card = { score, zodiacA: get("za") ?? "", zodiacB: get("zb") ?? "", chiA: get("ca") ?? "", chiB: get("cb") ?? "" };
  const valid =
    Number.isInteger(score) &&
    score >= 0 &&
    score <= 100 &&
    zodiacSlugs.has(card.zodiacA) &&
    zodiacSlugs.has(card.zodiacB) &&
    chiSlugs.has(card.chiA) &&
    chiSlugs.has(card.chiB);
  return valid ? card : null;
}
