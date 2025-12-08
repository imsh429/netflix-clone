<!-- src/components/movie/MovieCard.vue -->
<template>
  <div
    class="movie-card"
    :class="{
      'wishlisted': isWishlisted,
      'loading': !imageLoaded
    }"
  >
    <!-- Loading Skeleton -->
    <div v-if="!imageLoaded" class="skeleton-loader"></div>

    <!-- 영화 포스터 -->
    <div class="poster-container">
      <img
        :src="posterUrl"
        :alt="movie.title"
        class="poster-image"
        @load="handleImageLoad"
        @error="handleImageError"
      />

      <!-- 이미지 없을 때 표시 -->
      <div v-if="imageError" class="no-image-placeholder">
        <i class="fas fa-film"></i>
        <span>No Image</span>
      </div>

      <!-- 찜 버튼 -->
      <button
        class="wishlist-btn"
        :class="{ 'active': isWishlisted }"
        @click.stop="handleToggle"
        :title="isWishlisted ? '찜 해제' : '찜하기'"
      >
        <i :class="isWishlisted ? 'fas fa-heart' : 'far fa-heart'"></i>
      </button>

      <!-- 호버 시 오버레이 -->
      <div class="hover-overlay">
        <div class="overlay-content">
          <h3 class="movie-title">{{ movie.title }}</h3>
          <p class="movie-overview">{{ truncatedOverview }}</p>
          <div class="movie-meta">
            <span class="rating">
              <i class="fas fa-star"></i>
              {{ formattedRating }}
            </span>
            <span v-if="releaseYear" class="year">
              <i class="fas fa-calendar"></i>
              {{ releaseYear }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 기본 정보 (모바일용) -->
    <div class="movie-info-mobile">
      <h4 class="title">{{ truncatedTitle }}</h4>
      <span class="rating">
        <i class="fas fa-star"></i>
        {{ formattedRating }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Movie } from '@/types/movie'
import { getPosterUrl } from '@/services/tmdb'

// Props (Top-Down) - 부모로부터 데이터 받기
const props = defineProps<{
  movie: Movie
  isWishlisted: boolean
}>()

// Emits (Bottom-Up) - 부모에게 이벤트 전달
const emit = defineEmits<{
  'toggle-wishlist': [movieId: number]
}>()

// State
const imageLoaded = ref(false)
const imageError = ref(false)

// Computed
const posterUrl = computed(() => {
  return getPosterUrl(props.movie.poster_path)
})

const truncatedOverview = computed(() => {
  const maxLength = 120
  if (!props.movie.overview) return '설명이 없습니다.'

  if (props.movie.overview.length > maxLength) {
    return props.movie.overview.slice(0, maxLength) + '...'
  }
  return props.movie.overview
})

const truncatedTitle = computed(() => {
  const maxLength = 20
  if (props.movie.title.length > maxLength) {
    return props.movie.title.slice(0, maxLength) + '...'
  }
  return props.movie.title
})

const formattedRating = computed(() => {
  return props.movie.vote_average.toFixed(1)
})

const releaseYear = computed(() => {
  if (!props.movie.release_date) return null
  return new Date(props.movie.release_date).getFullYear()
})

// Methods
const handleImageLoad = () => {
  imageLoaded.value = true
  imageError.value = false
}

const handleImageError = (e: Event) => {
  imageLoaded.value = true
  imageError.value = true
}

const handleToggle = () => {
  // Bottom-Up: 부모 컴포넌트에게 이벤트 전달
  emit('toggle-wishlist', props.movie.id)
}
</script>

<style scoped>
/* ==================== Card Container ==================== */
.movie-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: var(--hover-gray);
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 호버 효과 (필수!) */
.movie-card:hover {
  transform: scale(1.05) translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
  z-index: 10;
}

/* 찜한 영화 다른 디자인 (필수!) */
.movie-card.wishlisted {
  border: 3px solid var(--primary-red);
  box-shadow: 0 0 20px rgba(229, 9, 20, 0.5);
}

.movie-card.wishlisted::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(229, 9, 20, 0.1) 0%,
    transparent 50%
  );
  pointer-events: none;
  z-index: 1;
}

/* ==================== Loading ==================== */
.skeleton-loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    var(--hover-gray) 0%,
    #2a2a2a 50%,
    var(--hover-gray) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  z-index: 2;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* ==================== No Image Placeholder ==================== */
.poster-container.no-image {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.no-image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--text-gray);
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.no-image-placeholder i {
  font-size: 3rem;
  opacity: 0.5;
  color: var(--text-gray);
}

.no-image-placeholder span {
  font-size: 0.9rem;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* 호버 시에도 작동하도록 */
.poster-container.no-image .hover-overlay {
  background: rgba(0, 0, 0, 0.8);
}

/* ==================== Poster ==================== */
.poster-container {
  position: relative;
  width: 100%;
  padding-bottom: 150%; /* 2:3 비율 */
  overflow: hidden;
  background: var(--hover-gray);
}

.poster-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.movie-card:hover .poster-image {
  transform: scale(1.1);
}

/* ==================== Wishlist Button ==================== */
.wishlist-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 3;
  backdrop-filter: blur(5px);
}

.wishlist-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.wishlist-btn.active {
  background: var(--primary-red);
  color: white;
}

.wishlist-btn.active:hover {
  background: #f40612;
}

.wishlist-btn i {
  transition: transform 0.3s ease;
}

.wishlist-btn:active i {
  transform: scale(0.9);
}

/* ==================== Hover Overlay ==================== */
.hover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.7) 70%,
    transparent 100%
  );
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 2;
}

.movie-card:hover .hover-overlay {
  transform: translateY(0);
}

.overlay-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.movie-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
  color: white;
}

.movie-overview {
  font-size: 0.85rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.movie-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.movie-meta .rating,
.movie-meta .year {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: rgba(255, 255, 255, 0.8);
}

.movie-meta i {
  color: #ffd700;
}

/* ==================== Mobile Info ==================== */
.movie-info-mobile {
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  background: var(--hover-gray);
}

.movie-info-mobile .title {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.movie-info-mobile .rating {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
}

.movie-info-mobile .rating i {
  color: #ffd700;
}

/* ==================== Responsive ==================== */
@media (min-width: 769px) {
  .movie-info-mobile {
    display: none;
  }
}

@media (max-width: 768px) {
  .movie-card:hover {
    transform: scale(1.02);
  }

  .hover-overlay {
    display: none;
  }

  .wishlist-btn {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .movie-card {
    border-radius: 6px;
  }

  .wishlist-btn {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }

  .movie-info-mobile .title {
    font-size: 0.85rem;
  }

  .movie-info-mobile .rating {
    font-size: 0.8rem;
  }
}

/* ==================== Accessibility ==================== */
@media (prefers-reduced-motion: reduce) {
  .movie-card,
  .poster-image,
  .wishlist-btn,
  .hover-overlay {
    transition: none;
  }

  .movie-card:hover {
    transform: none;
  }
}
</style>
