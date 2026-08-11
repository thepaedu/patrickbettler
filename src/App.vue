<script setup>
import { ref } from 'vue'
import { useHead } from '@unhead/vue'

// Site-weite Defaults. Einzelne Seiten (Home, Blog, ...) überschreiben
// nur title/description via ihr eigenes useHead(); diese Tags hier bleiben
// auf jeder Seite bestehen.
useHead({
  meta: [
    { property: 'og:title', content: 'Patrick Bettler' },
    { property: 'og:description', content: 'Offizielle Webseite von Patrick Bettler.' },
    {
      property: 'og:image',
      content: 'https://thepaedu.github.io/patrickbettler/assets/patrick-bettler-BNCAPXrR.jpg',
    },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Patrick Bettler',
        url: 'https://thepaedu.github.io/patrickbettler/',
        image: 'https://thepaedu.github.io/patrickbettler/assets/patrick-bettler-BNCAPXrR.jpg',
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
  <div class="bg-blobs" aria-hidden="true">
    <span></span>
    <span></span>
    <span></span>
  </div>

  <header class="navbar glass">
    <div class="navbar-inner container">
      <router-link to="/" class="brand">Patrick Bettler</router-link>

      <nav class="nav-links" :class="{ open: menuOpen }">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          @click="menuOpen = false"
        >
          {{ link.label }}
        </router-link>
      </nav>

      <button class="burger" @click="menuOpen = !menuOpen" aria-label="Menü">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>

  <main>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>

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
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
}

.burger span {
  width: 22px;
  height: 2px;
  background: var(--ink);
}

main {
  min-height: 60vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
