// @ts-check
import globals from 'globals';

export default {
  ignores: ['eslint.config.mjs'], // Bỏ qua tệp cấu hình này
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // Cấu hình mặc định cho TypeScript
    'plugin:prettier/recommended', // Cấu hình Prettier cho ESLint
  ],
  languageOptions: {
    globals: {
      ...globals.node, // Các global variables của Node.js
      ...globals.jest, // Nếu bạn dùng Jest cho testing
    },
    sourceType: 'module', // Đặt kiểu nguồn là module để sử dụng `import/export`
    parserOptions: {
      project: './tsconfig.json', // Đảm bảo trỏ tới `tsconfig.json`
      tsconfigRootDir: import.meta.url, // Dùng `import.meta.url` để trỏ đến thư mục root cho dự án
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // Tắt cảnh báo khi sử dụng `any`
    '@typescript-eslint/no-floating-promises': 'warn', // Cảnh báo về promises không được xử lý
    '@typescript-eslint/no-unsafe-argument': 'warn', // Cảnh báo về các đối số không an toàn
  },
};
