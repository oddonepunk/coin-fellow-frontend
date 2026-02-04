import axios from 'axios'
import config from '@/config/api'

const api = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
  headers: config.headers,
  withCredentials: config.withCredentials,
  crossDomain: config.crossDomain
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Unauthorized, clearing tokens')
      
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      
      if (!window.location.pathname.includes('/login')) {
        setTimeout(() => {
          window.location.href = '/login'
        }, 100)
      }
    }
    
    return Promise.reject(error)
  }
)

export { api, config }