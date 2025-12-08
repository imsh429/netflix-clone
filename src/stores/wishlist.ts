// src/stores/wishlist.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Movie } from '@/types/movie'
import {
  saveWishlist,
  getWishlist,
  getLoginStatus
} from '@/utils/localStorage'

export const useWishlistStore = defineStore('wishlist', () => {
  // ==================== Helper Functions ====================

  // 현재 로그인된 사용자 ID 가져오기
  const getCurrentUserId = (): string | null => {
    const { currentUser } = getLoginStatus()
    return currentUser
  }

  // ==================== State ====================

  const wishlist = ref<Movie[]>([])

  // ==================== Getters ====================

  const wishlistIds = computed(() => wishlist.value.map(m => m.id))

  const wishlistCount = computed(() => wishlist.value.length)

  const hasWishlist = computed(() => wishlist.value.length > 0)

  // ==================== Actions ====================

  const loadWishlist = () => {
    const userId = getCurrentUserId()
    if (!userId) {
      console.warn('No user logged in, cannot load wishlist')
      wishlist.value = []
      return
    }

    wishlist.value = getWishlist(userId)
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

  const toggleWishlist = (movie: Movie) => {
    const userId = getCurrentUserId()
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
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist
  }
})
