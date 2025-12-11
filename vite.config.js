import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // --- YEH LINE ADD KARENGE ---
  base: '/', 
  // -----------------------------
  plugins: [react()],
})
