import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { env } from 'node:process'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this repository from a subdirectory, while the local
  // development server should remain available at http://localhost:5173/.
  base: env.GITHUB_ACTIONS ? '/saifee-rovers-app/' : '/',
})
