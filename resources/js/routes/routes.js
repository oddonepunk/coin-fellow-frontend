// resources/js/routes/routes.js
import Login from '../../pages/Login.vue'

export default [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./Dashboard.vue')
  }
]