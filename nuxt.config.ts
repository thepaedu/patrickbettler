import { existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Ersetzt includedRoutes() aus main.js: Pro Markdown-Datei eine Route,
// die beim "nuxt generate" vorgerendert wird. (crawlLinks würde die Seiten
// über die Links auf /blog und /projekte meist auch finden; so ist es explizit.)
function slugRoutes(dir: string, prefix: string) {
  const abs = fileURLToPath(new URL(dir, import.meta.url))
  if (!existsSync(abs)) return []
  return readdirSync(abs)
    .filter((f) => f.endsWith('.md'))
    .map((f) => `${prefix}/${f.replace(/\.md$/, '')}`)
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/style.css', '~/assets/css/theme.css'],

  app: {
    // entspricht "base: '/patrickbettler/'" aus der alten vite.config.js
    baseURL: '/patrickbettler/',
    // style.css stylt "#app" – Nuxt heisst standardmässig "#__nuxt"
    rootId: 'app',
    // ersetzt <transition name="fade" mode="out-in"> um <router-view>
    pageTransition: { name: 'fade', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'de' },
      title: 'Patrick Bettler',
    },
  },

  vite: {
    build: {
      // three.js (STL-Viewer) ist ein grosser Brocken, wird aber nur auf
      // /stl-viewer und erst beim Hochladen geladen → Warnung unnötig.
      chunkSizeWarningLimit: 1000,
    },
  },

  nitro: {
    // legt u.a. die .nojekyll-Datei an, sonst ignoriert GitHub Pages den _nuxt-Ordner
    preset: 'github_pages',
    prerender: {
      // Crawler aus: Er nahm die Links samt baseURL (/patrickbettler/...) als
      // zusätzliche Routen auf und renderte jede Seite doppelt und gleichzeitig.
      // Unter Windows führte das zu EPERM-Fehlern im Prerender-Cache.
      // Stattdessen alle Seiten hier explizit auflisten. Neue Seite in
      // app/pages/ anlegen → hier ergänzen. Blog/Projekte kommen automatisch.
      crawlLinks: false,
      routes: [
        '/',
        '/blog',
        '/projekte',
        '/galerie',
        '/tools',
        '/instagram-check',
        '/stl-viewer',
        '/glb-viewer',
        '/png-to-svg',
        '/bild-erweitern',
        ...slugRoutes('./content/blog', '/blog'),
        ...slugRoutes('./content/projects', '/projekte'),
      ],
    },
  },
})