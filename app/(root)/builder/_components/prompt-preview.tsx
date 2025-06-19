'use client'

import type { InstructionFormData } from './save-instruction-modal'
import { Button } from '@/components/ui/button'
import { useBuilderStore } from '@/store/builder'
import { Code2, Copy, Download, Eye, Play, Save, Sparkles } from 'lucide-react'
import { useState } from 'react'
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
    title: state.title,
    description: state.description,
    exportFlowData: state.exportFlowData,
  }
}

type FormatType = 'custom-instructions' | 'system-prompt' | 'raw-text'

export function PromptPreview({ className, style }: PromptPreviewProps) {
  const { preview, nodes, title, description, exportFlowData } = useBuilderStore(useShallow(selector))
  const [currentFormat, setCurrentFormat] = useState<FormatType>('custom-instructions')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showTestModal, setShowTestModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const generateCustomInstructions = () => {
    if (!preview.system && !preview.human && !preview.assistant) {
      return 'Start building your custom instructions by adding blocks to the canvas...'
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
      return 'No system prompt configured yet. Add instruction blocks to generate a system prompt.'
    }

    return preview.system
  }

  const generateRawText = () => {
    const parts = []
    if (preview.system)
      parts.push(`System:\n${preview.system}`)
    if (preview.human && preview.human.trim())
      parts.push(`Human:\n${preview.human}`)
    if (preview.assistant && preview.assistant.trim())
      parts.push(`Assistant:\n${preview.assistant}`)

    return parts.length > 0 ? parts.join('\n\n') : 'No content to display'
  }

  const formatContent = (format: FormatType) => {
    switch (format) {
      case 'custom-instructions':
        return generateCustomInstructions()
      case 'system-prompt':
        return generateSystemPrompt()
      case 'raw-text':
        return generateRawText()
      default:
        return generateCustomInstructions()
    }
  }

  const currentContent = formatContent(currentFormat)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(preview.system)
      toast.success('Prompt copied to clipboard!')
    }
    catch {
      toast.error('Failed to copy prompt')
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
    toast.success('Prompt exported successfully!')
  }

  const handleTest = async () => {
    if (!preview.system.trim()) {
      toast.error('Please add some content to your prompt before testing')
      return
    }

    // Auto-copy the system prompt to clipboard
    try {
      await navigator.clipboard.writeText(preview.system)
      toast.success('System prompt copied to clipboard!')
    }
    catch {
      // If clipboard fails, still open the modal
      console.warn('Failed to copy to clipboard')
    }

    setShowTestModal(true)
  }

  const handleSave = () => {
    if (!preview.system.trim()) {
      toast.error('Please add some content to your prompt before saving')
      return
    }
    setShowSaveModal(true)
  }

  const handleSaveInstructionSubmit = async (instructionData: InstructionFormData) => {
    try {
      setIsSaving(true)

      const flowData = exportFlowData()
      const systemPrompt = generateSystemPrompt()

      const response = await fetch('/api/instructions', {
        method: 'POST',
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
          isFavorite: instructionData.isFavorite,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save instruction')
      }

      await response.json()
      toast.success('Instruction saved successfully!')
      setShowSaveModal(false)
    }
    catch (error) {
      console.error('Error saving instruction:', error)
      toast.error('Failed to save, please try again')
    }
    finally {
      setIsSaving(false)
    }
  }

  const formatButtons = [
    { id: 'custom-instructions' as FormatType, label: 'Custom Instructions', icon: <Sparkles className="h-3 w-3" /> },
    { id: 'system-prompt' as FormatType, label: 'System Prompt', icon: <Code2 className="h-3 w-3" /> },
    { id: 'raw-text' as FormatType, label: 'Raw Text', icon: <Eye className="h-3 w-3" /> },
  ]

  const hasContent = preview.system || preview.human || preview.assistant
  const nodeCount = nodes.length

  return (
    <aside className={className} style={style} data-tour="preview-panel">
      <div className="p-4 flex flex-col h-full bg-card/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-foreground">Prompt Preview</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {nodeCount}
              {' '}
              block
              {nodeCount !== 1 ? 's' : ''}
              {' '}
              configured
            </p>
          </div>
        </div>

        {/* Format Tabs */}
        <div className="flex gap-1 mb-4 p-1 bg-muted rounded-lg">
          {formatButtons.map(button => (
            <button
              key={button.id}
              onClick={() => setCurrentFormat(button.id)}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs rounded transition-all duration-200 cursor-pointer ${
                currentFormat === button.id
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              {button.icon}
              <span className="hidden sm:inline">{button.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 mb-4">
          <div className="relative h-full border border-border rounded-lg bg-background">
            <div className="absolute inset-0 p-4 overflow-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <pre className="text-xs text-foreground leading-relaxed whitespace-pre-wrap font-mono">
                {currentContent}
              </pre>
            </div>

            {/* Character count */}
            {hasContent && (
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                {currentContent.length}
                {' '}
                chars
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
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
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={!hasContent}
              className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-3 w-3 mr-1" />
              Export
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
            Test
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={!hasContent}
            className="w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
        </div>

        {/* Help Text */}
        {!hasContent && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground text-center">
              💡 Add instruction blocks to your canvas to see the generated prompt here
            </p>
          </div>
        )}
      </div>

      {/* Hide webkit scrollbar */}
      <style jsx>
        {`
        div::-webkit-scrollbar {
          display: none;
        }
      `}
      </style>

      {/* Save Instruction Modal */}
      <SaveInstructionModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        onSave={handleSaveInstructionSubmit}
        isLoading={isSaving}
        initialTitle={title}
        initialDescription={description}
      />

      <TestPromptModal open={showTestModal} onOpenChange={setShowTestModal} />
    </aside>
  )
}
