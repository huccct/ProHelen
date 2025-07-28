import type { Message } from '@/types/builder'
import { useCallback, useEffect, useRef } from 'react'

export function useApiCommunication(systemPrompt: string) {
  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (
    messageContent: string,
    conversationHistory: Message[],
  ): Promise<string> => {
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch('/api/test-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          userMessage: messageContent,
          conversationHistory,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      return data.response
    }
    finally {
      abortControllerRef.current = null
    }
  }, [systemPrompt])

  const abortRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return { sendMessage, abortRequest }
}
