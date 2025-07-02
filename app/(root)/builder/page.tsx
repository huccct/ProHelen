'use client'

import { FlowCanvas } from '@/components/flow-canvas'
import { HelpPanel } from '@/components/help-panel'
import { OnboardingTour } from '@/components/onboarding-tour'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useBuilderStore } from '@/store/builder'
import { ArrowLeft, HelpCircle, Zap } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PromptAnalyzer } from './_components/prompt-analyzer'
import { PromptPreview } from './_components/prompt-preview'

// Interface mode include advanced, analyze
type InterfaceMode = 'advanced' | 'analyze'

function BuilderContent() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const importFlowData = useBuilderStore(state => state.importFlowData)
  const title = useBuilderStore(state => state.title)
  const description = useBuilderStore(state => state.description)
  const setTitle = useBuilderStore(state => state.setTitle)
  const setDescription = useBuilderStore(state => state.setDescription)
  const resetFlow = useBuilderStore(state => state.resetFlow)
  const undo = useBuilderStore(state => state.undo)
  const redo = useBuilderStore(state => state.redo)
  const canUndo = useBuilderStore(state => state.canUndo)
  const canRedo = useBuilderStore(state => state.canRedo)
  const [previewWidth, setPreviewWidth] = useState(320)
  const [isDragging, setIsDragging] = useState(false)
  const [showHelpPanel, setShowHelpPanel] = useState(false)
  const [showOnboardingTour, setShowOnboardingTour] = useState(false)

  // init interface mode
  const [interfaceMode, setInterfaceMode] = useState<InterfaceMode>('analyze')

  useEffect(() => {
    const hasTemplate = searchParams.get('template')
    const hasInstruction = searchParams.get('instruction')

    // only use advanced mode when importing from template or instruction
    if (hasTemplate || hasInstruction) {
      setInterfaceMode('advanced')
    }
  }, [searchParams])

  const handleSwitchToAdvanced = () => {
    setInterfaceMode('advanced')
  }

  /**
   * Handle analysis complete callback
   * @param blocks - Blocks to apply analysis results to
   * @param enhancements - Enhancements to apply analysis results to
   * @param userQuery - User query to apply analysis results to
   * @returns void
   */
  const handleAnalysisComplete = useCallback((blocks: any[], enhancements: any[], userQuery?: string) => {
    const { applyAnalysisResults } = useBuilderStore.getState()

    applyAnalysisResults(blocks, enhancements, userQuery)

    const firstBlock = blocks.find(b => b.type === 'role_definition')
    if (firstBlock) {
      setTitle(firstBlock.content || t('builder.analyzer.defaults.defaultAssistantTitle'))
    }
    else {
      setTitle(t('builder.analyzer.defaults.defaultAssistantTitle'))
    }

    setDescription(t('builder.analyzer.defaults.generatedByAnalysis'))

    setInterfaceMode('advanced')
  }, [])

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newWidth = window.innerWidth - e.clientX
      setPreviewWidth(Math.max(280, Math.min(600, newWidth)))
    }
  }, [isDragging])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  useEffect(() => {
    const tourCompleted = localStorage.getItem('prohelen-tour-completed')
    const hasTemplate = searchParams.get('template')
    const hasInstruction = searchParams.get('instruction')

    // Show tour for new users who aren't importing something
    if (!tourCompleted && !hasTemplate && !hasInstruction) {
      setTimeout(() => setShowOnboardingTour(true), 1000)
    }
  }, [searchParams])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F1 for help
      if (e.key === 'F1') {
        e.preventDefault()
        setShowHelpPanel(true)
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        setShowHelpPanel(false)
        setShowOnboardingTour(false)
      }

      // Ctrl+Z for undo
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo()) {
          undo()
        }
      }

      // Ctrl+Y for redo (or Ctrl+Shift+Z)
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault()
        if (canRedo()) {
          redo()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo])

  useEffect(() => {
    const templateId = searchParams.get('template')
    const instructionId = searchParams.get('instruction')

    if (templateId) {
      fetch(`/api/templates/${templateId}`)
        .then(res => res.json())
        .then((template) => {
          if (template) {
            setTitle(template.title)
            setDescription(template.description)

            if (template.flowData) {
              importFlowData(template.flowData)
            }
          }
        })
        .catch(console.error)
    }
    else if (instructionId) {
      fetch(`/api/instructions/${instructionId}`)
        .then(res => res.json())
        .then((data) => {
          if (data.instruction) {
            const instruction = data.instruction
            setTitle(`${instruction.title}`)
            setDescription(instruction.description || '')

            if (instruction.flowData) {
              importFlowData(instruction.flowData)
            }
          }
        })
        .catch(console.error)
    }
    else {
      // No query parameters, reset to fresh state
      resetFlow()
    }
  }, [searchParams, importFlowData, setTitle, setDescription, resetFlow])

  // analyze mode show prompt analyzer
  if (interfaceMode === 'analyze') {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
          <div className="flex items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted cursor-pointer"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-semibold">ProHelen</span>
            </div>
            <div />
          </div>
        </div>
        <div className="pt-20">
          <PromptAnalyzer
            onAnalysisComplete={handleAnalysisComplete}
            onSwitchToAdvanced={handleSwitchToAdvanced}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen h-screen overflow-hidden bg-background">
      <div className="flex-none px-4 py-3 border-b border-border">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted cursor-pointer"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="h-6 w-px bg-border" />
          <div className="flex-1 min-w-0" data-tour="title-input">
            <input
              type="text"
              placeholder={t('builder.untitledInstruction')}
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="bg-transparent text-lg font-medium text-foreground border-none focus:outline-none w-full truncate"
            />
            <input
              type="text"
              placeholder={t('builder.addDescription')}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="bg-transparent text-sm text-muted-foreground border-none focus:outline-none w-full mt-0.5 truncate"
            />
          </div>

          {/* Mode Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInterfaceMode('analyze')}
                className="h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <Zap className="h-4 w-4 mr-1" />
                {t('builder.analyzer.title')}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('builder.analyzer.subtitle')}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelpPanel(true)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('builder.getHelp')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('builder.helpTip')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <FlowCanvas
          className="flex-1 h-full"
          onStartTour={() => setShowOnboardingTour(true)}
          onShowHelp={() => setShowHelpPanel(true)}
        />
        <div
          className="w-1 hover:w-2 bg-border cursor-col-resize transition-all hover:bg-border/80 active:bg-border/60"
          onMouseDown={handleMouseDown}
        />
        <PromptPreview
          className="overflow-y-hidden border-l border-border"
          style={{ width: previewWidth }}
          data-tour="preview-panel"
        />
      </div>

      {/* Help Panel */}
      <HelpPanel
        isOpen={showHelpPanel}
        onClose={() => setShowHelpPanel(false)}
        onStartTour={() => {
          setShowHelpPanel(false)
          setShowOnboardingTour(true)
        }}
      />

      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={showOnboardingTour}
        onClose={() => setShowOnboardingTour(false)}
        onComplete={() => {
          setShowOnboardingTour(false)
          localStorage.setItem('prohelen-tour-completed', 'true')
        }}
      />

    </div>
  )
}

export default function BuilderPage() {
  return (
    <Suspense>
      <BuilderContent />
    </Suspense>
  )
}
