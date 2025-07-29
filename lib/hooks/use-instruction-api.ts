import type { ApiError, FetchInstructionsParams, Instruction } from '@/types/my-instructions'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { GRID_CONFIG } from '../constants'

export function useInstructionApi() {
  const { t } = useTranslation()

  const fetchInstructions = useCallback(async (params: FetchInstructionsParams) => {
    const { page = 1, searchQuery, filter, sortBy } = params
    const urlParams = new URLSearchParams()

    if (searchQuery)
      urlParams.set('search', searchQuery)
    if (filter && filter !== 'all')
      urlParams.set('filter', filter)
    if (sortBy)
      urlParams.set('sortBy', sortBy)

    urlParams.set('limit', GRID_CONFIG.PAGE_SIZE.toString())
    urlParams.set('offset', ((page - 1) * GRID_CONFIG.PAGE_SIZE).toString())

    const response = await fetch(`/api/instructions?${urlParams}`)

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({}))
      throw new Error(errorData.error || t('myInstructions.failedToLoad'))
    }

    return response.json()
  }, [t])

  const deleteInstruction = useCallback(async (instructionId: string) => {
    const response = await fetch(`/api/instructions/${instructionId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete instruction')
    }

    return response.json()
  }, [])

  const updateInstruction = useCallback(async (instruction: Instruction) => {
    const response = await fetch(`/api/instructions/${instruction.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(instruction),
    })

    if (!response.ok) {
      throw new Error('Failed to update instruction')
    }

    return response.json()
  }, [])

  const duplicateInstruction = useCallback(async (instruction: Instruction) => {
    const response = await fetch('/api/instructions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `${instruction.title} (Copy)`,
        description: instruction.description,
        content: instruction.content,
        tags: instruction.tags,
        flowData: instruction.flowData,
        category: instruction.category,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to duplicate instruction')
    }

    return response.json()
  }, [])

  const publishInstruction = useCallback(async (instructionId: string) => {
    const response = await fetch(`/api/instructions/${instructionId}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      throw new Error('Failed to publish instruction')
    }

    return response.json()
  }, [])

  const unpublishInstruction = useCallback(async (instructionId: string) => {
    const response = await fetch(`/api/instructions/${instructionId}/publish`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to unpublish instruction')
    }

    return response.json()
  }, [])

  return {
    fetchInstructions,
    deleteInstruction,
    updateInstruction,
    duplicateInstruction,
    publishInstruction,
    unpublishInstruction,
  }
}
