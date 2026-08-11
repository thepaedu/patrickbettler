import { ViteSSG } from 'vite-ssg'
import './style.css'
import './assets/theme.css'
import App from './App.vue'
import { routes } from './router'

// ViteSSG baut Router + App zusammen auf. "base" muss zu vite.config.js
// (base: '/patrickbettler/') passen, deshalb import.meta.env.BASE_URL
// statt es hier hart zu codieren.
export const createApp = ViteSSG(App, {
  routes,
  base: import.meta.env.BASE_URL,
})
