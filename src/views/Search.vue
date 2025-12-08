<!-- src/views/Search.vue -->
<template>
  <div class="search-page">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- Page Header -->
        <div class="page-header">
          <h1>
            <i class="fas fa-search"></i>
            영화 찾아보기
          </h1>
          <p>원하는 영화를 검색하거나 필터링해보세요</p>
        </div>

        <!-- Search Bar -->
        <div class="search-section">
          <div class="search-bar">
            <i class="fas fa-search"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="영화 제목을 입력하세요..."
              @keyup.enter="handleSearch"
            />
            <button
              v-if="searchQuery"
              class="clear-btn"
              @click="clearSearch"
            >
              <i class="fas fa-times"></i>
            </button>
            <button
              class="search-btn"
              @click="handleSearch"
              :disabled="!searchQuery.trim()"
            >
              검색
            </button>
          </div>

          <!-- Recent Searches -->
          <div v-if="recentSearches.length > 0 && !searchQuery" class="recent-searches">
            <h3>최근 검색어</h3>
            <div class="search-tags">
              <button
                v-for="(keyword, index) in recentSearches"
                :key="index"
                class="search-tag"
                @click="applyRecentSearch(keyword)"
              >
                <i class="fas fa-history"></i>
                {{ keyword }}
              </button>
              <button class="clear-all-btn" @click="clearAllSearches">
                <i class="fas fa-trash"></i>
                전체 삭제
              </button>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="filters-section">
          <button
            class="filter-toggle-btn"
            @click="showFilters = !showFilters"
          >
            <i class="fas fa-filter"></i>
            <span>필터</span>
            <i :class="showFilters ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
          </button>

          <Transition name="slide-down">
            <div v-if="showFilters" class="filters-panel">
              <!-- Genre Filter -->
              <div class="filter-group">
                <label>장르</label>
                <select v-model="selectedGenre" @change="applyFilters">
                  <option value="">전체 장르</option>
                  <option
                    v-for="genre in genres"
                    :key="genre.id"
                    :value="genre.id"
                  >
                    {{ genre.name }}
                  </option>
                </select>
              </div>

              <!-- Sort By -->
              <div class="filter-group">
                <label>정렬</label>
                <select v-model="sortBy" @change="applyFilters">
                  <option value="popularity.desc">인기순</option>
                  <option value="vote_average.desc">평점 높은순</option>
                  <option value="vote_average.asc">평점 낮은순</option>
                  <option value="release_date.desc">최신순</option>
                  <option value="release_date.asc">오래된순</option>
                </select>
              </div>

              <!-- Rating Filter -->
              <div class="filter-group">
                <label>평점 ({{ minRating }}점 이상)</label>
                <input
                  v-model.number="minRating"
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  @change="applyFilters"
                />
              </div>

              <!-- Reset Button -->
              <button class="reset-filters-btn" @click="resetFilters">
                <i class="fas fa-redo"></i>
                필터 초기화
              </button>
            </div>
          </Transition>
        </div>

        <!-- Results Info -->
        <div v-if="hasSearched" class="results-info">
          <p v-if="searchQuery">
            "<strong>{{ searchQuery }}</strong>" 검색 결과:
            <strong>{{ totalResults }}개</strong>
          </p>
          <p v-else-if="selectedGenre">
            장르 필터 결과: <strong>{{ totalResults }}개</strong>
          </p>
        </div>

        <!-- Loading -->
        <Loading v-if="isLoading" message="검색 중..." />

        <!-- Movie Grid -->
        <MovieGrid
          v-else-if="!isLoading && movies.length > 0"
          :movies="movies"
          :wishlist-ids="wishlistIds"
          @toggle-wishlist="handleToggleWishlist"
        />

        <!-- Pagination -->
        <Pagination
          v-if="!isLoading && movies.length > 0 && totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          @change-page="handleChangePage"
        />

        <!-- Empty State -->
        <div v-else-if="!isLoading && hasSearched" class="empty-state">
          <i class="fas fa-search"></i>
          <h3>검색 결과가 없습니다</h3>
          <p>다른 검색어나 필터를 시도해보세요</p>
        </div>

        <!-- Initial State -->
        <div v-else class="empty-state">
          <i class="fas fa-film"></i>
          <h3>영화를 검색해보세요</h3>
          <p>제목으로 검색하거나 장르별로 필터링할 수 있습니다</p>
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
import Loading from '@/components/common/Loading.vue'
import Pagination from '@/components/movie/Pagination.vue'
import { useWishlistStore } from '@/stores/wishlist'
import { useMovieStore } from '@/stores/movie'
import { searchMovies, discoverMovies } from '@/services/tmdb'
import { saveSearchHistory, getSearchHistory, clearSearchHistory } from '@/utils/localStorage'
import type { Movie } from '@/types/movie'

const toast = useToast()
const wishlistStore = useWishlistStore()
const movieStore = useMovieStore()

// State
const searchQuery = ref('')
const movies = ref<Movie[]>([])
const isLoading = ref(false)
const hasSearched = ref(false)
const showFilters = ref(false)
const recentSearches = ref<string[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const totalResults = ref(0)

// Filters
const selectedGenre = ref<number | ''>('')
const sortBy = ref('popularity.desc')
const minRating = ref(0)

// Computed
const wishlistIds = computed(() => wishlistStore.wishlistIds)
const genres = computed(() => movieStore.genres)

// Methods
const handleSearch = async () => {
  const query = searchQuery.value.trim()
  if (!query) return

  isLoading.value = true
  hasSearched.value = true
  currentPage.value = 1

  try {
    const data = await searchMovies(query, currentPage.value)
    movies.value = data.results
    totalPages.value = data.total_pages
    totalResults.value = data.total_results

    // 검색어 저장
    saveSearchHistory(query)
    loadRecentSearches()

    toast.success(`${data.total_results}개의 영화를 찾았습니다`)
  } catch (error) {
    console.error('Search error:', error)
    toast.error('검색 중 오류가 발생했습니다')
  } finally {
    isLoading.value = false
  }
}

const applyFilters = async () => {
  isLoading.value = true
  hasSearched.value = true
  currentPage.value = 1

  try {
    const filters: any = {
      sortBy: sortBy.value,
      page: currentPage.value
    }

    if (selectedGenre.value) {
      filters.withGenres = [selectedGenre.value]
    }

    if (minRating.value > 0) {
      filters.voteAverageGte = minRating.value
    }

    const data = await discoverMovies(filters)
    movies.value = data.results
    totalPages.value = data.total_pages
    totalResults.value = data.total_results

    toast.success(`${data.total_results}개의 영화를 찾았습니다`)
  } catch (error) {
    console.error('Filter error:', error)
    toast.error('필터링 중 오류가 발생했습니다')
  } finally {
    isLoading.value = false
  }
}

const resetFilters = () => {
  selectedGenre.value = ''
  sortBy.value = 'popularity.desc'
  minRating.value = 0
  searchQuery.value = ''
  movies.value = []
  hasSearched.value = false
  currentPage.value = 1
  totalPages.value = 1
  totalResults.value = 0
  toast.info('필터가 초기화되었습니다')
}

const clearSearch = () => {
  searchQuery.value = ''
  movies.value = []
  hasSearched.value = false
  currentPage.value = 1
  totalPages.value = 1
  totalResults.value = 0
}

const applyRecentSearch = (keyword: string) => {
  searchQuery.value = keyword
  handleSearch()
}

const loadRecentSearches = () => {
  recentSearches.value = getSearchHistory()
}

const clearAllSearches = () => {
  clearSearchHistory()
  recentSearches.value = []
  toast.info('검색 기록이 삭제되었습니다')
}

const handleChangePage = async (page: number) => {
  currentPage.value = page

  // 검색어가 있으면 검색, 아니면 필터 재적용
  if (searchQuery.value.trim()) {
    isLoading.value = true
    try {
      const data = await searchMovies(searchQuery.value, page)
      movies.value = data.results
      totalPages.value = data.total_pages
      totalResults.value = data.total_results
    } catch (error) {
      console.error('Page change error:', error)
      toast.error('페이지를 불러오는데 실패했습니다')
    } finally {
      isLoading.value = false
    }
  } else {
    // 필터만 적용된 경우
    await applyFilters()
  }

  // 페이지 변경 시 스크롤을 맨 위로
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
onMounted(async () => {
  wishlistStore.loadWishlist()
  loadRecentSearches()

  // 장르 목록 로드
  if (!movieStore.hasGenres) {
    await movieStore.loadGenres()
  }
})
</script>

<style scoped>
.search-page {
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

/* ==================== Search Section ==================== */
.search-section {
  margin-bottom: 2rem;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--hover-gray);
  padding: 1rem 1.5rem;
  border-radius: 50px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.search-bar:focus-within {
  border-color: var(--primary-red);
  box-shadow: 0 0 20px rgba(229, 9, 20, 0.3);
}

.search-bar > i {
  font-size: 1.2rem;
  color: var(--text-gray);
}

.search-bar input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-white);
  font-size: 1rem;
}

.search-bar input::placeholder {
  color: var(--text-gray);
}

.clear-btn {
  background: transparent;
  border: none;
  color: var(--text-gray);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;
}

.clear-btn:hover {
  color: var(--text-white);
}

.search-btn {
  padding: 0.75rem 2rem;
  background: var(--primary-red);
  border: none;
  color: white;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover:not(:disabled) {
  background: #f40612;
  transform: scale(1.05);
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ==================== Recent Searches ==================== */
.recent-searches {
  margin-top: 1.5rem;
}

.recent-searches h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: var(--text-gray);
}

.search-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.search-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #333;
  color: var(--text-white);
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-tag:hover {
  background: var(--primary-red);
  border-color: var(--primary-red);
}

.clear-all-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--text-gray);
  color: var(--text-gray);
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-all-btn:hover {
  border-color: var(--primary-red);
  color: var(--primary-red);
}

/* ==================== Filters ==================== */
.filters-section {
  margin-bottom: 2rem;
}

.filter-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #333;
  color: var(--text-white);
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--primary-red);
}

.filters-panel {
  margin-top: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-gray);
}

.filter-group select,
.filter-group input[type="range"] {
  padding: 0.75rem;
  background: var(--hover-gray);
  border: 1px solid #333;
  color: var(--text-white);
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.filter-group select:focus,
.filter-group input:focus {
  outline: none;
  border-color: var(--primary-red);
}

.reset-filters-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid var(--text-gray);
  color: var(--text-gray);
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.reset-filters-btn:hover {
  border-color: var(--primary-red);
  color: var(--primary-red);
}

/* ==================== Results Info ==================== */
.results-info {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.results-info p {
  margin: 0;
  font-size: 1rem;
  color: var(--text-white);
}

.results-info strong {
  color: var(--primary-red);
}

/* ==================== Empty State ==================== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 2rem;
  color: var(--text-gray);
  text-align: center;
}

.empty-state i {
  font-size: 4rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin: 0;
  color: var(--text-white);
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0;
}

/* ==================== Animations ==================== */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ==================== Responsive ==================== */
@media (max-width: 768px) {
  .search-page {
    padding-top: 60px;
  }

  .content-wrapper {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 1.8rem;
  }

  .search-bar {
    padding: 0.75rem 1rem;
  }

  .search-btn {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }

  .filters-panel {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.5rem;
    gap: 0.5rem;
  }

  .search-bar input {
    font-size: 0.9rem;
  }

  .search-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
}
</style>
