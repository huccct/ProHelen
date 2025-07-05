'use client'

import type { InstructionFormData } from './save-instruction-modal'
import { Button } from '@/components/ui/button'
import { useBuilderStore } from '@/store/builder'
import { Copy, Download, Play, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useShallow } from 'zustand/shallow'
import { SaveInstructionModal } from './save-instruction-modal'
import { TestPromptModal } from './test-prompt-modal'

interface PromptPreviewProps {
  className?: string
  style?: React.CSSProperties
}

function selector(state: any) {
  return {
    preview: state.preview,
    nodes: state.nodes,
    exportFlowData: state.exportFlowData,
  }
}

export function PromptPreview({ className, style }: PromptPreviewProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { preview, nodes, exportFlowData } = useBuilderStore(useShallow(selector))
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showTestModal, setShowTestModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const generateCustomInstructions = () => {
    if (!preview.system && !preview.human && !preview.assistant) {
      return t('builder.components.promptPreview.placeholder')
    }

    let content = ''

    if (preview.system) {
      content += preview.system
    }

    if (preview.human && preview.human.trim()) {
      content += `\n\n## User Interaction Guidelines\n${preview.human}`
    }

    if (preview.assistant && preview.assistant.trim()) {
      content += `\n\n## Response Guidelines\n${preview.assistant}`
    }

    return content.trim()
  }

  const generateSystemPrompt = () => {
    if (!preview.system) {
      return t('builder.components.promptPreview.systemPromptPlaceholder')
    }

    return preview.system
  }

  const currentContent = generateCustomInstructions()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(preview.system)
      toast.success(t('builder.components.promptPreview.messages.copied'))
    }
    catch {
      toast.error(t('builder.components.promptPreview.messages.copyFailed'))
    }
  }

  const handleExport = () => {
    const promptData = {
      system: preview.system,
      temperature: preview.temperature,
      maxTokens: preview.maxTokens,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(promptData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'prompt-export.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(t('builder.components.promptPreview.messages.exported'))
  }

  const handleTest = async () => {
    if (!preview.system.trim()) {
      toast.error(t('builder.components.promptPreview.messages.addContentBeforeTest'))
      return
    }

    // Auto-copy the system prompt to clipboard
    try {
      await navigator.clipboard.writeText(preview.system)
      toast.success(t('builder.components.promptPreview.messages.systemPromptCopied'))
    }
    catch {
      // If clipboard fails, still open the modal
      console.warn('Failed to copy to clipboard')
    }

    setShowTestModal(true)
  }

  const handleSave = () => {
    if (!preview.system.trim()) {
      toast.error(t('builder.components.promptPreview.messages.addContentBeforeSave'))
      return
    }
    setShowSaveModal(true)
  }

  const checkIfDraft = async (id: string) => {
    try {
      const response = await fetch(`/api/instructions/${id}`)
      const data = await response.json()
      return data.instruction?.isDraft || false
    }
    catch (error) {
      console.error('Error checking draft status:', error)
      return false
    }
  }

  const handleSaveInstructionSubmit = async (instructionData: InstructionFormData) => {
    try {
      setIsSaving(true)

      const flowData = exportFlowData()
      const systemPrompt = generateSystemPrompt()
      const searchParams = new URLSearchParams(window.location.search)
      const instructionId = searchParams.get('instruction')
      const isDraft = instructionId && await checkIfDraft(instructionId)

      const response = await fetch(isDraft ? `/api/instructions/${instructionId}` : '/api/instructions', {
        method: isDraft ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: instructionData.title,
          description: instructionData.description,
          category: instructionData.category,
          content: systemPrompt,
          tags: instructionData.tags,
          flowData,
          isDraft: false, // Convert from draft to regular instruction
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save instruction')
      }

      await response.json()
      toast.success('Instruction saved successfully!')
      setShowSaveModal(false)

      // Redirect to instructions page
      router.push('/my-instructions')
    }
    catch (error) {
      console.error('Error saving instruction:', error)
      toast.error('Failed to save, please try again')
    }
    finally {
      setIsSaving(false)
    }
  }

  const hasContent = preview.system || preview.human || preview.assistant
  const nodeCount = nodes.length

  return (
    <aside className={className} style={style} data-tour="preview-panel">
      <div className="p-4 flex flex-col h-full bg-card/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-foreground">{t('builder.components.promptPreview.title')}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {t('builder.components.promptPreview.stats.blocks', { count: nodeCount })}
            </p>
          </div>
        </div>

        <div className="flex-1 mb-4">
          <div className="relative h-full border border-border rounded-lg bg-background">
            <div className="absolute inset-0 p-4 overflow-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <pre className="text-xs text-foreground leading-relaxed whitespace-pre-wrap font-mono">
                {currentContent}
              </pre>
            </div>

            {hasContent && (
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                {currentContent.length}
                {' '}
                chars
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!hasContent}
              className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Copy className="h-3 w-3 mr-1" />
              {t('builder.components.promptPreview.actions.copy')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={!hasContent}
              className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-3 w-3 mr-1" />
              {t('builder.components.promptPreview.actions.export')}
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={!hasContent}
            className="w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-3 w-3 mr-1" />
            {t('builder.components.promptPreview.actions.test')}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={!hasContent}
            className="w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-3 w-3 mr-1" />
            {t('builder.components.promptPreview.actions.save')}
          </Button>
        </div>

        {!hasContent && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground text-center">
              💡
              {' '}
              {t('builder.components.promptPreview.helpText')}
            </p>
          </div>
        )}
      </div>

      <style jsx>
        {`
        div::-webkit-scrollbar {
          display: none;
        }
      `}
      </style>

      <SaveInstructionModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        onSave={handleSaveInstructionSubmit}
        isLoading={isSaving}
      />

      <TestPromptModal open={showTestModal} onOpenChange={setShowTestModal} />
    </aside>
  )
}
