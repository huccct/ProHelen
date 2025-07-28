'use client'

import type { ExtractedBlock, SuggestedEnhancement } from '@/types/builder'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ANALYSIS_CONFIG, IMPACT_COLORS } from '@/lib/constants'
import { useAnalysis } from '@/lib/hooks/use-analysis'
import { useCarousel } from '@/lib/hooks/use-carousel'
import { useBuilderStore } from '@/store/builder'
import {
  ArrowRight,
  Brain,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Loader2,
  MessageSquare,
  Sparkles,
  Wand2,
} from 'lucide-react'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PromptAnalyzerProps {
  onAnalysisComplete: (blocks: ExtractedBlock[], enhancements: SuggestedEnhancement[], userQuery?: string) => void
  onSwitchToAdvanced: () => void
}

interface StepIndicatorProps {
  hasAnalysis: boolean
}

const StepIndicator = memo<StepIndicatorProps>(({ hasAnalysis }) => {
  const { t } = useTranslation()

  const steps = [
    { key: 'describe', active: !hasAnalysis },
    { key: 'confirm', active: hasAnalysis },
  ]

  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((step, index) => (
        <React.Fragment key={step.key}>
          <div className="flex items-center z-10 bg-background">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.active
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`text-sm font-medium ml-2 ${
                step.active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {t(`builder.analyzer.steps.${step.key}`)}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div className="flex-1 h-px bg-border mx-4" />
          )}
        </React.Fragment>
      ))}
    </div>
  )
})

StepIndicator.displayName = 'StepIndicator'

interface ExampleCardProps {
  category: string
  onClick: (text: string) => void
  disabled?: boolean
}

const ExampleCard = memo<ExampleCardProps>(({ category, onClick, disabled }) => {
  const { t } = useTranslation()

  const handleClick = useCallback(() => {
    onClick(t(`builder.analyzer.examples.${category}.text`))
  }, [category, onClick, t])

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={disabled}
      className="h-auto p-4 text-left justify-start cursor-pointer transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:shadow-lg hover:-translate-y-1 hover:z-10 relative"
    >
      <div>
        <div className="font-medium text-sm mb-1">
          {t(`builder.analyzer.examples.${category}.title`)}
        </div>
        <div
          className="text-xs text-muted-foreground overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {t(`builder.analyzer.examples.${category}.text`)}
        </div>
      </div>
    </Button>
  )
})

ExampleCard.displayName = 'ExampleCard'

interface CarouselProps {
  onExampleClick: (text: string) => void
  disabled?: boolean
}

const Carousel = memo<CarouselProps>(({ onExampleClick, disabled }) => {
  const { t } = useTranslation()
  const {
    currentIndex,
    totalSlides,
    getCurrentExamples,
    goToPrevious,
    goToNext,
    goToSlide,
    startAutoPlay,
    stopAutoPlay,
  } = useCarousel()

  useEffect(() => {
    if (!disabled) {
      startAutoPlay()
      return stopAutoPlay
    }
  }, [disabled, startAutoPlay, stopAutoPlay])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            {t('builder.analyzer.examples.title')}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              disabled={disabled}
              className="h-8 w-8 p-0 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1}
              {' '}
              /
              {totalSlides}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              disabled={disabled}
              className="h-8 w-8 p-0 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-visible py-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 transition-all duration-500 ease-in-out">
            {getCurrentExamples().map(category => (
              <ExampleCard
                key={`${category}-${currentIndex}`}
                category={category}
                onClick={onExampleClick}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={disabled}
              className={`w-2 h-2 rounded-full transition-colors duration-200 cursor-pointer ${
                index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
})

Carousel.displayName = 'Carousel'

interface AnalysisInputProps {
  userPrompt: string
  onPromptChange: (value: string) => void
  onAnalyze: () => void
  isAnalyzing: boolean
  analysisProgress: number
}

const AnalysisInput = memo<AnalysisInputProps>(({
  userPrompt,
  onPromptChange,
  onAnalyze,
  isAnalyzing,
  analysisProgress,
}) => {
  const { t } = useTranslation()

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (userPrompt.trim() && !isAnalyzing) {
        onAnalyze()
      }
    }
  }, [userPrompt, isAnalyzing, onAnalyze])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {t('builder.analyzer.input.title')}
        </CardTitle>
        <CardDescription>
          {t('builder.analyzer.input.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={userPrompt}
          onChange={e => onPromptChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('builder.analyzer.input.placeholder')}
          className={`min-h-[${ANALYSIS_CONFIG.TEXTAREA_MIN_HEIGHT}px] max-h-[${ANALYSIS_CONFIG.TEXTAREA_MAX_HEIGHT}px] resize-none overflow-y-auto scrollbar`}
          disabled={isAnalyzing}
        />

        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t('builder.analyzer.input.analyzing')}
              </span>
              <span className="text-primary font-medium">
                {analysisProgress}
                %
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end items-center">
          <Button
            variant="outline"
            onClick={onAnalyze}
            disabled={!userPrompt.trim() || isAnalyzing}
            className="cursor-pointer"
          >
            {isAnalyzing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isAnalyzing
              ? `${t('builder.analyzer.input.analyzing')} ${analysisProgress}%`
              : t('builder.analyzer.input.analyze')}
            {!isAnalyzing && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})

AnalysisInput.displayName = 'AnalysisInput'

interface SelectableItemProps {
  isSelected: boolean
  onToggle: () => void
  title: string
  content?: string
  confidence?: number
  reasoning?: string
  impact?: 'high' | 'medium' | 'low'
  reason?: string
  variant: 'block' | 'enhancement'
}

const SelectableItem = memo<SelectableItemProps>(({
  isSelected,
  onToggle,
  title,
  content,
  confidence,
  reasoning,
  impact,
  reason,
  variant,
}) => {
  const { t } = useTranslation()

  const borderColor = variant === 'block'
    ? (isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50')
    : (isSelected ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' : 'border-border hover:bg-muted/50')

  const checkboxColor = variant === 'block'
    ? (isSelected ? 'border-primary bg-primary' : 'border-muted-foreground')
    : (isSelected ? 'border-yellow-500 bg-yellow-500' : 'border-muted-foreground')

  const checkIconColor = variant === 'block' ? 'text-primary-foreground' : 'text-white'

  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all ${borderColor}`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${checkboxColor}`}>
              {isSelected && <CheckCircle className={`h-3 w-3 ${checkIconColor}`} />}
            </div>
            <span className="font-medium">{title}</span>

            {confidence && (
              <span className="text-xs bg-muted px-2 py-1 rounded">
                {t('builder.analyzer.results.confidence', { percent: Math.round(confidence * 100) })}
              </span>
            )}

            {impact && (
              <span className={`text-xs px-2 py-1 rounded ${IMPACT_COLORS[impact]}`}>
                {t(`builder.analyzer.results.impact.${impact}`)}
              </span>
            )}
          </div>

          {content && (
            <p className="text-sm text-muted-foreground mb-2">{content}</p>
          )}

          {reasoning && (
            <p className="text-xs text-muted-foreground italic">
              {t('builder.analyzer.results.reasoning', { reason: reasoning })}
            </p>
          )}

          {reason && (
            <p className="text-sm text-muted-foreground mt-2">{reason}</p>
          )}
        </div>
      </div>
    </div>
  )
})

SelectableItem.displayName = 'SelectableItem'

export const PromptAnalyzer = memo<PromptAnalyzerProps>(({
  onAnalysisComplete,
  onSwitchToAdvanced,
}) => {
  const { t } = useTranslation()
  const originalUserQuery = useBuilderStore(useCallback(state => state.originalUserQuery, []))
  const [userPrompt, setUserPrompt] = useState('')

  const {
    analysis,
    isAnalyzing,
    analysisProgress,
    selectedBlocks,
    selectedEnhancements,
    analyzePrompt,
    resetAnalysis,
    toggleBlockSelection,
    toggleEnhancementSelection,
  } = useAnalysis(userPrompt)

  const getBlockTypeLabel = useCallback((blockType: string): string => {
    const camelCase = blockType.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    return t(`builder.components.blockPicker.blocks.${camelCase}.label`, { defaultValue: blockType })
  }, [t])

  const canProceed = useMemo(() =>
    analysis && (selectedBlocks.size > 0 || selectedEnhancements.size > 0), [analysis, selectedBlocks.size, selectedEnhancements.size])

  const handleExampleClick = useCallback((text: string) => {
    setUserPrompt(text)
    resetAnalysis()
  }, [resetAnalysis])

  const handleAcceptBlocks = useCallback(() => {
    if (!analysis)
      return

    const selectedBlocksData = analysis.extractedBlocks.filter(block =>
      selectedBlocks.has(block.type),
    )

    const selectedEnhancementsData = analysis.suggestedEnhancements.filter(enhancement =>
      selectedEnhancements.has(enhancement.type),
    )

    onAnalysisComplete(selectedBlocksData, selectedEnhancementsData, userPrompt)
  }, [analysis, selectedBlocks, selectedEnhancements, userPrompt, onAnalysisComplete])

  useEffect(() => {
    if (originalUserQuery === '') {
      setUserPrompt('')
      resetAnalysis()
    }
  }, [originalUserQuery, resetAnalysis])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {t('builder.analyzer.title')}
            </h2>
            <p className="text-muted-foreground mt-1">
              {t('builder.analyzer.subtitle')}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={onSwitchToAdvanced}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Wand2 className="h-4 w-4" />
            {t('builder.analyzer.switchToAdvanced')}
          </Button>
        </div>

        <StepIndicator hasAnalysis={!!analysis} />
      </div>

      {!analysis
        ? (
            <div className="space-y-6">
              <AnalysisInput
                userPrompt={userPrompt}
                onPromptChange={setUserPrompt}
                onAnalyze={analyzePrompt}
                isAnalyzing={isAnalyzing}
                analysisProgress={analysisProgress}
              />

              <Carousel
                onExampleClick={handleExampleClick}
                disabled={isAnalyzing}
              />
            </div>
          )
        : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    {t('builder.analyzer.results.intent')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-foreground">{analysis.detectedIntent}</p>
                  </div>
                </CardContent>
              </Card>

              {analysis.extractedBlocks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      {t('builder.analyzer.results.extracted')}
                    </CardTitle>
                    <CardDescription>
                      {t('builder.analyzer.results.extractedDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.extractedBlocks.map((block, index) => (
                        <SelectableItem
                          key={index}
                          isSelected={selectedBlocks.has(block.type)}
                          onToggle={() => toggleBlockSelection(block.type)}
                          title={getBlockTypeLabel(block.type)}
                          content={block.content}
                          confidence={block.confidence}
                          reasoning={block.reasoning}
                          variant="block"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {analysis.suggestedEnhancements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-yellow-500" />
                      {t('builder.analyzer.results.suggested')}
                    </CardTitle>
                    <CardDescription>
                      {t('builder.analyzer.results.suggestedDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.suggestedEnhancements.map((enhancement, index) => (
                        <SelectableItem
                          key={index}
                          isSelected={selectedEnhancements.has(enhancement.type)}
                          onToggle={() => toggleEnhancementSelection(enhancement.type)}
                          title={getBlockTypeLabel(enhancement.type)}
                          impact={enhancement.impact}
                          reason={enhancement.reason}
                          variant="enhancement"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={resetAnalysis}
                  className="cursor-pointer"
                >
                  {t('builder.analyzer.results.reanalyze')}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAcceptBlocks}
                  disabled={!canProceed}
                  className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground"
                >
                  {t('builder.analyzer.results.confirm')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
    </div>
  )
})

PromptAnalyzer.displayName = 'PromptAnalyzer'
