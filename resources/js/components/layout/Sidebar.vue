<template>
  <aside class="h-full flex flex-col bg-white w-72">
    <!-- Логотип -->
    <div class="p-6 border-b">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="min-w-0">
          <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
            Coin Fellow
          </h1>
          <p class="text-xs text-gray-500 truncate">Личные финансы</p>
        </div>
      </div>
    </div>

    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
        :class="[
          $route.path === item.path
            ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-500'
            : 'text-gray-700'
        ]"
      >
        <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
        <span class="font-medium flex-1 truncate">{{ item.name }}</span>
        <span v-if="item.badge" class="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex-shrink-0">
          {{ item.badge }}
        </span>
      </router-link>
    </nav>

    <div class="p-4 border-t mt-auto">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {{ userInitials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-gray-900 truncate">{{ userName }}</p>
          <p class="text-sm text-gray-500 truncate">{{ userEmail }}</p>
        </div>
        <button
          @click="logout"
          class="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
          title="Выйти"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

defineProps({
  mobileMenuOpen: Boolean
})

defineEmits(['toggle-menu', 'close-menu'])

const router = useRouter()
const route = useRoute()

const HomeIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`
}

const ChartIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`
}

const GroupIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`
}

const SettingsIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
}

const navItems = [
  { name: 'Дашборд', path: '/dashboard', icon: HomeIcon },
  { name: 'Аналитика', path: '/analytics', icon: ChartIcon, badge: 'New' },
  { name: 'Группы', path: '/groups', icon: GroupIcon },
  { name: 'Настройки', path: '/settings', icon: SettingsIcon },
]

const user = ref({
  name: 'Nicholas Oddone',
  email: 'oddonenso2@gmail.com',
  initials: 'NO'
})

const userName = computed(() => user.value.name)
const userEmail = computed(() => user.value.email)
const userInitials = computed(() => user.value.initials)

const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>