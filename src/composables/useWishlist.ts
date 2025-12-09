// src/composables/useWishlist.ts
import { ref, computed } from 'vue'
import type { Movie } from '@/types/movie'
import { saveWishlist, getWishlist, getLoginStatus } from '@/utils/localStorage'

/**
 * 찜하기 기능을 위한 Custom Composable
 * 여러 컴포넌트에서 재사용 가능
 */
export function useWishlist() {

  const getCurrentUserId = (): string | null => {
    const { userId } = getLoginStatus()
    return userId || null
  }

  // State
  const wishlist = ref<Movie[]>([])

  // Getters
  const wishlistIds = computed(() => wishlist.value.map(m => m.id))
  const wishlistCount = computed(() => wishlist.value.length)
  const hasWishlist = computed(() => wishlist.value.length > 0)

  // Actions
  const loadWishlist = () => {
    const userId = getCurrentUserId()
    if (!userId) {
      console.warn('No user logged in, cannot load wishlist')
      wishlist.value = []
      return
    }

    wishlist.value = getWishlist(userId)  // ✅ 추가!
  }

  const toggleWishlist = (movie: Movie) => {  // ✅ 별도 함수로 분리
    const userId = getCurrentUserId()  // ✅ userId 체크 추가
    if (!userId) {
      console.warn('No user logged in, cannot toggle wishlist')
      return
    }

    const index = wishlist.value.findIndex(m => m.id === movie.id)

    if (index === -1) {
      wishlist.value.push(movie)
    } else {
      wishlist.value.splice(index, 1)
    }

    saveWishlist(wishlist.value, userId)
  }

  const addToWishlist = (movie: Movie) => {
    const userId = getCurrentUserId()
    if (!userId) {
      console.warn('No user logged in, cannot add to wishlist')
      return
    }

    if (!isInWishlist(movie.id)) {
      wishlist.value.push(movie)
      saveWishlist(wishlist.value, userId)
    }
  }

  const removeFromWishlist = (movieId: number) => {
    const userId = getCurrentUserId()
    if (!userId) {
      console.warn('No user logged in, cannot remove from wishlist')
      return
    }

    const index = wishlist.value.findIndex(m => m.id === movieId)
    if (index !== -1) {
      wishlist.value.splice(index, 1)
      saveWishlist(wishlist.value, userId)
    }
  }

  const isInWishlist = (movieId: number): boolean => {
    return wishlist.value.some(m => m.id === movieId)
  }

  const clearWishlist = () => {
    const userId = getCurrentUserId()
    if (!userId) {
      console.warn('No user logged in, cannot clear wishlist')
      return
    }
    wishlist.value = []
    saveWishlist([], userId)
  }

  return {
    // State
    wishlist,

    // Getters
    wishlistIds,
    wishlistCount,
    hasWishlist,

    // Actions
    loadWishlist,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist
  }
}
