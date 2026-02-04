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

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-blue-700 font-medium mb-2">
            Email или телефон
          </label>
          <input
            v-model="form.email"
            type="text"
            required
            class="input-winter"
            placeholder="user@example.com"
          >
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
  email: '',
  password: '',
  remember: false
})
const loading = ref(false)
const showPassword = ref(false)

const handleLogin = () => {
  loading.value = true
  setTimeout(() => {
    localStorage.setItem('isAuthenticated', 'true')
    router.push('/dashboard')
    loading.value = false
  }, 1000)
}

const handleTelegramAuth = () => {
  alert('Telegram авторизация будет реализована позже')
}
</script>