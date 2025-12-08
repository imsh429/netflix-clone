<!-- src/components/movie/ViewToggle.vue -->
<template>
  <div class="view-toggle">
    <button
      class="toggle-btn"
      :class="{ 'active': currentView === 'table' }"
      @click="switchView('table')"
    >
      <i class="fas fa-table"></i>
      <span>Table View</span>
    </button>
    <button
      class="toggle-btn"
      :class="{ 'active': currentView === 'infinite' }"
      @click="switchView('infinite')"
    >
      <i class="fas fa-stream"></i>
      <span>무한 스크롤</span>
    </button>
  </div>
</template>

<script setup lang="ts">
// Props
defineProps<{
  currentView: 'table' | 'infinite'
}>()

// Emits
const emit = defineEmits<{
  'change-view': [view: 'table' | 'infinite']
}>()

// Methods
const switchView = (view: 'table' | 'infinite') => {
  emit('change-view', view)
}
</script>

<style scoped>
.view-toggle {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 2rem;
}

.toggle-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 2px solid #333;
  color: var(--text-white);
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  border-color: var(--primary-red);
  background: rgba(229, 9, 20, 0.1);
}

.toggle-btn.active {
  background: var(--primary-red);
  border-color: var(--primary-red);
  color: white;
}

.toggle-btn i {
  font-size: 1.1rem;
}

/* ==================== Responsive ==================== */
@media (max-width: 768px) {
  .view-toggle {
    flex-direction: column;
    gap: 0.5rem;
  }

  .toggle-btn {
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .toggle-btn span {
    font-size: 0.85rem;
  }
}
</style>
