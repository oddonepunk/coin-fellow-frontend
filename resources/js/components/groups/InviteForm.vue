<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-md w-full p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900">Пригласить участника</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div v-if="selectedUser" class="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
            {{ selectedUser.initials || getUserInitials(selectedUser) }}
          </div>
          <div class="ml-3">
            <p class="font-medium text-gray-900">{{ selectedUser.full_name || selectedUser.display_name || selectedUser.email }}</p>
            <p class="text-sm text-gray-500">{{ selectedUser.email }}</p>
          </div>
        </div>
        <button
          @click="selectedUser = null"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div v-if="!selectedUser">
        <UserSearchInput
          v-model="searchQuery"
          :exclude-group-id="groupId"
          @select="handleUserSelect"
          placeholder="Введите имя, email или телефон..."
        />
        <p class="text-xs text-gray-500 mt-2">
          Начните вводить имя, email или телефон для поиска
        </p>
      </div>

      <div v-if="selectedUser" class="space-y-4 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Роль в группе</label>
          <div class="space-y-2">
            <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors" :class="form.role === 'member' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'">
              <input type="radio" v-model="form.role" value="member" class="sr-only">
              <div class="flex-1">
                <p class="font-medium text-gray-900">👤 Участник</p>
                <p class="text-sm text-gray-500">Может добавлять расходы</p>
              </div>
            </label>
            <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors" :class="form.role === 'admin' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'">
              <input type="radio" v-model="form.role" value="admin" class="sr-only">
              <div class="flex-1">
                <p class="font-medium text-gray-900">⚡ Администратор</p>
                <p class="text-sm text-gray-500">Может приглашать участников и управлять расходами</p>
              </div>
            </label>
          </div>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="text-sm text-blue-700">
            <span class="font-bold">👑 Владелец</span> - полный доступ (только создатель группы)<br>
            <span class="font-bold">⚡ Администратор</span> - управление участниками и расходами<br>
            <span class="font-bold">👤 Участник</span> - добавление расходов
          </p>
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
          v-if="selectedUser"
          @click="handleSubmit"
          :disabled="loading"
          class="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          {{ loading ? 'Отправка...' : 'Пригласить' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import UserSearchInput from './UserSearchInput.vue'
import { useNotification } from '../../composables/useNotification'

const props = defineProps({
  groupId: {
    type: String,
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
const { showSuccess, showError, showWarning, showInfo, handleApiError } = useNotification()

const searchQuery = ref('')
const selectedUser = ref(null)
const form = reactive({
  email_or_username: '',
  role: 'member'
})

const handleUserSelect = (user) => {
  selectedUser.value = user
  form.email_or_username = user.email || user.username || ''
  showInfo(`Выбран пользователь: ${user.full_name || user.email}`)
}

const handleSubmit = () => {
  if (!selectedUser.value) {
    showWarning('Пожалуйста, выберите пользователя из списка')
    return
  }
  
  if (!form.email_or_username) {
    showError('Не удалось определить email или username пользователя')
    return
  }
  
  emit('submit', { 
    email_or_username: form.email_or_username,
    role: form.role 
  })
}

const getUserInitials = (user) => {
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
</script>