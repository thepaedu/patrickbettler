import { ViteSSG } from 'vite-ssg'
import './style.css'
import './assets/theme.css'
import App from './App.vue'
import { routes } from './router'

// ViteSSG baut Router + App zusammen auf. "base" muss zu vite.config.js
// (base: '/patrickbettler/') passen, deshalb import.meta.env.BASE_URL
// statt es hier hart zu codieren.
export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
  },
  // dritter Parameter: hier könnte weiteres App-Setup (Pinia, etc.) rein,
  // aktuell nicht benötigt
  undefined,
  {
    // vite-ssg kann dynamische Routen (":slug") nicht selbst auflösen.
    // Hier sagen wir ihm explizit, welche konkreten Pfade beim Prerendern
    // generiert werden sollen: alle statischen Routen unverändert,
    // plus einen echten Pfad pro Markdown-Datei in src/content/blog
    // bzw. src/content/projects (Dateiname ohne .md = Slug).
    includedRoutes(paths) {
      const staticPaths = paths.filter((p) => !p.includes(':'))

      // { query: '?raw', import: 'default' } sorgt dafür, dass Vite den
      // Dateiinhalt als reinen Text lädt statt ihn als JS zu parsen.
      // Ohne das würde z.B. der "---" Frontmatter-Header am Zeilenanfang
      // als JS-Operator interpretiert und einen Syntaxfehler auslösen.
      const blogFiles = import.meta.glob('./content/blog/*.md', {
        eager: true,
        query: '?raw',
        import: 'default',
      })
      const projectFiles = import.meta.glob('./content/projects/*.md', {
        eager: true,
        query: '?raw',
        import: 'default',
      })

      const slugFromPath = (filePath) =>
        filePath.split('/').pop().replace(/\.md$/, '')

      const blogPaths = Object.keys(blogFiles).map(
        (filePath) => `/blog/${slugFromPath(filePath)}`
      )
      const projectPaths = Object.keys(projectFiles).map(
        (filePath) => `/projekte/${slugFromPath(filePath)}`
      )

      return [...staticPaths, ...blogPaths, ...projectPaths]
    },
  }
)