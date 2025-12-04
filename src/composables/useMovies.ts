// src/composables/useMovies.ts
import { ref } from 'vue'
import type { Movie } from '@/types/movie'

/**
 * 영화 데이터 로딩을 위한 Custom Composable
 * API 호출 상태 관리 및 에러 처리
 */
export function useMovies() {
  // State
  const movies = ref<Movie[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const loadMovies = async (
    fetchFunction: (page: number) => Promise<any>,
    page = 1
  ) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await fetchFunction(page)
      movies.value = data.results || []
      return data
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : '영화를 불러오는데 실패했습니다'
      error.value = errorMessage
      console.error('Load movies error:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const appendMovies = (newMovies: Movie[]) => {
    movies.value.push(...newMovies)
  }

  const prependMovies = (newMovies: Movie[]) => {
    movies.value.unshift(...newMovies)
  }

  const clearMovies = () => {
    movies.value = []
    error.value = null
  }

  const removeMovie = (movieId: number) => {
    const index = movies.value.findIndex(m => m.id === movieId)
    if (index !== -1) {
      movies.value.splice(index, 1)
    }
  }

  const setMovies = (newMovies: Movie[]) => {
    movies.value = newMovies
  }

  return {
    // State
    movies,
    isLoading,
    error,

    // Actions
    loadMovies,
    appendMovies,
    prependMovies,
    clearMovies,
    removeMovie,
    setMovies
  }
}
