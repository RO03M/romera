import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    terserOptions: {
      mangle: false
    },
    minify: "terser"
  },
  plugins: [preact()]
})
