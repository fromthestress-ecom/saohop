import {
  IconZodiacAquarius,
  IconZodiacAries,
  IconZodiacCancer,
  IconZodiacCapricorn,
  IconZodiacGemini,
  IconZodiacLeo,
  IconZodiacLibra,
  IconZodiacPisces,
  IconZodiacSagittarius,
  IconZodiacScorpio,
  IconZodiacTaurus,
  IconZodiacVirgo,
  type Icon,
} from "@tabler/icons-react";

const ICONS: Record<string, Icon> = {
  "bach-duong": IconZodiacAries,
  "kim-nguu": IconZodiacTaurus,
  "song-tu": IconZodiacGemini,
  "cu-giai": IconZodiacCancer,
  "su-tu": IconZodiacLeo,
  "xu-nu": IconZodiacVirgo,
  "thien-binh": IconZodiacLibra,
  "bo-cap": IconZodiacScorpio,
  "nhan-ma": IconZodiacSagittarius,
  "ma-ket": IconZodiacCapricorn,
  "bao-binh": IconZodiacAquarius,
  "song-ngu": IconZodiacPisces,
};

export function ZodiacIcon({ slug, size = 24, className }: { slug: string; size?: number; className?: string }) {
  const Glyph = ICONS[slug];
  return Glyph ? <Glyph size={size} stroke={1.5} className={className} aria-hidden /> : null;
}
