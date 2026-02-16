import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../routes/Dashboard.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import GroupDetail from '../pages/groups/GroupDetail.vue'
import GroupManage from '../pages/groups/GroupManage.vue'
import GroupAnalytics from '../pages/groups/GroupAnalytics.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/groups/:groupId/analytics',
    name: 'GroupAnalytics',
    component: GroupAnalytics,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/groups/:groupId',
    name: 'GroupDetail',
    component: GroupDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/groups/:groupId/manage',
    name: 'GroupManage',
    component: GroupManage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router