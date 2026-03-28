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
              <h1 class="text-3xl font-bold text-gray-900">Аналитика группы</h1>
              <p class="text-gray-600 mt-1">{{ group?.name }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <select v-model="selectedPeriod" class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="week">За неделю</option>
              <option value="month">За месяц</option>
              <option value="year">За год</option>
            </select>
            <button
              @click="refreshData"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Обновить
            </button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">Всего расходов</p>
                <p class="text-2xl font-bold text-gray-900">{{ formatNumber(analytics?.total_expenses || 0) }} {{ group?.currency }}</p>
              </div>
              <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">Средний расход</p>
                <p class="text-2xl font-bold text-gray-900">{{ formatNumber(analytics?.avg_expense || 0) }} {{ group?.currency }}</p>
              </div>
              <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">Максимальный расход</p>
                <p class="text-2xl font-bold text-blue-600">{{ formatNumber(analytics?.max_expense || 0) }} {{ group?.currency }}</p>
              </div>
              <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
              </svg>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">Количество расходов</p>
                <p class="text-2xl font-bold text-purple-600">{{ analytics?.total_count || 0 }}</p>
              </div>
              <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
          </div>
        </div>

        <ChartSwitcher
          title="Динамика расходов"
          :line-data="spendingTrend"
          :bar-data="spendingTrend"
          :pie-data="categoryBreakdown"
          :currency="group?.currency"
        />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span class="mr-2">📊</span> Сравнение участников
            </h2>
            <div v-if="userComparison.length === 0" class="text-center py-8 text-gray-500">
              Нет данных по участникам
            </div>
            <div v-else class="space-y-3">
              <div v-for="user in userComparison.slice(0, 5)" :key="user.user_id" class="flex items-center group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold mr-3 shadow-sm">
                  {{ getUserInitials(user) }}
                </div>
                <div class="flex-1">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm font-medium text-gray-900">{{ user.user_name }}</span>
                    <span class="text-sm font-bold text-blue-600">{{ formatNumber(user.total) }} {{ group?.currency }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                      :style="{ width: user.percentage + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
              <div v-if="userComparison.length > 5" class="text-center pt-2">
                <button class="text-sm text-blue-600 hover:text-blue-700">Показать всех →</button>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span class="mr-2">📈</span> Сравнение периодов
            </h2>
            <div class="grid grid-cols-1 gap-4">
              <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="text-sm text-gray-500 mb-1">Текущий период</p>
                    <p class="text-2xl font-bold text-gray-900">{{ formatNumber(periodComparison?.current?.total || 0) }} {{ group?.currency }}</p>
                    <p class="text-xs text-gray-400 mt-1">{{ periodComparison?.current?.count || 0 }} расходов</p>
                  </div>
                  <div class="text-right">
                    <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="text-sm text-gray-500 mb-1">Предыдущий период</p>
                    <p class="text-2xl font-bold text-gray-900">{{ formatNumber(periodComparison?.previous?.total || 0) }} {{ group?.currency }}</p>
                    <p class="text-xs text-gray-400 mt-1">{{ periodComparison?.previous?.count || 0 }} расходов</p>
                  </div>
                  <div class="text-right">
                    <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-white border-2 border-gray-100 rounded-xl p-4 text-center">
                <p class="text-sm text-gray-500 mb-2">Динамика</p>
                <div class="flex items-center justify-center space-x-2">
                  <svg v-if="periodComparison?.change > 0" class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                  </svg>
                  <svg v-else-if="periodComparison?.change < 0" class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                  <span :class="periodComparison?.change > 0 ? 'text-red-600' : periodComparison?.change < 0 ? 'text-green-600' : 'text-gray-600'" class="text-2xl font-bold">
                    {{ periodComparison?.change > 0 ? '+' : '' }}{{ periodComparison?.change || 0 }}%
                  </span>
                </div>
                <p class="text-xs text-gray-400 mt-2">
                  {{ periodComparison?.change > 0 ? 'Расходы выросли' : periodComparison?.change < 0 ? 'Расходы снизились' : 'Без изменений' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import groupsApi from '../../js/api/groups'
import analyticsApi from '../../js/api/analytics'
import { useNotification } from '../../js/composables/useNotification'
import ChartSwitcher from '../../js/components/charts/ChartSwitcher.vue'

const router = useRouter()
const route = useRoute()
const groupId = route.params.groupId
const { handleApiError } = useNotification()

const group = ref(null)
const analytics = ref(null)
const categoryBreakdown = ref([])
const userComparison = ref([])
const periodComparison = ref(null)
const spendingTrend = ref([])
const loading = ref(false)
const selectedPeriod = ref('month')

const loadGroup = async () => {
  try {
    const response = await groupsApi.getGroup(groupId)
    group.value = response.data || response
  } catch (err) {
    handleApiError(err, 'Ошибка загрузки группы')
  }
}

const loadSpendingTrend = async () => {
  try {
    const response = await analyticsApi.getSpendingTrend(groupId, selectedPeriod.value)
    spendingTrend.value = response.data || response
  } catch (err) {
    handleApiError(err, 'Ошибка загрузки тренда расходов')
  }
}

const loadAnalytics = async () => {
  loading.value = true
  try {
    const [analyticsData, categoryData, userData, periodData] = await Promise.all([
      analyticsApi.getGroupAnalytics(groupId),
      analyticsApi.getCategoryBreakdown(groupId),
      analyticsApi.getUserSpendingComparison(groupId),
      analyticsApi.getPeriodComparison(groupId, selectedPeriod.value)
    ])
    
    analytics.value = analyticsData.data || analyticsData
    categoryBreakdown.value = categoryData.data || categoryData
    userComparison.value = userData.data || userData
    periodComparison.value = periodData.data || periodData
  } catch (err) {
    handleApiError(err, 'Ошибка загрузки аналитики')
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  loadAnalytics()
  loadSpendingTrend()
}

const goBack = () => {
  router.push(`/groups/${groupId}`)
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('ru-RU').format(num || 0)
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

watch(selectedPeriod, () => {
  loadAnalytics()
  loadSpendingTrend()
})

onMounted(() => {
  loadGroup()
  loadAnalytics()
  loadSpendingTrend()
})
</script>