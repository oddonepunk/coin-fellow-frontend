import apiClient from './apiClient'

export default {
    async login(credentials) {
        console.log('API login called with:', credentials)
        
        try {
            const response = await apiClient.post('/auth/login', {
                login: credentials.login || credentials.email,
                password: credentials.password
            })
            
            console.log('API login response status:', response.status)
            console.log('API login response data:', response.data)
            
            return response.data
        } catch (error) {
            console.error('API login error:', error.response?.data || error.message)
            throw error
        }
    },

    async getCurrentUser() {
        const response = await apiClient.get('/auth/me')
        return response.data
    },

    async logout() {
        const response = await apiClient.get('/auth/logout')
        return response.data
    },

    async refreshToken(refreshToken) {
        const response = await apiClient.post('/auth/refresh', {
            refresh_token: refreshToken
        })
        return response.data
    }
}