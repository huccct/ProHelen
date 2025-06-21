'use client'

import { Button } from '@/components/ui/button'
import { Edit, HelpCircle, Lightbulb, PlayCircle, Plus, Zap } from 'lucide-react'

interface EmptyStateGuideProps {
  onAddBlock: () => void
  onStartTour: () => void
  onShowHelp: () => void
}

export function EmptyStateGuide({ onAddBlock, onStartTour, onShowHelp }: EmptyStateGuideProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[200]">
      <div className="max-w-md mx-auto text-center pointer-events-auto">
        <div className="w-16 h-16 bg-muted/50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Lightbulb className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Ready to build your AI assistant?
        </h3>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          Start by adding instruction blocks to the canvas. They'll automatically connect in a logical flow, making prompt creation simple and intuitive.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button
            onClick={onAddBlock}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Your First Block
          </Button>
          <Button
            variant="outline"
            onClick={onStartTour}
            className="w-full sm:w-auto flex items-center gap-2 cursor-pointer"
          >
            <PlayCircle className="h-4 w-4" />
            Take the Tour
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Plus className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">Add Blocks</h4>
                <p className="text-xs text-muted-foreground">Choose from 15+ instruction types</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">Auto-Connect</h4>
                <p className="text-xs text-muted-foreground">Smart connections create logical flow</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Edit className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">Customize</h4>
                <p className="text-xs text-muted-foreground">Edit content to fit your needs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowHelp}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 cursor-pointer"
          >
            <HelpCircle className="h-4 w-4" />
            Need help? View guide
          </Button>
        </div>
      </div>
    </div>
  )
}
