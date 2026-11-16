// WICHTIG: Bei vite-ssg baust du KEINEN eigenen Router mit createRouter().
// vite-ssg erstellt den Router intern (Memory-History beim Prerendern,
// Web-History im Browser) und braucht dafür nur dieses routes-Array,
// das in main.js an ViteSSG(...) übergeben wird.

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/Blog.vue'),
  },
  {
    path: '/blog/:slug',
    name: 'blog-post',
    component: () => import('../views/BlogPost.vue'),
    props: true,
  },
  {
    path: '/galerie',
    name: 'gallery',
    component: () => import('../views/Gallery.vue'),
  },
  {
    path: '/projekte',
    name: 'projects',
    component: () => import('../views/Projects.vue'),
  },
]
