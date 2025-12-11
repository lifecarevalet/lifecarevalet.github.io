import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages ke liye base path '/' set kiya gaya hai
  base: '/', 
  plugins: [react()],
})
