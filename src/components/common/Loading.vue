<!-- src/components/common/Loading.vue -->
<template>
  <div class="loading-container" :class="{ 'fullscreen': fullscreen }">
    <div class="spinner-wrapper">
      <div class="spinner"></div>
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
    fullscreen?: boolean
  }>(),
  {
    message: '로딩 중...',
    fullscreen: false
  }
)
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  min-height: 200px;
}

.loading-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  min-height: 100vh;
}

.spinner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--primary-red);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-message {
  color: var(--text-white);
  font-size: 1rem;
  margin: 0;
  text-align: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ==================== Responsive ==================== */
@media (max-width: 768px) {
  .spinner {
    width: 40px;
    height: 40px;
    border-width: 3px;
  }

  .loading-message {
    font-size: 0.9rem;
  }
}
</style>
