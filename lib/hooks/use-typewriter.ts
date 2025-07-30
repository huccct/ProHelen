import type { TypingConfig } from '@/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SCROLL_CONFIG_HOME } from '../constants'

export function useTypewriter(phrases: string[], config: TypingConfig) {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const animationStateRef = useRef({
    currentPhrase: 0,
    currentIndex: 0,
    isDeleting: false,
  })

  const animate = useCallback(() => {
    const { currentPhrase, currentIndex, isDeleting } = animationStateRef.current
    const phrase = phrases[currentPhrase]

    if (!phrase)
      return

    if (!isDeleting) {
      if (currentIndex < phrase.length) {
        setDisplayText(phrase.substring(0, currentIndex + 1))
        animationStateRef.current.currentIndex++
        timeoutRef.current = setTimeout(animate, config.speed)
      }
      else {
        timeoutRef.current = setTimeout(() => {
          animationStateRef.current.isDeleting = true
          animate()
        }, config.pause)
      }
    }
    else {
      if (currentIndex > 0) {
        setDisplayText(phrase.substring(0, currentIndex - 1))
        animationStateRef.current.currentIndex--
        timeoutRef.current = setTimeout(animate, config.delete)
      }
      else {
        animationStateRef.current.isDeleting = false
        animationStateRef.current.currentPhrase = (currentPhrase + 1) % phrases.length
        timeoutRef.current = setTimeout(animate, config.restart)
      }
    }
  }, [phrases, config])

  useEffect(() => {
    animationStateRef.current = { currentPhrase: 0, currentIndex: 0, isDeleting: false }
    setDisplayText('')
    animate()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [animate])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, SCROLL_CONFIG_HOME.cursorBlinkRate)

    return () => clearInterval(cursorInterval)
  }, [])

  return { displayText, showCursor }
}
