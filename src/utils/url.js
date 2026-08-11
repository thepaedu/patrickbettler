// Da vite.config.js "base: '/patrickbettler/'" gesetzt hat, werden
// Dateien aus dem public/-Ordner NICHT automatisch unter diesem Präfix
// ausgeliefert, wenn man sie als literalen String wie "/images/foo.jpg"
// referenziert. Diese Funktion hängt das korrekte Präfix davor.
export function withBase(path) {
  if (!path) return path
  if (/^https?:\/\//.test(path)) return path // externe URLs unverändert lassen

  const base = import.meta.env.BASE_URL || '/' // z.B. '/patrickbettler/'
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base
  const trimmedPath = path.startsWith('/') ? path : `/${path}`

  return `${trimmedBase}${trimmedPath}`
}
