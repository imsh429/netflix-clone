<!-- src/views/Home.vue -->
<template>
  <div class="home-page">
    <header class="temp-header">
      <div class="logo">
        <i class="fas fa-film"></i>
        NETFLIX DEMO
      </div>
      <nav>
        <router-link to="/">홈</router-link>
        <router-link to="/popular">대세 콘텐츠</router-link>
        <router-link to="/search">찾아보기</router-link>
        <router-link to="/wishlist">내가 찜한 리스트</router-link>
      </nav>
      <div class="user-info">
        <span>{{ authStore.currentUser }}</span>
        <button @click="handleLogout" class="logout-btn">
          <i class="fas fa-sign-out-alt"></i>
          로그아웃
        </button>
      </div>
    </header>

    <main class="content">
      <h1>🎬 Home Page</h1>
      <p>로그인 성공! 메인 페이지입니다.</p>
      <p class="info">Phase 6에서 완성 예정입니다.</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const handleLogout = () => {
  authStore.logout()
  toast.info('로그아웃 되었습니다')
  router.push('/signin')
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--primary-black);
}

.temp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.9);
  border-bottom: 1px solid #333;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-red);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

nav {
  display: flex;
  gap: 2rem;
}

nav a {
  color: var(--text-white);
  text-decoration: none;
  transition: color 0.3s ease;
}

nav a:hover,
nav a.router-link-active {
  color: var(--primary-red);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--text-gray);
  color: var(--text-white);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  border-color: var(--primary-red);
  color: var(--primary-red);
}

.content {
  padding: 4rem 2rem;
  text-align: center;
}

.content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.info {
  color: var(--text-gray);
  margin-top: 2rem;
}
</style>
