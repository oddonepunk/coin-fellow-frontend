import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../routes/Dashboard.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import GroupDetail from '../pages/Groups/GroupDetail.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token')
  console.log('Router guard - to:', to.path, 'token:', !!token)
  
  if (to.meta.requiresAuth && !token) {
    console.log('Redirect to login')
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && token) {
    console.log('Redirect to dashboard')
    next('/dashboard')
  } else {
    console.log('Proceed to:', to.path)
    next()
  }
})

export default router