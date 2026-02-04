// Хелпер для работы с переменными окружения
export const env = {
  // Режим разработки
  isDev: import.meta.env.DEV,
  
  isProd: import.meta.env.PROD,
  
  // Базовый URL API
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  
  // URL фронтенда
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
  
  // Название приложения
  appName: import.meta.env.VITE_APP_NAME || 'Coin Fellow',
  
  // Получить полный URL для API
  api(path = '') {
    return `${this.apiUrl}${path}`
  },
  
  // Проверка поддержки возможностей
  supports: {
    localStorage: typeof localStorage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined'
  }
}

export default env