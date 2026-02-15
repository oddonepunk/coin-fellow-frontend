import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import authApi from '../api/auth'

export function useAuth() {
    const router = useRouter()
    const user = ref(null)
    const isAuthenticated = ref(false)
    const loading = ref(false)
    const error = ref(null)

    const checkAuth = async () => {
        console.log('🔍 checkAuth called')
        const token = localStorage.getItem('access_token')
        console.log('Token from localStorage:', token ? '✅ exists' : '❌ missing')
        
        if (!token) {
            console.log('No token, setting isAuthenticated = false')
            isAuthenticated.value = false
            user.value = null
            return false
        }

        try {
            loading.value = true
            console.log('Fetching current user...')
            const response = await authApi.getCurrentUser()
            console.log('getCurrentUser response:', response)
            
            user.value = response.data || response
            isAuthenticated.value = true
            console.log('✅ Auth check successful, user:', user.value)
            return true
        } catch (err) {
            console.error('❌ Auth check failed:', err.response?.data || err.message)
            isAuthenticated.value = false
            user.value = null
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('user')
            return false
        } finally {
            loading.value = false
        }
    }

    const login = async (credentials) => {
        console.log('🔑 login called with:', credentials)
        
        try {
            loading.value = true
            error.value = null
            
            // Подготавливаем данные для отправки
            const loginData = {
                login: credentials.email || credentials.login || credentials.username,
                password: credentials.password
            }
            
            console.log('Sending login data:', loginData)
            
            // Отправляем запрос
            const responseData = await authApi.login(loginData)
            
            console.log('✅ Login response received:', responseData)
            console.log('Response keys:', Object.keys(responseData))
            
            // СОХРАНЯЕМ ТОКЕНЫ - принудительно и немедленно
            if (responseData.access_token) {
                localStorage.setItem('access_token', responseData.access_token)
                console.log('✅ Access token saved to localStorage')
            } else {
                console.error('❌ No access_token in response!')
                console.log('Full response:', JSON.stringify(responseData, null, 2))
            }
            
            if (responseData.refresh_token) {
                localStorage.setItem('refresh_token', responseData.refresh_token)
                console.log('✅ Refresh token saved to localStorage')
            }
            
            // Сохраняем пользователя
            if (responseData.user) {
                localStorage.setItem('user', JSON.stringify(responseData.user))
                user.value = responseData.user
                console.log('✅ User saved:', responseData.user)
            } else {
                console.warn('⚠️ No user in response, creating from token?')
                // Если нет user, создаем из данных токена
                const tokenData = parseJwt(responseData.access_token)
                if (tokenData) {
                    const userFromToken = {
                        id: tokenData.sub,
                        username: tokenData.username,
                        email: tokenData.email
                    }
                    localStorage.setItem('user', JSON.stringify(userFromToken))
                    user.value = userFromToken
                    console.log('✅ User created from token:', userFromToken)
                }
            }
            
            // Проверяем localStorage сразу после сохранения
            console.log('📦 localStorage check:', {
                access_token: localStorage.getItem('access_token') ? '✅' : '❌',
                refresh_token: localStorage.getItem('refresh_token') ? '✅' : '❌',
                user: localStorage.getItem('user') ? '✅' : '❌'
            })
            
            isAuthenticated.value = true
            console.log('✅ isAuthenticated set to true')
            
            setTimeout(() => {
                console.log('➡️ Redirecting to dashboard...')
                router.push('/dashboard')
            }, 100)
            
            return responseData
        } catch (err) {
            console.error('❌ Login error:', err)
            if (err.response) {
                console.error('Error status:', err.response.status)
                console.error('Error data:', err.response.data)
            }
            error.value = err.response?.data?.message || 
                         err.response?.data?.error || 
                         'Ошибка входа'
            throw err
        } finally {
            loading.value = false
        }
    }

    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1]
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            }).join(''))
            return JSON.parse(jsonPayload)
        } catch (e) {
            console.error('Error parsing JWT:', e)
            return null
        }
    }

    const logout = async () => {
        console.log('🚪 logout called')
        try {
            loading.value = true
            await authApi.logout()
        } catch (err) {
            console.error('Logout error:', err)
        } finally {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('user')
            user.value = null
            isAuthenticated.value = false
            loading.value = false
            console.log('✅ Logout complete')
            router.push('/login')
        }
    }

    const userName = computed(() => {
        if (user.value?.first_name || user.value?.last_name) {
            return `${user.value.first_name || ''} ${user.value.last_name || ''}`.trim()
        }
        return user.value?.username || user.value?.email || 'Пользователь'
    })

    const userEmail = computed(() => user.value?.email || '')
    
    const userInitials = computed(() => {
        if (user.value?.first_name && user.value?.last_name) {
            return (user.value.first_name[0] + user.value.last_name[0]).toUpperCase()
        }
        if (user.value?.first_name) {
            return user.value.first_name[0].toUpperCase()
        }
        if (user.value?.username) {
            return user.value.username.substring(0, 2).toUpperCase()
        }
        if (user.value?.email) {
            return user.value.email.substring(0, 2).toUpperCase()
        }
        return 'U'
    })

    return {
        user,
        isAuthenticated,
        loading,
        error,
        checkAuth,
        login,
        logout,
        userName,
        userEmail,
        userInitials
    }
}