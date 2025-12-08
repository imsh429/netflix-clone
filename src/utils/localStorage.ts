// src/utils/localStorage.ts
import type { User, Movie, LoginStatus } from '@/types/movie'

// ==================== 1. 사용자 정보 ====================

export const saveUser = (user: User): void => {
  const users = getUsers()
  const existingIndex = users.findIndex(u => u.id === user.id)

  if (existingIndex !== -1) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }

  localStorage.setItem('users', JSON.stringify(users))
}

export const getUsers = (): User[] => {
  const data = localStorage.getItem('users')
  return data ? JSON.parse(data) : []
}

export const findUser = (email: string, password: string): User | undefined => {
  const users = getUsers()
  return users.find(u => u.id === email && u.password === password)
}

// ==================== 2. 로그인 상태 ====================

export const saveLoginStatus = (keepLogin: boolean, userId?: string): void => {
  if (keepLogin) {
    // 체크함: localStorage (영구 저장)
    localStorage.setItem('isLoggedIn', 'true')
    if (userId) localStorage.setItem('currentUser', userId)
  } else {
    // 체크 안 함: sessionStorage (브라우저 닫으면 삭제)
    sessionStorage.setItem('isLoggedIn', 'true')
    if (userId) sessionStorage.setItem('currentUser', userId)
  }
}

// ✅ 수정 - localStorage와 sessionStorage 모두 확인
export const getLoginStatus = (): LoginStatus => {
  const isLoggedInLocal = localStorage.getItem('isLoggedIn') === 'true'
  const isLoggedInSession = sessionStorage.getItem('isLoggedIn') === 'true'

  const userIdLocal = localStorage.getItem('currentUser')
  const userIdSession = sessionStorage.getItem('currentUser')

  return {
    isLoggedIn: isLoggedInLocal || isLoggedInSession,
    userId: userIdLocal || userIdSession
  }
}

export const clearLoginStatus = (): void => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('currentUser')
  localStorage.removeItem('TMDb-Key')

  sessionStorage.removeItem('isLoggedIn')
  sessionStorage.removeItem('currentUser')
}

// ==================== 3. 찜한 영화 ====================
const getWishlistKey = (userId: string): string => {
  return `movieWishlist_${userId}`
}

export const saveWishlist = (movies: Movie[], userId: string): void => {
  const key = getWishlistKey(userId)
  localStorage.setItem(key, JSON.stringify(movies))
}

export const getWishlist = (userId: string): Movie[] => {
  const key = getWishlistKey(userId)
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

export const addToWishlist = (movie: Movie, userId: string): void => {
  const wishlist = getWishlist(userId)
  if (!wishlist.some(m => m.id === movie.id)) {
    wishlist.push(movie)
    saveWishlist(wishlist, userId)
  }
}

export const removeFromWishlist = (movieId: number, userId: string): void => {
  const wishlist = getWishlist(userId)
  const filtered = wishlist.filter(m => m.id !== movieId)
  saveWishlist(filtered, userId)
}

export const clearWishlist = (userId: string): void => {
  const key = getWishlistKey(userId)
  localStorage.removeItem(key)
}

// ==================== 4. 최근 검색어 (추가 점수) ====================
const getSearchHistoryKey = (userId: string): string => {
  return `searchHistory_${userId}`
}

export const saveSearchHistory = (query: string, userId: string): void => {
  if (!query.trim()) return

  const history = getSearchHistory(userId)
  const filtered = history.filter(q => q !== query)
  filtered.unshift(query)
  const limited = filtered.slice(0, 10)

  const key = getSearchHistoryKey(userId)
  localStorage.setItem(key, JSON.stringify(limited))
}

export const getSearchHistory = (userId: string): string[] => {
  const key = getSearchHistoryKey(userId)
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}


export const clearSearchHistory = (userId: string): void => {
  const key = getSearchHistoryKey(userId)
  localStorage.removeItem(key)
}

// ==================== 5. TMDB API 키 저장 ====================

export const saveApiKey = (apiKey: string): void => {
  localStorage.setItem('TMDb-Key', apiKey)
}

export const getApiKey = (): string | null => {
  return localStorage.getItem('TMDb-Key')
}
