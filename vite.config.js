import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/AR-11-111111/',
  plugins: [react(), tailwindcss()],
  server: {
    open: true
  }
})
