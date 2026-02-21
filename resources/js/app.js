import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import routes from './routes/routes'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import '../css/app.css'

const pinia = createPinia()

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)

const toastOptions = {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl:false
}

app.use(Toast, toastOptions)
app.use(pinia)
app.use(router)

app.mount('#app')