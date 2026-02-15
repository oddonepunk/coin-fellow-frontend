import { ref, reactive, onMounted, watch } from 'vue'
import dashboardApi from '../api/dashboard'
import { useAuth } from './useAuth'

export function useDashboard() {
    const { user, isAuthenticated } = useAuth()
    const loading = ref(true)
    const error = ref(null)
    const initialized = ref(false)

    // Данные для дашборда
    const stats = reactive({
        income: 0,
        expenses: 0,
        balance: 0,
        budgetUsed: 0,
        incomeChange: 0,
        expensesChange: 0
    })

    const categories = ref([])
    const recentTransactions = ref([])
    const userGroups = ref([])
    const notifications = ref([])
    const unreadCount = ref(0)

    const formatNumber = (num) => {
        return new Intl.NumberFormat('ru-RU').format(num || 0)
    }

    const processCategories = (data) => {
        if (!data) return

        const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316']
        const icons = ['🛒', '🚗', '🎬', '☕', '📦', '🏥', '📚', '👕', '💄', '🎁']

        if (Array.isArray(data)) {
            categories.value = data.map((cat, index) => ({
                id: cat.id || index,
                name: cat.name,
                amount: cat.amount || 0,
                percentage: cat.percentage || 0,
                color: cat.color || colors[index % colors.length],
                icon: cat.icon || icons[index % icons.length]
            }))
        } else if (data.categories) {
            categories.value = data.categories.map((cat, index) => ({
                id: cat.id || index,
                name: cat.name,
                amount: cat.amount || 0,
                percentage: cat.percentage || 0,
                color: cat.color || colors[index % colors.length],
                icon: cat.icon || icons[index % icons.length]
            }))
        }
    }

    const processExpenses = (data) => {
        if (!data) return

        const expenses = Array.isArray(data) ? data : (data.data || [])
        
        recentTransactions.value = expenses.slice(0, 5).map(exp => ({
            id: exp.id,
            type: exp.type || 'expense',
            amount: Math.abs(exp.amount || 0),
            description: exp.description || exp.title || 'Без описания',
            category: exp.category?.name || 'Прочее',
            time: formatTimeAgo(exp.created_at),
            icon: getCategoryIcon(exp.category?.name),
            date: exp.created_at
        }))

        if (expenses.length > 0) {
            const totalExpenses = expenses.reduce((sum, exp) => {
                if (exp.type === 'expense' || exp.amount < 0) {
                    return sum + Math.abs(exp.amount)
                }
                return sum
            }, 0)
            
            const totalIncome = expenses.reduce((sum, exp) => {
                if (exp.type === 'income' || exp.amount > 0) {
                    return sum + Math.abs(exp.amount)
                }
                return sum
            }, 0)

            stats.expenses = totalExpenses
            stats.income = totalIncome
            stats.balance = totalIncome - totalExpenses
            stats.budgetUsed = totalIncome > 0 ? Math.min(Math.round((totalExpenses / totalIncome) * 100), 100) : 0
        }
    }

    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'Недавно'
        
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.round(diffMs / 60000)
        const diffHours = Math.round(diffMs / 3600000)
        const diffDays = Math.round(diffMs / 86400000)

        if (diffMins < 1) return 'Только что'
        if (diffMins < 60) return `${diffMins} мин назад`
        if (diffHours < 24) return `${diffHours} ч назад`
        if (diffDays === 1) return 'Вчера'
        if (diffDays < 7) return `${diffDays} дня назад`
        
        return date.toLocaleDateString('ru-RU')
    }

    const getCategoryIcon = (categoryName) => {
        const icons = {
            'Продукты': '🛒',
            'Транспорт': '🚗',
            'Кафе': '☕',
            'Ресторан': '🍽️',
            'Развлечения': '🎬',
            'Кино': '🎬',
            'Здоровье': '🏥',
            'Образование': '📚',
            'Одежда': '👕',
            'Красота': '💄',
            'Подарки': '🎁',
            'Доходы': '💰',
            'Зарплата': '💰',
            'Прочее': '📦'
        }
        return icons[categoryName] || '💸'
    }

    const loadDashboardData = async () => {
        if (!isAuthenticated.value) {
            loading.value = false
            return
        }

        loading.value = true
        error.value = null

        try {
            const groupsResponse = await dashboardApi.getUserGroups()
            userGroups.value = groupsResponse.data || groupsResponse || []

            const expensesResponse = await dashboardApi.getUserExpenses({ limit: 10 })
            processExpenses(expensesResponse)

            const categoriesResponse = await dashboardApi.getUserCategoryStatistics()
            processCategories(categoriesResponse)

            try {
                const notifsResponse = await dashboardApi.getNotifications()
                notifications.value = notifsResponse.data || notifsResponse || []
                
                const unreadResponse = await dashboardApi.getUnreadNotificationsCount()
                unreadCount.value = unreadResponse.count || 0
            } catch (notifErr) {
                console.warn('Failed to load notifications:', notifErr)
            }

            initialized.value = true

        } catch (err) {
            error.value = err.response?.data?.message || 'Ошибка загрузки данных'
            console.error('Dashboard load error:', err)
        } finally {
            loading.value = false
        }
    }

    const addExpense = async (expenseData) => {
        try {
            loading.value = true
            error.value = null

            let groupId = expenseData.groupId
            if (!groupId && userGroups.value.length > 0) {
                groupId = userGroups.value[0].id
            }

            if (!groupId) {
                throw new Error('Не выбрана группа')
            }

            const response = await dashboardApi.addExpense(groupId, {
                amount: expenseData.amount,
                description: expenseData.description,
                category_id: expenseData.category,
                type: expenseData.type,
                date: new Date().toISOString().split('T')[0]
            })

            await loadDashboardData()

            return response
        } catch (err) {
            error.value = err.response?.data?.message || err.message || 'Ошибка добавления транзакции'
            throw err
        } finally {
            loading.value = false
        }
    }

    const createGroup = async (groupData) => {
        try {
            loading.value = true
            error.value = null

            const response = await dashboardApi.createGroup({
                name: groupData.name,
                description: groupData.description || '',
                currency: groupData.currency || 'RUB'
            })

            await loadDashboardData()

            return response
        } catch (err) {
            error.value = err.response?.data?.message || 'Ошибка создания группы'
            throw err
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        if (isAuthenticated.value) {
            loadDashboardData()
        }
    })

    watch(isAuthenticated, (newVal) => {
        if (newVal && !initialized.value) {
            loadDashboardData()
        }
    })

    return {
        loading,
        error,
        stats,
        categories,
        recentTransactions,
        userGroups,
        notifications,
        unreadCount,
        
        loadDashboardData,
        addExpense,
        createGroup,
        formatNumber,
        getCategoryIcon
    }
}