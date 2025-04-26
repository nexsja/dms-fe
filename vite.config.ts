import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure Vite correctly processes and includes assets
    assetsInlineLimit: 4096 // 4kb - files smaller than this will be inlined as base64
  },
  server: {
    watch: {
      usePolling: true, // Enable polling for file changes
    },
  },
})