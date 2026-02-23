<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
    <div class="bg-white rounded-xl max-w-md w-full p-6 animate-slide-in">
      <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full" :class="typeClass">
        <svg v-if="type === 'danger'" class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <svg v-else-if="type === 'warning'" class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <svg v-else class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      
      <h3 class="text-xl font-bold text-center text-gray-900 mb-2">{{ title }}</h3>
      <p class="text-gray-600 text-center mb-6">{{ message }}</p>
      
      <div class="flex space-x-3">
        <button
          @click="$emit('cancel')"
          class="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          {{ cancelText }}
        </button>
        <button
          @click="$emit('confirm')"
          :disabled="loading"
          class="flex-1 py-3 text-white rounded-lg font-medium transition-all disabled:opacity-50"
          :class="confirmButtonClass"
        >
          <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          {{ loading ? loadingText : confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'warning', 'danger'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Подтвердить'
  },
  cancelText: {
    type: String,
    default: 'Отмена'
  },
  loadingText: {
    type: String,
    default: 'Загрузка...'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['confirm', 'cancel'])

const typeClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'bg-red-100'
    case 'warning':
      return 'bg-yellow-100'
    default:
      return 'bg-blue-100'
  }
})

const confirmButtonClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'bg-red-600 hover:bg-red-700'
    case 'warning':
      return 'bg-yellow-600 hover:bg-yellow-700'
    default:
      return 'bg-blue-600 hover:bg-blue-700'
  }
})
</script>

<style scoped>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
</style>