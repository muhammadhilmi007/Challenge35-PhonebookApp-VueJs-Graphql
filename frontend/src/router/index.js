import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import AddContact from '../views/AddContact.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage
  },
  {
    path: '/add',
    name: 'Add',
    component: AddContact
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
