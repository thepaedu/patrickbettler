<script setup>
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { getProject } from '../utils/projects'
import { withBase } from '../utils/url'

const props = defineProps({
  slug: { type: String, required: true },
})

const project = computed(() => getProject(props.slug))

useHead(() => ({
  title: project.value ? `${project.value.title} – Patrick Bettler` : 'Projekt nicht gefunden',
  meta: [{ name: 'description', content: project.value?.description || '' }],
}))
</script>

<template>
  <div class="container page" v-if="project">
    <router-link to="/projekte" class="back">&larr; Zurück zu den Projekten</router-link>

    <article class="glass article">
      <img
        v-if="project.cover"
        :src="withBase(project.cover)"
        :alt="project.title"
        class="cover"
      />

      <div v-if="project.company || project.companyLogo" class="company">
        <img
          v-if="project.companyLogo"
          :src="withBase(project.companyLogo)"
          :alt="project.company ? `${project.company} Logo` : 'Firmenlogo'"
          class="company-logo"
        />

        <span v-if="project.company">
          {{ project.company }}
        </span>
      </div>

      <div class="project-header">
        <img
          v-if="project.projectLogo"
          :src="withBase(project.projectLogo)"
          :alt="`${project.title} Logo`"
          class="project-logo"
        />

        <h1>{{ project.title }}</h1>
      </div>

      <p v-if="project.description" class="lead">
        {{ project.description }}
      </p>

      <div class="tags" v-if="project.tags.length">
        <span v-for="tag in project.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>

      <div class="links" v-if="project.demoUrl || project.repoUrl">
        <a
          v-if="project.demoUrl"
          :href="project.demoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn primary"
        >
          Live ansehen
        </a>

        <a
          v-if="project.repoUrl"
          :href="project.repoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn"
        >
          Quellcode
        </a>
      </div>

      <div class="content" v-html="project.html"></div>
    </article>
  </div>

  <div class="container page" v-else>
    <p>Dieses Projekt gibt es nicht (mehr).</p>
    <router-link to="/projekte" class="back">
      &larr; Zurück zu den Projekten
    </router-link>
  </div>
</template>

<style scoped>
.page {
  padding: 3rem 1.5rem 5rem;
  max-width: 760px;
  box-sizing: border-box;
}

.back {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: var(--gold);
  text-decoration: none;
  font-size: 0.9rem;
}

.article {
  padding: 2.5rem;
  box-sizing: border-box;
  min-width: 0;
}

.cover {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  margin-bottom: 1.25rem;
}

/* Firma */
.company {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: var(--ink-muted);
  font-size: 0.85rem;
  flex-wrap: wrap;
}

.company-logo {
  width: 120px;
  height: 60px;
  max-width: 100%;
  object-fit: contain;
}

/* Projekt */
.project-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 0.75rem;
}

.project-logo {
  flex: 0 0 auto;
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: var(--radius-md);
}

.project-header h1 {
  margin: 0;
  overflow-wrap: anywhere;
}

.lead {
  color: var(--ink-muted);
  line-height: 1.6;
  margin: 0 0 1.25rem;
  overflow-wrap: anywhere;
}

.project-title {
  min-width: 0;
  flex: 1;
}

h1 {
  margin: 0 0 0.5rem;
  overflow-wrap: anywhere;
}

.lead {
  color: var(--ink-muted);
  line-height: 1.6;
  margin: 0;
  overflow-wrap: anywhere;
}

.tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  color: var(--ink-muted);
}

.links {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.content {
  min-width: 0;
  max-width: 100%;
  line-height: 1.75;
  color: var(--ink);
  overflow-wrap: anywhere;
  word-break: break-word;
}

.content :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
}

.content :deep(h2),
.content :deep(h3) {
  overflow-wrap: anywhere;
}

.content :deep(h2) {
  margin-top: 2rem;
  color: var(--gold);
}

.content :deep(a) {
  color: var(--teal);
  overflow-wrap: anywhere;
}

.content :deep(p) {
  margin: 1rem 0;
}

.content :deep(ul),
.content :deep(ol) {
  padding-left: 1.25rem;
}

.content :deep(pre) {
  background: rgba(0, 0, 0, 0.35);
  padding: 1rem;
  border-radius: var(--radius-sm);
  overflow-x: auto;
  max-width: 100%;
  box-sizing: border-box;
}

.content :deep(code) {
  overflow-wrap: anywhere;
}

/* Mobile */
@media (max-width: 600px) {
  .page {
    padding: 2rem 0.75rem 3rem;
  }

  .back {
    margin-bottom: 1rem;
    font-size: 0.85rem;
  }

  .article {
    padding: 1.25rem;
    border-radius: var(--radius-md);
  }

  .company {
    gap: 0.5rem;
  }

  .company-logo {
    width: 90px;
    height: 45px;
  }

  .project-header {
    gap: 0.85rem;
  }

  .project-logo {
    width: 60px;
    height: 60px;
  }

  .project-header h1 {
    font-size: 1.7rem;
    line-height: 1.2;
  }

  .lead {
    font-size: 0.95rem;
  }

  h1 {
    font-size: 1.7rem;
    line-height: 1.2;
  }

  .lead {
    font-size: 0.95rem;
  }

  .links {
    flex-direction: column;
  }

  .links .btn {
    width: 100%;
    box-sizing: border-box;
    text-align: center;
  }

  .content {
    font-size: 0.95rem;
    line-height: 1.7;
  }

  .content :deep(pre) {
    margin-left: 0;
    margin-right: 0;
    padding: 0.75rem;
    font-size: 0.8rem;
  }

  .content :deep(ul),
  .content :deep(ol) {
    padding-left: 1.1rem;
  }
}
</style>