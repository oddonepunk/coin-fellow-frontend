import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../Pages/Auth/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../Pages/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/groups',
    name: 'Groups',
    component: () => import('../Pages/Groups/Index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/groups/:id',
    name: 'GroupShow',
    component: () => import('../Pages/Groups/Show.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token')
  const isAuthenticated = !!token

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.guest && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router