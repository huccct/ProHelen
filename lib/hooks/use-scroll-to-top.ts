import { useCallback, useEffect, useState } from 'react'
import { SCROLL_CONFIG_HOME } from '../constants'

export function useScrollToTop() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      const shouldShow = scrollPosition > windowHeight * SCROLL_CONFIG_HOME.threshold
        || (documentHeight - scrollPosition - windowHeight) < SCROLL_CONFIG_HOME.bottomOffset

      setShowScrollTop(shouldShow)
    }

    let timeoutId: NodeJS.Timeout
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleScroll, 10)
    }

    window.addEventListener('scroll', debouncedHandleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll)
      clearTimeout(timeoutId)
    }
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return { showScrollTop, scrollToTop }
}
