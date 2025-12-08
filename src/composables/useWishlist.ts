// src/composables/useWishlist.ts
import { ref, computed } from 'vue'
import type { Movie } from '@/types/movie'
import { saveWishlist, getWishlist } from '@/utils/localStorage'

/**
 * 찜하기 기능을 위한 Custom Composable
 * 여러 컴포넌트에서 재사용 가능
 */
export function useWishlist() {
  // State
  const wishlist = ref<Movie[]>([])

  // Getters
  const wishlistIds = computed(() => wishlist.value.map(m => m.id))

  const wishlistCount = computed(() => wishlist.value.length)

  // Actions
  const loadWishlist = () => {
    wishlist.value = getWishlist()
  }

  const toggleWishlist = (movie: Movie) => {
    const index = wishlist.value.findIndex(m => m.id === movie.id)

    if (index === -1) {
      // 추가
      wishlist.value.push(movie)
    } else {
      // 제거
      wishlist.value.splice(index, 1)
    }

    // Local Storage에 저장
    saveWishlist(wishlist.value)
  }

  const addToWishlist = (movie: Movie) => {
    if (!isInWishlist(movie.id)) {
      wishlist.value.push(movie)
      saveWishlist(wishlist.value)
    }
  }

  const removeFromWishlist = (movieId: number) => {
    const index = wishlist.value.findIndex(m => m.id === movieId)
    if (index !== -1) {
      wishlist.value.splice(index, 1)
      saveWishlist(wishlist.value)
    }
  }

  const isInWishlist = (movieId: number): boolean => {
    return wishlist.value.some(m => m.id === movieId)
  }

  const clearWishlist = () => {
    wishlist.value = []
    saveWishlist([])
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
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist
  }
}
