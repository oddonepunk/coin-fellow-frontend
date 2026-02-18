import apiClient from './apiClient'

export default {
  async getUserGroups() {
    const response = await apiClient.get('/groups')
    return response.data
  },

  async getGroup(groupId) {
    try {
      const response = await apiClient.get(`/groups/${groupId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
  async createGroup(groupData) {
    const response = await apiClient.post('/groups', groupData)
    return response.data
  },

  async updateGroup(groupId, groupData) {
    const response = await apiClient.put(`/groups/${groupId}`, groupData)
    return response.data
  },

  async deleteGroup(groupId) {
    const response = await apiClient.delete(`/groups/${groupId}`)
    return response.data
  },

  async inviteUser(groupId, inviteData) {
    const response = await apiClient.post(`/groups/${groupId}/invite`, inviteData)
    return response.data
  },

  async removeUser(groupId, userId) {
    const response = await apiClient.delete(`/groups/${groupId}/members/${userId}`)
    return response.data
  },

  async leaveGroup(groupId) {
    const response = await apiClient.post(`/groups/${groupId}/leave`)
    return response.data
  },

  async updateUserRole(groupId, userId, data) {
  const response = await apiClient.put(`/groups/${groupId}/members/${userId}`, data)
  return response.data
},

async getExpenseCategories() {
  const response = await apiClient.get('/categories/all')
  return response.data
},

async getBudgetRecommendations(groupId) {
  const response = await apiClient.get(`/groups/${groupId}/budgets/recommendations`)
  return response.data
},

  async getGroupExpenses(groupId, params = {}) {
    const response = await apiClient.get(`/groups/${groupId}/expenses`, { params })
    return response.data
  },

  async createExpense(groupId, expenseData) {
    const response = await apiClient.post(`/groups/${groupId}/expenses`, expenseData)
    return response.data
  },

  async updateExpense(groupId, expenseId, expenseData) {
    const response = await apiClient.put(`/groups/${groupId}/expenses/${expenseId}`, expenseData)
    return response.data
  },

  async deleteExpense(groupId, expenseId) {
    const response = await apiClient.delete(`/groups/${groupId}/expenses/${expenseId}`)
    return response.data
  },

  async getGroupBalances(groupId) {
    const response = await apiClient.get(`/groups/${groupId}/balances`)
    return response.data
  },

  async getSimplifiedDebts(groupId) {
    const response = await apiClient.get(`/groups/${groupId}/balances/simplified`)
    return response.data
  },

  async getMyDebts(groupId) {
    const response = await apiClient.get(`/groups/${groupId}/balances/my-debts`)
    return response.data
  },

  async getDebtsToMe(groupId) {
    const response = await apiClient.get(`/groups/${groupId}/balances/debts-to-me`)
    return response.data
  },

  // Аналитика группы
  async getGroupAnalytics(groupId) {
    const response = await apiClient.get(`/analytics/groups/${groupId}/dashboard`)
    return response.data
  },

  async getCategoryBreakdown(groupId) {
    const response = await apiClient.get(`/analytics/groups/${groupId}/category-breakdown`)
    return response.data
  },

  async getUserSpendingComparison(groupId) {
    const response = await apiClient.get(`/analytics/groups/${groupId}/user-comparison`)
    return response.data
  },

  async getSpendingTrend(groupId) {
    const response = await apiClient.get(`/analytics/groups/${groupId}/spending-trend`)
    return response.data
  },

  async getBudgetRecommendations(groupId) {
    const response = await apiClient.get(`/groups/${groupId}/budgets/recommendations`)
    return response.data
  }




}