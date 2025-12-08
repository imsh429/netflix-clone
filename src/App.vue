<!-- src/App.vue -->
<template>
  <div id="app">
    <!-- 페이지 전환 애니메이션 -->
    <router-view v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 앱 시작 시 인증 상태 초기화
onMounted(() => {
  authStore.initAuth()
})
</script>

<style>
/* Global Styles는 main.css에 있음 */

/* 페이지 전환 애니메이션 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

#app {
  min-height: 100vh;
}
</style>
