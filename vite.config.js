import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './resources/js'),
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  root: '.',
  server: {
    port: 3000,
    host: true,
    open: true
  }
})