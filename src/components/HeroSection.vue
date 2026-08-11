<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import profilbild from '../assets/patrick-bettler.jpg'

const heroRef = ref(null)
const avatarRef = ref(null)
const titleRef = ref(null)
const subtitleRef = ref(null)
const ctaRef = ref(null)
const glowRef = ref(null)

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.fromTo(
    avatarRef.value,
    { opacity: 0, scale: 0.7, y: 20 },
    { opacity: 1, scale: 1, y: 0, duration: 0.9 },
  )
    .fromTo(
      titleRef.value,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.5',
    )
    .fromTo(
      subtitleRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.45',
    )
    .fromTo(
      ctaRef.value.children,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 },
      '-=0.35',
    )

  // sanftes, endloses Schweben des Glow-Rings hinter dem Profilbild
  gsap.to(glowRef.value, {
    scale: 1.15,
    opacity: 0.55,
    duration: 3.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  })
})
</script>

<template>
  <section class="hero" ref="heroRef">
    <div class="avatar-wrap" ref="avatarRef">
      <span class="glow" ref="glowRef"></span>
      <img :src="profilbild" alt="Patrick Bettler" class="avatar" />
    </div>

    <h1 ref="titleRef">Patrick Bettler</h1>
    <p class="subtitle" ref="subtitleRef">
      Informatiker &middot; ich baue Software, schreibe darüber und halte
      Momente in Bildern fest.
    </p>

    <div class="cta" ref="ctaRef">
      <router-link class="btn primary" to="/projekte">Projekte ansehen</router-link>
      <router-link class="btn" to="/blog">Zum Blog</router-link>
      <router-link class="btn" to="/galerie">Galerie</router-link>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 6rem 1.5rem 4rem;
}

.avatar-wrap {
  position: relative;
  width: 150px;
  height: 150px;
  margin-bottom: 1.75rem;
}

.glow {
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gold), var(--teal));
  filter: blur(24px);
  opacity: 0.35;
}

.avatar {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--glass-border);
}

h1 {
  font-size: clamp(2rem, 5vw, 3.25rem);
  margin: 0 0 0.75rem;
  letter-spacing: -0.01em;
}

.subtitle {
  max-width: 480px;
  color: var(--ink-muted);
  margin: 0 0 2.25rem;
  line-height: 1.6;
}

.cta {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
