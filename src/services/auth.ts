// src/services/auth.ts
import axios from 'axios'
import type { User } from '@/types/movie'
import {
  saveUser,
  findUser,
  saveLoginStatus,
  clearLoginStatus,
  saveApiKey
} from '@/utils/localStorage'

const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3'

/**
 * TMDB API 키 유효성 검증
 * 실제 API를 호출하여 키가 유효한지 확인
 */
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: apiKey,
        language: 'ko-KR',
        page: 1
      },
      timeout: 5000 // 5초 타임아웃
    })

    return response.status === 200 && response.data.results
  } catch (error) {
    console.error('API Key validation failed:', error)
    return false
  }
}

/**
 * 로그인 처리
 */
export const login = async (
  email: string,
  password: string,
  keepLogin: boolean
): Promise<{ success: boolean; message: string }> => {
  try {
    // 1. API 키 유효성 검증 (중요!)
    const isValidKey = await validateApiKey(password)

    if (!isValidKey) {
      return {
        success: false,
        message: '유효하지 않은 TMDB API 키입니다'
      }
    }

    // 2. 사용자 찾기
    const user = findUser(email, password)

    if (!user) {
      return {
        success: false,
        message: '등록되지 않은 사용자입니다. 회원가입을 먼저 진행해주세요.'
      }
    }

    // 3. 로그인 상태 저장
    saveLoginStatus(keepLogin, user.id)
    saveApiKey(password)

    return {
      success: true,
      message: '로그인 성공!'
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      message: '로그인 중 오류가 발생했습니다'
    }
  }
}

/**
 * 회원가입 처리
 */
export const register = async (
  email: string,
  password: string,
  passwordConfirm: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // 1. 비밀번호 확인
    if (password !== passwordConfirm) {
      return {
        success: false,
        message: '비밀번호가 일치하지 않습니다'
      }
    }

    // 2. API 키 유효성 검증 (중요!)
    const isValidKey = await validateApiKey(password)

    if (!isValidKey) {
      return {
        success: false,
        message: '유효하지 않은 TMDB API 키입니다. 올바른 API 키를 입력해주세요.'
      }
    }

    // 3. 중복 확인
    const existingUser = findUser(email, password)
    if (existingUser) {
      return {
        success: false,
        message: '이미 가입된 이메일입니다'
      }
    }

    // 4. 사용자 저장
    const newUser: User = {
      id: email,
      password: password
    }
    saveUser(newUser)

    return {
      success: true,
      message: '회원가입 성공! 로그인해주세요.'
    }
  } catch (error) {
    console.error('Register error:', error)
    return {
      success: false,
      message: '회원가입 중 오류가 발생했습니다'
    }
  }
}

/**
 * 로그아웃 처리
 */
export const logout = (): void => {
  clearLoginStatus()
}
