'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Brain, CheckCircle, ChevronLeft, ChevronRight, Lightbulb, Loader2, MessageSquare, Sparkles, Wand2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface ExtractedBlock {
  type: string
  content: string
  confidence: number
  reasoning: string
}

interface SuggestedEnhancement {
  type: string
  reason: string
  impact: 'high' | 'medium' | 'low'
}

interface AnalysisResponse {
  extractedBlocks: ExtractedBlock[]
  suggestedEnhancements: SuggestedEnhancement[]
  missingEssentials: string[]
  detectedIntent: string
}

interface PromptAnalyzerProps {
  onAnalysisComplete: (blocks: ExtractedBlock[], enhancements: SuggestedEnhancement[], userQuery?: string) => void
  onSwitchToAdvanced: () => void
}

export function PromptAnalyzer({ onAnalysisComplete, onSwitchToAdvanced }: PromptAnalyzerProps) {
  const { t } = useTranslation()
  const [userPrompt, setUserPrompt] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedBlocks, setSelectedBlocks] = useState<Set<string>>(new Set())
  const [selectedEnhancements, setSelectedEnhancements] = useState<Set<string>>(new Set())

  // Carousel state
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
  const allExamples = ['learning', 'work', 'writing', 'personal', 'research', 'business', 'creative', 'data', 'marketing', 'legal', 'health', 'finance']
  const itemsToShow = 3
  const totalSlides = Math.ceil(allExamples.length / itemsToShow)

  // Auto carousel effect
  useEffect(() => {
    if (!analysis) {
      const interval = setInterval(() => {
        setCurrentExampleIndex(prev => (prev + 1) % totalSlides)
      }, 4000) // Change every 4 seconds

      return () => clearInterval(interval)
    }
  }, [analysis, totalSlides])

  const getBlockTypeLabel = (blockType: string): string => {
    const camelCase = blockType.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    return t(`builder.components.blockPicker.blocks.${camelCase}.label`, { defaultValue: blockType })
  }

  const getCurrentExamples = () => {
    const startIndex = currentExampleIndex * itemsToShow
    return allExamples.slice(startIndex, startIndex + itemsToShow)
  }

  const handlePrevious = () => {
    setCurrentExampleIndex(prev => (prev - 1 + totalSlides) % totalSlides)
  }

  const handleNext = () => {
    setCurrentExampleIndex(prev => (prev + 1) % totalSlides)
  }

  const handleExampleClick = (exampleText: string) => {
    setUserPrompt(exampleText)
    setAnalysis(null)
  }

  const handleAnalyze = async () => {
    if (!userPrompt.trim()) {
      toast.error(t('builder.analyzer.errors.emptyPrompt'))
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userPrompt: userPrompt.trim() }),
      })

      if (!response.ok) {
        throw new Error(t('builder.analyzer.errors.analysisFailed'))
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || t('builder.analyzer.errors.analysisFailed'))
      }

      setAnalysis(data.analysis)
      setSelectedBlocks(new Set(data.analysis.extractedBlocks.map((block: ExtractedBlock) => block.type)))
    }
    catch (error) {
      console.error('Error analyzing prompt:', error)
      toast.error(error instanceof Error ? error.message : t('builder.analyzer.errors.analysisFailed'))
    }
    finally {
      setIsAnalyzing(false)
    }
  }

  const handleBlockToggle = (blockType: string) => {
    setSelectedBlocks((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(blockType)) {
        newSet.delete(blockType)
      }
      else {
        newSet.add(blockType)
      }
      return newSet
    })
  }

  const handleEnhancementToggle = (enhancementType: string) => {
    setSelectedEnhancements((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(enhancementType)) {
        newSet.delete(enhancementType)
      }
      else {
        newSet.add(enhancementType)
      }
      return newSet
    })
  }

  const handleAcceptBlocks = () => {
    if (!analysis)
      return

    const selectedBlocksData = analysis.extractedBlocks.filter(block =>
      selectedBlocks.has(block.type),
    )

    const selectedEnhancementsData = analysis.suggestedEnhancements.filter(enhancement =>
      selectedEnhancements.has(enhancement.type),
    )

    onAnalysisComplete(selectedBlocksData, selectedEnhancementsData, userPrompt)
  }

  const canProceed = analysis && (selectedBlocks.size > 0 || selectedEnhancements.size > 0)

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t('builder.analyzer.title')}</h2>
            <p className="text-muted-foreground mt-1">{t('builder.analyzer.subtitle')}</p>
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

        {/* Step Indicator */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`flex items-center gap-2 ${!analysis ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!analysis ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              1
            </div>
            <span className="text-sm font-medium">{t('builder.analyzer.steps.describe')}</span>
          </div>
          <div className="flex-1 h-px bg-border" />
          <div className={`flex items-center gap-2 ${analysis ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${analysis ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
            <span className="text-sm font-medium">{t('builder.analyzer.steps.confirm')}</span>
          </div>
        </div>
      </div>

      {!analysis
        ? (
          /* Input Stage */
            <div className="space-y-6">
              {/* Input Area */}
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
                    onChange={e => setUserPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        if (userPrompt.trim() && !isAnalyzing) {
                          handleAnalyze()
                        }
                      }
                    }}
                    placeholder={t('builder.analyzer.input.placeholder')}
                    className="min-h-[120px] max-h-[300px] resize-none overflow-y-auto scrollbar"
                    disabled={isAnalyzing}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {t('builder.analyzer.input.characterLimit', { count: userPrompt.length })}
                    </span>
                    <Button
                      variant="outline"
                      onClick={handleAnalyze}
                      disabled={!userPrompt.trim() || isAnalyzing}
                      className="cursor-pointer"
                    >
                      {isAnalyzing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {isAnalyzing ? t('builder.analyzer.input.analyzing') : t('builder.analyzer.input.analyze')}
                      {!isAnalyzing && <ArrowRight className="h-4 w-4 ml-2" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Examples */}
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
                        onClick={handlePrevious}
                        disabled={isAnalyzing}
                        className="h-8 w-8 p-0 cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {currentExampleIndex + 1}
                        {' '}
                        /
                        {totalSlides}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleNext}
                        disabled={isAnalyzing}
                        className="h-8 w-8 p-0 cursor-pointer"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-visible py-2">
                    <div
                      className="grid grid-cols-1 md:grid-cols-3 gap-3 transition-all duration-500 ease-in-out"
                      style={{ transform: `translateX(0%)` }}
                    >
                      {getCurrentExamples().map((category, _index) => (
                        <Button
                          key={`${category}-${currentExampleIndex}`}
                          variant="outline"
                          onClick={() => handleExampleClick(t(`builder.analyzer.examples.${category}.text`))}
                          className="h-auto p-4 text-left justify-start cursor-pointer transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:shadow-lg hover:-translate-y-1 hover:z-10 relative"
                          disabled={isAnalyzing}
                        >
                          <div>
                            <div className="font-medium text-sm mb-1">
                              {t(`builder.analyzer.examples.${category}.title`)}
                            </div>
                            <div className="text-xs text-muted-foreground overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                              {t(`builder.analyzer.examples.${category}.text`)}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center mt-4 gap-2">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentExampleIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors duration-200 cursor-pointer ${
                          index === currentExampleIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                        }`}
                        disabled={isAnalyzing}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        : (
          /* Analysis Results */
            <div className="space-y-6">
              {/* Intent Detection */}
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

              {/* Extracted Blocks */}
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
                        <div
                          key={index}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedBlocks.has(block.type)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:bg-muted/50'
                          }`}
                          onClick={() => handleBlockToggle(block.type)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                  selectedBlocks.has(block.type)
                                    ? 'border-primary bg-primary'
                                    : 'border-muted-foreground'
                                }`}
                                >
                                  {selectedBlocks.has(block.type) && (
                                    <CheckCircle className="h-3 w-3 text-primary-foreground" />
                                  )}
                                </div>
                                <span className="font-medium">
                                  {getBlockTypeLabel(block.type)}
                                </span>
                                <span className="text-xs bg-muted px-2 py-1 rounded">
                                  {t('builder.analyzer.results.confidence', { percent: Math.round(block.confidence * 100) })}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {block.content}
                              </p>
                              <p className="text-xs text-muted-foreground italic">
                                {t('builder.analyzer.results.reasoning', { reason: block.reasoning })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Suggested Enhancements */}
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
                        <div
                          key={index}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedEnhancements.has(enhancement.type)
                              ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                              : 'border-border hover:bg-muted/50'
                          }`}
                          onClick={() => handleEnhancementToggle(enhancement.type)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                selectedEnhancements.has(enhancement.type)
                                  ? 'border-yellow-500 bg-yellow-500'
                                  : 'border-muted-foreground'
                              }`}
                              >
                                {selectedEnhancements.has(enhancement.type) && (
                                  <CheckCircle className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <span className="font-medium">
                                {getBlockTypeLabel(enhancement.type)}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                enhancement.impact === 'high'
                                  ? 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-300'
                                  : enhancement.impact === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-300'
                                    : 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-300'
                              }`}
                              >
                                {enhancement.impact === 'high' ? t('builder.analyzer.results.impact.high') : enhancement.impact === 'medium' ? t('builder.analyzer.results.impact.medium') : t('builder.analyzer.results.impact.low')}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {enhancement.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAnalysis(null)
                    setSelectedBlocks(new Set())
                    setSelectedEnhancements(new Set())
                  }}
                  className="cursor-pointer"
                >
                  {t('builder.analyzer.results.reanalyze')}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAcceptBlocks}
                  disabled={!canProceed}
                  className="cursor-pointer"
                >
                  {t('builder.analyzer.results.confirm')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
    </div>
  )
}
