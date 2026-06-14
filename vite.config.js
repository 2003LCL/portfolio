import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  // 相对路径 + 全部内联，产出可直接双击打开的单文件 HTML
  base: './',
  plugins: [react(), viteSingleFile()],
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
  },
  server: {
    port: 5173,
    open: true,
  },
})
