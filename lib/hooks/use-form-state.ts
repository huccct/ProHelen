import type { FormState } from '@/types/builder'
import { useCallback, useState } from 'react'

export function useFormState(initialTitle: string, initialDescription: string, t: any) {
  const [formState, setFormState] = useState<FormState>({
    title: '',
    description: '',
    category: t('builder.modals.saveInstruction.categories.general'),
    tags: [],
    tagInput: '',
  })

  const [originalValues, setOriginalValues] = useState({
    title: '',
    description: '',
  })

  const initializeForm = useCallback((title: string, description: string) => {
    setOriginalValues({ title, description })
    setFormState(prev => ({
      ...prev,
      title,
      description,
    }))
  }, [])

  const resetForm = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      title: '',
      description: '',
      category: t('builder.modals.saveInstruction.categories.general'),
      tags: [],
      tagInput: '',
    }))
  }, [t])

  const updateField = useCallback(<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }, [])

  const updateFields = useCallback((updates: Partial<FormState>) => {
    setFormState(prev => ({ ...prev, ...updates }))
  }, [])

  return {
    formState,
    originalValues,
    initializeForm,
    resetForm,
    updateField,
    updateFields,
  }
}
