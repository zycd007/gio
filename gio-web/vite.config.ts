import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
    server: {
    port: 5173,
    proxy: {
      // 管理端 API 代理（必须放在 /api 前面）
      '/api/admin': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      // C 端 API 代理
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      }
    }
  }
})
