<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button @click="goBack" class="p-2 hover:bg-white rounded-lg transition-colors">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </button>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ group?.name }}</h1>
              <p class="text-gray-600 mt-1">{{ group?.description || 'Нет описания' }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <span class="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
              {{ group?.currency || 'RUB' }}
            </span>
            <button
              @click="showInviteForm = true"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span>Пригласить</span>
            </button>
            <button
              @click="showLeaveConfirm = true"
              class="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Покинуть группу"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-5">
          <p class="text-sm text-gray-500 mb-1">Всего участников</p>
          <p class="text-2xl font-bold text-gray-900">{{ group?.users?.length || 0 }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5">
          <p class="text-sm text-gray-500 mb-1">Всего расходов</p>
          <p class="text-2xl font-bold text-gray-900">0 {{ group?.currency }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5">
          <p class="text-sm text-gray-500 mb-1">Мой баланс</p>
          <p class="text-2xl font-bold text-green-600">0 {{ group?.currency }}</p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-gray-900">Участники</h2>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">роль:</span>
            <span v-if="group?.is_owner" class="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Владелец</span>
            <span v-else-if="group?.is_admin" class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Админ</span>
            <span v-else class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">Участник</span>
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="member in group?.users"
            :key="member.id"
            class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                {{ getUserInitials(member) }}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <p class="font-medium text-gray-900">
                    {{ member.first_name || member.username }}
                  </p>
                  <span v-if="member.pivot?.role === 'owner'" class="text-xs text-yellow-600">👑</span>
                  <span v-else-if="member.pivot?.role === 'admin'" class="text-xs text-blue-600">⚡</span>
                </div>
                <p class="text-sm text-gray-500">{{ member.email }}</p>
              </div>
            </div>
            
            <div class="text-right">
              <p class="text-sm font-medium text-green-600">+0 {{ group?.currency }}</p>
              <p class="text-xs text-gray-400">вложено</p>
            </div>
          </div>
        </div>
      </div>

      <InviteForm
        v-if="showInviteForm"
        :group-id="groupId"
        :loading="inviteLoading"
        :error="inviteError"
        @close="showInviteForm = false"
        @submit="handleInviteUser"
      />

      <ConfirmModal
        v-if="showLeaveConfirm"
        type="warning"
        title="Покинуть группу"
        :message="`Вы уверены, что хотите покинуть группу ${group?.name}?`"
        confirm-text="Покинуть"
        :loading="leaveLoading"
        @confirm="handleLeaveGroup"
        @cancel="showLeaveConfirm = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import groupsApi from '../../js/api/groups'
import InviteForm from '../../js/components/groups/InviteForm.vue'
import ConfirmModal from '../../js/components/ui/ConfirmModal.vue'
import { useAuth } from '../../js/composables/useAuth'
import { useNotification } from '../../js/composables/useNotification'

const router = useRouter()
const route = useRoute()
const { user } = useAuth()
const { showSuccess, handleApiError } = useNotification()
const groupId = route.params.groupId

const group = ref(null)
const loading = ref(false)
const inviteLoading = ref(false)
const inviteError = ref('')
const leaveLoading = ref(false)
const showInviteForm = ref(false)
const showLeaveConfirm = ref(false)

const loadGroup = async () => {
  loading.value = true
  try {
    const response = await groupsApi.getGroup(groupId)
    group.value = response.data || response
  } catch (err) {
    handleApiError(err, 'Ошибка загрузки группы')
  } finally {
    loading.value = false
  }
}

const handleInviteUser = async (inviteData) => {
  inviteLoading.value = true
  inviteError.value = ''
  try {
    await groupsApi.inviteUser(groupId, inviteData)
    showInviteForm.value = false
    await loadGroup()
    showSuccess('Пользователь приглашен в группу')
  } catch (err) {
    inviteError.value = err.response?.data?.message || 'Ошибка приглашения'
    handleApiError(err, 'Ошибка при приглашении')
  } finally {
    inviteLoading.value = false
  }
}

const handleLeaveGroup = async () => {
  leaveLoading.value = true
  try {
    await groupsApi.leaveGroup(groupId)
    showSuccess('Вы покинули группу')
    router.push('/dashboard')
  } catch (err) {
    handleApiError(err, 'Ошибка при выходе из группы')
  } finally {
    leaveLoading.value = false
    showLeaveConfirm.value = false
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