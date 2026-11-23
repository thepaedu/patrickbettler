<script setup>
useHead({
  title: 'PNG zu SVG – Patrick Bettler',
  meta: [
    {
      name: 'description',
      content:
        'PNG-Bilder direkt im Browser in SVG-Vektorgrafiken umwandeln. Das Bild verlässt deinen Computer nicht.',
    },
  ],
})

// ---------------------------------------------------------------------------
// Voreinstellungen für typische Bildarten
// tres = Toleranz für Linien/Kurven (kleiner = genauer, aber mehr Punkte)
// pathomit = Flächen mit weniger Punkten werden weggelassen (Rauschen)
// ---------------------------------------------------------------------------

const presets = {
  logo: { label: 'Logo / Icon', colors: 4, tres: 1, pathomit: 8, blur: 0 },
  illustration: { label: 'Illustration', colors: 16, tres: 1, pathomit: 8, blur: 0 },
  photo: { label: 'Foto (detailliert)', colors: 32, tres: 0.5, pathomit: 4, blur: 1 },
  bw: { label: 'Schwarzweiss', colors: 2, tres: 1, pathomit: 8, blur: 0 },
}

// ---------------------------------------------------------------------------
// Zustand
// ---------------------------------------------------------------------------

const mode = ref('trace') // 'trace' = vektorisieren, 'embed' = PNG in SVG einbetten
const preset = ref('logo')
const colors = ref(presets.logo.colors)
const tres = ref(presets.logo.tres)
const pathomit = ref(presets.logo.pathomit)
const blur = ref(presets.logo.blur)
const maxSize = ref(1200)

const busy = ref(false)
const dragging = ref(false)
const error = ref('')
const notice = ref('')

const source = shallowRef(null) // { name, size, width, height, url, dataUrl, img }
const result = shallowRef(null) // { svg, url, size, paths, ms }

let ImageTracer = null
let traceTimer = null
let traceRun = 0

// ---------------------------------------------------------------------------
// Bild laden
// ---------------------------------------------------------------------------

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Das Bild konnte nicht geöffnet werden.'))
    img.src = url
  })
}

async function loadFile(file) {
  if (!file) return
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    error.value = `„${file.name}“ ist kein unterstütztes Bild (PNG, JPG, WebP, GIF).`
    return
  }

  error.value = ''
  notice.value = ''

  try {
    const dataUrl = await readAsDataUrl(file)
    const img = await loadImage(dataUrl)

    if (source.value?.url) URL.revokeObjectURL(source.value.url)
    source.value = {
      name: file.name,
      size: file.size,
      width: img.naturalWidth,
      height: img.naturalHeight,
      url: URL.createObjectURL(file),
      dataUrl,
      type: file.type,
      img,
    }
    await convert()
  } catch (e) {
    error.value = e?.message || 'Das Bild konnte nicht gelesen werden.'
  }
}

// ---------------------------------------------------------------------------
// Umwandeln
// ---------------------------------------------------------------------------

async function convert() {
  if (!source.value) return
  const run = ++traceRun
  busy.value = true
  error.value = ''

  try {
    const svg = mode.value === 'embed' ? embedSvg() : await traceSvg()
    if (run !== traceRun) return // inzwischen neu gestartet (Einstellung geändert)
    setResult(svg)
  } catch (e) {
    console.error(e)
    error.value = 'Die Umwandlung ist fehlgeschlagen. Versuche es mit weniger Farben oder einer kleineren Bildgrösse.'
  } finally {
    if (run === traceRun) busy.value = false
  }
}

// Variante 1: echtes Vektorisieren mit imagetracerjs
async function traceSvg() {
  if (!ImageTracer) {
    // erst bei Bedarf laden, beim Vorrendern wird nichts davon ausgeführt
    const mod = await import('imagetracerjs')
    ImageTracer = mod.default || mod
  }

  const { img, width, height } = source.value

  // Grosse Bilder verkleinern: Das Tracing wächst stark mit der Pixelzahl.
  // Die Koordinaten werden danach wieder auf die Originalgrösse skaliert.
  const factor = Math.min(1, maxSize.value / Math.max(width, height))
  const w = Math.max(1, Math.round(width * factor))
  const h = Math.max(1, Math.round(height * factor))
  notice.value =
    factor < 1
      ? `Für die Umwandlung auf ${w} × ${h} px verkleinert, das SVG hat wieder die Originalgrösse.`
      : ''

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, w, h)
  const imageData = ctx.getImageData(0, 0, w, h)

  // Dem Browser kurz Zeit geben, den Lade-Zustand anzuzeigen,
  // bevor die (synchrone) Berechnung den Tab kurz blockiert.
  await new Promise((r) => setTimeout(r, 30))

  const svg = ImageTracer.imagedataToSVG(imageData, {
    numberofcolors: colors.value,
    ltres: tres.value,
    qtres: tres.value,
    pathomit: pathomit.value,
    blurradius: blur.value,
    blurdelta: 20,
    colorsampling: 2,
    colorquantcycles: 3,
    roundcoords: 1,
    scale: 1 / factor,
    viewbox: true,
    desc: false,
  })

  return (
    svg
      // Leere, völlig transparente Flächen entfernen (machen die Datei nur grösser)
      .replace(/<path[^>]*opacity="0"[^>]*\/>/g, '')
      // imagetracer setzt nur viewBox – Breite/Höhe ergänzen, damit das SVG
      // überall (Browser, Grafikprogramme) in Originalgrösse geöffnet wird
      .replace('<svg ', `<svg width="${width}" height="${height}" `)
  )
}

// Variante 2: PNG unverändert in ein SVG einbetten (verlustfrei, aber keine Vektoren)
function embedSvg() {
  notice.value = ''
  const { width, height, dataUrl } = source.value
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ` +
    `width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<image width="${width}" height="${height}" href="${dataUrl}" xlink:href="${dataUrl}"/>` +
    `</svg>`
  )
}

function setResult(svg) {
  if (result.value?.url) URL.revokeObjectURL(result.value.url)
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  result.value = {
    svg,
    url: URL.createObjectURL(blob),
    size: blob.size,
    paths: (svg.match(/<path/g) || []).length,
  }
}

// ---------------------------------------------------------------------------
// Einstellungen: Voreinstellung übernehmen, bei Änderungen neu berechnen
// ---------------------------------------------------------------------------

watch(preset, (key) => {
  const p = presets[key]
  colors.value = p.colors
  tres.value = p.tres
  pathomit.value = p.pathomit
  blur.value = p.blur
})

// Kurz warten, damit beim Ziehen eines Reglers nicht bei jedem Schritt neu gerechnet wird
watch([mode, colors, tres, pathomit, blur, maxSize], () => {
  clearTimeout(traceTimer)
  traceTimer = setTimeout(convert, 350)
})

// ---------------------------------------------------------------------------
// Ergebnis herunterladen / kopieren
// ---------------------------------------------------------------------------

const downloadName = computed(() =>
  source.value ? source.value.name.replace(/\.[^.]+$/, '') + '.svg' : 'bild.svg',
)

const copied = ref(false)
async function copySvg() {
  if (!result.value) return
  try {
    await navigator.clipboard.writeText(result.value.svg)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    error.value = 'Kopieren nicht möglich. Lade die Datei stattdessen herunter.'
  }
}

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

function onInputChange(event) {
  loadFile(event.target.files?.[0])
  event.target.value = ''
}

function onDrop(event) {
  dragging.value = false
  loadFile(event.dataTransfer?.files?.[0])
}

function onDragLeave(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) dragging.value = false
}

onBeforeUnmount(() => {
  clearTimeout(traceTimer)
  if (source.value?.url) URL.revokeObjectURL(source.value.url)
  if (result.value?.url) URL.revokeObjectURL(result.value.url)
})

// ---------------------------------------------------------------------------
// Anzeige
// ---------------------------------------------------------------------------

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toLocaleString('de-CH', { maximumFractionDigits: 1 })} KB`
  return `${(bytes / 1024 / 1024).toLocaleString('de-CH', { maximumFractionDigits: 1 })} MB`
}
</script>

<template>
  <section class="p2s container">
    <header class="p2s-intro">
      <h1>PNG zu SVG</h1>
      <p>
        Wandle ein Pixelbild in eine Vektorgrafik um, die sich ohne Qualitätsverlust
        beliebig vergrössern lässt. Am besten funktioniert das mit Logos, Icons und
        Grafiken mit klaren Flächen.
      </p>
      <p class="p2s-privacy">
        Die Umwandlung läuft vollständig in deinem Browser. Dein Bild wird nirgends hochgeladen.
      </p>
    </header>

    <label
      class="glass p2s-drop"
      :class="{ 'is-dragging': dragging, 'is-compact': source }"
      @dragenter.prevent="dragging = true"
      @dragover.prevent="dragging = true"
      @dragleave="onDragLeave"
      @drop.prevent="onDrop"
    >
      <input
        type="file"
        class="p2s-file-input"
        accept="image/png,image/jpeg,image/webp,image/gif"
        @change="onInputChange"
      />
      <span class="p2s-drop-title">
        {{ source ? 'Anderes Bild hierher ziehen oder klicken' : 'PNG-Datei hierher ziehen' }}
      </span>
      <span v-if="!source" class="p2s-drop-sub">
        oder klicken, um ein Bild auszuwählen (auch JPG und WebP)
      </span>
    </label>

    <p v-if="error" class="p2s-msg p2s-error" role="alert">{{ error }}</p>

    <template v-if="source">
      <!-- Einstellungen -->
      <div class="glass p2s-panel p2s-settings">
        <div class="p2s-modes" role="radiogroup" aria-label="Umwandlungsart">
          <label class="p2s-mode" :class="{ active: mode === 'trace' }">
            <input v-model="mode" type="radio" value="trace" />
            <strong>Vektorisieren</strong>
            <small>Echte Vektorgrafik, beliebig skalierbar</small>
          </label>
          <label class="p2s-mode" :class="{ active: mode === 'embed' }">
            <input v-model="mode" type="radio" value="embed" />
            <strong>Einbetten</strong>
            <small>PNG unverändert in ein SVG verpacken</small>
          </label>
        </div>

        <div v-if="mode === 'trace'" class="p2s-controls">
          <label class="p2s-field">
            <span>Bildart</span>
            <select v-model="preset" class="p2s-input">
              <option v-for="(p, key) in presets" :key="key" :value="key">{{ p.label }}</option>
            </select>
          </label>

          <label class="p2s-field">
            <span>Farben <output>{{ colors }}</output></span>
            <input v-model.number="colors" type="range" min="2" max="64" step="1" />
          </label>

          <label class="p2s-field">
            <span>Glättung <output>{{ tres.toLocaleString('de-CH') }}</output></span>
            <input v-model.number="tres" type="range" min="0.1" max="5" step="0.1" />
            <small>klein = genauer, gross = weichere Kurven</small>
          </label>

          <label class="p2s-field">
            <span>Kleine Flecken entfernen <output>{{ pathomit }}</output></span>
            <input v-model.number="pathomit" type="range" min="0" max="64" step="1" />
          </label>

          <label class="p2s-field">
            <span>Weichzeichnen <output>{{ blur }}</output></span>
            <input v-model.number="blur" type="range" min="0" max="5" step="1" />
            <small>hilft bei Fotos und verrauschten Bildern</small>
          </label>

          <label class="p2s-field">
            <span>Max. Bildgrösse beim Umwandeln</span>
            <select v-model.number="maxSize" class="p2s-input">
              <option :value="600">600 px (schnell)</option>
              <option :value="1200">1200 px</option>
              <option :value="2000">2000 px (langsam)</option>
              <option :value="100000">Originalgrösse</option>
            </select>
          </label>
        </div>

        <p v-else class="p2s-msg">
          Das Bild bleibt ein Pixelbild und wird beim Vergrössern unscharf. Praktisch, wenn
          ein Programm unbedingt eine SVG-Datei verlangt.
        </p>

        <p v-if="notice" class="p2s-msg">{{ notice }}</p>
      </div>

      <!-- Vorschau -->
      <div class="p2s-compare">
        <figure class="glass p2s-panel">
          <figcaption>
            <span>Original</span>
            <small>{{ source.width }} × {{ source.height }} px · {{ formatBytes(source.size) }}</small>
          </figcaption>
          <div class="p2s-preview">
            <img :src="source.url" :alt="`Original: ${source.name}`" />
          </div>
        </figure>

        <figure class="glass p2s-panel">
          <figcaption>
            <span>SVG</span>
            <small v-if="result">
              {{ formatBytes(result.size) }}
              <template v-if="mode === 'trace'"> · {{ result.paths.toLocaleString('de-CH') }} Pfade</template>
            </small>
          </figcaption>
          <div class="p2s-preview" :class="{ 'is-busy': busy }">
            <!-- als <img> statt v-html: so wird das SVG sicher und isoliert dargestellt -->
            <img v-if="result" :src="result.url" alt="Umgewandeltes SVG" />
            <span v-if="busy" class="p2s-busy">Wird umgewandelt …</span>
          </div>
        </figure>
      </div>

      <div v-if="result" class="p2s-actions">
        <a class="btn primary" :href="result.url" :download="downloadName">SVG herunterladen</a>
        <button type="button" class="btn" @click="copySvg">
          {{ copied ? 'Kopiert ✓' : 'SVG-Code kopieren' }}
        </button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.p2s {
  text-align: left;
  padding-top: 3rem;
  padding-bottom: 4rem;
  display: grid;
  gap: 1.5rem;
}

.p2s-intro h1 {
  margin: 0 0 1rem;
  font-size: clamp(2rem, 5vw, 3rem);
}

.p2s-intro p {
  max-width: 62ch;
  margin: 0 0 0.75rem;
}

.p2s-privacy {
  color: var(--ink-muted, #9a9a9a);
  font-size: 0.95rem;
}

/* Upload-Feld */
.p2s-drop {
  position: relative;
  display: grid;
  place-items: center;
  gap: 0.35rem;
  min-height: 180px;
  padding: 1.5rem;
  text-align: center;
  border: 2px dashed var(--glass-border, rgba(255, 255, 255, 0.25));
  border-radius: var(--radius-lg, 20px);
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.p2s-drop.is-compact {
  min-height: 0;
  padding: 1rem;
}

.p2s-drop:hover,
.p2s-drop.is-dragging {
  border-color: var(--gold, #c9a14a);
  background: color-mix(in srgb, var(--gold, #c9a14a) 8%, transparent);
}

.p2s-drop:focus-within {
  outline: 2px solid var(--gold, #c9a14a);
  outline-offset: 3px;
}

.p2s-file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.p2s-drop-title {
  font-weight: 600;
}

.p2s-drop-sub {
  font-size: 0.9rem;
  color: var(--ink-muted, #9a9a9a);
}

.p2s-panel {
  border-radius: var(--radius-lg, 20px);
  padding: 1.25rem;
  margin: 0;
}

/* Modus-Auswahl */
.p2s-modes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.p2s-mode {
  position: relative;
  display: grid;
  gap: 0.2rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
  border-radius: var(--radius-md, 14px);
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.p2s-mode input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.p2s-mode small {
  color: var(--ink-muted, #9a9a9a);
}

.p2s-mode.active {
  border-color: var(--gold, #c9a14a);
  background: color-mix(in srgb, var(--gold, #c9a14a) 10%, transparent);
}

.p2s-mode:focus-within {
  outline: 2px solid var(--gold, #c9a14a);
  outline-offset: 2px;
}

/* Regler */
.p2s-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem 1.5rem;
}

.p2s-field {
  display: grid;
  gap: 0.35rem;
  font-size: 0.9rem;
}

.p2s-field > span {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.p2s-field output {
  color: var(--gold, #c9a14a);
  font-variant-numeric: tabular-nums;
}

.p2s-field small {
  color: var(--ink-muted, #9a9a9a);
  font-size: 0.78rem;
}

.p2s-field input[type='range'] {
  width: 100%;
  accent-color: var(--gold, #c9a14a);
}

.p2s-input {
  font: inherit;
  font-size: 0.9rem;
  padding: 0.45rem 0.7rem;
  border-radius: 8px;
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
  background: var(--glass-bg-strong, rgba(0, 0, 0, 0.2));
  color: inherit;
}

/* Vergleich */
.p2s-compare {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

.p2s-compare figcaption {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.p2s-compare figcaption small {
  font-weight: 400;
  color: var(--ink-muted, #9a9a9a);
}

/* Schachbrett-Hintergrund, damit Transparenz sichtbar ist */
.p2s-preview {
  position: relative;
  display: grid;
  place-items: center;
  height: min(55vh, 520px);
  min-height: 240px;
  padding: 1rem;
  border-radius: var(--radius-md, 14px);
  overflow: hidden;
  background-color: #e9e9e9;
  background-image:
    linear-gradient(45deg, #cfcfcf 25%, transparent 25%),
    linear-gradient(-45deg, #cfcfcf 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #cfcfcf 75%),
    linear-gradient(-45deg, transparent 75%, #cfcfcf 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
}

.p2s-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: opacity 0.2s ease;
}

.p2s-preview.is-busy img {
  opacity: 0.35;
}

.p2s-busy {
  position: absolute;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 0.85rem;
}

.p2s-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.p2s-msg {
  margin: 1rem 0 0;
  font-size: 0.85rem;
  color: var(--ink-muted, #9a9a9a);
}

.p2s-error {
  margin: 0;
  color: #e5675a;
}

@media (max-width: 800px) {
  .p2s-compare {
    grid-template-columns: 1fr;
  }

  .p2s-preview {
    height: 40vh;
  }
}

@media (prefers-reduced-motion: reduce) {
  .p2s-drop,
  .p2s-mode,
  .p2s-preview img {
    transition: none;
  }
}
</style>
