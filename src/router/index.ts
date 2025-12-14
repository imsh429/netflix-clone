// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router'
import { getLoginStatus } from '@/utils/localStorage'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signin',
      name: 'SignIn',
      component: () => import('@/views/SignIn.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/popular',
      name: 'Popular',
      component: () => import('@/views/Popular.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('@/views/Search.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/wishlist',
      name: 'Wishlist',
      component: () => import('@/views/Wishlist.vue'),
      meta: { requiresAuth: true }
    },
    {
      // 404 페이지
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// 인증 가드 (Navigation Guard)
router.beforeEach((to, from, next) => {
  const { isLoggedIn } = getLoginStatus()

  // 인증이 필요한 페이지인데 로그인 안 됨
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/signin')
  }
  // 로그인 페이지인데 이미 로그인 됨
  else if (to.path === '/signin' && isLoggedIn) {
    next('/')
  }
  // 정상 진행
  else {
    next()
  }
})

export default router
