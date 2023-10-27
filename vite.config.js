import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://demdev404.github.io/rickmortytest/',
  plugins: [vue()],
})
