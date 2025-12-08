// src/stores/wishlist.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Movie } from '@/types/movie'
import { saveWishlist, getWishlist, getLoginStatus } from '@/utils/localStorage'

export const useWishlistStore = defineStore('wishlist', () => {
  // State
  const wishlist = ref<Movie[]>([])

  // ✅ 추가: 현재 로그인한 사용자 ID 가져오기
  const getCurrentUserId = (): string => {
    const { userId } = getLoginStatus()
    return userId || ''
  }

  // Getters
  const wishlistIds = computed(() => wishlist.value.map(m => m.id))

  const wishlistCount = computed(() => wishlist.value.length)

  const hasWishlist = computed(() => wishlist.value.length > 0)

  // Actions
  const loadWishlist = () => {
    const userId = getCurrentUserId()
    if (userId) {
      wishlist.value = getWishlist(userId)  // ✅ userId 전달
    } else {
      wishlist.value = []
    }
  }

  const addToWishlist = (movie: Movie) => {
    const userId = getCurrentUserId()
    if (!userId) return  // ✅ 로그인 안 되어 있으면 무시

    if (!isInWishlist(movie.id)) {
      wishlist.value.push(movie)
      saveWishlist(wishlist.value, userId)  // ✅ userId 전달
    }
  }

  const removeFromWishlist = (movieId: number) => {
    const userId = getCurrentUserId()
    if (!userId) return  // ✅ 로그인 안 되어 있으면 무시

    const index = wishlist.value.findIndex(m => m.id === movieId)
    if (index !== -1) {
      wishlist.value.splice(index, 1)
      saveWishlist(wishlist.value, userId)  // ✅ userId 전달
    }
  }

  const toggleWishlist = (movie: Movie) => {
    const userId = getCurrentUserId()
    if (!userId) return  // ✅ 로그인 안 되어 있으면 무시

    const index = wishlist.value.findIndex(m => m.id === movie.id)

    if (index === -1) {
      wishlist.value.push(movie)
    } else {
      wishlist.value.splice(index, 1)
    }

    saveWishlist(wishlist.value, userId)  // ✅ userId 전달
  }

  const isInWishlist = (movieId: number): boolean => {
    return wishlist.value.some(m => m.id === movieId)
  }

  const clearWishlist = () => {
    const userId = getCurrentUserId()
    wishlist.value = []
    if (userId) {
      saveWishlist([], userId)  // ✅ userId 전달
    }
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
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist
  }
})
