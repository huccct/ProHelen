'use client'

import type { ExportData, InstructionFormData, PromptPreviewProps } from '@/types/builder'
import { Button } from '@/components/ui/button'
import { EXPORT_CONFIG, UI_CONFIG } from '@/lib/constants'
import { useApiOperations } from '@/lib/hooks/use-api-operations'
import { useContentParser } from '@/lib/hooks/use-content-parser'
import { useEditingState } from '@/lib/hooks/use-editing-state'
import { useBuilderStore } from '@/store/builder'
import { Copy, Download, Edit, Eye, Play, Save } from 'lucide-react'
import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useShallow } from 'zustand/shallow'
import { SaveInstructionModal } from './save-instruction-modal'
import { TestPromptModal } from './test-prompt-modal'

function storeSelector(state: any) {
  return {
    preview: state.preview,
    nodes: state.nodes,
    exportFlowData: state.exportFlowData,
    setPreview: state.setPreview,
  }
}

function createDownloadLink(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
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

interface StatsDisplayProps {
  nodeCount: number
}

const StatsDisplay = memo<StatsDisplayProps>(({
  nodeCount,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <p className="text-xs text-muted-foreground mt-1">
        {t('builder.components.promptPreview.stats.blocks', { count: nodeCount })}
      </p>
    </>
  )
})

StatsDisplay.displayName = 'StatsDisplay'

interface ContentDisplayProps {
  isEditing: boolean
  editedContent: string
  onEditedContentChange: (content: string) => void
  currentContent: string
  textareaRef: React.RefObject<HTMLTextAreaElement>
}

const ContentDisplay = memo<ContentDisplayProps>(({
  isEditing,
  editedContent,
  onEditedContentChange,
  currentContent,
  textareaRef,
}) => {
  const { t } = useTranslation()

  const charCount = useMemo(() => {
    const content = isEditing ? editedContent : currentContent
    return content.length
  }, [isEditing, editedContent, currentContent])

  if (isEditing) {
    return (
      <div className="relative w-full h-full">
        <textarea
          ref={textareaRef}
          value={editedContent}
          onChange={e => onEditedContentChange(e.target.value)}
          className="w-full h-full p-4 text-xs text-foreground leading-relaxed font-mono bg-transparent border-none outline-none resize-none"
          placeholder={t('builder.components.promptPreview.placeholder')}
          style={UI_CONFIG.TEXTAREA_SCROLL_CONFIG}
        />
        {charCount > UI_CONFIG.CHAR_DISPLAY_THRESHOLD && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-muted/90 backdrop-blur-sm rounded text-xs text-muted-foreground pointer-events-none">
            {charCount}
            {' '}
            chars
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div
        className="absolute inset-0 p-4 overflow-auto"
        style={UI_CONFIG.TEXTAREA_SCROLL_CONFIG}
      >
        <pre className="text-xs text-foreground leading-relaxed whitespace-pre-wrap font-mono">
          {currentContent}
        </pre>
      </div>
      {charCount > UI_CONFIG.CHAR_DISPLAY_THRESHOLD && (
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-muted/90 backdrop-blur-sm rounded text-xs text-muted-foreground pointer-events-none">
          {charCount}
          {' '}
          chars
        </div>
      )}
    </div>
  )
})

ContentDisplay.displayName = 'ContentDisplay'

interface ActionButtonsProps {
  hasContent: boolean
  onCopy: () => void
  onExport: () => void
  onTest: () => void
  onSave: () => void
}

const ActionButtons = memo<ActionButtonsProps>(({
  hasContent,
  onCopy,
  onExport,
  onTest,
  onSave,
}) => {
  const { t } = useTranslation()

  const buttonClass = 'cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          disabled={!hasContent}
          className={buttonClass}
        >
          <Copy className="h-3 w-3 mr-1" />
          {t('builder.components.promptPreview.actions.copy')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={!hasContent}
          className={buttonClass}
        >
          <Download className="h-3 w-3 mr-1" />
          {t('builder.components.promptPreview.actions.export')}
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onTest}
        disabled={!hasContent}
        className={`w-full ${buttonClass}`}
      >
        <Play className="h-3 w-3 mr-1" />
        {t('builder.components.promptPreview.actions.test')}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onSave}
        disabled={!hasContent}
        className={`w-full ${buttonClass}`}
      >
        <Save className="h-3 w-3 mr-1" />
        {t('builder.components.promptPreview.actions.save')}
      </Button>
    </div>
  )
})

ActionButtons.displayName = 'ActionButtons'

const HelpText = memo(() => {
  const { t } = useTranslation()

  return (
    <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border">
      <p className="text-xs text-muted-foreground text-center">
        💡
        {' '}
        {t('builder.components.promptPreview.helpText')}
      </p>
    </div>
  )
})

HelpText.displayName = 'HelpText'

export const PromptPreview = memo<PromptPreviewProps>(({ className, style }) => {
  const { t } = useTranslation()
  const { preview, nodes, exportFlowData, setPreview } = useBuilderStore(useShallow(storeSelector))
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showTestModal, setShowTestModal] = useState(false)

  const { generateCustomInstructions, parseEditedContent, generateSystemPrompt } = useContentParser(preview)
  const {
    isEditing,
    editedContent,
    setEditedContent,
    textareaRef,
    toggleEdit,
  } = useEditingState(generateCustomInstructions, parseEditedContent, setPreview)
  const { isSaving, saveInstruction } = useApiOperations()

  const currentContent = useMemo(() => generateCustomInstructions(), [generateCustomInstructions])
  const hasContent = useMemo(() =>
    Boolean(preview.system || preview.human || preview.assistant), [preview])
  const nodeCount = nodes.length

  const handleCopy = useCallback(async () => {
    const contentToCopy = isEditing ? editedContent : preview.system
    if (await copyToClipboard(contentToCopy)) {
      toast.success(t('builder.components.promptPreview.messages.copied'))
    }
    else {
      toast.error(t('builder.components.promptPreview.messages.copyFailed'))
    }
  }, [isEditing, editedContent, preview.system, t])

  const handleExport = useCallback(() => {
    const contentToExport = isEditing ? editedContent : preview.system
    const exportData: ExportData = {
      system: contentToExport,
      temperature: preview.temperature,
      maxTokens: preview.maxTokens,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: EXPORT_CONFIG.MIME_TYPE,
    })

    createDownloadLink(blob, EXPORT_CONFIG.FILENAME)
    toast.success(t('builder.components.promptPreview.messages.exported'))
  }, [isEditing, editedContent, preview, t])

  const handleTest = useCallback(async () => {
    const contentToTest = isEditing ? editedContent : preview.system
    if (!contentToTest.trim()) {
      toast.error(t('builder.components.promptPreview.messages.addContentBeforeTest'))
      return
    }

    if (await copyToClipboard(contentToTest)) {
      toast.success(t('builder.components.promptPreview.messages.systemPromptCopied'))
    }
    else {
      console.warn('Failed to copy to clipboard')
    }

    setShowTestModal(true)
  }, [isEditing, editedContent, preview.system, t])

  const handleSave = useCallback(() => {
    const contentToSave = isEditing ? editedContent : preview.system
    if (!contentToSave.trim()) {
      toast.error(t('builder.components.promptPreview.messages.addContentBeforeSave'))
      return
    }
    setShowSaveModal(true)
  }, [isEditing, editedContent, preview.system, t])

  const handleSaveInstructionSubmit = useCallback(async (instructionData: InstructionFormData) => {
    const systemPrompt = generateSystemPrompt(isEditing ? editedContent : undefined)
    const flowData = exportFlowData()

    const success = await saveInstruction(instructionData, systemPrompt, flowData)
    if (success) {
      setShowSaveModal(false)
    }
  }, [generateSystemPrompt, isEditing, editedContent, exportFlowData, saveInstruction])

  return (
    <aside className={className} style={style} data-tour="preview-panel">
      <div className="p-4 flex flex-col h-full bg-card/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-foreground">
              {t('builder.components.promptPreview.title')}
            </h3>
            <StatsDisplay
              nodeCount={nodeCount}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleEdit}
            className="h-8 w-8 p-0 cursor-pointer"
            title={isEditing ? 'Exit edit mode' : 'Edit content'}
          >
            {isEditing ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex-1 mb-4">
          <div className="relative h-full border border-border rounded-lg bg-background">
            <ContentDisplay
              isEditing={isEditing}
              editedContent={editedContent}
              onEditedContentChange={setEditedContent}
              currentContent={currentContent}
              textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
            />

          </div>
        </div>

        <ActionButtons
          hasContent={hasContent}
          onCopy={handleCopy}
          onExport={handleExport}
          onTest={handleTest}
          onSave={handleSave}
        />

        {!hasContent && <HelpText />}
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

      <TestPromptModal
        open={showTestModal}
        onOpenChange={setShowTestModal}
      />
    </aside>
  )
})

PromptPreview.displayName = 'PromptPreview'
