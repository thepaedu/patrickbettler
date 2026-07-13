<script setup>
import { useHead } from '@unhead/vue'

useHead({
  title: 'Patrick Bettler',
  meta: [
    {
      name: 'description',
      content: 'Offizielle Webseite von Patrick Bettler.',
    },
    {
      property: 'og:title',
      content: 'Patrick Bettler',
    },
    {
      property: 'og:description',
      content: 'Offizielle Webseite von Patrick Bettler.',
    },
    {
      property: 'og:image',
      content: 'https://patrickbettler.ch/patrick-bettler.jpg',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Patrick Bettler",
        url: "https://patrickbettler.ch",
        image: "https://patrickbettler.ch/patrick-bettler.jpg",
        sameAs: [
          "https://www.instagram.com/patrick_bettler/",
          "https://github.com/thepaedu/patrickbettler/"
        ]
      })
    }
  ]
})
</script>

<template>
  <div>
    <img
      src="/patrick-bettler.jpg"
      id="profilbild"
      alt="Patrick Bettler"
      width="150"
      height="150"
    />

    <h1>Patrick Bettler</h1>

    <nav class="links" aria-label="Social Media">
      <a
        class="icon-btn"
        href="https://www.instagram.com/patrick_bettler/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram Profil von Patrick Bettler"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.2" cy="6.8" r="1"/>
        </svg>
        <span>Instagram</span>
      </a>

      <a
        class="icon-btn"
        href="https://github.com/thepaedu/patrickbettler"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub Profil von Patrick Bettler"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.22-3.37-1.22-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.35 1.12 2.92.85.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.32 9.32 0 0 1 5 0c1.9-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.2 10.2 0 0 0 22 12.2C22 6.58 17.52 2 12 2Z"/>
        </svg>
        <span>GitHub</span>
      </a>
    </nav>
  </div>
</template>

<style scoped>
#profilbild {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  border: 1px solid rgba(245, 239, 230, 0.25);
  color: var(--ink);
  text-decoration: none;
  font-size: 0.8rem;
  letter-spacing: 0.02em;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.icon-btn svg {
  width: 18px;
  height: 18px;
}

.icon-btn:hover,
.icon-btn:focus-visible {
  border-color: var(--gold);
  background: rgba(212, 175, 106, 0.1);
  transform: translateY(-2px);
}

.icon-btn:focus-visible {
  outline: 2px solid var(--teal);
  outline-offset: 2px;
}
</style>