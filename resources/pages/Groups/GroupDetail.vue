<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Шапка группы -->
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
              @click="router.push(`/groups/${groupId}/manage`)"
              class="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Управление
            </button>
          </div>
        </div>
      </div>

      <!-- Статистика -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-5">
          <p class="text-sm text-gray-500 mb-1">Всего расходов</p>
          <p class="text-2xl font-bold text-gray-900">{{ formatNumber(totalExpenses) }} {{ group?.currency }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5">
          <p class="text-sm text-gray-500 mb-1">Участников</p>
          <p class="text-2xl font-bold text-gray-900">{{ group?.users?.length || 0 }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5">
          <p class="text-sm text-gray-500 mb-1">Мои расходы</p>
          <p class="text-2xl font-bold text-blue-600">{{ formatNumber(myTotal) }} {{ group?.currency }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5">
          <p class="text-sm text-gray-500 mb-1">Мой баланс</p>
          <p :class="myBalance >= 0 ? 'text-2xl font-bold text-green-600' : 'text-2xl font-bold text-red-600'">
            {{ myBalance >= 0 ? '+' : '' }}{{ formatNumber(myBalance) }} {{ group?.currency }}
          </p>
        </div>
      </div>

      <!-- Долги (упрощенные) -->
      <div v-if="simplifiedDebts.length > 0" class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Кто кому должен</h2>
        <div class="space-y-3">
          <div
            v-for="debt in simplifiedDebts"
            :key="`${debt.from}-${debt.to}`"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <span class="font-medium text-gray-900">{{ debt.from_name }}</span>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
              <span class="font-medium text-gray-900">{{ debt.to_name }}</span>
            </div>
            <span class="font-bold text-red-600">{{ formatNumber(debt.amount) }} {{ group?.currency }}</span>
          </div>
        </div>
      </div>

      <!-- Основной контент: расходы и участники -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Список расходов -->
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

            <div v-if="loading" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>

            <div v-else-if="expenses.length === 0" class="text-center py-8">
              <p class="text-gray-500">Пока нет расходов</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="expense in expenses"
                :key="expense.id"
                class="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
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

        <!-- Список участников -->
        <div>
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-6">Участники</h2>

            <div class="space-y-4">
              <div
                v-for="member in group?.users"
                :key="member.id"
                class="flex items-center justify-between"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                    {{ getUserInitials(member) }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">
                      {{ member.first_name || member.username }}
                      <span v-if="member.pivot?.role === 'owner'" class="ml-2 text-xs text-yellow-600">👑</span>
                      <span v-else-if="member.pivot?.role === 'admin'" class="ml-2 text-xs text-blue-600">⚡</span>
                    </p>
                    <p class="text-sm text-gray-500">{{ getMemberBalance(member.id) }}</p>
                  </div>
                </div>
                <span :class="getBalanceClass(member.id)">
                  {{ formatNumber(getUserBalance(member.id)) }} {{ group?.currency }}
                </span>
              </div>
            </div>

            <button
              @click="showInviteForm = true"
              class="w-full mt-6 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              + Пригласить участника
            </button>
          </div>
        </div>
      </div>

      <!-- Модалка добавления расхода -->
      <ExpenseForm
        v-if="showExpenseForm"
        :group-id="groupId"
        :members="group?.users || []"
        :loading="expenseLoading"
        :error="expenseError"
        @close="showExpenseForm = false"
        @submit="handleCreateExpense"
      />

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
import ExpenseForm from '../../components/groups/ExpenseForm.vue'
import InviteForm from '../../components/groups/InviteForm.vue'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const route = useRoute()
const { user } = useAuth()
const groupId = route.params.groupId

const group = ref(null)
const expenses = ref([])
const balances = ref([])
const simplifiedDebts = ref([])
const loading = ref(false)
const expenseLoading = ref(false)
const expenseError = ref('')
const inviteLoading = ref(false)
const inviteError = ref('')
const showExpenseForm = ref(false)
const showInviteForm = ref(false)

const totalExpenses = computed(() => {
  return expenses.value.reduce((sum, exp) => sum + exp.amount, 0)
})

const myTotal = computed(() => {
  return expenses.value
    .filter(exp => exp.payer_id === user.value?.id)
    .reduce((sum, exp) => sum + exp.amount, 0)
})

const myBalance = computed(() => {
  const myBal = balances.value.find(b => b.user_id === user.value?.id)
  return myBal?.balance || 0
})

const getMemberBalance = (userId) => {
  const bal = balances.value.find(b => b.user_id === userId)
  if (!bal) return '0'
  return bal.balance > 0 ? 'должен получить' : bal.balance < 0 ? 'должен отдать' : 'в расчете'
}

const getUserBalance = (userId) => {
  const bal = balances.value.find(b => b.user_id === userId)
  return bal?.balance || 0
}

const getBalanceClass = (userId) => {
  const bal = getUserBalance(userId)
  if (bal > 0) return 'text-green-600 font-medium'
  if (bal < 0) return 'text-red-600 font-medium'
  return 'text-gray-600'
}

const loadGroupData = async () => {
  loading.value = true
  try {
    const [groupData, expensesData, balancesData, debtsData] = await Promise.all([
      groupsApi.getGroup(groupId),
      groupsApi.getGroupExpenses(groupId),
      groupsApi.getGroupBalances(groupId),
      groupsApi.getSimplifiedDebts(groupId)
    ])

    group.value = groupData.data || groupData
    expenses.value = expensesData.data || expensesData
    balances.value = balancesData.data || balancesData
    simplifiedDebts.value = debtsData.data || debtsData
  } catch (err) {
    console.error('Error loading group data:', err)
    alert('Ошибка загрузки данных группы')
  } finally {
    loading.value = false
  }
}

const handleCreateExpense = async (expenseData) => {
  expenseLoading.value = true
  expenseError.value = ''
  try {
    await groupsApi.createExpense(groupId, expenseData)
    showExpenseForm.value = false
    await loadGroupData()
  } catch (err) {
    expenseError.value = err.response?.data?.message || 'Ошибка создания расхода'
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
  } catch (err) {
    inviteError.value = err.response?.data?.message || 'Ошибка приглашения пользователя'
  } finally {
    inviteLoading.value = false
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
    'Подарки': '🎁'
  }
  return icons[category] || '💸'
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
  loadGroupData()
})
</script>