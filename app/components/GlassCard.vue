<template>
  <div class="glass-card glass">
    <slot />
  </div>
</template>

<style scoped>
.glass-card {
  padding: 1.5rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.glass-card:hover {
  transform: translateY(-4px);
  border-color: var(--gold);
  box-shadow: var(--shadow-hover);
}
</style>
