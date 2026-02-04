<template>
  <div 
    id="app" 
    :class="[
      'tg-app min-h-screen transition-all duration-500',
      { 'dark': isDarkMode },
      { 'tg-webapp': isTelegramApp }
    ]"
  >
    <div v-if="showSnow" class="fixed inset-0 pointer-events-none overflow-hidden">
      <div 
        v-for="(flake, index) in snowflakes" 
        :key="index"
        class="snowflake"
        :style="flake.style"
      >❄️</div>
    </div>

    <div 
      v-if="showAurora"
      class="fixed inset-0 aurora-bg pointer-events-none opacity-30"
    ></div>

    <router-view v-slot="{ Component }">
      <transition 
        name="page-slide" 
        mode="out-in"
        @enter="onPageEnter"
        @leave="onPageLeave"
      >
        <component :is="Component" />
      </transition>
    </router-view>

    <NotificationContainer />

    <div 
      v-if="globalLoading"
      class="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div class="text-center">
        <div class="tg-loader mx-auto mb-4"></div>
        <p class="text-frost-600 font-medium animate-pulse">Загрузка...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/app'
import NotificationContainer from '@/components/ui/NotificationContainer.vue'

const route = useRoute()
const appStore = useAppStore()

const showSnow = computed(() => {
  const authRoutes = ['login', 'register', 'telegram-auth']
  return authRoutes.includes(route.name)
})

const showAurora = computed(() => {
  return route.path.startsWith('/dashboard')
})

const globalLoading = computed(() => appStore.loading)

const isTelegramApp = computed(() => window.Telegram?.WebApp)

const isDarkMode = computed(() => appStore.theme === 'dark')

const snowflakes = ref([])

const generateSnowflakes = () => {
  const flakes = []
  for (let i = 0; i < 30; i++) {
    flakes.push({
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * -20}%`,
        fontSize: `${Math.random() * 20 + 10}px`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${Math.random() * 10 + 5}s`,
        opacity: Math.random() * 0.5 + 0.3
      }
    })
  }
  snowflakes.value = flakes
}

const onPageEnter = (el) => {
  el.style.opacity = 0
  el.style.transform = 'translateY(20px)'
  
  requestAnimationFrame(() => {
    el.style.transition = 'all 0.4s ease'
    el.style.opacity = 1
    el.style.transform = 'translateY(0)'
  })
}

const onPageLeave = (el) => {
  el.style.transition = 'all 0.3s ease'
  el.style.opacity = 0
  el.style.transform = 'translateY(-20px)'
}

onMounted(() => {
  if (showSnow.value) {
    generateSnowflakes()
  }
  
  window.addEventListener('resize', generateSnowflakes)
})

watch(showSnow, (newVal) => {
  if (newVal) {
    generateSnowflakes()
  }
})
</script>

<style scoped>
.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.4s ease;
}

.page-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>