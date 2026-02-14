import { registerTS } from "vue/compiler-sfc";
import apiClient  from "./apiClient";

export default {
    async login(credentials) {
        const response = await apiClient.post('/auth/login', credentials)
        return response.data
    },

    async register(userData) {
        const response = await apiClient.post('auth/register', userData)
        return response.data
    },

    async logout() {
        const response = await apiClient.get('auth/logout')
        return response.data
    },

    async getCurrentUser() {
        const response = await apiClient.get('auth/me')
        return response.data
    },

    async refreshToken(refreshToken) {
        const response = await apiClient.post('auth/refresh', {
            refreshToken: refreshToken
        })
        return response.data
    }
}