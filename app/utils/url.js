// Dateien aus public/ werden bei einer baseURL wie '/patrickbettler/'
// NICHT automatisch mit Präfix ausgeliefert, wenn man sie als String wie
// "/images/foo.jpg" referenziert. Diese Funktion hängt das Präfix davor.
// In Nuxt kommt die baseURL aus der Runtime-Config statt aus import.meta.env.
// Aufruf nur aus Komponenten (Template/Setup), da useRuntimeConfig dort verfügbar ist.
export function withBase(path) {
  if (!path) return path
  if (/^https?:\/\//.test(path)) return path // externe URLs unverändert lassen

  const base = useRuntimeConfig().app.baseURL || '/'
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base
  const trimmedPath = path.startsWith('/') ? path : `/${path}`

  return `${trimmedBase}${trimmedPath}`
}
