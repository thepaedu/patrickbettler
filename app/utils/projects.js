import MarkdownIt from 'markdown-it'
import { parseFrontmatter } from './frontmatter'

const md = new MarkdownIt({ html: false, linkify: true, typographer: true })

// Die Markdown-Dateien liegen jetzt im Projekt-Root unter content/projects.
const modules = import.meta.glob('../../content/projects/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

// Bilder aus dem Frontmatter, kommagetrennt, optional mit Bildunterschrift nach "|":
//   images: /images/app-1.jpg | Startseite, /images/app-2.jpg | Einstellungen
// (Bildunterschriften deshalb ohne Komma schreiben.)
function parseImages(value) {
  if (!value) return []
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [src, ...caption] = entry.split('|')
      return { src: src.trim(), caption: caption.join('|').trim() }
    })
}

function loadProjects() {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const slug = path.split('/').pop().replace(/\.md$/, '')
      const { data, content } = parseFrontmatter(raw)

      // Die Überschrift "Worum geht es" setzt die Detailseite selbst (zusammen
      // mit der description). Steht sie am Anfang des Markdowns, hier entfernen,
      // damit sie nicht doppelt erscheint.
      const body = content.replace(/^\s*##\s+Worum geht es\s*\r?\n/i, '')

      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        cover: data.cover || '',
        projectLogo: data.projectLogo || '',
        company: data.company || '',
        companyLogo: data.companyLogo || '',
        demoUrl: data.demoUrl || '',
        repoUrl: data.repoUrl || '',
        date: data.date || '',
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
        images: parseImages(data.images),
        html: md.render(body),
      }
    })
    // neueste zuerst, Projekte ohne Datum landen am Ende
    .sort((a, b) => {
      if (!a.date && !b.date) return 0
      if (!a.date) return 1
      if (!b.date) return -1
      return new Date(b.date) - new Date(a.date)
    })
}

export const projects = loadProjects()

export function getProject(slug) {
  return projects.find((p) => p.slug === slug)
}