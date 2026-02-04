<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white/20 to-indigo-50/30"></div>
    
    <div class="card-glass max-w-md w-full p-8 z-10">
      <div class="text-center mb-10">
        <div class="avatar-winter float-animation mx-auto mb-6 shadow-xl">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        
        <h1 class="text-4xl font-bold text-gradient-winter mb-2 text-glow">
          Добро пожаловать
        </h1>
        <p class="text-blue-600 font-medium">
          Войдите в свой аккаунт
        </p>
      </div>

      <div v-if="error" class="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="text-red-700 font-medium">{{ error }}</span>
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-blue-700 font-medium mb-2">
            Email, телефон или логин
          </label>
          <input
            v-model="form.login"
            type="text"
            required
            class="input-winter"
            placeholder="email@example.com или +79001234567"
            @input="detectInputType"
          >
          <p v-if="inputType" class="mt-1 text-sm text-blue-600">
            {{ 
              inputType === 'email' ? '✓ Определен email' :
              inputType === 'phone' ? '✓ Определен телефон' :
              '✓ Определен логин'
            }}
          </p>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-blue-700 font-medium">
              Пароль
            </label>
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
            >
              <span>{{ showPassword ? 'Скрыть' : 'Показать' }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </button>
          </div>
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            required
            class="input-winter"
            placeholder="Введите пароль"
          >
        </div>

        <div class="flex items-center">
          <input
            v-model="form.remember"
            type="checkbox"
            id="remember"
            class="w-5 h-5 text-blue-500 rounded focus:ring-blue-400 border-blue-300"
          >
          <label for="remember" class="ml-3 text-blue-700">
            Запомнить меня
          </label>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="btn-winter w-full py-4 text-lg font-bold"
        >
          <span v-if="loading" class="loader-winter inline-block"></span>
          <span v-else>Войти</span>
        </button>
      </form>

      <div class="divider-winter">
        <span class="bg-white px-4">Или войдите через</span>
      </div>

      <button
        @click="handleTelegramAuth"
        class="btn-telegram w-full py-4 mb-6"
        :disabled="loading"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.022c.242-.213-.054-.333-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.656-.643.136-.953l11.57-4.461c.537-.196 1.006.128.832.941z"/>
        </svg>
        <span class="font-bold">Telegram</span>
      </button>

      <div class="text-center">
        <p class="text-blue-600">
          Нет аккаунта?
          <router-link 
            to="/register" 
            class="text-blue-700 font-bold hover:text-blue-800 ml-1"
          >
            Зарегистрироваться
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/utils/api'

const router = useRouter()
const form = reactive({
  login: '', 
  password: '',
  remember: false
})
const loading = ref(false)
const showPassword = ref(false)
const error = ref('')
const inputType = ref('')

const detectInputType = () => {
  const value = form.login.trim()
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  const phoneRegex = /^(\+7|8|7)[\d\s\-()]{10,}$/
  
  if (emailRegex.test(value)) {
    inputType.value = 'email'
  } else if (phoneRegex.test(value.replace(/\D/g, ''))) {
    inputType.value = 'phone'
  } else if (value.length > 0) {
    inputType.value = 'login'
  } else {
    inputType.value = ''
  }
}

onMounted(() => {
  const token = localStorage.getItem('access_token')
  if (token) {
    router.push('/dashboard')
  }
  
  const style = document.createElement('style')
  style.textContent = `
    .shake-animation {
      animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .loader-winter {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s linear infinite;
      display: inline-block;
      vertical-align: middle;
      margin-right: 8px;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `
  document.head.appendChild(style)
})

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    if (!form.login || !form.password) {
      throw new Error('Заполните все поля')
    }

    console.log('Отправляем данные:', {
      login: form.login,
      password: '***' 
    })

 
    const response = await api.post('/auth/login', {
      login: form.login,    
      password: form.password
    })

    console.log('Login response:', response.data)

    const data = response.data

    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      localStorage.setItem('user', JSON.stringify(data.user || { login: form.login }))
      
      if (form.remember) {
        localStorage.setItem('remember_me', 'true')
      }
    }

    router.push('/dashboard')

  } catch (err) {
    console.error('Login error details:', err)
    console.error('Response data:', err.response?.data)
    console.error('Response status:', err.response?.status)
    
    if (err.response?.status === 422) {
      const errors = err.response.data?.errors || {}
      console.log('Validation errors:', errors)
      
      let errorMessage = 'Проверьте введенные данные'
      
      if (errors.login && errors.login[0]) {
        errorMessage = errors.login[0]
      } else if (errors.password && errors.password[0]) {
        errorMessage = errors.password[0]
      } else if (errors.email && errors.email[0]) {
        errorMessage = errors.email[0]
      }
      
      error.value = errorMessage
      
    } else if (err.response?.status === 401) {
      error.value = 'Неверный логин или пароль'
    } else if (err.response) {
      error.value = err.response.data?.message || 
                    err.response.data?.error || 
                    'Ошибка сервера'
    } else if (err.request) {
      error.value = 'Сервер не отвечает. Проверьте, запущен ли бэкенд на localhost:8000'
    } else {
      error.value = err.message || 'Произошла ошибка при входе'
    }
    
    const formElement = document.querySelector('form')
    if (formElement) {
      formElement.classList.add('shake-animation')
      setTimeout(() => {
        formElement.classList.remove('shake-animation')
      }, 500)
    }
    
  } finally {
    loading.value = false
  }
}

const handleTelegramAuth = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    loading.value = true
    
    window.Telegram.WebApp.ready()
    const user = window.Telegram.WebApp.initDataUnsafe?.user
    
    if (user) {
      api.post('/auth/telegram', {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name || '',
        username: user.username || '',
        photo_url: user.photo_url || ''
      })
      .then(response => {
        const data = response.data
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token)
          localStorage.setItem('refresh_token', data.refresh_token)
          localStorage.setItem('user', JSON.stringify(data.user || user))
          router.push('/dashboard')
        } else {
          throw new Error('Ошибка авторизации через Telegram')
        }
      })
      .catch(err => {
        console.error('Telegram auth error:', err)
        error.value = err.response?.data?.message || 
                      'Ошибка авторизации через Telegram'
      })
      .finally(() => {
        loading.value = false
      })
    } else {
      error.value = 'Данные Telegram не получены'
      loading.value = false
    }
  } else {
    error.value = 'Telegram авторизация доступна только в Telegram приложении'
  }
}
</script>