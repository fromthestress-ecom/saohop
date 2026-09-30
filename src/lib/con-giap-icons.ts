/**
 * Biểu tượng 12 con giáp, vẽ riêng cho Sao Hợp theo cùng lưới và nét với Tabler Icons
 * (24x24, nét 1.5, đầu nét bo tròn) để đứng cạnh biểu tượng cung hoàng đạo không bị lệch.
 * Mỗi biểu tượng là phần bên trong thẻ <svg>, dùng chung cho trang web và ảnh chia sẻ.
 */

const eye = (x: number, y: number, r = 0.9) => `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" stroke="none"/>`;
const eyes = (y: number, dx = 2.4, r?: number) => eye(12 - dx, y, r) + eye(12 + dx, y, r);

export const CON_GIAP_ICONS: Record<string, string> = {
  // Chuột: tai tròn to, mõm nhọn, ria
  ty:
    `<path d="M7 11C7 8 9.5 7 12 7s5 1 5 4c0 3-3 7-5 9c-2-2-5-6-5-9z"/>` +
    `<path d="M7.05 10.3A3.2 3.2 0 1 1 9.4 7.45"/><path d="M16.95 10.3A3.2 3.2 0 1 0 14.6 7.45"/>` +
    eyes(11.8, 2) +
    eye(12, 18.6, 0.8) +
    `<path d="M9.6 15.6l-4.4-.8M9.8 17l-4.2 1.2M14.4 15.6l4.4-.8M14.2 17l4.2 1.2"/>`,
  // Trâu: cặp sừng cong lớn, mõm rộng
  suu:
    `<path d="M9 8.5C6 9 3 7.8 3.5 3.5C4.5 6.5 6.5 7.3 9 7.3"/><path d="M15 8.5C18 9 21 7.8 20.5 3.5C19.5 6.5 17.5 7.3 15 7.3"/>` +
    `<path d="M8.5 8.2c2.3-.6 4.7-.6 7 0l-.3 6.5"/><path d="M8.5 8.2l.3 6.5"/>` +
    `<path d="M8.4 10.2L5.5 11l3 1"/><path d="M15.6 10.2l2.9.8l-3 1"/>` +
    `<ellipse cx="12" cy="17.3" rx="4" ry="2.8"/>` +
    eyes(11.3, 1.8) +
    eye(10.5, 17.3, 0.7) +
    eye(13.5, 17.3, 0.7),
  // Hổ: mặt tròn, tai tròn nhỏ, vằn trên trán và má
  dan:
    `<path d="M8.59 5.77A8 8 0 1 1 5.01 9.11"/>` +
    `<path d="M5.01 9.11A2.6 2.6 0 1 1 8.59 5.77"/><path d="M18.99 9.11A2.6 2.6 0 1 0 15.41 5.77"/>` +
    `<path d="M12 6v2.3M10 6.6l.6 1.6M14 6.6l-.6 1.6"/>` +
    `<path d="M4.3 12.2l2.6.6M4.3 15l2.6-.4M19.7 12.2l-2.6.6M19.7 15l-2.6-.4"/>` +
    eyes(11.3) +
    `<path d="M11 14.3h2l-1 1.1z" fill="currentColor"/>` +
    `<path d="M12 15.4v1.2M12 16.6c-.6.9-1.7 1-2.4.3M12 16.6c.6.9 1.7 1 2.4.3"/>`,
  // Mèo: tai nhọn, ria dài
  mao:
    `<path d="M5 4l4 3.5c2-.6 4-.6 6 0L19 4l.5 7c1 2 .5 6-2.5 8c-3 2-7 2-10 0c-3-2-3.5-6-2.5-8z"/>` +
    eyes(11.8) +
    `<path d="M11.2 14.3h1.6l-.8.9z" fill="currentColor"/>` +
    `<path d="M12 15.2v.8M12 16c-.5.7-1.3.8-1.9.3M12 16c.5.7 1.3.8 1.9.3"/>` +
    `<path d="M8.6 14.6l-6-.8M8.8 16l-5.6 1.2M15.4 14.6l6-.8M15.2 16l5.6 1.2"/>`,
  // Rồng: đầu nghiêng, miệng há, sừng vuốt ra sau, bờm gai, ria cuộn
  thin:
    `<path d="M3.5 9c0-1.2 1-1.7 2.5-1.7H9c1 0 1.5-1.8 3.5-2c2.5-.3 4.3 .7 5 2.2l3-.5l-1.7 2.3l2.2 1.2l-2.4 1.1l1.6 2.4l-2.7-.2c-.5 2-2 3.2-4 3.2c-2.5 0-4-1.5-5-3L4.5 13.2l4.3-1.9l-5.3-1.1z"/>` +
    `<path d="M12.8 5.3c1.2-2.5 4-3.3 6.7-3c-2 .9-3.2 2-3.7 3.2"/>` +
    eye(11.8, 8.3) +
    eye(4.9, 8.6, 0.55) +
    `<path d="M5.5 7.3c0-2.2-1.5-3.1-2.7-2.4"/>` +
    `<path d="M9 15c-.5 3-2.5 4.5-5 5"/>`,
  // Rắn: đầu ngẩng, thân uốn khúc, lưỡi chẻ
  "ty-ran":
    `<path d="M12.3 7.6c-1.3-1.1-1.1-3.4 1.2-3.8c2-.4 4.1 .6 5.1 2.2c-1.2 1.2-3.3 1.8-5 1.9"/>` +
    eye(14.6, 5.4, 0.75) +
    `<path d="M18.6 6l2 .6M20.6 6.6l.8-.9M20.6 6.6l.5 1.1"/>` +
    `<path d="M12.3 7.6c-1.4 2 0 2.9 2.7 2.9c3.5 0 4 4 .5 4h-7c-3.5 0-3.5 4.5 0 4.5H19"/>`,
  // Ngựa: đầu nghiêng, bờm
  ngo:
    `<path d="M18 21l-1-8c0-3-.5-5-1.5-6.5L16 3l-2.2 2.2C12 5 10 6 8.5 8l-4 5.5c-.5 1 0 2.5 1.3 2.5c1.2 0 2.2-.5 3.2-1.5l2-.7c0 2.7-1 5.2-2 7.2"/>` +
    `<path d="M16 6.3c2.2 1.4 3.6 3.6 4 6.2l-1.3-.5l1.3 3.5l-2-.6"/>` +
    eye(12.5, 8.7) +
    eye(6.5, 13.2, 0.7),
  // Dê: sừng cong ra sau, tai ngang, chòm râu
  mui:
    `<path d="M9 8c0-1 1-1.5 3-1.5s3 .5 3 1.5l-.5 7c0 1.8-1.1 3-2.5 3s-2.5-1.2-2.5-3z"/>` +
    `<path d="M10 6.8C9 3.3 5.5 3 5 6.5M14 6.8c1-3.5 4.5-3.8 5-.3"/>` +
    `<path d="M9.2 9.5L5 11l4.3.5M14.8 9.5L19 11l-4.3.5"/>` +
    `<path d="M11 17.8l1 3.7l1-3.7"/>` +
    eyes(11, 1.7) +
    eye(11, 15.6, 0.6) +
    eye(13, 15.6, 0.6),
  // Khỉ: tai tròn hai bên, mặt hình tim, chỏm lông
  than:
    `<circle cx="12" cy="12.5" r="7"/>` +
    `<path d="M5.41 10.15A2.6 2.6 0 1 0 5.41 14.85M18.59 10.15A2.6 2.6 0 1 1 18.59 14.85"/>` +
    `<path d="M12 9.2c-1.5-1.5-4.5-1-4.5 2c0 2 1 3 1.5 4c.5 2.5 1.5 3.8 3 3.8s2.5-1.3 3-3.8c.5-1 1.5-2 1.5-4c0-3-3-3.5-4.5-2z"/>` +
    `<path d="M10.5 5.7c.6-1.2 1.6-1.6 2.6-1.1"/>` +
    eyes(11.6, 1.8) +
    eye(11.3, 14.8, 0.55) +
    eye(12.7, 14.8, 0.55) +
    `<path d="M10.6 16.8c.9.7 1.9.7 2.8 0"/>`,
  // Gà: mào ba múi, mỏ, yếm
  dau:
    `<path d="M9 7C8.5 5 10 4 11 5.5c.2-2 2.2-2.3 2.8-.2c.7-1.3 2.7-.8 2.2 1.5"/>` +
    `<path d="M9 7.5c1-.7 5-1 7 0c1.5 1 1.5 3.5 1 5.5c-.5 2 0 4.5 2 8H9c1.5-3 1.5-5.5.5-8"/>` +
    `<path d="M9 9L5.5 10.3l3.3 1.2"/>` +
    `<path d="M8.8 11.5c-1.3 2 .2 3.5 1.2 1.7"/>` +
    eye(12.2, 9.4) +
    `<path d="M12.5 15.5c1 .8 2.5 1 3.8.6M12 18c1.2.8 3 1 4.8.5"/>`,
  // Chó: tai cụp hai bên, mũi to
  tuat:
    `<path d="M7.5 7c1.5-1.5 7.5-1.5 9 0c1.5 2 1 7 0 9c-1 2.5-2.5 3.5-4.5 3.5s-3.5-1-4.5-3.5c-1-2-1.5-7 0-9z"/>` +
    `<path d="M7.6 6.9C5 6 3 8.5 3.5 12.3c.3 1.8 2 2.3 3 .8l.8-2.6M16.4 6.9C19 6 21 8.5 20.5 12.3c-.3 1.8-2 2.3-3 .8l-.8-2.6"/>` +
    eyes(10.8, 2) +
    `<ellipse cx="12" cy="14.3" rx="1.4" ry="1" fill="currentColor" stroke="none"/>` +
    `<path d="M12 15.3v1M12 16.3c-.6.8-1.6.9-2.3.4M12 16.3c.6.8 1.6.9 2.3.4"/>`,
  // Lợn: tai tam giác, mõm tròn hai lỗ mũi
  hoi:
    `<path d="M9.8 5.8A7.5 7.5 0 1 0 14.2 5.8"/>` +
    `<path d="M9.8 5.8c1.4-.4 3-.4 4.4 0"/>` +
    `<path d="M6.3 8.2L5 3.5l4.8 2.3M17.7 8.2L19 3.5l-4.8 2.3"/>` +
    `<ellipse cx="12" cy="15" rx="3" ry="2.2"/>` +
    eye(11, 15, 0.6) +
    eye(13, 15, 0.6) +
    eyes(11, 2.8),
};

/** SVG hoàn chỉnh của một con giáp (màu nét và độ dày tuỳ chọn), vd. để nhúng vào ảnh chia sẻ. */
export function conGiapIconSvg(slug: string, color = "currentColor", strokeWidth = 1.5) {
  const inner = CON_GIAP_ICONS[slug];
  if (!inner) return null;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" ` +
    `stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${inner.replace(/currentColor/g, color)}</svg>`
  );
}
