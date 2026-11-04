import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 多页面构建：首页 + 三个政策页各自一个 HTML，部署到任何静态托管都是干净的路径（/terms/ 等）
// base 用相对路径，GitHub Pages 子路径、自有域名、Cloudflare Pages 都能直接用
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        terms: resolve(import.meta.dirname, 'terms/index.html'),
        privacy: resolve(import.meta.dirname, 'privacy/index.html'),
        refund: resolve(import.meta.dirname, 'refund/index.html'),
      },
    },
  },
})
