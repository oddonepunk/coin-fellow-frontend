<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Мои группы</h1>
      <button
        @click="showCreateModal = true"
        class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Создать группу
      </button>
    </div>

    <div v-if="loading" class="text-center py-8">Загрузка...</div>
    
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <div v-if="!loading && groups.length === 0" class="text-center py-8 text-gray-500">
      У вас пока нет групп
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="group in groups"
        :key="group.id"
        class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
      >
        <h3 class="text-xl font-semibold mb-2">{{ group.name }}</h3>
        <p class="text-gray-600 mb-4">Участников: {{ group.members_count }}</p>
        
        <div class="flex space-x-2">
          <router-link
            :to="`/groups/${group.id}`"
            class="flex-1 bg-indigo-100 text-indigo-700 px-3 py-2 rounded text-center hover:bg-indigo-200"
          >
            Открыть
          </router-link>
          <button
            @click="deleteGroup(group.id)"
            class="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>

    <!-- Модалка создания группы -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">Создать группу</h3>
        
        <form @submit.prevent="createGroup">
          <input
            v-model="newGroupName"
            type="text"
            placeholder="Название группы"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded mb-4"
          />
          
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="creatingGroup"
              class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {{ creatingGroup ? 'Создание...' : 'Создать' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { groupService } from '../../services/groupService'

const loading = ref(true)
const error = ref('')
const groups = ref([])
const showCreateModal = ref(false)
const newGroupName = ref('')
const creatingGroup = ref(false)

const loadGroups = async () => {
  try {
    groups.value = await groupService.getGroups()
  } catch (err) {
    error.value = err.response?.data?.message || 'Ошибка загрузки групп'
  } finally {
    loading.value = false
  }
}

const createGroup = async () => {
  creatingGroup.value = true
  try {
    await groupService.createGroup({ name: newGroupName.value })
    newGroupName.value = ''
    showCreateModal.value = false
    await loadGroups()
  } catch (err) {
    error.value = err.response?.data?.message || 'Ошибка создания группы'
  } finally {
    creatingGroup.value = false
  }
}

const deleteGroup = async (groupId) => {
  if (!confirm('Удалить группу?')) return
  
  try {
    await groupService.deleteGroup(groupId)
    await loadGroups()
  } catch (err) {
    error.value = err.response?.data?.message || 'Ошибка удаления группы'
  }
}

onMounted(() => {
  loadGroups()
})
</script>