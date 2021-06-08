import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import EditMeal from '../views/EditMeal.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/edit/:id',
    name: 'Edit Meal',
    component: EditMeal
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
