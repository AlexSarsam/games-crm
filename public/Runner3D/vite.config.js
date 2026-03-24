import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/Runner3D/dist/',
  build: {
    outDir: 'dist',
  },
})
