import type { ScrollState } from '@/types/builder'
import { SCROLL_CONFIG } from '@/lib/constants'
import { useCallback, useEffect, useState } from 'react'

export function useScrollControl(containerRef: React.RefObject<HTMLDivElement>, isOpen: boolean, selectedCategory: string) {
  const [scrollState, setScrollState] = useState<ScrollState>({
    showScrollButtons: false,
    canScrollLeft: false,
    canScrollRight: false,
  })

  const checkScrollButtons = useCallback(() => {
    const container = containerRef.current
    if (!container)
      return

    const { scrollLeft, scrollWidth, clientWidth } = container
    const canScrollLeft = scrollLeft > 0
    const canScrollRight = scrollLeft < scrollWidth - clientWidth
    const showScrollButtons = scrollWidth > clientWidth

    setScrollState({
      showScrollButtons,
      canScrollLeft,
      canScrollRight,
    })
  }, [])

  const scroll = useCallback((direction: 'left' | 'right') => {
    const container = containerRef.current
    if (!container)
      return

    const containerWidth = container.clientWidth
    const scrollAmount = Math.min(containerWidth * SCROLL_CONFIG.PERCENTAGE, SCROLL_CONFIG.MAX_AMOUNT)
    const newScrollLeft = direction === 'left'
      ? Math.max(0, container.scrollLeft - scrollAmount)
      : Math.min(container.scrollWidth - containerWidth, container.scrollLeft + scrollAmount)

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    })

    setTimeout(checkScrollButtons, SCROLL_CONFIG.ANIMATION_DURATION)
  }, [checkScrollButtons])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !isOpen)
      return

    const timer = setTimeout(checkScrollButtons, SCROLL_CONFIG.INITIAL_CHECK_DELAY)

    container.addEventListener('scroll', checkScrollButtons, { passive: true })
    window.addEventListener('resize', checkScrollButtons, { passive: true })

    return () => {
      clearTimeout(timer)
      container.removeEventListener('scroll', checkScrollButtons)
      window.removeEventListener('resize', checkScrollButtons)
    }
  }, [isOpen, checkScrollButtons])

  useEffect(() => {
    if (!isOpen)
      return
    const timer = setTimeout(checkScrollButtons, SCROLL_CONFIG.CHECK_DELAY)
    return () => clearTimeout(timer)
  }, [selectedCategory, isOpen, checkScrollButtons])

  return {
    ...scrollState,
    scroll,
  }
}
