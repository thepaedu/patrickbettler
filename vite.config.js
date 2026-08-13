import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const blogDir = path.resolve(__dirname, 'src/content/blog')
const projectsDir = path.resolve(__dirname, 'src/content/projects')

// Liest die vorhandenen Markdown-Dateien aus, damit vite-ssg beim Build
// auch /blog/:slug und /projekte/:slug für jeden Eintrag als statische
// HTML-Datei vorrendert. Ohne das würden nur /blog und /projekte selbst
// erkannt, nicht die einzelnen Unterseiten.
function slugsFrom(dir, prefix) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => `${prefix}/${file.replace(/\.md$/, '')}`)
}

const blogSlugRoutes = slugsFrom(blogDir, '/blog')
const projectSlugRoutes = slugsFrom(projectsDir, '/projekte')

export default defineConfig({
  base: '/patrickbettler/',
  plugins: [vue()],
  ssgOptions: {
    includedRoutes(paths) {
      return [...paths, ...blogSlugRoutes, ...projectSlugRoutes]
    },
  },
})
