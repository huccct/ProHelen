import { useCallback, useEffect, useRef } from 'react'
import { CHAT_CONFIG } from '../constants'

export function useTextareaAutoResize(input: string) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        CHAT_CONFIG.TEXTAREA_MAX_HEIGHT,
      )}px`
    }
  }, [])

  useEffect(() => {
    adjustHeight()
  }, [input, adjustHeight])

  return { textareaRef, adjustHeight }
}
