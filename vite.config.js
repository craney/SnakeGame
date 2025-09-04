import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/SnakeGame/', // 设置 GitHub Pages 的 base path
  server: {
    host: '0.0.0.0', // 监听所有网络接口
    port: 5173,
  },
})
