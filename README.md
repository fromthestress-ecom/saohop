# Sao Hợp — huyền học AI & check crush

Web xem thần số học, cung hoàng đạo, con giáp/ngũ hành và **độ hợp với crush**, luận giải bằng Claude.

## Chạy local

```bash
npm install
cp .env.example .env.local   # điền ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

Không có API key app vẫn chạy: mọi con số hiển thị đầy đủ, chỉ phần luận giải AI hiện thông báo tạm nghỉ.

## Lệnh

| Lệnh | Việc |
|---|---|
| `npm run dev` | Dev server |
| `npm test` | Unit test engine (Vitest) |
| `npm run lint` | ESLint |
| `npm run build` | Build production |

## Kiến trúc

- `src/lib/engines/` — **engine tính toán tất định** (âm lịch VN UTC+7 theo thuật toán Hồ Ngọc Đức, can chi, nạp âm, cung hoàng đạo, thần số học Pythagoras, độ hợp). Hàm thuần, có test.
- `src/lib/ai/` — prompt + streaming Claude. Nguyên tắc: **AI chỉ diễn giải số liệu do engine tính**, không tự tính. Chỉ gửi dữ liệu đã suy ra và tên gọi, không gửi ngày sinh/họ tên đầy đủ.
- `src/app/api/reading`, `src/app/api/compat` — API stream luận giải (tính lại trên server, rate limit theo IP).
- `src/app/api/og/crush` — ảnh chia sẻ 1200×630 và story 1080×1920 (`&format=story`). URL chia sẻ chỉ chứa điểm, cung, con giáp.
- Trang: `/` · `/ban-do` · `/crush` · `/chia-se/crush`.

Model mặc định: `claude-haiku-4-5` cho bản miễn phí (đổi qua `AI_MODEL_FAST`).
