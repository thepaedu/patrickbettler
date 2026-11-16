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
const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/blog', label: 'Blog' },
  { to: '/galerie', label: 'Galerie' },
  { to: '/projekte', label: 'Projekte' },
]
</script>

<template>
  <header class="navbar glass">
    <div class="navbar-inner container">
      <NuxtLink to="/" class="brand">Patrick Bettler</NuxtLink>

      <nav class="nav-links" :class="{ open: menuOpen }">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          @click="menuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <button class="burger" @click="menuOpen = !menuOpen" aria-label="Menü">
        <img :src="burgerIcon" alt="" />
      </button>
    </div>
  </header>

  <main>
    <NuxtPage />
  </main>
</template>

<style>
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

@media (max-width: 640px) {
  .nav-links {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    flex-direction: column;
    background: var(--glass-bg-strong);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    padding: 1rem 1.25rem;
    backdrop-filter: blur(var(--glass-blur));
    display: none;
  }

  .nav-links.open {
    display: flex;
  }

  .burger {
    display: flex;
  }
}
</style>
