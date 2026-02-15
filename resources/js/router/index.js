import { createRouter, createWebHistory } from 'vue-router'
import authMiddleware from '../middleware/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../routes/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../routes/Register.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../routes/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('../routes/Analytics.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/groups',
    name: 'Groups',
    component: () => import('../routes/Groups.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../routes/Settings.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    authMiddleware(to, from, next)
  } else {
    next()
  }
})

export default router