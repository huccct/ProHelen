import type { InstructionFormData } from '@/app/(root)/builder/_components/save-instruction-modal'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

export function useApiOperations() {
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const checkIfDraft = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/instructions/${id}`)
      const data = await response.json()
      return data.instruction?.isDraft || false
    }
    catch (error) {
      console.error('Error checking draft status:', error)
      return false
    }
  }, [])

  const saveInstruction = useCallback(async (
    instructionData: InstructionFormData,
    systemPrompt: string,
    flowData: any,
  ) => {
    try {
      setIsSaving(true)

      const searchParams = new URLSearchParams(window.location.search)
      const instructionId = searchParams.get('instruction')
      const isDraft = instructionId ? await checkIfDraft(instructionId) : false

      const endpoint = isDraft ? `/api/instructions/${instructionId}` : '/api/instructions'
      const method = isDraft ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: instructionData.title,
          description: instructionData.description,
          category: instructionData.category,
          content: systemPrompt,
          tags: instructionData.tags,
          flowData,
          isDraft: false,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save instruction')
      }

      await response.json()
      toast.success('Instruction saved successfully!')
      router.push('/my-instructions')
      return true
    }
    catch (error) {
      console.error('Error saving instruction:', error)
      toast.error('Failed to save, please try again')
      return false
    }
    finally {
      setIsSaving(false)
    }
  }, [checkIfDraft, router])

  return {
    isSaving,
    saveInstruction,
  }
}
