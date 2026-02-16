<template>
  <div class="mb-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-base font-bold text-gray-900">Мои группы</h3>
        <p class="text-xs text-gray-500 mt-0.5">Совместные финансы с друзьями</p>
      </div>
      <button
        @click="handleShowCreate"
        class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Создать группу
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg text-center">
      {{ error }}
    </div>

    <div v-else-if="!groups || groups.length === 0" class="bg-gray-50 rounded-xl p-8 text-center">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
      <p class="text-gray-600 mb-2">У вас пока нет групп</p>
      <p class="text-sm text-gray-500 mb-4">Создайте первую группу для совместного учета расходов</p>
      <button
        @click="handleShowCreate"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Создать группу
      </button>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="group in groups"
        :key="group.id"
        class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow duration-300"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
            {{ group.name ? group.name.charAt(0).toUpperCase() : '?' }}
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-600">
              {{ group.currency || 'RUB' }}
            </span>
            <span class="text-xs text-gray-500">{{ group.users?.length || group.members_count || 0 }} уч.</span>
          </div>
        </div>

        <h4 class="text-sm font-bold text-gray-900 mb-1 truncate">{{ group.name || 'Без названия' }}</h4>
        <p v-if="group.description" class="text-xs text-gray-500 mb-3 truncate">{{ group.description }}</p>
        <p v-else class="text-xs text-gray-400 mb-3">Нет описания</p>

        <div class="flex -space-x-2 mb-3">
          <div
            v-for="(member, index) in (group.users || []).slice(0, 3)"
            :key="member.id || index"
            class="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
            :title="member.first_name || member.username || member.email || 'User'"
          >
            {{ getInitials(member) }}
          </div>
          <div
            v-if="(group.users?.length || 0) > 3"
            class="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600"
          >
            +{{ (group.users?.length || 0) - 3 }}
          </div>
        </div>

        <div class="flex gap-2">
          <button
            @click="handleOpenGroup(group.id)"
            class="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg font-medium transition-colors"
          >
            Открыть
          </button>
          <button
            v-if="canManageGroup(group)"
            @click="handleManageGroup(group)"
            class="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
            title="Управление группой"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  groups: {
    type: Array,
    default: () => []
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

const emit = defineEmits(['show-create', 'open-group', 'manage-group'])

const handleShowCreate = () => {
  console.log('🔵🔵🔵 UserGroups: КНОПКА "Создать группу" НАЖАТА!')
  console.log('UserGroups: эмитим событие show-create в родительский компонент')
  emit('show-create')
}

const handleOpenGroup = (groupId) => {
  console.log('UserGroups: открытие группы', groupId)
  emit('open-group', groupId)
}

const handleManageGroup = (group) => {
  console.log('UserGroups: управление группой', group)
  emit('manage-group', group)
}

const getInitials = (member) => {
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

const canManageGroup = (group) => {
  return true
}
</script>