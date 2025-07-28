/** load data */
import { useBuilderStore } from '@/store/builder'
import * as Sentry from '@sentry/nextjs'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'

export function useDataLoader() {
  const searchParams = useSearchParams()
  const { importFlowData, setTitle, setDescription, resetFlow } = useBuilderStore()

  const templateId = searchParams.get('template')
  const instructionId = searchParams.get('instruction')

  const loadTemplate = useCallback(async (id: string) => {
    const startTime = performance.now()

    try {
      const response = await fetch(`/api/templates/${id}`)
      const template = await response.json()

      if (!template)
        return

      setTitle(template.title)
      setDescription(template.description)

      if (template.flowData) {
        importFlowData(template.flowData)
      }

      const endTime = performance.now()
      Sentry.captureMessage('Template Load Performance', {
        level: 'info',
        extra: {
          templateId: id,
          loadTime: endTime - startTime,
          hasFlowData: !!template.flowData,
        },
      })
    }
    catch (error) {
      Sentry.captureException(error, {
        extra: { templateId: id, action: 'load_template' },
      })
      console.error('Failed to load template:', error)
    }
  }, [importFlowData, setTitle, setDescription])

  const loadInstruction = useCallback(async (id: string) => {
    const startTime = performance.now()

    try {
      const response = await fetch(`/api/instructions/${id}`)
      const data = await response.json()

      if (!data.instruction)
        return

      const instruction = data.instruction
      setTitle(instruction.title)
      setDescription(instruction.description || '')

      if (instruction.flowData) {
        importFlowData(instruction.flowData)
      }

      const endTime = performance.now()
      Sentry.captureMessage('Instruction Load Performance', {
        level: 'info',
        extra: {
          instructionId: id,
          loadTime: endTime - startTime,
          hasFlowData: !!instruction.flowData,
        },
      })
    }
    catch (error) {
      Sentry.captureException(error, {
        extra: { instructionId: id, action: 'load_instruction' },
      })
      console.error('Failed to load instruction:', error)
    }
  }, [importFlowData, setTitle, setDescription])

  useEffect(() => {
    if (templateId) {
      loadTemplate(templateId)
    }
    else if (instructionId) {
      loadInstruction(instructionId)
    }
    else {
      resetFlow()
    }
  }, [templateId, instructionId, loadTemplate, loadInstruction, resetFlow])

  return {
    templateId,
    instructionId,
    isExistingContent: !!(templateId || instructionId),
  }
}
