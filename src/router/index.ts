import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/services/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/signin' // 임시로 signin으로 리다이렉트
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('@/views/SignIn.vue'),
      meta: { requiresAuth: false }
    }
  ]
})

// 네비게이션 가드 - 인증 체크
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const authenticated = isAuthenticated()

  if (requiresAuth && !authenticated) {
    // 인증이 필요한 페이지인데 로그인하지 않은 경우
    next('/signin')
  } else if (to.path === '/signin' && authenticated) {
    // 이미 로그인한 상태에서 로그인 페이지 접근 시 홈으로
    // TODO: 홈 페이지 만들면 '/'로 변경
    next('/signin') // 임시로 signin 유지
  } else {
    next()
  }
})

export default router
