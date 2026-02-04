<template>
  <AuthLayout>
    <div class="max-w-md mx-auto">
      <div class="text-center mb-10">
        <div class="relative inline-block mb-4">
          <div class="absolute -inset-4 bg-winter-500/20 rounded-full blur-xl"></div>
          <div class="relative bg-gradient-to-br from-winter-500 to-aurora-400 w-20 h-20 rounded-2xl flex items-center justify-center">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
        </div>
        <h1 class="text-3xl font-bold text-frost-800 mb-2">Добро пожаловать</h1>
        <p class="text-frost-500">Войдите в свой аккаунт</p>
      </div>

      <div class="tg-card-glass mb-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-frost-700 mb-2">
              Email или телефон
            </label>
            <input
              v-model="form.login"
              type="text"
              required
              class="tg-input"
              :class="{ 'tg-input-error': errors.login }"
              placeholder="user@example.com"
              @input="clearError('login')"
            >
            <p v-if="errors.login" class="mt-2 text-sm text-red-500">
              {{ errors.login }}
            </p>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-frost-700">
                Пароль
              </label>
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="text-sm text-winter-500 hover:text-winter-600 flex items-center gap-1"
              >
                <span>{{ showPassword ? 'Скрыть' : 'Показать' }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="tg-input"
              :class="{ 'tg-input-error': errors.password }"
              placeholder="Введите пароль"
              @input="clearError('password')"
            >
            <p v-if="errors.password" class="mt-2 text-sm text-red-500">
              {{ errors.password }}
            </p>
          </div>

          <div class="flex items-center">
            <input
              v-model="form.remember"
              type="checkbox"
              id="remember"
              class="w-4 h-4 text-winter-500 rounded focus:ring-winter-400 border-frost-300"
            >
            <label for="remember" class="ml-2 text-sm text-frost-600">
              Запомнить меня
            </label>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="tg-button-primary w-full py-4 text-lg"
          >
            <span v-if="loading" class="tg-loader w-5 h-5"></span>
            <span v-else>Войти</span>
          </button>
        </form>
      </div>

      <div class="text-center">
        <div class="relative mb-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-frost-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-frost-500">Или войдите через</span>
          </div>
        </div>

        <button
          @click="handleTelegramAuth"
          class="tg-button-secondary w-full mb-4"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.022c.242-.213-.054-.333-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.656-.643.136-.953l11.57-4.461c.537-.196 1.006.128.832.941z"/>
          </svg>
          <span>Telegram</span>
        </button>

        <p class="text-frost-600">
          Нет аккаунта?
          <router-link 
            to="/register" 
            class="text-winter-500 hover:text-winter-600 font-medium"
          >
            Зарегистрироваться
          </router-link>
        </p>
      </div>

      <Notification
        v-if="successMessage"
        type="success"
        :message="successMessage"
        @close="successMessage = null"
      />
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useTelegram } from '@/composables/useTelegram'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import Notification from '@/components/ui/Notification.vue'

const router = useRouter()
const authStore = useAuthStore()
const { initTelegram, loginViaTelegram } = useTelegram()

const form = reactive({
  login: '',
  password: '',
  remember: false
})

const errors = reactive({})
const loading = ref(false)
const showPassword = ref(false)
const successMessage = ref('')

const clearError = (field) => {
  errors[field] = ''
}

const handleLogin = async () => {
  loading.value = true
  errors.login = ''
  errors.password = ''

  try {
    await authStore.login(form)
    successMessage.value = 'Успешный вход!'
    
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  } catch (error) {
    if (error.response?.status === 422) {
      Object.entries(error.response.data.errors).forEach(([key, value]) => {
        errors[key] = value[0]
      })
    } else {
      errors.login = error.message || 'Ошибка при входе'
    }
  } finally {
    loading.value = false
  }
}

const handleTelegramAuth = async () => {
  try {
    await loginViaTelegram()
    router.push('/dashboard')
  } catch (error) {
    console.error('Telegram auth error:', error)
  }
}

onMounted(() => {
  initTelegram()
})
</script>