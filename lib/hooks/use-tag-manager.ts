import type { FormState } from '@/types/builder'
import { sanitizeTag } from '@/app/(root)/builder/_components/save-instruction-modal'
import { useCallback } from 'react'
import { FORM_CONFIG } from '../constants'

// eslint-disable-next-line ts/no-unsafe-function-type
export function useTagManager(formState: FormState, updateField: Function) {
  const addTag = useCallback(() => {
    const sanitizedTag = sanitizeTag(formState.tagInput)

    if (!sanitizedTag)
      return
    if (formState.tags.includes(sanitizedTag))
      return
    if (formState.tags.length >= FORM_CONFIG.MAX_TAGS_COUNT)
      return

    updateField('tags', [...formState.tags, sanitizedTag])
    updateField('tagInput', '')
  }, [formState.tagInput, formState.tags, updateField])

  const removeTag = useCallback((tagToRemove: string) => {
    updateField('tags', formState.tags.filter(tag => tag !== tagToRemove))
  }, [formState.tags, updateField])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (FORM_CONFIG.TAG_SEPARATORS.includes(e.key as 'Enter' | ',')) {
      e.preventDefault()
      addTag()
    }
  }, [addTag])

  return {
    addTag,
    removeTag,
    handleKeyPress,
    canAddTag: formState.tagInput.trim() && formState.tags.length < FORM_CONFIG.MAX_TAGS_COUNT,
  }
}
