<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
    <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-md">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-blue-100 text-xs font-medium mb-1">Доходы</p>
          <p class="text-xl font-bold">₽{{ formatNumber(stats.income) }}</p>
        </div>
        <div class="w-10 h-10 bg-blue-400/20 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>
      <div class="mt-3 flex items-center text-blue-100 text-xs">
        <span v-if="stats.incomeChange > 0" class="flex items-center text-green-300">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
          </svg>
          +{{ stats.incomeChange }}%
        </span>
        <span v-else class="flex items-center text-red-300">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
          {{ stats.incomeChange }}%
        </span>
        <span class="ml-1 text-blue-100/80">с прошлого периода</span>
      </div>
    </div>

    <div class="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-5 text-white shadow-md">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-red-100 text-xs font-medium mb-1">Расходы</p>
          <p class="text-xl font-bold">₽{{ formatNumber(stats.expenses) }}</p>
        </div>
        <div class="w-10 h-10 bg-red-400/20 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>
      <div class="mt-3 flex items-center text-red-100 text-xs">
        <span v-if="stats.expensesChange > 0" class="flex items-center text-red-300">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
          </svg>
          +{{ stats.expensesChange }}%
        </span>
        <span v-else class="flex items-center text-green-300">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
          {{ stats.expensesChange }}%
        </span>
        <span class="ml-1 text-red-100/80">с прошлого периода</span>
      </div>
    </div>

    <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white shadow-md">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-green-100 text-xs font-medium mb-1">Баланс</p>
          <p class="text-xl font-bold">₽{{ formatNumber(stats.balance) }}</p>
        </div>
        <div class="w-10 h-10 bg-green-400/20 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </div>
      </div>
      <div class="mt-3">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
              :class="stats.balance > 0 ? 'bg-green-100/30 text-green-200' : 'bg-red-100/30 text-red-200'">
          {{ stats.balance > 0 ? 'Положительный' : 'Отрицательный' }}
        </span>
      </div>
    </div>

    <div class="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-5 text-white shadow-md">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-purple-100 text-xs font-medium mb-1">Бюджет</p>
          <p class="text-xl font-bold">{{ stats.budgetUsed }}%</p>
        </div>
        <div class="w-10 h-10 bg-purple-400/20 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
          </svg>
        </div>
      </div>
      <div class="mt-3">
        <div class="w-full bg-purple-400/30 rounded-full h-1.5">
          <div
            class="h-1.5 rounded-full bg-white transition-all duration-300"
            :style="{ width: stats.budgetUsed + '%' }"
          ></div>
        </div>
        <p class="text-purple-100 text-xs mt-2">
          {{ stats.budgetUsed > 80 ? 'Превышение!' : 'В пределах' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  stats: {
    type: Object,
    required: true
  }
})

const formatNumber = (num) => {
  return new Intl.NumberFormat('ru-RU').format(num)
}
</script>