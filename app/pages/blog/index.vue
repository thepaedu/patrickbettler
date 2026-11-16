<script setup>
import { posts } from '~/utils/posts'

useHead({
  title: 'Blog – Patrick Bettler',
  meta: [{ name: 'description', content: 'Beiträge von Patrick Bettler.' }],
})
</script>

<template>
  <div class="container page">
    <h1>Blog</h1>

    <p v-if="!posts.length" class="empty">
      Noch keine Beiträge – lege Markdown-Dateien unter
      <code>content/blog</code> an.
    </p>

    <div class="post-grid">
      <NuxtLink
        v-for="post in posts"
        :key="post.slug"
        :to="`/blog/${post.slug}`"
        class="post-link"
      >
        <GlassCard>
          <img v-if="post.cover" :src="withBase(post.cover)" :alt="post.title" class="cover" />
          <time class="date">{{ formatPostDate(post.date) }}</time>
          <h2>{{ post.title }}</h2>
          <p class="excerpt">{{ post.excerpt }}</p>
          <div class="tags" v-if="post.tags.length">
            <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </GlassCard>
      </NuxtLink>
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

.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.post-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.cover {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
}

.date {
  font-size: 0.75rem;
  color: var(--gold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

h2 {
  margin: 0.4rem 0 0.6rem;
  font-size: 1.2rem;
}

.excerpt {
  color: var(--ink-muted);
  font-size: 0.9rem;
  line-height: 1.5;
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

@media (max-width: 600px) {
  .page {
    padding: 2rem 1rem 3rem;
  }

  .post-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .cover {
    aspect-ratio: 16 / 9;
  }
}
</style>
