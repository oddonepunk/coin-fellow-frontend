<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-md w-full p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900">Создать новую группу</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Название группы *</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
            placeholder="Например: Семья, Друзья, Путешествие"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Валюта *</label>
          <select
            v-model="form.currency"
            required
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 bg-white"
          >
            <option value="RUB">🇷🇺 Российский рубль (RUB)</option>
            <option value="USD">🇺🇸 Доллар США (USD)</option>
            <option value="EUR">🇪🇺 Евро (EUR)</option>
            <option value="KZT">🇰🇿 Казахстанский тенге (KZT)</option>
            <option value="BYN">🇧🇾 Белорусский рубль (BYN)</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Описание (необязательно)</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 resize-none"
            placeholder="Краткое описание группы"
          ></textarea>
        </div>

        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            {{ loading ? 'Создание...' : 'Создать группу' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  name: '',
  currency: 'RUB',
  description: ''
})

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>