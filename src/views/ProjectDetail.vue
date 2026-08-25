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
    <router-link to="/projekte" class="back">
      &larr; Zurück zu den Projekten
    </router-link>

    <article class="glass article">
      <div class="hero" v-if="project.cover">
        <img
          :src="withBase(project.cover)"
          :alt="project.title"
          class="cover"
        />
        <img
          v-if="project.projectLogo"
          :src="withBase(project.projectLogo)"
          :alt="`${project.title} Logo`"
          class="project-logo-overlap"
        />
      </div>

      <div class="body">
        <div class="title-row">
          <img
            v-if="project.projectLogo && !project.cover"
            :src="withBase(project.projectLogo)"
            :alt="`${project.title} Logo`"
            class="project-logo-inline"
          />
          <h1>{{ project.title }}</h1>
        </div>

        <div v-if="project.company || project.companyLogo" class="company">
          <img
            v-if="project.companyLogo"
            :src="withBase(project.companyLogo)"
            :alt="project.company ? `${project.company} Logo` : 'Firmenlogo'"
            class="company-logo"
          />
          <span v-if="project.company">bei {{ project.company }}</span>
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
      </div>
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
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

.back {
  display: block;
  width: fit-content;
  margin: 0 0 1.5rem 0;
  color: var(--gold);
  text-decoration: none;
  font-size: 0.9rem;
  text-align: left;
}

.article {
  padding: 0 0 2.5rem;
  box-sizing: border-box;
  min-width: 0;
  overflow: hidden;
}

/* Hero */
.hero {
  position: relative;
  line-height: 0;
}

.cover {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  object-fit: cover;
}

.project-logo-overlap {
  position: absolute;
  right: 2rem;
  bottom: -32px;
  width: 64px;
  height: 64px;
  object-fit: contain;
  background: var(--bg, #fff);
  border-radius: var(--radius-md);
  padding: 0.4rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
}

.body {
  padding: 2.5rem;
  padding-top: 3rem;
  box-sizing: border-box;
}

/* Titel + Projekt-Logo (falls kein Cover) */
.title-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.4rem;
}

.project-logo-inline {
  flex: 0 0 auto;
  width: 56px;
  height: 56px;
  object-fit: contain;
  border-radius: var(--radius-md);
}

.title-row h1 {
  margin: 0;
  overflow-wrap: anywhere;
}

/* Firma als Meta-Zeile */
.company {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--ink-muted);
  font-size: 0.85rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.company-logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
  border-radius: 4px;
}

.lead {
  color: var(--ink-muted);
  line-height: 1.6;
  margin: 0 0 1.25rem;
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
    margin: 0 0 1rem 0;
    font-size: 0.85rem;
    text-align: left;
  }

  .article {
    border-radius: var(--radius-md);
  }

  .cover {
    max-height: 220px;
  }

  .project-logo-overlap {
    left: 1.25rem;
    bottom: -24px;
    width: 52px;
    height: 52px;
  }

  .body {
    padding: 1.25rem;
    padding-top: 2.25rem;
  }

  .title-row {
    gap: 0.75rem;
  }

  .project-logo-inline {
    width: 44px;
    height: 44px;
  }

  .title-row h1,
  h1 {
    font-size: 1.7rem;
    line-height: 1.2;
  }

  .company {
    font-size: 0.8rem;
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