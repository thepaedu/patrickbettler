<script setup>
useHead({
  title: 'Tools – Patrick Bettler',
  meta: [
    {
      name: 'description',
      content:
        'Kleine Web-Tools von Patrick Bettler: 3D-Viewer, Bildbearbeitung und mehr. Alles läuft direkt im Browser.',
    },
  ],
})

// Neues Tool: hier eintragen und die Route in nuxt.config.ts (prerender.routes) ergänzen.
// icon = Inhalt eines 24×24-SVGs (Linien in currentColor)
const tools = [
  {
    to: '/stl-viewer',
    title: 'STL-Viewer',
    description: '3D-Modelle für den 3D-Druck ansehen, drehen und vermessen, inklusive Volumen.',
    category: '3D',
    icon: '<path d="M12 2.5l8.5 4.75v9.5L12 21.5l-8.5-4.75v-9.5z"/><path d="M12 21.5V12M20.5 7.25L12 12 3.5 7.25"/>',
  },
  {
    to: '/glb-viewer',
    title: 'GLB-Viewer',
    description: 'glTF-Modelle mit Materialien, Texturen und Animationen im Browser anzeigen.',
    category: '3D',
    icon: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12.5l9 5 9-5"/><path d="M3 16.5l9 5 9-5"/>',
  },
  {
    to: '/png-to-svg',
    title: 'PNG zu SVG',
    description: 'Pixelbilder wie Logos und Icons in skalierbare Vektorgrafiken umwandeln.',
    category: 'Bild',
    icon: '<path d="M4 18C7 8 17 16 20 6"/><rect x="2.5" y="16.5" width="3" height="3" rx=".5"/><rect x="18.5" y="4.5" width="3" height="3" rx=".5"/><path d="M5.5 18H10M14 6h4.5"/>',
  },
  {
    to: '/bild-erweitern',
    title: 'Bild erweitern',
    description: 'Bildränder nach aussen ziehen und mit den Pixeln der Kante auffüllen.',
    category: 'Bild',
    icon: '<rect x="8" y="8" width="8" height="8" rx="1"/><path d="M2.5 12h3M18.5 12h3M12 2.5v3M12 18.5v3"/><path d="M4 10.5L2.5 12 4 13.5M20 10.5l1.5 1.5-1.5 1.5M10.5 4L12 2.5 13.5 4M10.5 20l1.5 1.5 1.5-1.5"/>',
  },
  {
    to: '/instagram-check',
    title: 'Instagram-Check',
    description: 'Finde heraus, wer dir auf Instagram nicht zurückfolgt, mit PDF-Export.',
    category: 'Social Media',
    icon: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/>',
  },
]
</script>

<template>
  <div class="container page">
    <header class="intro">
      <h1>Tools</h1>
      <p>
        Kleine Werkzeuge, die ich für mich gebaut habe und die vielleicht auch dir helfen.
      </p>
      <p class="privacy">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
          <rect x="5" y="10.5" width="14" height="10" rx="2" />
          <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
        </svg>
        Alle Tools laufen direkt in deinem Browser. Deine Dateien werden nirgends hochgeladen.
      </p>
    </header>

    <ul class="grid">
      <li v-for="tool in tools" :key="tool.to">
        <NuxtLink :to="tool.to" class="tool-link">
          <GlassCard class="tool">
            <div class="tool-head">
              <span class="icon">
                <!-- eigene, feste SVG-Pfade aus der Liste oben -->
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  v-html="tool.icon"
                ></svg>
              </span>
              <span class="tag">{{ tool.category }}</span>
            </div>
            <h2>{{ tool.title }}</h2>
            <p>{{ tool.description }}</p>
            <span class="open" aria-hidden="true">Öffnen &rarr;</span>
          </GlassCard>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.page {
  padding: 3rem 1.5rem 5rem;
}

.intro {
  text-align: center;
  margin-bottom: 2.5rem;
}

.intro h1 {
  margin: 0 0 1rem;
}

.intro p {
  max-width: 56ch;
  margin: 0 auto 0.75rem;
}

.privacy {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--ink-muted);
  font-size: 0.9rem;
}

.privacy svg {
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
  color: var(--gold);
}

.grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.tool-link {
  display: block;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.tool {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  text-align: left;
}

.tool-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.1rem;
}

.icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  background: color-mix(in srgb, var(--gold) 10%, transparent);
  color: var(--gold);
}

.icon svg {
  width: 26px;
  height: 26px;
}

.tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  color: var(--ink-muted);
}

h2 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
}

.tool p {
  margin: 0 0 1.25rem;
  color: var(--ink-muted);
  font-size: 0.9rem;
  line-height: 1.55;
}

/* "Öffnen" unten bündig, auch wenn Texte unterschiedlich lang sind */
.open {
  margin-top: auto;
  font-size: 0.85rem;
  color: var(--gold);
  transition: transform 0.2s ease;
}

.tool-link:hover .open,
.tool-link:focus-visible .open {
  transform: translateX(4px);
}

.tool-link:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 4px;
  border-radius: var(--radius-lg);
}

@media (max-width: 600px) {
  .page {
    padding: 2rem 1rem 3rem;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .open {
    transition: none;
  }
}
</style>
