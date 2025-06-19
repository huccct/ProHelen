'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useEffect, useState } from 'react'

interface TourStep {
  id: string
  target: string
  title: string
  content: string
  position: 'top' | 'bottom' | 'left' | 'right'
  spotlight?: boolean
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    target: '',
    title: 'Welcome to ProHelen!',
    content: 'ProHelen is a visual prompt design tool that helps you create custom AI instructions using drag-and-drop blocks. Let\'s take a quick tour!',
    position: 'top',
  },
  {
    id: 'title-input',
    target: '[data-tour="title-input"]',
    title: 'Name Your Creation',
    content: 'Start by giving your instruction a descriptive title and optional description to help organize your work.',
    position: 'bottom',
  },
  {
    id: 'add-block',
    target: '[data-tour="add-block"]',
    title: 'Add Building Blocks',
    content: 'Click "Add Block" to choose from 18 different instruction blocks. Each block serves a specific purpose in building your AI prompt.',
    position: 'bottom',
  },
  {
    id: 'canvas',
    target: '[data-tour="canvas"]',
    title: 'Visual Canvas',
    content: 'This is your workspace! Drag blocks here, connect them, and watch your instruction come to life. You can drag blocks around and connect them to create complex flows.',
    position: 'bottom',
  },
  {
    id: 'smart-suggestions',
    target: '[data-tour="smart-suggestions"]',
    title: 'Smart Suggestions',
    content: 'Get AI-powered recommendations for blocks that work well together. Our system learns from successful prompt combinations.',
    position: 'bottom',
  },
  {
    id: 'preview-panel',
    target: '[data-tour="preview-panel"]',
    title: 'Live Preview',
    content: 'See your instruction generated in real-time! Switch between different formats and test your prompts instantly.',
    position: 'left',
  },
  {
    id: 'toolbar',
    target: '[data-tour="toolbar"]',
    title: 'Powerful Tools',
    content: 'Use undo/redo, zoom controls, and layout tools to perfect your design. Pro tip: Try Ctrl+Z for undo!',
    position: 'bottom',
  },
]

interface OnboardingTourProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function OnboardingTour({ isOpen, onClose, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)

  const currentTourStep = tourSteps[currentStep]

  useEffect(() => {
    if (!isOpen || !currentTourStep.target)
      return

    const element = document.querySelector(currentTourStep.target) as HTMLElement
    if (element) {
      setTargetElement(element)
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentStep, isOpen, currentTourStep])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
    else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  if (!isOpen)
    return null

  const isWelcomeStep = currentStep === 0
  const isLastStep = currentStep === tourSteps.length - 1

  // 欢迎步骤使用居中Dialog
  if (isWelcomeStep) {
    return (
      <Dialog open={isOpen} onOpenChange={handleSkip}>
        <DialogContent className="bg-background border-border text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              {currentTourStep.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
              {currentTourStep.content}
            </DialogDescription>
          </DialogHeader>

          {/* Progress bar */}
          <div className="my-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>
                Step
                {currentStep + 1}
                {' '}
                of
                {tourSteps.length}
              </span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              />
            </div>
          </div>

          <DialogFooter>
            <div className="flex justify-between items-center w-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground cursor-pointer"
              >
                Skip Tour
              </Button>

              <Button
                size="sm"
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              >
                Next
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // 其他步骤使用Tooltip跟随目标元素
  if (!targetElement)
    return null

  return (
    <>
      {/* Spotlight effect */}
      {currentTourStep.spotlight !== false && (
        <div
          className="fixed z-[9999] border-4 border-primary/30 rounded-lg pointer-events-none transition-all duration-300"
          style={(() => {
            const rect = targetElement.getBoundingClientRect()
            const padding = 8

            // for specific elements, we need to limit the area to avoid overflow
            if (currentTourStep.id === 'canvas' || currentTourStep.id === 'toolbar') {
              return {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.8)',
              }
            }

            // for other elements, we use boundary check logic
            const left = Math.max(0, rect.left - padding)
            const top = Math.max(0, rect.top - padding)
            const right = Math.min(window.innerWidth, rect.right + padding)
            const bottom = Math.min(window.innerHeight, rect.bottom + padding)
            const width = right - left
            const height = bottom - top

            return {
              left,
              top,
              width,
              height,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.8)',
            }
          })()}
        />
      )}

      {/* Tour Tooltip */}
      <div
        className="fixed z-[10000] pointer-events-none"
        style={{
          left: currentTourStep.id === 'canvas' ? targetElement.getBoundingClientRect().left + 50 : targetElement.getBoundingClientRect().left,
          top: currentTourStep.id === 'canvas' ? targetElement.getBoundingClientRect().top + 50 : targetElement.getBoundingClientRect().top,
          width: currentTourStep.id === 'canvas' ? 200 : targetElement.getBoundingClientRect().width,
          height: currentTourStep.id === 'canvas' ? 100 : targetElement.getBoundingClientRect().height,
        }}
      >
        <div
          className={`absolute bg-background border border-border text-foreground p-4 max-w-sm rounded-lg shadow-xl pointer-events-auto ${
            currentTourStep.position === 'top'
              ? 'bottom-full mb-3 left-1/2 transform -translate-x-1/2'
              : currentTourStep.position === 'bottom'
                ? 'top-full mt-3 left-1/2 transform -translate-x-1/2'
                : currentTourStep.position === 'left'
                  ? 'right-full mr-3 top-1/2 transform -translate-y-1/2'
                  : currentTourStep.position === 'right'
                    ? 'left-full ml-3 top-1/2 transform -translate-y-1/2'
                    : 'bottom-full mb-3 left-1/2 transform -translate-x-1/2'
          }`}
        >
          {/* Arrow */}
          <div
            className={`absolute w-2 h-2 bg-background border-border transform rotate-45 ${
              currentTourStep.position === 'top'
                ? 'top-full -mt-1 left-1/2 transform -translate-x-1/2 border-b border-r'
                : currentTourStep.position === 'bottom'
                  ? 'bottom-full -mb-1 left-1/2 transform -translate-x-1/2 border-t border-l'
                  : currentTourStep.position === 'left'
                    ? 'left-full -ml-1 top-1/2 transform -translate-y-1/2 border-t border-r'
                    : currentTourStep.position === 'right'
                      ? 'right-full -mr-1 top-1/2 transform -translate-y-1/2 border-b border-l'
                      : 'top-full -mt-1 left-1/2 transform -translate-x-1/2 border-b border-r'
            }`}
          />

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                {currentTourStep.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {currentTourStep.content}
              </p>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>
                  Step
                  {' '}
                  {currentStep + 1}
                  {' '}
                  of
                  {' '}
                  {tourSteps.length}
                </span>
              </div>
              <div className="h-0.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground text-xs h-7 px-3 cursor-pointer"
              >
                Skip
              </Button>

              <div className="flex gap-1">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    className="text-xs h-7 px-3 cursor-pointer"
                  >
                    Back
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-7 px-3 cursor-pointer"
                >
                  {isLastStep ? 'Done!' : 'Next'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
