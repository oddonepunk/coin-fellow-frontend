<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Шапка -->
      <div class="mb-8">
        <div class="flex items-center space-x-4">
          <button @click="goBack" class="p-2 hover:bg-white rounded-lg transition-colors">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Управление группой</h1>
            <p class="text-gray-600 mt-1">{{ group?.name }}</p>
          </div>
        </div>
      </div>

      <!-- Вкладки -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              @click="activeTab = 'settings'"
              class="px-6 py-4 text-sm font-medium"
              :class="activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'"
            >
              Настройки
            </button>
            <button
              @click="activeTab = 'members'"
              class="px-6 py-4 text-sm font-medium"
              :class="activeTab === 'members' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'"
            >
              Участники
            </button>
            <button
              @click="activeTab = 'danger'"
              class="px-6 py-4 text-sm font-medium"
              :class="activeTab === 'danger' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500 hover:text-gray-700'"
            >
              Опасная зона
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Вкладка настроек -->
          <div v-if="activeTab === 'settings'">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Основные настройки</h2>
            
            <form @submit.prevent="handleUpdateGroup" class="space-y-4 max-w-md">
              <div v-if="updateError" class="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
                {{ updateError }}
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Название группы</label>
                <input
                  v-model="updateForm.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Валюта</label>
                <select
                  v-model="updateForm.currency"
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
                <label class="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                <textarea
                  v-model="updateForm.description"
                  rows="3"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="updateLoading"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {{ updateLoading ? 'Сохранение...' : 'Сохранить изменения' }}
              </button>
            </form>
          </div>

          <!-- Вкладка участников -->
          <div v-if="activeTab === 'members'">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-900">Участники ({{ group?.users?.length || 0 }})</h2>
              <button
                @click="showInviteForm = true"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Пригласить
              </button>
            </div>

            <div class="space-y-3">
              <div
                v-for="member in group?.users"
                :key="member.id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                    {{ getUserInitials(member) }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">
                      {{ member.first_name || member.username }}
                      <span v-if="member.pivot?.role === 'owner'" class="ml-2 text-xs text-yellow-600">👑 Владелец</span>
                      <span v-else-if="member.pivot?.role === 'admin'" class="ml-2 text-xs text-blue-600">⚡ Админ</span>
                      <span v-else class="ml-2 text-xs text-gray-500">👤 Участник</span>
                    </p>
                    <p class="text-sm text-gray-500">{{ member.email }}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-2">
                  <select
                    v-if="canChangeRole(member)"
                    v-model="member.pivot.role"
                    @change="changeRole(member)"
                    class="text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="member">Участник</option>
                    <option value="admin">Админ</option>
                    <option value="owner">Владелец</option>
                  </select>

                  <button
                    v-if="canRemoveMember(member)"
                    @click="confirmRemoveMember(member)"
                    class="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Удалить из группы"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="group && isOwner" class="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p class="text-sm text-yellow-700">
                <span class="font-bold">👑 Вы владелец</span> - вы можете передать права другому участнику
              </p>
            </div>
          </div>

          <!-- Опасная зона -->
          <div v-if="activeTab === 'danger'">
            <h2 class="text-lg font-bold text-red-600 mb-4">Опасная зона</h2>
            
            <div class="space-y-4">
              <div v-if="isOwner" class="border border-red-200 rounded-lg p-6">
                <h3 class="font-bold text-gray-900 mb-2">Удалить группу</h3>
                <p class="text-sm text-gray-600 mb-4">
                  Это действие нельзя отменить. Все расходы и данные группы будут безвозвратно удалены.
                </p>
                <button
                  @click="confirmDeleteGroup"
                  class="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Удалить группу
                </button>
              </div>

              <div v-if="!isOwner" class="border border-red-200 rounded-lg p-6">
                <h3 class="font-bold text-gray-900 mb-2">Покинуть группу</h3>
                <p class="text-sm text-gray-600 mb-4">
                  Вы перестанете видеть расходы группы и не сможете их добавлять.
                </p>
                <button
                  @click="confirmLeaveGroup"
                  class="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  Покинуть группу
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Модалка приглашения -->
      <InviteForm
        v-if="showInviteForm"
        :group-id="groupId"
        :loading="inviteLoading"
        :error="inviteError"
        @close="showInviteForm = false"
        @submit="handleInviteUser"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import groupsApi from '../../api/groups'
import InviteForm from '../../components/groups/InviteForm.vue'
import { useAuth } from '../../composables/useAuth'
import { useNotification } from '../../composables/useNotification'


const router = useRouter()
const route = useRoute()
const { user } = useAuth()
const { showSuccess, showWarning, showError, handleApiError } = useNotification()
const groupId = route.params.groupId

const group = ref(null)
const loading = ref(false)
const activeTab = ref('settings')

const updateForm = ref({
  name: '',
  currency: '',
  description: ''
})
const updateLoading = ref(false)
const updateError = ref('')

const showInviteForm = ref(false)
const inviteLoading = ref(false)
const inviteError = ref('')

const userRole = computed(() => {
  if (!group.value?.users) return null
  const currentUser = group.value.users.find(u => u.id === user.value?.id)
  return currentUser?.pivot?.role
})

const isOwner = computed(() => userRole.value === 'owner')
const isAdmin = computed(() => ['owner', 'admin'].includes(userRole.value))

const canChangeRole = (member) => {
  if (!isOwner.value) return false
  if (member.pivot?.role === 'owner') return false 
  return true
}

const canRemoveMember = (member) => {
  if (!isAdmin.value) return false
  if (member.id === user.value?.id) return false 
  if (member.pivot?.role === 'owner') return false 
  return true
}

const loadGroup = async () => {
  loading.value = true
  try {
    const response = await groupsApi.getGroup(groupId)
    group.value = response.data || response
    
    updateForm.value = {
      name: group.value.name,
      currency: group.value.currency,
      description: group.value.description || ''
    }
  } catch (err) {
    handleApiError(err, 'Ошибка загрузки группы')
  } finally {
    loading.value = false
  }
}

const handleUpdateGroup = async () => {
  updateLoading.value = true
  updateError.value = ''
  try {
    await groupsApi.updateGroup(groupId, updateForm.value)
    await loadGroup()
    showSuccess('Группа успешно обновлена')
  } catch (err) {
    updateError.value = err.response?.data?.message || 'Ошибка обновления группы'
    showError(updateError.value)
  } finally {
    updateLoading.value = false
  }
}

const handleInviteUser = async (inviteData) => {
  inviteLoading.value = true
  inviteError.value = ''
  try {
    await groupsApi.inviteUser(groupId, inviteData)
    showInviteForm.value = false
    await loadGroup()
    showSuccess('Пользователь успешно приглашен в группу')
  } catch (err) {
    inviteError.value = err.response?.data?.message || 'Ошибка приглашения'
    handleApiError(err, 'Ошибка при приглашении пользователя')
  } finally {
    inviteLoading.value = false
  }
}

const changeRole = async (member) => {
  try {
    await groupsApi.updateUserRole(groupId, member.id, { role: member.pivot.role })
    await loadGroup()
    showSuccess('Роль пользователя изменена')
  } catch (err) {
    handleApiError(err, 'Ошибка изменения роли')
  }
}

const confirmRemoveMember = (member) => {
  if (confirm(`Удалить ${member.first_name || member.username} из группы?`)) {
    removeMember(member)
  }
}

const removeMember = async (member) => {
  try {
    await groupsApi.removeUser(groupId, member.id)
    await loadGroup()
    showSuccess('Пользователь удален из группы')
  } catch (err) {
    handleApiError(err, 'Ошибка удаления пользователя')
  }
}

const confirmDeleteGroup = () => {
  if (confirm('Вы уверены? Это действие нельзя отменить!')) {
    deleteGroup()
  }
}

const deleteGroup = async () => {
  try {
    await groupsApi.deleteGroup(groupId)
    showSuccess('Группа успешно удалена')
    router.push('/dashboard')
  } catch (err) {
    handleApiError(err, 'Ошибка удаления группы')
  }
}

const confirmLeaveGroup = () => {
  if (confirm('Вы уверены, что хотите покинуть группу?')) {
    leaveGroup()
  }
}

const leaveGroup = async () => {
  try {
    await groupsApi.leaveGroup(groupId)
    showSuccess('Вы покинули группу')
    router.push('/dashboard')
  } catch (err) {
    handleApiError(err, 'Ошибка при выходе из группы')
  }
}
const goBack = () => {
  router.push(`/groups/${groupId}`)
}

const getUserInitials = (member) => {
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

onMounted(() => {
  loadGroup()
})
</script>