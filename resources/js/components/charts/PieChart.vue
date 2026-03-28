<template>
  <div class="w-full h-full flex flex-col lg:flex-row gap-6">
    <div class="h-64 lg:h-80 flex-1">
      <canvas ref="chartCanvas" class="w-full h-full"></canvas>
    </div>
    <div class="flex-1 space-y-3 overflow-y-auto max-h-80">
      <div
        v-for="(item, index) in legendData"
        :key="item.label"
        class="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div class="flex items-center space-x-3">
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: colors[index % colors.length] }"></div>
          <span class="text-sm text-gray-700 truncate max-w-[150px]" :title="item.label">{{ item.label }}</span>
        </div>
        <div class="text-right">
          <span class="text-sm font-medium text-gray-900">{{ item.value.toLocaleString('ru-RU') }} {{ currency }}</span>
          <span class="text-xs text-gray-500 ml-2">({{ item.percentage }}%)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, computed, nextTick } from 'vue'
import { Chart as ChartJS, registerables } from 'chart.js'

ChartJS.register(...registerables)

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  currency: {
    type: String,
    default: 'RUB'
  }
})

const chartCanvas = ref(null)
let chart = null

const colors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
]

const total = computed(() => {
  return props.data.reduce((sum, item) => sum + (item.total || 0), 0)
})

const legendData = computed(() => {
  return props.data.map((item, index) => ({
    label: item.category_name || item.name || 'Без категории',
    value: item.total,
    percentage: total.value > 0 ? Math.round((item.total / total.value) * 100) : 0
  }))
})

const createChart = async () => {
  await nextTick()
  if (!chartCanvas.value || !props.data.length) return
  
  if (chart) {
    chart.destroy()
  }
  
  const ctx = chartCanvas.value.getContext('2d')
  
  chart = new ChartJS(ctx, {
    type: 'doughnut',
    data: {
      labels: legendData.value.map(item => item.label),
      datasets: [
        {
          data: legendData.value.map(item => item.value),
          backgroundColor: colors.slice(0, props.data.length),
          borderWidth: 0,
          hoverOffset: 10
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.raw
              const percentage = Math.round((value / total.value) * 100)
              return `${context.label}: ${value.toLocaleString('ru-RU')} ${props.currency} (${percentage}%)`
            }
          }
        }
      }
    }
  })
}

onMounted(() => {
  createChart()
})

watch(() => props.data, () => {
  createChart()
}, { deep: true })

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>