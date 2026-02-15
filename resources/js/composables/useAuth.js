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
        const token = localStorage.getItem('access_token')
        
        if (!token) {
            isAuthenticated.value = false
            user.value = null
            return false
        }

        try {
            loading.value = true
            const response = await authApi.getCurrentUser()
            
            user.value = response.data || response
            isAuthenticated.value = true
            return true
        } catch (err) {
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
        try {
            loading.value = true
            error.value = null
            
            const loginData = {
                login: credentials.email || credentials.login || credentials.username,
                password: credentials.password
            }
            
            const responseData = await authApi.login(loginData)
            
            if (responseData.access_token) {
                localStorage.setItem('access_token', responseData.access_token)
            }
            
            if (responseData.refresh_token) {
                localStorage.setItem('refresh_token', responseData.refresh_token)
            }
            
            if (responseData.user) {
                localStorage.setItem('user', JSON.stringify(responseData.user))
                user.value = responseData.user
            } else {
                const tokenData = parseJwt(responseData.access_token)
                if (tokenData) {
                    const userFromToken = {
                        id: tokenData.sub,
                        username: tokenData.username,
                        email: tokenData.email
                    }
                    localStorage.setItem('user', JSON.stringify(userFromToken))
                    user.value = userFromToken
                }
            }
            
            isAuthenticated.value = true
            
            setTimeout(() => {
                router.push('/dashboard')
            }, 100)
            
            return responseData
        } catch (err) {
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
            return null
        }
    }

    const logout = async () => {
        try {
            loading.value = true
            await authApi.logout()
        } catch (err) {
        } finally {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('user')
            user.value = null
            isAuthenticated.value = false
            loading.value = false
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