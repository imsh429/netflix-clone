// src/services/tmdb.ts
import axios from 'axios'
import type { MovieResponse, GenresResponse, Movie } from '@/types/movie'

// Local Storage에서 API 키 가져오기
const getApiKey = (): string => {
  return localStorage.getItem('TMDb-Key') || ''
}

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'

// Axios 인스턴스 생성
const tmdbClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  params: {
    language: 'ko-KR'
  }
})

// Request Interceptor - API 키 자동 추가
tmdbClient.interceptors.request.use(
  (config) => {
    const apiKey = getApiKey()
    if (apiKey) {
      config.params = {
        ...config.params,
        api_key: apiKey
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor - 에러 처리
tmdbClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('TMDB API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// ==================== 1. 인기 영화 (필수) ====================
export const fetchPopularMovies = async (page = 1): Promise<MovieResponse> => {
  const response = await tmdbClient.get('/movie/popular', {
    params: { page }
  })
  return response.data
}

// ==================== 2. 현재 상영작 (필수) ====================
export const fetchNowPlayingMovies = async (page = 1): Promise<MovieResponse> => {
  const response = await tmdbClient.get('/movie/now_playing', {
    params: { page }
  })
  return response.data
}

// ==================== 3. 최고 평점 (필수) ====================
export const fetchTopRatedMovies = async (page = 1): Promise<MovieResponse> => {
  const response = await tmdbClient.get('/movie/top_rated', {
    params: { page }
  })
  return response.data
}

// ==================== 4. 개봉 예정 (필수) ====================
export const fetchUpcomingMovies = async (page = 1): Promise<MovieResponse> => {
  const response = await tmdbClient.get('/movie/upcoming', {
    params: { page }
  })
  return response.data
}

// ==================== 5. 영화 검색 ====================
export const searchMovies = async (query: string, page = 1): Promise<MovieResponse> => {
  const response = await tmdbClient.get('/search/movie', {
    params: { query, page }
  })
  return response.data
}

// ==================== 6. 장르별 영화 ====================
export const fetchMoviesByGenre = async (
  genreId: number,
  page = 1,
  sortBy = 'popularity.desc'
): Promise<MovieResponse> => {
  const response = await tmdbClient.get('/discover/movie', {
    params: {
      with_genres: genreId,
      page,
      sort_by: sortBy
    }
  })
  return response.data
}

// ==================== 7. 장르 목록 ====================
export const fetchGenres = async (): Promise<GenresResponse> => {
  const response = await tmdbClient.get('/genre/movie/list')
  return response.data
}

// ==================== 8. 영화 상세 정보 ====================
export const fetchMovieDetails = async (movieId: number): Promise<Movie> => {
  const response = await tmdbClient.get(`/movie/${movieId}`)
  return response.data
}

// ==================== 9. 다중 필터링 (Discover API) ====================
export interface DiscoverFilters {
  sortBy?: string
  withGenres?: number[]
  voteAverageGte?: number
  voteAverageLte?: number
  releaseDateGte?: string
  releaseDateLte?: string
  page?: number
}

export const discoverMovies = async (filters: DiscoverFilters): Promise<MovieResponse> => {
  const params: any = {
    page: filters.page || 1,
    sort_by: filters.sortBy || 'popularity.desc'
  }

  if (filters.withGenres && filters.withGenres.length > 0) {
    params.with_genres = filters.withGenres.join(',')
  }

  if (filters.voteAverageGte !== undefined) {
    params['vote_average.gte'] = filters.voteAverageGte
  }

  if (filters.voteAverageLte !== undefined) {
    params['vote_average.lte'] = filters.voteAverageLte
  }

  if (filters.releaseDateGte) {
    params['release_date.gte'] = filters.releaseDateGte
  }

  if (filters.releaseDateLte) {
    params['release_date.lte'] = filters.releaseDateLte
  }

  const response = await tmdbClient.get('/discover/movie', { params })
  return response.data
}

// ==================== 이미지 URL 생성 ====================
export const getImageUrl = (path: string | null, size: 'w200' | 'w300' | 'w500' | 'original' = 'w500'): string => {
  if (!path) {
    return 'https://via.placeholder.com/500x750/1a1a1a/666666?text=No+Image' // placeholder 이미지
  }
  return `${IMAGE_BASE_URL}/${size}${path}`
}

export const getPosterUrl = (path: string | null): string => {
  return getImageUrl(path, 'w500')
}

export const getBackdropUrl = (path: string | null): string => {
  return getImageUrl(path, 'original')
}

export const getThumbnailUrl = (path: string | null): string => {
  return getImageUrl(path, 'w200')
}
