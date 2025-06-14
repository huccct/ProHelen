'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, HelpCircle, Plus, Sparkles, Zap } from 'lucide-react'

interface EmptyStateGuideProps {
  onAddBlock: () => void
  onStartTour: () => void
  onShowHelp: () => void
}

export function EmptyStateGuide({ onAddBlock, onStartTour, onShowHelp }: EmptyStateGuideProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[100]">
      <div className="max-w-md text-center space-y-6 p-8 pointer-events-auto relative z-[101]">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center">
            <Zap className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Start by adding instruction blocks to create your custom AI prompt.
            Each block adds specific behavior to your AI assistant.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button
            onClick={onAddBlock}
            className="w-full bg-white text-black hover:bg-gray-100 font-medium flex items-center justify-center gap-2 h-11 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Your First Block
            <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onStartTour}
              className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 hover:bg-zinc-800/50 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              Take Tour
            </Button>
            <Button
              variant="outline"
              onClick={onShowHelp}
              className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 hover:bg-zinc-800/50 flex items-center gap-2 cursor-pointer"
            >
              <HelpCircle className="h-4 w-4" />
              Get Help
            </Button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 space-y-2 text-xs text-gray-500">
          <p>
            💡
            <strong>Pro Tip:</strong>
            {' '}
            Start with a "Role Definition" block
          </p>
          <p>
            ⌨️
            <strong>Shortcut:</strong>
            {' '}
            Press F1 for help anytime
          </p>
          <p>
            🔗
            <strong>Connect:</strong>
            {' '}
            Drag from one block to another to link them
          </p>
        </div>
      </div>
    </div>
  )
}
