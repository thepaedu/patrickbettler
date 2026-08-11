import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const blogDir = path.resolve(__dirname, 'src/content/blog')

// Liest die vorhandenen Markdown-Dateien aus, damit vite-ssg beim Build
// auch /blog/:slug für jeden Post als statische HTML-Datei vorrendert.
// Ohne das würde nur /blog selbst erkannt, nicht die einzelnen Beiträge.
const blogSlugRoutes = fs.existsSync(blogDir)
  ? fs
      .readdirSync(blogDir)
      .filter((file) => file.endsWith('.md'))
      .map((file) => `/blog/${file.replace(/\.md$/, '')}`)
  : []

export default defineConfig({
  base: '/patrickbettler/',
  plugins: [vue()],
  ssgOptions: {
    includedRoutes(paths) {
      return [...paths, ...blogSlugRoutes]
    },
  },
})
