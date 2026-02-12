<template>
  <div class="bg-white rounded-xl shadow-sm p-5 lg:p-6 border border-gray-100 h-full">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-base font-bold text-gray-900">Последние операции</h3>
        <p class="text-xs text-gray-500 mt-0.5">Недавняя активность</p>
      </div>
      <button class="text-blue-600 hover:text-blue-700 text-xs font-medium">
        Все →
      </button>
    </div>

    <div class="space-y-2.5">
      <div 
        v-for="transaction in transactions" 
        :key="transaction.id"
        class="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg transition-colors group"
      >
        <div class="flex items-center space-x-2.5">
          <div 
            class="w-8 h-8 rounded-lg flex items-center justify-center"
            :class="transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'"
          >
            <span class="text-base">{{ transaction.icon }}</span>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {{ transaction.description }}
            </p>
            <p class="text-xs text-gray-500 truncate">{{ transaction.category }}</p>
          </div>
        </div>
        <div class="text-right min-w-0 ml-2">
          <p :class="transaction.type === 'income' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'">
            {{ transaction.type === 'income' ? '+' : '-' }}₽{{ formatNumber(transaction.amount) }}
          </p>
          <p class="text-xs text-gray-500">{{ transaction.time }}</p>
        </div>
      </div>
    </div>

    <button class="w-full mt-3 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors">
      Показать все операции →
    </button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  transactions: {
    type: Array,
    required: true
  }
})

const formatNumber = (num) => {
  return new Intl.NumberFormat('ru-RU').format(num)
}
</script>