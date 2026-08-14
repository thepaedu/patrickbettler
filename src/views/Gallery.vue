<script setup>
import { ref, nextTick } from 'vue'
import { useHead } from '@unhead/vue'
import gsap from 'gsap'
import { galleryImages } from '../data/gallery'
import { withBase } from '../utils/url'

useHead({
  title: 'Galerie – Patrick Bettler',
  meta: [{ name: 'description', content: 'Bildergalerie von Patrick Bettler.' }],
})

const activeImage = ref(null)
const overlayRef = ref(null)
const panelRef = ref(null)

async function openImage(image) {
  activeImage.value = image
  await nextTick()
  gsap.fromTo(overlayRef.value, { opacity: 0 }, { opacity: 1, duration: 0.25 })
  gsap.fromTo(
    panelRef.value,
    { opacity: 0, scale: 0.92 },
    { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' },
  )
}

function closeImage() {
  gsap.to(panelRef.value, { opacity: 0, scale: 0.92, duration: 0.2 })
  gsap.to(overlayRef.value, {
    opacity: 0,
    duration: 0.2,
    delay: 0.05,
    onComplete: () => {
      activeImage.value = null
    },
  })
}
</script>

<template>
  <div class="container page">
    <h1>Galerie</h1>

    <p v-if="!galleryImages.length" class="empty">
      Noch keine Bilder – ergänze Einträge in <code>src/data/gallery.js</code>.
    </p>

    <div class="grid">
      <button
        v-for="image in galleryImages"
        :key="image.src"
        class="thumb glass"
        @click="openImage(image)"
      >
        <img :src="withBase(image.src)" :alt="image.alt" />
        <span v-if="image.caption" class="caption">{{ image.caption }}</span>
      </button>
    </div>

    <div v-if="activeImage" class="overlay" ref="overlayRef" @click.self="closeImage">
      <div class="panel glass" ref="panelRef">
        <button class="close" @click="closeImage" aria-label="Schliessen">&times;</button>
        <img :src="withBase(activeImage.src)" :alt="activeImage.alt" />
        <p v-if="activeImage.caption">{{ activeImage.caption }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 3rem 1.5rem 5rem;
}

h1 {
  text-align: center;
  margin-bottom: 2.5rem;
}

.empty {
  text-align: center;
  color: var(--ink-muted);
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

.thumb {
  position: relative;
  padding: 0;
  border: 1px solid var(--glass-border);
  overflow: hidden;
  cursor: pointer;
  background: var(--glass-bg);
}

.thumb img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;
}

.thumb:hover img {
  transform: scale(1.06);
}

.caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.55), transparent);
  text-align: left;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 8, 10, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1.5rem;
}

.panel {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  padding: 1.5rem;
  text-align: center;
}

.panel img {
  max-width: 100%;
  max-height: 70vh;
  border-radius: var(--radius-md);
  display: block;
  margin: 0 auto 0.75rem;
}

.close {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  background: none;
  border: none;
  color: var(--ink);
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
}

/* Tablet */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1100px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Grosse Bildschirme */
@media (min-width: 1400px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
