export default function authMiddleware(to, from, next) {
  const token = localStorage.getItem('access_token')
  
  if (!token && to.path !== '/login' && to.path !== '/register') {
    next('/login')
  } else if (token && (to.path === '/login' || to.path === '/register')) {
    next('/dashboard')
  } else {
    next()
  }
}