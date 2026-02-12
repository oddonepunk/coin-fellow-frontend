<template>
  <div class="mb-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-base font-bold text-gray-900">Мои группы</h3>
        <p class="text-xs text-gray-500 mt-0.5">Совместные финансы с друзьями</p>
      </div>
      <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
        Все группы →
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="group in groups" 
        :key="group.id"
        class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow duration-300"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
            {{ group.name.charAt(0) }}
          </div>
          <span 
            class="text-xs px-2 py-0.5 rounded-full font-medium"
            :class="group.balance >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'"
          >
            {{ group.balance >= 0 ? '+' : '' }}₽{{ formatNumber(Math.abs(group.balance)) }}
          </span>
        </div>

        <h4 class="text-sm font-bold text-gray-900 mb-0.5 truncate">{{ group.name }}</h4>
        <p class="text-xs text-gray-500 mb-3">{{ group.members }} участников</p>

        <div class="flex -space-x-2 mb-3">
          <div 
            v-for="(avatar, index) in group.avatars" 
            :key="index"
            class="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
          >
            {{ avatar }}
          </div>
          <div 
            v-if="group.members > 3" 
            class="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600"
          >
            +{{ group.members - 3 }}
          </div>
        </div>

        <button class="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg font-medium transition-colors">
          Открыть
        </button>
      </div>

      <div 
        class="bg-white rounded-xl shadow-sm p-4 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center cursor-pointer"
        @click="$emit('create-group')"
      >
        <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
          <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
        </div>
        <p class="text-gray-600 text-sm font-medium">Создать группу</p>
        <p class="text-xs text-gray-500 mt-0.5">Общие финансы</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  groups: {
    type: Array,
    required: true
  }
})

defineEmits(['create-group'])

const formatNumber = (num) => {
  return new Intl.NumberFormat('ru-RU').format(num)
}
</script>