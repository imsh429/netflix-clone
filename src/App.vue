<template>
  <div id="app">
    <!-- 로그인 상태일 때만 Header 표시 -->
    <Header v-if="authStore.isLoggedIn" />

    <!-- 페이지 컨텐츠 -->
    <main :class="{ 'with-header': authStore.isLoggedIn }">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Header from '@/components/common/Header.vue'

const authStore = useAuthStore()
</script>

<style>
/* 전역 스타일 리셋 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
  sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  min-height: 100vh;
  background-color: #141414;
  color: #fff;
}

main {
  width: 100%;
  min-height: 100vh;
}

main.with-header {
  padding-top: 70px; /* Header 높이만큼 여백 */
}

/* 스크롤바 스타일 (Netflix 스타일) */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #141414;
}

::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: #888;
}

/* 링크 기본 스타일 */
a {
  text-decoration: none;
  color: inherit;
}

/* 버튼 기본 스타일 */
button {
  font-family: inherit;
}
</style><template>
  <div id="app">
    <!-- 로그인 상태일 때만 Header 표시 -->
    <Header v-if="authStore.isLoggedIn" />

    <!-- 페이지 컨텐츠 -->
    <main :class="{ 'with-header': authStore.isLoggedIn }">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Header from '@/components/common/Header.vue'

const authStore = useAuthStore()
</script>

<style>
/* 전역 스타일 리셋 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
  sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  min-height: 100vh;
  background-color: #141414;
  color: #fff;
}

main {
  width: 100%;
  min-height: 100vh;
}

main.with-header {
  padding-top: 70px; /* Header 높이만큼 여백 */
}

/* 스크롤바 스타일 (Netflix 스타일) */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #141414;
}

::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: #888;
}

/* 링크 기본 스타일 */
a {
  text-decoration: none;
  color: inherit;
}

/* 버튼 기본 스타일 */
button {
  font-family: inherit;
}
</style>
