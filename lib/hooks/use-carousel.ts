import { useCallback, useEffect, useRef, useState } from 'react'
import { ANALYSIS_CONFIG, CAROUSEL_CONFIG } from '../constants'

export function useCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const totalSlides = Math.ceil(CAROUSEL_CONFIG.EXAMPLES.length / CAROUSEL_CONFIG.ITEMS_TO_SHOW)
  const intervalRef = useRef<NodeJS.Timeout>(undefined)

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
  }, [])

  const startAutoPlay = useCallback(() => {
    stopAutoPlay()
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % totalSlides)
    }, ANALYSIS_CONFIG.CAROUSEL_INTERVAL)
  }, [totalSlides])

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides)
    startAutoPlay()
  }, [totalSlides, startAutoPlay])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % totalSlides)
    startAutoPlay()
  }, [totalSlides, startAutoPlay])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
    startAutoPlay()
  }, [startAutoPlay])

  const getCurrentExamples = useCallback(() => {
    const startIndex = currentIndex * CAROUSEL_CONFIG.ITEMS_TO_SHOW
    return CAROUSEL_CONFIG.EXAMPLES.slice(startIndex, startIndex + CAROUSEL_CONFIG.ITEMS_TO_SHOW)
  }, [currentIndex])

  useEffect(() => {
    return stopAutoPlay
  }, [stopAutoPlay])

  return {
    currentIndex,
    totalSlides,
    getCurrentExamples,
    goToPrevious,
    goToNext,
    goToSlide,
    startAutoPlay,
    stopAutoPlay,
  }
}
