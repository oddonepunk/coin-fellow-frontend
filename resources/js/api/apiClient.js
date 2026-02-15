import axios from 'axios'
import config from '../config/api'

const apiClient = axios.create(config)

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        config.headers['X-Requested-With'] = 'XMLHttpRequest'
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem('refresh_token')
                if (refreshToken) {
                    const response = await axios.post(`${config.baseURL}/auth/refresh`, {
                        refresh_token: refreshToken
                    }, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    })

                    if (response.data.access_token) {
                        localStorage.setItem('access_token', response.data.access_token)
                        if (response.data.refresh_token) {
                            localStorage.setItem('refresh_token', response.data.refresh_token)
                        }
                        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`
                        originalRequest.headers['Authorization'] = `Bearer ${response.data.access_token}`
                        return apiClient(originalRequest)
                    }
                }
            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError)
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                localStorage.removeItem('user')
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)

export default apiClient