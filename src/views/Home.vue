<!-- src/views/Home.vue -->
<template>
  <div class="home-page">
    <AppHeader />

    <main class="main-content">
      <!-- Hero Section (선택사항) -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            <i class="fas fa-film"></i>
            Netflix Demo
          </h1>
          <p class="hero-subtitle">수천 편의 영화를 감상하세요</p>
        </div>
      </section>

      <div class="container">
        <!-- 섹션 1: 인기 영화 (필수 API 1) -->
        <section class="movie-section">
          <h2 class="section-title">
            <i class="fas fa-fire"></i>
            인기 영화
          </h2>

          <!-- Conditional Rendering -->
          <Loading v-if="popularLoading" />
          <MovieGrid
            v-else-if="popularMovies.length > 0"
            :movies="popularMovies"
            :wishlist-ids="wishlistIds"
            @toggle-wishlist="handleToggleWishlist"
          />
          <div v-else class="empty-message">
            영화를 불러올 수 없습니다.
          </div>
        </section>

        <!-- 섹션 2: 현재 상영작 (필수 API 2) -->
        <section class="movie-section">
          <h2 class="section-title">
            <i class="fas fa-play-circle"></i>
            현재 상영작
          </h2>

          <Loading v-if="nowPlayingLoading" />
          <MovieGrid
            v-else-if="nowPlayingMovies.length > 0"
            :movies="nowPlayingMovies"
            :wishlist-ids="wishlistIds"
            @toggle-wishlist="handleToggleWishlist"
          />
          <div v-else class="empty-message">
            영화를 불러올 수 없습니다.
          </div>
        </section>

        <!-- 섹션 3: 최고 평점 (필수 API 3) -->
        <section class="movie-section">
          <h2 class="section-title">
            <i class="fas fa-star"></i>
            최고 평점
          </h2>

          <Loading v-if="topRatedLoading" />
          <MovieGrid
            v-else-if="topRatedMovies.length > 0"
            :movies="topRatedMovies"
            :wishlist-ids="wishlistIds"
            @toggle-wishlist="handleToggleWishlist"
          />
          <div v-else class="empty-message">
            영화를 불러올 수 없습니다.
          </div>
        </section>

        <!-- 섹션 4: 개봉 예정 (필수 API 4) -->
        <section class="movie-section">
          <h2 class="section-title">
            <i class="fas fa-calendar-plus"></i>
            개봉 예정
          </h2>

          <Loading v-if="upcomingLoading" />
          <MovieGrid
            v-else-if="upcomingMovies.length > 0"
            :movies="upcomingMovies"
            :wishlist-ids="wishlistIds"
            @toggle-wishlist="handleToggleWishlist"
          />
          <div v-else class="empty-message">
            영화를 불러올 수 없습니다.
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import AppHeader from '@/components/common/AppHeader.vue'
import Loading from '@/components/common/Loading.vue'
import MovieGrid from '@/components/movie/MovieGrid.vue'
import { useWishlist } from '@/composables/useWishlist'
import {
  fetchPopularMovies,
  fetchNowPlayingMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies
} from '@/services/tmdb'
import type { Movie } from '@/types/movie'

const toast = useToast()

// Wishlist Composable 사용
const { wishlist, wishlistIds, loadWishlist, toggleWishlist } = useWishlist()

// State - 각 섹션별 상태 관리
const popularMovies = ref<Movie[]>([])
const popularLoading = ref(false)

const nowPlayingMovies = ref<Movie[]>([])
const nowPlayingLoading = ref(false)

const topRatedMovies = ref<Movie[]>([])
const topRatedLoading = ref(false)

const upcomingMovies = ref<Movie[]>([])
const upcomingLoading = ref(false)

// 영화 데이터 로드
const loadAllMovies = async () => {
  try {
    // 1. 인기 영화
    popularLoading.value = true
    const popularData = await fetchPopularMovies()
    popularMovies.value = popularData.results.slice(0, 10) // 상위 10개만
    popularLoading.value = false

    // 2. 현재 상영작
    nowPlayingLoading.value = true
    const nowPlayingData = await fetchNowPlayingMovies()
    nowPlayingMovies.value = nowPlayingData.results.slice(0, 10)
    nowPlayingLoading.value = false

    // 3. 최고 평점
    topRatedLoading.value = true
    const topRatedData = await fetchTopRatedMovies()
    topRatedMovies.value = topRatedData.results.slice(0, 10)
    topRatedLoading.value = false

    // 4. 개봉 예정
    upcomingLoading.value = true
    const upcomingData = await fetchUpcomingMovies()
    upcomingMovies.value = upcomingData.results.slice(0, 10)
    upcomingLoading.value = false
  } catch (error) {
    console.error('Failed to load movies:', error)
    toast.error('영화를 불러오는데 실패했습니다')

    popularLoading.value = false
    nowPlayingLoading.value = false
    topRatedLoading.value = false
    upcomingLoading.value = false
  }
}

// 찜하기 토글
const handleToggleWishlist = (movieId: number) => {
  // 모든 영화 배열에서 해당 영화 찾기
  const movie =
    popularMovies.value.find(m => m.id === movieId) ||
    nowPlayingMovies.value.find(m => m.id === movieId) ||
    topRatedMovies.value.find(m => m.id === movieId) ||
    upcomingMovies.value.find(m => m.id === movieId)

  if (movie) {
    toggleWishlist(movie)

    // 토스트 알림
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

// Lifecycle
onMounted(() => {
  loadWishlist()
  loadAllMovies()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--primary-black);
  padding-top: 80px; /* Header 높이만큼 */
}

/* ==================== Hero Section ==================== */
.hero-section {
  background: linear-gradient(
    135deg,
    rgba(229, 9, 20, 0.2) 0%,
    rgba(0, 0, 0, 0.8) 100%
  );
  padding: 4rem 2rem;
  margin-bottom: 3rem;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--text-white);
}

.hero-title i {
  color: var(--primary-red);
  font-size: 3.5rem;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--text-gray);
  margin: 0;
}

/* ==================== Main Content ==================== */
.main-content {
  width: 100%;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* ==================== Movie Sections ==================== */
.movie-section {
  margin-bottom: 4rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-white);
  padding-left: 0.5rem;
  border-left: 4px solid var(--primary-red);
}

.section-title i {
  color: var(--primary-red);
  font-size: 1.6rem;
}

.empty-message {
  text-align: center;
  padding: 3rem;
  color: var(--text-gray);
  font-size: 1.1rem;
}

/* ==================== Responsive ==================== */
@media (max-width: 768px) {
  .home-page {
    padding-top: 60px;
  }

  .hero-section {
    padding: 2rem 1rem;
    margin-bottom: 2rem;
  }

  .hero-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .hero-title i {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .container {
    padding: 0 1rem;
  }

  .movie-section {
    margin-bottom: 3rem;
  }

  .section-title {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }

  .section-title i {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .section-title {
    font-size: 1.2rem;
    padding-left: 0.25rem;
    border-left-width: 3px;
  }
}
</style>
