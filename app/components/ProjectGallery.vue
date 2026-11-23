<script setup>
// Bildergalerie für Projekt-Detailseiten:
// Vorschaubilder im Raster, Klick öffnet eine Vollbild-Ansicht (Lightbox)
// mit Blättern per Pfeiltasten, Buttons oder Wischen auf dem Handy.

const props = defineProps({
  // [{ src, caption }]
  images: { type: Array, required: true },
  title: { type: String, default: '' },
})

const activeIndex = ref(null) // null = Lightbox geschlossen
const isOpen = computed(() => activeIndex.value !== null)
const active = computed(() => (isOpen.value ? props.images[activeIndex.value] : null))
const hasMany = computed(() => props.images.length > 1)

function altText(image, index) {
  return image.caption || `${props.title} – Bild ${index + 1}`
}

function open(index) {
  activeIndex.value = index
}

function close() {
  activeIndex.value = null
}

function next() {
  if (!hasMany.value) return
  activeIndex.value = (activeIndex.value + 1) % props.images.length
}

function prev() {
  if (!hasMany.value) return
  activeIndex.value = (activeIndex.value - 1 + props.images.length) % props.images.length
}

// Tastatur: ← → zum Blättern, Esc zum Schliessen
function onKeydown(event) {
  if (!isOpen.value) return
  if (event.key === 'Escape') close()
  else if (event.key === 'ArrowRight') next()
  else if (event.key === 'ArrowLeft') prev()
}

// Wischen auf dem Handy (horizontal mind. 50px, und mehr seitlich als vertikal)
let touchStart = null
function onTouchStart(event) {
  const t = event.changedTouches[0]
  touchStart = { x: t.clientX, y: t.clientY }
}
function onTouchEnd(event) {
  if (!touchStart) return
  const t = event.changedTouches[0]
  const dx = t.clientX - touchStart.x
  const dy = t.clientY - touchStart.y
  touchStart = null
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
    dx < 0 ? next() : prev()
  }
}

// Seite dahinter nicht scrollen lassen, solange die Lightbox offen ist
watch(isOpen, (openNow) => {
  document.documentElement.style.overflow = openNow ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <section class="gallery" aria-label="Bilder zum Projekt">
    <h2>Bilder</h2>

    <ul class="grid" :class="{ single: !hasMany }">
      <li v-for="(image, i) in images" :key="image.src">
        <button type="button" class="thumb" @click="open(i)">
          <img :src="withBase(image.src)" :alt="altText(image, i)" loading="lazy" />
        </button>
        <span v-if="image.caption" class="thumb-caption">{{ image.caption }}</span>
      </li>
    </ul>

    <!-- In den <body> verschoben, damit die Lightbox unabhängig vom
         Seitenlayout (overflow, z-index) über allem liegt -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="isOpen"
          class="lightbox"
          role="dialog"
          aria-modal="true"
          :aria-label="altText(active, activeIndex)"
          @click.self="close"
          @touchstart.passive="onTouchStart"
          @touchend="onTouchEnd"
        >
          <button type="button" class="lb-btn lb-close" aria-label="Schliessen" @click="close">
            &times;
          </button>

          <button
            v-if="hasMany"
            type="button"
            class="lb-btn lb-prev"
            aria-label="Vorheriges Bild"
            @click="prev"
          >
            &#8249;
          </button>

          <figure class="lb-figure" @click.self="close">
            <img
              :key="active.src"
              :src="withBase(active.src)"
              :alt="altText(active, activeIndex)"
              class="lb-image"
            />
            <figcaption v-if="active.caption || hasMany">
              <span v-if="active.caption">{{ active.caption }}</span>
              <span v-if="hasMany" class="lb-counter">
                {{ activeIndex + 1 }} / {{ images.length }}
              </span>
            </figcaption>
          </figure>

          <button
            v-if="hasMany"
            type="button"
            class="lb-btn lb-next"
            aria-label="Nächstes Bild"
            @click="next"
          >
            &#8250;
          </button>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.gallery {
  margin-top: 2.5rem;
}

.gallery h2 {
  margin: 0 0 1rem;
  color: var(--gold);
}

/* Raster mit Vorschaubildern */
.grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

/* Nur ein Bild: gross über die ganze Breite */
.grid.single {
  grid-template-columns: 1fr;
}

.thumb {
  display: block;
  width: 100%;
  padding: 0;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--glass-bg);
  cursor: zoom-in;
}

.thumb img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.grid.single .thumb img {
  aspect-ratio: 16 / 9;
}

.thumb:hover img,
.thumb:focus-visible img {
  transform: scale(1.05);
}

.thumb:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
}

.thumb-caption {
  display: block;
  margin-top: 0.4rem;
  font-size: 0.8rem;
  color: var(--ink-muted);
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 60; /* über der Navigation (40) */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 4.5rem;
  background: rgba(5, 8, 10, 0.92);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.lb-figure {
  margin: 0;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.lb-image {
  display: block;
  max-width: 100%;
  max-height: calc(100vh - 9rem);
  max-height: calc(100dvh - 9rem);
  object-fit: contain;
  border-radius: var(--radius-md);
  user-select: none;
  animation: lb-in 0.25s ease;
}

@keyframes lb-in {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
}

.lb-figure figcaption {
  display: flex;
  gap: 1rem;
  align-items: baseline;
  justify-content: center;
  flex-wrap: wrap;
  color: #eee;
  font-size: 0.9rem;
  text-align: center;
}

.lb-counter {
  color: #aaa;
  font-variant-numeric: tabular-nums;
}

.lb-btn {
  position: absolute;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.lb-btn:hover,
.lb-btn:focus-visible {
  background: rgba(0, 0, 0, 0.7);
  border-color: var(--gold);
}

.lb-close {
  top: 1rem;
  right: 1rem;
}

.lb-prev {
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.lb-next {
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

/* Mobile: zwei Spalten, Pfeile unten statt seitlich (Bild nutzt volle Breite) */
@media (max-width: 600px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.6rem;
  }

  .lightbox {
    padding: 3.75rem 0.75rem 5rem;
  }

  .lb-image {
    max-height: calc(100vh - 10rem);
    max-height: calc(100dvh - 10rem);
  }

  .lb-prev,
  .lb-next {
    top: auto;
    bottom: 1rem;
    transform: none;
  }

  .lb-prev {
    left: calc(50% - 3.25rem);
  }

  .lb-next {
    right: calc(50% - 3.25rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .thumb img,
  .lb-image {
    transition: none;
    animation: none;
  }
}
</style>
