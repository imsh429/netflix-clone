// src/services/tmdb.ts
import axios from 'axios'
import type { MovieResponse, GenresResponse } from '@/types/movie'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'

// API 클라이언트 생성
const tmdbClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'ko-KR'
  },
  timeout: 10000 // 10초 타임아웃
})

// 동적으로 API 키 가져오기 (로그인 시 저장된 키 우선 사용)
const getApiKey = (): string => {
  const storedKey = localStorage.getItem('TMDb-Key')
  return storedKey || API_KEY || ''
}

// API 요청 인터셉터 - 동적으로 API 키 설정
tmdbClient.interceptors.request.use(config => {
  const apiKey = getApiKey()
  if (config.params) {
    config.params.api_key = apiKey
  } else {
    config.params = { api_key: apiKey }
  }
  return config
})

// ==================== 1. 인기 영화 (Popular) ====================
export const fetchPopularMovies = async (page = 1): Promise<MovieResponse> => {
  const response = await tmdbClient.get('/movie/popular', {
    params: { page }
  })
  return response.data
}

// ==================== 2. 현재 상영작 (Now Playing) ====================
export const fetchNowPlayingMovies = async (page = 1): Promise<MovieResponse> => {
  const response = await tmdbClient.get('/movie/now_playing', {
    params: { page }
  })
  return response.data
}

// ==================== 3. 최고 평점 (Top Rated) ====================
export const fetchTopRatedMovies = async (page = 1): Promise<MovieResponse> => {
  const response = await tmdbClient.get('/movie/top_rated', {
    params: { page }
  })
  return response.data
}

// ==================== 4. 개봉 예정 (Upcoming) ====================
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

// ==================== 6. 장르별 영화 (Discover) ====================
export const fetchMoviesByGenre = async (
  genreId: number,
  page = 1,
  sortBy = 'popularity.desc'
): Promise<MovieResponse> => {
  const response = await tmdbClient.get('/discover/movie', {
    params: {
      with_genres: genreId,
      sort_by: sortBy,
      page
    }
  })
  return response.data
}

// ==================== 7. 장르 목록 ====================
export const fetchGenres = async (): Promise<GenresResponse> => {
  const response = await tmdbClient.get('/genre/movie/list')
  return response.data
}

// ==================== 8. 영화 상세 정보 (Optional) ====================
export const fetchMovieDetails = async (movieId: number) => {
  const response = await tmdbClient.get(`/movie/${movieId}`)
  return response.data
}

// ==================== 이미지 URL 생성 ====================
/**
 * TMDB 이미지 경로를 전체 URL로 변환
 * @param path - 이미지 경로 (예: /abc123.jpg)
 * @param size - 이미지 크기 (w92, w154, w185, w342, w500, w780, original)
 * @returns 전체 이미지 URL
 */
export const getImageUrl = (path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string => {
  if (!path) {
    return '/placeholder.jpg' // 기본 이미지
  }
  return `${IMAGE_BASE_URL}/${size}${path}`
}

/**
 * 포스터 이미지 URL
 */
export const getPosterUrl = (path: string | null): string => {
  return getImageUrl(path, 'w500')
}

/**
 * 배경 이미지 URL
 */
export const getBackdropUrl = (path: string | null): string => {
  return getImageUrl(path, 'w780')
}

/**
 * 썸네일 이미지 URL
 */
export const getThumbnailUrl = (path: string | null): string => {
  return getImageUrl(path, 'w185')
}

// ==================== 에러 핸들링 ====================
export const handleTmdbError = (error: any): string => {
  if (error.response) {
    // 서버 응답이 있는 경우
    const status = error.response.status

    switch (status) {
      case 401:
        return '유효하지 않은 API 키입니다'
      case 404:
        return '요청한 데이터를 찾을 수 없습니다'
      case 429:
        return '요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요'
      default:
        return '영화 정보를 불러오는데 실패했습니다'
    }
  } else if (error.request) {
    // 요청은 보냈지만 응답을 받지 못한 경우
    return '서버에 연결할 수 없습니다. 네트워크를 확인해주세요'
  } else {
    // 요청 설정 중 에러
    return '요청 중 오류가 발생했습니다'
  }
}

// ==================== API 상태 확인 ====================
export const checkApiConnection = async (): Promise<boolean> => {
  try {
    await fetchPopularMovies(1)
    return true
  } catch (error) {
    console.error('TMDB API connection failed:', error)
    return false
  }
}
