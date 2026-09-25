import "server-only";

import { z } from "zod";
import { isValidSolarDate } from "@/lib/engines/types";

export const personSchema = z.object({
  fullName: z.string().trim().max(80).optional(),
  birthDate: z
    .object({
      day: z.number().int(),
      month: z.number().int(),
      year: z.number().int(),
    })
    .refine(isValidSolarDate, "Ngày sinh không hợp lệ"),
});

// Giới hạn tốc độ đơn giản theo IP, trong bộ nhớ từng instance — đủ cho MVP.
// Khi lên production nhiều instance: chuyển sang Upstash Redis.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const hits = new Map<string, number[]>();

export function isRateLimited(request: Request): boolean {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10_000) hits.clear();
  return recent.length > MAX_REQUESTS;
}

export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}
