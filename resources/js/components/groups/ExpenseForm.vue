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

        <div class="flex items-center p-3 bg-blue-50 rounded-lg">
          <input
            type="checkbox"
            id="i-paid"
            v-model="isCurrentUserPayer"
            @change="togglePayer"
            class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          >
          <label for="i-paid" class="ml-3 text-sm font-medium text-gray-700">
            Я оплатил этот счет
          </label>
        </div>

        <div v-if="!isCurrentUserPayer">
          <label class="block text-sm font-medium text-gray-700 mb-2">Кто платил? *</label>
          
          <div v-if="selectedPayer" class="mb-3 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                {{ selectedPayer.initials || getInitials(selectedPayer) }}
              </div>
              <div class="ml-3">
                <p class="font-medium text-gray-900">{{ selectedPayer.full_name || selectedPayer.display_name || selectedPayer.email }}</p>
                <p class="text-sm text-gray-500">{{ selectedPayer.email }}</p>
              </div>
            </div>
            <button
              @click="selectedPayer = null; payerSearchQuery = ''"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div v-if="!selectedPayer" class="relative">
            <div class="relative">
              <input
                v-model="payerSearchQuery"
                @input="searchPayer"
                @focus="showPayerResults = true"
                type="text"
                class="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                placeholder="Поиск по имени, email или телефону..."
              />
              <svg 
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <div v-if="payerSearchLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
            </div>

            <div
              v-if="showPayerResults && payerResults.length > 0"
              class="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-80 overflow-y-auto"
            >
              <div
                v-for="user in payerResults"
                :key="user.id"
                class="p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0"
                @click="selectPayer(user)"
              >
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {{ user.initials || getInitials(user) }}
                  </div>
                  <div class="ml-3 flex-1">
                    <p class="font-medium text-gray-900">{{ user.full_name || user.display_name || user.email }}</p>
                    <p class="text-sm text-gray-500">{{ user.email }}</p>
                  </div>
                  <div class="ml-2">
                    <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {{ user.username ? '@' + user.username : '' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="showPayerResults && payerSearchLoading"
              class="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-center"
            >
              <div class="flex justify-center">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
              <p class="text-sm text-gray-500 mt-2">Поиск пользователей...</p>
            </div>

            <div
              v-if="showPayerResults && !payerSearchLoading && payerSearchQuery.length >= 2 && payerResults.length === 0"
              class="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-center"
            >
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-gray-500">Пользователи не найдены</p>
              <p class="text-sm text-gray-400 mt-1">Попробуйте изменить поисковый запрос</p>
            </div>
          </div>
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
          
          <div class="relative mb-3">
            <div class="relative">
              <input
                v-model="participantSearchQuery"
                @input="searchParticipants"
                @focus="showParticipantResults = true"
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
              <div v-if="participantSearchLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            </div>

            <div
              v-if="participantSearchQuery.length >= 2 && showParticipantResults && participantResults.length > 0"
              class="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
            >
              <div
                v-for="member in participantResults"
                :key="member.id"
                class="p-2 hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0 flex items-center justify-between"
                @click="addParticipant(member)"
              >
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
                    {{ member.initials || getInitials(member) }}
                  </div>
                  <span class="ml-2 text-sm text-gray-700">
                    {{ member.first_name || member.username }}
                    <span v-if="member.id === currentUserId" class="text-blue-600 ml-1">(Вы)</span>
                  </span>
                </div>
                <span v-if="isParticipantSelected(member.id)" class="text-xs text-green-600">✓ добавлен</span>
                <span v-else class="text-xs text-blue-600">+ добавить</span>
              </div>
            </div>

            <div
              v-if="participantSearchQuery.length >= 2 && showParticipantResults && participantSearchLoading"
              class="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-center"
            >
              <div class="flex justify-center">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
              <p class="text-sm text-gray-500 mt-2">Поиск участников...</p>
            </div>

            <div
              v-if="participantSearchQuery.length >= 2 && showParticipantResults && !participantSearchLoading && participantResults.length === 0"
              class="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-center"
            >
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-gray-500">Участники не найдены</p>
              <p class="text-sm text-gray-400 mt-1">Попробуйте изменить поисковый запрос</p>
            </div>
          </div>

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
                  {{ getInitials(getParticipantById(participantId)) }}
                </div>
                <span class="ml-3 text-sm text-gray-700">
                  {{ getParticipantName(getParticipantById(participantId)) }}
                  <span v-if="participantId === currentUserId" class="text-blue-600 ml-1">(Вы)</span>
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
            :disabled="loading || (!isCurrentUserPayer && !selectedPayer)"
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
import usersApi from '../../api/users'
import { useAuth } from '../../composables/useAuth'

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
const { user } = useAuth()
const currentUserId = computed(() => user.value?.id)

const membersMap = ref(new Map())

props.members.forEach(member => {
  membersMap.value.set(member.id, member)
})

const payerSearchQuery = ref('')
const payerSearchLoading = ref(false)
const showPayerResults = ref(false)
const payerResults = ref([])
const selectedPayer = ref(null)

const participantSearchQuery = ref('')
const participantSearchLoading = ref(false)
const showParticipantResults = ref(false)
const participantResults = ref([])

const isCurrentUserPayer = ref(true)

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
  categoryId: '',
  date: new Date().toISOString().split('T')[0],
  participants: []
})

const searchPayer = async () => {
  if (!payerSearchQuery.value.trim()) {
    payerResults.value = []
    showPayerResults.value = false
    return
  }

  payerSearchLoading.value = true
  try {
    const response = await usersApi.searchGroupMembers(props.groupId, payerSearchQuery.value)
    payerResults.value = response.data || []
    payerResults.value.forEach(user => {
      if (!membersMap.value.has(user.id)) {
        membersMap.value.set(user.id, user)
      }
    })
    showPayerResults.value = true
  } catch (error) {
    console.error('Ошибка поиска плательщика:', error)
    payerResults.value = []
  } finally {
    payerSearchLoading.value = false
  }
}

const searchParticipants = async () => {
  if (!participantSearchQuery.value.trim()) {
    participantResults.value = []
    showParticipantResults.value = false
    return
  }

  participantSearchLoading.value = true
  try {
    const response = await usersApi.searchGroupMembers(props.groupId, participantSearchQuery.value)
    participantResults.value = response.data || []
    participantResults.value.forEach(user => {
      if (!membersMap.value.has(user.id)) {
        membersMap.value.set(user.id, user)
      }
    })
    showParticipantResults.value = true
  } catch (error) {
    console.error('Ошибка поиска участников:', error)
    participantResults.value = []
  } finally {
    participantSearchLoading.value = false
  }
}

const selectPayer = (user) => {
  selectedPayer.value = user
  if (!membersMap.value.has(user.id)) {
    membersMap.value.set(user.id, user)
  }
  payerSearchQuery.value = ''
  payerResults.value = []
  showPayerResults.value = false
}

const togglePayer = () => {
  if (isCurrentUserPayer.value) {
    selectedPayer.value = null
  }
}

const addParticipant = (member) => {
  if (!form.participants.includes(member.id)) {
    form.participants.push(member.id)
    if (!membersMap.value.has(member.id)) {
      membersMap.value.set(member.id, member)
    }
  }
  participantSearchQuery.value = ''
  participantResults.value = []
  showParticipantResults.value = false
}

const removeParticipant = (userId) => {
  form.participants = form.participants.filter(id => id !== userId)
}

const isParticipantSelected = (userId) => {
  return form.participants.includes(userId)
}

const getParticipantById = (id) => {
  return membersMap.value.get(id) || { first_name: 'Неизвестно', username: 'неизвестно', email: '' }
}

const getParticipantName = (member) => {
  if (!member) return 'Неизвестно'
  return member.first_name || member.username || member.email || 'Неизвестно'
}

const getInitials = (user) => {
  if (!user) return 'U'
  if (user.first_name && user.last_name) {
    return (user.first_name[0] + user.last_name[0]).toUpperCase()
  }
  if (user.first_name) {
    return user.first_name[0].toUpperCase()
  }
  if (user.username) {
    return user.username.substring(0, 2).toUpperCase()
  }
  if (user.email) {
    return user.email.substring(0, 2).toUpperCase()
  }
  return 'U'
}

const handleSubmit = () => {
  const submitData = {
    description: form.description,
    amount: form.amount,
    date: form.date,
    categoryId: form.categoryId || null,
    participants: form.participants.length ? form.participants : null
  }
  
  let payerId
  if (isCurrentUserPayer.value) {
    payerId = currentUserId.value
  } else if (selectedPayer.value) {
    payerId = selectedPayer.value.id
  }
  
  emit('submit', { 
    ...submitData,
    payer_id: payerId 
  })
}
</script>