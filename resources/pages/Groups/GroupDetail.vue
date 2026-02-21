<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button @click="goBack" class="p-2 hover:bg-white rounded-lg transition-colors">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </button>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ group?.name || 'Загрузка...' }}</h1>
              <p class="text-gray-600 mt-1">{{ group?.description || 'Нет описания' }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <span class="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
              {{ group?.currency || 'RUB' }}
            </span>
            <button
              @click="router.push(`/groups/${groupId}/manage`)"
              class="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Управление
            </button>
            <button
              @click="router.push(`/groups/${groupId}/analytics`)"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Аналитика
            </button>
          </div>
        </div>
      </div>

      <!-- Статистика -->
      <div v-if="!loading && group" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-5">
          <p class="text-sm text-gray-500 mb-1">Всего расходов</p>
          <p class="text-2xl font-bold text-gray-900">0 {{ group?.currency }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5">
          <p class="text-sm text-gray-500 mb-1">Участников</p>
          <p class="text-2xl font-bold text-gray-900">{{ membersCount }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5">
          <p class="text-sm text-gray-500 mb-1">Мои расходы</p>
          <p class="text-2xl font-bold text-blue-600">0 {{ group?.currency }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5">
          <p class="text-sm text-gray-500 mb-1">Мой баланс</p>
          <p class="text-2xl font-bold text-green-600">0 {{ group?.currency }}</p>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="group" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Расходы -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-gray-900">Расходы</h2>
              <button
                @click="showExpenseForm = true"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Добавить расход
              </button>
            </div>

            <div class="text-center py-8 text-gray-500">
              <p>Пока нет расходов</p>
              <p class="text-sm mt-2">Нажмите "Добавить расход", чтобы создать первый расход в группе</p>
            </div>
          </div>
        </div>

        <!-- Участники -->
        <div>
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-6">Участники</h2>

            <div class="space-y-4">
              <div v-if="group.is_owner" class="p-3 bg-yellow-50 rounded-lg">
                <p class="text-sm text-yellow-700">👑 Вы владелец группы</p>
              </div>
              <div v-else-if="group.is_admin" class="p-3 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-700">⚡ Вы администратор</p>
              </div>
              <div v-else class="p-3 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-700">👤 Вы участник</p>
              </div>
            </div>

            <button
              @click="showInviteForm = true"
              class="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Пригласить участника
            </button>

            <button
              @click="showLeaveConfirm = true"
              class="w-full mt-3 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Покинуть группу
            </button>
          </div>
        </div>
      </div>

      <ExpenseForm
        v-if="showExpenseForm"
        :group-id="groupId"
        :members="[]"
        :loading="expenseLoading"
        :error="expenseError"
        @close="showExpenseForm = false"
        @submit="handleCreateExpense"
      />

      <InviteForm
        v-if="showInviteForm"
        :group-id="groupId"
        :loading="inviteLoading"
        :error="inviteError"
        @close="showInviteForm = false"
        @submit="handleInviteUser"
      />

      <div v-if="showLeaveConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl max-w-md w-full p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Покинуть группу</h3>
          <p class="text-gray-600 mb-6">Вы уверены, что хотите покинуть группу "{{ group?.name }}"?</p>
          <div class="flex space-x-3">
            <button
              @click="showLeaveConfirm = false"
              class="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              @click="handleLeaveGroup"
              :disabled="leaveLoading"
              class="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {{ leaveLoading ? 'Выход...' : 'Покинуть' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import groupsApi from '../../js/api/groups'
import ExpenseForm from '../../js/components/groups/ExpenseForm.vue'
import InviteForm from '../../js/components/groups/InviteForm.vue'

const router = useRouter()
const route = useRoute()
const groupId = route.params.groupId

const group = ref(null)
const loading = ref(false)
const inviteLoading = ref(false)
const inviteError = ref('')
const leaveLoading = ref(false)
const expenseLoading = ref(false)
const expenseError = ref('')
const showInviteForm = ref(false)
const showLeaveConfirm = ref(false)
const showExpenseForm = ref(false)

const membersCount = computed(() => {
  return group.value?.members_count || 1
})

const loadGroupData = async () => {
  loading.value = true
  try {
    const response = await groupsApi.getGroup(groupId)
    group.value = response.data || response
  } catch (err) {
    alert('Ошибка загрузки данных группы')
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
    await loadGroupData()
    alert('Пользователь приглашен')
  } catch (err) {
    inviteError.value = err.response?.data?.message || 'Ошибка приглашения пользователя'
  } finally {
    inviteLoading.value = false
  }
}

const handleLeaveGroup = async () => {
  leaveLoading.value = true
  try {
    await groupsApi.leaveGroup(groupId)
    router.push('/dashboard')
  } catch (err) {
    alert('Ошибка при выходе из группы')
  } finally {
    leaveLoading.value = false
    showLeaveConfirm.value = false
  }
}

const handleCreateExpense = async (expenseData) => {
  expenseLoading.value = true
  expenseError.value = ''
  try {
    alert('Функция добавления расходов временно недоступна')
    showExpenseForm.value = false
  } catch (err) {
    expenseError.value = 'Ошибка создания расхода'
  } finally {
    expenseLoading.value = false
  }
}

const copyInviteCode = () => {
  if (group.value?.invite_code) {
    navigator.clipboard.writeText(group.value.invite_code)
    alert('Код приглашения скопирован')
  }
}

const goBack = () => {
  router.push('/dashboard')
}

onMounted(() => {
  loadGroupData()
})
</script>