import MarkdownIt from 'markdown-it'
import { parseFrontmatter } from './frontmatter'

const md = new MarkdownIt({ html: false, linkify: true, typographer: true })

// Vite 5/6-Syntax für Raw-Imports. Falls dein Vite älter ist (v4 oder früher),
// ersetze die Optionen durch: { eager: true, as: 'raw' }
const modules = import.meta.glob('../content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function loadPosts() {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const slug = path.split('/').pop().replace(/\.md$/, '')
      const { data, content } = parseFrontmatter(raw)

      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        excerpt: data.excerpt || '',
        cover: data.cover || '',
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
        html: md.render(content),
      }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export const posts = loadPosts()

export function getPost(slug) {
  return posts.find((p) => p.slug === slug)
}
