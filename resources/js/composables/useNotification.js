import { useToast } from "vue-toastification";

export function useNotification() {
    console.log('📢 useNotification инициализация...')
    
    let toast
    try {
        toast = useToast()
        console.log('✅ Toast получен:', !!toast)
        
        // Тестовое уведомление при инициализации
        setTimeout(() => {
            toast.info('📢 Система уведомлений работает!', {
                timeout: 3000,
                position: 'top-right'
            })
        }, 1000)
        
    } catch (e) {
        console.error('❌ Ошибка получения toast:', e)
        // Заглушка
        toast = {
            success: (msg) => alert('✅ ' + msg),
            error: (msg) => alert('❌ ' + msg),
            warning: (msg) => alert('⚠️ ' + msg),
            info: (msg) => alert('ℹ️ ' + msg)
        }
    }

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
        console.log('✅ showSuccess вызван с сообщением:', message)
        console.log('   toast.success доступен?', typeof toast.success === 'function')
        toast.success(message, {
            timeout: 4000,
            position: 'top-right'
        })
    }

    const showWarning = (message) => {
        console.log('⚠️ showWarning вызван с сообщением:', message)
        toast.warning(message, {  
            timeout: 5000,
            position: 'top-right'
        })
    }

    const showInfo = (message) => {
        console.log('ℹ️ showInfo вызван с сообщением:', message)
        toast.info(message, {
            timeout: 3000,
            position: 'top-right'
        })
    }

    const showError = (message) => {
        console.error('❌ showError вызван с сообщением:', message)
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