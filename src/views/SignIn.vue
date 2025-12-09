<!-- src/views/SignIn.vue -->
<template>
  <div class="signin-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1 class="logo">
          <i class="fas fa-film"></i>
          NETFLIX DEMO
        </h1>
      </div>

      <!-- 로그인/회원가입 전환 애니메이션 (필수!) -->
      <Transition name="slide-fade" mode="out-in">
        <!-- ==================== 로그인 폼 ==================== -->
        <div v-if="isLoginMode" key="login" class="auth-form">
          <h2>로그인</h2>

          <form @submit.prevent="handleLogin">
            <!-- 이메일 -->
            <div class="form-group">
              <label for="login-email">
                <i class="fas fa-envelope"></i>
                이메일
              </label>
              <input
                id="login-email"
                v-model="loginForm.email"
                type="email"
                placeholder="example@email.com"
                required
                @blur="validateLoginEmail"
              />
              <span v-if="loginErrors.email" class="error-message">
                {{ loginErrors.email }}
              </span>
            </div>

            <!-- 비밀번호 (TMDB API 키) -->
            <div class="form-group">
              <label for="login-password">
                <i class="fas fa-key"></i>
                TMDB API Key
              </label>
              <input
                id="login-password"
                v-model="loginForm.password"
                type="password"
                placeholder="TMDB API 키를 입력하세요"
                required
              />
              <small class="helper-text">
                <i class="fas fa-info-circle"></i>
                TMDB API 키가 비밀번호로 사용됩니다
              </small>
            </div>

            <!-- Remember Me -->
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input
                  v-model="loginForm.keepLogin"
                  type="checkbox"
                />
                <span>로그인 상태 유지</span>
              </label>
            </div>

            <!-- 버튼 -->
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isLoading"
            >
              <span v-if="isLoading">
                <i class="fas fa-spinner fa-spin"></i>
                로그인 중...
              </span>
              <span v-else>
                <i class="fas fa-sign-in-alt"></i>
                로그인
              </span>
            </button>

            <button
              type="button"
              class="btn btn-secondary"
              @click="switchToSignup"
              :disabled="isLoading"
            >
              계정이 없으신가요? 회원가입
            </button>
          </form>
        </div>

        <!-- ==================== 회원가입 폼 ==================== -->
        <div v-else key="signup" class="auth-form">
          <h2>회원가입</h2>

          <form @submit.prevent="handleSignup">
            <!-- 이메일 -->
            <div class="form-group">
              <label for="signup-email">
                <i class="fas fa-envelope"></i>
                이메일
              </label>
              <input
                id="signup-email"
                v-model="signupForm.email"
                type="email"
                placeholder="example@email.com"
                required
                @blur="validateSignupEmail"
              />
              <span v-if="signupErrors.email" class="error-message">
                {{ signupErrors.email }}
              </span>
            </div>

            <!-- 비밀번호 (TMDB API 키) -->
            <div class="form-group">
              <label for="signup-password">
                <i class="fas fa-key"></i>
                TMDB API Key
              </label>
              <input
                id="signup-password"
                v-model="signupForm.password"
                type="password"
                placeholder="TMDB API 키를 입력하세요"
                required
              />
              <small class="helper-text">
                <i class="fas fa-info-circle"></i>
                <a href="https://www.themoviedb.org/settings/api" target="_blank">
                  여기서 발급받기
                </a>
              </small>
            </div>

            <!-- 비밀번호 확인 -->
            <div class="form-group">
              <label for="signup-password-confirm">
                <i class="fas fa-check"></i>
                비밀번호 확인
              </label>
              <input
                id="signup-password-confirm"
                v-model="signupForm.passwordConfirm"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                required
                @blur="validatePasswordConfirmField"
              />
              <span v-if="signupErrors.passwordConfirm" class="error-message">
                {{ signupErrors.passwordConfirm }}
              </span>
            </div>

            <!-- 약관 동의 -->
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input
                  v-model="signupForm.agreeTerms"
                  type="checkbox"
                  required
                />
                <span>
                  <a href="#" @click.prevent>이용약관</a> 및
                  <a href="#" @click.prevent>개인정보처리방침</a>에 동의합니다
                </span>
              </label>
              <span v-if="signupErrors.agreeTerms" class="error-message">
                {{ signupErrors.agreeTerms }}
              </span>
            </div>

            <!-- 버튼 -->
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="!signupForm.agreeTerms || isLoading"
            >
              <span v-if="isLoading">
                <i class="fas fa-spinner fa-spin"></i>
                가입 중...
              </span>
              <span v-else>
                <i class="fas fa-user-plus"></i>
                회원가입
              </span>
            </button>

            <button
              type="button"
              class="btn btn-secondary"
              @click="switchToLogin"
              :disabled="isLoading"
            >
              이미 계정이 있으신가요? 로그인
            </button>
          </form>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { validateEmail, validatePassword, validatePasswordConfirm, validateAgreement } from '@/utils/validators'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

// State
const isLoginMode = ref(true)
const isLoading = ref(false)

// 로그인 폼
const loginForm = ref({
  email: '',
  password: '',
  keepLogin: false
})

const loginErrors = ref({
  email: ''
})

// 회원가입 폼
const signupForm = ref({
  email: '',
  password: '',
  passwordConfirm: '',
  agreeTerms: false
})

const signupErrors = ref({
  email: '',
  passwordConfirm: '',
  agreeTerms: ''
})

// ==================== Validation ====================

const validateLoginEmail = () => {
  const result = validateEmail(loginForm.value.email)
  loginErrors.value.email = result.message || ''
  return result.valid
}

const validateSignupEmail = () => {
  const result = validateEmail(signupForm.value.email)
  signupErrors.value.email = result.message || ''
  return result.valid
}

const validatePasswordConfirmField = () => {
  const result = validatePasswordConfirm(
    signupForm.value.password,
    signupForm.value.passwordConfirm
  )
  signupErrors.value.passwordConfirm = result.message || ''
  return result.valid
}

// ==================== Handlers ====================

const handleLogin = async () => {
  // 이메일 검증
  if (!validateLoginEmail()) {
    return
  }

  // 비밀번호 검증
  const passwordResult = validatePassword(loginForm.value.password)
  if (!passwordResult.valid) {
    toast.error(passwordResult.message || '비밀번호를 확인해주세요')
    return
  }

  isLoading.value = true

  try {
    const result = await authStore.login(
      loginForm.value.email,
      loginForm.value.password,
      loginForm.value.keepLogin
    )

    if (result.success) {
      // Custom Toast (추가 점수)
      toast.success(result.message, {
        timeout: 2000,
        icon: '🎉'
      })

      // 메인 페이지로 이동
      setTimeout(() => {
        router.push('/')
      }, 500)
    } else {
      toast.error(result.message)
    }
  } catch (error) {
    console.error('Login error:', error)
    toast.error('로그인 중 오류가 발생했습니다')
  } finally {
    isLoading.value = false
  }
}

const handleSignup = async () => {
  // 이메일 검증
  if (!validateSignupEmail()) {
    return
  }

  // 비밀번호 검증
  const passwordResult = validatePassword(signupForm.value.password)
  if (!passwordResult.valid) {
    toast.error(passwordResult.message || '비밀번호를 확인해주세요')
    return
  }

  // 비밀번호 확인 검증
  if (!validatePasswordConfirmField()) {
    return
  }

  // 약관 동의 검증
  const agreementResult = validateAgreement(signupForm.value.agreeTerms)
  if (!agreementResult.valid) {
    signupErrors.value.agreeTerms = agreementResult.message || ''
    return
  }

  isLoading.value = true

  try {
    const result = await authStore.register(
      signupForm.value.email,
      signupForm.value.password,
      signupForm.value.passwordConfirm
    )

    if (result.success) {
      // Custom Toast (추가 점수)
      toast.success(result.message, {
        timeout: 2000,
        icon: '✅'
      })

      // 회원가입 성공 시 로그인 폼으로 자동 전환
      setTimeout(() => {
        switchToLogin()
        // 이메일 자동 입력
        loginForm.value.email = signupForm.value.email
      }, 1000)
    } else {
      toast.error(result.message)
    }
  } catch (error) {
    console.error('Signup error:', error)
    toast.error('회원가입 중 오류가 발생했습니다')
  } finally {
    isLoading.value = false
  }
}

// ==================== Mode Switch ====================

const switchToSignup = () => {
  isLoginMode.value = false
  // 폼 초기화
  signupForm.value = {
    email: loginForm.value.email, // 이메일 유지
    password: '',
    passwordConfirm: '',
    agreeTerms: false
  }
  signupErrors.value = {
    email: '',
    passwordConfirm: '',
    agreeTerms: ''
  }
}

const switchToLogin = () => {
  isLoginMode.value = true
  // 폼 초기화
  loginForm.value = {
    email: signupForm.value.email, // 이메일 유지
    password: '',
    keepLogin: false
  }
  loginErrors.value = {
    email: ''
  }
}
</script>

<style scoped>
/* ==================== Layout ==================== */
.signin-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  padding: 2rem;
}

.auth-container {
  width: 100%;
  max-width: 450px;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-red);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.auth-form {
  background: rgba(0, 0, 0, 0.75);
  padding: 3rem 2.5rem;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.auth-form h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

/* ==================== Form ==================== */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-white);
}

.form-group input[type="email"],
.form-group input[type="password"] {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: white;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-red);
}

.helper-text {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-gray);
}

.helper-text a {
  color: var(--primary-red);
  text-decoration: underline;
}

.helper-text a:hover {
  color: #f40612;
}

/* ==================== Checkbox ==================== */
.checkbox-group {
  margin: 1rem 0;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input[type="checkbox"] {
  margin-top: 0.25rem;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-label span {
  flex: 1;
  font-size: 0.875rem;
  line-height: 1.4;
}

.checkbox-label a {
  color: var(--primary-red);
  text-decoration: underline;
}

/* ==================== Buttons ==================== */
.btn {
  width: 100%;
  padding: 0.875rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--primary-red);
  color: white;
  border: none;
  margin-bottom: 1rem;
}

.btn-primary:hover:not(:disabled) {
  background: #f40612;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 9, 20, 0.4);
}

.btn-secondary {
  background: transparent;
  color: var(--text-gray);
  border: 1px solid var(--text-gray);
}

.btn-secondary:hover:not(:disabled) {
  color: white;
  border-color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* ==================== Errors ==================== */
.error-message {
  display: block;
  color: var(--primary-red);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* ==================== Animation (필수!) ==================== */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}

.slide-fade-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

/* ==================== Responsive ==================== */
@media (max-width: 768px) {
  .signin-page {
    padding: 1rem;
  }

  .auth-form {
    padding: 2rem 1.5rem;
  }

  .logo {
    font-size: 2rem;
  }

  .auth-form h2 {
    font-size: 1.5rem;
  }
}
</style>
