import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // ✅ GitHub Pages ke liye base path '/' set kiya gaya hai
  base: '/', 
  plugins: [react()],
})
