import type { ParsedContent, PreviewContent } from '@/types/builder'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export function useEditingState(
  generateCustomInstructions: () => string,
  parseEditedContent: (content: string) => ParsedContent,
  setPreview: (preview: PreviewContent) => void,
) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditedContent(generateCustomInstructions())
  }, [generateCustomInstructions])

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(0, 0)
    }
  }, [isEditing])

  const toggleEdit = useCallback(() => {
    if (isEditing) {
      try {
        const parsedContent = parseEditedContent(editedContent)
        setPreview(parsedContent)
        toast.success('Content updated successfully!')
      }
      catch {
        toast.error('Failed to parse content. Please check the format.')
        return
      }
    }
    setIsEditing(prev => !prev)
  }, [isEditing, editedContent, parseEditedContent, setPreview])

  return {
    isEditing,
    editedContent,
    setEditedContent,
    textareaRef,
    toggleEdit,
  }
}
