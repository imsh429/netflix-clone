// src/composables/useWishlist.ts
import { ref, computed } from 'vue'
import type { Movie } from '@/types/movie'
import { getWishlist, saveWishlist } from '@/utils/localStorage'

/**
 * 찜하기 기능을 관리하는 Composable
 * - 찜 목록 조회
 * - 찜 추가/제거
 * - 찜 여부 확인
 */
export function useWishlist() {
  // State
  const wishlist = ref<Movie[]>([])

  // Getters
  const wishlistIds = computed(() => wishlist.value.map(movie => movie.id))

  const wishlistCount = computed(() => wishlist.value.length)

  /**
   * Local Storage에서 찜 목록 로드
   */
  const loadWishlist = (): void => {
    try {
      wishlist.value = getWishlist()
    } catch (error) {
      console.error('Failed to load wishlist:', error)
      wishlist.value = []
    }
  }

  /**
   * 찜 목록 저장
   */
  const saveToStorage = (): void => {
    try {
      saveWishlist(wishlist.value)
    } catch (error) {
      console.error('Failed to save wishlist:', error)
    }
  }

  /**
   * 찜 추가/제거 토글
   * @param movie - 영화 객체
   */
  const toggleWishlist = (movie: Movie): void => {
    const index = wishlist.value.findIndex(m => m.id === movie.id)

    if (index === -1) {
      // 추가
      wishlist.value.push(movie)
    } else {
      // 제거
      wishlist.value.splice(index, 1)
    }

    saveToStorage()
  }

  /**
   * 찜 여부 확인
   * @param movieId - 영화 ID
   * @returns 찜 여부
   */
  const isInWishlist = (movieId: number): boolean => {
    return wishlist.value.some(movie => movie.id === movieId)
  }

  /**
   * 찜 추가
   * @param movie - 영화 객체
   */
  const addToWishlist = (movie: Movie): void => {
    if (!isInWishlist(movie.id)) {
      wishlist.value.push(movie)
      saveToStorage()
    }
  }

  /**
   * 찜 제거
   * @param movieId - 영화 ID
   */
  const removeFromWishlist = (movieId: number): void => {
    const index = wishlist.value.findIndex(m => m.id === movieId)
    if (index !== -1) {
      wishlist.value.splice(index, 1)
      saveToStorage()
    }
  }

  /**
   * 찜 목록 초기화
   */
  const clearWishlist = (): void => {
    wishlist.value = []
    saveToStorage()
  }

  return {
    // State
    wishlist,

    // Getters
    wishlistIds,
    wishlistCount,

    // Actions
    loadWishlist,
    toggleWishlist,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
  }
}
