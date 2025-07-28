import type { ParsedContent, PreviewContent } from '@/types/builder'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { CONTENT_HEADERS } from '../constants'

export function useContentParser(preview: PreviewContent) {
  const { t } = useTranslation()

  const generateCustomInstructions = useCallback((): string => {
    if (!preview.system && !preview.human && !preview.assistant) {
      return t('builder.components.promptPreview.placeholder')
    }

    const sections: string[] = []

    if (preview.system) {
      sections.push(preview.system)
    }

    if (preview.human?.trim()) {
      sections.push(`${CONTENT_HEADERS.USER_INTERACTION}\n${preview.human}`)
    }

    if (preview.assistant?.trim()) {
      sections.push(`${CONTENT_HEADERS.RESPONSE_GUIDELINES}\n${preview.assistant}`)
    }

    return sections.join('\n\n').trim()
  }, [preview, t])

  const parseEditedContent = useCallback((editedContent: string): ParsedContent => {
    const lines = editedContent.split('\n')
    let systemContent = ''
    let humanContent = ''
    let assistantContent = ''
    let currentSection: 'system' | 'human' | 'assistant' = 'system'

    for (const line of lines) {
      if (line.includes(CONTENT_HEADERS.USER_INTERACTION)) {
        currentSection = 'human'
        continue
      }
      if (line.includes(CONTENT_HEADERS.RESPONSE_GUIDELINES)) {
        currentSection = 'assistant'
        continue
      }

      const content = `${line}\n`
      switch (currentSection) {
        case 'system':
          systemContent += content
          break
        case 'human':
          humanContent += content
          break
        case 'assistant':
          assistantContent += content
          break
      }
    }

    return {
      system: systemContent.trim(),
      human: humanContent.trim(),
      assistant: assistantContent.trim(),
    }
  }, [])

  const generateSystemPrompt = useCallback((editedContent?: string): string => {
    if (editedContent) {
      const parsed = parseEditedContent(editedContent)
      return parsed.system || t('builder.components.promptPreview.systemPromptPlaceholder')
    }

    return preview.system || t('builder.components.promptPreview.systemPromptPlaceholder')
  }, [preview.system, parseEditedContent, t])

  return {
    generateCustomInstructions,
    parseEditedContent,
    generateSystemPrompt,
  }
}
