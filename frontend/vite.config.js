// vite.config.js
import { defineConfig } from 'vite'
import vue            from '@vitejs/plugin-vue'
import vueJsx         from '@vitejs/plugin-vue-jsx'
import vueDevTools    from 'vite-plugin-vue-devtools'
import { fileURLToPath, URL } from 'node:url'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),        // if you ever write <script setup lang="jsx">
    vueDevTools(),   // optional dev‑tools plugin
  ],
  test: {
    globals: true,         // allows using `describe/it/expect` without imports
    environment: "jsdom",  // simulates a browser DOM
    // setupFiles: "./tests/setup.js", // optional: global test setup
    // include: [
    //   '../tests/unit/**/*.spec.{js,ts}' // 👈 pick up tests outside frontend
    // ],
  },

  resolve: {
    alias: {
      // root‑relative imports: '@/foo' → src/foo
      '@': fileURLToPath(new URL('./src', import.meta.url)),

      // feature‑first folders: '~features/news/...' etc.
      '~features': fileURLToPath(new URL('./src/features', import.meta.url)),

      // optional: shared components shortcut
      '~components': fileURLToPath(new URL('./src/components', import.meta.url)),
    },
  },

  server: {
    proxy: {
      // Front‑end requests to /api/*  ->  http://localhost:5000/*
      '/api': 'http://localhost:5000',
    },
  },
})
