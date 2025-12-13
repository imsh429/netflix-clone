<!-- src/components/movie/Pagination.vue -->
<template>
  <div class="pagination">
    <!-- 이전 버튼 -->
    <button
      class="pagination-btn prev"
      :disabled="currentPage === 1"
      @click="goToPrevPage"
    >
      <i class="fas fa-chevron-left"></i>
      <span class="btn-text">이전</span>
    </button>

    <!-- 페이지 번호들 -->
    <div class="page-numbers">
      <!-- 첫 페이지 -->
      <button
        v-if="showFirstPage"
        class="page-btn"
        :class="{ 'active': currentPage === 1 }"
        @click="goToPage(1)"
      >
        1
      </button>

      <!-- 첫 페이지와 현재 페이지 사이 생략 -->
      <span v-if="showLeftEllipsis" class="ellipsis">...</span>

      <!-- 현재 페이지 근처 번호들 -->
      <button
        v-for="page in visiblePages"
        :key="page"
        class="page-btn"
        :class="{ 'active': currentPage === page }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <!-- 현재 페이지와 마지막 페이지 사이 생략 -->
      <span v-if="showRightEllipsis" class="ellipsis">...</span>

      <!-- 마지막 페이지 -->
      <button
        v-if="showLastPage"
        class="page-btn"
        :class="{ 'active': currentPage === totalPages }"
        @click="goToPage(totalPages)"
      >
        {{ totalPages }}
      </button>
    </div>

    <!-- 다음 버튼 -->
    <button
      class="pagination-btn next"
      :disabled="currentPage === totalPages"
      @click="goToNextPage"
    >
      <span class="btn-text">다음</span>
      <i class="fas fa-chevron-right"></i>
    </button>

    <!-- 페이지 정보 -->
    <div class="page-info">
      <span>{{ currentPage }} / {{ totalPages }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
const props = defineProps<{
  currentPage: number
  totalPages: number
  maxVisiblePages?: number
}>()

// Emits
const emit = defineEmits<{
  'change-page': [page: number]
}>()

// Computed
const maxVisible = computed(() => props.maxVisiblePages || 5)

const visiblePages = computed(() => {
  const pages: number[] = []
  const half = Math.floor(maxVisible.value / 2)

  let start = Math.max(2, props.currentPage - half)
  let end = Math.min(props.totalPages - 1, props.currentPage + half)

  // 시작 부분 조정
  if (end - start < maxVisible.value - 1) {
    if (start === 2) {
      end = Math.min(props.totalPages - 1, start + maxVisible.value - 1)
    } else {
      start = Math.max(2, end - maxVisible.value + 1)
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const showFirstPage = computed(() => {
  return props.totalPages > 1
})

const showLastPage = computed(() => {
  return props.totalPages > 1
})

const showLeftEllipsis = computed(() => {
  const firstVisible = visiblePages.value[0]
  return visiblePages.value.length > 0 && firstVisible !== undefined && firstVisible > 2
})

const showRightEllipsis = computed(() => {
  const lastVisible = visiblePages.value[visiblePages.value.length - 1]
  return (
    visiblePages.value.length > 0 &&
    lastVisible !== undefined &&
    lastVisible < props.totalPages - 1
  )
})

// Methods
const goToPage = (page: number) => {
  if (page !== props.currentPage && page >= 1 && page <= props.totalPages) {
    emit('change-page', page)
  }
}

const goToPrevPage = () => {
  if (props.currentPage > 1) {
    emit('change-page', props.currentPage - 1)
  }
}

const goToNextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('change-page', props.currentPage + 1)
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
  flex-wrap: nowrap;
  width: 100%;
}

.pagination-btn,
.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 44px;
  height: 44px;
  padding: 0.5rem 1rem;
  background: var(--hover-gray);
  border: 1px solid #333;
  color: var(--text-white);
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.pagination-btn:hover:not(:disabled),
.page-btn:hover:not(.active) {
  background: var(--primary-red);
  border-color: var(--primary-red);
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.pagination-btn:disabled:hover {
  transform: none;
}

.page-btn.active {
  background: var(--primary-red);
  border-color: var(--primary-red);
  font-weight: 700;
  cursor: default;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: nowrap;
}

.ellipsis {
  color: var(--text-gray);
  padding: 0 0.5rem;
  font-size: 1.2rem;
  user-select: none;
}

.page-info {
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  color: var(--text-gray);
  font-size: 0.9rem;
  white-space: nowrap;
}

/* ==================== Responsive ==================== */
@media (max-width: 768px) {
  .pagination {
    gap: 0.25rem;
    padding: 1.5rem 0.5rem;
  }

  .pagination-btn,
  .page-btn {
    min-width: 32px;
    height: 32px;
    padding: 0;
    font-size: 0.9rem;
  }

  .btn-text {
    display: none;
  }

  .page-numbers {
    gap: 0.25rem;
  }

  .page-info {
    width: 100%;
    margin: 1rem 0 0 0;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .pagination-btn,
  .page-btn {
    min-width: 36px;
    height: 36px;
    font-size: 0.85rem;
  }

  .ellipsis {
    padding: 0 0.25rem;
  }
}
</style>
