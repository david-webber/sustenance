import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import EditMeal from '../views/EditMeal.vue'
import Login from '../views/Login.vue'
import global from '@/store/global';
const { state } = global;

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
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


router.beforeEach((to, from, next) => {
  const isAuthenticated = state.user.loggedIn && state.user.data;
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})



export default router
