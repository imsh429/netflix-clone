// src/composables/useAuth.ts
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

/**
 * 인증 관련 로직을 위한 Custom Composable
 * 여러 컴포넌트에서 재사용 가능
 */
export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const toast = useToast()

  // Getters
  const isLoggedIn = computed(() => authStore.isLoggedIn)
  const currentUser = computed(() => authStore.currentUser)
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  // Actions
  const login = async (email: string, password: string, keepLogin: boolean) => {
    try {
      const result = await authStore.login(email, password, keepLogin)

      if (result.success) {
        toast.success(result.message, {
          timeout: 2000,
          icon: '🎉'
        })
        return true
      } else {
        toast.error(result.message)
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('로그인 중 오류가 발생했습니다')
      return false
    }
  }

  const register = async (email: string, password: string, passwordConfirm: string) => {
    try {
      const result = await authStore.register(email, password, passwordConfirm)

      if (result.success) {
        toast.success(result.message, {
          timeout: 2000,
          icon: '✅'
        })
        return true
      } else {
        toast.error(result.message)
        return false
      }
    } catch (error) {
      console.error('Register error:', error)
      toast.error('회원가입 중 오류가 발생했습니다')
      return false
    }
  }

  const logout = async () => {
    authStore.logout()
    toast.info('로그아웃 되었습니다')
    await router.push('/signin')
  }

  const requireAuth = () => {
    if (!isLoggedIn.value) {
      toast.warning('로그인이 필요합니다')
      router.push('/signin')
      return false
    }
    return true
  }

  return {
    // State
    isLoggedIn,
    currentUser,
    isAuthenticated,

    // Actions
    login,
    register,
    logout,
    requireAuth
  }
}
