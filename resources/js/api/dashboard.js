import apiClient from './apiClient'

export default {
    async getUserDashboard() {
        const response = await apiClient.get('/analytics/user-dashboard')
        return response.data
    },

    async getUserGroups() {
        const response = await apiClient.get('/groups')
        return response.data
    },

    async getUserExpenses(params = {}) {
        const response = await apiClient.get('/user/expenses', { params })
        return response.data
    },

    async getUserPayments() {
        const response = await apiClient.get('/user/payments')
        return response.data
    },

    async getUserCategoryStatistics() {
        const response = await apiClient.get('/categories/user-statistics')
        return response.data
    },

    async getNotifications() {
        const response = await apiClient.get('/notifications/recent')
        return response.data
    },

    async getUnreadNotificationsCount() {
        const response = await apiClient.get('/notifications/unread-count')
        return response.data
    },

    async addExpense(groupId, expenseData) {
        const response = await apiClient.post(`/groups/${groupId}/expenses`, expenseData)
        return response.data
    },

    async createGroup(groupData) {
        const response = await apiClient.post('/groups', groupData)
        return response.data
    },

    async getBudgetRecommendations(groupId) {
        const response = await apiClient.get(`/groups/${groupId}/budgets/recommendations`)
        return response.data
    },

    async getSpendingTrend(groupId) {
        const response = await apiClient.get(`/analytics/groups/${groupId}/spending-trend`)
        return response.data
    }
}