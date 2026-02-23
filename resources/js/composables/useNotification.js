import { useToast } from "vue-toastification";

export function useNotification() {
    const toast = useToast()

    const handleApiError = (error, customMessage = '') => {
        console.error('API Error:', error)

        const serverMessage = error.response?.data?.message ||
                            error.response?.data?.error ||
                            error.message

        let userMessage = customMessage || 'Произошла ошибка'

        if(error.response?.status === 422) {
            userMessage = 'Проверьте правильность введенных данных'
        } else if (error.response?.status === 401) {
            userMessage = 'Необходимо авторизоваться'
        } else if (error.response?.status === 403) {
            userMessage = 'У вас нет прав для этого действия'
        } else if (error.response?.status === 404) {
            userMessage = 'Ресурс не найден'
        } else if (error.response?.status >= 500) {
            userMessage = 'Ошибка сервера, попробуйте позже'
        }

        toast.error(userMessage, {
            timeout: 7000,
            position: 'top-right'
        })

        return { userMessage, serverMessage }
    }

    const showSuccess = (message) => {
        toast.success(message, {
            timeout: 4000,
            position: 'top-right'
        })
    }

    const showWarning = (message) => {
        toast.warning(message, {  
            timeout: 5000,
            position: 'top-right'
        })
    }

    const showInfo = (message) => {
        toast.info(message, {
            timeout: 3000,
            position: 'top-right'
        })
    }

    const showError = (message) => {
        toast.error(message, {
            timeout: 7000,
            position: 'top-right'
        })
    }

    return {
        handleApiError,
        showSuccess,
        showWarning,
        showInfo,
        showError
    }
}