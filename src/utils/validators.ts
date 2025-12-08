// src/utils/validators.ts

/**
 * 이메일 형식 검증
 */
export const validateEmail = (email: string): { valid: boolean; message?: string } => {
  if (!email) {
    return { valid: false, message: '이메일을 입력해주세요' }
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!regex.test(email)) {
    return { valid: false, message: '올바른 이메일 형식이 아닙니다' }
  }

  return { valid: true }
}

/**
 * 비밀번호 검증 (TMDB API 키)
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (!password) {
    return { valid: false, message: 'TMDB API 키를 입력해주세요' }
  }

  if (password.length < 10) {
    return { valid: false, message: 'API 키가 너무 짧습니다' }
  }

  return { valid: true }
}

/**
 * 비밀번호 확인 검증
 */
export const validatePasswordConfirm = (
  password: string,
  passwordConfirm: string
): { valid: boolean; message?: string } => {
  if (!passwordConfirm) {
    return { valid: false, message: '비밀번호 확인을 입력해주세요' }
  }

  if (password !== passwordConfirm) {
    return { valid: false, message: '비밀번호가 일치하지 않습니다' }
  }

  return { valid: true }
}

/**
 * 약관 동의 검증
 */
export const validateAgreement = (agreed: boolean): { valid: boolean; message?: string } => {
  if (!agreed) {
    return { valid: false, message: '약관에 동의해주세요' }
  }

  return { valid: true }
}
