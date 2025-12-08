<!-- src/views/Home.vue -->
<template>
  <div class="home-page">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main class="main-content">
      <!-- Hero Section (Featured Movie) -->
      <section v-if="featuredMovie" class="hero-section">
        <div
          class="hero-background"
          :style="{ backgroundImage: `url(${getBackdropUrl(featuredMovie.backdrop_path)})` }"
        >
          <div class="hero-overlay"></div>
        </div>

        <div class="hero-content">
          <h1 class="hero-title">{{ featuredMovie.title }}</h1>
          <p class="hero-overview">{{ truncateText(featuredMovie.overview, 200) }}</p>

          <div class="hero-meta">
            <span class="rating">
              <i class="fas fa-star"></i>
              {{ featuredMovie.vote_average.toFixed(1) }}
            </span>
            <span class="year">{{ getReleaseYear(featuredMovie.release_date) }}</span>
          </div>

          <div class="hero-actions">
            <button
              class="wishlist-btn-hero"
              @click="handleToggleWishlist(featuredMovie.id)"
            >
              <i :class="isInWishlist(featuredMovie.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
              <span>{{ isInWishlist(featuredMovie.id) ? '찜 해제' : '내가 찜한 리스트' }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Movie Sections -->
      <div class="movie-sections">
        <!-- 1. 인기 영화 (API 1) -->
        <section class="movie-section">
          <div class="section-header">
            <h2>
              <i class="fas fa-fire"></i>
              지금 인기 있는 콘텐츠
            </h2>
            <router-link to="/popular" class="see-all">
              모두 보기 <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>

          <div v-if="isLoadingPopular" class="loading-section">
            <Loading message="인기 영화를 불러오는 중..." />
          </div>

          <div v-else class="horizontal-scroll">
            <MovieCard
              v-for="movie in popularMovies.slice(0, 10)"
              :key="movie.id"
              :movie="movie"
              :is-wishlisted="isInWishlist(movie.id)"
              @toggle-wishlist="handleToggleWishlist"
            />
          </div>
        </section>

        <!-- 2. 현재 상영작 (API 2) -->
        <section class="movie-section">
          <div class="section-header">
            <h2>
              <i class="fas fa-film"></i>
              현재 상영 중인 영화
            </h2>
          </div>

          <div v-if="isLoadingNowPlaying" class="loading-section">
            <Loading message="상영작을 불러오는 중..." />
          </div>

          <div v-else class="horizontal-scroll">
            <MovieCard
              v-for="movie in nowPlayingMovies.slice(0, 10)"
              :key="movie.id"
              :movie="movie"
              :is-wishlisted="isInWishlist(movie.id)"
              @toggle-wishlist="handleToggleWishlist"
            />
          </div>
        </section>

        <!-- 3. 최고 평점 (API 3) -->
        <section class="movie-section">
          <div class="section-header">
            <h2>
              <i class="fas fa-star"></i>
              최고 평점 영화
            </h2>
          </div>

          <div v-if="isLoadingTopRated" class="loading-section">
            <Loading message="최고 평점 영화를 불러오는 중..." />
          </div>

          <div v-else class="horizontal-scroll">
            <MovieCard
              v-for="movie in topRatedMovies.slice(0, 10)"
              :key="movie.id"
              :movie="movie"
              :is-wishlisted="isInWishlist(movie.id)"
              @toggle-wishlist="handleToggleWishlist"
            />
          </div>
        </section>

        <!-- 4. 개봉 예정 (API 4) -->
        <section class="movie-section">
          <div class="section-header">
            <h2>
              <i class="fas fa-calendar"></i>
              개봉 예정 영화
            </h2>
          </div>

          <div v-if="isLoadingUpcoming" class="loading-section">
            <Loading message="개봉 예정 영화를 불러오는 중..." />
          </div>

          <div v-else class="horizontal-scroll">
            <MovieCard
              v-for="movie in upcomingMovies.slice(0, 10)"
              :key="movie.id"
              :movie="movie"
              :is-wishlisted="isInWishlist(movie.id)"
              @toggle-wishlist="handleToggleWishlist"
            />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import AppHeader from '@/components/common/AppHeader.vue'
import MovieCard from '@/components/movie/MovieCard.vue'
import Loading from '@/components/common/Loading.vue'
import { useMovieStore } from '@/stores/movie'
import { useWishlistStore } from '@/stores/wishlist'
import { getBackdropUrl } from '@/services/tmdb'

const toast = useToast()
const movieStore = useMovieStore()
const wishlistStore = useWishlistStore()

// State
const isLoadingPopular = ref(false)
const isLoadingNowPlaying = ref(false)
const isLoadingTopRated = ref(false)
const isLoadingUpcoming = ref(false)

// Computed
const popularMovies = computed(() => movieStore.popularMovies)
const nowPlayingMovies = computed(() => movieStore.nowPlayingMovies)
const topRatedMovies = computed(() => movieStore.topRatedMovies)
const upcomingMovies = computed(() => movieStore.upcomingMovies)

const featuredMovie = computed(() => {
  // 인기 영화 중 첫 번째를 Featured로 사용
  return popularMovies.value[0] || null
})

// Methods
const loadAllMovies = async () => {
  try {
    // 4개 API 동시 호출 (필수!)
    const promises = [
      loadPopularMovies(),
      loadNowPlayingMovies(),
      loadTopRatedMovies(),
      loadUpcomingMovies()
    ]

    await Promise.all(promises)
  } catch (error) {
    console.error('Load movies error:', error)
    toast.error('영화 목록을 불러오는데 실패했습니다')
  }
}

const loadPopularMovies = async () => {
  isLoadingPopular.value = true
  try {
    await movieStore.loadPopularMovies()
  } catch (error) {
    console.error('Load popular movies error:', error)
  } finally {
    isLoadingPopular.value = false
  }
}

const loadNowPlayingMovies = async () => {
  isLoadingNowPlaying.value = true
  try {
    await movieStore.loadNowPlayingMovies()
  } catch (error) {
    console.error('Load now playing movies error:', error)
  } finally {
    isLoadingNowPlaying.value = false
  }
}

const loadTopRatedMovies = async () => {
  isLoadingTopRated.value = true
  try {
    await movieStore.loadTopRatedMovies()
  } catch (error) {
    console.error('Load top rated movies error:', error)
  } finally {
    isLoadingTopRated.value = false
  }
}

const loadUpcomingMovies = async () => {
  isLoadingUpcoming.value = true
  try {
    await movieStore.loadUpcomingMovies()
  } catch (error) {
    console.error('Load upcoming movies error:', error)
  } finally {
    isLoadingUpcoming.value = false
  }
}

const handleToggleWishlist = (movieId: number) => {
  const movie = [
    ...popularMovies.value,
    ...nowPlayingMovies.value,
    ...topRatedMovies.value,
    ...upcomingMovies.value
  ].find(m => m.id === movieId)

  if (!movie) return

  wishlistStore.toggleWishlist(movie)

  const isAdded = wishlistStore.isInWishlist(movieId)
  if (isAdded) {
    toast.success('찜한 리스트에 추가했습니다', { icon: '❤️' })
  } else {
    toast.info('찜한 리스트에서 제거했습니다')
  }
}

const isInWishlist = (movieId: number): boolean => {
  return wishlistStore.isInWishlist(movieId)
}

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

const getReleaseYear = (dateString: string): string => {
  if (!dateString) return ''
  return new Date(dateString).getFullYear().toString()
}

// Lifecycle
onMounted(() => {
  wishlistStore.loadWishlist()
  loadAllMovies()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--primary-black);
  padding-top: 70px; /* Header 높이 */
}

/* ==================== Hero Section ==================== */
.hero-section {
  position: relative;
  height: 70vh;
  min-height: 500px;
  display: flex;
  align-items: center;
  overflow: hidden;
  margin-bottom: 2rem;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.4);
}

.hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, var(--primary-black), transparent);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.hero-overview {
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 600px;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.hero-meta .rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hero-meta .rating i {
  color: #ffd700;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.wishlist-btn-hero {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.wishlist-btn-hero:hover {
  background: white;
  color: var(--primary-black);
  transform: scale(1.05);
}

.wishlist-btn-hero i {
  font-size: 1.3rem;
}

/* ==================== Main Content ==================== */
.main-content {
  width: 100%;
}

.movie-sections {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* ==================== Movie Section ==================== */
.movie-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
}

.section-header h2 i {
  color: var(--primary-red);
}

.see-all {
  color: var(--text-white);
  text-decoration: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
}

.see-all:hover {
  color: var(--primary-red);
}

/* ==================== Horizontal Scroll ==================== */
.horizontal-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 1rem;
  scroll-behavior: smooth;

  /* 스크롤바 스타일 */
  scrollbar-width: thin;
  scrollbar-color: var(--primary-red) var(--hover-gray);
}

.horizontal-scroll::-webkit-scrollbar {
  height: 8px;
}

.horizontal-scroll::-webkit-scrollbar-track {
  background: var(--hover-gray);
  border-radius: 4px;
}

.horizontal-scroll::-webkit-scrollbar-thumb {
  background: var(--primary-red);
  border-radius: 4px;
}

.horizontal-scroll::-webkit-scrollbar-thumb:hover {
  background: #f40612;
}

.horizontal-scroll > * {
  flex: 0 0 200px;
  width: 200px;
}

.loading-section {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ==================== Responsive ==================== */
@media (max-width: 768px) {
  .home-page {
    padding-top: 60px;
  }

  .hero-section {
    height: 50vh;
    min-height: 400px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-overview {
    font-size: 1rem;
    max-width: 100%;
  }

  .hero-meta {
    font-size: 0.95rem;
  }

  .wishlist-btn-hero {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  .movie-sections {
    padding: 1rem;
  }

  .section-header h2 {
    font-size: 1.3rem;
  }

  .see-all {
    font-size: 0.9rem;
  }

  .horizontal-scroll > * {
    flex: 0 0 150px;
    width: 150px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.5rem;
  }

  .hero-overview {
    font-size: 0.9rem;
  }

  .wishlist-btn-hero span {
    display: none;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .horizontal-scroll > * {
    flex: 0 0 130px;
    width: 130px;
  }
}
</style>
