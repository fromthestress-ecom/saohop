import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { createHash } from "node:crypto";
import { PROMPT_VERSION, SYSTEM_PROMPT } from "./prompts";

/**
 * Hai tầng model, đổi được qua biến môi trường:
 * - fast: bản luận giải miễn phí (ngắn, rẻ).
 * - deep: luận giải trả phí / chat (Release 0.2+).
 */
export const AI_MODELS = {
  fast: process.env.AI_MODEL_FAST ?? "claude-haiku-4-5",
  deep: process.env.AI_MODEL_DEEP ?? "claude-opus-5",
} as const;

export type AiTier = keyof typeof AI_MODELS;

const FALLBACK_MESSAGE =
  "## Sao đang nghỉ một chút\nPhần luận giải AI tạm thời chưa sẵn sàng. Các con số phía trên vẫn chính xác. Bạn thử tải lại sau ít phút nhé.";

// Cache luận giải trong bộ nhớ (theo instance). Release 0.2 chuyển sang bảng `readings` trên Supabase.
const MAX_CACHE_ENTRIES = 1000;
const readingCache = new Map<string, string>();

function cacheKey(model: string, prompt: string) {
  return createHash("sha256").update(`${PROMPT_VERSION}\n${model}\n${SYSTEM_PROMPT}\n${prompt}`).digest("hex");
}

function remember(key: string, text: string) {
  if (readingCache.size >= MAX_CACHE_ENTRIES) {
    const oldest = readingCache.keys().next().value;
    if (oldest) readingCache.delete(oldest);
  }
  readingCache.set(key, text);
}

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic());

/** Stream luận giải dạng text thuần (UTF-8). Lỗi API không làm vỡ trang — trả về thông báo thân thiện. */
export function streamReading(prompt: string, tier: AiTier = "fast"): ReadableStream<Uint8Array> {
  const model = AI_MODELS[tier];
  const key = cacheKey(model, prompt);
  const encoder = new TextEncoder();
  const abort = new AbortController();

  return new ReadableStream({
    async start(controller) {
      const cached = readingCache.get(key);
      if (cached) {
        controller.enqueue(encoder.encode(cached));
        controller.close();
        return;
      }

      let full = "";
      try {
        const stream = getClient().messages.stream(
          {
            model,
            max_tokens: 2000, // bản ngắn ~300 từ; giới hạn có chủ đích để kiểm soát chi phí
            system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
            messages: [{ role: "user", content: prompt }],
          },
          { signal: abort.signal },
        );
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            full += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "end_turn") remember(key, full);
      } catch (error) {
        if (abort.signal.aborted) return;
        if (error instanceof Anthropic.AuthenticationError) {
          console.error("[ai] Thiếu hoặc sai ANTHROPIC_API_KEY");
        } else if (error instanceof Anthropic.RateLimitError) {
          console.error("[ai] Bị giới hạn tốc độ từ Anthropic");
        } else if (error instanceof Anthropic.APIError) {
          console.error(`[ai] Lỗi API ${error.status}:`, error.message);
        } else if (error instanceof Anthropic.AnthropicError) {
          console.error("[ai] Chưa cấu hình được Claude API (kiểm tra ANTHROPIC_API_KEY trong .env.local):", error.message);
        } else {
          console.error("[ai] Lỗi không xác định:", error);
        }
        controller.enqueue(encoder.encode(full ? "\n\n_(Luận giải bị gián đoạn, bạn thử tải lại nhé.)_" : FALLBACK_MESSAGE));
      }
      controller.close();
    },
    cancel() {
      abort.abort();
    },
  });
}

export function textStreamResponse(stream: ReadableStream<Uint8Array>) {
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
