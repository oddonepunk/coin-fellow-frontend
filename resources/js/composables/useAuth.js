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
            
            const loginData = {
                login: credentials.email || credentials.login,
                password: credentials.password
            }
            
            console.log('Sending login data:', loginData)
            
            const response = await authApi.login(loginData)
            
            console.log('Login response full:', response)
            console.log('Response structure:', {
                hasAccessToken: !!response.access_token,
                hasRefreshToken: !!response.refresh_token,
                hasUser: !!response.user,
                tokenType: response.token_type,
                expiresIn: response.expires_in
            })
            
            if (response.access_token) {
                localStorage.setItem('access_token', response.access_token)
                console.log('✅ Access token saved')
            } else {
                console.error('❌ No access_token in response')
            }
            
            if (response.refresh_token) {
                localStorage.setItem('refresh_token', response.refresh_token)
                console.log('✅ Refresh token saved')
            }
            
            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user))
                user.value = response.user
                console.log('✅ User saved:', response.user)
            } else {
                console.error('❌ No user in response')
            }
            
            isAuthenticated.value = true
            console.log('✅ isAuthenticated set to true')
            
            console.log('localStorage after login:', {
                access_token: localStorage.getItem('access_token')?.substring(0, 20) + '...',
                refresh_token: localStorage.getItem('refresh_token')?.substring(0, 20) + '...',
                user: localStorage.getItem('user')
            })
            
            return response
        } catch (err) {
            console.error('❌ Login error:', err.response?.data || err.message)
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
            console.log('✅ Logout complete, redirected to login')
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