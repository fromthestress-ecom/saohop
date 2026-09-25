import { readFileSync } from "node:fs";
import { join } from "node:path";

// Endpoint kiểm tra sức khoẻ, dùng ở bước kiểm tra sau deploy.
// Trả về mã commit của bản đang chạy để workflow xác nhận đúng bản mới đã lên.
export const dynamic = "force-dynamic";

function currentCommit(): string {
  if (process.env.GIT_COMMIT) return process.env.GIT_COMMIT;
  try {
    // Workflow ghi file COMMIT vào gốc bản build standalone.
    return readFileSync(join(process.cwd(), "COMMIT"), "utf8").trim();
  } catch {
    return "local";
  }
}

export function GET() {
  return Response.json({ ok: true, commit: currentCommit() }, { headers: { "Cache-Control": "no-store" } });
}
