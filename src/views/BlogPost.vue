<script setup>
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { getPost } from '../utils/posts'
import { withBase } from '../utils/url'

const props = defineProps({
  slug: { type: String, required: true },
})

const post = computed(() => getPost(props.slug))

useHead(() => ({
  title: post.value ? `${post.value.title} – Patrick Bettler` : 'Beitrag nicht gefunden',
  meta: [{ name: 'description', content: post.value?.excerpt || '' }],
}))

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('de-CH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="container page" v-if="post">
    <router-link to="/blog" class="back">&larr; Zurück zum Blog</router-link>

    <article class="glass article">
      <img v-if="post.cover" :src="withBase(post.cover)" :alt="post.title" class="cover" />
      <time class="date">{{ formatDate(post.date) }}</time>
      <h1>{{ post.title }}</h1>
      <div class="tags" v-if="post.tags.length">
        <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <div class="content" v-html="post.html"></div>
    </article>
  </div>

  <div class="container page" v-else>
    <p>Diesen Beitrag gibt es nicht (mehr).</p>
    <router-link to="/blog" class="back">&larr; Zurück zum Blog</router-link>
  </div>
</template>

<style scoped>
.page {
  padding: 3rem 1.5rem 5rem;
  max-width: 720px;
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
}

.cover {
  width: 100%;
  border-radius: var(--radius-md);
  margin-bottom: 1.25rem;
}

.date {
  font-size: 0.75rem;
  color: var(--gold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

h1 {
  margin: 0.5rem 0 1rem;
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

.content {
  line-height: 1.75;
  color: var(--ink);
}

.content :deep(h2) {
  margin-top: 2rem;
  color: var(--gold);
}

.content :deep(a) {
  color: var(--teal);
}

.content :deep(p) {
  margin: 1rem 0;
}

.content :deep(ul),
.content :deep(ol) {
  padding-left: 1.25rem;
}
</style>
