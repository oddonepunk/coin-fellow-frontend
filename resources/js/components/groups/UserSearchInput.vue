<template>
  <div class="relative">
    <div class="relative">
      <input
        v-model="searchQuery"
        @input="onInput"
        @focus="isFocused = true"
        @blur="handleBlur"
        type="text"
        class="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
        :placeholder="placeholder"
      />
      <svg 
        class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <div v-if="loading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
      </div>
    </div>

    <div
      v-if="showResults && users.length > 0"
      class="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-80 overflow-y-auto"
    >
      <div
        v-for="user in users"
        :key="user.id"
        class="p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0"
        @click="selectUser(user)"
      >
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold flex-shrink-0">
            {{ user.initials || getUserInitials(user) }}
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
      v-if="showResults && loading && users.length === 0"
      class="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-center"
    >
      <div class="flex justify-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
      <p class="text-sm text-gray-500 mt-2">Поиск пользователей...</p>
    </div>

    <div
      v-if="showResults && !loading && searchQuery.length >= 2 && users.length === 0"
      class="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-center"
    >
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <p class="text-gray-500">Пользователи не найдены</p>
      <p class="text-sm text-gray-400 mt-1">Попробуйте изменить поисковый запрос</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { debounce } from 'lodash'
import usersApi from '../../api/users'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Поиск пользователей по имени, email или телефону...'
  },
  excludeGroupId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'select'])

const searchQuery = ref(props.modelValue)
const loading = ref(false)
const users = ref([])
const isFocused = ref(false)

const showResults = computed(() => 
  isFocused.value && searchQuery.value.length >= 2
)

const searchUsers = debounce(async (query) => {
  if (query.length < 2) {
    users.value = []
    return
  }

  loading.value = true
  try {
    const response = await usersApi.searchUsers(query, props.excludeGroupId)
    users.value = response.data || []
  } catch (error) {
    console.error('Search error:', error)
    users.value = []
  } finally {
    loading.value = false
  }
}, 300)

const onInput = (event) => {
  searchQuery.value = event.target.value
  emit('update:modelValue', searchQuery.value)
  searchUsers(searchQuery.value)
}

const selectUser = (user) => {
  emit('select', user)
  searchQuery.value = ''
  users.value = []
  emit('update:modelValue', '')
}

const handleBlur = () => {
  setTimeout(() => {
    isFocused.value = false
  }, 200)
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

watch(() => props.excludeGroupId, () => {
  if (searchQuery.value.length >= 2) {
    searchUsers(searchQuery.value)
  }
})
</script>