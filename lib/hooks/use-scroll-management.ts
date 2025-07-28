import type { Message } from '@/types/builder'
import { useCallback, useEffect, useRef } from 'react'
import { CHAT_CONFIG } from '../constants'

export function useScrollManagement(messages: Message[]) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: CHAT_CONFIG.SCROLL_BEHAVIOR,
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  return { messagesEndRef, scrollToBottom }
}
