import type { AnalysisState, ExtractedBlock, SuggestedEnhancement } from '@/types/builder'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ANALYSIS_CONFIG } from '../constants'

export function useAnalysis(userPrompt: string) {
  const [state, setState] = useState<AnalysisState>({
    analysis: null,
    isAnalyzing: false,
    analysisProgress: 0,
    selectedBlocks: new Set(),
    selectedEnhancements: new Set(),
  })

  const progressTimeoutsRef = useRef<NodeJS.Timeout[]>([])
  const { t } = useTranslation()

  const simulateProgress = useCallback(() => {
    setState(prev => ({ ...prev, analysisProgress: 0 }))

    progressTimeoutsRef.current.forEach(timeout => clearTimeout(timeout))
    progressTimeoutsRef.current = []

    ANALYSIS_CONFIG.PROGRESS_STEPS.forEach(({ progress, delay }) => {
      const timeout = setTimeout(() => {
        setState(prev => ({ ...prev, analysisProgress: progress }))
      }, delay)
      progressTimeoutsRef.current.push(timeout)
    })
  }, [])

  const analyzePrompt = useCallback(async () => {
    if (!userPrompt.trim()) {
      toast.error(t('builder.analyzer.errors.emptyPrompt'))
      return
    }

    setState(prev => ({ ...prev, isAnalyzing: true }))
    simulateProgress()

    try {
      const response = await fetch('/api/analyze-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: userPrompt.trim() }),
      })

      if (!response.ok) {
        throw new Error(t('builder.analyzer.errors.analysisFailed'))
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || t('builder.analyzer.errors.analysisFailed'))
      }

      setState(prev => ({ ...prev, analysisProgress: 100 }))

      setTimeout(() => {
        setState(prev => ({
          ...prev,
          analysis: data.analysis,
          selectedBlocks: new Set(data.analysis.extractedBlocks.map((block: ExtractedBlock) => block.type)),
          selectedEnhancements: new Set(data.analysis.suggestedEnhancements.map((enhancement: SuggestedEnhancement) => enhancement.type)),
          isAnalyzing: false,
          analysisProgress: 0,
        }))
      }, ANALYSIS_CONFIG.FINAL_PROGRESS_DELAY)
    }
    catch (error) {
      console.error('Error analyzing prompt:', error)
      toast.error(error instanceof Error ? error.message : t('builder.analyzer.errors.analysisFailed'))

      // Clear all progress timeouts on error
      progressTimeoutsRef.current.forEach(timeout => clearTimeout(timeout))
      progressTimeoutsRef.current = []

      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        analysisProgress: 0,
      }))
    }
  }, [userPrompt, simulateProgress, t])

  const resetAnalysis = useCallback(() => {
    progressTimeoutsRef.current.forEach(timeout => clearTimeout(timeout))
    progressTimeoutsRef.current = []

    setState({
      analysis: null,
      isAnalyzing: false,
      analysisProgress: 0,
      selectedBlocks: new Set(),
      selectedEnhancements: new Set(),
    })
  }, [])

  const toggleBlockSelection = useCallback((blockType: string) => {
    setState(prev => ({
      ...prev,
      selectedBlocks: new Set(
        prev.selectedBlocks.has(blockType)
          ? [...prev.selectedBlocks].filter(type => type !== blockType)
          : [...prev.selectedBlocks, blockType],
      ),
    }))
  }, [])

  const toggleEnhancementSelection = useCallback((enhancementType: string) => {
    setState(prev => ({
      ...prev,
      selectedEnhancements: new Set(
        prev.selectedEnhancements.has(enhancementType)
          ? [...prev.selectedEnhancements].filter(type => type !== enhancementType)
          : [...prev.selectedEnhancements, enhancementType],
      ),
    }))
  }, [])

  useEffect(() => {
    return () => {
      progressTimeoutsRef.current.forEach(timeout => clearTimeout(timeout))
    }
  }, [])

  return {
    ...state,
    analyzePrompt,
    resetAnalysis,
    toggleBlockSelection,
    toggleEnhancementSelection,
  }
}
