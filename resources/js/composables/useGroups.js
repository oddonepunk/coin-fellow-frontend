import { ref } from 'vue'
import groupsApi from '../api/groups'
import { useAuth } from './useAuth'

export function useGroups() {
  const { user } = useAuth()
  const groups = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })

  const loadGroups = async (page = 1) => {
    loading.value = true
    error.value = null
    try {
      const response = await groupsApi.getUserGroups()
      if (response.data) {
        groups.value = response.data
        if (response.meta) pagination.value = response.meta
      } else groups.value = response
      return groups.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка загрузки групп'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createGroup = async (groupData) => {
    loading.value = true
    error.value = null
    try {
      const response = await groupsApi.createGroup(groupData)
      const newGroup = response.data || response
      groups.value.unshift(newGroup)
      return newGroup
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка создания группы'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getGroup = async (groupId) => {
    loading.value = true
    error.value = null
    try {
      const response = await groupsApi.getGroup(groupId)
      return response.data || response
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка загрузки группы'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateGroup = async (groupId, groupData) => {
    loading.value = true
    error.value = null
    try {
      const response = await groupsApi.updateGroup(groupId, groupData)
      const updatedGroup = response.data || response
      const index = groups.value.findIndex(g => g.id === groupId)
      if (index !== -1) groups.value[index] = updatedGroup
      return updatedGroup
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка обновления группы'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteGroup = async (groupId) => {
    loading.value = true
    error.value = null
    try {
      await groupsApi.deleteGroup(groupId)
      groups.value = groups.value.filter(g => g.id !== groupId)
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка удаления группы'
      throw err
    } finally {
      loading.value = false
    }
  }

  const inviteUser = async (groupId, inviteData) => {
    loading.value = true
    error.value = null
    try {
      const response = await groupsApi.inviteUser(groupId, inviteData)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка приглашения пользователя'
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeUser = async (groupId, userId) => {
    loading.value = true
    error.value = null
    try {
      const response = await groupsApi.removeUser(groupId, userId)
      const group = groups.value.find(g => g.id === groupId)
      if (group && group.members) group.members = group.members.filter(m => m.id !== userId)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка удаления пользователя'
      throw err
    } finally {
      loading.value = false
    }
  }

  const leaveGroup = async (groupId) => {
    loading.value = true
    error.value = null
    try {
      const response = await groupsApi.leaveGroup(groupId)
      groups.value = groups.value.filter(g => g.id !== groupId)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка выхода из группы'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getUserRole = (group) => {
    if (!group || !group.users) return null
    const currentUser = group.users.find(u => u.id === user.value?.id)
    return currentUser?.pivot?.role || null
  }

  const canManageGroup = (group) => {
    const role = getUserRole(group)
    return role === 'owner' || role === 'admin'
  }

  const isOwner = (group) => {
    return getUserRole(group) === 'owner'
  }

  return {
    groups,
    loading,
    error,
    pagination,
    loadGroups,
    createGroup,
    getGroup,
    updateGroup,
    deleteGroup,
    inviteUser,
    removeUser,
    leaveGroup,
    getUserRole,
    canManageGroup,
    isOwner
  }
}
