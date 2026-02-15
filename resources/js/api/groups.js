import apiClient from './apiClient'

export default {
  async getUserGroups() {
    const response = await apiClient.get('/groups')
    return response.data
  },

  async getGroup(groupId) {
    const response = await apiClient.get(`/groups/${groupId}`)
    return response.data
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
  }
}