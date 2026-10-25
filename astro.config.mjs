import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: process.env.URL ?? 'http://localhost:4321',
  vite: {
    plugins: [tailwindcss()]
  }
})
