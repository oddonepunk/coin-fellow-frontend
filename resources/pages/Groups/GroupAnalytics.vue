<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <div class="flex items-center space-x-4">
          <button @click="router.back()" class="p-2 hover:bg-white rounded-lg transition-colors">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Аналитика</h1>
            <p class="text-gray-600 mt-1">{{ group?.name }}</p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Расходы по категориям</h2>
          <div class="space-y-3">
            <div v-for="cat in categoryBreakdown" :key="cat.category_id" class="flex items-center">
              <div class="w-32 text-sm text-gray-600">{{ cat.category_name }}</div>
              <div class="flex-1">
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-blue-500 rounded-full"
                    :style="{ width: cat.percentage + '%' }"
                  ></div>
                </div>
              </div>
              <div class="w-32 text-right text-sm font-medium">
                {{ formatNumber(cat.total) }} {{ group?.currency }}
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Кто сколько потратил</h2>
          <div class="space-y-3">
            <div v-for="user in userComparison" :key="user.user_id" class="flex items-center">
              <div class="w-32 text-sm text-gray-600">{{ user.user_name }}</div>
              <div class="flex-1">
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-green-500 rounded-full"
                    :style="{ width: user.percentage + '%' }"
                  ></div>
                </div>
              </div>
              <div class="w-32 text-right text-sm font-medium">
                {{ formatNumber(user.total) }} {{ group?.currency }}
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Динамика расходов</h2>
          <div class="h-64 flex items-center justify-center text-gray-500">
            График будет здесь (можно добавить Chart.js или аналоги)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import groupsApi from '../../api/groups'

const route = useRoute()
const router = useRouter()
const groupId = route.params.groupId

const loading = ref(false)
const group = ref(null)
const categoryBreakdown = ref([])
const userComparison = ref([])

const loadAnalytics = async () => {
  loading.value = true
  try {
    const [groupData, categoryData, userData] = await Promise.all([
      groupsApi.getGroup(groupId),
      groupsApi.getCategoryBreakdown(groupId),
      groupsApi.getUserSpendingComparison(groupId)
    ])
    
    group.value = groupData.data || groupData
    categoryBreakdown.value = categoryData.data || categoryData
    userComparison.value = userData.data || userData
  } catch (err) {
    console.error('Error loading analytics:', err)
  } finally {
    loading.value = false
  }
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('ru-RU').format(num || 0)
}

onMounted(() => {
  loadAnalytics()
})
</script>