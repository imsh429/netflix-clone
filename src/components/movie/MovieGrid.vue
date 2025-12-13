<!-- src/components/movie/MovieGrid.vue -->
<template>
  <div class="movie-grid" :class="{ 'table-mode': viewMode === 'table' }">
    <!-- Iterative Rendering (v-for) - 필수! -->
    <MovieCard
      v-for="movie in movies"
      :key="movie.id"
      :movie="movie"
      :is-wishlisted="wishlistIds.includes(movie.id)"
      @toggle-wishlist="handleToggleWishlist"
    />

    <!-- Conditional Rendering - 영화 없을 때 -->
    <div v-if="movies.length === 0" class="empty-state">
      <i class="fas fa-film"></i>
      <p>표시할 영화가 없습니다</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Movie } from '@/types/movie'
import MovieCard from './MovieCard.vue'

// Props (Top-Down)
defineProps<{
  movies: Movie[]
  wishlistIds: number[]
  viewMode?: 'table' | 'infinite'
}>()

// Emits (Bottom-Up)
const emit = defineEmits<{
  'toggle-wishlist': [movieId: number]
}>()

// Methods
const handleToggleWishlist = (movieId: number) => {
  // 이벤트를 부모로 전파
  emit('toggle-wishlist', movieId)
}
</script>

<style scoped>
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
  width: 100%;
}

/* ✅ Table View 모드 - 4열 기준 (포스터 비율 2:3 유지) */
.movie-grid.table-mode {
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  height: 100%;
  align-content: start;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--text-gray);
  text-align: center;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.2rem;
  margin: 0;
}

/* ==================== Responsive ==================== */

/* Table View 반응형 - 포스터 비율 유지 */
@media (max-width: 1400px) {
  .movie-grid.table-mode {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .movie-grid.table-mode {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  .movie-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .movie-grid.table-mode {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .movie-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
}

@media (min-width: 1025px) {
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (min-width: 1400px) {
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

@media (max-width: 480px) {
  .movie-grid {
    gap: 0.75rem;
  }
}
</style>
