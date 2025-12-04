<!-- src/views/Popular.vue -->
<template>
  <div class="popular-page">
    <AppHeader />

    <main class="main-content">
      <div class="container">
        <h1 class="page-title">
          <i class="fas fa-fire"></i>
          대세 콘텐츠
        </h1>

        <!-- View Toggle (필수!) -->
        <ViewToggle
          :current-view="viewMode"
          @change-view="handleViewChange"
        />

        <!-- Conditional Rendering: Table View -->
        <div v-if="viewMode === 'table'" class="table-view">
          <Loading v-if="isLoading" />

          <div v-else>
            <MovieGrid
              :movies="movies"
              :wishlist-ids="wishlistIds"
              @toggle-wishlist="handleToggleWishlist"
            />

            <!-- Pagination (Table View 필수!) -->
            <Pagination
              :current-page="currentPage"
              :total-pages="totalPages"
              @change-page="handlePageChange"
            />
          </div>
        </div>

        <!-- Conditional Rendering: Infinite Scroll View -->
        <div
          v-else
          ref="scrollContainer"
          class="infinite-scroll-view"
        >
          <MovieGrid
            :movies="movies"
            :wishlist-ids="wishlistIds"
            @toggle-wishlist="handleToggleWishlist"
          />

          <!-- Loading (무한 스크롤 중) -->
          <Loading v-if="isLoadingMore" message="더 불러오는 중..." />

          <!-- 모두 불러옴 -->
          <div v-if="!isLoadingMore && currentPage >= totalPages" class="end-message">
            <i class="fas fa-check-circle"></i>
            <p>모든 영화를 불러왔습니다</p>
          </div>

          <!-- Top 버튼 (무한 스크롤 필수!) -->
          <Transition name="fade">
            <button
              v-show="showTopButton"
              @click="scrollToTop"
              class="top-button"
              title="맨 위로"
            >
              <i class="fas fa-arrow-up"></i>
            </button>
          </Transition>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import AppHeader from '@/components/common/AppHeader.vue'
import Loading from '@/components/common/Loading.vue'
import MovieGrid from '@/components/movie/MovieGrid.vue'
import Pagination from '@/components/movie/Pagination.vue'
import ViewToggle from '@/components/movie/ViewToggle.vue'
import { useWishlist } from '@/composables/useWishlist'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import { fetchPopularMovies } from '@/services/tmdb'
import type { Movie } from '@/types/movie'

const toast = useToast()

// Wishlist
const { wishlistIds, loadWishlist, toggleWishlist } = useWishlist()

// State
const viewMode = ref<'table' | 'infinite'>('table')
const movies = ref<Movie[]>([])
const isLoading = ref(false)
const isLoadingMore = ref(false)
const currentPage = ref(1)
const totalPages = ref(0)
const showTopButton = ref(false)

// Infinite Scroll Composable
const { scrollContainer, scrollToTop: scrollToTopUtil } = useInfiniteScroll(() => {
  // 무한 스크롤 끝에 도달하면 다음 페이지 로드
  if (!isLoadingMore.value && currentPage.value < totalPages.value) {
    loadMoreMovies()
  }
})

// 영화 로드 (Table View)
const loadMovies = async (page: number) => {
  isLoading.value = true

  try {
    const data = await fetchPopularMovies(page)
    movies.value = data.results
    currentPage.value = page
    totalPages.value = Math.min(data.total_pages, 500) // TMDB API 제한
  } catch (error) {
    console.error('Failed to load movies:', error)
    toast.error('영화를 불러오는데 실패했습니다')
  } finally {
    isLoading.value = false
  }
}

// 추가 로드 (Infinite Scroll)
const loadMoreMovies = async () => {
  if (isLoadingMore.value || currentPage.value >= totalPages.value) return

  isLoadingMore.value = true

  try {
    const nextPage = currentPage.value + 1
    const data = await fetchPopularMovies(nextPage)

    // 기존 영화 배열에 추가
    movies.value.push(...data.results)
    currentPage.value = nextPage
  } catch (error) {
    console.error('Failed to load more movies:', error)
    toast.error('영화를 더 불러오는데 실패했습니다')
  } finally {
    isLoadingMore.value = false
  }
}

// View 전환
const handleViewChange = (view: 'table' | 'infinite') => {
  viewMode.value = view

  if (view === 'table') {
    // Table View로 전환 시: 첫 페이지 다시 로드
    loadMovies(1)
  } else {
    // Infinite Scroll로 전환 시: 이미 로드된 데이터 유지
    if (movies.value.length === 0) {
      loadMovies(1)
    }
  }
}

// 페이지 변경 (Table View)
const handlePageChange = (page: number) => {
  loadMovies(page)

  // 페이지 변경 시 맨 위로 스크롤
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Top 버튼
const scrollToTop = () => {
  if (viewMode.value === 'infinite') {
    scrollToTopUtil()
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 찜하기 토글
const handleToggleWishlist = (movieId: number) => {
  const movie = movies.value.find(m => m.id === movieId)

  if (movie) {
    toggleWishlist(movie)

    if (wishlistIds.value.includes(movieId)) {
      toast.success('찜 목록에 추가되었습니다', {
        timeout: 2000,
        icon: '❤️'
      })
    } else {
      toast.info('찜 목록에서 제거되었습니다', {
        timeout: 2000
      })
    }
  }
}

// Top 버튼 표시 로직 (무한 스크롤용)
const handleScrollForTopButton = () => {
  if (viewMode.value === 'infinite' && scrollContainer.value) {
    showTopButton.value = scrollContainer.value.scrollTop > 500
  }
}

// Watch: 무한 스크롤 컨테이너에 스크롤 이벤트 리스너 추가
watch(scrollContainer, (newContainer) => {
  if (newContainer) {
    newContainer.addEventListener('scroll', handleScrollForTopButton)
  }
})

// Lifecycle
onMounted(() => {
  loadWishlist()
  loadMovies(1)
})
</script>

<style scoped>
.popular-page {
  min-height: 100vh;
  background: var(--primary-black);
  padding-top: 80px;
}

.main-content {
  width: 100%;
  padding-bottom: 3rem;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--text-white);
}

.page-title i {
  color: var(--primary-red);
}

/* ==================== Table View ==================== */
.table-view {
  /* 스크롤 비활성화: 모든 컨텐츠가 한 페이지에 */
  overflow: visible;
}

/* ==================== Infinite Scroll View ==================== */
.infinite-scroll-view {
  /* 스크롤 가능 */
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* 스크롤바 스타일 */
.infinite-scroll-view::-webkit-scrollbar {
  width: 8px;
}

.infinite-scroll-view::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.infinite-scroll-view::-webkit-scrollbar-thumb {
  background: var(--primary-red);
  border-radius: 4px;
}

.infinite-scroll-view::-webkit-scrollbar-thumb:hover {
  background: #f40612;
}

/* ==================== End Message ==================== */
.end-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-gray);
  text-align: center;
}

.end-message i {
  font-size: 3rem;
  color: var(--primary-red);
  margin-bottom: 1rem;
}

.end-message p {
  font-size: 1.2rem;
  margin: 0;
}

/* ==================== Top Button (필수!) ==================== */
.top-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary-red);
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(229, 9, 20, 0.5);
  transition: all 0.3s ease;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
}

.top-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(229, 9, 20, 0.7);
}

.top-button:active {
  transform: scale(0.95);
}

/* Top Button Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* ==================== Responsive ==================== */
@media (max-width: 768px) {
  .popular-page {
    padding-top: 60px;
  }

  .container {
    padding: 0 1rem;
  }

  .page-title {
    font-size: 1.8rem;
    margin: 1.5rem 0;
  }

  .infinite-scroll-view {
    max-height: calc(100vh - 150px);
  }

  .top-button {
    width: 48px;
    height: 48px;
    bottom: 1.5rem;
    right: 1.5rem;
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
  }

  .top-button {
    width: 44px;
    height: 44px;
    bottom: 1rem;
    right: 1rem;
  }
}
</style>
