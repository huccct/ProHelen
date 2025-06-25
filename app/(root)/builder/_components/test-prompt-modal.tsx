'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useBuilderStore } from '@/store/builder'
import { Copy, RefreshCw, Send, Sparkles, Square, User } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'

interface TestPromptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
}

export function TestPromptModal({ open, onOpenChange }: TestPromptModalProps) {
  const { t } = useTranslation()
  const preview = useBuilderStore(state => state.preview)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasAutoSent, setHasAutoSent] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const sendMessage = useCallback(async (messageContent: string, conversationHistory: Message[]) => {
    setIsLoading(true)

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    // Add typing indicator
    const typingMessage: Message = {
      id: `assistant-typing-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true,
    }

    setMessages(prev => [...prev, typingMessage])

    try {
      const response = await fetch('/api/test-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemPrompt: preview.system,
          userMessage: messageContent,
          conversationHistory,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()

      // Remove typing indicator and add real response
      setMessages((prev) => {
        const filtered = prev.filter(msg => !msg.isTyping)
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        }
        return [...filtered, assistantMessage]
      })
    }
    catch (error: any) {
      if (error.name === 'AbortError') {
        // Request was aborted, remove typing indicator
        setMessages(prev => prev.filter(msg => !msg.isTyping))
        return
      }

      console.error('Error testing prompt:', error)

      // Remove typing indicator and show error
      setMessages((prev) => {
        const filtered = prev.filter(msg => !msg.isTyping)
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: '抱歉，发生了错误。请稍后重试。',
          timestamp: new Date(),
        }
        return [...filtered, errorMessage]
      })

      toast.error('Failed to test prompt. Please try again.')
    }
    finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [preview.system])

  // Auto-send a test message when modal opens
  useEffect(() => {
    if (open && !hasAutoSent && preview.system.trim()) {
      const autoTestMessage = t('builder.modals.testPrompt.autoMessage')

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: autoTestMessage,
        timestamp: new Date(),
      }

      setMessages([userMessage])
      setHasAutoSent(true)

      // Send auto message
      sendMessage(autoTestMessage, [])
    }
  }, [open, hasAutoSent, preview.system, t, sendMessage])

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setHasAutoSent(false)
      setMessages([])
      setInput('')
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [open])

  const handleSend = async () => {
    if (!input.trim() || isLoading)
      return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    const currentMessages = [...messages, userMessage]
    setMessages(currentMessages)
    setInput('')

    // Send message
    await sendMessage(userMessage.content, messages)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success(t('builder.modals.testPrompt.copied'))
  }

  const regenerateResponse = async (messageIndex: number) => {
    if (messageIndex <= 0)
      return

    const userMessage = messages[messageIndex - 1]
    if (userMessage?.role !== 'user')
      return

    // Remove assistant message and regenerate
    const historyUpToUser = messages.slice(0, messageIndex)
    setMessages(historyUpToUser)

    await sendMessage(userMessage.content, historyUpToUser.slice(0, -1))
  }

  // 输入框自适应高度
  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [input])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border text-foreground max-w-4xl h-[85vh] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            {t('builder.modals.testPrompt.title')}
          </DialogTitle>
        </DialogHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto px-4 scrollbar">
            {messages.length === 0
              ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="p-4 bg-muted/30 rounded-full">
                      <Sparkles className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Ready to chat!</h3>
                      <p className="text-muted-foreground max-w-md">
                        {t('builder.modals.testPrompt.emptyState')}
                      </p>
                    </div>
                  </div>
                )
              : (
                  <div className="space-y-6 py-4">
                    {messages.map((message, index) => (
                      <div key={message.id} className="group">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-gradient-to-br from-primary/20 to-primary/10'
                          }`}
                          >
                            {message.role === 'user'
                              ? <User className="h-4 w-4" />
                              : <Sparkles className="h-4 w-4 text-primary" />}
                          </div>

                          {/* Message Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm">
                                {message.role === 'user' ? 'You' : 'AI Assistant'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                            </div>

                            {message.isTyping
                              ? (
                                  <div className="flex items-center gap-2 py-3">
                                    <div className="flex space-x-1">
                                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      {t('builder.modals.testPrompt.thinking')}
                                    </span>
                                  </div>
                                )
                              : (
                                  <div className="prose prose-sm max-w-none prose-slate dark:prose-invert">
                                    {message.role === 'assistant'
                                      ? (
                                          <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                              code: ({ children, className }) => {
                                                const isBlock = className?.includes('language-')
                                                const codeContent = String(children).replace(/\n$/, '')

                                                return isBlock
                                                  ? (
                                                      <div className="relative group my-2">
                                                        <pre className="bg-muted p-3 rounded-lg overflow-x-auto">
                                                          <code className="text-sm font-mono">
                                                            {children}
                                                          </code>
                                                        </pre>
                                                        <Button
                                                          variant="ghost"
                                                          size="sm"
                                                          onClick={() => copyMessage(codeContent)}
                                                          className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background cursor-pointer"
                                                        >
                                                          <Copy className="h-3 w-3" />
                                                        </Button>
                                                      </div>
                                                    )
                                                  : (
                                                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                                                        {children}
                                                      </code>
                                                    )
                                              },
                                              p: ({ children }) => (
                                                <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>
                                              ),
                                              ul: ({ children }) => (
                                                <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
                                              ),
                                              ol: ({ children }) => (
                                                <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
                                              ),
                                              li: ({ children }) => (
                                                <li className="leading-relaxed">{children}</li>
                                              ),
                                              h1: ({ children }) => (
                                                <h1 className="text-xl font-bold mb-4 mt-6 first:mt-0">{children}</h1>
                                              ),
                                              h2: ({ children }) => (
                                                <h2 className="text-lg font-semibold mb-3 mt-5 first:mt-0">{children}</h2>
                                              ),
                                              h3: ({ children }) => (
                                                <h3 className="text-base font-medium mb-2 mt-4 first:mt-0">{children}</h3>
                                              ),
                                              blockquote: ({ children }) => (
                                                <blockquote className="border-l-4 border-muted-foreground/30 pl-4 my-4 italic text-muted-foreground">
                                                  {children}
                                                </blockquote>
                                              ),
                                              table: ({ children }) => (
                                                <div className="overflow-x-auto my-4">
                                                  <table className="min-w-full border border-border rounded-lg">{children}</table>
                                                </div>
                                              ),
                                              th: ({ children }) => (
                                                <th className="border border-border px-3 py-2 bg-muted font-medium text-left">{children}</th>
                                              ),
                                              td: ({ children }) => (
                                                <td className="border border-border px-3 py-2">{children}</td>
                                              ),
                                            }}
                                          >
                                            {message.content}
                                          </ReactMarkdown>
                                        )
                                      : (
                                          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                        )}
                                  </div>
                                )}

                            {/* Message Actions */}
                            {!message.isTyping && (
                              <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyMessage(message.content)}
                                  className="h-7 px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                {message.role === 'assistant' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => regenerateResponse(index)}
                                    className="h-7 px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                                    disabled={isLoading}
                                  >
                                    <RefreshCw className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border/50 p-4">
          <div className="relative">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                adjustTextareaHeight()
              }}
              onKeyPress={handleKeyPress}
              placeholder={t('builder.modals.testPrompt.inputPlaceholder')}
              className="min-h-[52px] max-h-[200px] resize-none pr-12 scrollbar bg-background border border-border rounded-xl text-sm leading-relaxed cursor-pointer"
              disabled={isLoading}
              style={{ height: 'auto' }}
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              {isLoading
                ? (
                    <Button
                      type="button"
                      onClick={stopGeneration}
                      className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 cursor-pointer"
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                  )
                : (
                    <Button
                      type="button"
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="h-8 w-8 p-0 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>
              {input.length}
              /2000
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
