<template>
  <div class="popular-page" :class="{ 'table-mode': viewMode === 'table' }">
    <AppHeader />

    <main class="main-content">
      <div class="content-wrapper">
        <div class="page-header">
          <div class="header-left">
            <h1><i class="fas fa-fire"></i> 대세 콘텐츠</h1>
          </div>
          <ViewToggle :current-view="viewMode" @change-view="handleChangeView" />
        </div>

        <div v-if="viewMode === 'table'" class="table-view">
          <div class="grid-container">
            <MovieGrid
              v-if="!isLoading"
              :movies="displayedMovies"
              :wishlist-ids="wishlistIds"
              :view-mode="viewMode"
              @toggle-wishlist="handleToggleWishlist"
            />
            <Loading v-if="isLoading" message="영화를 불러오는 중..." />
          </div>

          <Pagination
            v-if="!isLoading && totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            @change-page="handleChangePage"
          />
        </div>

        <div v-else ref="scrollContainer" class="infinite-scroll-view" @scroll="handleScroll">
          <MovieGrid :movies="movies" :wishlist-ids="wishlistIds" @toggle-wishlist="handleToggleWishlist" />
          <div v-if="isLoadingMore" class="loading-more">
            <Loading message="더 많은 영화를 불러오는 중..." />
          </div>
          <div v-if="!isLoadingMore && currentPage >= totalPages" class="end-message">
            <i class="fas fa-check-circle"></i>
            <p>모든 영화를 불러왔습니다</p>
          </div>
          <button v-if="showScrollTopBtn" class="scroll-top-btn" @click="scrollToTop">
            <i class="fas fa-arrow-up"></i>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

// 반응형 창 크기 상태
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

const handleResize = () => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

// State
const viewMode = ref<'table' | 'infinite'>('table')
const movies = ref<Movie[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)
const isLoadingMore = ref(false)
const showScrollTopBtn = ref(false)

const wishlistIds = computed(() => wishlistStore.wishlistIds)

// ✅ 실시간 계산 로직: 스크롤바가 생기지 않도록 개수 제한
const displayedMovies = computed(() => {
  if (viewMode.value !== 'table') return movies.value

  const vh = windowHeight.value
  const vw = windowWidth.value

  // 1. 제외할 고정 높이 (Header + Title + Pagination + Padding)
  let fixedSpace = vw < 768 ? 280 : 350
  const availableHeight = vh - fixedSpace

  // 2. 현재 너비에 따른 열(Column) 개수 (CSS와 동기화)
  let itemsPerRow = 4
  if (vw < 768) itemsPerRow = 2
  else if (vw < 1200) itemsPerRow = 3

  // 3. 카드 높이 추정 (MovieCard의 vh 기반 크기 + Gap)
  // 카드가 25vh~28vh 정도를 차지하므로 약 30vh로 계산
  const rowHeight = vh * 0.32
  const maxRows = Math.floor(availableHeight / rowHeight)

  // 결과값이 0이 되지 않도록 최소 1줄 보장
  const rows = Math.max(1, maxRows)

  return movies.value.slice(0, rows * itemsPerRow)
})

const { scrollContainer, scrollToTop: scrollToTopComposable } = useInfiniteScroll(() => {
  if (viewMode.value === 'infinite' && !isLoadingMore.value && currentPage.value < totalPages.value) {
    loadMoreMovies()
  }
})

const loadMovies = async (page = 1) => {
  isLoading.value = true
  try {
    const data = await fetchPopularMovies(page)
    movies.value = data.results
    currentPage.value = data.page
    totalPages.value = data.total_pages
  } catch (error) {
    toast.error('영화를 불러오는데 실패했습니다')
  } finally {
    isLoading.value = false
  }
}

const loadMoreMovies = async () => {
  if (isLoadingMore.value || currentPage.value >= totalPages.value) return
  isLoadingMore.value = true
  try {
    const data = await fetchPopularMovies(currentPage.value + 1)
    movies.value.push(...data.results)
    currentPage.value = data.page
  } finally {
    isLoadingMore.value = false
  }
}

const handleChangePage = async (page: number) => {
  currentPage.value = page
  await loadMovies(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleChangeView = (view: 'table' | 'infinite') => {
  viewMode.value = view
  currentPage.value = 1
  loadMovies(1)
}

const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  showScrollTopBtn.value = target.scrollTop > 500
}

const scrollToTop = () => scrollToTopComposable()

const handleToggleWishlist = (movieId: number) => {
  const movie = movies.value.find(m => m.id === movieId)
  if (movie) wishlistStore.toggleWishlist(movie)
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  wishlistStore.loadWishlist()
  loadMovies()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.header-left {
  flex-wrap: nowrap; /* 줄바꿈 방지 */
  width: 100%;
}

.popular-page {
  min-height: 100vh;
  background: var(--primary-black);
  padding-top: 70px;
}

.main-content {
  width: 100%;
  height: calc(100vh - 70px);
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* ==================== Table Mode Layout ==================== */
.popular-page.table-mode {
  height: 100vh;
  overflow: hidden;
}

.table-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 0;
  overflow: hidden;
}

.grid-container {
  flex: 1;
  flex-shrink: 1;
  display: flex;
  align-items: center; /* 카드들을 수직 중앙 정렬 */
  min-height: 0;
  overflow: hidden;
}

/* 페이지네이션 컴포넌트가 들어가는 부분 */
.table-view > :last-child {
  flex-shrink: 0; /* 페이지네이션은 절대로 줄어들거나 밀려나면 안 됨 */
  margin-top: auto; /* 무조건 바닥에 붙임 */
  padding: 1rem 0;
}

.page-header {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ==================== Infinite Scroll ==================== */
.infinite-scroll-view {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

/* ... 기존 스크롤바 및 기타 스타일 유지 ... */
</style>
