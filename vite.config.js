import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// 两种构建：
//  默认           —— 个人作品集，单文件，base './'
//  SITE=service   —— 接单站，部署到 GitHub Pages 的 /web-service/，输出到 dist-service
const isService = process.env.SITE === 'service'

export default defineConfig({
  base: isService ? '/web-service/' : './',
  define: {
    'import.meta.env.VITE_SITE': JSON.stringify(isService ? 'service' : ''),
  },
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: isService ? 'dist-service' : 'dist',
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
  },
  server: {
    port: 5173,
    open: true,
  },
})
