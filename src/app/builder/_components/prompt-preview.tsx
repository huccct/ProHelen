'use client'

import { Button } from '@/components/ui/button'

interface PromptPreviewProps {
  className?: string
}

export function PromptPreview({ className }: PromptPreviewProps) {
  return (
    <aside className={className}>
      <div className="p-4 flex flex-col h-full">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Preview</h3>

        <div className="flex-1 border border-gray-800 rounded-lg p-4 font-mono text-sm text-gray-400 mb-4">
          Your custom instructions will appear here as you build your flow...
        </div>

        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full cursor-pointer bg-transparent hover:bg-white hover:text-black text-white border-white/20 hover:border-white transition-all duration-200"
            onClick={() => navigator.clipboard.writeText('Your prompt here')}
          >
            Copy to Clipboard
          </Button>
          <Button
            variant="outline"
            className="w-full cursor-pointer bg-transparent hover:bg-white hover:text-black text-white border-white/20 hover:border-white transition-all duration-200"
          >
            Save Template
          </Button>
        </div>
      </div>
    </aside>
  )
}
