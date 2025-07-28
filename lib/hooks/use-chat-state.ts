import type { ChatState, Message } from '@/types/builder'
import { useCallback, useState } from 'react'

export function useChatState() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    input: '',
    isLoading: false,
    hasAutoSent: false,
  })

  const updateState = useCallback((updates: Partial<ChatState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const addMessage = useCallback((message: Message) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
    }))
  }, [])

  const removeTypingMessages = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.filter(msg => !msg.isTyping),
    }))
  }, [])

  const replaceTypingWithMessage = useCallback((message: Message) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages.filter(msg => !msg.isTyping), message],
    }))
  }, [])

  const resetChat = useCallback(() => {
    setState({
      messages: [],
      input: '',
      isLoading: false,
      hasAutoSent: false,
    })
  }, [])

  const setMessagesUpToIndex = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.slice(0, index),
    }))
  }, [])

  return {
    ...state,
    updateState,
    addMessage,
    removeTypingMessages,
    replaceTypingWithMessage,
    resetChat,
    setMessagesUpToIndex,
  }
}
