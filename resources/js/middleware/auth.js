export const authGuard = (to, from, next) => {
  const token = localStorage.getItem('access_token')
  const isAuthenticated = !!token
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  }
  else if (to.name === 'Login' && isAuthenticated) {
    next('/dashboard')
  }
  else {
    next()
  }
}