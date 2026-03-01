import apiClient from './apiClient'

export default {
  async getGroupExpenses(groupId, params = {}) {
    const response = await apiClient.get(`/groups/${groupId}/expenses`, { params })
    return response.data
  },

  async createExpense(groupId, expenseData) {
    console.log('📡 API createExpense:', { groupId, expenseData })
    try {
      const response = await apiClient.post(`/groups/${groupId}/expenses`, expenseData)
      console.log('✅ API createExpense ответ:', response)
      return response.data
    } catch (error) {
      console.error('❌ API createExpense ошибка:', error.response?.data)
      throw error
    }
  },

  async updateExpense(groupId, expenseId, expenseData) {
    const response = await apiClient.put(`/groups/${groupId}/expenses/${expenseId}`, expenseData)
    return response.data
  },

  async deleteExpense(groupId, expenseId) {
    const response = await apiClient.delete(`/groups/${groupId}/expenses/${expenseId}`)
    return response.data
  },

  async getUserExpenses() {
    const response = await apiClient.get('/user/expenses')
    return response.data
  }
}