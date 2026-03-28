<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <h3 class="text-lg font-bold text-gray-900 mb-4">{{ title }}</h3>
    
    <div class="flex flex-col lg:flex-row gap-6">
      <div class="h-64 lg:w-1/2">
        <BaseChart
          v-if="chartData"
          type="doughnut"
          :data="chartData"
          :options="chartOptions"
        />
        <div v-else class="h-full flex items-center justify-center text-gray-400">
          Нет данных для отображения
        </div>
      </div>
      
      <div class="flex-1 space-y-3">
        <div
          v-for="(item, index) in legendData"
          :key="item.label"
          class="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }"></div>
            <span class="text-sm text-gray-700">{{ item.label }}</span>
          </div>
          <div class="text-right">
            <span class="text-sm font-medium text-gray-900">{{ item.value.toLocaleString('ru-RU') }} ₽</span>
            <span class="text-xs text-gray-500 ml-2">({{ item.percentage }}%)</span>
          </div>
        </div>
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
    default: 'Расходы по категориям'
  },
  data: {
    type: Array,
    default: () => []
  }
})

const colors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
]

const chartData = computed(() => {
  if (!props.data.length) return null
  
  return {
    labels: props.data.map(item => item.category_name || item.name),
    datasets: [
      {
        data: props.data.map(item => item.total),
        backgroundColor: colors.slice(0, props.data.length),
        borderWidth: 0,
        hoverOffset: 10
      }
    ]
  }
})

const legendData = computed(() => {
  const total = props.data.reduce((sum, item) => sum + item.total, 0)
  
  return props.data.map((item, index) => ({
    label: item.category_name || item.name,
    value: item.total,
    percentage: total > 0 ? Math.round((item.total / total) * 100) : 0,
    color: colors[index % colors.length]
  }))
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.raw
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = Math.round((value / total) * 100)
          return `${context.label}: ${value.toLocaleString('ru-RU')} ₽ (${percentage}%)`
        }
      }
    }
  }
}
</script>