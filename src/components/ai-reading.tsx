"use client";

import { IconRefresh, IconSparkles } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { MarkdownLite } from "./markdown-lite";

type Status = "loading" | "streaming" | "done" | "error";

interface Props {
  endpoint: "/api/reading" | "/api/compat";
  /** Payload gửi lên; đổi payload sẽ tự động tải lại luận giải. */
  payload: unknown;
  title?: string;
}

export function AiReading({ endpoint, payload, title = "Sao luận giải cho bạn" }: Props) {
  const body = JSON.stringify(payload);
  const [attempt, setAttempt] = useState(0);
  const requestKey = `${attempt}:${body}`;
  const [state, setState] = useState<{ key: string; text: string; status: Status }>({ key: "", text: "", status: "loading" });
  // State của request cũ coi như chưa có — tránh reset đồng bộ trong effect.
  const { text, status } = state.key === requestKey ? state : { text: "", status: "loading" as Status };

  useEffect(() => {
    const abort = new AbortController();
    const update = (patch: (prev: { text: string; status: Status }) => { text: string; status: Status }) =>
      setState((prev) => ({ key: requestKey, ...patch(prev.key === requestKey ? prev : { text: "", status: "loading" }) }));

    (async () => {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          signal: abort.signal,
        });
        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? "Không tải được luận giải");
        }
        const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
        update(() => ({ text: "", status: "streaming" }));
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          update((prev) => ({ text: prev.text + value, status: "streaming" }));
        }
        update((prev) => ({ ...prev, status: "done" }));
      } catch (error) {
        if (abort.signal.aborted) return;
        update(() => ({ text: error instanceof Error ? error.message : "Không tải được luận giải", status: "error" }));
      }
    })();

    return () => abort.abort();
  }, [endpoint, body, requestKey]);

  return (
    <section className="panel p-5 sm:p-7" aria-live="polite" aria-busy={status !== "done" && status !== "error"}>
      <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-semibold">
        <IconSparkles size={20} stroke={1.5} className="text-accent" aria-hidden />
        {title}
      </h2>
      {status === "loading" && (
        <div className="max-w-[65ch] space-y-2.5" aria-label="Đang tải">
          {[92, 78, 86, 64, 80].map((w, i) => (
            <div key={i} className="shimmer h-3 rounded-full bg-surface-2" style={{ width: `${w}%` }} />
          ))}
          <p className="pt-2 text-sm text-ink-muted">Sao đang đọc số liệu của bạn...</p>
        </div>
      )}
      {status !== "loading" && (
        <div className={status === "streaming" ? "cursor-blink" : undefined}>
          <MarkdownLite text={text} />
        </div>
      )}
      {status === "error" && (
        <button type="button" onClick={() => setAttempt((n) => n + 1)} className="btn-secondary mt-5 px-4! py-2! text-sm">
          <IconRefresh size={16} stroke={1.5} aria-hidden />
          Thử lại
        </button>
      )}
    </section>
  );
}
