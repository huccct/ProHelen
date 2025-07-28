import type { CustomNodeData } from '@/types/builder'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NODE_CONFIG } from '../constants'

export function useEditingStateCustomNode(
  data: CustomNodeData,
  id: string,
  updateNodeData: (nodeId: string, data: Partial<CustomNodeData>) => void,
) {
  const [isEditing, setIsEditing] = useState(data.isEditing || false)
  const [editContent, setEditContent] = useState(data.content || '')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setIsEditing(data.isEditing || false)
  }, [data.isEditing])

  const handleEdit = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setEditContent(data.content || '')
    updateNodeData(id, { isEditing: true })
    setIsEditing(true)

    setTimeout(() => {
      const textarea = document.querySelector(`[data-node-id="${id}"] textarea`) as HTMLTextAreaElement
      if (textarea) {
        textarea.focus()
        textarea.setSelectionRange(textarea.value.length, textarea.value.length)
      }
    }, NODE_CONFIG.FOCUS_DELAY)
  }, [data.content, id, updateNodeData])

  const handleSave = useCallback(() => {
    updateNodeData(id, { content: editContent, isEditing: false })
    setIsEditing(false)
  }, [id, editContent, updateNodeData])

  const handleCancel = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setEditContent(data.content || '')
    updateNodeData(id, { isEditing: false })
    setIsEditing(false)
  }, [data.content, id, updateNodeData])

  return {
    isEditing,
    editContent,
    setEditContent,
    textareaRef,
    handleEdit,
    handleSave,
    handleCancel,
  }
}
