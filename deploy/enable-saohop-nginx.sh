#!/usr/bin/env bash
# Bật Sao Hợp trên Nginx và xin chứng chỉ HTTPS. Chạy bằng root, một lần:
#   sudo bash /var/www/saohop/enable-saohop-nginx.sh
#
# Chỉ THÊM file /etc/nginx/sites-available/saohop.conf; không sửa cấu hình của site khác.
# Chạy lại nhiều lần vẫn an toàn: không ghi đè phần HTTPS certbot đã thêm, không hỏi lại mật khẩu đã đặt.

set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "Cần quyền root. Chạy lại bằng:  sudo bash $0" >&2
  exit 1
fi

SRC=/var/www/saohop/nginx-saohop.conf
AVAILABLE=/etc/nginx/sites-available/saohop.conf
ENABLED=/etc/nginx/sites-enabled/saohop.conf
HTPASSWD=/etc/nginx/.htpasswd-saohop-dev

echo
echo "==> 1/4  Cài file cấu hình Nginx cho saohop.com"
if [[ -f $AVAILABLE ]]; then
  echo "    Đã có $AVAILABLE, giữ nguyên (không ghi đè phần HTTPS)."
else
  cp "$SRC" "$AVAILABLE"
  echo "    Đã chép vào $AVAILABLE"
fi
ln -sf "$AVAILABLE" "$ENABLED"

echo
echo "==> 2/4  Mật khẩu cho trang thử nghiệm dev.saohop.com"
if [[ -f $HTPASSWD ]]; then
  echo "    Đã có mật khẩu từ trước, bỏ qua."
else
  echo "    Tên đăng nhập: saohop"
  echo "    Gõ mật khẩu rồi Enter, gõ lại lần nữa rồi Enter. Khi gõ, màn hình KHÔNG hiện ký tự, đó là bình thường."
  HASH="$(openssl passwd -apr1)"
  printf "saohop:%s\n" "$HASH" > "$HTPASSWD"
  chown root:www-data "$HTPASSWD"
  chmod 640 "$HTPASSWD"
  echo "    Đã lưu mật khẩu."
fi

echo
echo "==> 3/4  Kiểm tra cấu hình và nạp lại Nginx"
if nginx -t; then
  systemctl reload nginx
  echo "    Nginx đã nạp cấu hình mới."
else
  rm -f "$ENABLED"
  echo "    LỖI cấu hình. Đã gỡ saohop.conf, Nginx vẫn chạy cấu hình cũ, các site khác không bị ảnh hưởng." >&2
  echo "    Hãy gửi toàn bộ nội dung phía trên cho Claude." >&2
  exit 1
fi

echo
echo "==> 4/4  Xin chứng chỉ HTTPS (Let's Encrypt)"
echo "    Nếu certbot hỏi email hoặc điều khoản: nhập email của bạn, gõ Y để đồng ý."
certbot --nginx --keep-until-expiring --redirect -d saohop.com -d www.saohop.com -d dev.saohop.com
nginx -t && systemctl reload nginx

echo
echo "============================================================"
echo " XONG. Mở https://dev.saohop.com, đăng nhập bằng saohop và mật khẩu vừa đặt."
echo " https://saohop.com sẽ báo 502 cho tới khi deploy production, đó là bình thường."
echo "============================================================"
