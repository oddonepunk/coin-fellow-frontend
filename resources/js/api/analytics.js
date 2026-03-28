import apiClient from './apiClient'

export default {
  async getGroupAnalytics(groupId) {
    const response = await apiClient.get(`/analytics/groups/${groupId}/dashboard`)
    return response.data
  },

  async getSpendingTrend(groupId, period = 'month') {
    const response = await apiClient.get(`/analytics/groups/${groupId}/spending-trend`, {
      params: { period }
    })
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

  async getPeriodComparison(groupId, period = 'month') {
    const response = await apiClient.get(`/analytics/groups/${groupId}/period-comparison`, {
      params: { period }
    })
    return response.data
  },

  async getExpenseDistribution(groupId) {
    const response = await apiClient.get(`/analytics/groups/${groupId}/expense-distribution`)
    return response.data
  },

  async getTopSpendingCategories(groupId) {
    const response = await apiClient.get(`/analytics/groups/${groupId}/top-categories`)
    return response.data
  }
}