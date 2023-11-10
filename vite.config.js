import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "litdevs",
    project: "quarkvite",
    url: "https://sentry.yggdrasil.cat/"
  })],
  build: {
    minify: false,
    sourcemap: true
  }
})