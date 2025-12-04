// src/stores/wishlist.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Movie } from '@/types/movie'
import { saveWishlist, getWishlist } from '@/utils/localStorage'

export const useWishlistStore = defineStore('wishlist', () => {
  // State
  const wishlist = ref<Movie[]>([])

  // Getters
  const wishlistIds = computed(() => wishlist.value.map(m => m.id))

  const wishlistCount = computed(() => wishlist.value.length)

  const hasWishlist = computed(() => wishlist.value.length > 0)

  // Actions
  const loadWishlist = () => {
    wishlist.value = getWishlist()
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

  const toggleWishlist = (movie: Movie) => {
    const index = wishlist.value.findIndex(m => m.id === movie.id)

    if (index === -1) {
      wishlist.value.push(movie)
    } else {
      wishlist.value.splice(index, 1)
    }

    saveWishlist(wishlist.value)
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
