<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
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
        @select-period="selectedPeriod = $event"
        @toggle-more-periods="showMorePeriods = !showMorePeriods"
      />

      <main class="flex-1 overflow-y-auto p-4 lg:p-6 xl:p-8">
        <div class="max-w-7xl mx-auto">
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

          <UserGroups :groups="userGroups" @create-group="createGroup" />
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
      @close="showAddExpense = false"
      @add-expense="addExpenseHandler"
      @update-expense="updateExpenseField"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import Sidebar from '../components/layout/Sidebar.vue'
import DashboardHeader from '../components/layout/DashboardHeader.vue'
import DashboardStats from '../components/layout/DashboardStats.vue'
import CategoriesChart from '../components/layout/CategoriesChart.vue'
import RecentTransactions from '../components/layout/RecentTransactions.vue'
import UserGroups from '../components/layout/UserGroups.vue'
import MobileNavigation from '../components/layout/MobileNavigation.vue'
import AddExpenseModal from '../components/layout/AddExpenseModal.vue'

const router = useRouter()

const mobileMenuOpen = ref(false)
const selectedPeriod = ref('Сегодня')
const selectedCategoryPeriod = ref('month')
const showAddExpense = ref(false)
const currentMobileNav = ref('/dashboard')
const showMorePeriods = ref(false)

const user = ref({
  name: 'Nicholas Oddone',
  email: 'oddonenso2@gmail.com',
  initials: 'NO'
})

const stats = reactive({
  income: 154200,
  expenses: 87450,
  balance: 66750,
  budgetUsed: 65,
  incomeChange: 12,
  expensesChange: -5
})

const categories = ref([
  { id: 1, name: 'Продукты', amount: 24500, percentage: 28, color: '#3B82F6', icon: '🛒' },
  { id: 2, name: 'Транспорт', amount: 18500, percentage: 21, color: '#10B981', icon: '🚗' },
  { id: 3, name: 'Развлечения', amount: 15200, percentage: 17, color: '#8B5CF6', icon: '🎬' },
  { id: 4, name: 'Кафе', amount: 12800, percentage: 15, color: '#F59E0B', icon: '☕' },
  { id: 5, name: 'Прочее', amount: 16450, percentage: 19, color: '#EF4444', icon: '📦' },
])

const recentTransactions = ref([
  { id: 1, type: 'expense', amount: 1250, description: 'Продукты', category: 'Продукты', time: '2 часа назад', icon: '🛒' },
  { id: 2, type: 'income', amount: 45000, description: 'Зарплата', category: 'Доходы', time: 'Вчера', icon: '💰' },
  { id: 3, type: 'expense', amount: 650, description: 'Такси', category: 'Транспорт', time: 'Вчера', icon: '🚗' },
  { id: 4, type: 'expense', amount: 3200, description: 'Ресторан', category: 'Кафе', time: '2 дня назад', icon: '🍽️' },
  { id: 5, type: 'expense', amount: 890, description: 'Кино', category: 'Развлечения', time: '3 дня назад', icon: '🎬' },
])

const userGroups = ref([
  { id: 1, name: 'Семья', members: 4, balance: 2450, avatars: ['A', 'B', 'C'] },
  { id: 2, name: 'Друзья', members: 6, balance: -1200, avatars: ['D', 'E', 'F'] },
  { id: 3, name: 'Коллеги', members: 8, balance: 0, avatars: ['G', 'H', 'I'] },
  { id: 4, name: 'Путешествие', members: 3, balance: 5600, avatars: ['J', 'K', 'L'] },
])

const newExpense = reactive({
  type: 'expense',
  amount: '',
  category: '',
  description: ''
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

const userName = computed(() => user.value.name)
const userEmail = computed(() => user.value.email)
const userInitials = computed(() => user.value.initials)

const formatNumber = (num) => {
  return new Intl.NumberFormat('ru-RU').format(num)
}

const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
  router.push('/login')
}

const goToMobile = (path) => {
  currentMobileNav.value = path
  router.push(path)
  mobileMenuOpen.value = false
}

const createGroup = () => {
  const groupName = prompt('Введите название группы:')
  if (!groupName) return

  const newGroup = {
    id: Date.now(),
    name: groupName,
    members: 1,
    balance: 0,
    avatars: [user.value.initials]
  }

  userGroups.value.unshift(newGroup)
  alert(`Группа "${groupName}" создана!`)
}

const getCategoryIcon = (categoryName) => {
  const icons = {
    'Продукты': '🛒',
    'Транспорт': '🚗',
    'Кафе': '☕',
    'Развлечения': '🎬',
    'Здоровье': '🏥',
    'Образование': '📚',
    'Одежда': '👕',
    'Красота': '💄',
    'Подарки': '🎁',
    'Доходы': '💰',
    'Прочее': '📦'
  }
  return icons[categoryName] || '💸'
}

const updateCategoryPercentages = () => {
  const totalExpenses = categories.value.reduce((sum, cat) => sum + cat.amount, 0)
  categories.value.forEach(category => {
    category.percentage = Math.round((category.amount / totalExpenses) * 100)
  })
}

const resetExpenseForm = () => {
  newExpense.type = 'expense'
  newExpense.amount = ''
  newExpense.category = ''
  newExpense.description = ''
  showAddExpense.value = false
}

const updateExpenseField = (payload) => {
  Object.assign(newExpense, payload)
}

const addExpenseHandler = () => {
  if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) {
    alert('Введите корректную сумму')
    return
  }

  if (!newExpense.category) {
    alert('Выберите категорию')
    return
  }

  const amount = parseFloat(newExpense.amount)
  const category = expenseCategories.value.find(cat => cat.id === parseInt(newExpense.category))

  const newTransaction = {
    id: Date.now(),
    type: newExpense.type,
    amount: amount,
    description: newExpense.description || category?.name || 'Без описания',
    category: category?.name || 'Прочее',
    time: 'Только что',
    icon: getCategoryIcon(category?.name),
    date: new Date().toISOString()
  }

  recentTransactions.value.unshift(newTransaction)

  if (newExpense.type === 'income') {
    stats.income += amount
  } else {
    stats.expenses += amount

    const categoryIndex = categories.value.findIndex(c => c.name === category?.name)
    if (categoryIndex !== -1) {
      categories.value[categoryIndex].amount += amount
      updateCategoryPercentages()
    } else {
      categories.value.push({
        id: categories.value.length + 1,
        name: category?.name || 'Прочее',
        amount: amount,
        percentage: 10,
        color: '#6B7280',
        icon: getCategoryIcon(category?.name)
      })
      updateCategoryPercentages()
    }
  }

  stats.balance = stats.income - stats.expenses
  stats.budgetUsed = Math.min(Math.round((stats.expenses / stats.income) * 100), 100)

  alert('Транзакция успешно добавлена!')
  resetExpenseForm()
}

onMounted(() => {
  updateCategoryPercentages()
})
</script>