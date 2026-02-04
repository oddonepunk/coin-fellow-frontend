import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import routes from './routes/routes'

import { useTelegram } from './composables/useTelegram'

const pinia = createPinia()

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

const app = createApp(App)

app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err)
  console.error('Component:', vm)
  console.error('Info:', info)
}

app.config.globalProperties.$filters = {
  currency(value, currency = 'RUB') {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency
    }).format(value)
  },
  date(value, format = 'short') {
    return new Intl.DateTimeFormat('ru-RU', {
      dateStyle: format === 'short' ? 'short' : 'long'
    }).format(new Date(value))
  }
}

app.use(pinia)
app.use(router)


const { initTelegram } = useTelegram()
initTelegram()

app.mount('#app')