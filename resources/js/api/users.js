import apiClient from './apiClient'

export default {
  async searchUsers(query, excludeGroupId = null) {
    const params = { query }
    if (excludeGroupId) {
      params.group_id = excludeGroupId
    }
    const response = await apiClient.get('/users/search', { params })
    return response.data
  }
}