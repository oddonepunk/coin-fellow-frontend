import apiClient from './apiClient'

export default {
  async searchUsers(query, excludeGroupId = null) {
    const params = { query }
    if (excludeGroupId) {
      params.group_id = excludeGroupId
    }
    const response = await apiClient.get('/users/search', { params })
    return response.data
  },

  async searchGroupMembers(groupId, query) {
    const response = await apiClient.get(`/groups/${groupId}/members/search`, { 
      params: { query } 
    })
    return response.data
  }
}