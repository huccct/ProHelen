'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface PromptPreviewProps {
  className?: string
  content?: string
}

export function PromptPreview({ className, content = '' }: PromptPreviewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content || 'Your prompt here')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <aside className={className}>
      <div className="p-4 flex flex-col h-full">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Preview</h3>

        <div className="flex-1 border border-gray-800 rounded-lg p-4 font-mono text-sm text-gray-400 mb-4 overflow-auto scrollbar">
          {content || 'Your custom instructions will appear here as you build your flow...'}
        </div>

        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full cursor-pointer bg-transparent hover:bg-blue-500 hover:text-white text-white border-white/20 hover:border-blue-500 transition-all duration-200"
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </Button>
          <Button
            variant="outline"
            className="w-full cursor-pointer bg-transparent hover:bg-blue-500 hover:text-white text-white border-white/20 hover:border-blue-500 transition-all duration-200"
          >
            Save Template
          </Button>
        </div>
      </div>
    </aside>
  )
}
