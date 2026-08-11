/**
 * Sehr schlanker Frontmatter-Parser (kein npm-Paket nötig).
 * Erwartet Blöcke im Format:
 *
 * ---
 * title: Mein Titel
 * date: 2026-01-10
 * excerpt: Kurzbeschreibung
 * cover: /images/foo.jpg
 * tags: vue, gsap, design
 * ---
 * Markdown-Inhalt ...
 */
export function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) {
    return { data: {}, content: raw }
  }

  const [, frontmatterBlock, content] = match
  const data = {}

  frontmatterBlock.split(/\r?\n/).forEach((line) => {
    const idx = line.indexOf(':')
    if (idx === -1) return
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    value = value.replace(/^["']|["']$/g, '')
    data[key] = value
  })

  return { data, content }
}
