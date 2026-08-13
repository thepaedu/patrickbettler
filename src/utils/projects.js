import MarkdownIt from 'markdown-it'
import { parseFrontmatter } from './frontmatter'

const md = new MarkdownIt({ html: false, linkify: true, typographer: true })

// Vite 5/6-Syntax für Raw-Imports. Falls dein Vite älter ist (v4 oder früher),
// ersetze die Optionen durch: { eager: true, as: 'raw' }
const modules = import.meta.glob('../content/projects/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function loadProjects() {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const slug = path.split('/').pop().replace(/\.md$/, '')
      const { data, content } = parseFrontmatter(raw)

      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        cover: data.cover || '',
        demoUrl: data.demoUrl || '',
        repoUrl: data.repoUrl || '',
        date: data.date || '',
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
        html: md.render(content),
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
