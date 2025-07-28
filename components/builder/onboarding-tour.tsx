'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface TourStep {
  id: string
  target: string
  title: string
  content: string
  position: 'top' | 'bottom' | 'left' | 'right'
  spotlight?: boolean
}

interface OnboardingTourProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

const TOOLTIP_CONFIG = {
  WIDTH: 320,
  HEIGHT: 200,
  MARGIN: 12,
  PADDING: 8,
} as const

interface BoundaryCheck {
  canPlaceLeft: boolean
  canPlaceRight: boolean
  canPlaceTop: boolean
  canPlaceBottom: boolean
  canCenterHorizontally: boolean
  centerX: number
  tooltipHalfWidth: number
}

export function OnboardingTour({ isOpen, onClose, onComplete }: OnboardingTourProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      target: '',
      title: t('builder.components.onboardingTour.steps.welcome.title'),
      content: t('builder.components.onboardingTour.steps.welcome.content'),
      position: 'top',
    },
    {
      id: 'title-input',
      target: '[data-tour="title-input"]',
      title: t('builder.components.onboardingTour.steps.titleInput.title'),
      content: t('builder.components.onboardingTour.steps.titleInput.content'),
      position: 'bottom',
    },
    {
      id: 'add-block',
      target: '[data-tour="add-block"]',
      title: t('builder.components.onboardingTour.steps.addBlock.title'),
      content: t('builder.components.onboardingTour.steps.addBlock.content'),
      position: 'bottom',
    },
    {
      id: 'canvas',
      target: '[data-tour="canvas"]',
      title: t('builder.components.onboardingTour.steps.canvas.title'),
      content: t('builder.components.onboardingTour.steps.canvas.content'),
      position: 'bottom',
    },
    {
      id: 'smart-suggestions',
      target: '[data-tour="smart-suggestions"]',
      title: t('builder.components.onboardingTour.steps.smartSuggestions.title'),
      content: t('builder.components.onboardingTour.steps.smartSuggestions.content'),
      position: 'bottom',
    },
    {
      id: 'preview-panel',
      target: '[data-tour="preview-panel"]',
      title: t('builder.components.onboardingTour.steps.previewPanel.title'),
      content: t('builder.components.onboardingTour.steps.previewPanel.content'),
      position: 'left',
    },
    {
      id: 'toolbar',
      target: '[data-tour="toolbar"]',
      title: t('builder.components.onboardingTour.steps.toolbar.title'),
      content: t('builder.components.onboardingTour.steps.toolbar.content'),
      position: 'bottom',
    },
  ]

  const currentTourStep = tourSteps[currentStep]

  const ProgressBar = ({ variant = 'default' }: { variant?: 'default' | 'compact' }) => {
    const progressPercentage = ((currentStep + 1) / tourSteps.length) * 100

    return (
      <div className={variant === 'compact' ? '' : 'my-4'}>
        <div className={`flex justify-between text-xs text-muted-foreground ${variant === 'compact' ? 'mb-1' : 'mb-2'}`}>
          <span className="whitespace-nowrap">
            {t('builder.components.onboardingTour.progress.step')}
            {' '}
            {currentStep + 1}
            {' '}
            {t('builder.components.onboardingTour.progress.of')}
            {' '}
            {tourSteps.length}
            {' '}
            {t('builder.components.onboardingTour.progress.steps', '步')}
          </span>
        </div>
        <div className={`${variant === 'compact' ? 'h-0.5' : 'h-1'} bg-muted rounded-full overflow-hidden`}>
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    )
  }

  /**
   * boundary check
   * @param rect - the bounding client rect of the target element
   * @returns the boundary check result
   */
  const getBoundaryCheck = (rect: DOMRect): BoundaryCheck => {
    const canPlaceLeft = rect.left - TOOLTIP_CONFIG.WIDTH - TOOLTIP_CONFIG.MARGIN >= 0
    const canPlaceRight = rect.right + TOOLTIP_CONFIG.WIDTH + TOOLTIP_CONFIG.MARGIN <= window.innerWidth
    const canPlaceTop = rect.top - TOOLTIP_CONFIG.HEIGHT - TOOLTIP_CONFIG.MARGIN >= 0
    const canPlaceBottom = rect.bottom + TOOLTIP_CONFIG.HEIGHT + TOOLTIP_CONFIG.MARGIN <= window.innerHeight

    const centerX = rect.left + rect.width / 2
    const tooltipHalfWidth = TOOLTIP_CONFIG.WIDTH / 2
    const canCenterHorizontally = centerX - tooltipHalfWidth >= 0 && centerX + tooltipHalfWidth <= window.innerWidth

    return {
      canPlaceLeft,
      canPlaceRight,
      canPlaceTop,
      canPlaceBottom,
      canCenterHorizontally,
      centerX,
      tooltipHalfWidth,
    }
  }

  const calculateTooltipPosition = (rect: DOMRect, position: string, stepId: string): string => {
    if (stepId === 'canvas') {
      return 'top-4 left-4'
    }

    const { canPlaceLeft, canPlaceRight, canPlaceTop, canPlaceBottom, canCenterHorizontally, centerX, tooltipHalfWidth } = getBoundaryCheck(rect)

    const fallbackStrategies = {
      left: () => canPlaceRight
        ? 'left-full ml-3 top-1/2 transform -translate-y-1/2'
        : canPlaceBottom && canCenterHorizontally
          ? 'top-full mt-3 left-1/2 transform -translate-x-1/2'
          : 'top-full mt-3 left-0',

      right: () => canPlaceLeft
        ? 'right-full mr-3 top-1/2 transform -translate-y-1/2'
        : canPlaceBottom && canCenterHorizontally
          ? 'top-full mt-3 left-1/2 transform -translate-x-1/2'
          : 'top-full mt-3 right-0',

      top: () => canCenterHorizontally
        ? 'top-full mt-3 left-1/2 transform -translate-x-1/2'
        : centerX < tooltipHalfWidth
          ? 'top-full mt-3 left-0'
          : 'top-full mt-3 right-0',

      bottom: () => canCenterHorizontally
        ? 'bottom-full mb-3 left-1/2 transform -translate-x-1/2'
        : centerX < tooltipHalfWidth
          ? 'bottom-full mb-3 left-0'
          : 'bottom-full mb-3 right-0',
    }

    const canPlaceInPreferred = {
      left: canPlaceLeft,
      right: canPlaceRight,
      top: canPlaceTop,
      bottom: canPlaceBottom,
    }

    if (!canPlaceInPreferred[position as keyof typeof canPlaceInPreferred]) {
      return fallbackStrategies[position as keyof typeof fallbackStrategies]()
    }

    if ((position === 'top' || position === 'bottom') && !canCenterHorizontally) {
      const positionClass = position === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'
      return centerX < tooltipHalfWidth ? `${positionClass} left-0` : `${positionClass} right-0`
    }

    const defaultPositions = {
      top: 'bottom-full mb-3 left-1/2 transform -translate-x-1/2',
      bottom: 'top-full mt-3 left-1/2 transform -translate-x-1/2',
      left: 'right-full mr-3 top-1/2 transform -translate-y-1/2',
      right: 'left-full ml-3 top-1/2 transform -translate-y-1/2',
    }

    return defaultPositions[position as keyof typeof defaultPositions] || defaultPositions.bottom
  }

  const calculateArrowPosition = (rect: DOMRect, position: string, stepId: string): string => {
    if (stepId === 'canvas') {
      return 'hidden'
    }

    const { canPlaceLeft, canPlaceRight, canPlaceTop, canPlaceBottom, canCenterHorizontally } = getBoundaryCheck(rect)

    const borderStyles = {
      leftToRight: 'border-b border-l',
      rightToLeft: 'border-t border-r',
      topToBottom: 'border-b border-r',
      bottomToTop: 'border-t border-l',
    }

    if (position === 'left' && !canPlaceLeft) {
      return canPlaceRight
        ? `right-full -mr-1 top-1/2 transform -translate-y-1/2 ${borderStyles.leftToRight}`
        : `top-full -mt-1 ${borderStyles.topToBottom}`
    }

    if (position === 'right' && !canPlaceRight) {
      return canPlaceLeft
        ? `left-full -ml-1 top-1/2 transform -translate-y-1/2 ${borderStyles.rightToLeft}`
        : `top-full -mt-1 ${borderStyles.topToBottom}`
    }

    if (position === 'top' && !canPlaceTop) {
      return canCenterHorizontally
        ? `bottom-full -mb-1 left-1/2 transform -translate-x-1/2 ${borderStyles.bottomToTop}`
        : `bottom-full -mb-1 left-4 ${borderStyles.bottomToTop}`
    }

    if (position === 'bottom' && !canPlaceBottom) {
      return canCenterHorizontally
        ? `top-full -mt-1 left-1/2 transform -translate-x-1/2 ${borderStyles.topToBottom}`
        : `top-full -mt-1 left-4 ${borderStyles.topToBottom}`
    }

    if ((position === 'top' || position === 'bottom') && !canCenterHorizontally) {
      const borderClass = position === 'top' ? borderStyles.topToBottom : borderStyles.bottomToTop
      const positionClass = position === 'top' ? 'top-full -mt-1' : 'bottom-full -mb-1'
      return `${positionClass} left-4 ${borderClass}`
    }

    const defaultArrowPositions = {
      top: `top-full -mt-1 left-1/2 transform -translate-x-1/2 ${borderStyles.topToBottom}`,
      bottom: `bottom-full -mb-1 left-1/2 transform -translate-x-1/2 ${borderStyles.bottomToTop}`,
      left: `left-full -ml-1 top-1/2 transform -translate-y-1/2 ${borderStyles.rightToLeft}`,
      right: `right-full -mr-1 top-1/2 transform -translate-y-1/2 ${borderStyles.leftToRight}`,
    }

    return defaultArrowPositions[position as keyof typeof defaultArrowPositions] || defaultArrowPositions.bottom
  }

  const elementRect = useMemo(() => {
    return targetElement?.getBoundingClientRect()
  }, [targetElement, currentStep])

  const { tooltipPosition, arrowPosition } = useMemo(() => {
    if (!elementRect)
      return { tooltipPosition: '', arrowPosition: '' }

    return {
      tooltipPosition: calculateTooltipPosition(elementRect, currentTourStep.position, currentTourStep.id),
      arrowPosition: calculateArrowPosition(elementRect, currentTourStep.position, currentTourStep.id),
    }
  }, [elementRect, currentTourStep.position, currentTourStep.id])

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

  if (isWelcomeStep) {
    return (
      <Dialog open={isOpen} onOpenChange={handleSkip}>
        <DialogContent className="bg-background border-border text-foreground max-w-lg sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              {currentTourStep.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
              {currentTourStep.content}
            </DialogDescription>
          </DialogHeader>

          <ProgressBar />

          <DialogFooter>
            <div className="flex justify-between items-center w-full gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground flex-shrink-0 cursor-pointer"
              >
                {t('builder.components.onboardingTour.buttons.skip')}
              </Button>

              <Button
                size="sm"
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 cursor-pointer"
              >
                {t('builder.components.onboardingTour.buttons.next')}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  if (!targetElement || !elementRect)
    return null

  return (
    <>
      {currentTourStep.spotlight !== false && (
        <div
          className="fixed z-[9999] border-4 border-primary/30 rounded-lg pointer-events-none transition-all duration-300"
          style={(() => {
            if (currentTourStep.id === 'canvas' || currentTourStep.id === 'toolbar') {
              return {
                left: elementRect.left,
                top: elementRect.top,
                width: elementRect.width,
                height: elementRect.height,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.8)',
              }
            }

            const left = Math.max(0, elementRect.left - TOOLTIP_CONFIG.PADDING)
            const top = Math.max(0, elementRect.top - TOOLTIP_CONFIG.PADDING)
            const right = Math.min(window.innerWidth, elementRect.right + TOOLTIP_CONFIG.PADDING)
            const bottom = Math.min(window.innerHeight, elementRect.bottom + TOOLTIP_CONFIG.PADDING)

            return {
              left,
              top,
              width: right - left,
              height: bottom - top,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.8)',
            }
          })()}
        />
      )}

      <div
        className="fixed z-[10000] pointer-events-none"
        style={{
          left: elementRect.left,
          top: elementRect.top,
          width: elementRect.width,
          height: elementRect.height,
        }}
      >
        <div className={`absolute bg-background border border-border text-foreground p-4 w-80 max-w-[90vw] rounded-lg shadow-xl pointer-events-auto ${tooltipPosition}`}>
          {/* Arrow */}
          <div className={`absolute w-2 h-2 bg-background border-border transform rotate-45 ${arrowPosition}`} />

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1 break-words">
                {currentTourStep.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed break-words">
                {currentTourStep.content}
              </p>
            </div>

            <ProgressBar variant="compact" />

            <div className="flex justify-between items-center pt-1 gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground text-xs h-7 px-2 flex-shrink-0 cursor-pointer"
              >
                {t('builder.components.onboardingTour.buttons.skip')}
              </Button>

              <div className="flex gap-1 flex-shrink-0">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    className="text-xs h-7 px-2 cursor-pointer"
                  >
                    {t('builder.components.onboardingTour.buttons.back')}
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-7 px-2 cursor-pointer"
                >
                  {isLastStep ? t('builder.components.onboardingTour.buttons.done') : t('builder.components.onboardingTour.buttons.next')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
