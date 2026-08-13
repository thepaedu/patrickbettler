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

.date {
  font-size: 0.75rem;
  color: var(--gold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

h1 {
  margin: 0.5rem 0 1rem;
  line-height: 1.15;
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

.content {
  line-height: 1.75;
  color: var(--ink);
  min-width: 0;
  overflow-wrap: break-word;
}

.content :deep(h2) {
  margin-top: 2rem;
  line-height: 1.25;
  color: var(--gold);
}

.content :deep(h3) {
  margin-top: 1.5rem;
  line-height: 1.3;
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

.content :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  margin: 1.5rem 0;
}

.content :deep(pre) {
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 1rem;
  border-radius: var(--radius-md);
}

.content :deep(code) {
  overflow-wrap: anywhere;
}

.content :deep(table) {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Mobile */
@media (max-width: 600px) {
  .page {
    padding: 1.5rem 0.85rem 3rem;
  }

  .back {
    margin: 0 0 1rem 0.15rem;
    font-size: 0.85rem;
  }

  .article {
    padding: 1.25rem;
    border-radius: var(--radius-md);
  }

  .cover {
    margin: -0.25rem -0.25rem 1.15rem;
    width: calc(100% + 0.5rem);
    max-width: none;
    border-radius: calc(var(--radius-md) - 2px);
  }

  h1 {
    font-size: clamp(1.8rem, 8vw, 2.4rem);
    line-height: 1.12;
    margin: 0.45rem 0 0.9rem;
  }

  .tags {
    margin-bottom: 1.25rem;
  }

  .content {
    font-size: 1rem;
    line-height: 1.7;
  }

  .content :deep(h2) {
    font-size: 1.4rem;
    margin-top: 1.75rem;
  }

  .content :deep(h3) {
    font-size: 1.15rem;
  }

  .content :deep(ul),
  .content :deep(ol) {
    padding-left: 1.1rem;
  }

  .content :deep(pre) {
    margin-left: -0.25rem;
    margin-right: -0.25rem;
    border-radius: 0.5rem;
    font-size: 0.8rem;
  }

  .content :deep(blockquote) {
    margin-left: 0;
    margin-right: 0;
  }
}

/* Sehr kleine Smartphones */
@media (max-width: 380px) {
  .page {
    padding-left: 0.65rem;
    padding-right: 0.65rem;
  }

  .article {
    padding: 1rem;
  }

  h1 {
    font-size: 1.75rem;
  }
}
</style>