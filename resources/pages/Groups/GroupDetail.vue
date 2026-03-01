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
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
              <p class="text-sm text-gray-400 mt-2">Нажмите "Добавить расход", чтобы создать первый расход</p>
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

            <div v-if="loading" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="member in group?.users || []"
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
                    <p class="text-sm text-gray-500">{{ member.email }}</p>
                  </div>
                </div>
              </div>
            </div>
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import groupsApi from '../../js/api/groups'
import expensesApi from '../../js/api/expenses'
import ExpenseForm from '../../js/components/groups/ExpenseForm.vue'
import { useAuth } from '../../js/composables/useAuth'
import { useNotification } from '../../js/composables/useNotification'

const router = useRouter()
const route = useRoute()
const { user } = useAuth()
const { showSuccess, handleApiError } = useNotification()
const groupId = route.params.groupId

const notification = useNotification()
const showSuccess = notification.showSuccess
const showError = notification.showError
const handleApiError = notification.handleApiError

const group = ref(null)
const expenses = ref([])
const loading = ref(false)
const expenseLoading = ref(false)
const expenseError = ref('')
const showExpenseForm = ref(false)

const loadGroupData = async () => {
  loading.value = true
  try {
    // Загружаем только группу, без расходов
    const groupResponse = await groupsApi.getGroup(groupId)
    group.value = groupResponse.data || groupResponse
    console.log('✅ Группа загружена:', group.value)
    
    
    // const expensesResponse = await expensesApi.getGroupExpenses(groupId)
    // expenses.value = expensesResponse.data || expensesResponse
    
  } catch (err) {
    console.error('❌ Ошибка загрузки группы:', err)
    handleApiError(err, 'Ошибка загрузки данных')
  } finally {
    loading.value = false
  }
}

<<<<<<< HEAD
const loadExpenses = async () => {
  console.log('📥 Начало загрузки расходов для группы:', groupId)
  expensesLoading.value = true
  try {
    console.log('📡 Отправка запроса к API...')
    const response = await expensesApi.getGroupExpenses(groupId)
    console.log('✅ API ответ получен:', response)
    console.log('📊 Структура ответа:', {
      hasData: !!response.data,
      dataType: typeof response.data,
      isArray: Array.isArray(response.data),
      responseKeys: Object.keys(response)
    })
    
    expenses.value = response.data || response
    console.log('📦 Установлены expenses:', expenses.value)
  } catch (err) {
    console.error('❌ Ошибка загрузки расходов:')
    console.error('   Статус:', err.response?.status)
    console.error('   Данные ошибки:', err.response?.data)
    console.error('   Заголовки:', err.response?.headers)
    console.error('   Полная ошибка:', err)
    
    handleApiError(err, 'Ошибка загрузки расходов')
  } finally {
    console.log('🏁 Загрузка расходов завершена')
    expensesLoading.value = false
  }
}

=======
>>>>>>> 2e89e6d8394f8bbf1a3967f4f66d83e4d3107f3c
const handleCreateExpense = async (expenseData) => {
  console.log('📝 Создание расхода с данными:', expenseData)
  expenseLoading.value = true
  expenseError.value = ''
  
  try {
    console.log('📡 Отправка запроса к API...')
    const response = await expensesApi.createExpense(groupId, expenseData)
    console.log('✅ Ответ от API:', response)
    
    showExpenseForm.value = false
    await loadGroupData()
    showSuccess('Расход успешно добавлен')
  } catch (err) {
    console.error('❌ Детали ошибки:', err)
    console.error('Статус:', err.response?.status)
    console.error('Данные ошибки:', err.response?.data)
    console.error('Заголовки:', err.response?.headers)
    
    expenseError.value = err.response?.data?.message || 'Ошибка создания расхода'
    handleApiError(err, 'Ошибка при создании расхода')
  } finally {
    expenseLoading.value = false
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
  loadExpenses()
})
</script>