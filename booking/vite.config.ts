import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  // the sandbox preview proxies from a *.e2b.app host
  server: {
    host: true,
    allowedHosts: true,
    port: 4180,
    strictPort: true,
  },
  preview: {
    host: true,
    allowedHosts: true,
    port: 4180,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsInlineLimit: 0,
    emptyOutDir: true,
  },
})
