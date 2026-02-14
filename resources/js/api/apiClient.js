import axios from 'axios'
import config from '../config/api'

const apiClient = axios.create(config)

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if(token) {
            config.headers.Authorization = 'Bearer ${token}'
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

apiClient.interceptors.request.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        //Если ошибка 401 и это не запрос на обновление токена

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem('refresh_token')
                if (refreshToken) {
                    const response = await axios.post(`${config.baseURL}/auth/refresh`, {
                        refreshToken: refreshToken
                    })

                    if (response.data.access_token) {
                        localStorage.setItem('access_token', response.data.access_token)

                        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`
                        return apiClient(originalRequest)
                    }
                }
            } catch (refreshError) {
                //Если не получилось обновить токен - редирект
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
