<script setup>
useHead({
  title: 'Bild erweitern – Patrick Bettler',
  meta: [
    {
      name: 'description',
      content:
        'Bilder direkt im Browser vergrössern: Kante wählen, nach aussen ziehen, fertig. Der Rand wird mit den Pixeln der Kante aufgefüllt.',
    },
  ],
})

// Grösste erlaubte Kantenlänge des Ergebnisses (Browser-Canvas-Grenzen)
const MAX_SIDE = 8000
const SIDES = ['top', 'right', 'bottom', 'left']
const sideLabels = { top: 'Oben', right: 'Rechts', bottom: 'Unten', left: 'Links' }

// ---------------------------------------------------------------------------
// Zustand
// ---------------------------------------------------------------------------

const stageRef = ref(null)
const canvasRef = ref(null)

const image = shallowRef(null) // geladenes HTMLImageElement
const info = ref(null) // { name, width, height }
const error = ref('')
const dropping = ref(false)

// Erweiterung pro Seite in Bildpixeln
const ext = reactive({ top: 0, right: 0, bottom: 0, left: 0 })

// Darstellung: Massstab und Position des Bildes in der Arbeitsfläche (Bildschirmpixel)
const view = reactive({ scale: 1, x: 0, y: 0 })

const activeSide = ref(null) // Kante, an der gerade gezogen wird

const outWidth = computed(() => (info.value ? info.value.width + ext.left + ext.right : 0))
const outHeight = computed(() => (info.value ? info.value.height + ext.top + ext.bottom : 0))
const isExtended = computed(() => SIDES.some((s) => ext[s] > 0))

// ---------------------------------------------------------------------------
// Bild laden
// ---------------------------------------------------------------------------

async function loadFile(file) {
  if (!file) return
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    error.value = `„${file.name}“ ist kein unterstütztes Bild (PNG, JPG, WebP, GIF).`
    return
  }
  error.value = ''

  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('Das Bild konnte nicht geöffnet werden.'))
      el.src = url
    })

    if (img.naturalWidth > MAX_SIDE || img.naturalHeight > MAX_SIDE) {
      throw new Error(`Das Bild ist zu gross (max. ${MAX_SIDE} px pro Seite).`)
    }

    image.value = img
    info.value = { name: file.name, width: img.naturalWidth, height: img.naturalHeight }
    for (const s of SIDES) ext[s] = 0

    await nextTick()
    render()
    fitView()
  } catch (e) {
    error.value = e?.message || 'Das Bild konnte nicht gelesen werden.'
  } finally {
    URL.revokeObjectURL(url)
  }
}

// ---------------------------------------------------------------------------
// Zeichnen: Original in die Mitte, Ränder mit den Kantenpixeln auffüllen
// ---------------------------------------------------------------------------

function render() {
  const img = image.value
  const canvas = canvasRef.value
  if (!img || !canvas) return

  const w = info.value.width
  const h = info.value.height
  const { top: t, right: r, bottom: b, left: l } = ext

  canvas.width = w + l + r
  canvas.height = h + t + b
  const ctx = canvas.getContext('2d')
  // Ohne Glättung: Die 1 Pixel breite Kante wird exakt gestreckt,
  // ohne dass Nachbarpixel hineinverschwimmen.
  ctx.imageSmoothingEnabled = false

  // Original
  ctx.drawImage(img, l, t)

  // Seiten: jeweils die äusserste Pixelreihe/-spalte nach aussen strecken
  if (l) ctx.drawImage(img, 0, 0, 1, h, 0, t, l, h)
  if (r) ctx.drawImage(img, w - 1, 0, 1, h, l + w, t, r, h)
  if (t) ctx.drawImage(img, 0, 0, w, 1, l, 0, w, t)
  if (b) ctx.drawImage(img, 0, h - 1, w, 1, l, t + h, w, b)

  // Ecken: mit dem jeweiligen Eckpixel füllen
  if (t && l) ctx.drawImage(img, 0, 0, 1, 1, 0, 0, l, t)
  if (t && r) ctx.drawImage(img, w - 1, 0, 1, 1, l + w, 0, r, t)
  if (b && l) ctx.drawImage(img, 0, h - 1, 1, 1, 0, t + h, l, b)
  if (b && r) ctx.drawImage(img, w - 1, h - 1, 1, 1, l + w, t + h, r, b)
}

// Ganzes Bild mittig in die Arbeitsfläche einpassen, mit Rand zum Weiterziehen
function fitView() {
  const stage = stageRef.value
  if (!stage || !info.value) return
  const sw = stage.clientWidth
  const sh = stage.clientHeight
  const pad = Math.max(40, Math.min(sw, sh) * 0.14)

  view.scale = Math.min(1, (sw - pad * 2) / outWidth.value, (sh - pad * 2) / outHeight.value)
  view.x = (sw - outWidth.value * view.scale) / 2
  view.y = (sh - outHeight.value * view.scale) / 2
}

// Rendern gebündelt pro Bildschirm-Frame (beim Ziehen kommen viele Events)
let frame = 0
function scheduleRender() {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    render()
  })
}

// ---------------------------------------------------------------------------
// Kanten ziehen
// ---------------------------------------------------------------------------

// Begrenzt einen Wert so, dass das Ergebnis MAX_SIDE nicht überschreitet
function clampExt(side, value) {
  const v = Math.max(0, Math.round(Number(value) || 0))
  const horizontal = side === 'left' || side === 'right'
  const other = horizontal
    ? ext[side === 'left' ? 'right' : 'left'] + info.value.width
    : ext[side === 'top' ? 'bottom' : 'top'] + info.value.height
  return Math.min(v, MAX_SIDE - other)
}

let drag = null

function startDrag(side, event) {
  if (event.button !== undefined && event.button !== 0) return
  event.preventDefault()
  event.currentTarget.setPointerCapture(event.pointerId)
  activeSide.value = side
  drag = {
    side,
    startX: event.clientX,
    startY: event.clientY,
    startExt: ext[side],
    startViewX: view.x,
    startViewY: view.y,
  }
}

function onDrag(event) {
  if (!drag) return
  const { side } = drag

  // Bewegung nach aussen = positiv
  const delta =
    side === 'left'
      ? drag.startX - event.clientX
      : side === 'right'
        ? event.clientX - drag.startX
        : side === 'top'
          ? drag.startY - event.clientY
          : event.clientY - drag.startY

  const value = clampExt(side, drag.startExt + delta / view.scale)
  ext[side] = value

  // Beim Ziehen links/oben wächst das Bild in diese Richtung:
  // Position anpassen, damit das Original an Ort und Stelle bleibt.
  if (side === 'left') view.x = drag.startViewX - (value - drag.startExt) * view.scale
  if (side === 'top') view.y = drag.startViewY - (value - drag.startExt) * view.scale

  scheduleRender()
}

function endDrag() {
  if (!drag) return
  drag = null
  activeSide.value = null
  fitView() // nach dem Loslassen wieder alles einpassen
}

// Tastatur: Pfeiltasten an der gewählten Kante (Shift = 10 px)
function onHandleKey(side, event) {
  const outward = {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    top: 'ArrowUp',
    bottom: 'ArrowDown',
  }[side]
  const inward = {
    left: 'ArrowRight',
    right: 'ArrowLeft',
    top: 'ArrowDown',
    bottom: 'ArrowUp',
  }[side]
  if (event.key !== outward && event.key !== inward) return
  event.preventDefault()
  const step = event.shiftKey ? 10 : 1
  setExt(side, ext[side] + (event.key === outward ? step : -step))
}

// Eingabe über Zahlenfelder, Tastatur oder Zurücksetzen
function setExt(side, value) {
  ext[side] = clampExt(side, value)
  render()
  fitView()
}

function resetAll() {
  for (const s of SIDES) ext[s] = 0
  render()
  fitView()
}

// ---------------------------------------------------------------------------
// Herunterladen
// ---------------------------------------------------------------------------

const downloading = ref(false)

function download() {
  const canvas = canvasRef.value
  if (!canvas) return
  downloading.value = true
  canvas.toBlob((blob) => {
    downloading.value = false
    if (!blob) {
      error.value = 'Das Bild konnte nicht erstellt werden.'
      return
    }
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = info.value.name.replace(/\.[^.]+$/, '') + '-erweitert.png'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }, 'image/png')
}

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

function onInputChange(event) {
  loadFile(event.target.files?.[0])
  event.target.value = ''
}

function onDrop(event) {
  dropping.value = false
  loadFile(event.dataTransfer?.files?.[0])
}

function onDragLeave(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) dropping.value = false
}

// Arbeitsfläche ändert ihre Grösse (Fenster, Handy drehen) → neu einpassen
let resizeObserver
onMounted(() => {
  resizeObserver = new ResizeObserver(() => {
    if (!drag) fitView()
  })
  resizeObserver.observe(stageRef.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  cancelAnimationFrame(frame)
})

// ---------------------------------------------------------------------------
// Positionen für die Darstellung
// ---------------------------------------------------------------------------

const frameStyle = computed(() => ({
  left: `${view.x}px`,
  top: `${view.y}px`,
  width: `${outWidth.value * view.scale}px`,
  height: `${outHeight.value * view.scale}px`,
}))

// gestrichelter Rahmen um das Originalbild
const originalStyle = computed(() =>
  info.value
    ? {
        left: `${ext.left * view.scale}px`,
        top: `${ext.top * view.scale}px`,
        width: `${info.value.width * view.scale}px`,
        height: `${info.value.height * view.scale}px`,
      }
    : {},
)
</script>

<template>
  <section class="ext container">
    <header class="ext-intro">
      <h1>Bild erweitern</h1>
      <p>
        Lade ein Bild hoch, fasse eine Kante an und ziehe sie nach aussen. Der neue Bereich
        wird mit den Pixeln dieser Kante aufgefüllt, ideal für einfarbige oder verlaufende
        Hintergründe.
      </p>
      <p class="ext-privacy">
        Alles passiert in deinem Browser. Dein Bild wird nirgends hochgeladen.
      </p>
    </header>

    <label
      class="glass ext-drop"
      :class="{ 'is-dragging': dropping, 'is-compact': image }"
      @dragenter.prevent="dropping = true"
      @dragover.prevent="dropping = true"
      @dragleave="onDragLeave"
      @drop.prevent="onDrop"
    >
      <input
        type="file"
        class="ext-file-input"
        accept="image/png,image/jpeg,image/webp,image/gif"
        @change="onInputChange"
      />
      <span class="ext-drop-title">
        {{ image ? 'Anderes Bild hierher ziehen oder klicken' : 'Bild hierher ziehen' }}
      </span>
      <span v-if="!image" class="ext-drop-sub">oder klicken, um ein Bild auszuwählen</span>
    </label>

    <p v-if="error" class="ext-msg ext-error" role="alert">{{ error }}</p>

    <div v-show="image" class="glass ext-panel">
      <!-- Arbeitsfläche -->
      <div ref="stageRef" class="ext-stage">
        <div v-if="info" class="ext-frame" :style="frameStyle">
          <canvas ref="canvasRef" class="ext-canvas"></canvas>
          <div class="ext-original" :style="originalStyle" aria-hidden="true"></div>

          <!-- Anfasser an allen vier Kanten -->
          <button
            v-for="side in SIDES"
            :key="side"
            type="button"
            class="ext-handle"
            :class="[`ext-handle-${side}`, { active: activeSide === side }]"
            :aria-label="`Kante ${sideLabels[side]} ziehen (Pfeiltasten: 1 px, mit Shift: 10 px)`"
            @pointerdown="startDrag(side, $event)"
            @pointermove="onDrag"
            @pointerup="endDrag"
            @pointercancel="endDrag"
            @keydown="onHandleKey(side, $event)"
          >
            <span class="ext-grip"></span>
          </button>
        </div>
      </div>

      <!-- Feineinstellung in Pixeln -->
      <div v-if="info" class="ext-controls">
        <label v-for="side in SIDES" :key="side" class="ext-field">
          <span>{{ sideLabels[side] }}</span>
          <input
            type="number"
            min="0"
            step="1"
            class="ext-input"
            :value="ext[side]"
            @change="setExt(side, $event.target.value)"
          />
          <small>px</small>
        </label>
      </div>

      <div v-if="info" class="ext-footer">
        <p class="ext-size">
          {{ info.width }} × {{ info.height }} px
          <template v-if="isExtended">
            → <strong>{{ outWidth }} × {{ outHeight }} px</strong>
          </template>
        </p>
        <div class="ext-actions">
          <button type="button" class="btn" :disabled="!isExtended" @click="resetAll">
            Zurücksetzen
          </button>
          <button
            type="button"
            class="btn primary"
            :disabled="!isExtended || downloading"
            @click="download"
          >
            {{ downloading ? 'Wird erstellt …' : 'Als PNG herunterladen' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ext {
  text-align: left;
  padding-top: 3rem;
  padding-bottom: 4rem;
  display: grid;
  gap: 1.5rem;
}

.ext-intro h1 {
  margin: 0 0 1rem;
  font-size: clamp(2rem, 5vw, 3rem);
}

.ext-intro p {
  max-width: 62ch;
  margin: 0 0 0.75rem;
}

.ext-privacy {
  color: var(--ink-muted, #9a9a9a);
  font-size: 0.95rem;
}

/* Upload-Feld */
.ext-drop {
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

.ext-drop.is-compact {
  min-height: 0;
  padding: 1rem;
}

.ext-drop:hover,
.ext-drop.is-dragging {
  border-color: var(--gold, #c9a14a);
  background: color-mix(in srgb, var(--gold, #c9a14a) 8%, transparent);
}

.ext-drop:focus-within {
  outline: 2px solid var(--gold, #c9a14a);
  outline-offset: 3px;
}

.ext-file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.ext-drop-title {
  font-weight: 600;
}

.ext-drop-sub {
  font-size: 0.9rem;
  color: var(--ink-muted, #9a9a9a);
}

.ext-panel {
  border-radius: var(--radius-lg, 20px);
  padding: 1.25rem;
}

/* Arbeitsfläche */
.ext-stage {
  position: relative;
  height: min(65vh, 640px);
  min-height: 320px;
  border-radius: var(--radius-md, 14px);
  overflow: hidden;
  background: radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.3));
  touch-action: none;
  user-select: none;
}

.ext-frame {
  position: absolute;
  /* Schachbrett: macht transparente Bereiche sichtbar */
  background-color: #e9e9e9;
  background-image:
    linear-gradient(45deg, #cfcfcf 25%, transparent 25%),
    linear-gradient(-45deg, #cfcfcf 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #cfcfcf 75%),
    linear-gradient(-45deg, transparent 75%, #cfcfcf 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
}

.ext-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.ext-original {
  position: absolute;
  outline: 1px dashed rgba(255, 255, 255, 0.85);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35);
  pointer-events: none;
}

/* Anfasser: ganze Kante ist greifbar, mit Griff in der Mitte */
.ext-handle {
  position: absolute;
  display: grid;
  place-items: center;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  touch-action: none;
}

.ext-handle::before {
  content: '';
  position: absolute;
  background: var(--gold, #c9a14a);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.ext-handle:hover::before,
.ext-handle:focus-visible::before,
.ext-handle.active::before {
  opacity: 1;
}

.ext-handle:focus-visible {
  outline: none;
}

.ext-grip {
  position: relative;
  border-radius: 999px;
  background: var(--gold, #c9a14a);
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.ext-handle-left,
.ext-handle-right {
  top: 0;
  bottom: 0;
  width: 28px;
  cursor: ew-resize;
}

.ext-handle-left {
  left: -14px;
}

.ext-handle-right {
  right: -14px;
}

.ext-handle-left::before,
.ext-handle-right::before {
  top: 0;
  bottom: 0;
  left: 13px;
  width: 2px;
}

.ext-handle-left .ext-grip,
.ext-handle-right .ext-grip {
  width: 12px;
  height: 44px;
}

.ext-handle-top,
.ext-handle-bottom {
  left: 0;
  right: 0;
  height: 28px;
  cursor: ns-resize;
}

.ext-handle-top {
  top: -14px;
}

.ext-handle-bottom {
  bottom: -14px;
}

.ext-handle-top::before,
.ext-handle-bottom::before {
  left: 0;
  right: 0;
  top: 13px;
  height: 2px;
}

.ext-handle-top .ext-grip,
.ext-handle-bottom .ext-grip {
  width: 44px;
  height: 12px;
}

/* Zahlenfelder */
.ext-controls {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem 1rem;
  margin-top: 1.25rem;
}

.ext-field {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 0.25rem 0.4rem;
  font-size: 0.85rem;
}

.ext-field > span {
  grid-column: 1 / -1;
  color: var(--ink-muted, #9a9a9a);
}

.ext-field small {
  color: var(--ink-muted, #9a9a9a);
}

.ext-input {
  width: 100%;
  min-width: 0;
  font: inherit;
  padding: 0.45rem 0.6rem;
  border-radius: 8px;
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
  background: var(--glass-bg-strong, rgba(0, 0, 0, 0.2));
  color: inherit;
  font-variant-numeric: tabular-nums;
}

.ext-input:focus-visible {
  outline: 2px solid var(--gold, #c9a14a);
  outline-offset: 1px;
}

.ext-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.25rem;
}

.ext-size {
  margin: 0;
  color: var(--ink-muted, #9a9a9a);
  font-variant-numeric: tabular-nums;
}

.ext-size strong {
  color: var(--ink);
}

.ext-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.ext-actions .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ext-msg {
  margin: 0;
  font-size: 0.85rem;
  color: var(--ink-muted, #9a9a9a);
}

.ext-error {
  color: #e5675a;
}

@media (max-width: 600px) {
  .ext-stage {
    height: 55vh;
    min-height: 280px;
  }

  .ext-controls {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ext-actions,
  .ext-actions .btn {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ext-drop,
  .ext-handle::before {
    transition: none;
  }
}
</style>
