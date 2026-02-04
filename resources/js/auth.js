import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const accessToken = ref(localStorage.getItem('access_token'))
  const refreshToken = ref(localStorage.getItem('refresh_token'))
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!accessToken.value)
  const currentUser = computed(() => user.value)

  const login = async (credentials) => {
    isLoading.value = true
    try {
      const response = await api.post('/auth/login', credentials)
      
      const { access_token, refresh_token, user: userData } = response.data
      
      accessToken.value = access_token
      refreshToken.value = refresh_token
      user.value = userData
      
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('user', JSON.stringify(userData))
      
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      
      return response.data
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData) => {
    isLoading.value = true
    try {
      const response = await api.post('/auth/register', userData)
      
      const { access_token, refresh_token, user: newUser } = response.data
      
      accessToken.value = access_token
      refreshToken.value = refresh_token
      user.value = newUser
      
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('user', JSON.stringify(newUser))
      
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      
      return response.data
    } finally {
      isLoading.value = false
    }
  }

  const telegramAuth = async (telegramData) => {
    isLoading.value = true
    try {
      const response = await api.post('/auth/telegram', telegramData)
      
      const { access_token, refresh_token, user: userData } = response.data
      
      accessToken.value = access_token
      refreshToken.value = refresh_token
      user.value = userData
      
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('user', JSON.stringify(userData))
      
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      
      return response.data
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await api.get('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      accessToken.value = null
      refreshToken.value = null
      user.value = null
      
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      
      delete api.defaults.headers.common['Authorization']
    }
  }

  const refreshAccessToken = async () => {
    if (!refreshToken.value) throw new Error('No refresh token')
    
    try {
      const response = await api.post('/auth/refresh', {
        refresh_token: refreshToken.value
      })
      
      const { access_token, refresh_token } = response.data
      
      accessToken.value = access_token
      refreshToken.value = refresh_token
      
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      
      return response.data
    } catch (error) {
      logout()
      throw error
    }
  }

  const fetchUser = async () => {
    if (!isAuthenticated.value) return
    
    try {
      const response = await api.get('/auth/me')
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (error) {
      console.error('Fetch user error:', error)
      if (error.response?.status === 401) {
        try {
          await refreshAccessToken()
          await fetchUser()
        } catch (refreshError) {
          logout()
        }
      }
    }
  }

  const initialize = async () => {
    if (accessToken.value) {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken.value}`
      
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        user.value = JSON.parse(storedUser)
      }
      
      await fetchUser()
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    isLoading,
    
    isAuthenticated,
    currentUser,
    
    login,
    register,
    telegramAuth,
    logout,
    refreshAccessToken,
    fetchUser,
    initialize
  }
})