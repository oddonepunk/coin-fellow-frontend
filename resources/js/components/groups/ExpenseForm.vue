<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
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
            placeholder="На что потратили?"
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
          
          <!-- Поиск участников -->
          <div class="relative mb-3">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="searchMembers"
                @focus="showSearchResults = true"
                type="text"
                class="w-full px-4 py-2 pl-10 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                placeholder="Поиск участников..."
              />
              <svg 
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <div v-if="searchLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            </div>

            <!-- Результаты поиска -->
            <div
              v-if="showSearchResults && searchResults.length > 0"
              class="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
            >
              <div
                v-for="member in searchResults"
                :key="member.id"
                class="p-2 hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0 flex items-center justify-between"
                @click="addParticipant(member)"
              >
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
                    {{ getMemberInitials(member) }}
                  </div>
                  <span class="ml-2 text-sm text-gray-700">
                    {{ member.first_name || member.username }}
                  </span>
                </div>
                <span v-if="isParticipantSelected(member.id)" class="text-xs text-green-600">✓ добавлен</span>
                <span v-else class="text-xs text-blue-600">+ добавить</span>
              </div>
            </div>
          </div>

          <!-- Список выбранных участников -->
          <div class="border-2 border-gray-300 rounded-lg p-2 min-h-[100px] max-h-40 overflow-y-auto">
            <div v-if="form.participants.length === 0" class="text-center py-4 text-gray-400 text-sm">
              Участники не выбраны. Расход будет разделен на всех.
            </div>
            <div
              v-for="participantId in form.participants"
              :key="participantId"
              class="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
            >
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
                  {{ getMemberInitials(getMemberById(participantId)) }}
                </div>
                <span class="ml-3 text-sm text-gray-700">
                  {{ getMemberName(getMemberById(participantId)) }}
                </span>
              </div>
              <button
                type="button"
                @click="removeParticipant(participantId)"
                class="text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
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
import { ref, reactive, computed } from 'vue'

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

const searchQuery = ref('')
const searchLoading = ref(false)
const showSearchResults = ref(false)
const searchResults = ref([])

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

const searchMembers = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    showSearchResults.value = false
    return
  }

  searchLoading.value = true
  setTimeout(() => {
    const query = searchQuery.value.toLowerCase()
    searchResults.value = props.members.filter(member => 
      (member.first_name?.toLowerCase().includes(query) ||
       member.last_name?.toLowerCase().includes(query) ||
       member.username?.toLowerCase().includes(query) ||
       member.email?.toLowerCase().includes(query)) &&
      !form.participants.includes(member.id)
    ).slice(0, 5)
    searchLoading.value = false
  }, 300)
}

const addParticipant = (member) => {
  if (!form.participants.includes(member.id)) {
    form.participants.push(member.id)
  }
  searchQuery.value = ''
  searchResults.value = []
  showSearchResults.value = false
}

const removeParticipant = (userId) => {
  form.participants = form.participants.filter(id => id !== userId)
}

const isParticipantSelected = (userId) => {
  return form.participants.includes(userId)
}

const getMemberById = (id) => {
  return props.members.find(m => m.id === id) || { first_name: 'Неизвестно' }
}

const getMemberName = (member) => {
  return member.first_name || member.username || member.email
}

const getMemberInitials = (member) => {
  if (!member) return 'U'
  if (member.first_name && member.last_name) {
    return (member.first_name[0] + member.last_name[0]).toUpperCase()
  }
  if (member.first_name) {
    return member.first_name[0].toUpperCase()
  }
  if (member.username) {
    return member.username.substring(0, 2).toUpperCase()
  }
  if (member.email) {
    return member.email.substring(0, 2).toUpperCase()
  }
  return 'U'
}

const handleSubmit = () => {
  const submitData = {
    description: form.description,
    amount: form.amount,
    payer_id: form.payer_id,
    date: form.date,
    categoryId: form.categoryId || null,
    participants: form.participants.length ? form.participants : null
  }
  emit('submit', submitData)
}
</script>