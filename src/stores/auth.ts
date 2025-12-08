// src/stores/auth.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getLoginStatus, getApiKey } from '@/utils/localStorage'
import { login as loginService, register as registerService, logout as logoutService } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const isLoggedIn = ref(false)
  const currentUser = ref<string | null>(null)
  const apiKey = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => isLoggedIn.value)
  const getUserEmail = computed(() => currentUser.value)

  // Actions
  const initAuth = () => {
    const loginStatus = getLoginStatus()
    isLoggedIn.value = loginStatus.isLoggedIn
    currentUser.value = loginStatus.userId
    apiKey.value = getApiKey()
  }

  const login = async (email: string, password: string, keepLogin: boolean) => {
    const result = await loginService(email, password, keepLogin)

    if (result.success) {
      isLoggedIn.value = true
      currentUser.value = email
      apiKey.value = password
    }

    return result
  }

  const register = async (email: string, password: string, passwordConfirm: string) => {
    return await registerService(email, password, passwordConfirm)
  }

  const logout = () => {
    logoutService()
    isLoggedIn.value = false
    currentUser.value = null
    apiKey.value = null
  }

  return {
    // State
    isLoggedIn,
    currentUser,
    apiKey,
    // Getters
    isAuthenticated,
    getUserEmail,
    // Actions
    initAuth,
    login,
    register,
    logout
  }
})
