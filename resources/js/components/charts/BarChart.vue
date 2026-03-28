<template>
  <div class="w-full h-full">
    <canvas ref="chartCanvas" class="w-full h-full"></canvas>
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
  },
  xKey: {
    type: String,
    default: 'label'
  },
  yKey: {
    type: String,
    default: 'value'
  }
})

const chartCanvas = ref(null)
let chart = null

const createChart = async () => {
  await nextTick()
  if (!chartCanvas.value || !props.data.length) return
  
  if (chart) {
    chart.destroy()
  }
  
  const ctx = chartCanvas.value.getContext('2d')
  
  chart = new ChartJS(ctx, {
    type: 'bar',
    data: {
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
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: { family: 'Inter, sans-serif', size: 12 }
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.raw.toLocaleString('ru-RU')} ${props.currency}`
            }
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: (value) => `${value.toLocaleString('ru-RU')} ${props.currency}`,
            font: { size: 11 }
          },
          grid: {
            color: '#E5E7EB'
          }
        },
        x: {
          ticks: {
            font: { size: 11 },
            maxRotation: 45,
            minRotation: 45
          },
          grid: {
            display: false
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