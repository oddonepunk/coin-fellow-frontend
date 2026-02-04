<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">Dashboard</h1>
    <p>Вы успешно вошли в систему!</p>
    <button @click="logout" class="mt-4 px-4 py-2 bg-red-500 text-white rounded">
      Выйти
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('isAuthenticated')
  router.push('/login')
}
</script>