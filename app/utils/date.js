// Vorher in Blog.vue und BlogPost.vue doppelt vorhanden.
// timeZone 'UTC': "2026-01-10" wird als UTC-Mitternacht gelesen. Ohne feste
// Zeitzone zeigt ein Browser westlich von UTC den Vortag an und weicht damit
// vom vorgerenderten HTML ab (Hydration-Mismatch).
export function formatPostDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('de-CH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
