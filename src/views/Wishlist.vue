<!-- src/views/Wishlist.vue -->
<template>
  <div class="wishlist-page">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- Page Header -->
        <div class="page-header">
          <h1>
            <i class="fas fa-heart"></i>
            내가 찜한 리스트
          </h1>
          <p v-if="wishlistCount > 0">
            총 <strong>{{ wishlistCount }}개</strong>의 영화를 찜했습니다
          </p>
          <p v-else>
            아직 찜한 영화가 없습니다
          </p>
        </div>

        <!-- Actions -->
        <div v-if="wishlistCount > 0" class="actions-bar">
          <div class="sort-options">
            <label>정렬:</label>
            <select v-model="sortOption" @change="sortWishlist">
              <option value="recent">최근 추가순</option>
              <option value="title-asc">제목 (가나다순)</option>
              <option value="title-desc">제목 (역순)</option>
              <option value="rating-desc">평점 높은순</option>
              <option value="rating-asc">평점 낮은순</option>
              <option value="date-desc">개봉일 최신순</option>
              <option value="date-asc">개봉일 오래된순</option>
            </select>
          </div>

          <button class="clear-all-btn" @click="handleClearAll">
            <i class="fas fa-trash"></i>
            <span>전체 삭제</span>
          </button>
        </div>

        <!-- Wishlist Grid -->
        <div v-if="sortedWishlist.length > 0" class="wishlist-grid">
          <!-- v-for: Iterative Rendering -->
          <div
            v-for="movie in sortedWishlist"
            :key="movie.id"
            class="wishlist-item"
          >
            <!-- Movie Card with Special Design -->
            <div class="movie-card-wrapper">
              <MovieCard
                :movie="movie"
                :is-wishlisted="true"
                @toggle-wishlist="handleRemoveFromWishlist"
              />

              <!-- Added Date Badge -->
              <div class="added-badge">
                <i class="fas fa-clock"></i>
                찜한 영화
              </div>
            </div>

            <!-- Movie Info -->
            <div class="movie-info">
              <h3 class="movie-title">{{ movie.title }}</h3>
              <div class="movie-meta">
                <span class="rating">
                  <i class="fas fa-star"></i>
                  {{ movie.vote_average.toFixed(1) }}
                </span>
                <span v-if="movie.release_date" class="year">
                  {{ getReleaseYear(movie.release_date) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <div class="empty-content">
            <i class="fas fa-heart-broken"></i>
            <h2>찜한 영화가 없습니다</h2>
            <p>마음에 드는 영화를 찜해보세요!</p>
            <router-link to="/" class="browse-btn">
              <i class="fas fa-film"></i>
              <span>영화 둘러보기</span>
            </router-link>
          </div>
        </div>

        <!-- Statistics (가산점) -->
        <div v-if="wishlistCount > 0" class="statistics">
          <h2>
            <i class="fas fa-chart-bar"></i>
            통계
          </h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-film"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ wishlistCount }}</div>
                <div class="stat-label">찜한 영화</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-star"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ averageRating }}</div>
                <div class="stat-label">평균 평점</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-trophy"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ highestRatedMovie?.title || 'N/A' }}</div>
                <div class="stat-label">최고 평점 영화</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-calendar"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ newestMovie?.title || 'N/A' }}</div>
                <div class="stat-label">최신 개봉작</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import AppHeader from '@/components/common/AppHeader.vue'
import MovieCard from '@/components/movie/MovieCard.vue'
import { useWishlistStore } from '@/stores/wishlist'

const toast = useToast()
const wishlistStore = useWishlistStore()

// State
const sortOption = ref('recent')

// Computed
const wishlist = computed(() => wishlistStore.wishlist)
const wishlistCount = computed(() => wishlistStore.wishlistCount)

const sortedWishlist = computed(() => {
  const list = [...wishlist.value]

  switch (sortOption.value) {
    case 'title-asc':
      return list.sort((a, b) => a.title.localeCompare(b.title))

    case 'title-desc':
      return list.sort((a, b) => b.title.localeCompare(a.title))

    case 'rating-desc':
      return list.sort((a, b) => b.vote_average - a.vote_average)

    case 'rating-asc':
      return list.sort((a, b) => a.vote_average - b.vote_average)

    case 'date-desc':
      return list.sort((a, b) => {
        const dateA = new Date(a.release_date || 0).getTime()
        const dateB = new Date(b.release_date || 0).getTime()
        return dateB - dateA
      })

    case 'date-asc':
      return list.sort((a, b) => {
        const dateA = new Date(a.release_date || 0).getTime()
        const dateB = new Date(b.release_date || 0).getTime()
        return dateA - dateB
      })

    case 'recent':
    default:
      return list
  }
})

// Statistics
const averageRating = computed(() => {
  if (wishlist.value.length === 0) return '0.0'

  const sum = wishlist.value.reduce((acc, movie) => acc + movie.vote_average, 0)
  const avg = sum / wishlist.value.length
  return avg.toFixed(1)
})

const highestRatedMovie = computed(() => {
  if (wishlist.value.length === 0) return null

  return wishlist.value.reduce((max, movie) =>
    movie.vote_average > max.vote_average ? movie : max
  )
})

const newestMovie = computed(() => {
  if (wishlist.value.length === 0) return null

  return wishlist.value.reduce((newest, movie) => {
    const newestDate = new Date(newest.release_date || 0).getTime()
    const movieDate = new Date(movie.release_date || 0).getTime()
    return movieDate > newestDate ? movie : newest
  })
})

// Methods
const sortWishlist = () => {
  // sortedWishlist computed가 자동으로 재계산됨
  toast.info('정렬이 변경되었습니다')
}

const handleRemoveFromWishlist = (movieId: number) => {
  const movie = wishlist.value.find(m => m.id === movieId)
  if (!movie) return

  wishlistStore.removeFromWishlist(movieId)
  toast.info(`"${movie.title}"를 찜 목록에서 제거했습니다`)
}

const handleClearAll = () => {
  if (!confirm('정말 모든 찜 목록을 삭제하시겠습니까?')) {
    return
  }

  wishlistStore.clearWishlist()
  toast.success('찜 목록이 모두 삭제되었습니다')
}

const getReleaseYear = (dateString: string): string => {
  if (!dateString) return ''
  return new Date(dateString).getFullYear().toString()
}

// Lifecycle
onMounted(() => {
  // Local Storage에서 찜 목록 로드 (API 호출 없음!)
  wishlistStore.loadWishlist()
})
</script>

<style scoped>
.wishlist-page {
  min-height: 100vh;
  background: var(--primary-black);
  padding-top: 70px;
}

.main-content {
  width: 100%;
  min-height: calc(100vh - 70px);
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* ==================== Page Header ==================== */
.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-header h1 i {
  color: var(--primary-red);
}

.page-header p {
  color: var(--text-gray);
  font-size: 1.1rem;
  margin: 0;
}

.page-header p strong {
  color: var(--primary-red);
}

/* ==================== Actions Bar ==================== */
.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-options label {
  font-weight: 600;
  color: var(--text-gray);
}

.sort-options select {
  padding: 0.5rem 1rem;
  background: var(--hover-gray);
  border: 1px solid #333;
  color: var(--text-white);
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
}

.sort-options select:focus {
  outline: none;
  border-color: var(--primary-red);
}

.clear-all-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--text-gray);
  color: var(--text-gray);
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-all-btn:hover {
  border-color: var(--primary-red);
  color: var(--primary-red);
  background: rgba(229, 9, 20, 0.1);
}

/* ==================== Wishlist Grid ==================== */
.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.wishlist-item {
  position: relative;
}

.movie-card-wrapper {
  position: relative;
}

.added-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.75rem;
  background: rgba(229, 9, 20, 0.9);
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 3;
  backdrop-filter: blur(5px);
}

.movie-info {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0 0 8px 8px;
}

.movie-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.movie-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-gray);
}

.movie-meta .rating {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.movie-meta .rating i {
  color: #ffd700;
}

/* ==================== Empty State ==================== */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
  max-width: 500px;
}

.empty-content i {
  font-size: 5rem;
  color: var(--primary-red);
  opacity: 0.5;
}

.empty-content h2 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.empty-content p {
  font-size: 1.2rem;
  color: var(--text-gray);
  margin: 0;
}

.browse-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: var(--primary-red);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.browse-btn:hover {
  background: #f40612;
  transform: scale(1.05);
}

/* ==================== Statistics ==================== */
.statistics {
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 1px solid #333;
}

.statistics h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.statistics h2 i {
  color: var(--primary-red);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #333;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: var(--primary-red);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.stat-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-red);
  border-radius: 50%;
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-gray);
}

/* ==================== Responsive ==================== */
@media (max-width: 768px) {
  .wishlist-page {
    padding-top: 60px;
  }

  .content-wrapper {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 1.8rem;
  }

  .actions-bar {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .sort-options {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .sort-options select {
    width: 100%;
  }

  .wishlist-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.5rem;
    gap: 0.5rem;
  }

  .empty-content i {
    font-size: 3.5rem;
  }

  .empty-content h2 {
    font-size: 1.5rem;
  }

  .empty-content p {
    font-size: 1rem;
  }
}
</style>
