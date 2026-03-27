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
      <div v-if="!loading && stats" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
          <p class="text-sm text-gray-500 mb-1">Всего расходов</p>
          <p class="text-2xl font-bold text-gray-900">{{ formatNumber(stats.total_expenses) }} {{ group?.currency }}</p>
          <p class="text-xs text-gray-400 mt-1">Средний чек: {{ formatNumber(stats.avg_expense_per_member) }} {{ group?.currency }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
          <p class="text-sm text-gray-500 mb-1">Участников</p>
          <p class="text-2xl font-bold text-gray-900">{{ stats.member_count }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
          <p class="text-sm text-gray-500 mb-1">Мои расходы</p>
          <p class="text-2xl font-bold text-blue-600">{{ formatNumber(stats.user_expenses) }} {{ group?.currency }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
          <p class="text-sm text-gray-500 mb-1">Мой баланс</p>
          <p :class="userStats.balance > 0 ? 'text-2xl font-bold text-green-600' : userStats.balance < 0 ? 'text-2xl font-bold text-red-600' : 'text-2xl font-bold text-gray-600'">
            {{ userStats.balance > 0 ? '+' : '' }}{{ formatNumber(userStats.balance) }} {{ group?.currency }}
          </p>
          <p class="text-xs text-gray-400 mt-1">
            <span v-if="userStats.balance > 0">Вам должны {{ formatNumber(userStats.balance) }} {{ group?.currency }}</span>
            <span v-else-if="userStats.balance < 0">Вы должны {{ formatNumber(Math.abs(userStats.balance)) }} {{ group?.currency }}</span>
            <span v-else>Вы в расчете</span>
          </p>
        </div>
      </div>

      <div v-if="!loading && stats?.top_categories?.length" class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Топ категорий расходов</h2>
        <div class="space-y-4">
          <div v-for="category in stats.top_categories" :key="category.category_name" class="flex items-center">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-3" :style="{ backgroundColor: category.category_color + '20' }">
              <span class="text-xl" :style="{ color: category.category_color }">{{ category.category_icon }}</span>
            </div>
            <div class="flex-1">
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-900">{{ category.category_name }}</span>
                <span class="text-sm font-bold text-gray-900">{{ formatNumber(category.total) }} {{ group?.currency }} ({{ category.percentage }}%)</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-300" 
                  :style="{
                    width: category.percentage + '%',
                    backgroundColor: category.category_color
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Динамика по месяцам -->
      <div v-if="!loading && stats?.monthly_expenses?.length" class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Динамика расходов</h2>
        <div class="space-y-3">
          <div v-for="month in stats.monthly_expenses" :key="month.month" class="flex items-center">
            <div class="w-24 text-sm text-gray-600">{{ formatMonth(month.month) }}</div>
            <div class="flex-1">
              <div class="w-full bg-gray-200 rounded-full h-8">
                <div 
                  class="h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-end px-3 text-white text-sm font-medium"
                  :style="{ width: getMonthPercentage(month.total) + '%' }"
                >
                  {{ formatNumber(month.total) }} {{ group?.currency }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="group" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

            <div v-if="expensesLoading" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>

            <div v-else-if="expenses.length === 0" class="text-center py-8 text-gray-500">
              <p>Пока нет расходов</p>
              <p class="text-sm mt-2">Нажмите "Добавить расход", чтобы создать первый расход в группе</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="expense in expenses"
                :key="expense.id"
                class="border-b border-gray-100 last:border-0 pb-4 last:pb-0 hover:bg-gray-50 p-3 rounded-lg transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div class="flex items-start space-x-3">
                    <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      {{ getCategoryIcon(expense.category?.name) }}
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">{{ expense.description }}</p>
                      <p class="text-sm text-gray-500">
                        {{ expense.payer?.first_name || expense.payer?.username }} платил •
                        {{ formatDate(expense.date) }}
                      </p>
                      <p v-if="expense.participants?.length" class="text-xs text-gray-400 mt-1">
                        Участники: {{ expense.participants.map(p => p.first_name || p.username).join(', ') }}
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-gray-900">{{ formatNumber(expense.amount) }} {{ group?.currency }}</p>
                    <p class="text-xs text-gray-500">{{ expense.category?.name || 'Без категории' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-6">Участники</h2>

            <div class="space-y-4 mb-6">
              <div v-if="group.is_owner" class="p-3 bg-yellow-50 rounded-lg">
                <p class="text-sm text-yellow-700">👑 Вы владелец группы</p>
              </div>
              <div v-else-if="group.is_admin" class="p-3 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-700">⚡ Вы администратор</p>
              </div>

              <div
                v-for="member in group.users"
                :key="member.id"
                class="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                    {{ getUserInitials(member) }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ member.first_name || member.username }}
                      <span v-if="member.pivot?.role === 'owner'" class="ml-1 text-xs text-yellow-600">👑</span>
                      <span v-else-if="member.pivot?.role === 'admin'" class="ml-1 text-xs text-blue-600">⚡</span>
                    </p>
                    <p class="text-xs text-gray-500">{{ member.email }}</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              @click="showInviteForm = true"
              class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-3"
            >
              + Пригласить участника
            </button>

            <button
              @click="showLeaveConfirm = true"
              class="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Покинуть группу
            </button>
          </div>
        </div>
      </div>

      <ExpenseForm
        v-if="showExpenseForm"
        :group-id="groupId"
        :members="group?.users || []"
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
import expensesApi from '../../js/api/expenses'
import ExpenseForm from '../../js/components/groups/ExpenseForm.vue'
import InviteForm from '../../js/components/groups/InviteForm.vue'
import { useAuth } from '../../js/composables/useAuth'
import { useNotification } from '../../js/composables/useNotification'

const router = useRouter()
const route = useRoute()
const { user } = useAuth()
const { showSuccess, handleApiError } = useNotification()
const groupId = route.params.groupId

const group = ref(null)
const expenses = ref([])
const stats = ref(null)
const userStats = ref({ balance: 0 })
const loading = ref(false)
const expensesLoading = ref(false)
const expenseLoading = ref(false)
const expenseError = ref('')
const inviteLoading = ref(false)
const inviteError = ref('')
const leaveLoading = ref(false)
const showExpenseForm = ref(false)
const showInviteForm = ref(false)
const showLeaveConfirm = ref(false)

const loadGroupData = async () => {
  loading.value = true
  try {
    const [groupResponse, statsResponse] = await Promise.all([
      groupsApi.getGroup(groupId),
      groupsApi.getGroupStats(groupId)
    ])
    
    group.value = groupResponse.data || groupResponse
    stats.value = statsResponse.data || statsResponse
    
    const userStatsResponse = await groupsApi.getMemberStats(groupId, user.value.id)
    userStats.value = userStatsResponse.data || userStatsResponse
  } catch (err) {
    handleApiError(err, 'Ошибка загрузки данных группы')
  } finally {
    loading.value = false
  }
}

const loadExpenses = async () => {
  expensesLoading.value = true
  try {
    const response = await expensesApi.getGroupExpenses(groupId)
    expenses.value = response.data || response
  } catch (err) {
    handleApiError(err, 'Ошибка загрузки расходов')
  } finally {
    expensesLoading.value = false
  }
}

const handleCreateExpense = async (expenseData) => {
  expenseLoading.value = true
  expenseError.value = ''
  try {
    await expensesApi.createExpense(groupId, expenseData)
    showExpenseForm.value = false
    await Promise.all([loadExpenses(), loadGroupData()])
    showSuccess('Расход успешно добавлен')
  } catch (err) {
    expenseError.value = err.response?.data?.message || 'Ошибка создания расхода'
    handleApiError(err, 'Ошибка при создании расхода')
  } finally {
    expenseLoading.value = false
  }
}

const handleInviteUser = async (inviteData) => {
  inviteLoading.value = true
  inviteError.value = ''
  try {
    await groupsApi.inviteUser(groupId, inviteData)
    showInviteForm.value = false
    await loadGroupData()
    showSuccess('Пользователь успешно приглашен в группу')
  } catch (err) {
    inviteError.value = err.response?.data?.message || 'Ошибка приглашения'
    handleApiError(err, 'Ошибка при приглашении пользователя')
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
  router.push('/dashboard')
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('ru-RU').format(num || 0)
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('ru-RU')
}

const formatMonth = (monthStr) => {
  if (!monthStr) return ''
  const [year, month] = monthStr.split('-')
  const date = new Date(year, month - 1, 1)
  return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
}

const getMonthPercentage = (total) => {
  if (!stats.value?.monthly_expenses?.length) return 0
  const maxTotal = Math.max(...stats.value.monthly_expenses.map(m => m.total))
  return maxTotal > 0 ? (total / maxTotal) * 100 : 0
}

const getCategoryIcon = (category) => {
  const icons = {
    'Продукты': '🛒',
    'Транспорт': '🚗',
    'Кафе': '☕',
    'Ресторан': '🍽️',
    'Развлечения': '🎬',
    'Здоровье': '🏥',
    'Образование': '📚',
    'Одежда': '👕',
    'Красота': '💄',
    'Подарки': '🎁',
    'Другое': '📦'
  }
  return icons[category] || '💸'
}

const getUserInitials = (member) => {
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

onMounted(() => {
  loadGroupData()
  loadExpenses()
})
</script>