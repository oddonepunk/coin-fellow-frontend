import apiClient from './apiClient'

export default {
    async login(credentials) {
        try {
            const response = await apiClient.post('/auth/login', {
                login: credentials.login || credentials.email,
                password: credentials.password
            })
            
            return response.data
        } catch (error) {
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