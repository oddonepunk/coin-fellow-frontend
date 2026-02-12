<template>
  <header class="sticky top-0 z-30 bg-white border-b shadow-sm flex-shrink-0">
    <div class="px-4 lg:px-6">
      <div class="hidden lg:flex items-center justify-between h-16">
        <div class="flex items-center space-x-4">
          <h2 class="text-xl font-bold text-gray-900">Дашборд</h2>
          <div class="h-6 w-px bg-gray-300"></div>
          <div class="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              v-for="period in timePeriods"
              :key="period"
              @click="$emit('select-period', period)"
              class="px-4 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap"
              :class="[
                selectedPeriod === period
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              ]"
            >
              {{ period }}
            </button>
          </div>
        </div>

        <div class="flex items-center space-x-6">
          <div class="flex flex-col items-end">
            <p class="text-sm font-medium text-gray-900">{{ currentDate }}</p>
            <p class="text-xs text-gray-500">{{ currentDay }}</p>
          </div>

          <button
            @click="$emit('add-expense')"
            class="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span class="font-medium">Добавить</span>
          </button>
        </div>
      </div>

      <div class="lg:hidden">
        <div class="flex items-center justify-between h-14">
          <div class="flex items-center space-x-3">
            <button
              @click="$emit('toggle-menu')"
              class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <h2 class="text-lg font-bold text-gray-900">Дашборд</h2>
          </div>
          
          <button
            @click="$emit('add-expense')"
            class="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span>Добавить</span>
          </button>
        </div>
        
        <div class="pb-3">
          <div class="flex items-center justify-between">
            <p class="text-xs text-gray-500">{{ currentDate }}, {{ currentDay }}</p>
            <div class="flex items-center space-x-1">
              <button
                v-for="period in timePeriods.slice(0, 3)"
                :key="period"
                @click="$emit('select-period', period)"
                class="px-3 py-1.5 text-sm rounded-lg transition-all"
                :class="[
                  selectedPeriod === period
                    ? 'bg-blue-100 text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                ]"
              >
                {{ period }}
              </button>
              <button
                @click="$emit('toggle-more-periods')"
                class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                ...
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'

defineProps({
  mobileMenuOpen: {
    type: Boolean,
    default: false
  },
  selectedPeriod: {
    type: String,
    default: 'Сегодня'
  }
})

defineEmits(['toggle-menu', 'add-expense', 'select-period', 'toggle-more-periods'])

const timePeriods = ['Сегодня', 'Вчера', 'Неделя', 'Месяц', 'Год']

const currentDate = computed(() => {
  return new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const currentDay = computed(() => {
  return new Date().toLocaleDateString('ru-RU', { weekday: 'long' })
})
</script>