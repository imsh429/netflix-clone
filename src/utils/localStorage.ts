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
  localStorage.setItem('isLoggedIn', keepLogin.toString())
  if (userId) {
    localStorage.setItem('currentUser', userId)
  }
}

export const getLoginStatus = (): LoginStatus => {
  return {
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    userId: localStorage.getItem('currentUser')
  }
}

export const clearLoginStatus = (): void => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('currentUser')
  localStorage.removeItem('TMDb-Key')
}

// ==================== 3. 찜한 영화 ====================

export const saveWishlist = (movies: Movie[]): void => {
  localStorage.setItem('movieWishlist', JSON.stringify(movies))
}

export const getWishlist = (): Movie[] => {
  const data = localStorage.getItem('movieWishlist')
  return data ? JSON.parse(data) : []
}

export const addToWishlist = (movie: Movie): void => {
  const wishlist = getWishlist()
  if (!wishlist.some(m => m.id === movie.id)) {
    wishlist.push(movie)
    saveWishlist(wishlist)
  }
}

export const removeFromWishlist = (movieId: number): void => {
  const wishlist = getWishlist()
  const filtered = wishlist.filter(m => m.id !== movieId)
  saveWishlist(filtered)
}

// ==================== 4. 최근 검색어 (추가 점수) ====================

export const saveSearchHistory = (query: string): void => {
  if (!query.trim()) return

  const history = getSearchHistory()
  // 중복 제거
  const filtered = history.filter(q => q !== query)
  // 최신 검색어를 맨 앞에 추가
  filtered.unshift(query)
  // 최대 10개까지만 저장
  const limited = filtered.slice(0, 10)

  localStorage.setItem('searchHistory', JSON.stringify(limited))
}

export const getSearchHistory = (): string[] => {
  const data = localStorage.getItem('searchHistory')
  return data ? JSON.parse(data) : []
}

export const clearSearchHistory = (): void => {
  localStorage.removeItem('searchHistory')
}

// ==================== 5. TMDB API 키 저장 ====================

export const saveApiKey = (apiKey: string): void => {
  localStorage.setItem('TMDb-Key', apiKey)
}

export const getApiKey = (): string | null => {
  return localStorage.getItem('TMDb-Key')
}
