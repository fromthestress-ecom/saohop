# Triển khai Sao Hợp lên VPS (PM2 + Nginx)

VPS dùng chung với web khác (leadstracking). Sao Hợp chỉ **thêm** thư mục, tiến trình PM2 và một file Nginx riêng; không sửa gì của web cũ.

| Môi trường | Nhánh | Địa chỉ | PM2 | Cổng nội bộ |
|---|---|---|---|---|
| Production | `master` | `https://saohop.com` (`www` chuyển về đây) | `saohop-prod` | `127.0.0.1:3101` |
| Test | `develop` | `https://dev.saohop.com` (có mật khẩu, noindex) | `saohop-staging` | `127.0.0.1:3102` |

Luồng deploy: GitHub Actions chạy test, build Next.js `standalone` bằng Node 20, chép gói lên VPS vào `/var/www/saohop/<env>/releases/<commit>`, trỏ `current` sang bản mới, `pm2 startOrReload`, kiểm tra `/api/health` trả đúng commit. Lỗi thì tự quay về bản trước. Giữ 5 bản gần nhất.

## Cấu trúc trên VPS

```
/var/www/saohop/
  ecosystem.config.cjs          (workflow chép lên mỗi lần deploy)
  prod/    releases/  current -> releases/<commit>  shared/.env
  staging/ releases/  current -> releases/<commit>  shared/.env
```

`shared/.env` chứa biến bí mật, không nằm trong git:

```bash
ANTHROPIC_API_KEY=...
```

## Thiết lập lần đầu

1. **DNS**: bản ghi A cho `saohop.com`, `www.saohop.com`, `dev.saohop.com` trỏ về IP VPS.
2. **Thư mục** (root):

   ```bash
   install -d -o deploy -g deploy /var/www/saohop
   ```
3. **GitHub** > Settings > Secrets and variables > Actions:
   - Secrets: `VPS_HOST` (IP), `VPS_USER` (`deploy`), `VPS_SSH_KEY` (khoá riêng dành cho Sao Hợp)
   - Variable: `DOMAIN` = `saohop.com`
4. **Deploy lần đầu**: push `develop`, sau đó `master`.
5. **Nginx và HTTPS** (root), sau khi DNS đã trỏ đúng. Chép `deploy/enable-saohop-nginx.sh` lên `/var/www/saohop/` rồi chạy:

   ```bash
   bash /var/www/saohop/enable-saohop-nginx.sh
   ```

   Script cài `saohop.conf`, đặt mật khẩu cho `dev.saohop.com` (tên đăng nhập `saohop`), kiểm tra `nginx -t` trước khi nạp lại (lỗi thì tự gỡ, không ảnh hưởng site khác) và chạy certbot. Chạy lại nhiều lần vẫn an toàn.

## Hằng ngày
- Làm việc trên `develop`, push lên thì tự deploy `dev.saohop.com`.
- Kiểm tra xong, tạo pull request `develop` vào `master`. Merge thì tự deploy production.

## Kiểm tra và xử lý sự cố (user `deploy`)

```bash
pm2 ls
pm2 logs saohop-prod --lines 100
curl -s http://127.0.0.1:3101/api/health
```

Quay về bản trước bằng tay:

```bash
cd /var/www/saohop/prod
ls -1t releases                         # chọn bản muốn quay về
ln -sfn /var/www/saohop/prod/releases/<commit> current
pm2 startOrReload /var/www/saohop/ecosystem.config.cjs --only saohop-prod --update-env
```

`Dockerfile` ở gốc repo vẫn dùng được để chạy thử bằng Docker, nhưng không nằm trong luồng deploy.
