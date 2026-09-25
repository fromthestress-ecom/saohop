import { canChiOfLunarYear, type YearCanChi } from "./can-chi";
import { solarToLunar, type LunarDate } from "./lunar";
import { numerologyProfile, type NumerologyProfile } from "./numerology";
import type { PersonInput } from "./types";
import { sunSignOf, type ZodiacResult } from "./zodiac";

/** Toàn bộ dữ liệu huyền học đã tính của một người — đầu vào cho UI và cho AI diễn giải. */
export interface PersonProfile {
  lunarBirthDate: LunarDate;
  canChi: YearCanChi;
  zodiac: ZodiacResult;
  numerology: NumerologyProfile;
}

export function buildProfile(person: PersonInput, currentYear = new Date().getFullYear()): PersonProfile {
  const lunarBirthDate = solarToLunar(person.birthDate);
  return {
    lunarBirthDate,
    canChi: canChiOfLunarYear(lunarBirthDate.year),
    zodiac: sunSignOf(person.birthDate),
    numerology: numerologyProfile(person, currentYear),
  };
}
