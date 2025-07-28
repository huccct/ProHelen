'use client'

import type { Message, TestPromptModalProps } from '@/types/builder'
import type { Components } from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { ANIMATION_CONFIG_TEST_PROMPT_MODAL, CHAT_CONFIG, CSS_CLASSES_TEST_PROMPT_MODAL, MESSAGE_ROLES } from '@/lib/constants'
import { useApiCommunication } from '@/lib/hooks/use-api-communication'
import { useChatState } from '@/lib/hooks/use-chat-state'
import { useScrollManagement } from '@/lib/hooks/use-scroll-management'
import { useTextareaAutoResize } from '@/lib/hooks/use-textarea-auto-resize'
import { useBuilderStore } from '@/store/builder'
import { Copy, RefreshCw, RotateCcw, Send, Sparkles, Square, User } from 'lucide-react'
import { memo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'
import { useShallow } from 'zustand/shallow'

function generateMessageId(role: string): string {
  return `${role}-${Date.now()}`
}

function createMessage(role: 'user' | 'assistant', content: string, isTyping = false): Message {
  return {
    id: generateMessageId(role),
    role,
    content,
    timestamp: new Date(),
    isTyping,
  }
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  }
  catch {
    return false
  }
}

const TypingIndicator = memo(() => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2 py-3">
      <div className="flex space-x-1">
        {ANIMATION_CONFIG_TEST_PROMPT_MODAL.BOUNCE_DELAYS.map((delay, index) => (
          <div
            key={index}
            className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
            style={{ animationDelay: delay }}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {t('builder.modals.testPrompt.thinking')}
      </span>
    </div>
  )
})

TypingIndicator.displayName = 'TypingIndicator'

interface CodeBlockProps {
  children: string
  className?: string
}

const CodeBlock = memo<CodeBlockProps>(({ children, className }) => {
  const isBlock = className?.includes('language-')
  const codeContent = String(children).replace(/\n$/, '')

  const handleCopy = useCallback(async () => {
    if (await copyToClipboard(codeContent)) {
      toast.success('Code copied!')
    }
  }, [codeContent])

  if (isBlock) {
    return (
      <div className="relative group my-2">
        <pre className="bg-muted p-3 rounded-lg overflow-x-auto">
          <code className="text-sm font-mono">{children}</code>
        </pre>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background cursor-pointer"
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  )
})

CodeBlock.displayName = 'CodeBlock'

const markdownComponents = {
  code: CodeBlock,
  p: ({ children }: any) => (
    <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
  ),
  li: ({ children }: any) => (
    <li className="leading-relaxed">{children}</li>
  ),
  h1: ({ children }: any) => (
    <h1 className="text-xl font-bold mb-4 mt-6 first:mt-0">{children}</h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-lg font-semibold mb-3 mt-5 first:mt-0">{children}</h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-base font-medium mb-2 mt-4 first:mt-0">{children}</h3>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-muted-foreground/30 pl-4 my-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border border-border rounded-lg">{children}</table>
    </div>
  ),
  th: ({ children }: any) => (
    <th className="border border-border px-3 py-2 bg-muted font-medium text-left">{children}</th>
  ),
  td: ({ children }: any) => (
    <td className="border border-border px-3 py-2">{children}</td>
  ),
}

interface MessageActionsProps {
  message: Message
  messageIndex: number
  onCopy: (content: string) => void
  onRegenerate: (index: number) => void
  isLoading: boolean
}

const MessageActions = memo<MessageActionsProps>(({
  message,
  messageIndex,
  onCopy,
  onRegenerate,
  isLoading,
}) => {
  if (message.isTyping)
    return null

  return (
    <div className={`flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 ${ANIMATION_CONFIG_TEST_PROMPT_MODAL.TRANSITION_DURATION}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onCopy(message.content)}
        className={CSS_CLASSES_TEST_PROMPT_MODAL.actionButton}
      >
        <Copy className="h-3 w-3" />
      </Button>
      {message.role === MESSAGE_ROLES.ASSISTANT && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRegenerate(messageIndex)}
          className={CSS_CLASSES_TEST_PROMPT_MODAL.actionButton}
          disabled={isLoading}
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
})

MessageActions.displayName = 'MessageActions'

interface MessageComponentProps {
  message: Message
  messageIndex: number
  onCopy: (content: string) => void
  onRegenerate: (index: number) => void
  isLoading: boolean
}

const MessageComponent = memo<MessageComponentProps>(({
  message,
  messageIndex,
  onCopy,
  onRegenerate,
  isLoading,
}) => {
  const isUser = message.role === MESSAGE_ROLES.USER
  const avatarClass = isUser ? CSS_CLASSES_TEST_PROMPT_MODAL.userAvatar : CSS_CLASSES_TEST_PROMPT_MODAL.assistantAvatar

  return (
    <div className={CSS_CLASSES_TEST_PROMPT_MODAL.messageGroup}>
      <div className="flex items-start gap-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${avatarClass}`}>
          {isUser
            ? (
                <User className="h-4 w-4" />
              )
            : (
                <Sparkles className="h-4 w-4 text-primary" />
              )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm">
              {isUser ? 'You' : 'AI Assistant'}
            </span>
            <span className="text-xs text-muted-foreground">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>

          {message.isTyping
            ? (
                <TypingIndicator />
              )
            : (
                <div className="prose prose-sm max-w-none prose-slate dark:prose-invert">
                  {isUser
                    ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      )
                    : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={markdownComponents as Components}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                </div>
              )}

          <MessageActions
            message={message}
            messageIndex={messageIndex}
            onCopy={onCopy}
            onRegenerate={onRegenerate}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
})

MessageComponent.displayName = 'MessageComponent'

interface EmptyStateProps {
  originalUserQuery: string
}

const EmptyState = memo<EmptyStateProps>(({ originalUserQuery }) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
      <div className="p-4 bg-muted/30 rounded-full">
        <Sparkles className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Ready to chat!</h3>
        <p className="text-muted-foreground max-w-md">
          {originalUserQuery.trim()
            ? `Will automatically test with: "${originalUserQuery}"`
            : t('builder.modals.testPrompt.emptyState')}
        </p>
      </div>
    </div>
  )
})

EmptyState.displayName = 'EmptyState'

interface InputAreaProps {
  input: string
  onInputChange: (value: string) => void
  onSend: () => void
  onStop: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
  isLoading: boolean
  textareaRef: React.RefObject<HTMLTextAreaElement>
}

const InputArea = memo<InputAreaProps>(({
  input,
  onInputChange,
  onSend,
  onStop,
  onKeyPress,
  isLoading,
  textareaRef,
}) => {
  const { t } = useTranslation()

  return (
    <div className="border-t border-border/50 p-4">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={onKeyPress}
          placeholder={t('builder.modals.testPrompt.inputPlaceholder')}
          className="min-h-[80px] max-h-[200px] resize-none pr-14 scrollbar bg-background border border-border rounded-xl text-sm leading-relaxed cursor-pointer"
          disabled={isLoading}
          maxLength={CHAT_CONFIG.MAX_INPUT_LENGTH}
          style={{ height: 'auto' }}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-1">
          {isLoading
            ? (
                <Button
                  type="button"
                  onClick={onStop}
                  className={CSS_CLASSES_TEST_PROMPT_MODAL.stopButton}
                >
                  <Square className="h-4 w-4" />
                </Button>
              )
            : (
                <Button
                  type="button"
                  onClick={onSend}
                  disabled={!input.trim()}
                  className={CSS_CLASSES_TEST_PROMPT_MODAL.sendButton}
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
          /
          {CHAT_CONFIG.MAX_INPUT_LENGTH}
        </span>
      </div>
    </div>
  )
})

InputArea.displayName = 'InputArea'

export const TestPromptModal = memo<TestPromptModalProps>(({ open, onOpenChange }) => {
  const { t } = useTranslation()

  const { preview, originalUserQuery } = useBuilderStore(
    useShallow(state => ({
      preview: state.preview,
      originalUserQuery: state.originalUserQuery,
    })),
  )

  const {
    messages,
    input,
    isLoading,
    hasAutoSent,
    updateState,
    addMessage,
    removeTypingMessages,
    replaceTypingWithMessage,
    resetChat,
    setMessagesUpToIndex,
  } = useChatState()

  const { sendMessage, abortRequest } = useApiCommunication(preview.system)
  const { textareaRef } = useTextareaAutoResize(input)
  const { messagesEndRef } = useScrollManagement(messages)

  useEffect(() => {
    if (open && textareaRef.current) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus()
      }, CHAT_CONFIG.AUTO_FOCUS_DELAY)
      return () => clearTimeout(timer)
    }
  }, [open])

  const handleSendMessage = useCallback(async (
    messageContent: string,
    conversationHistory: Message[],
  ) => {
    updateState({ isLoading: true })

    const typingMessage = createMessage(MESSAGE_ROLES.ASSISTANT, '', true)
    addMessage(typingMessage)

    try {
      const response = await sendMessage(messageContent, conversationHistory)
      const assistantMessage = createMessage(MESSAGE_ROLES.ASSISTANT, response)
      replaceTypingWithMessage(assistantMessage)
    }
    catch (error: any) {
      if (error.name === 'AbortError') {
        removeTypingMessages()
        return
      }

      console.error('Error testing prompt:', error)
      const errorMessage = createMessage(
        MESSAGE_ROLES.ASSISTANT,
        'Sorry, there was an error. Please try again.',
      )
      replaceTypingWithMessage(errorMessage)
      toast.error('Failed to test prompt. Please try again.')
    }
    finally {
      updateState({ isLoading: false })
    }
  }, [updateState, addMessage, replaceTypingWithMessage, removeTypingMessages, sendMessage])

  useEffect(() => {
    if (open && !hasAutoSent && preview.system.trim() && messages.length === 0) {
      const autoTestMessage = originalUserQuery.trim() || t('builder.modals.testPrompt.autoMessage')
      const userMessage = createMessage(MESSAGE_ROLES.USER, autoTestMessage)

      addMessage(userMessage)
      updateState({ hasAutoSent: true })
      handleSendMessage(autoTestMessage, [])
    }
  }, [open, hasAutoSent, preview.system, originalUserQuery, t, messages.length, addMessage, updateState, handleSendMessage])

  useEffect(() => {
    if (!open) {
      updateState({ hasAutoSent: false, input: '' })
      abortRequest()
    }
  }, [open, updateState, abortRequest])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading)
      return

    const userMessage = createMessage(MESSAGE_ROLES.USER, input.trim())
    addMessage(userMessage)
    updateState({ input: '' })

    await handleSendMessage(userMessage.content, messages)
  }, [input, isLoading, messages, addMessage, updateState, handleSendMessage])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const handleCopy = useCallback(async (content: string) => {
    if (await copyToClipboard(content)) {
      toast.success(t('builder.modals.testPrompt.copied'))
    }
  }, [t])

  const handleRegenerate = useCallback(async (messageIndex: number) => {
    if (messageIndex <= 0)
      return

    const userMessage = messages[messageIndex - 1]
    if (userMessage?.role !== MESSAGE_ROLES.USER)
      return

    const historyUpToUser = messages.slice(0, messageIndex)
    setMessagesUpToIndex(messageIndex)
    await handleSendMessage(userMessage.content, historyUpToUser.slice(0, -1))
  }, [messages, setMessagesUpToIndex, handleSendMessage])

  const handleNewConversation = useCallback(() => {
    resetChat()
  }, [resetChat])

  const handleInputChange = useCallback((value: string) => {
    updateState({ input: value })
  }, [updateState])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!bg-background !border-border !text-foreground !w-[60vw] !max-w-[95vw] !h-[90vh] !flex !flex-col !p-0">
        <DialogHeader className="p-8 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              {t('builder.modals.testPrompt.title')}
            </DialogTitle>

            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewConversation}
                className="cursor-pointer flex items-center gap-2 hover:bg-muted/50 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                {t('builder.modals.testPrompt.newConversation')}
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto px-4 scrollbar">
            {messages.length === 0
              ? (
                  <EmptyState originalUserQuery={originalUserQuery} />
                )
              : (
                  <div className="space-y-6 py-4">
                    {messages.map((message, index) => (
                      <MessageComponent
                        key={message.id}
                        message={message}
                        messageIndex={index}
                        onCopy={handleCopy}
                        onRegenerate={handleRegenerate}
                        isLoading={isLoading}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
          </div>
        </div>

        <InputArea
          input={input}
          onInputChange={handleInputChange}
          onSend={handleSend}
          onStop={abortRequest}
          onKeyPress={handleKeyPress}
          isLoading={isLoading}
          textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
        />
      </DialogContent>
    </Dialog>
  )
})

TestPromptModal.displayName = 'TestPromptModal'
