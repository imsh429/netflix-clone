<!-- src/views/Popular.vue -->
<template>
  <div class="popular-page">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- Page Header -->
        <div class="page-header">
          <h1>
            <i class="fas fa-fire"></i>
            대세 콘텐츠
          </h1>
          <p>지금 가장 인기 있는 영화들을 확인하세요</p>
        </div>

        <!-- View Toggle (필수!) -->
        <ViewToggle
          :current-view="viewMode"
          @change-view="handleChangeView"
        />

        <!-- Table View Mode -->
        <div v-if="viewMode === 'table'" class="table-view">
          <!-- Movie Grid -->
          <MovieGrid
            v-if="!isLoading"
            :movies="movies"
            :wishlist-ids="wishlistIds"
            @toggle-wishlist="handleToggleWishlist"
          />

          <!-- Loading -->
          <Loading v-if="isLoading" message="영화를 불러오는 중..." />

          <!-- Pagination (필수!) -->
          <Pagination
            v-if="!isLoading && totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            @change-page="handleChangePage"
          />
        </div>

        <!-- Infinite Scroll Mode (필수!) -->
        <div
          v-else
          ref="scrollContainer"
          class="infinite-scroll-view"
          @scroll="handleScroll"
        >
          <!-- Movie Grid -->
          <MovieGrid
            :movies="movies"
            :wishlist-ids="wishlistIds"
            @toggle-wishlist="handleToggleWishlist"
          />

          <!-- Loading More -->
          <div v-if="isLoadingMore" class="loading-more">
            <Loading message="더 많은 영화를 불러오는 중..." />
          </div>

          <!-- End Message -->
          <div v-if="!isLoadingMore && currentPage >= totalPages" class="end-message">
            <i class="fas fa-check-circle"></i>
            <p>모든 영화를 불러왔습니다</p>
          </div>

          <!-- Scroll to Top Button -->
          <button
            v-if="showScrollTopBtn"
            class="scroll-top-btn"
            @click="scrollToTop"
          >
            <i class="fas fa-arrow-up"></i>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import AppHeader from '@/components/common/AppHeader.vue'
import MovieGrid from '@/components/movie/MovieGrid.vue'
import Pagination from '@/components/movie/Pagination.vue'
import ViewToggle from '@/components/movie/ViewToggle.vue'
import Loading from '@/components/common/Loading.vue'
import { useWishlistStore } from '@/stores/wishlist'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import { fetchPopularMovies } from '@/services/tmdb'
import type { Movie } from '@/types/movie'

const toast = useToast()
const wishlistStore = useWishlistStore()

// State
const viewMode = ref<'table' | 'infinite'>('table')
const movies = ref<Movie[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)
const isLoadingMore = ref(false)
const showScrollTopBtn = ref(false)

// Computed
const wishlistIds = computed(() => wishlistStore.wishlistIds)

// Infinite Scroll Setup
const { scrollContainer, scrollToTop: scrollToTopComposable } = useInfiniteScroll(() => {
  if (viewMode.value === 'infinite' && !isLoadingMore.value && currentPage.value < totalPages.value) {
    loadMoreMovies()
  }
})

// Methods
const loadMovies = async (page = 1) => {
  isLoading.value = true

  try {
    const data = await fetchPopularMovies(page)
    movies.value = data.results
    currentPage.value = data.page
    totalPages.value = data.total_pages
  } catch (error) {
    console.error('Load movies error:', error)
    toast.error('영화를 불러오는데 실패했습니다')
  } finally {
    isLoading.value = false
  }
}

const loadMoreMovies = async () => {
  if (isLoadingMore.value || currentPage.value >= totalPages.value) return

  isLoadingMore.value = true
  const nextPage = currentPage.value + 1

  try {
    const data = await fetchPopularMovies(nextPage)

    // 기존 영화에 추가 (Append)
    movies.value.push(...data.results)
    currentPage.value = data.page
    totalPages.value = data.total_pages
  } catch (error) {
    console.error('Load more movies error:', error)
    toast.error('영화를 더 불러오는데 실패했습니다')
  } finally {
    isLoadingMore.value = false
  }
}

const handleChangePage = async (page: number) => {
  currentPage.value = page
  await loadMovies(page)

  // 페이지 변경 시 스크롤을 맨 위로
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleChangeView = (view: 'table' | 'infinite') => {
  viewMode.value = view

  if (view === 'infinite') {
    // 무한 스크롤 모드로 전환 시 첫 페이지부터 다시 로드
    currentPage.value = 1
    loadMovies(1)
    // ✅ useInfiniteScroll의 watch가 자동으로 이벤트 리스너 추가
  } else {
    // Table 모드로 전환 시 첫 페이지 로드
    currentPage.value = 1
    loadMovies(1)
    // ✅ useInfiniteScroll의 watch가 자동으로 이벤트 리스너 제거
  }

  toast.success(`${view === 'table' ? 'Table View' : '무한 스크롤'} 모드로 전환되었습니다`)
}

const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target) return

  const scrollTop = target.scrollTop
  showScrollTopBtn.value = scrollTop > 500
}

const scrollToTop = () => {
  scrollToTopComposable()
}

const handleToggleWishlist = (movieId: number) => {
  const movie = movies.value.find(m => m.id === movieId)
  if (!movie) return

  wishlistStore.toggleWishlist(movie)

  const isAdded = wishlistStore.isInWishlist(movieId)
  if (isAdded) {
    toast.success('찜한 리스트에 추가했습니다', { icon: '❤️' })
  } else {
    toast.info('찜한 리스트에서 제거했습니다')
  }
}

// Lifecycle
onMounted(() => {
  wishlistStore.loadWishlist()
  loadMovies()
})
</script>

<style scoped>
.popular-page {
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

/* ==================== Table View ==================== */
.table-view {
  width: 100%;
}

/* ==================== Infinite Scroll View ==================== */
.infinite-scroll-view {
  width: 100%;
  max-height: calc(100vh - 250px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;

  /* 스크롤바 스타일 */
  scrollbar-width: thin;
  scrollbar-color: var(--primary-red) var(--hover-gray);
}

.infinite-scroll-view::-webkit-scrollbar {
  width: 10px;
}

.infinite-scroll-view::-webkit-scrollbar-track {
  background: var(--hover-gray);
  border-radius: 5px;
}

.infinite-scroll-view::-webkit-scrollbar-thumb {
  background: var(--primary-red);
  border-radius: 5px;
}

.infinite-scroll-view::-webkit-scrollbar-thumb:hover {
  background: #f40612;
}

/* ==================== Loading More ==================== */
.loading-more {
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.end-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 2rem;
  color: var(--text-gray);
  text-align: center;
}

.end-message i {
  font-size: 3rem;
  color: var(--primary-red);
}

.end-message p {
  font-size: 1.1rem;
  margin: 0;
}

/* ==================== Scroll to Top Button ==================== */
.scroll-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary-red);
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  z-index: 50;
}

.scroll-top-btn:hover {
  background: #f40612;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.7);
}

.scroll-top-btn:active {
  transform: translateY(-1px);
}

/* ==================== Responsive ==================== */
@media (max-width: 768px) {
  .popular-page {
    padding-top: 60px;
  }

  .content-wrapper {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 1.8rem;
  }

  .page-header p {
    font-size: 1rem;
  }

  .infinite-scroll-view {
    max-height: calc(100vh - 220px);
    padding: 0.5rem;
  }

  .scroll-top-btn {
    width: 45px;
    height: 45px;
    bottom: 1.5rem;
    right: 1.5rem;
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.5rem;
    gap: 0.5rem;
  }

  .page-header p {
    font-size: 0.9rem;
  }

  .scroll-top-btn {
    width: 40px;
    height: 40px;
    bottom: 1rem;
    right: 1rem;
    font-size: 1rem;
  }
}
</style>
