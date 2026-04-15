import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
    }, // මෙතන කොමාව (comma) අනිවාර්යයි
    host: true,
    port: 5174,
    strictPort: true,
  }
})