import { createRouter, createWebHistory } from 'vue-router'
import BooksList from '../views/BooksList.vue'
import BookNotes from '../views/BookNotes.vue'
import VideosList from '../views/VideosList.vue'
import Settings from '../views/SettingsPage.vue'

const routes = [
  {
    path: '',
    name: 'BooksList2',
    component: BooksList
  },
  {
    path: '/books',
    name: 'BooksList',
    component: BooksList
  },
  {
    path: '/videos',
    name: 'VideosList',
    component: VideosList
  },
  {
    path: '/settings',
    name: 'SettingsPage',
    component: Settings
  },
  {
    path: '/book/:id/notes',
    name: 'BookNotes',
    component: BookNotes
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
