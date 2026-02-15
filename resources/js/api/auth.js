import apiClient from './apiClient'

export default {
    async login(credentials) {
        console.log('Sending login request with:', credentials)
        
        const loginData = {
            login: credentials.email || credentials.login,
            password: credentials.password
        }
        
        try {
            const response = await apiClient.post('/auth/login', loginData)
            console.log('Login response:', response)
            return response.data
        } catch (error) {
            console.error('Login API error:', error.response?.data || error.message)
            throw error
        }
    },

    async register(userData) {
        const response = await apiClient.post('/auth/register', userData)
        return response.data
    },

    async logout() {
        const response = await apiClient.get('/auth/logout')
        return response.data
    },

    async getCurrentUser() {
        const response = await apiClient.get('/auth/me')
        return response.data
    },

    async refreshToken(refreshToken) {
        const response = await apiClient.post('/auth/refresh', {
            refresh_token: refreshToken
        })
        return response.data
    }
}