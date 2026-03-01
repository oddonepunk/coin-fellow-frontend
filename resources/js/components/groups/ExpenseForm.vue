<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-md w-full p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900">Добавить расход</h3>
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
          <label class="block text-sm font-medium text-gray-700 mb-2">Описание *</label>
          <input
            v-model="form.description"
            type="text"
            required
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
            placeholder="Что купили?"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Сумма *</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₽</span>
            <input
              v-model.number="form.amount"
              type="number"
              step="0.01"
              required
              class="w-full pl-9 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              placeholder="0.00"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Кто платил? *</label>
          <select
            v-model="form.payer_id"
            required
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 bg-white"
          >
            <option value="">Выберите участника</option>
            <option v-for="member in members" :key="member.id" :value="member.id">
              {{ member.first_name || member.username }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Категория</label>
          <select
            v-model="form.categoryId"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 bg-white"
          >
            <option value="">Без категории</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Дата</label>
          <input
            v-model="form.date"
            type="date"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Участники</label>
          <p class="text-xs text-gray-500 mb-2">Если не выбраны, расход делится на всех участников группы</p>
          <div class="max-h-40 overflow-y-auto border-2 border-gray-300 rounded-lg p-2">
            <div v-for="member in members" :key="member.id" class="flex items-center p-2 hover:bg-gray-50">
              <input
                type="checkbox"
                :id="`member-${member.id}`"
                :value="member.id"
                v-model="form.participants"
                class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              >
              <label :for="`member-${member.id}`" class="ml-3 text-sm text-gray-700">
                {{ member.first_name || member.username }}
              </label>
            </div>
          </div>
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
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  groupId: {
    type: String,
    required: true
  },
  members: {
    type: Array,
    required: true
  },
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

const categories = [
  { id: 1, name: 'Продукты' },
  { id: 2, name: 'Транспорт' },
  { id: 3, name: 'Кафе' },
  { id: 4, name: 'Развлечения' },
  { id: 5, name: 'Здоровье' },
  { id: 6, name: 'Образование' },
  { id: 7, name: 'Одежда' },
  { id: 8, name: 'Красота' },
  { id: 9, name: 'Подарки' },
  { id: 10, name: 'Другое' }
]

const form = reactive({
  description: '',
  amount: null,
  payer_id: '',
  categoryId: '',
  date: new Date().toISOString().split('T')[0],
  participants: []
})

const handleSubmit = () => {
  const submitData = {
    description: form.description,
    amount: form.amount,
    payer_id: form.payer_id,
    date: form.date,
    categoryId: form.categoryId || null,
    participants: form.participants.length ? form.participants : null
  }
  console.log('📤 Отправка данных расхода:', submitData)
  emit('submit', submitData)
}
</script>