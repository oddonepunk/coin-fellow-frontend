<template>
  <div class="bg-white rounded-xl shadow-sm p-5 lg:p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-base font-bold text-gray-900">Расходы по категориям</h3>
        <p class="text-xs text-gray-500 mt-0.5">Распределение ваших расходов</p>
      </div>
      <select 
        :value="modelValue" 
        @input="$emit('update:modelValue', $event.target.value)"
        class="text-xs border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 px-2.5 py-1.5 bg-gray-50"
      >
        <option value="month">Этот месяц</option>
        <option value="week">Эта неделя</option>
        <option value="year">Этот год</option>
      </select>
    </div>

    <div class="space-y-3">
      <div v-for="category in categories" :key="category.id" class="flex items-center p-2.5 hover:bg-gray-50 rounded-lg transition-colors">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3" :style="{ backgroundColor: category.color + '20' }">
          <span class="text-lg" :style="{ color: category.color }">{{ category.icon }}</span>
        </div>
        <div class="flex-1">
          <div class="flex justify-between mb-1">
            <div>
              <span class="text-sm font-medium text-gray-900">{{ category.name }}</span>
              <span class="text-xs text-gray-500 ml-1.5">{{ category.percentage }}%</span>
            </div>
            <span class="text-sm font-bold text-gray-900">₽{{ formatNumber(category.amount) }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-1.5">
            <div
              class="h-1.5 rounded-full transition-all duration-300"
              :style="{
                width: category.percentage + '%',
                backgroundColor: category.color
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  categories: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    default: 'month'
  }
})

defineEmits(['update:modelValue'])

const formatNumber = (num) => {
  return new Intl.NumberFormat('ru-RU').format(num)
}
</script>