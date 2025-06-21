'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle, ChevronRight, Edit, Move, Zap } from 'lucide-react'
import Link from 'next/link'

interface GuidedHeaderProps {
  step: 'arrange' | 'connect' | 'customize' | 'test'
  onNext: () => void
  onPrevious: () => void
  onAdvanced: () => void
  canProceed: boolean
}

const steps = [
  { id: 'arrange', label: 'Arrange Cards', icon: Move },
  { id: 'customize', label: 'Edit Content', icon: Edit },
  { id: 'test', label: 'Test & Save', icon: Zap },
]

export function GuidedHeader({ step, onNext, onPrevious, onAdvanced, canProceed }: GuidedHeaderProps) {
  const currentIndex = steps.findIndex(s => s.id === step)
  const isFirstStep = currentIndex === 0
  const isLastStep = currentIndex === steps.length - 1

  return (
    <div className="border-b bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>

          {/* 步骤进度 */}
          <div className="flex items-center gap-4">
            {steps.map((s, i) => {
              const Icon = s.icon
              const isActive = i === currentIndex
              const isCompleted = i < currentIndex

              return (
                <div key={s.id} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary border-2 border-primary/30'
                      : isCompleted
                        ? 'bg-green-100 text-green-700 border-2 border-green-200'
                        : 'bg-muted text-muted-foreground border-2 border-transparent'
                  }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{s.label}</span>
                    {isCompleted && <CheckCircle className="h-4 w-4" />}
                  </div>
                  {i < steps.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onAdvanced}
            className="hover:bg-muted/50 cursor-pointer"
          >
            Advanced Mode
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={isFirstStep}
              className="hover:bg-muted/50 cursor-pointer"
            >
              Previous
            </Button>
            <Button
              size="sm"
              onClick={onNext}
              disabled={!canProceed}
              className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              {isLastStep ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
