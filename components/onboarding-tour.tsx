'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
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
        <DialogContent className="bg-background border-border text-foreground max-w-lg sm:max-w-xl">
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
              <span className="whitespace-nowrap">
                {t('builder.components.onboardingTour.progress.step')}
                {currentStep + 1}
                {t('builder.components.onboardingTour.progress.of')}
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
          left: targetElement.getBoundingClientRect().left,
          top: targetElement.getBoundingClientRect().top,
          width: targetElement.getBoundingClientRect().width,
          height: targetElement.getBoundingClientRect().height,
        }}
      >
        <div
          className={`absolute bg-background border border-border text-foreground p-4 w-80 max-w-[90vw] rounded-lg shadow-xl pointer-events-auto ${
            (() => {
              // 画布特殊处理：显示在画布内部的固定位置
              if (currentTourStep.id === 'canvas') {
                return 'top-4 left-4'
              }

              const rect = targetElement.getBoundingClientRect()
              const tooltipWidth = 320 // w-80 = 320px
              const tooltipHeight = 200 // 估计高度
              const margin = 12 // mb-3/mt-3 = 12px

              // 检查各方向是否有足够空间
              const canPlaceLeft = rect.left - tooltipWidth - margin >= 0
              const canPlaceRight = rect.right + tooltipWidth + margin <= window.innerWidth
              const canPlaceTop = rect.top - tooltipHeight - margin >= 0
              const canPlaceBottom = rect.bottom + tooltipHeight + margin <= window.innerHeight

              // 检查水平居中时是否会超出边界
              const centerX = rect.left + rect.width / 2
              const tooltipHalfWidth = tooltipWidth / 2
              const canCenterHorizontally = centerX - tooltipHalfWidth >= 0 && centerX + tooltipHalfWidth <= window.innerWidth

              // 根据原始位置和边界条件调整
              if (currentTourStep.position === 'left' && !canPlaceLeft) {
                return canPlaceRight
                  ? 'left-full ml-3 top-1/2 transform -translate-y-1/2'
                  : canPlaceBottom && canCenterHorizontally
                    ? 'top-full mt-3 left-1/2 transform -translate-x-1/2'
                    : 'top-full mt-3 left-0'
              }
              else if (currentTourStep.position === 'right' && !canPlaceRight) {
                return canPlaceLeft
                  ? 'right-full mr-3 top-1/2 transform -translate-y-1/2'
                  : canPlaceBottom && canCenterHorizontally
                    ? 'top-full mt-3 left-1/2 transform -translate-x-1/2'
                    : 'top-full mt-3 right-0'
              }
              else if (currentTourStep.position === 'top' && !canPlaceTop) {
                return canCenterHorizontally
                  ? 'top-full mt-3 left-1/2 transform -translate-x-1/2'
                  : centerX < tooltipHalfWidth
                    ? 'top-full mt-3 left-0'
                    : 'top-full mt-3 right-0'
              }
              else if (currentTourStep.position === 'bottom' && !canPlaceBottom) {
                return canCenterHorizontally
                  ? 'bottom-full mb-3 left-1/2 transform -translate-x-1/2'
                  : centerX < tooltipHalfWidth
                    ? 'bottom-full mb-3 left-0'
                    : 'bottom-full mb-3 right-0'
              }

              // 使用原始位置，但检查水平居中
              if ((currentTourStep.position === 'top' || currentTourStep.position === 'bottom') && !canCenterHorizontally) {
                const positionClass = currentTourStep.position === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'
                return centerX < tooltipHalfWidth
                  ? `${positionClass} left-0`
                  : `${positionClass} right-0`
              }

              // 使用原始位置
              return currentTourStep.position === 'top'
                ? 'bottom-full mb-3 left-1/2 transform -translate-x-1/2'
                : currentTourStep.position === 'bottom'
                  ? 'top-full mt-3 left-1/2 transform -translate-x-1/2'
                  : currentTourStep.position === 'left'
                    ? 'right-full mr-3 top-1/2 transform -translate-y-1/2'
                    : currentTourStep.position === 'right'
                      ? 'left-full ml-3 top-1/2 transform -translate-y-1/2'
                      : 'bottom-full mb-3 left-1/2 transform -translate-x-1/2'
            })()
          }`}
        >
          {/* Arrow */}
          <div
            className={`absolute w-2 h-2 bg-background border-border transform rotate-45 ${
              (() => {
                // 画布特殊处理：隐藏箭头或显示在合适位置
                if (currentTourStep.id === 'canvas') {
                  return 'hidden' // 画布tooltip不需要箭头
                }

                const rect = targetElement.getBoundingClientRect()
                const tooltipWidth = 320
                const tooltipHeight = 200
                const margin = 12

                const canPlaceLeft = rect.left - tooltipWidth - margin >= 0
                const canPlaceRight = rect.right + tooltipWidth + margin <= window.innerWidth
                const canPlaceTop = rect.top - tooltipHeight - margin >= 0
                const canPlaceBottom = rect.bottom + tooltipHeight + margin <= window.innerHeight

                const centerX = rect.left + rect.width / 2
                const tooltipHalfWidth = tooltipWidth / 2
                const canCenterHorizontally = centerX - tooltipHalfWidth >= 0 && centerX + tooltipHalfWidth <= window.innerWidth

                // 确定实际位置和箭头位置
                if (currentTourStep.position === 'left' && !canPlaceLeft) {
                  if (canPlaceRight) {
                    return 'right-full -mr-1 top-1/2 transform -translate-y-1/2 border-b border-l'
                  }
                  else {
                    return `top-full -mt-1 border-b border-r`
                  }
                }
                else if (currentTourStep.position === 'right' && !canPlaceRight) {
                  if (canPlaceLeft) {
                    return 'left-full -ml-1 top-1/2 transform -translate-y-1/2 border-t border-r'
                  }
                  else {
                    return `top-full -mt-1 border-b border-r`
                  }
                }
                else if (currentTourStep.position === 'top' && !canPlaceTop) {
                  return canCenterHorizontally
                    ? 'bottom-full -mb-1 left-1/2 transform -translate-x-1/2 border-t border-l'
                    : 'bottom-full -mb-1 left-4 border-t border-l'
                }
                else if (currentTourStep.position === 'bottom' && !canPlaceBottom) {
                  return canCenterHorizontally
                    ? 'top-full -mt-1 left-1/2 transform -translate-x-1/2 border-b border-r'
                    : 'top-full -mt-1 left-4 border-b border-r'
                }

                // 原始位置但检查水平居中
                if ((currentTourStep.position === 'top' || currentTourStep.position === 'bottom') && !canCenterHorizontally) {
                  const borderClass = currentTourStep.position === 'top' ? 'border-b border-r' : 'border-t border-l'
                  const positionClass = currentTourStep.position === 'top' ? 'top-full -mt-1' : 'bottom-full -mb-1'
                  return `${positionClass} left-4 ${borderClass}`
                }

                // 使用原始位置
                return currentTourStep.position === 'top'
                  ? 'top-full -mt-1 left-1/2 transform -translate-x-1/2 border-b border-r'
                  : currentTourStep.position === 'bottom'
                    ? 'bottom-full -mb-1 left-1/2 transform -translate-x-1/2 border-t border-l'
                    : currentTourStep.position === 'left'
                      ? 'left-full -ml-1 top-1/2 transform -translate-y-1/2 border-t border-r'
                      : currentTourStep.position === 'right'
                        ? 'right-full -mr-1 top-1/2 transform -translate-y-1/2 border-b border-l'
                        : 'top-full -mt-1 left-1/2 transform -translate-x-1/2 border-b border-r'
              })()
            }`}
          />

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1 break-words">
                {currentTourStep.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed break-words">
                {currentTourStep.content}
              </p>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span className="whitespace-nowrap">
                  {t('builder.components.onboardingTour.progress.step')}
                  {currentStep + 1}
                  {t('builder.components.onboardingTour.progress.of')}
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
