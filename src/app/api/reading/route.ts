import { z } from "zod";
import { givenNameOf, selfReadingPrompt } from "@/lib/ai/prompts";
import { streamReading, textStreamResponse } from "@/lib/ai/stream";
import { isRateLimited, jsonError, personSchema } from "@/lib/api/guard";
import { buildProfile } from "@/lib/engines/profile";

export const maxDuration = 60;

const bodySchema = z.object({ person: personSchema });

export async function POST(request: Request) {
  if (isRateLimited(request)) return jsonError("Bạn xem hơi nhiều rồi, nghỉ tay vài phút nhé!", 429);

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Dữ liệu không hợp lệ", 400);

  const { person } = parsed.data;
  const currentYear = new Date().getFullYear();
  // Tính lại trên server — không tin số liệu từ client.
  const profile = buildProfile(person, currentYear);
  const prompt = selfReadingPrompt(profile, currentYear, givenNameOf(person.fullName));
  return textStreamResponse(streamReading(prompt, "fast"));
}
