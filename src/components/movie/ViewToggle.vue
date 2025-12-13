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
  flex-direction: row;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  align-self: flex-start;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 2px solid #333;
  color: var(--text-white);
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: 120px;
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
  font-size: 1rem;
}

/* ==================== Responsive ==================== */
@media (max-width: 768px) {
  .view-toggle {
    width: auto;
  }

  .toggle-btn {
    flex: 1;
    padding: 0.6rem 0.8rem;
    font-size: 0.75rem;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .toggle-btn span {
    display: none;
  }

  .toggle-btn i {
    font-size: 0.9rem;
  }
}
</style>
