// src/composables/useInfiniteScroll.ts
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 무한 스크롤을 위한 Custom Composable
 * Popular 페이지에서 사용
 */
export function useInfiniteScroll(
  callback: () => void,
  threshold = 100
) {
  // State
  const scrollContainer = ref<HTMLElement | null>(null)
  const isAtBottom = ref(false)
  const isScrolling = ref(false)

  // Scroll Handler
  const handleScroll = () => {
    const container = scrollContainer.value
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container

    // 끝에 도달했는지 확인
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    isAtBottom.value = distanceFromBottom <= threshold

    if (isAtBottom.value && !isScrolling.value) {
      isScrolling.value = true
      callback()

      // 디바운싱: 500ms 후에 다시 스크롤 가능
      setTimeout(() => {
        isScrolling.value = false
      }, 500)
    }
  }

  // 맨 위로 스크롤
  const scrollToTop = () => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  // 특정 위치로 스크롤
  const scrollTo = (position: number, smooth = true) => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo({
        top: position,
        behavior: smooth ? 'smooth' : 'auto'
      })
    }
  }

  // 현재 스크롤 위치
  const getScrollPosition = (): number => {
    return scrollContainer.value?.scrollTop || 0
  }

  // Lifecycle Hooks
  onMounted(() => {
    if (scrollContainer.value) {
      scrollContainer.value.addEventListener('scroll', handleScroll)
    }
  })

  onUnmounted(() => {
    if (scrollContainer.value) {
      scrollContainer.value.removeEventListener('scroll', handleScroll)
    }
  })

  return {
    // Refs
    scrollContainer,

    // State
    isAtBottom,
    isScrolling,

    // Methods
    scrollToTop,
    scrollTo,
    getScrollPosition
  }
}
