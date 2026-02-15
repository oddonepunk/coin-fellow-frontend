<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-md w-full p-5 lg:p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900">Добавить операцию</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1.5">Тип операции</label>
          <div class="flex space-x-2">
            <button
              @click="$emit('update-expense', { type: 'expense' })"
              class="flex-1 py-2.5 rounded-lg border-2 transition-all text-sm font-medium"
              :class="newExpense.type === 'expense' ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'"
            >
              Расход
            </button>
            <button
              @click="$emit('update-expense', { type: 'income' })"
              class="flex-1 py-2.5 rounded-lg border-2 transition-all text-sm font-medium"
              :class="newExpense.type === 'income' ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'"
            >
              Доход
            </button>
          </div>
        </div>

        <div v-if="userGroups && userGroups.length > 0">
          <label class="block text-xs font-medium text-gray-700 mb-1.5">Группа</label>
          <select 
            :value="newExpense.groupId"
            @change="$emit('update-expense', { groupId: $event.target.value })"
            class="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 bg-white text-sm"
          >
            <option value="">Выберите группу</option>
            <option v-for="group in userGroups" :key="group.id" :value="group.id">
              {{ group.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1.5">Сумма</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₽</span>
            <input
              :value="newExpense.amount"
              @input="$emit('update-expense', { amount: $event.target.value })"
              type="number"
              placeholder="0"
              class="w-full pl-9 pr-4 py-2.5 text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1.5">Категория</label>
          <select 
            :value="newExpense.category"
            @change="$emit('update-expense', { category: $event.target.value })"
            class="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 bg-white text-sm"
          >
            <option value="">Выберите категорию</option>
            <option v-for="cat in expenseCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1.5">Описание</label>
          <input
            :value="newExpense.description"
            @input="$emit('update-expense', { description: $event.target.value })"
            type="text"
            placeholder="На что потратили?"
            class="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
        </div>
      </div>

      <div class="flex space-x-2 mt-6">
        <button
          @click="$emit('close')"
          class="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Отмена
        </button>
        <button
          @click="$emit('add-expense')"
          class="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all active:scale-95"
          :disabled="!isFormValid"
          :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
        >
          Добавить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  newExpense: {
    type: Object,
    required: true
  },
  expenseCategories: {
    type: Array,
    required: true
  },
  userGroups: {
    type: Array,
    default: () => []
  }
})

defineEmits(['close', 'add-expense', 'update-expense'])

const isFormValid = computed(() => {
  return props.newExpense.amount && 
         props.newExpense.category && 
         (props.userGroups.length === 0 || props.newExpense.groupId)
})
</script>