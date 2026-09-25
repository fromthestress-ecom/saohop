import { z } from "zod";
import { compatPrompt, givenNameOf } from "@/lib/ai/prompts";
import { streamReading, textStreamResponse } from "@/lib/ai/stream";
import { isRateLimited, jsonError, personSchema } from "@/lib/api/guard";
import { compatibility } from "@/lib/engines/compatibility";
import { buildProfile } from "@/lib/engines/profile";

export const maxDuration = 60;

const bodySchema = z.object({ a: personSchema, b: personSchema });

export async function POST(request: Request) {
  if (isRateLimited(request)) return jsonError("Bạn xem hơi nhiều rồi, nghỉ tay vài phút nhé!", 429);

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Dữ liệu không hợp lệ", 400);

  const { a, b } = parsed.data;
  const pa = buildProfile(a);
  const pb = buildProfile(b);
  const result = compatibility(pa, pb);
  const prompt = compatPrompt(pa, pb, result, { a: givenNameOf(a.fullName), b: givenNameOf(b.fullName) });
  return textStreamResponse(streamReading(prompt, "fast"));
}
