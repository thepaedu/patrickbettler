<script setup>
import { useHead } from '@unhead/vue'
import { projects } from '../utils/projects'
import GlassCard from '../components/GlassCard.vue'
import { withBase } from '../utils/url'

useHead({
  title: 'Projekte – Patrick Bettler',
  meta: [{ name: 'description', content: 'Apps und Software-Tools von Patrick Bettler.' }],
})
</script>

<template>
  <div class="container page">
    <h1>Projekte</h1>

    <p v-if="!projects.length" class="empty">
      Noch keine Projekte – lege Markdown-Dateien unter
      <code>src/content/projects</code> an.
    </p>

    <div class="grid">
      <router-link
        v-for="project in projects"
        :key="project.slug"
        :to="{ name: 'project-detail', params: { slug: project.slug } }"
        class="project-link"
      >
        <GlassCard class="project">
          <img
            v-if="project.cover"
            :src="withBase(project.cover)"
            :alt="project.title"
            class="cover"
          />
          <h2>{{ project.title }}</h2>
          <p class="desc">{{ project.description }}</p>

          <div class="tags" v-if="project.tags?.length">
            <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </GlassCard>
      </router-link>
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.project-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.cover {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
}

h2 {
  margin: 0 0 0.6rem;
  font-size: 1.2rem;
}

.desc {
  color: var(--ink-muted);
  font-size: 0.9rem;
  line-height: 1.55;
  margin: 0 0 1rem;
}

.tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  color: var(--ink-muted);
}
</style>
