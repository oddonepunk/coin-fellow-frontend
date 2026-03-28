<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <h2 class="text-lg font-bold text-gray-900">{{ title }}</h2>
      <div class="flex space-x-2">
        <button
          v-for="type in chartTypes"
          :key="type.value"
          @click="selectedType = type.value"
          class="px-3 py-1.5 text-sm rounded-lg transition-all duration-200 flex items-center space-x-1"
          :class="selectedType === type.value ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'"
        >
          <span class="text-base">{{ type.icon }}</span>
          <span class="hidden sm:inline">{{ type.label }}</span>
        </button>
      </div>
    </div>
    
    <div class="min-h-[320px] flex items-center justify-center">
      <LineChart
        v-if="selectedType === 'line' && lineData?.length"
        :data="lineData"
        :currency="currency"
      />
      <PieChart
        v-else-if="selectedType === 'pie' && pieData?.length"
        :data="pieData"
        :currency="currency"
      />
      <BarChart
        v-else-if="selectedType === 'bar' && barData?.length"
        :data="barData"
        :currency="currency"
        x-key="label"
        y-key="value"
      />
      <div v-else class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        <p class="text-gray-500">Нет данных для отображения</p>
        <p class="text-sm text-gray-400 mt-1">Добавьте первые расходы в группу</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import LineChart from './LineChart.vue'
import PieChart from './PieChart.vue'
import BarChart from './BarChart.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  lineData: {
    type: Array,
    default: () => []
  },
  pieData: {
    type: Array,
    default: () => []
  },
  barData: {
    type: Array,
    default: () => []
  },
  currency: {
    type: String,
    default: 'RUB'
  }
})

const chartTypes = [
  { value: 'line', label: 'График', icon: '📈' },
  { value: 'bar', label: 'Столбцы', icon: '📊' },
  { value: 'pie', label: 'Круговая', icon: '🥧' }
]

const selectedType = ref('line')
</script>