<!-- src/components/common/AppHeader.vue -->
<template>
  <header
    class="app-header"
    :class="{ 'scrolled': isScrolled }"
  >
    <div class="header-content">
      <!-- 로고 -->
      <div class="logo" @click="router.push('/')">
        <i class="fas fa-film"></i>
        <span>NETFLIX DEMO</span>
      </div>

      <!-- 네비게이션 메뉴 -->
      <nav class="nav-menu">
        <router-link to="/" class="nav-link">
          <i class="fas fa-home"></i>
          <span>홈</span>
        </router-link>
        <router-link to="/popular" class="nav-link">
          <i class="fas fa-fire"></i>
          <span>대세 콘텐츠</span>
        </router-link>
        <router-link to="/search" class="nav-link">
          <i class="fas fa-search"></i>
          <span>찾아보기</span>
        </router-link>
        <router-link to="/wishlist" class="nav-link">
          <i class="fas fa-heart"></i>
          <span>내가 찜한 리스트</span>
        </router-link>
      </nav>

      <!-- 사용자 정보 -->
      <div v-if="isLoggedIn" class="user-section">
        <div class="user-info">
          <i class="fas fa-user-circle"></i>
          <span class="user-email">{{ currentUser }}</span>
        </div>
        <button @click="handleLogout" class="logout-btn">
          <i class="fas fa-sign-out-alt"></i>
          <span>로그아웃</span>
        </button>
      </div>

      <!-- 모바일 메뉴 토글 -->
      <button class="mobile-menu-toggle" @click="toggleMobileMenu">
        <i :class="isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
      </button>
    </div>

    <!-- 모바일 메뉴 -->
    <Transition name="slide-down">
      <nav v-if="isMobileMenuOpen" class="mobile-nav">
        <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">
          <i class="fas fa-home"></i>
          <span>홈</span>
        </router-link>
        <router-link to="/popular" class="mobile-nav-link" @click="closeMobileMenu">
          <i class="fas fa-fire"></i>
          <span>대세 콘텐츠</span>
        </router-link>
        <router-link to="/search" class="mobile-nav-link" @click="closeMobileMenu">
          <i class="fas fa-search"></i>
          <span>찾아보기</span>
        </router-link>
        <router-link to="/wishlist" class="mobile-nav-link" @click="closeMobileMenu">
          <i class="fas fa-heart"></i>
          <span>내가 찜한 리스트</span>
        </router-link>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// State
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

// Getters
const isLoggedIn = computed(() => authStore.isLoggedIn)
const currentUser = computed(() => authStore.currentUser)

// Scroll Handler - 스크롤 시 헤더 스타일 변경 (필수!)
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// Logout Handler
const handleLogout = () => {
  authStore.logout()
  toast.info('로그아웃 되었습니다')
  router.push('/signin')
}

// Mobile Menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* ==================== Header ==================== */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: transparent;
  transition: all 0.3s ease;
  padding: 0;
}

/* 스크롤 시 애니메이션 (필수!) */
.app-header.scrolled {
  background: rgba(0, 0, 0, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

/* ==================== Logo ==================== */
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-red);
  cursor: pointer;
  transition: transform 0.3s ease;
  user-select: none;
}

.logo span {
  white-space: nowrap;
}

.logo:hover {
  transform: scale(1.05);
}

.logo i {
  font-size: 1.8rem;
}

/* ==================== Navigation ==================== */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-white);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
  padding: 0.5rem 0;
}

.nav-link span {
  white-space: nowrap;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-red);
  transition: width 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary-red);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.nav-link i {
  font-size: 1.1rem;
}

/* ==================== User Section ==================== */
.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-white);
  font-size: 0.95rem;
}

.user-info i {
  font-size: 1.5rem;
  color: var(--primary-red);
}

.user-email {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--text-gray);
  color: var(--text-white);
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  border-color: var(--primary-red);
  color: var(--primary-red);
  transform: translateY(-2px);
}

/* ==================== Mobile Menu ==================== */
.mobile-menu-toggle {
  display: none;
  background: transparent;
  border: none;
  color: var(--text-white);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-nav {
  background: rgba(0, 0, 0, 0.98);
  padding: 1rem;
  border-top: 1px solid #333;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: var(--text-white);
  text-decoration: none;
  font-size: 1.1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  background: rgba(229, 9, 20, 0.1);
  color: var(--primary-red);
}

.mobile-nav-link i {
  font-size: 1.3rem;
  width: 24px;
  text-align: center;
}

/* Mobile Menu Animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* ==================== Responsive ==================== */
/* 중간 크기 (769px ~ 1024px) */
@media (min-width: 769px) and (max-width: 1024px) {
  .logo {
    font-size: 1.3rem;  /* 폰트 크기 축소 */
  }

  .logo span {
    white-space: nowrap;  /* 줄바꿈 방지 */
  }

  .nav-link span {
    display: none;
  }

  .nav-link {
    gap: 0;
  }

  .nav-menu {
    gap: 1.5rem;
  }

  .user-section {
    gap: 0.5rem;
  }

  .logout-btn span {
    display: none;
  }

  .logout-btn {
    padding: 0.5rem;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
  }

  .nav-menu {
    display: none;
  }

  .user-section {
    display: none;
  }

  .mobile-menu-toggle {
    display: block;
  }

  .logo span {
    display: none;
  }

  .logo {
    font-size: 1.2rem;
  }

  .logo i {
    font-size: 1.5rem;
  }
}

@media (min-width: 769px) {
  .mobile-nav {
    display: none !important;
  }
}

@media (max-width: 480px) {
  .user-email {
    max-width: 100px;
  }
}
</style>
