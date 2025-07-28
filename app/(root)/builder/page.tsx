'use client'

import type { ExtractedBlock, SuggestedEnhancement } from '@/types/builder'
import { useAppSettings } from '@/components/common/app-settings-context'
import { FlowCanvas } from '@/components/flow-canvas'
import { HelpPanel } from '@/components/help-panel'
import { OnboardingTour } from '@/components/onboarding-tour'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useBuilderStore } from '@/store/builder'
import * as Sentry from '@sentry/nextjs'
import { ArrowLeft, HelpCircle, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { PromptAnalyzer } from './_components/prompt-analyzer'
import { PromptPreview } from './_components/prompt-preview'

// Interface mode include advanced, analyze
type InterfaceMode = 'advanced' | 'analyze'

function BuilderContent() {
  const { t } = useTranslation()
  const router = useRouter()
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
  const saveDraft = useBuilderStore(state => state.saveDraft)
  const hasPendingChanges = useBuilderStore(state => state.hasPendingChanges)

  const [previewWidth, setPreviewWidth] = useState(320)
  const [isDragging, setIsDragging] = useState(false)
  const [showHelpPanel, setShowHelpPanel] = useState(false)
  const [showOnboardingTour, setShowOnboardingTour] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveDialogAction, setSaveDialogAction] = useState<'back' | 'analyze'>('back')
  const [isExistingContent, setIsExistingContent] = useState(false)

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

  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'session',
      message: 'Builder session started',
      level: 'info',
      data: {
        mode: interfaceMode,
        hasTemplate: !!searchParams.get('template'),
        hasInstruction: !!searchParams.get('instruction'),
      },
    })
  }, [])

  const handleSwitchToAdvanced = () => {
    Sentry.addBreadcrumb({
      category: 'user-action',
      message: 'Switched to advanced mode',
      level: 'info',
    })
    setInterfaceMode('advanced')
  }

  /**
   * Handle analysis complete callback
   * @param blocks - Blocks to apply analysis results to
   * @param enhancements - Enhancements to apply analysis results to
   * @param userQuery - User query to apply analysis results to
   * @returns void
   */
  const handleAnalysisComplete = useCallback((blocks: ExtractedBlock[], enhancements: SuggestedEnhancement[], userQuery?: string) => {
    const startTime = performance.now()
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

    const endTime = performance.now()
    Sentry.captureMessage('Analysis Complete', {
      level: 'info',
      extra: {
        processingTime: endTime - startTime,
        blocksCount: blocks.length,
        enhancementsCount: enhancements.length,
        hasUserQuery: !!userQuery,
      },
    })
  }, [])

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newWidth = window.innerWidth - e.clientX
      setPreviewWidth(Math.max(280, Math.min(600, newWidth)))
    }
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        Sentry.addBreadcrumb({
          category: 'user-action',
          message: e.shiftKey ? 'Redo operation' : 'Undo operation',
          level: 'info',
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const templateId = searchParams.get('template')
    const instructionId = searchParams.get('instruction')

    // Set isExistingContent based on whether we're editing an instruction or using a template
    setIsExistingContent(!!templateId || !!instructionId)

    if (templateId) {
      const startTime = performance.now()
      fetch(`/api/templates/${templateId}`)
        .then(res => res.json())
        .then((template) => {
          if (template) {
            setTitle(template.title)
            setDescription(template.description)

            if (template.flowData) {
              importFlowData(template.flowData)
            }

            const endTime = performance.now()
            Sentry.captureMessage('Template Load Performance', {
              level: 'info',
              extra: {
                templateId,
                loadTime: endTime - startTime,
                hasFlowData: !!template.flowData,
              },
            })
          }
        })
        .catch((error) => {
          Sentry.captureException(error, {
            extra: {
              templateId,
              action: 'load_template',
            },
          })
          console.error(error)
        })
    }
    else if (instructionId) {
      const startTime = performance.now()
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

            const endTime = performance.now()
            Sentry.captureMessage('Instruction Load Performance', {
              level: 'info',
              extra: {
                instructionId,
                loadTime: endTime - startTime,
                hasFlowData: !!instruction.flowData,
              },
            })
          }
        })
        .catch((error) => {
          Sentry.captureException(error, {
            extra: {
              instructionId,
              action: 'load_instruction',
            },
          })
          console.error(error)
        })
    }
    else {
      // No query parameters, reset to fresh state
      resetFlow()
    }
  }, [searchParams, importFlowData, setTitle, setDescription, resetFlow])

  // Auto-save when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = async (_e: BeforeUnloadEvent) => {
      if (hasPendingChanges() && !isExistingContent) {
        await saveDraft()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasPendingChanges, saveDraft, isExistingContent])

  // Auto-save when navigating away
  useEffect(() => {
    if (hasPendingChanges() && !isExistingContent) {
      window.onbeforeunload = () => ''
    }
    else {
      window.onbeforeunload = null
    }
  }, [hasPendingChanges, isExistingContent])

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (hasPendingChanges() && !isExistingContent) {
      setSaveDialogAction('back')
      setShowSaveDialog(true)
    }
    else {
      router.back()
    }
  }

  const handleSaveAndExit = async () => {
    const startTime = performance.now()
    try {
      await saveDraft()
      const endTime = performance.now()

      Sentry.captureMessage('Draft Save Performance', {
        level: 'info',
        extra: {
          saveTime: endTime - startTime,
          action: saveDialogAction,
        },
      })

      toast.success(t('builder.draftTipDescription'))
      setShowSaveDialog(false)

      if (saveDialogAction === 'back') {
        router.back()
      }
      else {
        setInterfaceMode('analyze')
      }
    }
    catch (error) {
      Sentry.captureException(error, {
        extra: {
          action: 'save_draft',
          saveDialogAction,
        },
      })
    }
  }

  const handleDiscardAndExit = () => {
    setShowSaveDialog(false)

    if (saveDialogAction === 'back') {
      router.back()
    }
    else {
      setInterfaceMode('analyze')
    }
  }

  const handleSmartAnalysisClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (hasPendingChanges() && !isExistingContent) {
      setSaveDialogAction('analyze')
      setShowSaveDialog(true)
    }
    else {
      setInterfaceMode('analyze')
    }
  }

  const { siteName } = useAppSettings()

  // analyze mode show prompt analyzer
  if (interfaceMode === 'analyze') {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
          <div className="flex items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted cursor-pointer"
              onClick={handleBackClick}
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-semibold">{siteName}</span>
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
            onClick={handleBackClick}
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

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSmartAnalysisClick}
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

      <HelpPanel
        isOpen={showHelpPanel}
        onClose={() => setShowHelpPanel(false)}
        onStartTour={() => {
          setShowHelpPanel(false)
          setShowOnboardingTour(true)
        }}
      />

      <OnboardingTour
        isOpen={showOnboardingTour}
        onClose={() => setShowOnboardingTour(false)}
        onComplete={() => {
          setShowOnboardingTour(false)
          localStorage.setItem('prohelen-tour-completed', 'true')
        }}
      />

      {showSaveDialog && (
        <Dialog open onOpenChange={() => setShowSaveDialog(false)}>
          <DialogContent className="bg-card border-border sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {t('builder.saveDialog.title')}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {t('builder.saveDialog.description')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="ghost"
                onClick={handleDiscardAndExit}
                className="w-full sm:w-auto cursor-pointer"
              >
                {t('builder.saveDialog.discard')}
              </Button>
              <Button
                variant="default"
                onClick={handleSaveAndExit}
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                {t('builder.saveDialog.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

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
