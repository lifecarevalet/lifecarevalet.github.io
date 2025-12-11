import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // ✅ FIX 1: GitHub Pages ke liye base path ko './' par set kiya
  base: './', 
  plugins: [react()],
})
