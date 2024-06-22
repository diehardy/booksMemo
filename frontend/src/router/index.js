import { createRouter, createWebHistory } from 'vue-router'
import BooksList from '../views/BooksList.vue'

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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
