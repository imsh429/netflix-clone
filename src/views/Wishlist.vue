<!-- src/views/Wishlist.vue -->
<template>
  <div class="page">
    <h1>❤️ Wishlist Page</h1>
    <p>Phase 6에서 완성 예정입니다.</p>
    <router-link to="/" class="back-link">← 홈으로</router-link>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.back-link {
  margin-top: 2rem;
  color: var(--primary-red);
  text-decoration: none;
  font-size: 1.2rem;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
