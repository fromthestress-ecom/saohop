import { DIMENSION_LABELS, type CompatibilityResult, type DimensionKey } from "@/lib/engines/compatibility";
import type { PersonProfile } from "@/lib/engines/profile";
import { getLifePath, getZodiac } from "@/lib/kb";

/** Tăng khi đổi prompt để cache luận giải cũ tự hết hiệu lực. */
export const PROMPT_VERSION = "v3";

/** Giữ cố định từng byte — là tiền tố được prompt-cache. Không chèn ngày giờ hay dữ liệu người dùng vào đây. */
export const SYSTEM_PROMPT = `Bạn là "Sao", người đọc huyền học của một ứng dụng Việt Nam dành cho giới trẻ. Bạn hiểu thần số học Pythagoras, chiêm tinh phương Tây, can chi, con giáp và ngũ hành.

Nguyên tắc bắt buộc:
- Phần "Kiến thức nền" là nội dung đã biên tập của ứng dụng. Dùng nó làm căn cứ cho ý nghĩa của từng cung, từng số; diễn đạt lại theo hoàn cảnh người đọc, không chép nguyên văn, không nói trái với nó.
- Mọi con số, cung, con giáp, mệnh và điểm số đã được hệ thống tính sẵn và gửi cho bạn. Chỉ diễn giải đúng những dữ liệu đó; tuyệt đối không tự tính lại, không đổi số, không thêm chỉ số không được cung cấp.
- Giọng văn ấm áp, gần gũi, hơi dí dỏm kiểu Gen Z nhưng vẫn tinh tế; xưng "mình", gọi người đọc là "bạn" (hoặc tên gọi nếu được cung cấp).
- Nói về xu hướng và tiềm năng, không phán số phận. Không tiên đoán bệnh tật, tai nạn, cái chết, ly hôn; không đưa lời khuyên tài chính, y tế hay pháp lý cụ thể.
- Khi nói về crush: tôn trọng cảm xúc và sự lựa chọn của cả hai người. Không khuyến khích đeo bám, thao túng hay vượt qua ranh giới khi người kia không sẵn lòng. Điểm thấp không có nghĩa là "không thể"; hãy chỉ ra cách vun đắp.
- Viết tiếng Việt có dấu chuẩn. Dùng Markdown đơn giản: tiêu đề mục bằng "## ", có thể in đậm bằng **...**, gạch đầu dòng bằng "- ". Không dùng bảng, không dùng emoji quá 1 cái mỗi mục.
- Không mở đầu bằng lời chào dài, không nhắc lại toàn bộ dữ liệu đầu vào, không kết bằng lời nhắc "chỉ mang tính tham khảo" (giao diện đã hiển thị).
- Không dùng dấu gạch ngang dài (— hoặc –). Muốn ngắt ý thì dùng dấu chấm, dấu phẩy hoặc dấu hai chấm.`;

/** Chỉ lấy tên gọi (chữ cuối), không gửi họ tên đầy đủ hay ngày sinh cho AI. */
export function givenNameOf(fullName?: string): string | undefined {
  const parts = fullName?.trim().split(/\s+/).filter(Boolean);
  return parts?.length ? parts[parts.length - 1] : undefined;
}

function describeProfile(p: PersonProfile, label: string, givenName?: string): string {
  const n = p.numerology;
  const lines = [
    `### ${label}${givenName ? `, tên gọi: ${givenName}` : ""}`,
    `- Số chủ đạo: ${n.lifePath}`,
    `- Số ngày sinh: ${n.birthday}; Số thái độ: ${n.attitude}; Năm cá nhân hiện tại: ${n.personalYear}`,
  ];
  if (n.name) {
    lines.push(`- Số sứ mệnh: ${n.name.expression}; Số linh hồn: ${n.name.soulUrge}; Số nhân cách: ${n.name.personality}`);
  }
  lines.push(
    `- Biểu đồ ngày sinh: mũi tên có: ${n.chart.fullArrows.join(", ") || "không"}; mũi tên trống: ${n.chart.emptyArrows.join(", ") || "không"}; số thiếu: ${n.chart.missingDigits.join(", ") || "không"}`,
    `- Cung hoàng đạo: ${p.zodiac.sign.name} (nguyên tố ${p.zodiac.sign.element}, tính chất ${p.zodiac.sign.modality})${p.zodiac.isCusp ? ", sinh sát ngày chuyển cung" : ""}`,
    `- Năm sinh âm lịch: ${p.canChi.label}, tuổi ${p.canChi.animal}, mệnh ${p.canChi.napAm} (hành ${p.canChi.element})`,
  );
  const zodiac = getZodiac(p.zodiac.sign.slug)?.entry;
  const lifePath = getLifePath(n.lifePath);
  if (zodiac || lifePath) lines.push("- Kiến thức nền:");
  if (zodiac) lines.push(`  - Cung ${p.zodiac.sign.name}: ${zodiac.summary} Khi yêu: ${zodiac.inLove}`);
  if (lifePath) lines.push(`  - Số chủ đạo ${n.lifePath} (${lifePath.title}): ${lifePath.summary} Khi yêu: ${lifePath.inLove}`);
  return lines.join("\n");
}

export function selfReadingPrompt(p: PersonProfile, currentYear: number, givenName?: string): string {
  return `Dữ liệu đã tính:
${describeProfile(p, "Người đọc", givenName)}

Viết bản luận giải NGẮN (khoảng 250-320 từ) gồm đúng 4 mục:
## Bản chất của bạn
## Khi yêu
## Điểm mạnh & điều cần lưu ý
## Năm ${currentYear} của bạn (dựa vào năm cá nhân)

Mỗi mục 2-4 câu, cụ thể, liên kết các hệ với nhau thay vì liệt kê rời rạc.`;
}

export function compatPrompt(
  a: PersonProfile,
  b: PersonProfile,
  result: CompatibilityResult,
  names: { a?: string; b?: string },
): string {
  const dims = (Object.keys(result.dimensions) as DimensionKey[])
    .map((k) => `${DIMENSION_LABELS[k]} ${result.dimensions[k]}`)
    .join(", ");
  const factors = result.factors.map((f) => `- [${f.system}] ${f.relation}: ${f.detail} => ${f.score}/100`).join("\n");
  return `Dữ liệu đã tính:
${describeProfile(a, "Người A (người đang xem)", names.a)}

${describeProfile(b, "Người B (crush)", names.b)}

### Kết quả độ hợp
- Điểm tổng: ${result.overall}/100, "${result.verdict}"
- Theo chiều: ${dims}
- Các yếu tố:
${factors}

Viết bản luận giải NGẮN (khoảng 250-320 từ) về cặp đôi này, gồm đúng 4 mục:
## Tổng quan cặp đôi
## Điều khiến hai bạn hút nhau
## Chỗ dễ va chạm
## Gợi ý để tiến gần hơn

Bám sát điểm số: điểm cao thì nhấn vào thế mạnh, điểm thấp thì nói thật nhẹ nhàng và đưa cách vun đắp. Mục cuối đưa 2-3 gợi ý cụ thể, tinh tế, tôn trọng người kia.`;
}
