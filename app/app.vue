<script setup>
import burgerIcon from '~/assets/burger-simple.svg'

// Stabile URL statt des gehashten Vite-Dateinamens (…-BNCAPXrR.jpg):
// Nuxt legt Assets unter /_nuxt/ mit neuem Hash ab, der alte Link wäre tot.
// Dafür liegt eine Kopie des Profilbilds in public/images/.
const siteUrl = 'https://thepaedu.github.io/patrickbettler/'
const ogImage = `${siteUrl}images/patrick-bettler.jpg`

// Site-weite Defaults. Einzelne Seiten überschreiben nur title/description.
useHead({
  meta: [
    { property: 'og:title', content: 'Patrick Bettler' },
    { property: 'og:description', content: 'Offizielle Webseite von Patrick Bettler.' },
    { property: 'og:image', content: ogImage },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Patrick Bettler',
        url: siteUrl,
        image: ogImage,
        sameAs: [
          'https://www.instagram.com/patrick_bettler/',
          'https://github.com/thepaedu/patrickbettler/',
        ],
      }),
    },
  ],
})

const menuOpen = ref(false)

// Höhe der Navigation (inkl. Abstand oben) als CSS-Variable --nav-offset
// bereitstellen. Seiten mit Vollbild-Hero (z.B. Projekt-Detail) ziehen ihr
// Bild damit genau hinter die Navigation. Der ResizeObserver hält den Wert
// aktuell, wenn sich die Nav-Höhe ändert (z.B. Mobile ↔ Desktop).
const navRef = ref(null)
let navObserver

function updateNavOffset() {
  const el = navRef.value
  if (!el) return
  const marginTop = parseFloat(getComputedStyle(el).marginTop) || 0
  document.documentElement.style.setProperty(
    '--nav-offset',
    `${el.offsetHeight + marginTop}px`,
  )
}

// ---------------------------------------------------------------------------
// Mobiles Vollbild-Menü
// ---------------------------------------------------------------------------

const route = useRoute()

// Beim Seitenwechsel schliessen (auch bei Zurück/Vor im Browser)
watch(() => route.fullPath, () => {
  menuOpen.value = false
})

// Seite dahinter nicht scrollen lassen, solange das Menü offen ist
watch(menuOpen, (open) => {
  document.documentElement.classList.toggle('menu-open', open)
})

function onKeydown(event) {
  if (event.key === 'Escape') menuOpen.value = false
}

// Wird das Fenster breiter als die Mobile-Ansicht, Menü schliessen
let desktopQuery
function onDesktopChange(event) {
  if (event.matches) menuOpen.value = false
}

onMounted(() => {
  updateNavOffset()
  navObserver = new ResizeObserver(updateNavOffset)
  navObserver.observe(navRef.value)

  window.addEventListener('keydown', onKeydown)
  desktopQuery = window.matchMedia('(min-width: 641px)')
  desktopQuery.addEventListener('change', onDesktopChange)
})

onBeforeUnmount(() => {
  navObserver?.disconnect()
  window.removeEventListener('keydown', onKeydown)
  desktopQuery?.removeEventListener('change', onDesktopChange)
  document.documentElement.classList.remove('menu-open')
})

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/blog', label: 'Blog' },
  { to: '/galerie', label: 'Galerie' },
  { to: '/projekte', label: 'Projekte' },
  { to: '/tools', label: 'Tools' },
]
</script>

<template>
  <header ref="navRef" class="navbar glass">
    <div class="navbar-inner container">
      <NuxtLink to="/" class="brand">Patrick Bettler</NuxtLink>

      <!-- Desktop-Navigation -->
      <nav class="nav-links" aria-label="Hauptnavigation">
        <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to">
          {{ link.label }}
        </NuxtLink>
      </nav>

      <!-- Burger (nur Mobile): wird zum X, solange das Menü offen ist -->
      <button
        class="burger"
        type="button"
        :aria-label="menuOpen ? 'Menü schliessen' : 'Menü öffnen'"
        :aria-expanded="menuOpen"
        aria-controls="mobile-menu"
        @click="menuOpen = !menuOpen"
      >
        <svg
          v-if="menuOpen"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
        <img v-else :src="burgerIcon" alt="" />
      </button>
    </div>
  </header>

  <!-- Mobiles Vollbild-Menü. Bewusst AUSSERHALB des <header>: Der Glas-Effekt
       (backdrop-filter) der Navigation würde position: fixed sonst auf die
       Navigation statt auf den ganzen Bildschirm beziehen. -->
  <Transition name="menu">
    <nav
      v-if="menuOpen"
      id="mobile-menu"
      class="mobile-menu"
      aria-label="Hauptnavigation"
    >
      <ul>
        <li v-for="(link, i) in navLinks" :key="link.to" :style="{ '--i': i }">
          <NuxtLink :to="link.to" @click="menuOpen = false">
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </Transition>

  <main>
    <NuxtPage />
  </main>
</template>

<style>
/* Startwert für --nav-offset, bis JavaScript die echte Höhe gemessen hat
   (1rem Abstand oben + ca. 3rem Navigation auf Desktop). */
:root {
  --nav-offset: 4rem;
}

/* Solange das mobile Menü offen ist, scrollt die Seite dahinter nicht */
html.menu-open {
  overflow: hidden;
}

/* Seitenwechsel-Animation (app.pageTransition in nuxt.config.ts).
   Muss global sein, weil Nuxt die Klassen auf die Seitenkomponenten setzt. */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style scoped>
.navbar {
  position: sticky;
  top: 1rem;
  margin: 1rem auto 0;
  /* Immer 1rem Abstand links und rechts, auch auf schmalen Bildschirmen */
  width: calc(100% - 2rem);
  max-width: var(--container-w);
  border-radius: var(--radius-lg);
  z-index: 40;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
}

.brand {
  font-weight: 600;
  text-decoration: none;
  letter-spacing: 0.01em;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  text-decoration: none;
  font-size: 0.9rem;
  color: var(--ink-muted);
  transition: color 0.2s ease;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--gold);
}

.burger {
  display: none;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
}

.burger img {
  display: block;
  width: 24px;
  height: 24px;
}

main {
  min-height: 60vh;
}

/* Mobiles Vollbild-Menü: liegt unter der Navigation (z-index 40),
   damit Logo und X-Button sichtbar und bedienbar bleiben. */
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 39;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(var(--nav-offset) + 1rem) 1.5rem 2rem;
  background: rgba(8, 11, 14, 0.92);
  backdrop-filter: blur(var(--glass-blur, 16px));
  -webkit-backdrop-filter: blur(var(--glass-blur, 16px));
  overflow-y: auto;
}

.mobile-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
}

.mobile-menu a {
  font-size: clamp(1.75rem, 8vw, 2.5rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  text-decoration: none;
  color: var(--ink);
  transition: color 0.2s ease;
}

.mobile-menu a:hover,
.mobile-menu a.router-link-active {
  color: var(--gold);
}

/* Ein- und Ausblenden: Hintergrund blendet, Links gleiten nacheinander herein */
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.25s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}

.menu-enter-active li {
  transition: opacity 0.35s ease, transform 0.35s ease;
  transition-delay: calc(0.05s + var(--i) * 0.06s);
}

.menu-enter-from li {
  opacity: 0;
  transform: translateY(14px);
}

.burger svg {
  display: block;
  width: 24px;
  height: 24px;
  color: var(--ink);
}

@media (max-width: 640px) {
  .nav-links {
    display: none;
  }

  .burger {
    display: flex;
  }
}

/* Auf dem Desktop gibt es das Vollbild-Menü nie */
@media (min-width: 641px) {
  .mobile-menu {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .menu-enter-active,
  .menu-leave-active,
  .menu-enter-active li {
    transition: none;
  }
}
</style>