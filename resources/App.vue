<template>
  <div 
    id="app" 
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 font-sans"
  >
    <div v-if="showSnow" class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div 
        v-for="(flake, index) in snowflakes" 
        :key="index"
        class="snowflake"
        :style="flake.style"
      >❄️</div>
    </div>

    <div class="fixed inset-0 aurora-bg pointer-events-none opacity-20 z-0"></div>

    <div class="relative z-10">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showSnow = ref(true)
const snowflakes = ref([])

const generateSnowflakes = () => {
  const flakes = []
  for (let i = 0; i < 40; i++) {
    flakes.push({
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * -20}%`,
        fontSize: `${Math.random() * 16 + 12}px`,
        animationDelay: `${Math.random() * 15}s`,
        animationDuration: `${Math.random() * 20 + 10}s`,
        opacity: Math.random() * 0.6 + 0.3,
        filter: `blur(${Math.random() * 2}px)`
      }
    })
  }
  snowflakes.value = flakes
}

onMounted(() => {
  generateSnowflakes()
  window.addEventListener('resize', generateSnowflakes)
})
</script>

<style scoped>
.snowflake {
  position: absolute;
  pointer-events: none;
  user-select: none;
  animation: snowfall linear infinite;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

@keyframes snowfall {
  0% {
    transform: translateY(-100px) translateX(0) rotate(0deg);
  }
  100% {
    transform: translateY(120vh) translateX(calc(var(--random, 1) * 50px - 25px)) rotate(360deg);
    opacity: 0;
  }
}

.aurora-bg {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 25%,
    rgba(240, 147, 251, 0.1) 50%,
    rgba(245, 87, 108, 0.1) 75%,
    rgba(255, 209, 102, 0.1) 100%
  );
  background-size: 400% 400%;
  animation: aurora 15s ease infinite;
}

@keyframes aurora {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
</style>