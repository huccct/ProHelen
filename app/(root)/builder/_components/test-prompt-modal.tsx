'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useBuilderStore } from '@/store/builder'
import { Loader2, Send, Sparkles, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface TestPromptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function TestPromptModal({ open, onOpenChange }: TestPromptModalProps) {
  const preview = useBuilderStore(state => state.preview)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasAutoSent, setHasAutoSent] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-send a test message when modal opens
  useEffect(() => {
    if (open && !hasAutoSent && preview.system.trim()) {
      const autoTestMessage = 'Hello! Please introduce yourself and explain what you can help me with.'

      const userMessage: Message = {
        role: 'user',
        content: autoTestMessage,
        timestamp: new Date(),
      }

      setMessages([userMessage])
      setIsLoading(true)
      setHasAutoSent(true)

      // Auto-send the test message
      const sendAutoMessage = async () => {
        try {
          const response = await fetch('/api/test-prompt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              systemPrompt: preview.system,
              userMessage: autoTestMessage,
              conversationHistory: [],
            }),
          })

          if (!response.ok) {
            throw new Error('Failed to get AI response')
          }

          const data = await response.json()

          const assistantMessage: Message = {
            role: 'assistant',
            content: data.response,
            timestamp: new Date(),
          }

          setMessages(prev => [...prev, assistantMessage])
        }
        catch (error) {
          console.error('Error auto-testing prompt:', error)
          // Don't show error toast for auto-test, just log it
        }
        finally {
          setIsLoading(false)
        }
      }

      sendAutoMessage()
    }
  }, [open, hasAutoSent, preview.system])

  // Reset auto-send state when modal closes
  useEffect(() => {
    if (!open) {
      setHasAutoSent(false)
      setMessages([])
      setInput('')
    }
  }, [open])

  const handleSend = async () => {
    if (!input.trim() || isLoading)
      return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Call our API to test the prompt
      const response = await fetch('/api/test-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemPrompt: preview.system,
          userMessage: userMessage.content,
          conversationHistory: messages,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    }
    catch (error) {
      console.error('Error testing prompt:', error)
      toast.error('Failed to test prompt. Please try again.')
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-gray-700 text-white max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gray-700/30 rounded-lg">
              <Sparkles className="h-6 w-6 text-gray-400" />
            </div>
            Test Prompt
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Conversation Area */}
          <div className="flex-1 bg-black rounded-lg border border-gray-800 flex flex-col min-h-0">
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar">
              {messages.length === 0
                ? (
                    <div className="text-center text-gray-500 py-8">
                      <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Type a message below to test your prompt</p>
                    </div>
                  )
                : (
                    messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-gray-700/30 flex items-center justify-center flex-shrink-0 mt-1">
                            <Sparkles className="h-4 w-4 text-gray-400" />
                          </div>
                        )}

                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-gray-700 text-white'
                              : 'bg-zinc-800 text-gray-100'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>

                        {message.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 mt-1">
                            <User className="h-4 w-4 text-gray-300" />
                          </div>
                        )}
                      </div>
                    ))
                  )}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gray-700/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-gray-400">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-800 p-4">
              <div className="relative flex-1">
                <Textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your test message... (Press Enter to send)"
                  className="text-sm text-white placeholder-gray-400 h-[52px] max-h-24 pr-12 scrollbar bg-zinc-800 border border-gray-700 rounded-lg"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute bottom-2 right-2 p-2 h-8 w-8 min-w-0 bg-transparent hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-none border-none"
                  tabIndex={-1}
                >
                  {isLoading
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Send className="h-4 w-4 rotate-45 text-gray-400 hover:text-white transition-colors" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Actions */}
          {/* <div className="flex gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={clearConversation}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer"
              disabled={messages.length === 0}
            >
              Clear Conversation
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer"
            >
              Close
            </Button>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
