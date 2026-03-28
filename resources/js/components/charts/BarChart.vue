<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <h3 class="text-lg font-bold text-gray-900 mb-4">{{ title }}</h3>
    
    <div class="h-80">
      <BaseChart
        v-if="chartData"
        type="bar"
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
    default: 'Сравнение расходов'
  },
  data: {
    type: Array,
    default: () => []
  },
  xKey: {
    type: String,
    default: 'user_name'
  },
  yKey: {
    type: String,
    default: 'total'
  }
})

const chartData = computed(() => {
  if (!props.data.length) return null
  
  return {
    labels: props.data.map(item => item[props.xKey]),
    datasets: [
      {
        label: 'Расходы',
        data: props.data.map(item => item[props.yKey]),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 8,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      }
    ]
  }
})

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