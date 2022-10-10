import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'Main@': fileURLToPath(new URL('./src/main', import.meta.url)),
      'Login@': fileURLToPath(new URL('./src/login', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/main/index.html"),
        login: resolve(__dirname, "src/login/index.html")
      }
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5616/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
})
