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
          <div class="bg-white rounded-xl shadow-sm p-5">
            <p class="text-sm text-gray-500 mb-1">Всего расходов</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatNumber(analytics?.total_expenses || 0) }} {{ group?.currency }}</p>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-5">
            <p class="text-sm text-gray-500 mb-1">Средний расход</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatNumber(analytics?.avg_expense || 0) }} {{ group?.currency }}</p>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-5">
            <p class="text-sm text-gray-500 mb-1">Максимальный расход</p>
            <p class="text-2xl font-bold text-blue-600">{{ formatNumber(analytics?.max_expense || 0) }} {{ group?.currency }}</p>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-5">
            <p class="text-sm text-gray-500 mb-1">Количество расходов</p>
            <p class="text-2xl font-bold text-purple-600">{{ analytics?.total_count || 0 }}</p>
          </div>
        </div>

        <!-- График тренда расходов -->
        <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-gray-900">Динамика расходов</h2>
            <div class="flex space-x-2">
              <button
                v-for="trendPeriod in ['week', 'month', 'year']"
                :key="trendPeriod"
                @click="trendPeriod = period"
                class="px-3 py-1 text-sm rounded-lg transition-colors"
                :class="selectedTrendPeriod === trendPeriod ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'"
              >
                {{ trendPeriod === 'week' ? 'Неделя' : trendPeriod === 'month' ? 'Месяц' : 'Год' }}
              </button>
            </div>
          </div>
          <div class="h-80 flex items-center justify-center text-gray-400">
            График будет здесь (можно добавить Chart.js или ECharts)
          </div>
        </div>

        <!-- Расходы по категориям -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Расходы по категориям</h2>
            <div v-if="categoryBreakdown.length === 0" class="text-center py-8 text-gray-500">
              Нет данных по категориям
            </div>
            <div v-else class="space-y-4">
              <div v-for="cat in categoryBreakdown" :key="cat.category_id" class="flex items-center">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3" :style="{ backgroundColor: cat.color + '20' }">
                  <span class="text-lg" :style="{ color: cat.color }">{{ cat.icon }}</span>
                </div>
                <div class="flex-1">
                  <div class="flex justify-between mb-1">
                    <span class="text-sm font-medium text-gray-900">{{ cat.category_name }}</span>
                    <span class="text-sm font-bold text-gray-900">{{ formatNumber(cat.total) }} {{ group?.currency }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="h-2 rounded-full transition-all duration-300"
                      :style="{
                        width: cat.percentage + '%',
                        backgroundColor: cat.color
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Сравнение участников -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Кто сколько потратил</h2>
            <div v-if="userComparison.length === 0" class="text-center py-8 text-gray-500">
              Нет данных по участникам
            </div>
            <div v-else class="space-y-3">
              <div v-for="user in userComparison" :key="user.user_id" class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold mr-3">
                  {{ getUserInitials(user) }}
                </div>
                <div class="flex-1">
                  <div class="flex justify-between mb-1">
                    <span class="text-sm font-medium text-gray-900">{{ user.user_name }}</span>
                    <span class="text-sm font-bold" :class="user.total > 0 ? 'text-blue-600' : 'text-gray-500'">
                      {{ formatNumber(user.total) }} {{ group?.currency }}
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="h-2 rounded-full bg-blue-500 transition-all duration-300"
                      :style="{ width: user.percentage + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Сравнение периодов -->
        <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Сравнение периодов</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-gray-50 rounded-lg text-center">
              <p class="text-sm text-gray-500 mb-1">Текущий период</p>
              <p class="text-xl font-bold text-gray-900">{{ formatNumber(periodComparison?.current?.total || 0) }} {{ group?.currency }}</p>
              <p class="text-xs text-gray-400">{{ periodComparison?.current?.count || 0 }} расходов</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg text-center">
              <p class="text-sm text-gray-500 mb-1">Предыдущий период</p>
              <p class="text-xl font-bold text-gray-900">{{ formatNumber(periodComparison?.previous?.total || 0) }} {{ group?.currency }}</p>
              <p class="text-xs text-gray-400">{{ periodComparison?.previous?.count || 0 }} расходов</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg text-center">
              <p class="text-sm text-gray-500 mb-1">Изменение</p>
              <p :class="periodComparison?.change > 0 ? 'text-red-600' : periodComparison?.change < 0 ? 'text-green-600' : 'text-gray-600'" class="text-xl font-bold">
                {{ periodComparison?.change > 0 ? '+' : '' }}{{ periodComparison?.change || 0 }}%
              </p>
              <p class="text-xs text-gray-400">
                {{ periodComparison?.change > 0 ? '↑ рост' : periodComparison?.change < 0 ? '↓ снижение' : 'без изменений' }}
              </p>
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
import groupsApi from '../../api/groups'
import analyticsApi from '../../api/analytics'
import { useNotification } from '../../composables/useNotification'

const router = useRouter()
const route = useRoute()
const groupId = route.params.groupId
const { handleApiError } = useNotification()

const group = ref(null)
const analytics = ref(null)
const categoryBreakdown = ref([])
const userComparison = ref([])
const periodComparison = ref(null)
const loading = ref(false)
const selectedPeriod = ref('month')
const selectedTrendPeriod = ref('month')

const loadGroup = async () => {
  try {
    const response = await groupsApi.getGroup(groupId)
    group.value = response.data || response
  } catch (err) {
    handleApiError(err, 'Ошибка загрузки группы')
  }
}

const loadAnalytics = async () => {
  loading.value = true
  try {
    const [analyticsData, categoryData, userData, periodData] = await Promise.all([
      analyticsApi.getGroupAnalytics(groupId),
      analyticsApi.getCategoryBreakdown(groupId),
      analyticsApi.getUserSpendingComparison(groupId),
      analyticsApi.getPeriodComparison(groupId, selectedPeriod.value, 'previous')
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
})

onMounted(() => {
  loadGroup()
  loadAnalytics()
})
</script>