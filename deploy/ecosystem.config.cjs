// PM2 cho Sao Hợp trên VPS. Workflow chép file này tới /var/www/saohop/ecosystem.config.cjs.
//
// Mỗi môi trường có cấu trúc:
//   /var/www/saohop/<env>/releases/<commit>/   bản build standalone của từng lần deploy
//   /var/www/saohop/<env>/current  ->          liên kết tới release đang chạy
//   /var/www/saohop/<env>/shared/.env          biến môi trường (ANTHROPIC_API_KEY...), không nằm trong git
//
// Next.js chỉ nghe ở localhost; Nginx chuyển tiếp saohop.com và dev.saohop.com vào đây.

const BASE = "/var/www/saohop";

const app = (name, env, port) => ({
  name,
  cwd: `${BASE}/${env}/current`,
  script: "server.js",
  // Node 20.6+ tự đọc file .env qua cờ này.
  node_args: `--env-file=${BASE}/${env}/shared/.env`,
  env: {
    NODE_ENV: "production",
    PORT: String(port),
    HOSTNAME: "127.0.0.1",
    NEXT_TELEMETRY_DISABLED: "1",
  },
  // VPS dùng chung, RAM 2GB: khởi động lại nếu một app phình quá 400MB.
  max_memory_restart: "400M",
  time: true,
});

module.exports = {
  apps: [app("saohop-prod", "prod", 3101), app("saohop-staging", "staging", 3102)],
};
