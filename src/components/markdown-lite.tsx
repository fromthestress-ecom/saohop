import { Fragment, type ReactNode } from "react";

/** Hiển thị tập con Markdown mà AI được phép dùng (## tiêu đề, - gạch đầu dòng, **đậm**, _nghiêng_). Không dùng HTML thô. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("_") && part.endsWith("_") && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function MarkdownLite({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="ml-5 list-disc space-y-1 marker:text-accent">
        {list.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </ul>,
    );
    list = [];
  };

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      continue;
    }
    flushList();
    if (!line) continue;
    if (line.startsWith("#")) {
      blocks.push(
        <h3 key={blocks.length} className="font-display pt-3 text-lg font-semibold text-ink">
          {line.replace(/^#+\s*/, "")}
        </h3>,
      );
    } else {
      blocks.push(<p key={blocks.length}>{inline(line)}</p>);
    }
  }
  flushList();
  return <div className="max-w-[65ch] space-y-3 leading-relaxed text-ink-muted">{blocks}</div>;
}
