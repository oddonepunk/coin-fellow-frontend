<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
      <div class="flex space-x-2">
        <button
          v-for="period in periods"
          :key="period.value"
          @click="$emit('change-period', period.value)"
          class="px-3 py-1 text-sm rounded-lg transition-colors"
          :class="selectedPeriod === period.value ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'"
        >
          {{ period.label }}
        </button>
      </div>
    </div>
    
    <div class="h-80">
      <BaseChart
        v-if="chartData"
        type="line"
        :data="chartData"
        :options="chartOptions"
      />
      <div v-else class="h-full flex items-center justify-center text-gray-400">
        Нет данных для отображения
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Динамика расходов'
  },
  data: {
    type: Array,
    default: () => []
  },
  selectedPeriod: {
    type: String,
    default: 'month'
  }
})

defineEmits(['change-period'])

const periods = [
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
  { value: 'year', label: 'Год' }
]

const chartData = computed(() => {
  if (!props.data.length) return null
  
  return {
    labels: props.data.map(item => item.date || item.month),
    datasets: [
      {
        label: 'Расходы',
        data: props.data.map(item => item.total),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  }
})
/* */
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {
          return `${context.raw.toLocaleString('ru-RU')} ₽`
        }
      }
    }
  },
  scales: {
    y: {
      ticks: {
        callback: (value) => `${value.toLocaleString('ru-RU')} ₽`
      }
    }
  }
}
</script>