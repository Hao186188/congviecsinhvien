// vite.config.js (Giả định file cấu hình của bạn)

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Cần import module 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Thiết lập đường dẫn tắt @ cho thư mục src
      '@': path.resolve(__dirname, './src'), 
    },
  },
});