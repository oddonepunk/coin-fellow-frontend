import apiClient from './apiClient'

export default {
  async getCategories() {
    const response = await apiClient.get('/categories')
    return response.data
  },

  async getDefaultCategories() {
    const response = await apiClient.get('/categories/defaults')
    return response.data
  },

  async getUserCategories() {
    const response = await apiClient.get('/categories/user')
    return response.data
  },

  async createCategory(data) {
    const response = await apiClient.post('/categories', data)
    return response.data
  },

  async updateCategory(id, data) {
    const response = await apiClient.put(`/categories/${id}`, data)
    return response.data
  },

  async deleteCategory(id) {
    const response = await apiClient.delete(`/categories/${id}`)
    return response.data
  },

  async getCategory(id) {
    const response = await apiClient.get(`/categories/${id}`)
    return response.data
  }
}