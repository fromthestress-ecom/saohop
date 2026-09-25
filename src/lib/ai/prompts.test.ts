import { describe, expect, it } from "vitest";
import { buildProfile } from "@/lib/engines/profile";
import { selfReadingPrompt } from "./prompts";

describe("prompt luận giải", () => {
  const profile = buildProfile({ fullName: "Trần Minh Anh", birthDate: { day: 22, month: 3, year: 2000 } }, 2026);
  const prompt = selfReadingPrompt(profile, 2026, "Anh");

  it("kèm kiến thức nền đúng cung và đúng số chủ đạo", () => {
    expect(prompt).toContain("Cung Bạch Dương: Bạch Dương là cung mở đầu");
    expect(prompt).toContain("Số chủ đạo 9 (Người lý tưởng)");
  });

  it("không gửi họ tên đầy đủ hay ngày sinh cho AI", () => {
    expect(prompt).not.toContain("Trần Minh Anh");
    expect(prompt).not.toMatch(/22\/0?3\/2000|2000-03-22/);
  });
});
