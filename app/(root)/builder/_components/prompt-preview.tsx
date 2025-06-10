'use client'

import { Button } from '@/components/ui/button'
import { useBuilderStore } from '@/store/builder'
import { Code2, Copy, Download, Eye, Save, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useShallow } from 'zustand/shallow'

interface PromptPreviewProps {
  className?: string
  style?: React.CSSProperties
}

function selector(state: any) {
  return {
    preview: state.preview,
    nodes: state.nodes,
  }
}

type FormatType = 'custom-instructions' | 'system-prompt' | 'raw-text'

export function PromptPreview({ className, style }: PromptPreviewProps) {
  const { preview, nodes } = useBuilderStore(useShallow(selector))
  const [currentFormat, setCurrentFormat] = useState<FormatType>('custom-instructions')

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
      parts.push(`System: ${preview.system}`)
    if (preview.human && preview.human.trim())
      parts.push(`Human: ${preview.human}`)
    if (preview.assistant && preview.assistant.trim())
      parts.push(`Assistant: ${preview.assistant}`)

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

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent)
    toast.success('Copied to clipboard!')
  }

  const handleExport = () => {
    const blob = new Blob([currentContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `custom-instructions-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported successfully!')
  }

  const handleSaveTemplate = () => {
    // TODO: Implement template saving
    toast.info('Template saving coming soon!')
  }

  const handleTestPrompt = () => {
    // TODO: Implement prompt testing
    toast.info('Prompt testing coming soon!')
  }

  const formatButtons = [
    { id: 'custom-instructions' as FormatType, label: 'Custom Instructions', icon: <Sparkles className="h-3 w-3" /> },
    { id: 'system-prompt' as FormatType, label: 'System Prompt', icon: <Code2 className="h-3 w-3" /> },
    { id: 'raw-text' as FormatType, label: 'Raw Text', icon: <Eye className="h-3 w-3" /> },
  ]

  const hasContent = preview.system || preview.human || preview.assistant
  const nodeCount = nodes.length

  return (
    <aside className={className} style={style}>
      <div className="p-4 flex flex-col h-full bg-zinc-950/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-white">Prompt Preview</h3>
            <p className="text-xs text-gray-400 mt-1">
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
        <div className="flex gap-1 mb-4 p-1 bg-zinc-900 rounded-lg">
          {formatButtons.map(button => (
            <button
              key={button.id}
              onClick={() => setCurrentFormat(button.id)}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs rounded transition-all duration-200 ${
                currentFormat === button.id
                  ? 'bg-white text-black font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {button.icon}
              <span className="hidden sm:inline">{button.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 mb-4">
          <div className="relative h-full border border-gray-800 rounded-lg bg-black">
            <div className="absolute inset-0 p-4 overflow-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <pre className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-mono">
                {currentContent}
              </pre>
            </div>

            {/* Character count */}
            {hasContent && (
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-zinc-800 rounded text-xs text-gray-400">
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
              className="bg-transparent border-gray-700 text-white hover:text-white hover:border-gray-500 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={!hasContent}
              className="bg-transparent border-gray-700 text-white hover:text-white hover:border-gray-500 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleTestPrompt}
            disabled={!hasContent}
            className="w-full bg-transparent border-gray-700 text-white hover:text-white hover:border-gray-500 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Test Prompt
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveTemplate}
            disabled={!hasContent}
            className="w-full bg-transparent border-gray-700 text-white hover:text-white hover:border-gray-500 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-3 w-3 mr-1" />
            Save as Template
          </Button>
        </div>

        {/* Help Text */}
        {!hasContent && (
          <div className="mt-4 p-3 bg-zinc-900/50 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-400 text-center">
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
    </aside>
  )
}
