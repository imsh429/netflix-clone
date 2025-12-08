// src/stores/movie.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Movie, Genre } from '@/types/movie'
import {
  fetchPopularMovies,
  fetchNowPlayingMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchGenres,
  searchMovies,
  discoverMovies,
  type DiscoverFilters
} from '@/services/tmdb'

export const useMovieStore = defineStore('movie', () => {
  // State
  const popularMovies = ref<Movie[]>([])
  const nowPlayingMovies = ref<Movie[]>([])
  const topRatedMovies = ref<Movie[]>([])
  const upcomingMovies = ref<Movie[]>([])
  const searchResults = ref<Movie[]>([])
  const genres = ref<Genre[]>([])

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const allMovies = computed(() => [
    ...popularMovies.value,
    ...nowPlayingMovies.value,
    ...topRatedMovies.value,
    ...upcomingMovies.value
  ])

  const hasGenres = computed(() => genres.value.length > 0)

  // Actions
  const loadPopularMovies = async (page = 1) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await fetchPopularMovies(page)
      popularMovies.value = data.results
      return data
    } catch (e) {
      error.value = '인기 영화를 불러오는데 실패했습니다'
      console.error('Load popular movies error:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const loadNowPlayingMovies = async (page = 1) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await fetchNowPlayingMovies(page)
      nowPlayingMovies.value = data.results
      return data
    } catch (e) {
      error.value = '현재 상영작을 불러오는데 실패했습니다'
      console.error('Load now playing movies error:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const loadTopRatedMovies = async (page = 1) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await fetchTopRatedMovies(page)
      topRatedMovies.value = data.results
      return data
    } catch (e) {
      error.value = '최고 평점 영화를 불러오는데 실패했습니다'
      console.error('Load top rated movies error:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const loadUpcomingMovies = async (page = 1) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await fetchUpcomingMovies(page)
      upcomingMovies.value = data.results
      return data
    } catch (e) {
      error.value = '개봉 예정 영화를 불러오는데 실패했습니다'
      console.error('Load upcoming movies error:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const loadGenres = async () => {
    if (genres.value.length > 0) {
      return genres.value // 이미 로드됨
    }

    isLoading.value = true
    error.value = null

    try {
      const data = await fetchGenres()
      genres.value = data.genres
      return data.genres
    } catch (e) {
      error.value = '장르 목록을 불러오는데 실패했습니다'
      console.error('Load genres error:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const searchMoviesByQuery = async (query: string, page = 1) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await searchMovies(query, page)
      searchResults.value = data.results
      return data
    } catch (e) {
      error.value = '영화 검색에 실패했습니다'
      console.error('Search movies error:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const discoverMoviesWithFilters = async (filters: DiscoverFilters) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await discoverMovies(filters)
      return data
    } catch (e) {
      error.value = '영화 필터링에 실패했습니다'
      console.error('Discover movies error:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const getGenreName = (genreId: number): string => {
    const genre = genres.value.find(g => g.id === genreId)
    return genre ? genre.name : ''
  }

  const clearSearchResults = () => {
    searchResults.value = []
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    popularMovies,
    nowPlayingMovies,
    topRatedMovies,
    upcomingMovies,
    searchResults,
    genres,
    isLoading,
    error,

    // Getters
    allMovies,
    hasGenres,

    // Actions
    loadPopularMovies,
    loadNowPlayingMovies,
    loadTopRatedMovies,
    loadUpcomingMovies,
    loadGenres,
    searchMoviesByQuery,
    discoverMoviesWithFilters,
    getGenreName,
    clearSearchResults,
    clearError
  }
})
