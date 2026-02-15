<template>
  <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
    <div class="flex justify-around items-center h-16">
      <button
        v-for="item in navItems"
        :key="item.name"
        @click="$emit('navigate', item.path)"
        class="flex flex-col items-center justify-center flex-1 h-full transition-colors"
        :class="[
          currentMobileNav === item.path
            ? 'text-blue-600'
            : 'text-gray-500 hover:text-gray-900'
        ]"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="text-xs mt-1">{{ item.name }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import IconHome from '../ui/IconHome.vue'
import IconChart from '../ui/IconChart.vue'
import IconGroup from '../ui/IconGroup.vue'
import IconSettings from '../ui/IconSettings.vue'

defineEmits(['navigate'])

const currentMobileNav = ref('/dashboard')

const navItems = [
  { name: 'Главная', path: '/dashboard', icon: IconHome },
  { name: 'Группы', path: '/groups', icon: IconGroup },
  { name: 'Аналитика', path: '/analytics', icon: IconChart },
  { name: 'Профиль', path: '/settings', icon: IconSettings },
]
</script>