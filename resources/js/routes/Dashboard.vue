<template>
  <div v-if="!isAuthenticated" class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <p class="text-gray-600 mb-4">Требуется авторизация</p>
      <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-medium">
        Перейти к входу
      </router-link>
    </div>
  </div>

  <div v-else class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
    <Sidebar 
      :mobileMenuOpen="mobileMenuOpen"
      @toggle-menu="mobileMenuOpen = !mobileMenuOpen"
      @close-menu="mobileMenuOpen = false"
      class="hidden lg:block lg:w-72 lg:flex-shrink-0"
    />
    
    <div 
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-50 lg:hidden"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="mobileMenuOpen = false"></div>
      <div class="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
        <Sidebar 
          :mobileMenuOpen="mobileMenuOpen"
          @toggle-menu="mobileMenuOpen = !mobileMenuOpen"
          @close-menu="mobileMenuOpen = false"
        />
      </div>
    </div>

    <div class="flex-1 min-w-0 flex flex-col">
      <DashboardHeader 
        :mobileMenuOpen="mobileMenuOpen"
        :selectedPeriod="selectedPeriod"
        @toggle-menu="mobileMenuOpen = !mobileMenuOpen"
        @add-expense="showAddExpense = true"
        @select-period="handlePeriodChange"
        @toggle-more-periods="showMorePeriods = !showMorePeriods"
      />

      <main class="flex-1 overflow-y-auto p-4 lg:p-6 xl:p-8">
        <div v-if="dashboardLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="dashboardError" class="text-center py-12">
          <p class="text-red-600 mb-4">{{ dashboardError }}</p>
          <button 
            @click="loadDashboardData"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Попробовать снова
          </button>
        </div>

        <div v-else class="max-w-7xl mx-auto">
          <DashboardStats :stats="stats" />

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
            <div class="lg:col-span-2">
              <CategoriesChart 
                :categories="categories"
                v-model:selectedPeriod="selectedCategoryPeriod"
              />
            </div>
            <div>
              <RecentTransactions :transactions="recentTransactions" />
            </div>
          </div>

          <UserGroups 
            :groups="userGroups" 
            @create-group="handleCreateGroup" 
          />
        </div>
      </main>

      <MobileNavigation 
        class="lg:hidden"
        @navigate="goToMobile" 
      />
    </div>

    <AddExpenseModal 
      v-if="showAddExpense"
      :new-expense="newExpense"
      :expense-categories="expenseCategories"
      :user-groups="userGroups"
      @close="showAddExpense = false"
      @add-expense="handleAddExpense"
      @update-expense="updateExpenseField"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useDashboard } from '../composables/useDashboard'

import Sidebar from '../components/layout/Sidebar.vue'
import DashboardHeader from '../components/layout/DashboardHeader.vue'
import DashboardStats from '../components/layout/DashboardStats.vue'
import CategoriesChart from '../components/layout/CategoriesChart.vue'
import RecentTransactions from '../components/layout/RecentTransactions.vue'
import UserGroups from '../components/layout/UserGroups.vue'
import MobileNavigation from '../components/layout/MobileNavigation.vue'
import AddExpenseModal from '../components/layout/AddExpenseModal.vue'

const router = useRouter()
const { isAuthenticated, checkAuth } = useAuth()
const { 
  loading: dashboardLoading,
  error: dashboardError,
  stats,
  categories,
  recentTransactions,
  userGroups,
  loadDashboardData,
  addExpense,
  createGroup,
  formatNumber
} = useDashboard()

const mobileMenuOpen = ref(false)
const selectedPeriod = ref('Сегодня')
const selectedCategoryPeriod = ref('month')
const showAddExpense = ref(false)
const currentMobileNav = ref('/dashboard')
const showMorePeriods = ref(false)

const newExpense = reactive({
  type: 'expense',
  amount: '',
  category: '',
  description: '',
  groupId: ''
})

const expenseCategories = ref([
  { id: 1, name: 'Продукты' },
  { id: 2, name: 'Транспорт' },
  { id: 3, name: 'Кафе' },
  { id: 4, name: 'Развлечения' },
  { id: 5, name: 'Здоровье' },
  { id: 6, name: 'Образование' },
  { id: 7, name: 'Одежда' },
  { id: 8, name: 'Красота' },
  { id: 9, name: 'Подарки' },
  { id: 10, name: 'Другое' }
])

const goToMobile = (path) => {
  currentMobileNav.value = path
  router.push(path)
  mobileMenuOpen.value = false
}

const handlePeriodChange = (period) => {
  selectedPeriod.value = period
  loadDashboardData()
}

const updateExpenseField = (payload) => {
  Object.assign(newExpense, payload)
}

const handleAddExpense = async () => {
  try {
    await addExpense(newExpense)
    
    newExpense.type = 'expense'
    newExpense.amount = ''
    newExpense.category = ''
    newExpense.description = ''
    newExpense.groupId = ''
    showAddExpense.value = false
    
    alert('Транзакция успешно добавлена!')
  } catch (err) {
    alert(err.message || 'Ошибка при добавлении транзакции')
  }
}

const handleCreateGroup = async () => {
  const groupName = prompt('Введите название группы:')
  if (!groupName) return

  try {
    await createGroup({ name: groupName })
    alert(`Группа "${groupName}" создана!`)
  } catch (err) {
    alert(err.message || 'Ошибка при создании группы')
  }
}

onMounted(async () => {
  await checkAuth()
})
</script>